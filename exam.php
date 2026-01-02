<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>三等無線電測驗</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="container">
    <div class="header-row" style="justify-content: space-between; background: white; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
        <span id="timer" style="font-weight: bold; color: var(--error);">40:00</span>
        <span id="exam-progress" style="font-weight: bold; color: var(--primary);">題號 -- / --</span>
    </div>

    <div id="exam-card" class="card">
        <div id="category" class="category-badge" style="margin-bottom:10px; display:inline-block;">載入中</div>
        <div id="question" class="question">載入考卷中...</div>
        <div id="q-image-container" style="text-align: center; margin-bottom: 20px; display: none;">
            <img id="q-image" src="" style="max-width: 100%; border-radius: 8px;">
        </div>
        <div class="options">
            <button class="opt-btn" onclick="submitAns('A')" id="optA">A.</button>
            <button class="opt-btn" onclick="submitAns('B')" id="optB">B.</button>
            <button class="opt-btn" onclick="submitAns('C')" id="optC">C.</button>
            <button class="opt-btn" onclick="submitAns('D')" id="optD">D.</button>
        </div>
    </div>

    <div id="result-panel" class="card" style="display: none; text-align: center;">
        <h2 id="result-status">測驗結束</h2>
        <div id="result-score" style="font-size: 3rem; font-weight: bold; margin: 10px 0; color: var(--primary);">0 / 0</div>
        <div id="exam-review" style="text-align: left; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="margin-bottom: 15px;">📜 題目回顧</h3>
            <div id="review-list"></div>
        </div>
        <button class="next-btn" onclick="window.location.href='index.php'">回到主頁</button>
    </div>
</div>
<script src="js/exam.js"></script>
</body>
</html>