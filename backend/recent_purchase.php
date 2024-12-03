<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'db_connection.php';

if (!isset($_COOKIE['auth_token'])) {
    echo json_encode(['success' => false, 'message' => 'Missing authorization token']);
    exit();
}

$auth_token = $_COOKIE['auth_token'];

// Fetch email associated with the auth_token from the user table
$query = "SELECT email FROM user WHERE auth_token = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $auth_token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit();
}

$email = $user['email'];

// Fetch recent purchase details from the order_summary table for the retrieved email
$query = "SELECT total_price, created_at, books_purchased FROM order_summary WHERE email = ? AND books_purchased IS NOT NULL";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$purchases = [];
while ($row = $result->fetch_assoc()) {
    $purchases[] = $row;
}

// Output recent purchases
echo json_encode(['success' => true, 'purchases' => $purchases]);

$stmt->close();
$conn->close();
?>
