// ================= 多语言支持 =================
const i18n = {
    zh: {
        app_title: "东京科学大学理工学系Portal自动认证",
        btn_new: "➕ 新建 / 重置配置",
        btn_edit: "✏️ 编辑现有配置",
        btn_clear: "🗑️ 清除所有数据",
        account_info: "账号信息",
        student_id: "学籍番号 (Student ID)",
        password: "密码 (Password)",
        username_placeholder: "例: 23B12345",
        password_placeholder: "Portal Password",
        btn_back_home: "⬅ 返回",
        btn_next: "下一步 ➡",
        choose_input_method: "选择矩阵输入方式",
        ocr_title: "拍照自动识别（推荐）",
        ocr_desc: "上传学生证 → 裁剪 → 自动读取",
        manual_title: "手动输入",
        manual_desc: "手动逐个输入70个字符",
        btn_back: "⬅ 上一步",
        image_processing: "图片处理",
        btn_select_photo: "📂 选择照片（背面）",
        crop_hint: "💡 使用方法：拖动裁剪框使绿色网格与70个格子对齐，鼠标滚轮调整图片大小",
        preview_hint: "即将对此区域进行识别：",
        preview_warning: "如果包含杂物或切歪了，请返回重试",
        btn_confirm_crop: "✂ 确认并识别",
        confirm_matrix: "确认矩阵数据",
        confidence_hint: "💡 核对数据：黄色=低可信度，红色=极低可信度",
        btn_re_recognize: "⬅ 重新识别",
        btn_save_complete: "✅ 保存并完成",
        ocr_recognizing: "正在识别...",
        ocr_complete: "识别完成！",
        ocr_row: "行",
        ocr_col: "列",
        alert_fill_account: "请填写账号和密码",
        alert_save_success: "✅ 设置保存成功！",
        btn_done: "完成",
        btn_retry: "重试",
        ocr_error: "错误: ",
        alert_no_config: "无配置",
        ocr_initializing: "初始化引擎...",
        ocr_recognizing_live: "正在逐个识别 (Live Preview)...",
        confirm_clear: "确定清空吗？",
        alert_cleared: "已清空"
    },
    en: {
        app_title: "TokyoTech Science Portal Auto-Authentication",
        btn_new: "➕ New / Reset Configuration",
        btn_edit: "✏️ Edit Existing Configuration",
        btn_clear: "🗑️ Clear All Data",
        account_info: "Account Information",
        student_id: "Student ID",
        password: "Password",
        username_placeholder: "e.g.: 23B12345",
        password_placeholder: "Portal Password",
        btn_back_home: "⬅ Back to Home",
        btn_next: "Next ➡",
        choose_input_method: "Choose Matrix Input Method",
        ocr_title: "Photo Auto-Recognition (Recommended)",
        ocr_desc: "Upload Student Card → Crop → Auto-Read",
        manual_title: "Manual Input",
        manual_desc: "Manually input 70 characters one by one",
        btn_back: "⬅ Back",
        image_processing: "Image Processing",
        btn_select_photo: "📂 Select Photo (Back Side)",
        crop_hint: "💡 How to use: Drag the cropping box to align the green grid with 70 cells, use mouse wheel to adjust image size",
        preview_hint: "This area will be recognized:",
        preview_warning: "If it contains debris or is crooked, please go back and retry",
        btn_confirm_crop: "✂ Confirm and Recognize",
        confirm_matrix: "Confirm Matrix Data",
        confidence_hint: "💡 Check data: Yellow=Low confidence, Red=Very low confidence",
        btn_re_recognize: "⬅ Re-recognize",
        btn_save_complete: "✅ Save and Complete",
        ocr_recognizing: "Recognizing...",
        ocr_complete: "Recognition Complete!",
        ocr_row: "Row",
        ocr_col: "Col",
        alert_fill_account: "Please fill in account and password",
        alert_save_success: "✅ Settings saved successfully!",
        btn_done: "Done",
        btn_retry: "Retry",
        ocr_error: "Error: ",
        alert_no_config: "No configuration",
        ocr_initializing: "Initializing engine...",
        ocr_recognizing_live: "Recognizing cell by cell (Live Preview)...",
        confirm_clear: "Are you sure you want to clear all data?",
        alert_cleared: "Cleared"
    },
    ja: {
        app_title: "東京科学大学理工学系Portal自動認証",
        btn_new: "➕ 新規作成 / リセット",
        btn_edit: "✏️ 既存の設定を編集",
        btn_clear: "🗑️ すべてのデータを消去",
        account_info: "アカウント情報",
        student_id: "学籍番号 (Student ID)",
        password: "パスワード (Password)",
        username_placeholder: "例: 23B12345",
        password_placeholder: "Portal Password",
        btn_back_home: "⬅ ホームに戻る",
        btn_next: "次へ ➡",
        choose_input_method: "マトリクス入力方式を選択",
        ocr_title: "写真自動認識（推奨）",
        ocr_desc: "学生証をアップロード → トリミング → 自動読取",
        manual_title: "手動入力",
        manual_desc: "70文字を手動で一つずつ入力",
        btn_back: "⬅ 前に戻る",
        image_processing: "画像処理",
        btn_select_photo: "📂 写真を選択（裏面）",
        crop_hint: "💡 使い方：トリミング枠をドラッグして緑色のグリッドを70個のマスに合わせ、マウスホイールで画像サイズを調整",
        preview_hint: "この領域を認識します：",
        preview_warning: "不要物が含まれていたり、傾いている場合は戻ってやり直してください",
        btn_confirm_crop: "✂ 確認して認識",
        confirm_matrix: "マトリックスデータの確認",
        confidence_hint: "💡 データ確認：黄色=信頼度低、赤色=信頼度極低",
        btn_re_recognize: "⬅ 再認識",
        btn_save_complete: "✅ 保存して完了",
        ocr_recognizing: "認識中...",
        ocr_complete: "認識完了！",
        ocr_row: "行",
        ocr_col: "列",
        alert_fill_account: "アカウントとパスワードを入力してください",
        alert_save_success: "✅ 設定が保存されました！",
        btn_done: "完了",
        btn_retry: "再試行",
        ocr_error: "エラー: ",
        alert_no_config: "設定がありません",
        ocr_initializing: "エンジン初期化中...",
        ocr_recognizing_live: "一つずつ認識中 (Live Preview)...",
        confirm_clear: "本当にすべてのデータを消去しますか？",
        alert_cleared: "消去しました"
    }
};


