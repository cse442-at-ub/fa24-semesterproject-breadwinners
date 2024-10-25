<?php
// Database credentials
$servername = "localhost:3306"; 
$username = "hassan4"; 
$password = "50396311"; 
$db_name = "hassan_db"; 

// Create connection to MySQL database
$conn = new mysqli($servername, $username, $password, $db_name);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Check if sorting by best seller is requested
$sortByBestSeller = isset($_GET['sortByBestSeller']) && $_GET['sortByBestSeller'] === 'true';

// Construct SQL query to fetch book data
$sql = "SELECT * FROM books"; 

// If sorting by best seller, modify query to order by total_books_sold and rating
if ($sortByBestSeller) {
    $sql .= " ORDER BY total_books_sold DESC, rating DESC"; 
}

// Execute the query
$result = $conn->query($sql);

// Check if query was successful
if ($result->num_rows > 0) {
    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
    echo json_encode(['success' => true, 'books' => $books]);
} else {
    echo json_encode(['success' => false, 'message' => 'No books found']);
}

// Close connection
$conn->close();
?>