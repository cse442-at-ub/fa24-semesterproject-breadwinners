<?php
session_start();
require_once 'db_connection.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_SESSION['email'] ?? null;
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['status' => 'error', 'message' => 'Email or password not provided.']);
        exit;
    }

    // Retrieve the hashed password and salt from the database
    $stmt = $conn->prepare("SELECT password, salt FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        $stmt->close();
        exit;
    }

    $user = $result->fetch_assoc();
    $hashedPassword = $user['password'];
    $salt = $user['salt'];

    // Verify the password using password_verify
    if (!password_verify($salt . $password, $hashedPassword)) {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect password.']);
        $stmt->close();
        exit;
    }

    // Delete the user account
    $stmt = $conn->prepare("DELETE FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    if ($stmt->execute()) {
        session_destroy(); // Clear the session
        echo json_encode(['status' => 'success', 'message' => 'Account deleted successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete account.']);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}
?>