let currentLang = 'ja'; // 默认日语

function setLanguage(lang) {
    currentLang = lang;
    chrome.storage.local.set({ language: lang });
    
    // 更新所有带 data-i18n 属性的元素
    $('[data-i18n]').each(function() {
        const key = $(this).data('i18n');
        if (i18n[lang] && i18n[lang][key]) {
            // 特殊处理包含HTML的键
            if (key === 'crop_hint') {
                $(this).html(i18n[lang][key]);
            } else {
                $(this).text(i18n[lang][key]);
            }
        }
    });
    
    // 更新所有带 data-i18n-placeholder 属性的输入框
    $('[data-i18n-placeholder]').each(function() {
        const key = $(this).data('i18n-placeholder');
        if (i18n[lang] && i18n[lang][key]) {
            $(this).attr('placeholder', i18n[lang][key]);
        }
    });
    
    // 更新下拉框选中状态
    $('#language-select').val(lang);
}

$(document).ready(function() {
    // 加载保存的语言设置，默认日语
    chrome.storage.local.get(['language'], (data) => {
        const savedLang = data.language || 'ja';
        setLanguage(savedLang);
    });
    
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
    // 语言下拉框切换
    $('#language-select').change(function() {
        const lang = $(this).val();
        setLanguage(lang);
    });
    
    $('#btn-home-new').click(() => { clearAllInputs(); switchView('view-step1'); });
    $('#btn-home-edit').click(() => { 
        loadData((exists) => { 
            if(exists) {
                switchView('view-step1'); 
                // 标记为编辑模式
                $('#goto-choice').data('edit-mode', true);
            } else {
                alert(i18n[currentLang].alert_no_config); 
            }
        }); 
    });
    $('#btn-home-clear').click(resetAllData);
    $('#back-to-home').click(() => switchView('view-home'));
    
    $('#goto-choice').click(() => {
        if(!$('#username').val() || !$('#password').val()) { alert(i18n[currentLang].alert_fill_account); return; }
        
        // 检查是否是编辑模式
        const isEditMode = $('#goto-choice').data('edit-mode');
        if (isEditMode) {
            // 编辑模式：直接跳转到手动输入页面
            $('#goto-choice').data('edit-mode', false); // 清除标记
            $('#ocr-confidence-hint').hide(); // 编辑模式时隐藏提示
            switchView('view-matrix');
        } else {
            // 新建模式：跳转到选择页面
            switchView('view-choice');
        }
    });

    $('#back-to-step1').click(() => switchView('view-step1'));
    $('#card-manual').click(() => {
        $('#ocr-confidence-hint').hide(); // 手动输入时隐藏提示
        switchView('view-matrix');
    });
    
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
        
        // 重置OCR视图状态
        $('#crop-container').hide();
        $('#debug-preview-container').hide();
        $('#ocr-status').text('');
        $('#ocr-progress').hide();
        $('#ocr-bar').css('width', '0%');
        $('#btn-confirm-crop').hide();
        $('#crop-hint').hide();
        
        // 如果已有cropper，销毁它
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        
        // 清空图片
        $('#image-to-crop').attr('src', '');
        
        // 回退到选择输入方式页面
        switchView('view-choice');
    });
    
    $('#btn-save-final').click(saveAllData);
    bindGridNavigation();
}

