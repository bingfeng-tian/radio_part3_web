/**
 * js/exam.js
 */
let totalQuestions = 0; 

// initExam 函數內部的 API 判斷邏輯
async function initExam() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'full';
    let apiUrl = '';

    if (type === 'custom') {
        const cats = urlParams.get('cats');
        const limit = urlParams.get('limit');
        timeLeft = parseInt(urlParams.get('time')) * 60; 
        apiUrl = `get_custom_exam.php?cats=${encodeURIComponent(cats)}&limit=${limit}`;
    } else {
        apiUrl = (type === 'mini') ? 'get_exam.php?type=mini' : 'get_exam.php?type=full';
        timeLeft = 40 * 60; 
    }
    
    try {
        const res = await fetch(apiUrl);
        examQuestions = await res.json();
        
        // 更新 UI 上的總題數顯示
        totalQuestions = examQuestions.length; 
        renderQuestion();
        startTimer();
    } catch (e) {
        alert("考卷生成失敗，請檢查資料庫連線");
    }
}