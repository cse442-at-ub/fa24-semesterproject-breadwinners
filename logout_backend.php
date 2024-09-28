<?php
    // simulate login status
    $login = TRUE;

    if ($login) {
        // Simulate a login from a POST or GET request
        session_start();
        $_SESSION['username'] = 'testuser'; // Simulate a logged-in user
        echo "testing logged in as: " . $_SESSION['username'];
    } else {
        echo "testing not logged in: Guest";
    }
?>

<?php
    // Function to send a response with a specific status code and message
    function sendResponse($statusCode, $message) {
        http_response_code($statusCode);
        echo $message;
        exit;
    }

    // Check if the request has an Authorization header
    $authToken = 'asdf';
    if (empty($authToken)) {
        sendResponse(401, "401 Unauthorized: No auth token provided.");
    }

    $validToken = 'asdf';

    if ($authToken !== $validToken) {
        sendResponse(403, "403 Forbidden: Invalid auth token.");
    }

    // Check if the user is logged in
    if (isset($_SESSION['username'])) {
        // Destroy the session
        session_destroy();

        // Send a success message with a 200 status code
        sendResponse(200, "200 You have been logged out successfully.");
    } else {
        // If no session is found, respond with a 400 status code
        sendResponse(400, "400 Bad Request: You are not logged in.");
    }
?>