// ================= 裁剪逻辑 =================

let lastGridLog = 0; // 防止日志刷屏

function drawGridOverlay() {
    if (!cropper) return;
    
    const cropBoxData = cropper.getCropBoxData();
    const containerData = cropper.getContainerData();
    
    const canvas = document.getElementById('grid-overlay');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸为容器尺寸
    canvas.width = containerData.width;
    canvas.height = containerData.height;
    
    // 清空
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 裁剪框的屏幕坐标（这就是用户拖动的区域）
    const x = cropBoxData.left;
    const y = cropBoxData.top;
    const w = cropBoxData.width;
    const h = cropBoxData.height;
    
    const cols = 10;
    const rows = 7;
    
    const stepW = w / cols;
    const stepH = h / rows;
    
    // 绘制70个格子的网格线（直接在裁剪框范围内，无偏移）
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    
    // 垂直线（10列 = 11条线）
    for (let i = 0; i <= cols; i++) {
        const lineX = x + stepW * i;
        ctx.beginPath();
        ctx.moveTo(lineX, y);
        ctx.lineTo(lineX, y + h);
        ctx.stroke();
    }
    
    // 水平线（7行 = 8条线）
    for (let i = 0; i <= rows; i++) {
        const lineY = y + stepH * i;
        ctx.beginPath();
        ctx.moveTo(x, lineY);
        ctx.lineTo(x + w, lineY);
        ctx.stroke();
    }
    
    // 添加行列标签（显示在裁剪框外部）
    ctx.setLineDash([]);
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.fillStyle = '#FFFF00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.font = 'bold 14px Arial';
    
    // 列标签 (A-J) - 显示在裁剪框上方
    for (let i = 0; i < cols; i++) {
        const labelX = x + stepW * i + stepW / 2 - 6;
        const label = String.fromCharCode(65 + i);
        ctx.strokeText(label, labelX, y - 10);
        ctx.fillText(label, labelX, y - 10);
    }
    
    // 行标签 (1-7) - 显示在裁剪框左侧
    for (let i = 0; i < rows; i++) {
        const labelY = y + stepH * i + stepH / 2 + 5;
        ctx.strokeText(String(i + 1), x - 20, labelY);
        ctx.fillText(String(i + 1), x - 20, labelY);
    }
    
    // 限制日志频率：每500ms最多输出一次
    const now = Date.now();
    if (now - lastGridLog > 500) {
        console.log(`[Grid] 裁剪框: ${w.toFixed(0)}x${h.toFixed(0)}, 每格: ${stepW.toFixed(1)}x${stepH.toFixed(1)}`);
        lastGridLog = now;
    }
}

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
                crop: function(event) {
                    // 裁剪框变化时，实时更新网格
                    drawGridOverlay();
                }
            });
            // 初始绘制网格
            setTimeout(() => drawGridOverlay(), 100);
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
    // 清空网格canvas
    const canvas = document.getElementById('grid-overlay');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ================= 核心：单字切片识别 (Single Cell Recognition) =================

