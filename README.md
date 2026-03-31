# 業餘無線電三等考試練習系統

<<<<<<< HEAD
準備業餘無線電三等執照考試時，找不到一個介面順手、又能針對弱點練習的工具。
現有的系統大多只有題目和答案，碰到法規或電路題看完答案還是不懂為什麼。

所以我決定自己做一個，順便把一直想練的 PHP + MySQL 全端開發實際跑一遍。
這是我第一個從需求、設計到上線都獨立完成的 Web 專案。
=======
github link: https://github.com/bingfeng-tian/radio_part3_web
## 開發動機與背景

隨著業餘無線電活動的普及，報考執照的人數日益增加，然而在準備過程中發現以下痛點：

1. 現有工具不足： 缺乏專門針對最新題庫開發、且介面友善的網頁版練習系統。
2. 即時回饋匱乏： 傳統題庫僅提供正確答案，遇到複雜的法規或電子電路概念時，往往需花費大量時間查閱資料。
3. 客製化需求： 希望能有一套系統能根據個人學習進度，自由切換單題練習或模擬考試模式。

基於上述原因，本計畫決定開發一套專為考生設計的輕量化 Web 應用。除了基礎的測驗功能外，更進一步結合 AI 技術提供自動化解析，旨在提升學習效率，讓考生能更精準地掌握考試重點。

## 🚀 核心功能

* **單題練習模式 (`index.php`)**：
* **即時反饋**：作答後立即顯示正確答案，並記錄本次練習的對錯狀況。

 <img src="./ScreenShot/image_01.png" alt="圖片" width="330">
 <img src="./ScreenShot/image_ans.png" alt="圖片" width="300">

* **分類篩選**：可自由勾選六大題庫分類進行針對性練習。
* **弱點模式**：系統會自動篩選過去曾答錯的題目優先出現。

* **模擬測驗模式 (`exam.php`)**：
* **多種模式**：支援「15題速測」、「35題全真模考」及「自訂題數與時間」。
* **倒數計時**：模擬真實考試時間壓力。
  
<img src="./ScreenShot/image_fullmode.png" alt="模擬真實測驗" width="300">
<img src="./ScreenShot/image_minimode.png" alt="模擬真實測驗" width="250">

* **考後檢討**：自動計算分數（及格標準為 71.4%），並列出所有錯題詳細清單。

<img src="./ScreenShot/image_endexam.png" alt="模擬真實測驗" width="200">
  
* **AI 解析輔助**：
* 提供一鍵「📋 複製問 AI」功能。
* 針對行動裝置優化複製邏輯，自動生成包含題目、選項、使用者選擇及正確答案的 Prompt，方便貼至 AI 工具獲取原理說明。
* <img src="./ScreenShot/image_askAI.png" alt="問AI" width="200">

## 📂 專案架構

本專案採用邏輯與資源分離的架構，以提升安全性與維護性：

```text
/radio_part3_web/
├── index.php             # 練習模式主頁面
├── exam.php              # 模擬測驗主頁面
├── api/                  # 後端資料接口 (PHP)
│   ├── get_question.php  # 獲取單題資料
│   ├── get_exam.php      # 獲取測驗題組
│   └── record_answer.php # 記錄答題狀況
├── assets/               # 靜態資源
│   ├── css/              # 樣式表 (style.css)
│   ├── js/               # 前端邏輯 (script.js, exam.js)
│   └── images/           # 題目附圖 (如 t1.png, t2.png)
├── config/               # 系統配置
│   └── db.php            # 資料庫連線設定
├── data/                 # 資料備份
│   └── questions.sql.bak # SQL 題庫備份檔
└── includes/             # 共用元件 (預留)

```

## 🛡️ 安全性說明

* **目錄防護**：根目錄及各資源目錄已透過 `.htaccess` 設定 `Options -Indexes`，禁止列出檔案清單。
* **敏感資料保護**：`data/` 與 `config/` 資料夾設定為完全禁止外部存取（`Deny from all`），保護資料庫帳密與 SQL 備份。
* **報錯控制**：資料庫連線已關閉詳細錯誤顯示，避免暴露路徑資訊。
* **SQL 注入防護**：API 接收參數皆經過過濾處理。

## 🛠️ 安裝環境要求

1. **Web 伺服器**：Apache (建議開啟 `mod_rewrite` 以支援 `.htaccess`)。
2. **PHP 版本**：PHP 7.0 或以上。
3. **資料庫**：MySQL / MariaDB。

## 🔧 安裝步驟

1. 將所有檔案上傳至伺服器目錄。
2. 在 MySQL 中建立名為 `quiz_db` 的資料庫。
3. 匯入 `data/questions.sql.bak` 中的 SQL 指令以建立題庫。
4. 修改 `config/db.php` 中的資料庫帳號與密碼。
5. 確保 `assets/images/` 權限正確，以便讀取題目圖片。
>>>>>>> e17b3e84450b6122426c83419dbce8ba99c89a45

---

## 功能說明

**單題練習模式**

