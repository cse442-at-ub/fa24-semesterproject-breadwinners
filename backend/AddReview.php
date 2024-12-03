<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php';

$response = array();

// Validate auth token
if (!isset($_COOKIE['auth_token'])) {
    echo json_encode(['success' => false, 'message' => 'Missing authorization token']);
    exit();
}

$auth_token = $_COOKIE['auth_token'];

// Parse JSON input
$input = json_decode(file_get_contents("php://input"), true);
$bookId = isset($input['bookId']) ? intval($input['bookId']) : null;
$review = isset($input['review']) ? trim($input['review']) : '';

if (!$bookId || !$review) {
    echo json_encode(['success' => false, 'message' => 'Book ID and review are required.']);
    exit();
}

try {
    // Get user email from auth token
    $query = "SELECT email FROM user WHERE auth_token = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        throw new Exception("Invalid authorization token.");
    }
    $user = $result->fetch_assoc();
    $userEmail = $user['email'];

    // Insert the review
    $insertQuery = "INSERT INTO reviews (book_id, user_email, review, created_at) VALUES (?, ?, ?, NOW())";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("iss", $bookId, $userEmail, $review);
    $insertStmt->execute();

    $response['success'] = true;
    $response['message'] = 'Review added successfully.';
    $insertStmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error adding review: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
