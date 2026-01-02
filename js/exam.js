let examQuestions = [], currentIndex = 0, userAnswers = [], timeLeft = 0, timerInterval = null, totalQuestions = 0;

async function initExam() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'full';
    let apiUrl = '';

    if (type === 'custom') {
        timeLeft = parseInt(urlParams.get('time') || 40) * 60;
        apiUrl = `get_custom_exam.php?cats=${encodeURIComponent(urlParams.get('cats'))}&limit=${urlParams.get('limit')}`;
    } else {
        timeLeft = (type === 'mini' ? 15 : 40) * 60;
        apiUrl = `get_exam.php?type=${type}`;
    }

    const res = await fetch(apiUrl);
    examQuestions = await res.json();
    totalQuestions = examQuestions.length;
    renderQuestion();
    startTimer();
}

function renderQuestion() {
    const q = examQuestions[currentIndex];
    document.getElementById('category').innerText = q.category;
    document.getElementById('exam-progress').innerText = `題號 ${currentIndex + 1} / ${totalQuestions}`;
    document.getElementById('question').innerText = q.question;
    
    const imgContainer = document.getElementById('q-image-container');
    const imgTag = document.getElementById('q-image');
    if (q.image) { imgTag.src = `images/${q.image}`; imgContainer.style.display = 'block'; }
    else { imgContainer.style.display = 'none'; }

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
    }, 1000);
}

function finishExam() {
    clearInterval(timerInterval);
    let correctCount = 0, reviewHtml = '';
    examQuestions.forEach((q, i) => {
        const isCorrect = userAnswers[i] === q.answer;
        if (isCorrect) correctCount++;
        reviewHtml += `
            <div style="margin-bottom:15px; padding:12px; border-radius:10px; border-left:6px solid ${isCorrect ? '#34C759':'#FF3B30'}; background:${isCorrect ? '#E8F5E9':'#FFEBEE'};">
                <div style="font-weight:bold; margin-bottom:5px;">${i+1}. ${q.question}</div>
                ${q.image ? `<img src="images/${q.image}" style="max-width:100px; display:block; margin:5px 0;">` : ''}
                <div style="font-size:0.9rem;">您的答案: ${userAnswers[i] || '未答'} | 正確: ${q.answer}</div>
            </div>`;
    });
    document.getElementById('exam-card').style.display = 'none';
    document.getElementById('result-panel').style.display = 'block';
    document.getElementById('result-score').innerText = `${correctCount} / ${totalQuestions}`;
    document.getElementById('review-list').innerHTML = reviewHtml;
}

document.addEventListener('DOMContentLoaded', initExam);