<?php
session_start(); // Start the session to access session variables

// Database connection
$servername = "localhost:3306";
$username = "hassan4";
$password = "50396311";
$dbname = "hassan4_db";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if email is set in the session
if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];

    // Prepare and execute the SQL query
    $sql = "
    SELECT c.book_title, c.quantity, b.price, b.image_url, b.author 
    FROM cart c 
    JOIN books b ON c.book_title = b.title 
    WHERE c.email = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch data
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = [
            'book_title' => $row['book_title'],
            'quantity' => $row['quantity'],
            'price' => floatval($row['price']), // Ensure price is a float
            'image_url' => $row['image_url'],
            'author' => $row['author'],
        ];
    }

    // Return response
    echo json_encode(['success' => true, 'items' => $items]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
}

$conn->close();
?>