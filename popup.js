$(document).ready(function() {
    initGrid();
    bindEvents();
});

let cropper = null;

// ================= 视图导航 =================
function switchView(viewId) {
    $('.view-container').removeClass('active');
    $('#' + viewId).addClass('active');
}

// ================= 事件绑定 =================
function bindEvents() {
    $('#btn-home-new').click(() => { clearAllInputs(); switchView('view-step1'); });
    $('#btn-home-edit').click(() => { loadData((exists) => { if(exists) switchView('view-step1'); else alert("无配置"); }); });
    $('#btn-home-clear').click(resetAllData);
    $('#back-to-home').click(() => switchView('view-home'));
    
    $('#goto-choice').click(() => {
        if(!$('#username').val() || !$('#password').val()) { alert("请填账号密码"); return; }
        switchView('view-choice');
    });

    $('#back-to-step1').click(() => switchView('view-step1'));
    $('#card-manual').click(() => switchView('view-matrix'));
    
    $('#card-ocr').click(() => {
        resetOCRView();
        switchView('view-ocr');
        $('#btn-select-file').click();
    });

    $('#back-to-choice').click(() => switchView('view-choice'));
    $('#btn-select-file').click(() => $('#file-input').click());
    $('#file-input').change(handleFileSelect);

    $('#btn-confirm-crop').click(startCropAndRecognize);

    $('#back-to-ocr').click(() => {
        $('#crop-container').show();
        $('#debug-preview-container').hide();
        $('#ocr-status').text('');
        switchView('view-ocr');
    });
    
    $('#btn-save-final').click(saveAllData);
    bindGridNavigation();
}

// ================= 裁剪逻辑 =================

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageElement = document.getElementById('image-to-crop');
        
        $('#crop-container').show();
        $('#btn-confirm-crop').show();
        $('#btn-select-file').hide();
        $('#crop-hint').show();
        $('#debug-preview-container').hide();
        $('#ocr-progress').hide();
        $('#ocr-status').text('');

        imageElement.onload = function() {
            cropper = new Cropper(imageElement, {
                viewMode: 1, 
                dragMode: 'move',
                autoCropArea: 0.95, 
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });
            imageElement.onload = null;
        };
        imageElement.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function resetOCRView() {
    $('#file-input').val('');
    $('#crop-container').hide();
    $('#btn-confirm-crop').hide();
    $('#btn-select-file').show();
    $('#ocr-progress').hide();
    $('#ocr-status').text('');
    $('#debug-preview-container').hide();
    if(cropper) {
        cropper.destroy();
        cropper = null;
    }
    $('#image-to-crop').attr('src', '');
}

// ================= 核心算法：无损几何重构 =================
function reconstructGrid(originalBlob) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const cols = 10;
            const rows = 7;
            
            // 1. 创建新画布
            const newCanvas = document.createElement('canvas');
            const cellW = 60; // 稍微加大单个格子的像素
            const cellH = 60;
            newCanvas.width = cols * cellW;
            newCanvas.height = rows * cellH;
            
            const ctx = newCanvas.getContext('2d');
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
            
            const srcStepW = img.width / cols;
            const srcStepH = img.height / rows;
            
            // 2. 调整内缩比例 (Padding)
            // 改为 0.15 (只扔掉边缘 15%)，保留更多字母细节
            // 只要网格线不是特别粗，这个比例足以避开网格线，同时保留字母完整
            const padRatio = 0.15; 
            
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const sx = (c * srcStepW) + (srcStepW * padRatio);
                    const sy = (r * srcStepH) + (srcStepH * padRatio);
                    const sw = srcStepW * (1 - 2 * padRatio);
                    const sh = srcStepH * (1 - 2 * padRatio);
                    
                    // 在新格子里，留出 10px 的白边，防止字母粘连
                    const dx = (c * cellW) + 10;
                    const dy = (r * cellH) + 10;
                    const dw = cellW - 20;
                    const dh = cellH - 20;
                    
                    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            }
            
            // 3. 简单的二值化 (Simple Thresholding)
            // 这里不做任何腐蚀/膨胀，只把颜色加深，保护字形！
            const imageData = ctx.getImageData(0, 0, newCanvas.width, newCanvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                // 加权灰度
                const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                // 阈值设为 140，对于白底黑字的照片效果很好
                const val = gray < 140 ? 0 : 255; 
                data[i] = val; data[i+1] = val; data[i+2] = val;
            }
            ctx.putImageData(imageData, 0, 0);

            newCanvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 1.0);
        };
        img.src = URL.createObjectURL(originalBlob);
    });
}

// ================= OCR 识别逻辑 =================

async function startCropAndRecognize() {
    if (!cropper) return;

    $('#btn-confirm-crop').prop('disabled', true).text('处理中...');
    
    cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (!blob) {
            alert("裁剪失败");
            return;
        }

        $('#ocr-status').text("正在重构网格...");
        
        // 1. 重构
        const cleanBlob = await reconstructGrid(blob);

        // 2. 预览
        const previewUrl = URL.createObjectURL(cleanBlob);
        $('#crop-preview').attr('src', previewUrl);
        $('#debug-preview-container').show();
        $('#crop-container').slideUp(); 
        $('#crop-hint').hide();
        
        // 3. 识别
        await runTesseract(cleanBlob);
        
        $('#btn-confirm-crop').prop('disabled', false).text('✂ 确认并识别');

    }, 'image/jpeg', 1.0);
}

