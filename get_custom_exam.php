<?php
include 'db.php';

$cats = isset($_GET['cats']) ? $_GET['cats'] : '';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;

// 基本防禦
$cat_list = "''";
if (!empty($cats)) {
    $cat_array = explode(',', $cats);
    $cat_list = "'" . implode("','", array_map(fn($c) => mysqli_real_escape_string($conn, $c), $cat_array)) . "'";
} else {
    // 若未選則預設全選
    $cat_list = "'無線電規章與相關法規','無線電通訊方法','無線電系統原理','無線電相關安全防護','電磁相容性技術','射頻干擾的預防與排除'";
}

$sql = "SELECT * FROM questions WHERE category IN ($cat_list) ORDER BY RAND() LIMIT $limit";
$result = mysqli_query($conn, $sql);

$exam_questions = [];
while($row = mysqli_fetch_assoc($result)) {
    $exam_questions[] = $row;
}

header('Content-Type: application/json');
echo json_encode($exam_questions);
?>