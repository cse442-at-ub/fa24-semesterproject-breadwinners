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
<<<<<<< HEAD
$username = "hassan4"; // Your database username
$password = "50396311"; // Your password
$db_name = "hassan4_db"; // Your actual database name
=======
$username = "chonheic"; // your ubit
$password = "50413052"; // your person number
$db_name = "chonheic_db"; // Your actual database name
>>>>>>> dev

// Create connection to the MySQL database
$conn = new mysqli($servername, $username, $password, $db_name);

// Check database connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$response = array();

try {
<<<<<<< HEAD
    // Check if best seller sorting is requested
    $sortByBestSeller = isset($_GET['sortByBestSeller']) && $_GET['sortByBestSeller'] === 'true';

    // Query to fetch book data
    if ($sortByBestSeller) {
        // Fetch books sorted by total books sold and rating
        $query = "SELECT id, title, author, genre, image_url, sellerImage, rating, stock, price, total_books_sold FROM books ORDER BY total_books_sold DESC, rating DESC";
    } else {
        // Default fetch without sorting
        $query = "SELECT id, title, author, genre, image_url, sellerImage, rating, stock, price, total_books_sold FROM books";
    }

=======
    $query = "SELECT id, title, author, image_url, price, genre, rating, stock FROM books";
>>>>>>> dev
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

    // Structure response
    $response['success'] = true;
    $response['books'] = $books;

    $stmt->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Failed to fetch books: ' . $e->getMessage();
}

$conn->close();

// Send the response as JSON
echo json_encode($response);
?>