async function startSingleCellRecognition() {
    if (!cropper) return;
    
    isProcessing = true;

    $('#btn-confirm-crop').prop('disabled', true).text(i18n[currentLang].ocr_initializing);
    $('#ocr-progress').show();
    $('#crop-preview').attr('src', ''); 
    $('#debug-preview-container').show();
    $('.debug-hint').text(i18n[currentLang].ocr_recognizing_live);

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
            tessedit_pageseg_mode: '10', // 【核心】PSM 10: 单个字符模式
            // 优化参数以改善圆形字母(O, Q, D等)的识别
            tessedit_do_invert: '0',
            tessedit_minimal_rej_to_debug: '1'
        });

        const cols = 10;
        const rows = 7;
        
        // 用户裁剪的区域就是70个格子，不需要偏移
        const stepW = sourceImg.width / cols;
        const stepH = sourceImg.height / rows;
        
        console.log(`[OCR] 裁剪后图像尺寸: ${sourceImg.width}x${sourceImg.height}`);
        console.log(`[OCR] 每格尺寸: ${stepW.toFixed(1)}x${stepH.toFixed(1)}px`);
        
        // PadRatio: 向内收缩避开网格线（降低到0.08，给字母更多空间）
        const padRatio = 0.08;

        const $inputs = $('.matrix-cell-input');
        $inputs.val(''); 

        // 3. 循环 70 次
        let count = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!isProcessing) break; 

                // --- 切片（直接基于裁剪框，无需偏移）---
                const baseX = c * stepW;
                const baseY = r * stepH;
                
                // 向内收缩，避开网格线
                const sx = baseX + (stepW * padRatio);
                const sy = baseY + (stepH * padRatio);
                const sw = stepW * (1 - 2 * padRatio);
                const sh = stepH * (1 - 2 * padRatio);
                
                // 调试：每10个输出一次坐标
                if (count % 10 === 0) {
                    console.log(`[Debug] Cell ${count}: sx=${sx.toFixed(1)}, sy=${sy.toFixed(1)}, size=${sw.toFixed(1)}x${sh.toFixed(1)}`);
                }

                // --- 绘图 (提高输出尺寸到120px以获得更多细节) ---
                const cellCanvas = document.createElement('canvas');
                cellCanvas.width = 120;  // 从80增加到120px
                cellCanvas.height = 120;
                const ctx = cellCanvas.getContext('2d', { willReadFrequently: true });
                
                // 白底
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 120, 120);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // 画入中间，留 10px 边距
                ctx.drawImage(sourceImg, sx, sy, sw, sh, 10, 10, 100, 100);
                
                // --- 图像增强：锐化 + 自适应二值化 ---
                let imageData = ctx.getImageData(0, 0, 120, 120);
                let data = imageData.data;
                
                // 步骤1: 应用锐化滤镜增强边缘
                const sharpenKernel = [
                    0, -1,  0,
                   -1,  5, -1,
                    0, -1,  0
                ];
                const tempData = new Uint8ClampedArray(data);
                const width = 120;
                
                for (let y = 1; y < 119; y++) {
                    for (let x = 1; x < 119; x++) {
                        for (let c = 0; c < 3; c++) {  // RGB三通道
                            let sum = 0;
                            for (let ky = -1; ky <= 1; ky++) {
                                for (let kx = -1; kx <= 1; kx++) {
                                    const idx = ((y + ky) * width + (x + kx)) * 4 + c;
                                    const kernelIdx = (ky + 1) * 3 + (kx + 1);
                                    sum += tempData[idx] * sharpenKernel[kernelIdx];
                                }
                            }
                            const idx = (y * width + x) * 4 + c;
                            data[idx] = Math.max(0, Math.min(255, sum));
                        }
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                
                // 步骤2: 重新获取锐化后的图像，应用自适应二值化
                imageData = ctx.getImageData(0, 0, 120, 120);
                data = imageData.data;
                
                // 计算平均亮度
                let sum = 0;
                for (let i = 0; i < data.length; i += 4) {
                    sum += 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                }
                const avgBrightness = sum / (data.length / 4);
                
                // 自适应阈值
                const threshold = avgBrightness > 160 ? 155 : 135;
                
                for (let i = 0; i < data.length; i += 4) {
                    const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                    
                    // 三级二值化保留边缘梯度
                    let val;
                    if (gray < threshold - 25) {
                        val = 0;  // 深色文字
                    } else if (gray > threshold + 35) {
                        val = 255;  // 白色背景
                    } else {
                        // 过渡区域保留灰度
                        val = ((gray - (threshold - 25)) / 60) * 255;
                    }
                    
                    data[i] = val; data[i+1] = val; data[i+2] = val;
                }
                ctx.putImageData(imageData, 0, 0);

                // --- 实时预览 ---
                // 让用户看到 AI 现在正在看哪个字
                const previewUrl = cellCanvas.toDataURL();
                $('#crop-preview').attr('src', previewUrl);

                // --- 首次识别 ---
                let { data: { text, confidence } } = await worker.recognize(cellCanvas);
                let char = text.toUpperCase().replace(/[^A-Z]/g, '').trim().charAt(0);
                let bestChar = char;
                let bestConfidence = confidence;
                
                // --- 智能重试：最多5次，使用不同的图像处理策略 ---
                if (confidence < 70) {
                    // 重新绘制原始图像用于后续处理
                    const ctx = cellCanvas.getContext('2d', { willReadFrequently: true });
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, 120, 120);
                    ctx.drawImage(sourceImg, sx, sy, sw, sh, 10, 10, 100, 100);
                    
                    const strategies = [
                        // 策略1: 激进二值化
                        (imgData, avgBr) => {
                            const thresh = avgBr > 160 ? 140 : 120;
                            for (let i = 0; i < imgData.data.length; i += 4) {
                                const gray = 0.299 * imgData.data[i] + 0.587 * imgData.data[i+1] + 0.114 * imgData.data[i+2];
                                const val = gray < thresh ? 0 : 255;
                                imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = val;
                            }
                        },
                        // 策略2: 更高阈值（适合深色背景）
                        (imgData, avgBr) => {
                            const thresh = avgBr > 160 ? 170 : 150;
                            for (let i = 0; i < imgData.data.length; i += 4) {
                                const gray = 0.299 * imgData.data[i] + 0.587 * imgData.data[i+1] + 0.114 * imgData.data[i+2];
                                const val = gray < thresh ? 0 : 255;
                                imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = val;
                            }
                        },
                        // 策略3: 反色处理（适合某些特殊情况）
                        (imgData, avgBr) => {
                            const thresh = avgBr > 160 ? 150 : 130;
                            for (let i = 0; i < imgData.data.length; i += 4) {
                                const gray = 0.299 * imgData.data[i] + 0.587 * imgData.data[i+1] + 0.114 * imgData.data[i+2];
                                const val = gray < thresh ? 255 : 0; // 反色
                                imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = val;
                            }
                        },
                        // 策略4: 温和阈值 + 伽马校正
                        (imgData, avgBr) => {
                            // 先应用伽马校正
                            const gamma = avgBr > 160 ? 0.8 : 1.2;
                            for (let i = 0; i < imgData.data.length; i += 4) {
                                for (let c = 0; c < 3; c++) {
                                    imgData.data[i+c] = Math.pow(imgData.data[i+c] / 255, gamma) * 255;
                                }
                            }
                            // 再二值化
                            const thresh = 130;
                            for (let i = 0; i < imgData.data.length; i += 4) {
                                const gray = 0.299 * imgData.data[i] + 0.587 * imgData.data[i+1] + 0.114 * imgData.data[i+2];
                                const val = gray < thresh ? 0 : 255;
                                imgData.data[i] = imgData.data[i+1] = imgData.data[i+2] = val;
                            }
                        }
                    ];
                    
                    // 尝试每种策略
                    for (let strategyIdx = 0; strategyIdx < strategies.length; strategyIdx++) {
                        // 重置canvas到原始图像
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, 120, 120);
                        ctx.drawImage(sourceImg, sx, sy, sw, sh, 10, 10, 100, 100);
                        
                        // 获取图像数据
                        const imageData = ctx.getImageData(0, 0, 120, 120);
                        
                        // 计算平均亮度
                        let sum = 0;
                        for (let i = 0; i < imageData.data.length; i += 4) {
                            sum += 0.299 * imageData.data[i] + 0.587 * imageData.data[i+1] + 0.114 * imageData.data[i+2];
                        }
                        const avgBrightness = sum / (imageData.data.length / 4);
                        
                        // 应用策略
                        strategies[strategyIdx](imageData, avgBrightness);
                        ctx.putImageData(imageData, 0, 0);
                        
                        // 识别
                        const result = await worker.recognize(cellCanvas);
                        const tryChar = result.data.text.toUpperCase().replace(/[^A-Z]/g, '').trim().charAt(0);
                        
                        // 更新最佳结果
                        if (tryChar && result.data.confidence > bestConfidence) {
                            bestChar = tryChar;
                            bestConfidence = result.data.confidence;
                        }
                        
                        // 如果已经达到高置信度，提前退出
                        if (bestConfidence >= 85) break;
                    }
                    
                    // 输出结果
                    if (bestConfidence > confidence) {
                        console.log(`[${r+1},${c+1}] 重试: ${char || '?'}(${Math.round(confidence)}%) → ${bestChar || '?'}(${Math.round(bestConfidence)}%)`);
                    } else {
                        console.log(`[${r+1},${c+1}] => ${bestChar || '?'} (${Math.round(bestConfidence)}%)`);
                    }
                    
                    char = bestChar;
                    confidence = bestConfidence;
                } else {
                    console.log(`[${r+1},${c+1}] => ${char || '?'} (${Math.round(confidence)}%)`);
                }

                // --- 填空（三色标记）---
                if (char && confidence >= 70) {
                    // 高置信度：直接填入，保持棋盘格底色
                    $inputs.eq(count).val(char);
                } else if (char && confidence >= 50) {
                    // 低可信度：标黄
                    $inputs.eq(count).val(char).css('background-color', '#fff59d');
                } else {
                    // 极低可信度或识别失败：标红
                    $inputs.eq(count).val(char || '').css('background-color', '#ef5350');
                }

                count++;
                // 更新进度条
                const progress = (count / 70) * 100;
                $('#ocr-bar').css('width', `${progress}%`);
                $('#ocr-status').text(`${i18n[currentLang].ocr_recognizing} ${count}/70 (${i18n[currentLang].ocr_row}${r+1} ${i18n[currentLang].ocr_col}${c+1})`);
            }
        }

        await worker.terminate();
        
        if (isProcessing) {
            $('#ocr-status').text(i18n[currentLang].ocr_complete).css('color', 'green');
            $('#btn-confirm-crop').text(i18n[currentLang].btn_done).prop('disabled', false);
            // 显示置信度提示
            $('#ocr-confidence-hint').show();
            // 给用户一点时间看最后的状态，然后跳转
            setTimeout(() => switchView('view-matrix'), 800);
        }

    } catch (err) {
        console.error(err);
        $('#ocr-status').text(i18n[currentLang].ocr_error + (err.message || err)).css('color', 'red');
        if(worker) await worker.terminate();
        $('#btn-confirm-crop').prop('disabled', false).text(i18n[currentLang].btn_retry);
    }
}

