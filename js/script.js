let currentAns = "", currentId = 0, isAnswered = false;
let sessionCorrect = 0, sessionTotal = 0;
// 新增：暫存當前題目詳細資料，給 AI 用
let currentQuestionData = {}; 

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
    const container = document.getElementById('categoryFilters');
    if(container) {
        container.innerHTML = allCategories.map(cat => `
            <div style="margin-bottom:6px; display:flex; align-items:center;">
                <input type="checkbox" class="cat-checkbox" value="${cat}" ${selectedCats.includes(cat) ? 'checked' : ''} onchange="saveSettings()"> 
                <span style="margin-left:8px;">${cat.replace('無線電', '')}</span>
            </div>`).join('');
    }
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
    document.getElementById('ai-btn').style.display = 'none'; // 換題時隱藏 AI 按鈕
    document.querySelectorAll('.opt-btn').forEach(b => { b.className = 'opt-btn'; b.disabled = false; });
    
    const cats = JSON.parse(localStorage.getItem('selectedCats')) || allCategories;
    const params = new URLSearchParams({ 
        mode: localStorage.getItem('isWeaknessMode') === 'true' ? 'weakness' : 'all', 
        cats: cats.join(',') 
    });

    try {
        const res = await fetch(`get_question.php?${params.toString()}`);
        const data = await res.json();
        
        if (data.status === "empty") {
            alert(data.message || "無題目資料"); return;
        }

        // 存下來給 AI 用
        currentQuestionData = data;

        currentId = data.id; 
        currentAns = data.answer;
        document.getElementById('category').innerText = data.category;
        document.getElementById('q-num').innerText = `題號: ${data.q_num}`;
        document.getElementById('question').innerText = `${data.question} (${data.correct_count || 0}/${data.wrong_count || 0})`;
        
        // 圖片處理
        const imgContainer = document.getElementById('q-image-container');
        const imgTag = document.getElementById('q-image');
        if (data.image && data.image.trim() !== "") {
            imgTag.src = `images/${data.image}`;
            imgContainer.style.display = 'block';
        } else {
            imgContainer.style.display = 'none';
        }

        document.getElementById('optA').innerText = "A. " + data.option_a;
        document.getElementById('optB').innerText = "B. " + data.option_b;
        document.getElementById('optC').innerText = "C. " + data.option_c;
        document.getElementById('optD').innerText = "D. " + data.option_d;
    } catch (e) { console.error(e); }
}

function checkAns(choice) {
    if (isAnswered) return;
    isAnswered = true; sessionTotal++;
    
    // 紀錄使用者選了什麼
    currentQuestionData.userChoice = choice;

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
    
    // 答題後顯示按鈕
    document.getElementById('next-btn').style.display = 'block';
    document.getElementById('ai-btn').style.display = 'block';
}

// 新功能：複製並開啟 ChatGPT
function copyAndAskAI_Single() {
    const prompt = `我正在練習業餘無線電題目，請幫我解析這題：

題目：${currentQuestionData.question}
選項：
A. ${currentQuestionData.option_a}
B. ${currentQuestionData.option_b}
C. ${currentQuestionData.option_c}
D. ${currentQuestionData.option_d}

正確答案：${currentQuestionData.answer}
我的選擇：${currentQuestionData.userChoice}

請告訴我為什麼選 ${currentQuestionData.answer}，並解釋相關的無線電原理或法規觀念。`;

    navigator.clipboard.writeText(prompt).then(() => {
        if(confirm("題目與解析要求已複製！\n是否前往 ChatGPT 貼上詢問？")) {
            window.open('https://chatgpt.com/', '_blank');
        }
    }).catch(err => {
        console.error('複製失敗:', err);
        alert("複製失敗，請手動複製。");
    });
}

function toggleSettings() {
    const p = document.getElementById('settingsPanel');
    p.style.display = (p.style.display === 'block') ? 'none' : 'block';
}

function startCustomExam() {
    const params = new URLSearchParams({
        type: 'custom', 
        cats: (JSON.parse(localStorage.getItem('selectedCats')) || []).join(','),
        limit: document.getElementById('customCount').value,
        time: document.getElementById('customTime').value
    });
    window.location.href = `exam.php?${params.toString()}`;
}

async function updateProgressUI() {
    try {
        const res = await fetch('get_progress.php');
        const data = await res.json();
        const container = document.getElementById('progressContent');
        if(container) {
            container.innerHTML = data.map(item => `
                <div class="progress-item">
                    <div class="progress-label"><span>${item.category}</span><span>${item.mastered}/${item.total}</span></div>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${item.percent}%"></div></div>
                </div>`).join('');
        }
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => { loadSettings(); updateProgressUI(); fetchNext(); });