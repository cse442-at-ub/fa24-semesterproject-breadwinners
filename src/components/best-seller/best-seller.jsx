// BestSellersPage.jsx
import React, { useState, useEffect } from 'react';
import './best-seller.css';

function BestSellersPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch('./backend/best_seller_backend.php');
                const data = await response.json();

                if (data.success) {
                    setBooks(data.books);
                } else {
                    console.error('Failed to fetch best sellers:', data.message);
                }
            } catch (error) {
                console.error('An error occurred while fetching best sellers:', error);
            }
        };

        fetchBestSellers();
    }, []);

    return (
        <div className="best-sellers-page">
            <h1 className="header">Best Sellers</h1>
            <div className="book-container">
                {books.length > 0 ? (
                    books.map((book, index) => (
                        <div className="book" key={index}>
                            <img src={book.image_url} alt={book.title} />
                            <h2 className="book-title">{book.title}</h2>
                            <p className="author">{book.author}</p>
                            <p className="price">${book.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No best seller books available right now.</p>
                )}
            </div>
        </div>
    );
}

export default BestSellersPage;