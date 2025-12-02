$(document).ready(function() {
    // 1. 初始化矩阵界面
    initMatrixUI();

    // 2. 加载已保存的数据
    loadData();

    // 3. 绑定保存按钮
    $('#save-btn').on('click', saveData);
    
    // 新增：绑定重置按钮
    $('#reset-btn').on('click', resetData);
});

function initMatrixUI() {
    const colLabels = ['A','B','C','D','E','F','G','H','I','J'];
    
    // 生成列头 (A-J)
    let headerHtml = '';
    colLabels.forEach(l => headerHtml += `<div class="col-label">${l}</div>`);
    $('.col-labels').html(headerHtml);

    // 生成行头 (1-7)
    let rowLabelHtml = '';
    for(let i=1; i<=7; i++) rowLabelHtml += `<div class="row-label">${i}</div>`;
    $('.row-labels').html(rowLabelHtml);

    // 生成格子
    let gridHtml = '';
    for(let row=1; row<=7; row++) {
        colLabels.forEach(col => {
            const key = `${col},${row}`;
            gridHtml += `<input type="text" class="matrix-input" data-key="${key}" maxlength="1">`;
        });
    }
    $('#grid-target').html(gridHtml);

    // 绑定格子输入事件
    bindMatrixEvents();
}

function bindMatrixEvents() {
    const $inputs = $('.matrix-input');

    // 输入自动大写 & 自动跳格
    $inputs.on('input', function() {
        const $this = $(this);
        const val = $this.val().toUpperCase();
        
        if (!/^[A-Z]$/.test(val)) {
            $this.val(''); 
            return;
        }
        $this.val(val);
        
        // 移动到下一个
        const idx = $inputs.index($this);
        if(idx < $inputs.length - 1) $inputs.eq(idx + 1).focus();
    });

    // 方向键导航
    $inputs.on('keydown', function(e) {
        const idx = $inputs.index(this);
        const COLS = 10;
        let nextIdx = null;

        if (e.key === 'ArrowRight') nextIdx = idx + 1;
        else if (e.key === 'ArrowLeft') nextIdx = idx - 1;
        else if (e.key === 'ArrowDown') nextIdx = idx + COLS;
        else if (e.key === 'ArrowUp') nextIdx = idx - COLS;

        if (nextIdx !== null && nextIdx >= 0 && nextIdx < $inputs.length) {
            e.preventDefault();
            $inputs.eq(nextIdx).focus().select();
        }
    });
}

function loadData() {
    chrome.storage.local.get(['auth_creds', 'matrix_map'], function(data) {
        // 填充账号密码
        if (data.auth_creds) {
            $('#username').val(data.auth_creds.username || '');
            $('#password').val(data.auth_creds.password || '');
        }

        // 填充矩阵
        if (data.matrix_map) {
            $('.matrix-input').each(function() {
                const key = $(this).data('key');
                if (data.matrix_map[key]) {
                    $(this).val(data.matrix_map[key]);
                }
            });
        }
    });
}

function saveData() {
    const username = $('#username').val().trim();
    const password = $('#password').val().trim();
    
    // 收集矩阵数据
    let matrixMap = {};
    let matrixCount = 0;
    $('.matrix-input').each(function() {
        const val = $(this).val();
        if (val) {
            matrixMap[$(this).data('key')] = val;
            matrixCount++;
        }
    });

    if (!username || !password) {
        showStatus('❌ 请填写学籍号和密码', 'red');
        return;
    }
    
    // 保存到 Chrome Storage
    chrome.storage.local.set({
        'auth_creds': { username, password },
        'matrix_map': matrixMap
    }, function() {
        showStatus('✅ 设置已保存！请刷新登录页面生效。', 'green');
    });
}

// 新增：重置数据函数
function resetData() {
    // 1. 弹出确认框，防止误触
    if (!confirm('⚠️ 确定要清空所有配置吗？\n\n这将删除已保存的学籍号、密码和矩阵表。\n此操作无法撤销。')) {
        return;
    }

    // 2. 清除 Chrome 本地存储
    // 我们指定删除 'auth_creds' 和 'matrix_map' 这两个键
    chrome.storage.local.remove(['auth_creds', 'matrix_map'], function() {
        
        // 3. 存储清除成功后，立即清空当前界面的输入框
        $('#username').val('');
        $('#password').val('');
        $('.matrix-input').val(''); // 清空所有矩阵格子

        // 4. 给用户反馈
        showStatus('🗑️ 所有配置已重置', 'red');
        
        // 可选：将焦点重置回第一个输入框
        $('#username').focus();
    });
}

function showStatus(msg, color) {
    $('#status').text(msg).css('color', color || '#333');
    setTimeout(() => $('#status').text(''), 3000);
}