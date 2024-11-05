<?php
session_start();
include 'db_connection.php';

header('Content-Type: application/json');

// Ensure the user is logged in by checking the session
if (!isset($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$email = $_SESSION['email'];

// Decode the input JSON, if provided
$input = json_decode(file_get_contents('php://input'), true);
$bookTitle = $input['bookTitle'] ?? null;

if ($bookTitle) {
    // Fetch stock for the specified book title
    $query = "SELECT stock FROM books WHERE title = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $bookTitle);
    $stmt->execute();
    $result = $stmt->get_result();
    $bookData = $result->fetch_assoc();

    if ($bookData) {
        echo json_encode(['success' => true, 'stock' => $bookData['stock']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Book not found']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'No book title provided']);
}

$conn->close();
?>