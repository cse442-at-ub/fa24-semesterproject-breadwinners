<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connection.php';


$response = array();

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    try {
        $query = "SELECT id, title, author, description, image_url, price, genre, rating, stock, ratings_count FROM books WHERE id = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }
        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $response['success'] = true;
            $response['book'] = $result->fetch_assoc();
        } else {
            $response['success'] = false;
            $response['message'] = "No book found with ID $id.";
        }

        $stmt->close();
    } catch (Exception $e) {
        $response['success'] = false;
        $response['message'] = 'Failed to fetch book details: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Book ID is required.';
}

$conn->close();

echo json_encode($response);
?>