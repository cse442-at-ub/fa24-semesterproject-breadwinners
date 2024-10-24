import React, { useState, useEffect } from 'react'; 
import './HomePage.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Link, useNavigate } from 'react-router-dom';
import search from '../../assets/search-removebg-preview.png';
import Image9 from '../../assets/BreadWinnersPicture.png';

export default function HomePage() {
    const [rowData, setRowData] = useState([]); // Fetch data from the backend
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch books data from the backend
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('./fetch_books.php'); // Replace with your actual backend endpoint
                const data = await response.json();
                if (data.success) {
                    setRowData(data.books); // Assuming the backend sends the books array in data.books
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

    const handleLogout = async () => {
        try {
            const response = await fetch('./logout_backend.php', {
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

    // Column definitions for the book grid
    const columns = [
        {
            headerName: 'Image',
            field: 'image_url', // Assuming 'image_url' holds the image path or URL
            cellRenderer: (params) => <img src={params.value} alt="Book" width="100" />,
            minWidth: 120,
            filter: false,
        },
        { headerName: 'Book Title', field: 'title', flex: 1, minWidth: 200 }, // Assuming 'title' holds the book title
        { headerName: 'Author', field: 'author', flex: 1, minWidth: 150 },
        { headerName: 'Genre', field: 'genre', flex: 1, minWidth: 150 },
        {
            headerName: 'Seller',
            field: 'sellerImage', // Hardcoded placeholder for seller image
            cellRenderer: () => (
                <img src="https://via.placeholder.com/50" alt="Seller" width="50" style={{ borderRadius: '50%' }} />
            ),
            minWidth: 100,
        },
        {
            headerName: 'Rating',
            field: 'rating',
            cellRenderer: (params) => <span>{'⭐'.repeat(Math.floor(params.value))} ({params.value})</span>,
            minWidth: 120,
        },
        { headerName: 'Stock', field: 'stock', flex: 1, minWidth: 100 },
        { headerName: 'Price ($)', field: 'price', minWidth: 120 },
        {
            headerName: 'Actions',
            field: 'id', // Use book ID for navigation
            cellRenderer: (params) => (
                <button onClick={() => navigate(`/book/${params.value}`)} className="view-book-button">
                    View Book
                </button>
            ),
            minWidth: 150,
        },
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
                <span>Hardcover</span>
                <span>Paperback</span>
                <span>E-books</span>
                <span>Audiobooks</span>
                <span>Textbooks</span>
            </nav>

            {/* Title and Search Bar */}
            <h2 className="title">Breadwinners - Best Books Available</h2>
            <div className="search-bar">
                <img src={search} alt="Search Icon" className="search-icon" />
                <input type="text" className="search-input" placeholder="Search for books..." />
            </div>

            {/* Book Grid Section */}
            <div style={{ height: 500, width: '100%' }} className="ag-theme-alpine book-grid">
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columns}
                    pagination={false}
                    domLayout="autoHeight"
                    getRowHeight={() => 155}
                />
            </div>
        </div>
    );
}
