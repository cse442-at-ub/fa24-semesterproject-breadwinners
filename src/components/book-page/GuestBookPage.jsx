import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './BookPage.css';

export default function GuestBookPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookById = async () => {
            try {
                const response = await fetch(`../backend/fetchBookById.php?id=${id}`);
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

    const imageUrl = `../${book.image_url}`;
    const sanitizedTitle = DOMPurify.sanitize(book.title);
    const sanitizedAuthor = DOMPurify.sanitize(book.author);
    const sanitizedGenre = DOMPurify.sanitize(book.genre);
    const sanitizedDescription = DOMPurify.sanitize(book.description);

    return (
        <div className="book-page">
            <header className="header-bar">
                <h1 className="logo">BREADWINNERS</h1>
            </header>
            <div className="book-details-container">
                <div className="book-details">
                    <img src={imageUrl} alt={sanitizedTitle} className="book-cover" />
                    <div className="info-section">
                        <h2 className="title-author">{`${sanitizedTitle} by ${sanitizedAuthor}`}</h2>
                        <div className="rating">
                            <span className="rating-label">Rating:</span>
                            <span className="stars">{'⭐'.repeat(Math.floor(book.rating))}</span>
                        </div>
                        <div className="genre">
                            <span>Genre:</span> {sanitizedGenre}
                        </div>
                        <p className="description-label">Description:</p>
                        <p className="description">{sanitizedDescription}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
