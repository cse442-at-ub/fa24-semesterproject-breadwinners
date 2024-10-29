// HomePage.jsx
import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Fetch books data from the backend
        const fetchBooks = async () => {
            try {
                const response = await fetch('./backend/fetch_books.php');
                const data = await response.json();
                if (data.success) {
                    setBooks(data.books);
                } else {
                    console.error('Failed to fetch books:', data.message);
                }
            } catch (error) {
                console.error('An error occurred while fetching books:', error);
            }
        };
        fetchBooks();
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('./logout_backend.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                navigate('/login');
            } else {
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('An error occurred while logging out:', error);
        }
    };

    return (
        <div className="homepage">
            {/* Navbar for mobile view */}
            <nav className="navbar">
                <div className="nav-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        Menu
                    </button>
                    {menuOpen && (
                        <div className="menu-items">
                            <span>Homepage</span>
                            <span>Recent Purchase</span>
                            <span>Shopping cart</span>
                            <span>Seller Dashboard</span>
                            <span>Settings</span>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </nav>

            {/* Title for Breadwinners */}
            <h2 className="title">Breadwinners</h2>

            {/* Title for Best Sellers */}
            <h3 className="best-sellers-title">Explore Our Best Sellers</h3>
            {/* Blue Divider Line */}
            <hr className="divider-line" />
            {/* Search bar section */}
            <div className="search-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for books..."
                />
            </div>

            {/* Top navigation bar for larger screens */}
            <nav className="top-navbar">
                <div className="nav-items">
                    <span><Link to="/Homepage">Homepage</Link></span>
                    <span><Link to="/recent-purchase">Recent Purchase</Link></span>
                    <span><Link to="/shopping-cart">Shopping Cart</Link></span>
                    <span><Link to="/seller-dashboard">Seller Dashboard</Link></span>
                    <span><Link to="/settings">Settings</Link></span>
                    <span><Link to="/dataGridPage">Sorting Page</Link></span>
                </div>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </nav>

            {/* Secondary navigation bar for larger screens */}
            <nav className="secondary-navbar">
                <span>Hardcover</span>
                <span>Paperback</span>
                <span>E-books</span>
                <span>Audiobooks</span>
                <span>Textbooks</span>
            </nav>

            {/* Book List Section */}
            <div className="book-container">
                {books.map((book, index) => (
                    <div className="book" key={index}>
                        <img src={book.image_url} alt={`Book ${index + 1}`} />
                        <h2 className="book-title">{book.title}</h2>
                        <h3 className="author">{book.author}</h3>
                        <h3 className="price">${book.price}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;