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
                autoCropArea: 0.9,
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

// ================= 图像预处理 (最终核武版：形态学去噪) =================
function preprocessImage(originalBlob) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 1. 放大 3 倍 (保持不变，为了清晰度)
            const scaleFactor = 3; 
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // 注意：这里我们需要处理 imageData.data，它是一个一维数组
            
            // 2. 灰度化 + 二值化 (这一步必须先做)
            binarize(imageData.data, canvas.width, canvas.height);

            // =========================================================
            // 3. 【新算法】形态学运算 (Morphology)
            // 针对：粗字体 + 细表格线
            // 逻辑：先腐蚀 2 次（把细线烂掉），再膨胀 2 次（把字还原）
            // =========================================================
            
            // 创建缓冲区，避免修改通过引用的原数组导致计算错误
            let buffer = new Uint8ClampedArray(imageData.data);

            // 第一轮腐蚀：去除大部分网格线
            erode(imageData.data, buffer, canvas.width, canvas.height);
            // 同步 buffer
            buffer.set(imageData.data);

            // 第二轮腐蚀：去除残留的交叉点和噪点
            erode(imageData.data, buffer, canvas.width, canvas.height);
            buffer.set(imageData.data);

            // 此时细线应该全没了，字体变细了。现在通过膨胀让字体恢复粗细。
            // 第一轮膨胀
            dilate(imageData.data, buffer, canvas.width, canvas.height);
            buffer.set(imageData.data);

            // 第二轮膨胀
            dilate(imageData.data, buffer, canvas.width, canvas.height);

            // 将处理后的数据放回 Canvas
            ctx.putImageData(imageData, 0, 0);
            
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 1.0);
        };
        img.src = URL.createObjectURL(originalBlob);
    });
}

// ================= 辅助算法库 =================

// 1. 二值化 (Otsu + Grayscale)
function binarize(pixels, width, height) {
    const grayValues = new Uint8Array(pixels.length / 4);
    
    // 灰度化
    for (let i = 0; i < pixels.length; i += 4) {
        // 加强绿色通道权重 (适应粉色背景)
        let gray = 0.2 * pixels[i] + 0.7 * pixels[i + 1] + 0.1 * pixels[i + 2]; 
        grayValues[i / 4] = gray;
    }
    
    // Otsu 计算阈值
    const threshold = otsu(grayValues);
    
    // 应用二值化
    for (let i = 0; i < pixels.length; i += 4) {
        const val = grayValues[i / 4] > threshold ? 255 : 0;
        pixels[i] = val;
        pixels[i + 1] = val;
        pixels[i + 2] = val;
        // Alpha 通道保持 255
        pixels[i + 3] = 255;
    }
}

// 2. 腐蚀 (Erosion): 黑色区域缩小 (只要周围有白色，我就变白)
// source: 当前像素数据, dest: 输出缓冲区
function erode(source, dest, width, height) {
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // 如果当前是黑色(文字)，检查周围有没有白色
            if (source[idx] === 0) {
                // 检查 上下左右 4 个邻居
                // 如果任何一个邻居是白色(255)，则当前点被腐蚀成白色
                const up = source[((y - 1) * width + x) * 4];
                const down = source[((y + 1) * width + x) * 4];
                const left = source[(y * width + (x - 1)) * 4];
                const right = source[(y * width + (x + 1)) * 4];

                if (up === 255 || down === 255 || left === 255 || right === 255) {
                    dest[idx] = 255;     // R
                    dest[idx + 1] = 255; // G
                    dest[idx + 2] = 255; // B
                } else {
                    // 保持黑色
                    dest[idx] = 0; dest[idx + 1] = 0; dest[idx + 2] = 0;
                }
            } else {
                // 本来就是白色，保持白色
                dest[idx] = 255; dest[idx + 1] = 255; dest[idx + 2] = 255;
            }
            dest[idx + 3] = 255; // Alpha
        }
    }
    // 这里的 dest 修改是通过引用传递回去了吗？是的，因为 Uint8ClampedArray 是 TypedArray
    // 但为了确保逻辑，我们在主函数里做了 buffer.set()
}

