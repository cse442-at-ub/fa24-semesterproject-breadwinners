<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Database connection
    $servername = "localhost";
    $username = "root";  // Your MySQL username
    $password = "";      // Your MySQL password
    $dbname = "test_db"; // Your database name

    // Create a connection to the MySQL database
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check the database connection
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
        exit();
    }

    // Get the raw POST data and decode it
    $data = json_decode(file_get_contents('php://input'), true);
    $action = isset($data['action']) ? $data['action'] : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $otp = isset($data['otp']) ? trim($data['otp']) : '';

    // Stage 1: Send OTP
    if ($action === 'send_otp') {
        if (!empty($email)) {
            // Check if the email exists in the database
            $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Generate a 6-digit OTP
                $generated_otp = rand(100000, 999999);

                // Store OTP in the database with an expiry time
                $stmt = $conn->prepare("UPDATE user SET otp = ?, otp_expiry = NOW() + INTERVAL 10 MINUTE WHERE email = ?");
                $stmt->bind_param("is", $generated_otp, $email);
                $stmt->execute();

                // Send OTP via email
                $to = $email;
                $subject = "Your OTP Code";
                $message = "Your OTP code is $generated_otp. It is valid for 10 minutes.";

                if (mail($to, $subject, $message)) {
                    echo json_encode(['success' => true, 'message' => 'OTP sent to email']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Failed to send OTP']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Email is required']);
        }

    // Stage 2: Verify OTP
    } elseif ($action === 'verify_otp') {
        if (!empty($email) && !empty($otp)) {
            $stmt = $conn->prepare("SELECT otp, otp_expiry FROM user WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if ($row['otp'] == $otp && strtotime($row['otp_expiry']) > time()) {
                    echo json_encode(['success' => true, 'message' => 'OTP verified. Proceed to reset password.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Email and OTP are required']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

    $conn->close();
?>
