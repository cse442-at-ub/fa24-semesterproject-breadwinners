<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token");

// Enable error reporting for debugging (can be disabled in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start the session
session_start();

// CSRF Token Verification
$csrf_token = $_COOKIE['csrf_token'] ?? '';
error_log('Session CSRF Token: ' . (isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : 'Not set'));
error_log('Cookie CSRF Token: ' . $csrf_token);

if (!isset($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
    exit();
}

// Database connection
include 'db_connection.php';
$response = array();

try {
    // Check if auth token is provided
    if (!isset($_COOKIE['auth_token'])) {
        echo json_encode(['success' => false, 'message' => 'Missing authorization token']);
        exit();
    }

    // Get the auth token from the cookie
    $auth_token = $_COOKIE['auth_token'];

    // Action from the frontend
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? '';

    switch ($action) {
        case 'fetch_name':
            // Query to fetch the user data (first_name, last_name) by auth token
            $query = "SELECT first_name, last_name FROM user WHERE auth_token = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $auth_token);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Fetch the user data
                $user = $result->fetch_assoc();
                $first_name = $user['first_name'];
                $last_name = $user['last_name'];

                // Respond with the name data
                $response['success'] = true;
                $response['first_name'] = $first_name;
                $response['last_name'] = $last_name;
            } else {
                $response['success'] = false;
                $response['message'] = 'User not found or invalid auth token';
            }

            $stmt->close();
            break;

        case 'update_name':
            // Get new names from the frontend
            $newFirstName = $data['newFirstName'] ?? '';
            $newLastName = $data['newLastName'] ?? '';

            // Query to update the user data
            $query = "UPDATE user SET first_name = ?, last_name = ? WHERE auth_token = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sss", $newFirstName, $newLastName, $auth_token);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Name updated successfully';
            } else {
                $response['success'] = false;
                $response['message'] = 'Failed to update name';
            }

            $stmt->close();
            break;

        case 'update_password':
            // Get current and new password
            $currentPassword = $data['currentPassword'] ?? '';
            $newPassword = $data['newPassword'] ?? '';

            // Query to check current password
            $query = "SELECT password FROM user WHERE auth_token = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $auth_token);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();

            if (password_verify($currentPassword, $user['password'])) {
                // Update password if current password is correct
                $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                $updateQuery = "UPDATE user SET password = ? WHERE auth_token = ?";
                $stmt = $conn->prepare($updateQuery);
                $stmt->bind_param("ss", $hashedNewPassword, $auth_token);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    $response['success'] = true;
                    $response['message'] = 'Password updated successfully';
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Failed to update password';
                }
            } else {
                $response['success'] = false;
                $response['message'] = 'Incorrect current password';
            }

            $stmt->close();
            break;

        default:
            $response['success'] = false;
            $response['message'] = 'Invalid action';
            break;
    }

} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>