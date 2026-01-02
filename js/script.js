/**
 * 三等無線電刷題站 - 核心邏輯
 * 包含：模式設定、自訂分類篩選、非同步取題、數據紀錄
 */

// --- 全域變數定義 ---
let currentAns = "";     // 儲存當前題目的正確答案 (A/B/C/D)
let currentId = 0;      // 儲存當前題目的資料庫唯一 ID
let isAnswered = false;  // 標記該題是否已回答，防止重複點擊
let isRecordMode = true; // 設定：是否紀錄練習數據到資料庫
let isWeaknessMode = false; // 設定：是否僅抽取錯題
let sessionCorrect = 0;  // 本次練習答對數
let sessionTotal = 0;    // 本次練習總題數

// 官方定義的六大分類名稱
const allCategories = [
    '無線電規章與相關法規', '無線電通訊方法', '無線電系統原理',
    '無線電相關安全防護', '電磁相容性技術', '射頻干擾的預防與排除'
];

// --- 1. 設定與初始化邏輯 ---

/**
 * 載入使用者偏好
 * localStorage 只能存字串，所以陣列需要用 JSON.parse 轉回物件
 */
function loadSettings() {
    // 載入紀錄模式 (預設開啟)
    const savedRecord = localStorage.getItem('isRecordMode');
    isRecordMode = savedRecord === null ? true : (savedRecord === 'true');
    document.getElementById('recordModeToggle').checked = isRecordMode;

    // 載入挑戰弱點模式 (預設關閉)
    const savedWeak = localStorage.getItem('isWeaknessMode');
    isWeaknessMode = savedWeak === 'true'; 
    document.getElementById('weaknessModeToggle').checked = isWeaknessMode;

    // 載入自訂分類範圍 (若無則全選)
    const savedCats = JSON.parse(localStorage.getItem('selectedCats')) || allCategories;
    renderCategoryFilters(savedCats);
}

/**
 * 動態生成分類勾選 UI
 * @param {Array} selectedCats 已選取的類別陣列
 */
function renderCategoryFilters(selectedCats) {
    const container = document.getElementById('categoryFilters');
    if (!container) return;

    container.innerHTML = allCategories.map(cat => `
        <div style="margin-bottom:5px; display:flex; align-items:center;">
            <input type="checkbox" class="cat-checkbox" value="${cat}" 
                   ${selectedCats.includes(cat) ? 'checked' : ''} onchange="saveSettings()"> 
            <span style="margin-left:5px;">${cat.replace('無線電', '')}</span>
        </div>
    `).join('');
}

/**
 * 儲存當前 UI 狀態到 localStorage
 */
function saveSettings() {
    isRecordMode = document.getElementById('recordModeToggle').checked;
    localStorage.setItem('isRecordMode', isRecordMode);

    isWeaknessMode = document.getElementById('weaknessModeToggle').checked;
    localStorage.setItem('isWeaknessMode', isWeaknessMode);

    // 讀取所有被勾選的 checkbox，轉成陣列存入 localStorage
    const checkedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked'))
                             .map(cb => cb.value);
    localStorage.setItem('selectedCats', JSON.stringify(checkedCats));
    
    // 注意：這裡不主動 fetchNext，讓使用者設定完關閉面板後再手動或下一題時生效
}

// --- 2. 題目獲取邏輯 ---

/**
 * 向後端 PHP 要求下一道題目
 * 使用 URLSearchParams 處理字串編碼，避免特殊字元造成請求失敗
 */
