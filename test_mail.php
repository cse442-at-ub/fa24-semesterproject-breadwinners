<?php
// Override SMTP settings programmatically
ini_set('SMTP', 'smtp.buffalo.edu'); // Replace this with your university's SMTP server
ini_set('smtp_port', '587');          // Replace with the correct port (usually 587 for TLS)
ini_set('sendmail_from', 'chonheic@buffalo.edu'); // Replace with your sender's email

$to = 'chonheic@buffalo.edu';
$subject = 'Test Mail from PHP';
$message = 'This is a test email to confirm that mail() works';

if (mail($to, $subject, $message)) {
    echo "Email sent successfully";
} else {
    echo "Failed to send email";
}
?>