// ================= 通用辅助函数 =================
function initGrid() {
    const colLabels = ['A','B','C','D','E','F','G','H','I','J'];
    
    // 为每一行生成10个输入框
    for (let row = 1; row <= 7; row++) {
        const $rowContainer = $(`.matrix-cells[data-row="${row-1}"]`);
        let html = '';
        
        for (let colIdx = 0; colIdx < 10; colIdx++) {
            const key = `${colLabels[colIdx]},${row}`;
            html += `<input type="text" class="matrix-cell-input" data-key="${key}" placeholder="${colLabels[colIdx]}${row}" maxlength="1">`;
        }
        
        $rowContainer.html(html);
    }
}

function bindGridNavigation() {
    const $inputs = $('.matrix-cell-input');
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
            $('.matrix-cell-input').each(function() {
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
    $('.matrix-cell-input').each(function() {
        if($(this).val()) matrixMap[$(this).data('key')] = $(this).val();
    });
    chrome.storage.local.set({ 'auth_creds': { username, password }, 'matrix_map': matrixMap }, () => {
        alert(i18n[currentLang].alert_save_success);
        window.close();
    });
}

function resetAllData() {
    if(confirm(i18n[currentLang].confirm_clear)) {
        chrome.storage.local.remove(['auth_creds', 'matrix_map'], () => { alert(i18n[currentLang].alert_cleared); clearAllInputs(); });
    }
}