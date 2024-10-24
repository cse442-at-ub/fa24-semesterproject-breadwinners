<?php
session_start();

// Unset all session variables
session_unset(); 

// Destroy the session
session_destroy();

// Clear the auth_token cookie
setcookie('auth_token', '', time() - 3600, "/");

// Send response to the client
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>
