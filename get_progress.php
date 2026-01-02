<?php
include 'db.php';

// 官方各單元總題數
$totals = [
    '無線電規章與相關法規' => 229,
    '無線電通訊方法' => 132,
    '無線電系統原理' => 145,
    '無線電相關安全防護' => 36,
    '電磁相容性技術' => 10,
    '射頻干擾的預防與排除' => 18
];

$progress = [];

foreach ($totals as $category => $total_count) {
    // 只要 correct_count > 0 就代表這題你「會了」
    $sql = "SELECT COUNT(*) as mastered FROM questions q 
            JOIN question_stats s ON q.id = s.question_id 
            WHERE q.category = '$category' AND s.correct_count > 0";
            
    $res = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($res);
    
    $progress[] = [
        'category' => $category,
        'mastered' => intval($row['mastered']),
        'total' => $total_count,
        'percent' => round(($row['mastered'] / $total_count) * 100, 1)
    ];
}

header('Content-Type: application/json');
echo json_encode($progress);
?>