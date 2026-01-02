<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>三等無線電刷題站</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="container">
    <button class="settings-trigger" onclick="toggleSettings()">⚙️</button>
    
    <div id="settingsPanel" class="settings-panel">
        <div style="font-weight:bold; margin-bottom:10px; font-size:0.9rem;">自訂練習範圍</div>
        <div id="categoryFilters" style="font-size: 0.8rem; color: #666; margin-bottom: 15px;">
        </div>

        <div class="settings-divider" style="border-top: 1px solid #EEE; margin: 15px 0;"></div>
        <div style="font-weight:bold; margin-bottom:10px; font-size:0.9rem;">自訂測驗設定</div>

        <div class="settings-item">
            <span>測驗題數</span>
            <select id="customCount" onchange="saveSettings()" style="padding: 5px; border-radius: 5px;">
                <option value="10">10 題</option>
                <option value="20">20 題</option>
                <option value="35">35 題</option>
                <option value="50">50 題</option>
            </select>
        </div>

        <div class="settings-item" style="margin-top: 10px;">
            <span>時間限制 (分)</span>
            <input type="number" id="customTime" value="40" onchange="saveSettings()" style="width: 50px; padding: 5px; border-radius: 5px; border: 1px solid #CCC;">
        </div>

        <button class="next-btn" style="display: block; background: var(--success); margin-top: 15px; font-size: 0.9rem; padding: 10px;" onclick="startCustomExam()">
            🚀 開始自訂範圍測驗
        </button>

        <div class="settings-item">
            <span>紀錄練習數據</span>
            <label class="switch">
                <input type="checkbox" id="recordModeToggle" onchange="saveSettings()">
                <span class="slider"></span>
            </label>
        </div>
        <div class="settings-item" style="margin-top: 15px;">
            <span>挑戰弱點模式</span>
            <label class="switch">
                <input type="checkbox" id="weaknessModeToggle" onchange="saveSettings()">
                <span class="slider"></span>
            </label>
        </div>
    </div>

    <div class="card">
        <div class="header-row">
            <span id="category" class="category-badge">載入中...</span>
            <span id="q-num" class="q-info">題號</span>
            <span id="session-score" style="margin-left:auto; font-size:0.8rem; color: #8E8E93;">對: 0 | 總: 0</span>
        </div>
        <div id="question" class="question">載入題目中...</div>
        <div class="options">
            <button class="opt-btn" onclick="checkAns('A')" id="optA">A. </button>
            <button class="opt-btn" onclick="checkAns('B')" id="optB">B. </button>
            <button class="opt-btn" onclick="checkAns('C')" id="optC">C. </button>
            <button class="opt-btn" onclick="checkAns('D')" id="optD">D. </button>
        </div>
        <button id="next-btn" class="next-btn" onclick="fetchNext()">下一題</button>
    </div>

    <div class="progress-panel">
        <div class="progress-title">單元掌握度 (至少答對一次)</div>
        <div id="progressContent">數據讀取中...</div>
    </div>
</div>

<script src="js/script.js"></script>
</body>
</html>