<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php';


$response = array();

if (!isset($_COOKIE['auth_token'])) {
    echo json_encode(['success' => false, 'message' => 'Missing authorization token']);
    exit();
}

$auth_token = $_COOKIE['auth_token'];

// Read the JSON payload
$input = json_decode(file_get_contents("php://input"), true);
$bookId = isset($input['id']) ? intval($input['id']) : null; // Get `id` from JSON payload

if (!$bookId) {
    echo json_encode(['success' => false, 'message' => 'Book ID is missing.']);
    exit();
}

try {
    $query = "SELECT id, wishlist FROM user WHERE auth_token = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        throw new Exception("Invalid authorization token");
    }
    $user = $result->fetch_assoc();
    $userId = $user['id'];
    $wishlist = json_decode($user['wishlist'], true) ?? [];

    if (in_array($bookId, $wishlist)) {
        $wishlist = array_diff($wishlist, [$bookId]); // Remove if already present
    } else {
        $wishlist[] = $bookId; // Add if not present
    }

    $wishlistJson = json_encode(array_values($wishlist));

    $updateQuery = "UPDATE user SET wishlist = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param("si", $wishlistJson, $userId);
    $updateStmt->execute();

    $response['success'] = true;
    $response['message'] = 'Wishlist updated successfully.';

    $updateStmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error updating wishlist: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
