<?php
// config/db.php
$host = "localhost";
$db_name = "quiz_db";
$username = "root";
$password = "";

// 建議使用 try-catch 或設定不顯示詳細錯誤
mysqli_report(MYSQLI_REPORT_OFF); // 關閉報錯功能，避免暴露路徑

$conn = mysqli_connect($host, $username, $password, $db_name);

if (!$conn) {
    // 發生錯誤時，只顯示簡短訊息，不顯示 mysqli_connect_error()
    die("資料庫連線失敗，請稍後再試。"); 
}

mysqli_set_charset($conn, "utf8mb4");
?>