<?php
session_start();
include 'db_connection.php'; // Include your DB connection file

header('Content-Type: application/json');

// Make sure the session contains the user's email
if (!isset($_SESSION['email'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$email = $_SESSION['email'];

// Decode the input JSON if provided
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? null;

// Fetch cart items
if ($action === null) {
    $query = "SELECT c.book_title, c.quantity, b.price, b.image_url, b.author 
              FROM cart c 
              JOIN books b ON c.book_title = b.title 
              WHERE c.email = :email";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'items' => $items]);
    exit;
}

// Handle quantity update
if ($action === 'update') {
    $bookTitle = $input['bookTitle'];
    $quantity = $input['quantity'];

    $query = "UPDATE cart SET quantity = :quantity WHERE email = :email AND book_title = :bookTitle";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':quantity', $quantity);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':bookTitle', $bookTitle);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Quantity updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update quantity']);
    }
    exit;
}

// Handle item removal
if ($action === 'remove') {
    $bookTitle = $input['bookTitle'];

    $query = "DELETE FROM cart WHERE email = :email AND book_title = :bookTitle";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':bookTitle', $bookTitle);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item removed']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove item']);
    }
    exit;
}

// Add this section to handle checkout action
if ($action === 'checkout') {
    $totalPrice = $input['totalPrice']; // Get total price from the request

    // Check if an order summary already exists for the user
    $query = "SELECT * FROM order_summary WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    // If an order exists, update it, otherwise insert a new record
    if ($stmt->rowCount() > 0) {
        $updateQuery = "UPDATE order_summary SET total_price = :totalPrice WHERE email = :email";
        $updateStmt = $pdo->prepare($updateQuery);
        $updateStmt->bindParam(':totalPrice', $totalPrice);
        $updateStmt->bindParam(':email', $email);

        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful, order updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update order summary']);
        }
    } else {
        // Insert a new order summary if no previous order exists
        $query = "INSERT INTO order_summary (email, total_price) VALUES (:email, :totalPrice)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':totalPrice', $totalPrice);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to complete checkout']);
        }
    }
    exit;
}

// You can add more actions here (like checkout, etc.)
?>