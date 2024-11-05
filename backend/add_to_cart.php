<?php
// Start the session to access session variables
session_start();
include 'db_connection.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Check if the user is logged in by verifying the session
if (!isset($_SESSION['email']) || empty($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

$email = trim($_SESSION['email']);

// Decode the incoming JSON payload
$data = json_decode(file_get_contents('php://input'), true);
if ($data === null || !isset($data['bookId']) || !isset($data['bookTitle']) || !isset($data['quantity'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

$bookId = (int) trim($data['bookId']);
$bookTitle = trim($data['bookTitle']);
$quantity = (int) $data['quantity'];

// Check if the book already exists in the cart
$check_cart_sql = "SELECT quantity FROM shopping_cart WHERE email = ? AND book_id = ?";
$check_cart_stmt = $conn->prepare($check_cart_sql);
$check_cart_stmt->bind_param("si", $email, $bookId);
$check_cart_stmt->execute();
$check_cart_result = $check_cart_stmt->get_result();

if ($check_cart_result->num_rows > 0) {
    // Book exists, update the quantity
    $row = $check_cart_result->fetch_assoc();
    $newQuantity = $row['quantity'] + $quantity;

    $update_sql = "UPDATE shopping_cart SET quantity = ? WHERE email = ? AND book_id = ?";
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
    $insert_sql = "INSERT INTO shopping_cart (email, book_id, book_title, quantity) VALUES (?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("sisi", $email, $bookId, $bookTitle, $quantity);

    if ($insert_stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Book added to cart successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add book to cart: ' . $insert_stmt->error]);
    }

    $insert_stmt->close();
}

// Clean up
$check_cart_stmt->close();
$conn->close();
?>