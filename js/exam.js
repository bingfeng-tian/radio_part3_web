/**
 * js/exam.js
 */
async function initExam() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'full';
    
    let apiUrl = '';
    
    if (type === 'custom') {
        const cats = urlParams.get('cats');
        const limit = urlParams.get('limit');
        // 自訂時間 (分鐘轉秒)
        timeLeft = parseInt(urlParams.get('time')) * 60; 
        apiUrl = `get_custom_exam.php?cats=${encodeURIComponent(cats)}&limit=${limit}`;
    } else {
        // 預設全真模考
        apiUrl = (type === 'mini') ? 'get_exam.php?type=mini' : 'get_exam.php?type=full';
        timeLeft = 40 * 60; // 預設 40 分鐘
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