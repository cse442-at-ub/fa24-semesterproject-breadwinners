<?php
$servername = "localhost:3306";
$username = "chonheic";
$password = "50413052";
$dbname = "chonheic_db";

// Create a new mysqli instance
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>