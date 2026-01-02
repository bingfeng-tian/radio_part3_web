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
        <div style="font-weight:bold; margin-bottom:12px; font-size:1rem; color:var(--primary);">功能與設定</div>
        
        <div style="display: flex; gap: 8px; margin-bottom: 15px;">
            <button class="small-btn" style="background: #FF9500;" onclick="window.location.href='exam.php?type=full'">📝 全真模考</button>
            <button class="small-btn" style="background: #5856D6;" onclick="window.location.href='exam.php?type=mini'">⚡ 小測驗</button>
        </div>

        <div class="settings-divider"></div>
        <div id="categoryFilters" style="font-size: 0.85rem; color: #333; margin-bottom: 15px;"></div>

        <div class="settings-item">
            <span>紀錄練習數據</span>
            <label class="switch"><input type="checkbox" id="recordModeToggle" onchange="saveSettings()"><span class="slider"></span></label>
        </div>
        <div class="settings-item" style="margin-top: 10px;">
            <span>挑戰弱點模式</span>
            <label class="switch"><input type="checkbox" id="weaknessModeToggle" onchange="saveSettings()"><span class="slider"></span></label>
        </div>

        <div class="settings-divider"></div>
        <div class="settings-item">
            <span>題數</span>
            <select id="customCount" onchange="saveSettings()">
                <option value="10">10 題</option><option value="20">20 題</option><option value="35">35 題</option>
            </select>
            <span style="margin-left:10px;">時間</span>
            <input type="number" id="customTime" value="40" onchange="saveSettings()" style="width: 45px;">
        </div>
        <button class="next-btn" style="display: block; background: var(--success); margin-top: 15px; font-size: 0.9rem; padding: 10px;" onclick="startCustomExam()">🚀 開始自訂測驗</button>
    </div>

    <div class="card">
        <div class="header-row">
            <span id="category" class="category-badge">載入中...</span>
            <span id="q-num" class="q-info">題號</span>
            <span id="session-score" style="margin-left:auto; font-size:0.8rem; color: #8E8E93;">對: 0 | 總: 0</span>
        </div>
        <div id="question" class="question">載入題目中...</div>
        
        <div id="q-image-container" style="text-align: center; margin-bottom: 20px; display: none;">
            <img id="q-image" src="" style="max-width: 100%; border-radius: 8px; border: 1px solid #eee;">
        </div>

        <div class="options">
            <button class="opt-btn" onclick="checkAns('A')" id="optA">A. </button>
            <button class="opt-btn" onclick="checkAns('B')" id="optB">B. </button>
            <button class="opt-btn" onclick="checkAns('C')" id="optC">C. </button>
            <button class="opt-btn" onclick="checkAns('D')" id="optD">D. </button>
        </div>
        <button id="next-btn" class="next-btn" onclick="fetchNext()">下一題</button>
    </div>

    <details class="progress-details">
        <summary class="progress-summary">📊 點擊查看單元掌握進度</summary>
        <div id="progressContent" class="progress-content">數據讀取中...</div>
    </details>
</div>

<script src="js/script.js"></script>
</body>
</html>