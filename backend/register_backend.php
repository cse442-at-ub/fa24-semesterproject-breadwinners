<?php

include 'db_connection.php';
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

if (!preg_match("/^[a-zA-Z\s]+$/", $firstName)) { // Allow only letters and spaces
    echo json_encode(['success' => false, 'message' => 'Invalid first name']);
    exit();
}

if (!preg_match("/^[a-zA-Z\s]+$/", $lastName)) { // Allow only letters and spaces
    echo json_encode(['success' => false, 'message' => 'Invalid last name']);
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

// Generate a random salt and hash the password
$salt = bin2hex(random_bytes(16)); // Generate a 16-byte salt
$hashed_password = password_hash($salt . $password_input, PASSWORD_BCRYPT);

// Insert new user into the database
$sql = "INSERT INTO user (first_name, last_name, email, password, salt) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $firstName, $lastName, $email, $hashed_password, $salt);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>