<?php
include 'db.php';

$mode = isset($_GET['mode']) ? $_GET['mode'] : 'all';
$cats = isset($_GET['cats']) ? $_GET['cats'] : '';
$where_clauses = [];

// 弱點模式
if ($mode === 'weakness') {
    $where_clauses[] = "q.id IN (SELECT question_id FROM question_stats WHERE wrong_count > 0)";
}

// 類別篩選
if (!empty($cats)) {
    $cat_array = explode(',', $cats);
    $cat_list = "'" . implode("','", array_map(fn($c) => mysqli_real_escape_string($conn, $c), $cat_array)) . "'";
    $where_clauses[] = "q.category IN ($cat_list)";
}

// 關鍵修改：使用 LEFT JOIN 抓取統計數據，並選取 q.* (包含 image)
$sql = "SELECT q.*, 
               COALESCE(s.correct_count, 0) as correct_count, 
               COALESCE(s.wrong_count, 0) as wrong_count 
        FROM questions q 
        LEFT JOIN question_stats s ON q.id = s.question_id";

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
    echo json_encode(["status" => "empty", "message" => "範圍內無題目"]);
}
?>