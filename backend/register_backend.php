<?php

// Set content type
header('Content-Type: application/json');

// Database connection
$servername = "localhost:3306";
$username = "sahmed35"; // Database username
$password = "50398839"; // Database password
$db_name = "sahmed35_db"; // Database name

// Create connection to MySQL database
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}

// Function to sanitize input
function sanitize_input($data)
{
    $data = trim($data);
    $data = strip_tags($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Get the raw POST data and decode it
$data = json_decode(file_get_contents('php://input'), true);
if ($data === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

// Sanitize and validate input data
$firstName = sanitize_input($data['firstName'] ?? '');
$lastName = sanitize_input($data['lastName'] ?? '');
$email = sanitize_input($data['email'] ?? '');
$password_input = $data['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}


if (strlen($password_input) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
    exit();
}

// Check if email already exists
$sql = "SELECT * FROM user WHERE email = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Error preparing SQL statement']);
    exit();
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email is already registered']);
    exit();
}

// Generate a random salt and hash the password
$salt = bin2hex(random_bytes(16)); // Generate a 16-byte salt
$hashed_password = password_hash($salt . $password_input, PASSWORD_BCRYPT);

// Insert new user into the database
$sql = "INSERT INTO user (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement']);
    exit();
}
$stmt->bind_param("sssss", $firstName, $lastName, $email, $hashed_password, $salt);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed']);
}

$stmt->close();
$conn->close();
?>