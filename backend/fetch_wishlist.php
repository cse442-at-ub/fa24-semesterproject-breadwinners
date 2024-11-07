<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'db_connection.php';


if (!isset($_COOKIE['auth_token'])) {
    echo json_encode(['success' => false, 'message' => 'Missing authorization token']);
    exit();
}

$auth_token = $_COOKIE['auth_token'];
$query = "SELECT wishlist FROM user WHERE auth_token = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $auth_token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit();
}

$wishlist = json_decode($user['wishlist'], true);
if (empty($wishlist)) {
    echo json_encode(['success' => true, 'items' => []]);
    exit();
}

$wishlistItems = [];
$placeholders = implode(',', array_fill(0, count($wishlist), '?'));
$query = "SELECT id, title, author, genre, price, image_url FROM books WHERE id IN ($placeholders)";
$stmt = $conn->prepare($query);
$stmt->bind_param(str_repeat('i', count($wishlist)), ...$wishlist);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $wishlistItems[] = $row;
}

echo json_encode(['success' => true, 'items' => $wishlistItems]);

$stmt->close();
$conn->close();
?>
