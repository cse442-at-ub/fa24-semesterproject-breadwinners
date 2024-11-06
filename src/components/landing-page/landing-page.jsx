import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './landPage.css';
import search from '../../assets/search-removebg-preview.png';

function LandingPage() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('./backend/guest_fetch_books.php');
                const data = await response.json();
                if (data.success) {
                    setBooks(data.books);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('An error occurred while fetching books.');
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="homepage">
            {/* Navbar for mobile view */}
            <nav className="navbar">
                <div className="nav-left">
                    
                </div>
                <Link to="/login"><button className="logout-button">Log In</button></Link>
            </nav>

            {/* Title for Breadwinners */}
            <h2 className="title">Breadwinners</h2>
            <h3 className="best-sellers-title">Explore Our Best Sellers</h3>
            <hr className="divider-line" />

            <div className="search-bar">
                <img src={search} alt="Search Icon" className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for books..."
                />
            </div>


            {/* Top navigation bar for larger screens */}
            <nav className="top-navbar">
                <div className="nav-items">
                </div>
                <Link to="/login"><button className="logout-button">Log In</button></Link>
            </nav>

            {/* Book List Section */}
            <div className="book-container">
                {error ? (
                    <div className="error-message">{error}</div>
                ) : books.length === 0 ? (
                    <div>Loading books...</div>
                ) : (
                    books.map((book) => (
                        <div className="book" key={book.id}>
                            <img src={`../${book.image_url}`} alt={book.title} />
                            <h3>{book.title}</h3>
                            <p className="author">{book.author}</p>
                            <Link to={`/guest-book/${book.id}`} className="view-details-link">View Details</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default LandingPage;
