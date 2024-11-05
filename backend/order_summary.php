<?php
session_start();
require 'db_connection.php'; // Include your database connection

header('Content-Type: application/json');

if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];

    // Fetch order summary
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Fetch the most recent order summary for the user
        $query = "SELECT total_price FROM order_summary WHERE email = ? ORDER BY created_at DESC LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $orderSummary = $result->fetch_assoc();

        if ($orderSummary) {
            echo json_encode(['success' => true, 'total_price' => (float)$orderSummary['total_price']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No order summary found.']);
        }
        $stmt->close();
        exit;
    }

    // Handle checkout action (POST request)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the raw POST data
        $input = json_decode(file_get_contents('php://input'), true);
        $totalPrice = $input['totalPrice'] ?? null; // Expect totalPrice in JSON request

        if ($totalPrice === null) {
            echo json_encode(['success' => false, 'message' => 'Total price is required.']);
            exit;
        }

        $query = "INSERT INTO order_summary (email, total_price) VALUES (?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sd", $email, $totalPrice); // 'sd' indicates email as string and totalPrice as double

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to complete checkout']);
        }
        $stmt->close();
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
}
$conn->close();
?>