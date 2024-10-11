<?php

// Database connection
$servername = "localhost:3306"; 
$username = "hassan4"; // Database username
$password = "50396311"; // Database password
$db_name = "cse442_2024_fall_team_y_db"; // Database name

// Create connection to MySQL database
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Get the raw POST data and decode it
$data = json_decode(file_get_contents('php://input'), true);
if ($data === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit();
}

// Trim and validate input data
$firstName = trim($data['firstName']);
$lastName = trim($data['lastName']);
$email = trim($data['email']);
$password_input = trim($data['password']);

// Input validation
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
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email is already registered']);
    exit();
}

// Hash the password
$hashed_password = password_hash($password_input, PASSWORD_BCRYPT);

// Insert new user into the database
$sql = "INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $firstName, $lastName, $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>