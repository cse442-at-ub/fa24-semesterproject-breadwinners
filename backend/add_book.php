<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Enable error reporting for debugging (can be disabled in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
$servername = "localhost:3306";
$username = "chonheic"; // your ubit
$password = "50413052"; // your person number
$db_name = "chonheic_db"; // Your actual database name

// Create connection to the MySQL database
$conn = new mysqli($servername, $username, $password, $db_name);

// Check database connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$response = array();

try {
    // Check for auth token in the request headers
    if (!isset($_COOKIE['auth_token'])) {
        throw new Exception("Missing authorization token");
    }

    $auth_token = $_COOKIE['auth_token'];

    // Verify auth token and fetch seller email
    $query = "SELECT email FROM user WHERE auth_token = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        throw new Exception("Invalid authorization token");
    }
    $user = $result->fetch_assoc();
    $seller_email = $user['email'];
    $stmt->close();

    // Only handle request if Save Book button is clicked (manual request submission)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON input from the request body
        $input = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        if (!isset($input['title'], $input['author'], $input['genre'], $input['price'], $input['stock'], $input['image_url'])) {
            throw new Exception("Missing required book details");
        }

        // Prepare the SQL query to insert a new book
        $query = "INSERT INTO books (title, author, genre, price, stock, image_url, seller_email) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $stmt->bind_param(
            "ssssiss", 
            $input['title'],
            $input['author'],
            $input['genre'],
            $input['price'],
            $input['stock'],
            $input['image_url'],
            $seller_email
        );

        // Execute the query
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Book added successfully';
        } else {
            throw new Exception("Failed to add book: " . $stmt->error);
        }

        $stmt->close();
    } else {
        throw new Exception("Invalid request method");
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

$conn->close();

// Return the JSON response
echo json_encode($response);
?>