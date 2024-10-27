// BookPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookPage.css';

export default function BookPage() {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookById = async () => {
            try {
                const response = await fetch(`../backend/FetchBookById.php?id=${id}`); // Go up one directory and access backend
                const data = await response.json();
                if (data.success) {
                    setBook(data.book);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('An error occurred while fetching book details.');
            }
        };
        fetchBookById();
    }, [id]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!book) {
        return <div>Loading...</div>;
    }

    // Update the image URL to use a relative path
    const imageUrl = `../${book.image_url}`; // Adjust as needed

    return (
        <div className="book-page">
            <img src={imageUrl} alt={book.title} className="book-image" />
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Rating:</strong> {'⭐'.repeat(Math.floor(book.rating))} ({book.rating})</p>
            <p><strong>Price:</strong> ${book.price}</p>
            <p><strong>Stock:</strong> {book.stock}</p>
        </div>
    );
}
