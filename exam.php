<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>三等無線電測驗</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="container">
    <div class="header-row" style="justify-content: space-between; background: white; padding: 15px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <span id="timer" style="font-weight: bold; color: var(--error); font-size: 1.1rem;">--:--</span>
        <span id="exam-progress" style="font-weight: bold; color: var(--primary); font-size: 1rem;">題號 -- / --</span>
    </div>

    <div id="exam-card" class="card">
        <div class="header-row">
            <span id="category" class="category-badge">載入中</span>
        </div>
        
        <div id="question" class="question">載入考卷中...</div>
        
        <div id="q-image-container" style="text-align: center; margin-bottom: 20px; display: none;">
            <img id="q-image" src="" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #eee;">
        </div>

        <div class="options">
            <button class="opt-btn" onclick="selectOption('A')" id="optA">A.</button>
            <button class="opt-btn" onclick="selectOption('B')" id="optB">B.</button>
            <button class="opt-btn" onclick="selectOption('C')" id="optC">C.</button>
            <button class="opt-btn" onclick="selectOption('D')" id="optD">D.</button>
        </div>
    </div>

    <div id="result-panel" class="card" style="display: none; text-align: center;">
        <h2 id="result-status" style="margin-bottom: 10px;">測驗結束</h2>
        
        <div style="font-size: 1rem; color: #666;">您的得分</div>
        <div id="result-score" style="font-size: 3.5rem; font-weight: bold; margin: 5px 0 20px 0; color: var(--primary);">0 / 0</div>
        
        <div id="exam-review" style="text-align: left; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="margin-bottom: 15px; color: #333;">📜 答題回顧</h3>
            <div id="review-list"></div>
        </div>
        
        <button class="next-btn" style="background-color: #5856D6; margin-top: 20px;" onclick="window.location.href='index.php'">🏠 回到主頁</button>
    </div>
</div>

<script src="assets/js/exam.js"></script>
</body>
</html>