<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include 'db_connection.php';

$response = array();

// Get the book ID from the query parameters
$bookId = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$bookId) {
    echo json_encode(['success' => false, 'message' => 'Book ID is required.']);
    exit();
}

try {
    // Fetch reviews for the given book ID
    $query = "SELECT user_email, review, created_at FROM reviews WHERE book_id = ? ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $bookId);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = array();
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            'user' => $row['user_email'], // or a more friendly field like `username` if available
            'review' => $row['review'],
            'created_at' => $row['created_at']
        ];
    }

    $response['success'] = true;
    $response['reviews'] = $reviews;
    $stmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error fetching reviews: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
