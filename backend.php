<?php
    $servername = "localhost:3306";
    $username = "chonheic"; //ubit
    $password = "50413052"; //person number

    // Create connection
    $conn = new mysqli($servername, $username, $password);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        echo "connection sucessfully\n";
    }

    // debug: create database if not already
    $db_name = "chonheic_db";
    //$sql = "CREATE DATABASE IF NOT EXISTS $db_name";
    //if ($conn->query($sql) === TRUE) {
    //    echo "Database created successfully\n";
    //} else {
    //    echo "Error creating database: " . $conn->error . "\n";
    //}
    // Select the database
    $conn->select_db($db_name);

    // debug: create table. Note: VARCHAR can have size limit, TEXT doesn't
    $table_name = "books";      //change table name here, make sure no space
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50) NOT NULL,
        author VARCHAR(50) NOT NULL,
        description TEXT,
        image_url TEXT,   
        price INT(10)
    )";
    if ($conn->query($sql) === TRUE) {
        echo "Table {$table_name} created successfully\n";
    } else {
        echo "Error creating table {$table_name}: " . $conn->error . "\n";
    }

    // debug: change the table column
    //$sql = "ALTER TABLE $table_name 
    //ADD COLUMN IF NOT EXISTS image_url TEXT, 
    // ADD COLUMN IF NOT EXISTS otp_expiry DATETIME";
    //if ($conn->query($sql) === TRUE) {
    //    echo "Table {$table_name} altered successfully\n";
    //} else {
    //    echo "Error altering table {$table_name}: " . $conn->error . "\n";
    //}

    // debug: insert sample data
    $sql = "INSERT INTO books (title, author, description, image_url, price) VALUES
    ('book7', 'me', 'help', './cover/book7.png','123')"; //put simple data here
    if ($conn->query($sql) === TRUE) {
        echo "Sample data inserted successfully\n";
    } else {
        echo "Error inserting data: " . $conn->error . "\n";
    }

    $conn->close();
?>