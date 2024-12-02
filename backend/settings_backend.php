<?php
session_start();
include 'db_connection.php'; // Include your database connection

header('Content-Type: application/json');

// Ensure the user is logged in
if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];

    // Fetch current name
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';

        // Fetch the current first and last name
        if ($action === 'fetch_name') {
            $query = "SELECT first_name, last_name FROM users WHERE email = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                echo json_encode([
                    'success' => true,
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name']
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }

            $stmt->close();
            exit;
        }

        // Update name
        if ($action === 'update_name') {
            $newFirstName = $input['newFirstName'] ?? '';
            $newLastName = $input['newLastName'] ?? '';

            // Validate the input
            if (empty($newFirstName) || empty($newLastName)) {
                echo json_encode(['success' => false, 'message' => 'Name fields cannot be empty']);
                exit;
            }

            $query = "UPDATE users SET first_name = ?, last_name = ? WHERE email = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sss", $newFirstName, $newLastName, $email);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Name updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update name']);
            }

            $stmt->close();
            exit;
        }

        // Update password
        if ($action === 'update_password') {
            $currentPassword = $input['currentPassword'] ?? '';
            $newPassword = $input['newPassword'] ?? '';

            // Validate the input
            if (empty($currentPassword) || empty($newPassword)) {
                echo json_encode(['success' => false, 'message' => 'Both current and new passwords are required']);
                exit;
            }

            // Fetch the current hashed password and salt
            $query = "SELECT password, salt FROM users WHERE email = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                // Check if current password is correct
                if (password_verify($user['salt'] . $currentPassword, $user['password'])) {
                    // Hash the new password with the user's salt
                    $newHashedPassword = password_hash($user['salt'] . $newPassword, PASSWORD_DEFAULT);

                    // Update the password
                    $updateQuery = "UPDATE users SET password = ? WHERE email = ?";
                    $updateStmt = $conn->prepare($updateQuery);
                    $updateStmt->bind_param("ss", $newHashedPassword, $email);

                    if ($updateStmt->execute()) {
                        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
                    }
                    $updateStmt->close();
                } else {
                    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }

            $stmt->close();
            exit;
        }

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
}

$conn->close();
?>