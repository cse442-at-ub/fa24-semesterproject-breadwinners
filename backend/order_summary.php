<?php
session_start();
require 'db_connection.php'; // Include your database connection

header('Content-Type: application/json');

if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];

    // Fetch order summary
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Fetch existing order summary for the user
        $query = "SELECT total_price FROM order_summary WHERE email = :email ORDER BY created_at DESC LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $orderSummary = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($orderSummary) {
            echo json_encode(['success' => true, 'total_price' => (float)$orderSummary['total_price']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No order summary found.']);
        }
        exit;
    }

    // Handle checkout action (POST request)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $totalPrice = $_POST['totalPrice']; // Expect totalPrice in POST request

        $query = "INSERT INTO order_summary (email, total_price) VALUES (:email, :totalPrice)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':totalPrice', $totalPrice);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Checkout successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to complete checkout']);
        }
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
}
?>