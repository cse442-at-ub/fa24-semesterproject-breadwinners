<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    //ini_set('display_errors', 1);
    //ini_set('display_startup_errors', 1);
    //error_reporting(E_ALL);

    // Database connection
    $servername = "localhost:3306";
    $username = ""; //ubit
    $password = ""; //person number
    $db_name = "cse442_2024_fall_team_y_db"; //cattle: cse442_2024_fall_team_y_db, aptitude: ubit_db

    // Create a connection to the MySQL database
    $conn = new mysqli($servername, $username, $password, $db_name);

    // Check the database connection
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
        exit();
    }

    // Get the raw POST data and decode it
    $data = json_decode(file_get_contents('php://input'), true);
    $email = trim($data['email']); // Trim input to avoid extra spaces
    $password_input = trim($data['password']); // Trim password to avoid extra spaces

    // Echo the input for debugging
    //echo json_encode(['debug' => ['input_email' => $email, 'input_password' => $password_input]]);

    // SQL query to check if the user exists in the database
    $sql = "SELECT * FROM user WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if user exists and verify the password
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Echo the fetched user data for debugging
        //echo json_encode(['debug' => ['fetched_user' => $row]]);
        
        // For security, consider using password hashing in real applications
        if ($row['password'] === $password_input) {
            echo json_encode(['success' => true, 'message' => 'Login Successful']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }

    $stmt->close();
    $conn->close();
?>
