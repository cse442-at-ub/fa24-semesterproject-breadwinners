<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    // Enable error reporting for debugging (can be disabled in production)
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // Database connection
    $servername = "localhost:3306";
    $username = "chonheic"; // your ubit
    $password = "50413052"; // your person number
    $db_name = "cse442_2024_fall_team_y_db"; // Your actual database name

    // Create connection to the MySQL database
    $conn = new mysqli($servername, $username, $password, $db_name);

    // Check database connection
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
        exit();
    }

    // Function to validate auth token and extract email
    function getEmailFromAuthToken($token) {
        // For demonstration purposes, we'll assume the token is just the email in plain text.
        // In a real implementation, you would validate the token properly (e.g., using JWT).
        return $token; // Replace with actual token validation logic
    }

    // Get auth token from cookies
    if (!isset($_COOKIE['auth_token'])) {
        echo json_encode(['success' => false, 'message' => 'Auth token is required']);
        exit();
    }

    $auth_token = $_COOKIE['auth_token'];
    $email = getEmailFromAuthToken($auth_token);

    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Invalid auth token']);
        exit();
    }

    // Get the raw POST data and decode it
    $data = json_decode(file_get_contents('php://input'), true);
    $action = isset($data['action']) ? $data['action'] : '';
    
    if ($action === 'update_quantity') {
        // Handle updating the quantity of a book in the cart
        $title = isset($data['title']) ? $data['title'] : '';
        $quantity = isset($data['quantity']) ? (int)$data['quantity'] : 0;

        if (empty($title) || $quantity < 1) {
            echo json_encode(['success' => false, 'message' => 'Invalid book title or quantity']);
            exit();
        }

        // Fetch the current shopping cart
        $sql = "SELECT shopping_cart FROM user WHERE auth_token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $shopping_cart = $row['shopping_cart'];
            
            // Remove existing entries of the book title from the cart
            $cart_items = empty($shopping_cart) ? [] : explode(', ', $shopping_cart);
            $updated_cart_items = array_filter($cart_items, function($item) use ($title) {
                return $item !== $title;
            });

            // Add the book title `quantity` number of times
            for ($i = 0; $i < $quantity; $i++) {
                $updated_cart_items[] = $title;
            }

            // Update the user's shopping cart in the database
            $updated_cart = implode(', ', $updated_cart_items);
            $update_sql = "UPDATE user SET shopping_cart = ? WHERE auth_token = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("ss", $updated_cart, $email);
            if ($update_stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Quantity updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update shopping cart']);
            }
            $update_stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }

        $stmt->close();
    } else if ($action === 'remove_book') {
        // Handle removing a book from the cart
        $title = isset($data['title']) ? $data['title'] : '';
        if (empty($title)) {
            echo json_encode(['success' => false, 'message' => 'Book title is required']);
            exit();
        }

        // Fetch the current shopping cart
        $sql = "SELECT shopping_cart FROM user WHERE auth_token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $shopping_cart = $row['shopping_cart'];
            
            if (!empty($shopping_cart)) {
                // Remove the book title from the shopping cart
                $cart_items = explode(', ', $shopping_cart);
                $updated_cart_items = array_filter($cart_items, function($item) use ($title) {
                    return $item !== $title;
                });
                
                // Update the user's shopping cart in the database
                $updated_cart = implode(', ', $updated_cart_items);
                $update_sql = "UPDATE user SET shopping_cart = ? WHERE auth_token = ?";
                $update_stmt = $conn->prepare($update_sql);
                $update_stmt->bind_param("ss", $updated_cart, $email);
                if ($update_stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Book removed successfully']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Failed to update shopping cart']);
                }
                $update_stmt->close();
            } else {
                echo json_encode(['success' => false, 'message' => 'Shopping cart is empty']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }

        $stmt->close();
    } else {
        // Handle fetching the shopping cart (default action)
        $sql = "SELECT shopping_cart FROM user WHERE auth_token = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $shopping_cart = $row['shopping_cart'];

            if (empty($shopping_cart)) {
                // Handle empty cart
                echo json_encode(['success' => true, 'items' => []]);
            } else {
                // Split the shopping_cart string into an array of book titles
                $cart_items = explode(', ', $shopping_cart);

                // Prepare an array to hold book details
                $books_in_cart = [];

                // Loop through the cart items and fetch book details from the books table
                foreach ($cart_items as $book_title) {
                    $book_sql = "SELECT title, author, description, image_url, price FROM books WHERE title = ?";
                    $book_stmt = $conn->prepare($book_sql);
                    $book_stmt->bind_param("s", $book_title);
                    $book_stmt->execute();
                    $book_result = $book_stmt->get_result();

                    if ($book_result->num_rows > 0) {
                        $book_row = $book_result->fetch_assoc();
                        $existing_book_index = array_search($book_title, array_column($books_in_cart, 'title'));
                        if ($existing_book_index !== false) {
                            $books_in_cart[$existing_book_index]['quantity'] += 1;
                        } else {
                            $books_in_cart[] = [
                                'title' => $book_row['title'],
                                'author' => $book_row['author'],
                                'description' => $book_row['description'],
                                'image_url' => $book_row['image_url'],
                                'price' => $book_row['price'],
                                'quantity' => 1
                            ];
                        }
                    }
                }

                // Return the book details as JSON
                echo json_encode(['success' => true, 'items' => $books_in_cart]);
            }
        } else {
            // Handle case where user doesn't exist
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }

        $stmt->close();
    }

    $conn->close();
?>