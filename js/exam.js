let examQuestions = [], currentIndex = 0, userAnswers = [], timeLeft = 0, timerInterval = null, totalQuestions = 0;

async function initExam() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'full';
    let apiUrl = '';

    if (type === 'custom') {
        const cats = urlParams.get('cats');
        const limit = urlParams.get('limit') || 10;
        timeLeft = parseInt(urlParams.get('time') || 40) * 60;
        apiUrl = `get_custom_exam.php?cats=${encodeURIComponent(cats)}&limit=${limit}`;
    } else if (type === 'mini') {
        timeLeft = 15 * 60; 
        apiUrl = 'get_exam.php?type=mini';
    } else {
        timeLeft = 40 * 60; 
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
    
    // 清除樣式
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.style.background = ''; 
        btn.style.color = '';
        btn.style.border = '';
    });

    document.getElementById('category').innerText = q.category;
    document.getElementById('exam-progress').innerText = `題號 ${currentIndex + 1} / ${totalQuestions}`;
    document.getElementById('question').innerText = q.question;
    
    // 圖片顯示邏輯
    const imgContainer = document.getElementById('q-image-container');
    const imgTag = document.getElementById('q-image');
    if (q.image && q.image.trim() !== "") {
        imgTag.src = `images/${q.image}`;
        imgContainer.style.display = 'block';
    } else {
        imgContainer.style.display = 'none';
    }

    document.getElementById('optA').innerText = "A. " + q.option_a;
    document.getElementById('optB').innerText = "B. " + q.option_b;
    document.getElementById('optC').innerText = "C. " + q.option_c;
    document.getElementById('optD').innerText = "D. " + q.option_d;

    // 恢復該題之前的選擇
    if (userAnswers[currentIndex]) {
        highlightSelection(userAnswers[currentIndex]);
    }
}

// 點選邏輯：點第一下選取，點第二下跳題
function selectOption(choice) {
    if (userAnswers[currentIndex] === choice) {
        // 第二次點擊：跳下一題
        goToNextQuestion();
    } else {
        // 第一次點擊：記錄並變色
        userAnswers[currentIndex] = choice;
        highlightSelection(choice);
    }
}

function goToNextQuestion() {
    if (currentIndex < totalQuestions - 1) {
        currentIndex++;
        renderQuestion();
    } else {
        // *** 修正重點：最後一題直接交卷，不跳詢問視窗 ***
        finishExam();
    }
}

