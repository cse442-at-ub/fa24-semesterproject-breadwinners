<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token");

// Enable error reporting for debugging (can be disabled in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start session for CSRF token validation
session_start();

// Validate CSRF Token
$csrf_token = $_COOKIE['csrf_token'] ?? '';
if (!isset($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
    exit();
}

// Database connection
include 'db_connection.php'; // Ensure this file contains your DB credentials and connection logic

$response = array();

try {
    // Query to fetch best sellers
    $query = "SELECT id, title, author, genre, seller_email, image_url, rating, stock, price, total_books_sold 
              FROM books 
              ORDER BY total_books_sold DESC, rating DESC";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }

    $response['success'] = true;
    $response['books'] = $books;
    $stmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Failed to fetch best sellers: ' . $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>