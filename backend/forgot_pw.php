<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    //ini_set('display_errors', 1);
    //ini_set('display_startup_errors', 1);
    //error_reporting(E_ALL);

    // Database connection
    include 'db_connection.php';

    // Get the raw POST data and decode it
    $data = json_decode(file_get_contents('php://input'), true);
    $action = isset($data['action']) ? $data['action'] : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $otp = isset($data['otp']) ? trim($data['otp']) : '';
    $password = isset($data['password']) ? trim($data['password']) : '';

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

                // Store OTP in the database
                $stmt = $conn->prepare("UPDATE user SET otp = ? WHERE email = ?");
                $stmt->bind_param("is", $generated_otp, $email);
                $stmt->execute();

                // Send OTP via email
                $to = $email;
                $subject = "Your OTP Code";
                $message = "Your OTP code is $generated_otp.";

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
            $stmt = $conn->prepare("SELECT otp FROM user WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if ($row['otp'] == $otp) {
                    echo json_encode(['success' => true, 'message' => 'OTP verified. Proceed to reset password.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Invalid OTP']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'User not found']);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Email and OTP are required']);
        }

    // Stage 3: Reset Password
    } elseif ($action === 'reset_password') {
        if (!empty($email) && !empty($password)) {
            // Generate a new salt
            $salt = bin2hex(random_bytes(8));

            // Hash the new password with the salt
            $hashed_password = password_hash($salt . $password, PASSWORD_DEFAULT);

            // Update the user's password and salt in the database
            $stmt = $conn->prepare("UPDATE user SET password = ?, salt = ? WHERE email = ?");
            $stmt->bind_param("sss", $hashed_password, $salt, $email);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Password reset successful']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to reset password']);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Email and new password are required']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

    $conn->close();
?>