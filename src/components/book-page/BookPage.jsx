import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import './BookPage.css';

export default function BookPage() {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchBookById = async () => {
            try {
                const response = await fetch(`../backend/FetchBookById.php?id=${id}`);
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

    // Adjust image URL
    const imageUrl = `../${book.image_url}`;

    return (
        <div className="book-page">
            <header className="header-bar">
                <h1 className="logo">BREADWINNERS</h1>
            </header>
            <div className="book-details-container">
                <div className="book-details">
                    <div className="image-bookmark">
                        <img src={imageUrl} alt={book.title} className="book-cover" />
                        <IconButton color="primary" aria-label="bookmark this book" className="bookmark-icon">
                            <BookmarkIcon />
                        </IconButton>
                    </div>
                    <div className="info-section">
                        <h2 className="title-author">{`${book.title} by ${book.author}`}</h2>
                        <div className="rating">
                            <span className="rating-label">Rating:</span>
                            <span className="stars">{'⭐'.repeat(Math.floor(book.rating))}</span>
                        </div>
                        <div className="genre">
                            <span>Genre:</span> {book.genre}
                        </div>
                        <p className="description-label">Description:</p>
                        <p className="description">{book.description}</p>
                    </div>
                </div>
                <IconButton color="primary" aria-label="add to shopping cart" className="cart-icon">
                    <ShoppingCartIcon />
                </IconButton>
            </div>
        </div>
    );
}
