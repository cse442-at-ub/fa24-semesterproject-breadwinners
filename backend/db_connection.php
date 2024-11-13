<?php
$servername = "localhost:3306";
$username = "hassan4";
$password = "50396311";
$dbname = "hassan4_db";

// Create a new mysqli instance
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>