// HomePage.jsx
import React, { useState, useEffect } from 'react';
import './HomePage.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import SearchIcon from '@mui/icons-material/Search';

function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('./backend/fetch_books.php', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.success) {
                    setBooks(data.books);
                    setFilteredBooks(data.books);
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
            const response = await fetch('./backend/logout_backend.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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

 

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();
        if (query) {
            const results = books.filter(
                (book) =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
            );
            setFilteredBooks(results);
        } else {
            setFilteredBooks(books);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setFilteredBooks(books);
    };

    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="nav-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        Menu
                    </button>
                    {menuOpen && (
                        <div className="menu-items">
                            <span>Homepage</span>
                            <span>Recent Purchase</span>
                            <span>Shopping Cart</span>
                            <span>Seller Dashboard</span>
                            <span>Settings</span>
                            <span>Wishlist</span>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </nav>

            <nav className="top-navbar">    
                <div className="nav-items">
                    <span><Link to="/Homepage">Homepage</Link></span>
                    <span><Link to="/dataGridPage">Sortpage</Link></span>
                    <span><Link to="/wishlist">Wishlist</Link></span>
                    <span><Link to="/recent-purchase">Recent Purchase</Link></span>
                    <span><Link to="/seller-dashboard">Seller Dashboard</Link></span>
                    <span><Link to="/shopping-cart">Shopping Cart</Link></span>
                    <span><Link to="/settings">Settings</Link></span>
                </div>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </nav>

            <nav className="secondary-navbar">
            <span
                onClick={() => navigate('/best-seller')}
                className="best-seller-link"
                style={{
                    color: 'white',
                    cursor: 'pointer',
                }}
            >
                Best Seller
            </span>
                <span>Hardcover</span>
                <span>E-books</span>
                <span>Audiobooks</span>
                <span>Textbooks</span>
            </nav>

            <h2 className="title">Breadwinners - Best Books Available</h2>

            <div className="search-bar">
                <SearchIcon className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for books by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button onClick={handleSearch} className="search-button">Search</button>
                <button onClick={handleClearSearch} className="clear-button">Clear</button>
            </div>

            <div className="book-container">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book, index) => (
                        <div className="book" key={index}>
                            <Link to={`/book/${book.id}`}>
                                <img src={book.image_url} alt={`Book ${index + 1}`} />
                            </Link>
                            <h2 className="book-title">{DOMPurify.sanitize(book.title)}</h2>
                            <h3 className="author">{DOMPurify.sanitize(book.author)}</h3>
                            <h3 className="price">${book.price}</h3>
                        </div>
                    ))
                ) : (
                    <div className="no-results">No books found matching your search criteria.</div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