async function runTesseract(imageBlob) {
    $('#ocr-progress').show();
    $('#ocr-status').text("加载本地模型...").css('color', '#666');

    let worker = null;
    try {
        const workerPath = chrome.runtime.getURL('worker.min.js');
        const corePath = chrome.runtime.getURL('tesseract-core.wasm.js');
        const langPath = chrome.runtime.getURL('/'); 

        worker = await Tesseract.createWorker('eng', 1, {
            workerPath: workerPath,
            corePath: corePath,
            langPath: langPath,
            cacheMethod: 'none',
            gzip: false,
            workerBlobURL: false,
            logger: m => {
                if (m.status === 'recognizing text') {
                    $('#ocr-bar').css('width', `${m.progress * 100}%`);
                    $('#ocr-status').text(`识别中... ${Math.floor(m.progress * 100)}%`);
                }
            }
        });

        await worker.setParameters({ 
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            tessedit_char_blacklist: '0123456789abcdefghijklmnopqrstuvwxyz',
            // 依然使用 PSM 6，因为它对排列整齐的字母块效果最好
            tessedit_pageseg_mode: '6', 
            
            // 禁用字典
            load_system_dawg: '0',
            load_freq_dawg: '0'
        });
        
        $('#ocr-status').text("正在读取字母...");
        
        const { data: { text } } = await worker.recognize(imageBlob);
        
        await worker.terminate();
        
        const success = parseAndFillMatrix(text);

        if(success) {
            $('#ocr-status').text("识别成功！").css('color', 'green');
            setTimeout(() => switchView('view-matrix'), 800);
        } else {
            $('#ocr-status').text("识别完成，请核对。").css('color', '#FF9800');
            setTimeout(() => switchView('view-matrix'), 1500);
        }

    } catch (err) {
        console.error(err);
        let msg = err.message || err;
        if (msg.includes("404") || msg.includes("NetworkError")) {
             msg = "模型加载失败，请确认 eng.traineddata 已放入文件夹。";
        }
        $('#ocr-status').text("错误: " + msg).css('color', 'red');
        if(worker) await worker.terminate();
    }
}

// ================= 解析逻辑 =================
function parseAndFillMatrix(text) {
    console.log("=== OCR Raw Output ===");
    console.log(text);

    // 提取所有大写字母
    const allLetters = text.toUpperCase().replace(/[^A-Z]/g, '');
    
    console.log("Extracted Letters:", allLetters);
    
    const $inputs = $('.matrix-input');
    $inputs.val(''); 
    
    // 我们强制按顺序填空。
    // 因为图片是我们几何重构的，顺序绝对是标准对齐的
    // 所以即使 Tesseract 漏读了一个换行符也没关系，字母顺序是对的
    for(let i=0; i<allLetters.length && i<70; i++) {
        $inputs.eq(i).val(allLetters[i]);
    }

    return allLetters.length >= 60;
}

// ================= 通用辅助函数 =================
function initGrid() {
    let html = '';
    const colLabels = ['A','B','C','D','E','F','G','H','I','J'];
    for (let row = 1; row <= 7; row++) {
        for (let colIdx = 0; colIdx < 10; colIdx++) {
            const key = `${colLabels[colIdx]},${row}`;
            html += `<input type="text" class="matrix-input" data-key="${key}" placeholder="${colLabels[colIdx]}${row}" maxlength="1">`;
        }
    }
    $('#grid-container').html(html);
}

function bindGridNavigation() {
    const $inputs = $('.matrix-input');
    $inputs.on('input', function() {
        const val = $(this).val().toUpperCase().replace(/[^A-Z]/g, '');
        $(this).val(val);
        if (val) {
            const idx = $inputs.index(this);
            if (idx < $inputs.length - 1) $inputs.eq(idx + 1).focus();
        }
    });
    $inputs.on('keydown', function(e) {
        const idx = $inputs.index(this);
        let next = null;
        if(e.key === 'ArrowRight') next = idx + 1;
        if(e.key === 'ArrowLeft') next = idx - 1;
        if(e.key === 'ArrowDown') next = idx + 10;
        if(e.key === 'ArrowUp') next = idx - 10;
        if(next !== null && next >= 0 && next < $inputs.length) {
            e.preventDefault();
            $inputs.eq(next).focus().select();
        }
    });
}

function clearAllInputs() { $('input').val(''); }

function loadData(cb) {
    chrome.storage.local.get(['auth_creds', 'matrix_map'], (data) => {
        if(data.auth_creds) {
            $('#username').val(data.auth_creds.username);
            $('#password').val(data.auth_creds.password);
        }
        if(data.matrix_map) {
            $('.matrix-input').each(function() {
                const k = $(this).data('key');
                if(data.matrix_map[k]) $(this).val(data.matrix_map[k]);
            });
        }
        if(cb) cb(!!data.auth_creds);
    });
}

function saveAllData() {
    const username = $('#username').val().trim();
    const password = $('#password').val().trim();
    let matrixMap = {};
    $('.matrix-input').each(function() {
        if($(this).val()) matrixMap[$(this).data('key')] = $(this).val();
    });
    chrome.storage.local.set({ 'auth_creds': { username, password }, 'matrix_map': matrixMap }, () => {
        alert("✅ 设置保存成功！");
        window.close();
    });
}

function resetAllData() {
    if(confirm("确定清空吗？")) {
        chrome.storage.local.remove(['auth_creds', 'matrix_map'], () => { alert("已清空"); clearAllInputs(); });
    }
}