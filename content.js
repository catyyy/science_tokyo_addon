(function($) {
    'use strict';

    // 核心功能：读取存储并填表
    function runAutoFill() {
        chrome.storage.local.get(['auth_creds', 'matrix_map'], (data) => {
            const creds = data.auth_creds;
            const matrixMap = data.matrix_map;
            let didFillSomething = false; // 标记是否执行了填充操作

            // 如果没有配置，打印提示并退出
            if (!creds || !creds.username || !matrixMap) {
                console.log("[TitechAuth] 未检测到完整配置，跳过。");
                return;
            }

            // ==========================================
            // 任务 1: 尝试填入学籍号和密码 (通常是登录第一步)
            // ==========================================
            const $username = $('input[name="usr_name"]');
            const $password = $('input[name="usr_password"]');
            
            if ($username.length > 0 && $password.length > 0) {
                console.log("[TitechAuth] 检测到登录表单，正在填充...");
                $username.val(creds.username);
                $password.val(creds.password);
                didFillSomething = true;
            }

            // ==========================================
            // 任务 2: 尝试填写矩阵 (通常是登录第二步)
            // ==========================================
            // 查找整个表格行，不仅仅限制在 id="authentication" (防止ID变化)
            const $rows = $('tr'); 
            
            $rows.each(function() {
                const $tr = $(this);
                // 查找包含类似 [A,1] 文本的表头或单元格
                const text = $tr.text(); 
                
                // 正则说明：匹配方括号，中间包含字母，逗号，数字
                // 例子：Matches "[A,1]", "[ A , 1 ]"
                const match = text.match(/\[\s*([A-J])\s*,\s*(\d)\s*\]/);
                
                if (match) {
                    const key = `${match[1]},${match[2]}`; // 生成 Key，例如 "A,1"
                    const value = matrixMap[key];
                    
                    // 找到这一行里的密码框
                    const $input = $tr.find('input[type="password"], input[type="text"]');
                    
                    if ($input.length > 0 && value) {
                        console.log(`[TitechAuth] 检测到矩阵请求 ${key}，正在填充...`);
                        $input.val(value);
                        didFillSomething = true;
                    } else if (!value) {
                        console.warn(`[TitechAuth] 警告: 矩阵表中缺失坐标 ${key} 的配置`);
                    }
                }
            });

            // ==========================================
            // 任务 3: 自动提交
            // ==========================================
            if (didFillSomething) {
                // 只有当实际上填了东西才自动点击，防止误触
                setTimeout(() => {
                    const $okBtn = $('input[name="OK"]');
                    if ($okBtn.length) {
                        console.log("[TitechAuth] 正在点击 OK 按钮...");
                        $okBtn.trigger('click');
                    }
                }, 300); // 300ms 延迟，让人眼能看到填充效果，也让网页脚本有时间反应
            }
        });
    }

    // 页面加载完成后执行
    $(document).ready(function() {
        // 增加更广泛的匹配，防止URL有细微变化
        if (location.href.indexOf('GetAccess') !== -1) {
            console.log("[TitechAuth] 脚本已注入，等待页面加载...");
            // 稍微延迟执行，确保 DOM 即使是动态渲染的也能被抓取
            setTimeout(runAutoFill, 200);
        }
    });

})(jQuery);