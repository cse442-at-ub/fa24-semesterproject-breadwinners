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

// Trim input data
$email = trim($data['email']);
$password_input = trim($data['password']);

// Input validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Check if email exists and prevent any sql and html injection
// here is a test :     <a href="javascript:alert('XSS')">Click Me</a>
// another test:        '; DROP TABLE users; --


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

// Verify password
if (password_verify($password_input, $user['password'])) {
    echo json_encode(['success' => true, 'message' => 'Login successful']);
    session_start(); // the user is logged in session based 
    $_SESSION['email'] = $email; 

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid password']);
}

$stmt->close();
$conn->close();
?>