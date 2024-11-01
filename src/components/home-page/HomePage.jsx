import React, { useState, useEffect } from 'react'; 
import './HomePage.css';
import { AgGridReact } from 'ag-grid-react';
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
                const response = await fetch('./backend/fetch_books.php', {
                    method: 'GET',
                    credentials: 'include', // Include credentials (cookies)
                });
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
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials (cookies)
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

    // Column definitions for the book grid
    const columns = [
        { headerName: 'Image', field: 'image_url', cellRenderer: (params) => <img src={params.value} alt="Book" width="100" />, minWidth: 120, filter: false },
        { headerName: 'Book Title', field: 'title', flex: 1, minWidth: 200 },
        { headerName: 'Author', field: 'author', flex: 1, minWidth: 150 },
        { headerName: 'Genre', field: 'genre', flex: 1, minWidth: 150 },
        { headerName: 'Seller', field: 'sellerImage', cellRenderer: () => <img src="https://via.placeholder.com/50" alt="Seller" width="50" style={{ borderRadius: '50%' }} />, minWidth: 100 },
        { headerName: 'Rating', field: 'rating', cellRenderer: (params) => <span>{'⭐'.repeat(Math.floor(params.value))} ({params.value})</span>, minWidth: 120 },
        { headerName: 'Stock', field: 'stock', flex: 1, minWidth: 100 },
        { headerName: 'Price ($)', field: 'price', minWidth: 120 },
        { headerName: 'Purchase Count', field: 'total_books_sold', minWidth: 150 },
        { headerName: 'Actions', field: 'id', cellRenderer: (params) => <button onClick={() => navigate(`/book/${params.value}`)} className="view-book-button">View Book</button>, minWidth: 150 },
    ];

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
                {books.map((book, index) => (
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