- 作答後立即顯示正確答案並記錄對錯
- 可勾選六大分類做針對性練習
- 弱點模式：自動優先出現曾答錯的題目

<img src="./ScreenShot/image_01.png" width="330">
<img src="./ScreenShot/image_ans.png" width="300">

**模擬測驗模式**

- 支援 15 題速測、35 題全真模考、自訂題數與時間
- 倒數計時模擬真實考場壓力
- 考後自動計算分數（及格標準 71.4%）並列出錯題清單

<img src="./ScreenShot/image_fullmode.png" width="300">
<img src="./ScreenShot/image_minimode.png" width="250">
<img src="./ScreenShot/image_endexam.png" width="200">

**AI 解析輔助**

- 一鍵複製題目、選項、作答與正確答案，生成可直接貼給 AI 的 Prompt
- 針對行動裝置優化複製邏輯

<img src="./ScreenShot/image_askAI.png" width="200">

---

## 開發過程遇到的問題

**弱點模式的篩選邏輯**
一開始用 Session 記錄答錯題號，但重新整理後資料就消失了。
後來改用資料庫記錄每題的答對／答錯次數，弱點模式才真正能跨次練習累積。

**SQL 注入防護**
開發初期沒有特別處理 API 的輸入參數，後來補上過濾後發現原本的寫法確實有漏洞。
這讓我意識到「能跑」和「安全」是兩件事，之後開發都把這個列為基本要求。

**行動裝置的複製行為不一致**
桌機用 `navigator.clipboard.writeText()` 沒問題，手機上有些瀏覽器會拒絕執行。
查了文件後改用 fallback 的 `document.execCommand('copy')`，才在各裝置上都正常。

---

## 專案架構

```text
/radio_part3_web/
├── index.php             # 練習模式
├── exam.php              # 模擬測驗
├── api/
│   ├── get_question.php
│   ├── get_exam.php
│   └── record_answer.php
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── config/
│   └── db.php
└── data/
    └── questions.sql.bak
```

## 題庫擴充說明

題庫儲存於 MySQL 資料庫的 `questions` 資料表，需要新增或修改題目時，
直接對該資料表操作即可，不需要修改任何程式碼。

### 資料表結構

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | int | 主鍵，自動遞增，不需手動填寫 |
| `q_num` | varchar(10) | 題號，如 `A001`、`B032` |
| `category` | varchar(100) | 題目分類，對應練習模式的分類篩選 |
| `question` | text | 題目文字內容 |
| `image` | varchar(255) | 附圖檔名，無附圖則填 `NULL` |
| `option_a` | text | 選項 A |
| `option_b` | text | 選項 B |
| `option_c` | text | 選項 C |
| `option_d` | text | 選項 D |
| `answer` | char(1) | 正確答案，填入 `A` / `B` / `C` / `D` |

---

## 更換題庫

本系統的題庫與程式碼完全分離，只要替換資料庫內容，
即可改為練習其他證照（如乙級技術士、iPAS 等）。

### 步驟

**1. 清空現有題庫**

```sql
TRUNCATE TABLE questions;
TRUNCATE TABLE question_stats;
```

**2. 匯入新題庫**

依照以下格式整理新題目後匯入：
```sql
INSERT INTO questions (q_num, category, question, image, option_a, option_b, option_c, option_d, answer)
VALUES (
  'A001',          -- 題號
  '你的分類名稱',   -- 分類（可自訂，對應篩選選項）
  '題目內容',
  NULL,            -- 無附圖填 NULL，有附圖填檔名如 't1.png'
  '選項 A',
  '選項 B',
  '選項 C',
  '選項 D',
  'A'              -- 正確答案，填 A / B / C / D
);
```

**3. 更新前端的分類選項**

目前業餘無線電題庫的分類為：
- 無線電規章與相關法規
- 無線電通訊方法
- 無線電系統原理
- 無線電相關安全防護
- 電磁相容性技術
- 射頻干擾的預防與排除

換成其他題庫後，需修改 `assets/js/script.js` 中的分類清單，
將上述名稱改為新題庫的分類名稱，確保篩選功能正常顯示。

**4. 有附圖的題目**

將圖片放入 `assets/images/`，`image` 欄位填入對應檔名即可。

### 模擬測驗及格標準

目前及格標準為 **71.4%**（業餘無線電三等 35 題需答對 25 題）。
若新題庫的及格標準不同，請修改 `assets/js/exam.js` 中的 `PASS_RATE` 變數。

---

## 安全性

- `.htaccess` 禁止目錄列出
- `config/` 與 `data/` 完全禁止外部存取
- 資料庫連線關閉詳細錯誤顯示
- API 輸入參數全數過濾，防止 SQL 注入

---

## 環境需求與安裝

**環境**：Apache + PHP 7.0+ + MySQL / MariaDB

**安裝步驟**

1. 上傳所有檔案至伺服器目錄
2. 建立資料庫 `quiz_db`
3. 匯入 `data/questions.sql.bak`
4. 修改 `config/db.php` 的帳號密碼
5. 確認 `assets/images/` 的讀取權限