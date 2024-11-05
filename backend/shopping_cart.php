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
$action = $input['action'] ?? null;

// Fetch cart items
if ($action === null) {
    $query = "SELECT sc.book_title, sc.quantity, b.price, b.image_url, b.author 
              FROM shopping_cart sc 
              JOIN books b ON sc.book_id = b.id 
              WHERE sc.email = ?";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    echo json_encode(['success' => true, 'items' => $items]);
    $stmt->close();
    exit;
}

// Handle quantity update
if ($action === 'update') {
    $bookTitle = $input['bookTitle'];
    $quantity = $input['quantity'];

    // Check the available stock for the specified book
    $stockQuery = "SELECT stock FROM books WHERE title = ?";
    $stockStmt = $conn->prepare($stockQuery);
    $stockStmt->bind_param("s", $bookTitle);
    $stockStmt->execute();
    $stockResult = $stockStmt->get_result();
    $bookData = $stockResult->fetch_assoc();

    if ($bookData && $quantity <= $bookData['stock']) {
        // Proceed with the quantity update in the cart
        $updateQuery = "UPDATE shopping_cart SET quantity = ? WHERE email = ? AND book_title = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("iss", $quantity, $email, $bookTitle);

        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Quantity updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update quantity']);
        }
        $updateStmt->close();
    } else {
        // If the requested quantity exceeds the stock, return an error message
        echo json_encode(['success' => false, 'message' => 'Requested quantity exceeds available stock']);
    }
    $stockStmt->close();
    exit;
}

// Handle item removal
if ($action === 'remove') {
    $bookTitle = $input['bookTitle'];

    $query = "DELETE FROM shopping_cart WHERE email = ? AND book_title = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $email, $bookTitle);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item removed']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove item']);
    }
    $stmt->close();
    exit;
}

// Handle checkout action
if ($action === 'checkout') {
    $totalPrice = $input['totalPrice'];

    // Check if an order summary already exists for this user
    $query = "SELECT * FROM order_summary WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Update existing order
        $updateQuery = "UPDATE order_summary SET total_price = ?, created_at = NOW() WHERE email = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("ds", $totalPrice, $email);

        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful, order updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update order summary']);
        }
        $updateStmt->close();
    } else {
        // Insert a new order
        $insertQuery = "INSERT INTO order_summary (email, total_price, created_at) VALUES (?, ?, NOW())";
        $insertStmt = $conn->prepare($insertQuery);
        $insertStmt->bind_param("sd", $email, $totalPrice);

        if ($insertStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to complete checkout']);
        }
        $insertStmt->close();
    }
    $stmt->close();
    exit;
}

$conn->close();
?>