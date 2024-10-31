<?php
// Enable JSON response and CORS
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://your-domain.com"); // Specify allowed origin
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Content-Security-Policy: default-src 'self';");

// Enable error reporting for debugging (turn off in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db_connection.php';
$response = array();

// Sanitize input function
function sanitize_input($data)
{
    $data = trim($data);
    $data = strip_tags($data); // Remove HTML tags
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8'); // Encode special chars
    return $data;
}

try {
    // Check HttpOnly cookie for auth_token
    if (!isset($_COOKIE['auth_token'])) {
        throw new Exception("Missing authorization token");
    }

    $auth_token = sanitize_input($_COOKIE['auth_token']); // Sanitize token (precaution)

    // Verify auth token
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
            $coverFileName = basename(sanitize_input($cover['name'])); // Sanitize filename
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

        // Sanitize and validate book details
        $title = sanitize_input($_POST['title'] ?? null);
        $author = sanitize_input($_POST['author'] ?? null);
        $genre = sanitize_input($_POST['genre'] ?? null);
        $price = filter_var($_POST['price'] ?? null, FILTER_VALIDATE_FLOAT);
        $stock = filter_var($_POST['stock'] ?? null, FILTER_VALIDATE_INT);
        $description = sanitize_input($_POST['description'] ?? null);

        if (!$title || !$author || !$genre || !$price || !$stock || !$description) {
            throw new Exception("Missing or invalid required book details");
        }

        // Prepare and execute insertion
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
            $description
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