<?php
include 'db.php';

$type = isset($_GET['type']) ? $_GET['type'] : 'full';

// 根據類型決定抽題數量
if ($type === 'mini') {
    $distribution = [
        '無線電規章與相關法規' => 4,
        '無線電通訊方法' => 3,
        '無線電系統原理' => 2,
        '無線電相關安全防護' => 1 // 其餘隨機抽一項
    ];
} else {
    // 全真模擬比例
    $distribution = [
        '無線電規章與相關法規' => 13,
        '無線電通訊方法' => 13,
        '無線電系統原理' => 6,
        '無線電相關安全防護' => 1,
        '電磁相容性技術' => 1,
        '射頻干擾的預防與排除' => 1
    ];
}

$queries = [];
foreach ($distribution as $category => $count) {
    $queries[] = "(SELECT * FROM questions WHERE category = '$category' ORDER BY RAND() LIMIT $count)";
}

$sql = implode(" UNION ALL ", $queries);
$result = mysqli_query($conn, $sql);

$exam_questions = [];
while($row = mysqli_fetch_assoc($result)) {
    $exam_questions[] = $row;
}

header('Content-Type: application/json');
echo json_encode($exam_questions);
?>