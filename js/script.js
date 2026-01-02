/**
 * 三等無線電刷題站 - 核心邏輯 (新版面專用)
 */
let currentAns = "", currentId = 0, isAnswered = false;
let isRecordMode = true, isWeaknessMode = false;
let sessionCorrect = 0, sessionTotal = 0;

const allCategories = [
    '無線電規章與相關法規', '無線電通訊方法', '無線電系統原理',
    '無線電相關安全防護', '電磁相容性技術', '射頻干擾的預防與排除'
];

// --- 初始化與設定 ---
function renderCategoryFilters(selectedCats) {
    const container = document.getElementById('categoryFilters');
    if (!container) return;
    container.innerHTML = allCategories.map(cat => `
        <div style="margin-bottom:6px; display:flex; align-items:center;">
            <input type="checkbox" class="cat-checkbox" value="${cat}" 
                   ${selectedCats.includes(cat) ? 'checked' : ''} onchange="saveSettings()"> 
            <span style="margin-left:8px;">${cat.replace('無線電', '')}</span>
        </div>
    `).join('');
}

function loadSettings() {
    isRecordMode = (localStorage.getItem('isRecordMode') !== 'false');
    document.getElementById('recordModeToggle').checked = isRecordMode;

    isWeaknessMode = (localStorage.getItem('isWeaknessMode') === 'true');
    document.getElementById('weaknessModeToggle').checked = isWeaknessMode;

    const savedCats = JSON.parse(localStorage.getItem('selectedCats')) || allCategories;
    renderCategoryFilters(savedCats);

    document.getElementById('customCount').value = localStorage.getItem('customCount') || "10";
    document.getElementById('customTime').value = localStorage.getItem('customTime') || "40";
}

function saveSettings() {
    isRecordMode = document.getElementById('recordModeToggle').checked;
    localStorage.setItem('isRecordMode', isRecordMode);

    isWeaknessMode = document.getElementById('weaknessModeToggle').checked;
    localStorage.setItem('isWeaknessMode', isWeaknessMode);

    const checkedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
    localStorage.setItem('selectedCats', JSON.stringify(checkedCats));

    localStorage.setItem('customCount', document.getElementById('customCount').value);
    localStorage.setItem('customTime', document.getElementById('customTime').value);
}

// --- 刷題與統計 ---
async function fetchNext() {
    isAnswered = false;
    document.getElementById('next-btn').style.display = 'none';
    document.querySelectorAll('.opt-btn').forEach(b => { b.className = 'opt-btn'; b.disabled = false; });

    const checkedCats = JSON.parse(localStorage.getItem('selectedCats')) || allCategories;
    if (checkedCats.length === 0) { alert("請在設定中勾選範圍！"); return; }

    const params = new URLSearchParams({ mode: isWeaknessMode ? 'weakness' : 'all', cats: checkedCats.join(',') });

    try {
        const res = await fetch(`get_question.php?${params.toString()}`);
        const data = await res.json();
        if (data.status === "empty") { alert(data.message); return; }

        currentId = data.id; currentAns = data.answer;
        document.getElementById('category').innerText = data.category;
        document.getElementById('q-num').innerText = `官方題號: ${data.q_num}`;
        document.getElementById('question').innerText = data.question;
        document.getElementById('optA').innerText = "A. " + data.option_a;
        document.getElementById('optB').innerText = "B. " + data.option_b;
        document.getElementById('optC').innerText = "C. " + data.option_c;
        document.getElementById('optD').innerText = "D. " + data.option_d;
    } catch (e) { console.error(e); }
}

function checkAns(choice) {
    if (isAnswered) return;
    isAnswered = true; sessionTotal++;
    
    const mapping = { 'A': 'optA', 'B': 'optB', 'C': 'optC', 'D': 'optD' };
    const isCorrect = (choice === currentAns);

    document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
    if (isCorrect) {
        document.getElementById(mapping[choice]).classList.add('correct');
        sessionCorrect++;
    } else {
        document.getElementById(mapping[choice]).classList.add('wrong');
        document.getElementById(mapping[currentAns]).classList.add('correct');
    }

    document.getElementById('session-score').innerText = `對: ${sessionCorrect} | 總: ${sessionTotal}`;

    if (isRecordMode) {
        const formData = new FormData();
        formData.append('qid', currentId);
        formData.append('status', isCorrect ? 'correct' : 'wrong');
        fetch('record_answer.php', { method: 'POST', body: formData }).then(() => updateProgressUI());
    }
    document.getElementById('next-btn').style.display = 'block';
}

async function updateProgressUI() {
    try {
        const res = await fetch('get_progress.php');
        const data = await res.json();
        document.getElementById('progressContent').innerHTML = data.map(item => `
            <div class="progress-item">
                <div class="progress-label"><span>${item.category}</span><span>${item.mastered}/${item.total}</span></div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${item.percent}%"></div></div>
            </div>`).join('');
    } catch (e) { }
}

// --- 選單控制 ---
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}

function startCustomExam() {
    const checkedCats = JSON.parse(localStorage.getItem('selectedCats')) || [];
    if (checkedCats.length === 0) { alert("請先選擇練習範圍"); return; }
    const params = new URLSearchParams({
        type: 'custom', cats: checkedCats.join(','),
        limit: document.getElementById('customCount').value,
        time: document.getElementById('customTime').value
    });
    window.location.href = `exam.php?${params.toString()}`;
}

window.onclick = (e) => {
    const panel = document.getElementById('settingsPanel');
    if (!e.target.matches('.settings-trigger') && !panel.contains(e.target)) panel.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => { loadSettings(); updateProgressUI(); fetchNext(); });