// 3. 膨胀 (Dilation): 黑色区域扩大 (只要周围有黑色，我就变黑)
function dilate(source, dest, width, height) {
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // 如果当前是白色(背景)，检查周围有没有黑色
            if (source[idx] === 255) {
                const up = source[((y - 1) * width + x) * 4];
                const down = source[((y + 1) * width + x) * 4];
                const left = source[(y * width + (x - 1)) * 4];
                const right = source[(y * width + (x + 1)) * 4];

                if (up === 0 || down === 0 || left === 0 || right === 0) {
                    dest[idx] = 0;     // R
                    dest[idx + 1] = 0; // G
                    dest[idx + 2] = 0; // B
                } else {
                    dest[idx] = 255; dest[idx + 1] = 255; dest[idx + 2] = 255;
                }
            } else {
                // 本来就是黑色，保持黑色
                dest[idx] = 0; dest[idx + 1] = 0; dest[idx + 2] = 0;
            }
            dest[idx + 3] = 255;
        }
    }
}

// Otsu 算法 (保持不变)
function otsu(grayData) {
    let histogram = new Array(256).fill(0);
    for (let i = 0; i < grayData.length; i++) histogram[grayData[i]]++;
    let total = grayData.length;
    let sum = 0;
    for (let i = 0; i < 256; i++) sum += i * histogram[i];
    let sumB = 0, wB = 0, wF = 0, varMax = 0, threshold = 0;
    for (let t = 0; t < 256; t++) {
        wB += histogram[t];
        if (wB === 0) continue;
        wF = total - wB;
        if (wF === 0) break;
        sumB += t * histogram[t];
        let mB = sumB / wB;
        let mF = (sum - sumB) / wF;
        let varBetween = wB * wF * (mB - mF) * (mB - mF);
        if (varBetween > varMax) {
            varMax = varBetween;
            threshold = t;
        }
    }
    return threshold;
}

// ================= 智能去线算法 (带厚度检测) =================
function removeThinLines(pixels, width, height, minHLen, minVLen, maxThick) {
    const getPixel = (x, y) => pixels[(y * width + x) * 4];
    const setPixelWhite = (x, y) => {
        const idx = (y * width + x) * 4;
        pixels[idx] = 255; pixels[idx + 1] = 255; pixels[idx + 2] = 255;
    };

    // 辅助函数：测量某点的垂直厚度
    const getVerticalThickness = (x, y) => {
        let thickness = 0;
        // 向上找
        for (let k = y; k >= 0; k--) {
            if (getPixel(x, k) < 128) thickness++; else break;
        }
        // 向下找
        for (let k = y + 1; k < height; k++) {
            if (getPixel(x, k) < 128) thickness++; else break;
        }
        return thickness;
    };

    // 辅助函数：测量某点的水平厚度
    const getHorizontalThickness = (x, y) => {
        let thickness = 0;
        // 向左找
        for (let k = x; k >= 0; k--) {
            if (getPixel(k, y) < 128) thickness++; else break;
        }
        // 向右找
        for (let k = x + 1; k < width; k++) {
            if (getPixel(k, y) < 128) thickness++; else break;
        }
        return thickness;
    };

    // 1. 处理横线
    for (let y = 0; y < height; y++) {
        let start = -1;
        for (let x = 0; x < width; x++) {
            const isBlack = getPixel(x, y) < 128;
            if (isBlack) {
                if (start === -1) start = x;
            } else {
                if (start !== -1) {
                    const len = x - start;
                    if (len > minHLen) {
                        // 【关键修改】检查线段中点的垂直厚度
                        // 如果厚度很小（细线），删掉；如果很粗（可能是字），保留
                        const midX = Math.floor(start + len / 2);
                        const thickness = getVerticalThickness(midX, y);
                        
                        if (thickness <= maxThick) {
                            for (let k = start; k < x; k++) setPixelWhite(k, y);
                        }
                    }
                    start = -1;
                }
            }
        }
        // 处理行尾
        if (start !== -1 && (width - start) > minHLen) {
            const midX = Math.floor(start + (width - start) / 2);
            if (getVerticalThickness(midX, y) <= maxThick) {
                for (let k = start; k < width; k++) setPixelWhite(k, y);
            }
        }
    }

    // 2. 处理竖线
    for (let x = 0; x < width; x++) {
        let start = -1;
        for (let y = 0; y < height; y++) {
            const isBlack = getPixel(x, y) < 128;
            if (isBlack) {
                if (start === -1) start = y;
            } else {
                if (start !== -1) {
                    const len = y - start;
                    if (len > minVLen) {
                        // 【关键修改】检查线段中点的水平厚度
                        const midY = Math.floor(start + len / 2);
                        const thickness = getHorizontalThickness(x, midY);
                        
                        if (thickness <= maxThick) {
                            for (let k = start; k < y; k++) setPixelWhite(x, k);
                        }
                    }
                    start = -1;
                }
            }
        }
        // 处理列尾
        if (start !== -1 && (height - start) > minVLen) {
            const midY = Math.floor(start + (height - start) / 2);
            if (getHorizontalThickness(x, midY) <= maxThick) {
                for (let k = start; k < height; k++) setPixelWhite(x, k);
            }
        }
    }
}

