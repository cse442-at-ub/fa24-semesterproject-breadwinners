<?php
// Database connection
$servername = "localhost:3306"; 
$username = "chonheic"; // Database username
$password = "50413052"; // Database password
$db_name = "chonheic_db"; // Database name

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

// Trim input data
$email = trim($data['email']);
$password_input = trim($data['password']);

// Input validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Check if email exists
$sql = "SELECT * FROM user WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email not found']);
    exit();
}

// Fetch user data
$user = $result->fetch_assoc();
$stored_hashed_password = $user['password'];
$salt = $user['salt'];

// Combine salt and input password, and verify
$hashed_input_password = $salt . $password_input;

if (password_verify($hashed_input_password, $stored_hashed_password)) {
    // Generate a random auth token
    $auth_token = bin2hex(random_bytes(16));

    // Set the auth token as a cookie that expires in 1 hour
    setcookie('auth_token', $auth_token, time() + 3600, "/", "", false, true); // HttpOnly for better security

    // Update the auth_token in the user's record in the database
    $update_sql = "UPDATE user SET auth_token = ? WHERE email = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("ss", $auth_token, $email);
    $update_stmt->execute();
    $update_stmt->close();

    // Send response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful'
    ]);

    // Optionally, save the auth token to the session for future validation
    session_start();
    $_SESSION['email'] = $email;
    $_SESSION['auth_token'] = $auth_token;

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
}

$stmt->close();
$conn->close();
?>
