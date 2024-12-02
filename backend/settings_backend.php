<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token");
header("Content-Type: application/json");

include 'db_connection.php';

$response = array();

session_start();

// Function to verify CSRF token
function verifyCsrfToken()
{
    if (!isset($_COOKIE['csrf_token']) || $_COOKIE['csrf_token'] !== $_SESSION['csrf_token']) {
        echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
        exit();
    }
}

// Decode JSON payload
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

// Get user email from session
$email = $_SESSION['email'] ?? '';

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit();
}

// Database connection
$conn = new mysqli($servername, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

if ($action === 'fetch_name') {
    // Fetch first_name and last_name
    $stmt = $conn->prepare("SELECT first_name, last_name FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($firstName, $lastName);
    if ($stmt->fetch()) {
        echo json_encode(['success' => true, 'first_name' => $firstName, 'last_name' => $lastName]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch name']);
    }
    $stmt->close();
} elseif ($action === 'update_name') {
    // Update first_name and last_name
    verifyCsrfToken();
    $newFirstName = $data['newFirstName'] ?? '';
    $newLastName = $data['newLastName'] ?? '';

    if (empty($newFirstName) || empty($newLastName)) {
        echo json_encode(['success' => false, 'message' => 'Name fields cannot be empty']);
        exit();
    }

    $stmt = $conn->prepare("UPDATE user SET first_name = ?, last_name = ? WHERE email = ?");
    $stmt->bind_param("sss", $newFirstName, $newLastName, $email);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Name updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update name']);
    }
    $stmt->close();
} elseif ($action === 'update_password') {
    // Update password
    verifyCsrfToken();
    $currentPassword = $data['currentPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    if (empty($currentPassword) || empty($newPassword)) {
        echo json_encode(['success' => false, 'message' => 'Password fields cannot be empty']);
        exit();
    }

    // Fetch current password hash and salt
    $stmt = $conn->prepare("SELECT password, salt FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($storedPassword, $salt);
    if ($stmt->fetch()) {
        // Verify current password
        if (!password_verify($salt . $currentPassword, $storedPassword)) {
            echo json_encode(['success' => false, 'message' => 'Incorrect current password']);
            exit();
        }

        // Hash the new password with a new salt
        $newSalt = bin2hex(random_bytes(8));
        $hashedNewPassword = password_hash($newSalt . $newPassword, PASSWORD_DEFAULT);

        // Update the password in the database
        $stmt->close();
        $stmt = $conn->prepare("UPDATE user SET password = ?, salt = ? WHERE email = ?");
        $stmt->bind_param("sss", $hashedNewPassword, $newSalt, $email);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch user data']);
    }
    $stmt->close();
}

$conn->close();
?>