// ================= 去除长直线算法 =================
function removeLines(pixels, width, height, minHLineLen, minVLineLen) {
    // pixels 是 RGBA 数组，每4个一组。由于已经二值化，R=G=B，我们只看 R (offset 0)
    // 黑色是 0 (文字/线)，白色是 255 (背景)
    
    const getPixel = (x, y) => pixels[(y * width + x) * 4];
    const setPixelWhite = (x, y) => {
        const idx = (y * width + x) * 4;
        pixels[idx] = 255;     // R
        pixels[idx + 1] = 255; // G
        pixels[idx + 2] = 255; // B
    };

    // 1. 去除横线
    for (let y = 0; y < height; y++) {
        let runStart = -1;
        for (let x = 0; x < width; x++) {
            const isBlack = getPixel(x, y) < 128;

            if (isBlack) {
                if (runStart === -1) runStart = x;
            } else {
                if (runStart !== -1) {
                    const runLength = x - runStart;
                    // 如果连续黑点长度超过阈值，说明是长横线，擦除它
                    if (runLength > minHLineLen) {
                        for (let k = runStart; k < x; k++) setPixelWhite(k, y);
                    }
                    runStart = -1;
                }
            }
        }
        // 处理行尾的情况
        if (runStart !== -1) {
            if ((width - runStart) > minHLineLen) {
                for (let k = runStart; k < width; k++) setPixelWhite(k, y);
            }
        }
    }

    // 2. 去除竖线
    for (let x = 0; x < width; x++) {
        let runStart = -1;
        for (let y = 0; y < height; y++) {
            const isBlack = getPixel(x, y) < 128;

            if (isBlack) {
                if (runStart === -1) runStart = y;
            } else {
                if (runStart !== -1) {
                    const runLength = y - runStart;
                    // 如果连续黑点长度超过阈值，说明是长竖线，擦除它
                    if (runLength > minVLineLen) {
                        for (let k = runStart; k < y; k++) setPixelWhite(x, k);
                    }
                    runStart = -1;
                }
            }
        }
        // 处理列尾
        if (runStart !== -1) {
            if ((height - runStart) > minVLineLen) {
                for (let k = runStart; k < height; k++) setPixelWhite(x, k);
            }
        }
    }
}

// Otsu 算法保持不变
function otsu(grayData) {
    let histogram = new Array(256).fill(0);
    for (let i = 0; i < grayData.length; i++) histogram[grayData[i]]++;
    let total = grayData.length;
    let sum = 0;
    for (let i = 0; i < 256; i++) sum += i * histogram[i];
    let sumB = 0, wB = 0, wF = 0, varMax = 0, threshold = 0;
    for (let t = 0; t < 256; t++) {
        wB += histogram[t];
        if (wB === 0) continue;
        wF = total - wB;
        if (wF === 0) break;
        sumB += t * histogram[t];
        let mB = sumB / wB;
        let mF = (sum - sumB) / wF;
        let varBetween = wB * wF * (mB - mF) * (mB - mF);
        if (varBetween > varMax) {
            varMax = varBetween;
            threshold = t;
        }
    }
    return threshold;
}

function otsu(grayData) {
    let histogram = new Array(256).fill(0);
    for (let i = 0; i < grayData.length; i++) histogram[grayData[i]]++;
    let total = grayData.length;
    let sum = 0;
    for (let i = 0; i < 256; i++) sum += i * histogram[i];
    let sumB = 0, wB = 0, wF = 0, varMax = 0, threshold = 0;
    for (let t = 0; t < 256; t++) {
        wB += histogram[t];
        if (wB === 0) continue;
        wF = total - wB;
        if (wF === 0) break;
        sumB += t * histogram[t];
        let mB = sumB / wB;
        let mF = (sum - sumB) / wF;
        let varBetween = wB * wF * (mB - mF) * (mB - mF);
        if (varBetween > varMax) {
            varMax = varBetween;
            threshold = t;
        }
    }
    return threshold;
}

// ================= OCR 核心逻辑 =================

