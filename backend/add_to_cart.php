<?php
// Database connection
include 'db_connection.php';

// Start the session to access session variables
session_start();

// Check if the user is logged in by verifying the session
if (!isset($_SESSION['email']) || empty($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in or email missing']);
    exit();
}

$email = trim($_SESSION['email']); // Trim any extra whitespace

// Verify the email exists in the user table (debugging check)
$check_sql = "SELECT email FROM user WHERE email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
if ($check_result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email does not exist in user table']);
    exit();
}

// Get the raw POST data and decode it
$data = json_decode(file_get_contents('php://input'), true);
if ($data === null || !isset($data['bookId']) || !isset($data['bookTitle']) || !isset($data['quantity'])) { // Check for quantity
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

$bookId = trim($data['bookId']); // Trim input data
$bookTitle = trim($data['bookTitle']); // Trim book title
$quantity = (int)$data['quantity']; // Get the quantity and ensure it's an integer

// Check if the book already exists in the cart
$check_cart_sql = "SELECT quantity FROM cart WHERE email = ? AND book_id = ?";
$check_cart_stmt = $conn->prepare($check_cart_sql);
$check_cart_stmt->bind_param("si", $email, $bookId);
$check_cart_stmt->execute();
$check_cart_result = $check_cart_stmt->get_result();

if ($check_cart_result->num_rows > 0) {
    // Book exists, update the quantity
    $row = $check_cart_result->fetch_assoc();
    $newQuantity = $row['quantity'] + $quantity; // Increase quantity

    $update_sql = "UPDATE cart SET quantity = ? WHERE email = ? AND book_id = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("isi", $newQuantity, $email, $bookId);

    if ($update_stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Book quantity updated in cart']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update book quantity: ' . $update_stmt->error]);
    }

    $update_stmt->close();
} else {
    // Book does not exist, insert a new record
    $sql = "INSERT INTO cart (email, book_id, book_title, quantity) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sisi", $email, $bookId, $bookTitle, $quantity); // Include quantity

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Book added to cart successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add book to cart: ' . $stmt->error]);
    }

    $stmt->close();
}

// Clean up
$check_cart_stmt->close();
$check_stmt->close();
$conn->close();
?>