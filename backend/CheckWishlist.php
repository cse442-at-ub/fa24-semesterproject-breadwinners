<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost:3306";
$username = "chonheic";
$password = "50413052";
$db_name = "chonheic_db";

$conn = new mysqli($servername, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$response = array();

if (!isset($_COOKIE['auth_token'])) {
    echo json_encode(['success' => false, 'message' => 'Missing authorization token']);
    exit();
}

$auth_token = $_COOKIE['auth_token'];
$bookId = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$bookId) {
    echo json_encode(['success' => false, 'message' => 'Book ID is missing.']);
    exit();
}

try {
    // Verify the auth token and fetch user ID
    $query = "SELECT id, wishlist FROM user WHERE auth_token = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        throw new Exception("Invalid authorization token");
    }
    $user = $result->fetch_assoc();
    $wishlist = json_decode($user['wishlist'], true) ?? [];
    $isBookmarked = in_array($bookId, $wishlist);

    $response['success'] = true;
    $response['isBookmarked'] = $isBookmarked;

    $stmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error checking wishlist: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