async function startCropAndRecognize() {
    if (!cropper) return;

    $('#btn-confirm-crop').prop('disabled', true).text('处理中...');
    
    cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (!blob) {
            alert("裁剪失败");
            $('#btn-confirm-crop').prop('disabled', false).text('✂ 确认并识别');
            return;
        }

        // 1. 预处理
        $('#ocr-status').text("正在优化图像...");
        const processedBlob = await preprocessImage(blob);

        // 2. 显示预览
        const previewUrl = URL.createObjectURL(processedBlob);
        $('#crop-preview').attr('src', previewUrl);
        $('#debug-preview-container').show();
        $('#crop-container').slideUp(); 
        $('#crop-hint').hide();

        // 3. 整体识别
        await runTesseractFull(processedBlob);
        
        $('#btn-confirm-crop').prop('disabled', false).text('✂ 确认并识别');

    }, 'image/jpeg', 1.0);
}

async function runTesseractFull(imageBlob) {
    $('#ocr-progress').show();
    $('#ocr-status').text("加载高精度模型(Best)...").css('color', '#666');

    let worker = null;
    try {
        const workerPath = chrome.runtime.getURL('worker.min.js');
        const corePath = chrome.runtime.getURL('tesseract-core.wasm.js');
        const langPath = chrome.runtime.getURL('/'); // 指向本地 eng.traineddata

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

        // 4. 【核武级优化】参数配置
        await worker.setParameters({ 
            // 只允许大写字母
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            // 严禁数字
            tessedit_char_blacklist: '0123456789abcdefghijklmnopqrstuvwxyz',
            // PSM 6: Assume a single uniform block of text. (最适合矩阵)
            tessedit_pageseg_mode: '6',

            // 禁用所有字典和修正
            load_system_dawg: '0',
            load_freq_dawg: '0',
            load_punc_dawg: '0',
            load_number_dawg: '0',
            load_unambig_dawg: '0',
            load_bigram_dawg: '0',
            load_fixed_length_dawgs: '0',
            
            classify_enable_learning: '0',
            classify_enable_adaptive_matcher: '0'
        });
        
        $('#ocr-status').text("正在分析矩阵...");
        
        const { data: { text } } = await worker.recognize(imageBlob);
        
        await worker.terminate();
        
        const success = parseAndFillMatrix(text);

        if(success) {
            $('#ocr-status').text("识别成功！").css('color', 'green');
            setTimeout(() => switchView('view-matrix'), 800);
        } else {
            $('#ocr-status').text("行数识别有误，请检查下方预览图是否清晰。").css('color', '#FF9800');
            // 显示 Matrix 页面供手动修复
            setTimeout(() => switchView('view-matrix'), 1500);
        }

    } catch (err) {
        console.error(err);
        let msg = err.message || err;
        if (msg.includes("404") || msg.includes("NetworkError")) {
             msg = "模型加载失败，请确认 eng.traineddata 存在。";
        }
        $('#ocr-status').text("错误: " + msg).css('color', 'red');
        if(worker) await worker.terminate();
    }
}

// ================= 解析逻辑 (适应整体识别) =================
function parseAndFillMatrix(text) {
    console.log("=== OCR Raw Output ===");
    console.log(text);

    const lines = text.split('\n');
    const validRows = [];
    
    for(let line of lines) {
        // 强力清洗：只留 A-Z
        let clean = line.toUpperCase().replace(/[^A-Z]/g, ''); 
        
        // 宽松策略：只要长度接近 10 (比如 9-11)，我们都尝试接纳
        // 然后截取或补全
        if(clean.length >= 8) { 
            // 有时候 OCR 会漏读一个字，或者多读一个噪点
            // 我们尽量取最靠谱的部分
            let rowData = clean;
            if (rowData.length > 10) rowData = rowData.slice(0, 10);
            
            validRows.push(rowData);
        }
    }

    // 如果识别出行数 > 7，通常是把边缘杂质读进去了
    // 学生证矩阵通常在下半部分，所以取最后 7 行比较稳
    if (validRows.length > 7) {
        validRows.splice(0, validRows.length - 7);
    }

    console.log("Valid Rows:", validRows);

    // 填充网格
    const $inputs = $('.matrix-input');
    $inputs.val(''); 
    
    validRows.forEach((rowStr, rIdx) => {
        // rIdx 最大只能是 6 (第7行)
        if (rIdx < 7) {
            rowStr.split('').forEach((char, cIdx) => {
                if (cIdx < 10) {
                    $inputs.eq(rIdx * 10 + cIdx).val(char);
                }
            });
        }
    });

    // 返回 true 只要我们找到了至少 5 行数据，剩下的让用户填，体验更好
    return validRows.length >= 5;
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