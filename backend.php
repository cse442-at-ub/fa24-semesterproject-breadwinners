<?php
    $servername = "localhost";
    $username = "root";
    $password = "";

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        echo "connection sucessfully\n";
    }

    // debug: create database if not already
    $db_name = "test_db";
    $sql = "CREATE DATABASE IF NOT EXISTS $db_name";
    if ($conn->query($sql) === TRUE) {
        echo "Database created successfully\n";
    } else {
        echo "Error creating database: " . $conn->error . "\n";
    }
    // Select the database
    $conn->select_db($db_name);

    // debug: create table. Note: VARCHAR can have size limit, TEXT doesn't
    $table_name = "user";      //change table name here, make sure no space
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        shopping_cart TEXT
    )";
    if ($conn->query($sql) === TRUE) {
        echo "Table {$table_name} created successfully\n";
    } else {
        echo "Error creating table {$table_name}: " . $conn->error . "\n";
    }

    // debug: insert sample data
    $sql = "INSERT INTO user (email, password, first_name, last_name, shopping_cart) VALUES
    ('testemail@test.com', '1234', 'Chris', 'Shen','Book7, Book8')"; //put simple data here
    if ($conn->query($sql) === TRUE) {
        echo "Sample data inserted successfully\n";
    } else {
        echo "Error inserting data: " . $conn->error . "\n";
    }

    $conn->close();
?>
