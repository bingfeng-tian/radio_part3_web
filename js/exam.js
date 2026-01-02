let examQuestions = [], currentIndex = 0, userAnswers = [], timeLeft = 0, timerInterval = null, totalQuestions = 0;

async function initExam() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'full';
    let apiUrl = '';

    // 判斷模式
    if (type === 'custom') {
        const cats = urlParams.get('cats');
        const limit = urlParams.get('limit') || 10;
        timeLeft = parseInt(urlParams.get('time') || 40) * 60;
        apiUrl = `get_custom_exam.php?cats=${encodeURIComponent(cats)}&limit=${limit}`;
    } else if (type === 'mini') {
        timeLeft = 15 * 60; // 小測驗 15 分鐘
        apiUrl = 'get_exam.php?type=mini';
    } else {
        timeLeft = 40 * 60; // 全真模考 40 分鐘
        apiUrl = 'get_exam.php?type=full';
    }

    try {
        const res = await fetch(apiUrl);
        examQuestions = await res.json();
        
        if (!examQuestions || examQuestions.length === 0) {
            alert("題目載入失敗或範圍內無題目！"); window.location.href = 'index.php'; return;
        }

        totalQuestions = examQuestions.length;
        renderQuestion();
        startTimer();
    } catch (e) {
        console.error("API 錯誤:", e);
        alert("無法連接伺服器");
    }
}

function renderQuestion() {
    const q = examQuestions[currentIndex];
    document.getElementById('category').innerText = q.category;
    document.getElementById('exam-progress').innerText = `題號 ${currentIndex + 1} / ${totalQuestions}`;
    document.getElementById('question').innerText = q.question;
    
    // --- 圖片處理邏輯 ---
    const imgContainer = document.getElementById('q-image-container');
    const imgTag = document.getElementById('q-image');
    if (q.image && q.image.trim() !== "") {
        imgTag.src = `images/${q.image}`;
        imgContainer.style.display = 'block';
    } else {
        imgContainer.style.display = 'none';
    }
    // ------------------

    document.getElementById('optA').innerText = "A. " + q.option_a;
    document.getElementById('optB').innerText = "B. " + q.option_b;
    document.getElementById('optC').innerText = "C. " + q.option_c;
    document.getElementById('optD').innerText = "D. " + q.option_d;
}

function submitAns(choice) {
    userAnswers[currentIndex] = choice;
    if (currentIndex < totalQuestions - 1) { currentIndex++; renderQuestion(); }
    else finishExam();
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) { clearInterval(timerInterval); finishExam(); return; }
        timeLeft--;
        const min = Math.floor(timeLeft / 60), sec = timeLeft % 60;
        document.getElementById('timer').innerText = `${min}:${sec < 10 ? '0'+sec : sec}`;
        if(timeLeft < 180) document.getElementById('timer').style.color = 'red';
    }, 1000);
}

function finishExam() {
    clearInterval(timerInterval);
    let correctCount = 0, reviewHtml = '';
    
    examQuestions.forEach((q, i) => {
        const isCorrect = userAnswers[i] === q.answer;
        if (isCorrect) correctCount++;
        
        reviewHtml += `
            <div class="review-card ${isCorrect ? 'correct' : 'wrong'}" style="margin-bottom:15px; padding:12px; border-radius:10px; border-left:6px solid ${isCorrect ? '#34C759':'#FF3B30'}; background:${isCorrect ? '#E8F5E9':'#FFEBEE'};">
                <div style="font-weight:bold; margin-bottom:5px;">${i+1}. ${q.question}</div>
                
                ${q.image ? `<img src="images/${q.image}" style="max-width:150px; display:block; margin:8px 0; border:1px solid #ddd; border-radius:4px;">` : ''}
                
                <div style="font-size:0.9rem;">您的答案: ${userAnswers[i] || '未答'} | 正確: ${q.answer}</div>
                ${!isCorrect ? `<div style="font-size:0.8rem; color:#666; margin-top:5px;">選項: ${getOptionText(q, q.answer)}</div>` : ''}
            </div>`;
    });

    document.getElementById('exam-card').style.display = 'none';
    document.getElementById('result-panel').style.display = 'block';
    document.getElementById('result-score').innerText = `${correctCount} / ${totalQuestions}`;
    document.getElementById('review-list').innerHTML = reviewHtml;
    
    // 及格判定
    const isPassed = correctCount >= Math.ceil(totalQuestions * 0.714);
    const statusEl = document.getElementById('result-status');
    statusEl.innerText = isPassed ? "🎉 恭喜及格！" : "❌ 尚未及格";
    statusEl.style.color = isPassed ? "#34C759" : "#FF3B30";
}

function getOptionText(q, ans) {
    const map = { 'A': q.option_a, 'B': q.option_b, 'C': q.option_c, 'D': q.option_d };
    return map[ans] || "";
}

document.addEventListener('DOMContentLoaded', initExam);