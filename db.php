<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // XAMPP 預設密碼通常為空
$dbname = 'quiz_db';

$conn = mysqli_connect($host, $user, $pass, $dbname);
if (!$conn) { die("連線失敗: " . mysqli_connect_error()); }
mysqli_set_charset($conn, "utf8mb4");
?>