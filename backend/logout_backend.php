<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting for debugging (can be disabled in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start the session
session_start();

// CSRF Token Verification
$csrf_token = $_COOKIE['csrf_token'] ?? ''; // Get CSRF token from the cookie
if (!isset($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode(['success' => false, 'message' => 'Invalid CSRF token']);
    exit(); // Exit if CSRF token is invalid
}

// Unset all session variables
session_unset();

// Destroy the session
session_destroy();

// Clear the auth_token cookie
setcookie('auth_token', '', time() - 3600, "/");

// Send response to the client
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>