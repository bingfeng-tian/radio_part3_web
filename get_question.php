<?php
include 'db.php';

$mode = isset($_GET['mode']) ? $_GET['mode'] : 'all';
$cats = isset($_GET['cats']) ? $_GET['cats'] : '';

$where_clauses = [];

// 處理弱點模式
if ($mode === 'weakness') {
    $where_clauses[] = "id IN (SELECT question_id FROM question_stats WHERE wrong_count > 0)";
}

// 處理自訂範圍 (Category Filter)
if (!empty($cats)) {
    // 將傳入的類別字串轉為陣列，並清理資料
    $cat_array = explode(',', $cats);
    $cat_list = "'" . implode("','", array_map(fn($c) => mysqli_real_escape_string($conn, $c), $cat_array)) . "'";
    $where_clauses[] = "category IN ($cat_list)";
}

$sql = "SELECT * FROM questions";
if (count($where_clauses) > 0) {
    $sql .= " WHERE " . implode(" AND ", $where_clauses);
}
$sql .= " ORDER BY RAND() LIMIT 1";

$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);

header('Content-Type: application/json');
if ($row) {
    echo json_encode($row);
} else {
    echo json_encode(["status" => "empty", "message" => "該範圍內沒有符合條件的題目！"]);
}
?>