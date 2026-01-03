<?php
require_once '../config/db.php';

$qid = isset($_POST['qid']) ? intval($_POST['qid']) : 0;
$status = isset($_POST['status']) ? $_POST['status'] : '';

if ($qid > 0 && ($status == 'correct' || $status == 'wrong')) {
    // 根據狀態決定更新哪一欄
    if ($status == 'correct') {
        $sql = "INSERT INTO question_stats (question_id, correct_count) VALUES (?, 1) 
                ON DUPLICATE KEY UPDATE correct_count = correct_count + 1";
    } else {
        $sql = "INSERT INTO question_stats (question_id, wrong_count) VALUES (?, 1) 
                ON DUPLICATE KEY UPDATE wrong_count = wrong_count + 1";
    }
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $qid);
    $stmt->execute();
    
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>