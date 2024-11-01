<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

$servername = "localhost:3306";
$username = "chonheic";
$password = "50413052";
$db_name = "chonheic_db";

$conn = new mysqli($servername, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

if (!isset($_COOKIE['auth_token'])) {
    echo json_encode(['success' => false, 'message' => 'Missing authorization token']);
    exit();
}

$auth_token = $_COOKIE['auth_token'];
$input = json_decode(file_get_contents("php://input"), true);
$bookId = isset($input['bookId']) ? intval($input['bookId']) : null;

if (!$bookId) {
    echo json_encode(['success' => false, 'message' => 'Book ID is missing']);
    exit();
}

$query = "SELECT id, wishlist FROM user WHERE auth_token = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $auth_token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit();
}

$wishlist = json_decode($user['wishlist'], true) ?? [];
$wishlist = array_filter($wishlist, function ($id) use ($bookId) {
    return $id !== $bookId;
});
$updatedWishlist = json_encode(array_values($wishlist));

$query = "UPDATE user SET wishlist = ? WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $updatedWishlist, $user['id']);
$stmt->execute();

echo json_encode(['success' => true, 'message' => 'Wishlist updated']);

$stmt->close();
$conn->close();
?>
