<?php
require_once '../config/db.php';

$type = isset($_GET['type']) ? $_GET['type'] : 'full';

// 確保 SELECT *，這樣就會包含 image 欄位
if ($type === 'mini') {
    // 小測驗：隨機 10 題
    $sql = "SELECT * FROM questions ORDER BY RAND() LIMIT 10";
} else {
    // 全真模考：依照 NCC 比例配題 (共 35 題)
    $sql = "
    (SELECT * FROM questions WHERE category = '無線電規章與相關法規' ORDER BY RAND() LIMIT 13)
    UNION ALL
    (SELECT * FROM questions WHERE category = '無線電通訊方法' ORDER BY RAND() LIMIT 12)
    UNION ALL
    (SELECT * FROM questions WHERE category = '無線電系統原理' ORDER BY RAND() LIMIT 10)
    ";
}

$result = mysqli_query($conn, $sql);
$questions = [];

while ($row = mysqli_fetch_assoc($result)) {
    $questions[] = $row;
}

header('Content-Type: application/json');
echo json_encode($questions);
?>