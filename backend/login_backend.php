<?php
// Set headers for JSON response and security
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Specify allowed origin for CORS
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Content-Security-Policy: default-src 'self'; script-src 'none';");

// Enable error reporting for debugging (turn off in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost:3306";
$username = "sahmed35";
$password = "50398839";
$db_name = "sahmed35_db";

// Create connection to MySQL database
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Sanitize input function
function sanitize_input($data)
{
    $data = trim($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8'); // Convert special characters to HTML entities
    return $data;
}

// Get the raw POST data and decode it
$data = json_decode(file_get_contents('php://input'), true);
if ($data === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

// Sanitize inputs
$email = sanitize_input($data['email'] ?? '');
$password_input = sanitize_input($data['password'] ?? '');

// Input validation for email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Check if email exists and fetch user data
$sql = "SELECT * FROM user WHERE email = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    exit();
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email not found']);
    $stmt->close();
    $conn->close();
    exit();
}

// Fetch user data and verify password
$user = $result->fetch_assoc();
$stored_hashed_password = $user['password'];
$salt = $user['salt'];
$stmt->close();

// Combine salt with the input password and hash it
$hashed_input_password = $salt . $password_input;

// Verify hashed password
if (password_verify($hashed_input_password, $stored_hashed_password)) {
    // Generate a random auth token
    $auth_token = bin2hex(random_bytes(16));

    // Set the auth token as a secure, HttpOnly cookie
    setcookie('auth_token', $auth_token, [
        'expires' => time() + 3600,
        'path' => '/',
        'domain' => '', // Specify your domain
        'secure' => true, // Set to true if using HTTPS
        'httponly' => true, // HttpOnly for better security
        'samesite' => 'Strict' // Prevent CSRF
    ]);

    // Update the auth_token in the user's record in the database
    $update_sql = "UPDATE user SET auth_token = ? WHERE email = ?";
    $update_stmt = $conn->prepare($update_sql);
    if (!$update_stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
        $conn->close();
        exit();
    }
    $update_stmt->bind_param("ss", $auth_token, $email);
    $update_stmt->execute();
    $update_stmt->close();

    // Start session and store auth_token in session
    session_start();
    $_SESSION['email'] = $email;
    $_SESSION['auth_token'] = $auth_token;

    // --- CSRF Token Generation Starts Here ---
    $csrf_token = bin2hex(random_bytes(32)); // Generate a CSRF token

    // Store CSRF token in session
    $_SESSION['csrf_token'] = $csrf_token;

    // Set CSRF token in a cookie (not HttpOnly, since we want to read it from JS)
    setcookie('csrf_token', $csrf_token, [
        'expires' => time() + 3600, // Expires in 1 hour
        'path' => '/',
        'domain' => '', // Specify your domain
        'secure' => true, // Use true if using HTTPS
        'httponly' => false, // We want to access this cookie in JavaScript
        'samesite' => 'Strict' // Prevent CSRF
    ]);

    // Send the CSRF token in the response along with the auth token
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'csrf_token' => $csrf_token // Include CSRF token in response
    ]);
    // --- CSRF Token Generation Ends Here ---

} else {
    // Send error response for invalid password
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
}

$conn->close();
?>