<?php
// db.php
$servername = "localhost";
$username = "root";  // 預設帳號 (XAMPP/MAMP 通常是 root)
$password = "";      // 預設密碼 (XAMPP 通常是空字串，MAMP 是 root)
$dbname = "quiz_db"; // 關鍵修改：對應你的資料庫名稱

// 建立連線
$conn = new mysqli($servername, $username, $password, $dbname);

// 設定編碼，防止中文亂碼
$conn->set_charset("utf8mb4");

// 檢查連線是否成功
if ($conn->connect_error) {
    // 如果連線失敗，直接結束並顯示錯誤，方便除錯
    die("資料庫連線失敗: " . $conn->connect_error);
}
?>