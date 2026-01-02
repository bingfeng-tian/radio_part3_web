<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>三等無線電測驗模式</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <div class="header-row" style="justify-content: space-between; background: white; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
        <span id="timer" style="font-weight: bold; color: var(--error); font-size: 1.1rem;">剩餘時間 40:00</span>
        <span id="exam-progress" style="font-weight: bold; color: var(--primary);">題號 1 / 35</span>
    </div>

    <div id="exam-card" class="card">
        <div class="header-row">
            <span id="category" class="category-badge">讀取中...</span>
        </div>
        <div id="question" class="question">正在準備考卷...</div>
        <div class="options">
            <button class="opt-btn" onclick="submitAns('A')" id="optA">A. </button>
            <button class="opt-btn" onclick="submitAns('B')" id="optB">B. </button>
            <button class="opt-btn" onclick="submitAns('C')" id="optC">C. </button>
            <button class="opt-btn" onclick="submitAns('D')" id="optD">D. </button>
        </div>
    </div>

    <div id="result-panel" class="card" style="display: none; text-align: center;">
        <h2 id="result-status">測驗結束</h2>
        <div id="result-score" style="font-size: 3rem; font-weight: bold; margin: 20px 0;">0 / 35</div>
        <p id="result-msg">及格門檻：25 題</p>
        <button class="next-btn" style="display: block;" onclick="window.location.href='index.php'">回到主頁練習</button>
    </div>
</div>
<script src="js/exam.js"></script>
</body>
</html>