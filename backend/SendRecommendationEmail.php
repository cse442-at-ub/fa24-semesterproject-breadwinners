<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? trim($data['email']) : '';
$link = isset($data['link']) ? trim($data['link']) : '';

if ($email && $link) {
    $subject = "Book Recommendation";
    $message = "Check out this book: $link";
    
    if (mail($email, $subject, $message)) {
        echo json_encode(['success' => true, 'message' => 'Email sent']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send email']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email and link required']);
}
?>
