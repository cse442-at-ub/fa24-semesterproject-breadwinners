<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost:3306";
$username = "hassan4";
$password = "50396311";
$db_name = "hassan4_db";

$conn = new mysqli($servername, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$response = array();

try {
    if (!isset($_COOKIE['auth_token'])) {
        throw new Exception("Missing authorization token");
    }

    $auth_token = $_COOKIE['auth_token'];

    $query = "SELECT email FROM user WHERE auth_token = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    $stmt->bind_param("s", $auth_token);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        throw new Exception("Invalid authorization token");
    }
    $user = $result->fetch_assoc();
    $seller_email = $user['email'];
    $stmt->close();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['cover'])) {
            $uploadDir = __DIR__ . '/../cover/';
            $cover = $_FILES['cover'];
            $coverFileName = basename($cover['name']);
            $targetFilePath = $uploadDir . $coverFileName;

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            if (!move_uploaded_file($cover['tmp_name'], $targetFilePath)) {
                throw new Exception("Failed to upload cover image.");
            }
        } else {
            throw new Exception("Missing cover image.");
        }

        $title = $_POST['title'] ?? null;
        $author = $_POST['author'] ?? null;
        $genre = $_POST['genre'] ?? null;
        $price = $_POST['price'] ?? null;
        $stock = $_POST['stock'] ?? null;
        $description = $_POST['description'] ?? null; // Retrieve description

        if (!$title || !$author || !$genre || !$price || !$stock || !$description) {
            throw new Exception("Missing required book details");
        }

        $query = "INSERT INTO books (title, author, genre, price, stock, image_url, seller_email, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $image_url = './cover/' . $coverFileName;

        $stmt->bind_param(
            "ssssisss",
            $title,
            $author,
            $genre,
            $price,
            $stock,
            $image_url,
            $seller_email,
            $description // Bind description parameter
        );

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Book added successfully';
        } else {
            throw new Exception("Failed to add book: " . $stmt->error);
        }

        $stmt->close();
    } else {
        throw new Exception("Invalid request method");
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
