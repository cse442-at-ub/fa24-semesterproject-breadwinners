<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'C:\Users\tom29\vendor\phpmailer\phpmailer\src\Exception.php';
require 'C:\Users\tom29\vendor\phpmailer\phpmailer\src\PHPMailer.php';
require 'C:\Users\tom29\vendor\phpmailer\phpmailer\src\SMTP.php';

// Create a new PHPMailer instance
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->isSMTP();                                            // Set mailer to use SMTP
    $mail->Host       = 'smtp.buffalo.edu';                     // Specify SMTP server (replace with your SMTP server)
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'chonheic@buffalo.edu';               // SMTP username
    $mail->Password   = 'Chanr3446!';                  // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption, `ssl` also accepted
    $mail->Port       = 587;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('chonheic@buffalo.edu', 'Your Name');
    $mail->addAddress('chonheic@buffalo.edu');                  // Add recipient

    // Content
    $mail->isHTML(true);                                        // Set email format to HTML
    $mail->Subject = 'Test Mail from PHPMailer';
    $mail->Body    = 'This is a test email to confirm that PHPMailer works';

    // Send email
    $mail->send();
    echo 'Email sent successfully!';
} catch (Exception $e) {
    echo "Email sending failed. Error: {$mail->ErrorInfo}";
}
?>
