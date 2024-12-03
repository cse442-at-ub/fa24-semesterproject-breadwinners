<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token");

include 'db_connection.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $bookId = $data['id'] ?? null;
    $newRating = $data['rating'] ?? null;

    if (!$bookId || !$newRating || $newRating < 1 || $newRating > 5) {
        $response['success'] = false;
        $response['message'] = 'Invalid input data.';
        echo json_encode($response);
        exit();
    }

    try {
        // Fetch current rating and ratings count for the book
        $stmt = $conn->prepare("SELECT rating, ratings_count FROM books WHERE id = ?");
        $stmt->bind_param("i", $bookId);
        $stmt->execute();
        $stmt->bind_result($currentRating, $ratingsCount);
        $stmt->fetch();
        $stmt->close();

        // Calculate new average rating
        $newAverageRating = (($currentRating * $ratingsCount) + $newRating) / ($ratingsCount + 1);
        $newRatingsCount = $ratingsCount + 1;

        // Ensure the new average rating is formatted to 2 decimal places
        $newAverageRating = number_format($newAverageRating, 2, '.', '');

        // Update rating and ratings count in the database
        $stmt = $conn->prepare("UPDATE books SET rating = ?, ratings_count = ? WHERE id = ?");
        $stmt->bind_param("dii", $newAverageRating, $newRatingsCount, $bookId);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Rating updated successfully.';
            $response['newRating'] = $newAverageRating;
            $response['newRatingsCount'] = $newRatingsCount;
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to update rating.';
        }
        $stmt->close();
    } catch (Exception $e) {
        $response['success'] = false;
        $response['message'] = 'Error: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

$conn->close();
echo json_encode($response);
?>