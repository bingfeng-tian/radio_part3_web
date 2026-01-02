<?php
include 'db.php';
$mode = $_GET['mode'] ?? 'all';
$cats = $_GET['cats'] ?? '';
$where = [];

if ($mode === 'weakness') $where[] = "q.id IN (SELECT question_id FROM question_stats WHERE wrong_count > 0)";
if (!empty($cats)) {
    $cat_list = "'" . implode("','", array_map(fn($c) => mysqli_real_escape_string($conn, $c), explode(',', $cats))) . "'";
    $where[] = "q.category IN ($cat_list)";
}

// 聯結統計表
$sql = "SELECT q.*, 
               COALESCE(s.correct_count, 0) as correct_count, 
               COALESCE(s.wrong_count, 0) as wrong_count 
        FROM questions q 
        LEFT JOIN question_stats s ON q.id = s.question_id";

if ($where) $sql .= " WHERE " . implode(" AND ", $where);
$sql .= " ORDER BY RAND() LIMIT 1";

$res = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($res);
header('Content-Type: application/json');
echo json_encode($row ?: ["status"=>"empty", "message"=>"範圍內無題目"]);
?>