<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    //ini_set('display_errors', 1);
    //ini_set('display_startup_errors', 1);
    //error_reporting(E_ALL);

    // Database connection
    $servername = "localhost:3306";
    $username = "chonheic";
    $password = "50413052";
    $db_name = "chonheic_db";

    // Create a connection to the MySQL database
    $conn = new mysqli($servername, $username, $password, $db_name);

    // Check the database connection
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
        exit();
    }

    // Get the user's email or user id (this should be passed from frontend)
    // Assuming we receive the user's email to identify the cart
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];

    // Query to get the user's shopping cart
    $sql_user = "SELECT shopping_cart FROM user WHERE email = ?";
    $stmt_user = $conn->prepare($sql_user);
    $stmt_user->bind_param("s", $email);
    $stmt_user->execute();
    $result_user = $stmt_user->get_result();

    if ($result_user->num_rows > 0) {
        $row_user = $result_user->fetch_assoc();
        $cart_books = $row_user['shopping_cart']; // This will be a string like "Book7, Book8"

        // Convert the string to an array
        $cart_books_array = explode(", ", $cart_books);

        // Prepare an array to store the cart item details
        $cartItems = [];

        // Loop through each book in the cart
        foreach ($cart_books_array as $book_title) {
            // Query to get details of each book from the books table
            $sql_books = "SELECT * FROM books WHERE title = ?";
            $stmt_books = $conn->prepare($sql_books);
            $stmt_books->bind_param("s", $book_title);
            $stmt_books->execute();
            $result_books = $stmt_books->get_result();

            if ($result_books->num_rows > 0) {
                $book_row = $result_books->fetch_assoc();

                // Add the book details to the cartItems array
                $cartItems[] = [
                    'title' => $book_row['title'],
                    'author' => $book_row['author'],
                    'price' => $book_row['price'],
                    'quantity' => 1, // Default quantity to 1 for now
                    'image' => $book_row['image_url']
                ];
            }
        }

        // Output the cart items in JSON format
        echo json_encode(['success' => true, 'items' => $cartItems]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found or cart is empty']);
    }

    // Close the statements and connection
    $stmt_user->close();
    $conn->close();
?>