import React, { useState, useEffect } from 'react'; 
import './HomePage.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization
import search from '../../assets/search-removebg-preview.png';
import Image9 from '../../assets/BreadWinnersPicture.png';

export default function HomePage() {
    const [rowData, setRowData] = useState([]); 
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortByBestSeller, setSortByBestSeller] = useState(false);
    const navigate = useNavigate();

    // Fetch books data from the backend
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`./backend/fetch_books.php?sortByBestSeller=${sortByBestSeller}`);
                const data = await response.json();
                if (data.success) {
                    setRowData(data.books);
                } else {
                    console.error('Failed to fetch books:', data.message);
                }
            } catch (error) {
                console.error('An error occurred while fetching books:', error);
            }
        };
        fetchBooks();
    }, [sortByBestSeller]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('./backend/logout_backend.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    // Handle Best Seller sort
    const handleBestSellerSort = () => {
        setSortByBestSeller((prev) => !prev); 
    };

    
    return (
        <div className="homepage">
            {/* Mobile Navbar */}
            <nav className="navbar">
                <div className="nav-left">
                    <button className="menu-button" onClick={toggleMenu}>Menu</button>
                    {menuOpen && (
                        <div className="menu-items">
                            <span>Homepage</span>
                            <span>Recent Purchase</span>
                            <span>Shopping Cart</span>
                            <span>Seller Dashboard</span>
                            <span>Settings</span>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </nav>

            {/* Desktop Top Navbar */}
            <nav className="top-navbar">
                <div className="nav-items">
                    <img src={Image9} alt="User Profile" className="profile-image" />
                    <span><Link to="/Homepage">Homepage</Link></span>
                    <span><Link to="/dataGridPage">Sortpage</Link></span>
                    <span><Link to="/recent-purchase">Recent Purchase</Link></span>
                    <span><Link to="/shopping-cart">Shopping Cart</Link></span>
                    <span><Link to="/seller-dashboard">Seller Dashboard</Link></span>
                    <span><Link to="/settings">Settings</Link></span>
                </div>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </nav>

            {/* Secondary Navbar */}
            <nav className="secondary-navbar">
                <span onClick={handleBestSellerSort} className="best-seller-link">Best Seller</span> 
                <span>Hardcover</span>
                <span>E-books</span>
                <span>Audiobooks</span>
                <span>Textbooks</span>
            </nav>

            {/* Book List Section */}
            <div className="book-container">
                {rowData.map((book, index) => (
                    <div className="book" key={index}>
                        <img src={book.image_url} alt={`Book ${index + 1}`} />
                        <h2 className="book-title">{DOMPurify.sanitize(book.title)}</h2>
                        <h3 className="author">{DOMPurify.sanitize(book.author)}</h3>
                        <h3 className="price">${book.price}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}