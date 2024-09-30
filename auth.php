<?php
// Allow cross-origin requests (only for development, consider restricting in production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Sample user data
$users = [
    'user@example.com' => 'password123',
];

// Get the raw POST data and decode it
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = $data['password'];

// Check if the user exists and the password matches
if (isset($users[$email]) && $users[$email] === $password) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