function highlightSelection(choice) {
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.style.background = ''; 
        btn.style.color = '';
        btn.style.border = '';
    });

    const map = { 'A': 'optA', 'B': 'optB', 'C': 'optC', 'D': 'optD' };
    const selectedBtn = document.getElementById(map[choice]);
    if (selectedBtn) {
        selectedBtn.style.background = '#007AFF';
        selectedBtn.style.color = 'white';
        selectedBtn.style.border = '2px solid #005bb5';
    }
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
    clearInterval(timerInterval); // 停止計時
    let correctCount = 0, reviewHtml = '';
    
    // 檢查是否有題目數據，避免崩潰
    if (!examQuestions || examQuestions.length === 0) {
        alert("發生錯誤：沒有題目數據"); return;
    }

    examQuestions.forEach((q, i) => {
        const userChoice = userAnswers[i] || "未作答";
        const isCorrect = userChoice === q.answer;
        if (isCorrect) correctCount++;
        
        // 字串處理
        const qSafe = (q.question || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const optA = (q.option_a || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const optB = (q.option_b || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const optC = (q.option_c || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const optD = (q.option_d || "").replace(/'/g, "\\'").replace(/"/g, '&quot;');

        reviewHtml += `
            <div class="review-card ${isCorrect ? 'correct' : 'wrong'}" style="margin-bottom:15px; padding:12px; border-radius:10px; border-left:6px solid ${isCorrect ? '#34C759':'#FF3B30'}; background:${isCorrect ? '#E8F5E9':'#FFEBEE'};">
                <div style="font-weight:bold; margin-bottom:5px;">${i+1}. ${q.question}</div>
                ${q.image ? `<img src="images/${q.image}" style="max-width:150px; display:block; margin:8px 0; border:1px solid #ddd; border-radius:4px;">` : ''}
                <div style="font-size:0.9rem;">您的答案: ${userChoice} | 正確: ${q.answer}</div>
                <button onclick="copyAndAskAI_Exam('${qSafe}', '${optA}', '${optB}', '${optC}', '${optD}', '${userChoice}', '${q.answer}')" 
                    style="margin-top:8px; background:#fff; border:1px solid #ccc; border-radius:6px; padding:5px 10px; font-size:0.8rem; cursor:pointer; color:#333;">
                    📋 複製問 AI
                </button>
            </div>`;
    });

    // *** 顯示結果面板 (最關鍵的部分) ***
    const card = document.getElementById('exam-card');
    const panel = document.getElementById('result-panel');
    const reviewList = document.getElementById('review-list');
    
    if (panel && reviewList) {
        card.style.display = 'none'; // 隱藏題目
        panel.style.display = 'block'; // 顯示結果
        
        document.getElementById('result-score').innerText = `${correctCount} / ${totalQuestions}`;
        reviewList.innerHTML = reviewHtml;
        
        const isPassed = correctCount >= Math.ceil(totalQuestions * 0.714);
        const statusEl = document.getElementById('result-status');
        statusEl.innerText = isPassed ? "🎉 恭喜及格！" : "❌ 尚未及格";
        statusEl.style.color = isPassed ? "#34C759" : "#FF3B30";
        
        // 滾動到最上方看分數
        window.scrollTo(0, 0);
    } else {
        console.error("找不到 result-panel，請檢查 exam.php 是否有該區塊！");
        alert("測驗結束，但無法顯示結果面板 (HTML 缺失)");
    }
}

/**
 * 1. 核心複製功能：結合現代 API 與舊版相容模式
 */
function copyToClipboard(text) {
    // 優先嘗試現代 API (需 HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert("✅ 題目已複製！\n您可以自行切換至 AI 貼上。");
        }).catch(() => {
            // 若失敗 (例如非 HTTPS)，轉用 Fallback
            fallbackCopy(text);
        });
    } else {
        // 舊版瀏覽器或 HTTP 環境
        fallbackCopy(text);
    }
}

/**
 * 2. 強力舊版複製 (針對手機優化)
 */
function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 避免手機鍵盤彈出與畫面跳動
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.setAttribute("readonly", ""); 
    document.body.appendChild(textArea);

    // 針對 iOS (iPhone/iPad) 的特殊選取處理
    if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
    } else {
        textArea.select();
    }

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("✅ 題目已複製！ (相容模式)");
        } else {
            alert("❌ 複製失敗，請長按文字手動複製。");
        }
    } catch (err) {
        alert("❌ 瀏覽器不支援複製功能");
    }

    document.body.removeChild(textArea);
}

/**
 * 3. 測驗頁面的按鈕觸發函式 (不跳轉)
 */
function copyAndAskAI_Exam(q, a, b, c, d, userAns, correctAns) {
    const prompt = `我正在檢討無線電考試錯題，請幫我解析：\n\n題目：${q}\n選項：\nA. ${a}\nB. ${b}\nC. ${c}\nD. ${d}\n\n正確答案：${correctAns}\n我的選擇：${userAns}\n\n請解釋為什麼答案是 ${correctAns}，以及為什麼我選的答案不正確。`;

    copyToClipboard(prompt);
}

// 通用複製函式：同時支援電腦與手機 (包含無 HTTPS 環境)
function copyToClipboardRobust(text, callback) {
    // 嘗試 1: 使用現代 API (需要 HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            if (callback) callback(true);
        }).catch(err => {
            console.warn("Clipboard API failed, trying fallback...", err);
            fallbackCopy(text, callback);
        });
    } else {
        // 嘗試 2: 使用舊版 Fallback (支援 HTTP)
        fallbackCopy(text, callback);
    }
}

// 舊版複製方法 (透過隱藏的 textarea)
function fallbackCopy(text, callback) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // 確保手機上不會跳出鍵盤或捲動
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (callback) callback(successful);
    } catch (err) {
        console.error("Fallback copy failed", err);
        if (callback) callback(false);
    }
}

document.addEventListener('DOMContentLoaded', initExam);