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
              WHERE c.email = ?";
              
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

    $query = "UPDATE cart SET quantity = ? WHERE email = ? AND book_title = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iss", $quantity, $email, $bookTitle);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Quantity updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update quantity']);
    }
    $stmt->close();
    exit;
}

// Handle item removal
if ($action === 'remove') {
    $bookTitle = $input['bookTitle'];

    $query = "DELETE FROM cart WHERE email = ? AND book_title = ?";
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
    $totalPrice = $input['totalPrice']; // Get total price from the request

    // Check if an order summary already exists for the user
    $query = "SELECT * FROM order_summary WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    // If an order exists, update it; otherwise, insert a new record
    if ($stmt->num_rows > 0) {
        $updateQuery = "UPDATE order_summary SET total_price = ? WHERE email = ?";
        $updateStmt = $conn->prepare($updateQuery);
        $updateStmt->bind_param("ds", $totalPrice, $email);

        if ($updateStmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful, order updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update order summary']);
        }
        $updateStmt->close();
    } else {
        // Insert a new order summary if no previous order exists
        $query = "INSERT INTO order_summary (email, total_price) VALUES (?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sd", $email, $totalPrice);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to complete checkout']);
        }
    }
    $stmt->close();
    exit;
}

$conn->close();
?>