let currentAns = "", currentId = 0, isAnswered = false;
let sessionCorrect = 0, sessionTotal = 0;
const allCategories = ['無線電規章與相關法規', '無線電通訊方法', '無線電系統原理', '無線電相關安全防護', '電磁相容性技術', '射頻干擾的預防與排除'];

function loadSettings() {
    document.getElementById('recordModeToggle').checked = (localStorage.getItem('isRecordMode') !== 'false');
    document.getElementById('weaknessModeToggle').checked = (localStorage.getItem('isWeaknessMode') === 'true');
    const savedCats = JSON.parse(localStorage.getItem('selectedCats')) || allCategories;
    renderCategoryFilters(savedCats);
    document.getElementById('customCount').value = localStorage.getItem('customCount') || "10";
    document.getElementById('customTime').value = localStorage.getItem('customTime') || "40";
}

function renderCategoryFilters(selectedCats) {
    document.getElementById('categoryFilters').innerHTML = allCategories.map(cat => `
        <div style="margin-bottom:6px; display:flex; align-items:center;">
            <input type="checkbox" class="cat-checkbox" value="${cat}" ${selectedCats.includes(cat) ? 'checked' : ''} onchange="saveSettings()"> 
            <span style="margin-left:8px;">${cat.replace('無線電', '')}</span>
        </div>`).join('');
}

function saveSettings() {
    localStorage.setItem('isRecordMode', document.getElementById('recordModeToggle').checked);
    localStorage.setItem('isWeaknessMode', document.getElementById('weaknessModeToggle').checked);
    const checkedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
    localStorage.setItem('selectedCats', JSON.stringify(checkedCats));
    localStorage.setItem('customCount', document.getElementById('customCount').value);
    localStorage.setItem('customTime', document.getElementById('customTime').value);
}

async function fetchNext() {
    isAnswered = false;
    document.getElementById('next-btn').style.display = 'none';
    document.querySelectorAll('.opt-btn').forEach(b => { 
        b.className = 'opt-btn'; 
        b.disabled = false; 
    });

    const cats = JSON.parse(localStorage.getItem('selectedCats')) || allCategories;
    const params = new URLSearchParams({
        mode: isWeaknessMode ? 'weakness' : 'all',
        cats: cats.join(',')
    });

    try {
        const res = await fetch(`get_question.php?${params.toString()}`);
        const data = await res.json();
        
        if (data.status === "empty") {
            alert(data.message); return;
        }

        currentId = data.id;
        currentAns = data.answer;
        document.getElementById('category').innerText = data.category;
        document.getElementById('q-num').innerText = `官方題號: ${data.q_num}`;
        
        // 1. 顯示題目內容 + 對錯次數
        document.getElementById('question').innerText = `${data.question} (${data.correct_count || 0}/${data.wrong_count || 0})`;
        
        // 2. 顯示/隱藏圖片邏輯
        const imgContainer = document.getElementById('q-image-container');
        const imgTag = document.getElementById('q-image');
        if (data.image && data.image !== "") {
            imgTag.src = `images/${data.image}`; // 確保 images 資料夾內有 t1.png, t2.png, t3.png
            imgContainer.style.display = 'block';
        } else {
            imgContainer.style.display = 'none';
        }

        document.getElementById('optA').innerText = "A. " + data.option_a;
        document.getElementById('optB').innerText = "B. " + data.option_b;
        document.getElementById('optC').innerText = "C. " + data.option_c;
        document.getElementById('optD').innerText = "D. " + data.option_d;
    } catch (e) {
        console.error("Fetch 發生錯誤:", e);
    }
}

function checkAns(choice) {
    if (isAnswered) return;
    isAnswered = true; sessionTotal++;
    const isCorrect = (choice === currentAns);
    const mapping = { 'A': 'optA', 'B': 'optB', 'C': 'optC', 'D': 'optD' };
    
    document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
    document.getElementById(mapping[choice]).classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) document.getElementById(mapping[currentAns]).classList.add('correct');
    
    if (isCorrect) sessionCorrect++;
    document.getElementById('session-score').innerText = `對: ${sessionCorrect} | 總: ${sessionTotal}`;

    if (localStorage.getItem('isRecordMode') !== 'false') {
        const formData = new FormData();
        formData.append('qid', currentId);
        formData.append('status', isCorrect ? 'correct' : 'wrong');
        fetch('record_answer.php', { method: 'POST', body: formData }).then(() => updateProgressUI());
    }
    document.getElementById('next-btn').style.display = 'block';
}

function toggleSettings() {
    const p = document.getElementById('settingsPanel');
    p.style.display = (p.style.display === 'block') ? 'none' : 'block';
}

function startCustomExam() {
    const params = new URLSearchParams({
        type: 'custom', cats: (JSON.parse(localStorage.getItem('selectedCats')) || []).join(','),
        limit: document.getElementById('customCount').value,
        time: document.getElementById('customTime').value
    });
    window.location.href = `exam.php?${params.toString()}`;
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
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => { loadSettings(); updateProgressUI(); fetchNext(); });