async function fetchNext() {
    isAnswered = false;
    document.getElementById('next-btn').style.display = 'none';
    
    // 重設選項按鈕樣式
    document.querySelectorAll('.opt-btn').forEach(b => { 
        b.className = 'opt-btn'; 
        b.disabled = false; 
    });

    // 準備請求參數
    const checkedCats = JSON.parse(localStorage.getItem('selectedCats')) || allCategories;
    const params = new URLSearchParams({
        mode: isWeaknessMode ? 'weakness' : 'all',
        cats: checkedCats.join(',')
    });

    try {
        const res = await fetch(`get_question.php?${params.toString()}`);
        const data = await res.json();
        
        if (data.status === "empty") {
            alert(data.message || "目前的篩選範圍內沒有題目紀錄。");
            return;
        }

        // 更新題目內容與分類標籤
        currentId = data.id;
        currentAns = data.answer;
        document.getElementById('category').innerText = data.category;
        document.getElementById('q-num').innerText = `官方題號: ${data.q_num}`;
        document.getElementById('question').innerText = data.question;
        document.getElementById('optA').innerText = "A. " + data.option_a;
        document.getElementById('optB').innerText = "B. " + data.option_b;
        document.getElementById('optC').innerText = "C. " + data.option_c;
        document.getElementById('optD').innerText = "D. " + data.option_d;
    } catch (e) {
        console.error("Fetch 發生錯誤:", e);
    }
}

function startCustomExam() {
    const checkedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
    const count = document.getElementById('customCount').value;
    const time = document.getElementById('customTime').value;

    if (checkedCats.length === 0) {
        alert("請至少選擇一個分類！");
        return;
    }

    // 將設定透過 URL 帶到測驗頁面
    const params = new URLSearchParams({
        type: 'custom',
        cats: checkedCats.join(','),
        limit: count,
        time: time
    });

    window.location.href = `exam.php?${params.toString()}`;
}

// 修改 loadSettings 也要讀取題數與時間
function loadSettings() {
    // ... 原有的紀錄模式、弱點模式載入 ...
    
    const savedCount = localStorage.getItem('customCount') || "10";
    const savedTime = localStorage.getItem('customTime') || "40";
    document.getElementById('customCount').value = savedCount;
    document.getElementById('customTime').value = savedTime;
}

function saveSettings() {
    // ... 原有的儲存邏輯 ...
    localStorage.setItem('customCount', document.getElementById('customCount').value);
    localStorage.setItem('customTime', document.getElementById('customTime').value);
}

// --- 3. 答題與數據同步邏輯 ---

/**
 * 使用者點擊選項
 * @param {string} choice 使用者選的 A/B/C/D
 */
function checkAns(choice) {
    if (isAnswered) return;
    isAnswered = true;
    sessionTotal++;

    const mapping = { 'A': 'optA', 'B': 'optB', 'C': 'optC', 'D': 'optD' };
    const selectedBtn = document.getElementById(mapping[choice]);
    const correctBtn = document.getElementById(mapping[currentAns]);
    const isCorrect = (choice === currentAns);

    // 鎖定按鈕，顯示對錯顏色
    document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        sessionCorrect++;
    } else {
        selectedBtn.classList.add('wrong');
        correctBtn.classList.add('correct');
    }

    // 更新 Session 即時分數
    document.getElementById('session-score').innerText = `對: ${sessionCorrect} | 總: ${sessionTotal}`;

    // 如果開啟紀錄模式，呼叫 API 更新資料庫
    if (isRecordMode) {
        const formData = new FormData();
        formData.append('qid', currentId);
        formData.append('status', isCorrect ? 'correct' : 'wrong');
        
        fetch('record_answer.php', { method: 'POST', body: formData })
            .then(() => updateProgressUI()); // 同步更新下方的進度條面板
    }

    document.getElementById('next-btn').style.display = 'block';
}

/**
 * 取得最新的進度數據並刷新進度條面板
 */
async function updateProgressUI() {
    try {
        const res = await fetch('get_progress.php');
        const data = await res.json();
        let html = '';
        data.forEach(item => {
            html += `
                <div class="progress-item">
                    <div class="progress-label">
                        <span>${item.category}</span>
                        <span>${item.mastered} / ${item.total}</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${item.percent}%"></div>
                    </div>
                </div>`;
        });
        document.getElementById('progressContent').innerHTML = html;
    } catch (e) {
        console.error("無法更新進度面板");
    }
}

// --- 4. 事件監聽與選單控制 ---

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}

// 點擊面板外範圍自動關閉設定選單
window.onclick = function(event) {
    const panel = document.getElementById('settingsPanel');
    if (!event.target.matches('.settings-trigger') && !panel.contains(event.target)) {
        panel.style.display = 'none';
    }
}

// DOM 載入完成後啟動系統
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    updateProgressUI();
    fetchNext();
});