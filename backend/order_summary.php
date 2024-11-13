<?php
session_start();
require 'db_connection.php'; // Include your database connection

header('Content-Type: application/json');

if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];

    // Fetch order summary
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Fetch the most recent order summary for the user
        $query = "SELECT total_price, books_purchased FROM order_summary WHERE email = ? ORDER BY created_at DESC LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $orderSummary = $result->fetch_assoc();

        if ($orderSummary) {
            echo json_encode([
                'success' => true,
                'total_price' => (float)$orderSummary['total_price'],
                'books_purchased' => $orderSummary['books_purchased']
            ]);
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

        // Debugging: Log received input
        error_log(print_r($input, true)); // Logs the input data to PHP error log

        if ($totalPrice === null) {
            echo json_encode(['success' => false, 'message' => 'Total price is required.']);
            exit;
        }

        // Fetch items from the shopping cart
        $cartQuery = "SELECT book_title, quantity FROM shopping_cart WHERE email = ?";
        $cartStmt = $conn->prepare($cartQuery);
        $cartStmt->bind_param("s", $email);
        $cartStmt->execute();
        $cartResult = $cartStmt->get_result();

        $booksPurchased = [];
        while ($row = $cartResult->fetch_assoc()) {
            $booksPurchased[] = $row['book_title'] . " (Quantity: " . $row['quantity'] . ")";

            // Update the books table to decrease the stock quantity
            $updateBookQuery = "UPDATE books SET stock = stock - ? WHERE title = ?";
            $updateBookStmt = $conn->prepare($updateBookQuery);
            $updateBookStmt->bind_param("is", $row['quantity'], $row['book_title']);
            $updateBookStmt->execute();
            $updateBookStmt->close();

            // Update the total books sold for each purchased book
            $updateTotalBooksSoldQuery = "UPDATE books SET total_books_sold = total_books_sold + ? WHERE title = ?";
            $updateTotalBooksSoldStmt = $conn->prepare($updateTotalBooksSoldQuery);
            $updateTotalBooksSoldStmt->bind_param("is", $row['quantity'], $row['book_title']);
            $updateTotalBooksSoldStmt->execute();
            $updateTotalBooksSoldStmt->close();
        }

        // Convert array to string for storage
        $booksPurchasedString = implode(", ", $booksPurchased);

        // Insert into order summary
        $query = "INSERT INTO order_summary (email, total_price, books_purchased) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sds", $email, $totalPrice, $booksPurchasedString); // 'sds' indicates string, double, string

        if ($stmt->execute()) {
            // Clear the shopping cart after successful checkout
            $clearCartQuery = "DELETE FROM shopping_cart WHERE email = ?";
            $clearCartStmt = $conn->prepare($clearCartQuery);
            $clearCartStmt->bind_param("s", $email);
            $clearCartStmt->execute();
            $clearCartStmt->close();

            // Cleanup any null or incomplete records in order_summary
            $cleanupQuery = "DELETE FROM order_summary WHERE email IS NULL OR total_price IS NULL";
            $conn->query($cleanupQuery);

            echo json_encode(['success' => true, 'message' => 'Checkout successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to complete checkout']);
        }
        $stmt->close();
        $cartStmt->close();
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
}

$conn->close();
?>