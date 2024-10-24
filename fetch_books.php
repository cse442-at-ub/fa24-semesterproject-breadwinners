<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting for debugging (can be disabled in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
$servername = "localhost:3306";
$username = "sahmed35"; // your ubit
$password = "50398839"; // your person number
$db_name = "sahmed35_db"; // Your actual database name

// Create connection to the MySQL database
$conn = new mysqli($servername, $username, $password, $db_name);

// Check database connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$response = array();

try {
    $query = "SELECT title, author, image_url, price, genre, rating, stock FROM books";
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
    $response['message'] = 'Failed to fetch books: ' . $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>