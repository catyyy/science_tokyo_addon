$(document).ready(function() {
    initGrid();
    bindEvents();
});

let cropper = null;
let isProcessing = false; // 用于中断处理

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

    // 绑定新的单字识别逻辑
    $('#btn-confirm-crop').click(startSingleCellRecognition);

    $('#back-to-ocr').click(() => {
        isProcessing = false; // 停止可能的循环
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

    if (cropper) { cropper.destroy(); cropper = null; }

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
    if(cropper) { cropper.destroy(); cropper = null; }
    $('#image-to-crop').attr('src', '');
}

// ================= 核心：单字切片识别 (Single Cell Recognition) =================

async function startSingleCellRecognition() {
    if (!cropper) return;
    isProcessing = true;

    $('#btn-confirm-crop').prop('disabled', true).text('初始化引擎...');
    $('#ocr-progress').show();
    $('#crop-preview').attr('src', ''); 
    $('#debug-preview-container').show();
    $('.debug-hint').text("正在逐个识别 (Live Preview)...");

    // 获取裁剪后的原图 (不压缩，最高质量)
    cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (!blob) return;
        
        const img = new Image();
        img.onload = async () => {
            await process70Cells(img);
        };
        img.src = URL.createObjectURL(blob);

    }, 'image/jpeg', 1.0);
}

async function process70Cells(sourceImg) {
    $('#crop-container').slideUp();
    $('#crop-hint').hide();
    
    let worker = null;
    try {
        const workerPath = chrome.runtime.getURL('worker.min.js');
        const corePath = chrome.runtime.getURL('tesseract-core.wasm.js');
        const langPath = chrome.runtime.getURL('/'); 

        // 1. 初始化 Worker
        // 【关键修复】load_system_dawg 必须在这里设置，否则会报错
        worker = await Tesseract.createWorker('eng', 1, {
            workerPath: workerPath,
            corePath: corePath,
            langPath: langPath,
            cacheMethod: 'none',
            gzip: false,
            workerBlobURL: false,
            params: {
                load_system_dawg: '0',
                load_freq_dawg: '0',
            }
        });

        // 2. 设置运行时参数
        await worker.setParameters({ 
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // 纯大写
            tessedit_char_blacklist: '0123456789abcdefghijklmnopqrstuvwxyz', 
            tessedit_pageseg_mode: '10' // 【核心】PSM 10: 单个字符模式
        });

        const cols = 10;
        const rows = 7;
        const stepW = sourceImg.width / cols;
        const stepH = sourceImg.height / rows;
        
        // PadRatio: 0.2 (只取格子中心 60% 的区域，绝对避开网格线)
        const padRatio = 0.2;

        const $inputs = $('.matrix-input');
        $inputs.val(''); 

        // 3. 循环 70 次
        let count = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!isProcessing) break; 

                // --- 切片 ---
                const sx = (c * stepW) + (stepW * padRatio);
                const sy = (r * stepH) + (stepH * padRatio);
                const sw = stepW * (1 - 2 * padRatio);
                const sh = stepH * (1 - 2 * padRatio);

                // --- 绘图 ---
                const cellCanvas = document.createElement('canvas');
                cellCanvas.width = 60;  // 固定 60px 大小供 AI 识别
                cellCanvas.height = 60;
                const ctx = cellCanvas.getContext('2d');
                
                // 白底
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 60, 60);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // 画入中间，留 5px 边距
                ctx.drawImage(sourceImg, sx, sy, sw, sh, 5, 5, 50, 50);
                
                // --- 图像增强 (Gamma 校正) ---
                // 不做硬二值化，防止 Q 尾巴断裂
                const imageData = ctx.getImageData(0, 0, 60, 60);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                    // Gamma 0.6 (加深中间色调)
                    let val = 255 * Math.pow((gray / 255), 0.6);
                    // 简单的白平衡：太亮的直接变白，去除背景底色
                    if(val > 180) val = 255; 
                    
                    data[i] = val; data[i+1] = val; data[i+2] = val;
                }
                ctx.putImageData(imageData, 0, 0);

                // --- 实时预览 ---
                // 让用户看到 AI 现在正在看哪个字
                const previewUrl = cellCanvas.toDataURL();
                $('#crop-preview').attr('src', previewUrl);

                // --- 识别 ---
                const { data: { text, confidence } } = await worker.recognize(cellCanvas);
                
                const char = text.toUpperCase().replace(/[^A-Z]/g, '').trim().charAt(0);
                
                console.log(`[${r+1},${c+1}] => ${char} (${confidence}%)`);

                // --- 填空 ---
                if (char) {
                    $inputs.eq(count).val(char);
                }

                count++;
                // 更新进度条
                const progress = (count / 70) * 100;
                $('#ocr-bar').css('width', `${progress}%`);
                $('#ocr-status').text(`正在识别... ${count}/70 (行${r+1} 列${c+1})`);
            }
        }

        await worker.terminate();
        
        if (isProcessing) {
            $('#ocr-status').text("识别完成！").css('color', 'green');
            $('#btn-confirm-crop').text('完成').prop('disabled', false);
            // 给用户一点时间看最后的状态，然后跳转
            setTimeout(() => switchView('view-matrix'), 800);
        }

    } catch (err) {
        console.error(err);
        $('#ocr-status').text("错误: " + (err.message || err)).css('color', 'red');
        if(worker) await worker.terminate();
        $('#btn-confirm-crop').prop('disabled', false).text('重试');
    }
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