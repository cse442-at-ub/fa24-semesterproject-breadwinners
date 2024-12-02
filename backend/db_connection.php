<?php
$servername = "localhost:3306";
$username = "sahmed35";
$password = "50398839";
$dbname = "sahmed35_db";

// Create a new mysqli instance
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>