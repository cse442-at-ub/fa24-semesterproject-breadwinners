import React, { useState, useEffect } from 'react';
import './DataGridPage.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Link, useNavigate } from 'react-router-dom';
import search from '../../assets/search-removebg-preview.png';
import Image9 from '../../assets/BreadWinnersPicture.png';

export default function DataGridPage() {
    const [rowData, setRowData] = useState([]); 
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortByBestSeller, setSortByBestSeller] = useState(false);
    const navigate = useNavigate();

    // Fetch CSRF token from cookies
    const getCsrfToken = () => {
        const csrfCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrf_token='));
        return csrfCookie ? csrfCookie.split('=')[1] : null;
    };

    // Fetch books data from the backend
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('./backend/fetch_books.php', {
                    method: 'GET',
                    credentials: 'include', // This allows sending cookies
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': getCsrfToken(), // Include CSRF token in the headers
                    }
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
                    'X-CSRF-Token': getCsrfToken(), // Include CSRF token in the headers
                },
                credentials: 'include', // Include cookies
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
        { headerName: 'Seller Email', field: 'seller_email', flex: 1, minWidth: 200 },
        { headerName: 'Rating', field: 'rating', cellRenderer: (params) => <span>{'⭐'.repeat(Math.floor(params.value))} ({params.value})</span>, minWidth: 120 },
        { headerName: 'Stock', field: 'stock', flex: 1, minWidth: 100 },
        { headerName: 'Price ($)', field: 'price', minWidth: 120 },
        { headerName: 'Purchase Count', field: 'total_books_sold', minWidth: 150 },
        {
            headerName: 'Actions',
            field: 'id', // Use book ID for navigation and actions
            cellRenderer: (params) => (
                <div>
                    <button onClick={() => handleAddToCart(params.value, params.data.title)} className="buy-book-button">
                        Buy Book
                    </button>
                    <button onClick={() => navigate(`/book/${params.value}`)} className="view-book-button">
                        View Book
                    </button>
                </div>
            ),
            minWidth: 200,
        },
    ];

    const handleAddToCart = async (bookId, bookTitle) => {
        try {
            // Sending a default quantity of 1 when adding the book
            const response = await fetch('./backend/add_to_cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookId, bookTitle, quantity: 1 }), // Include quantity
            });
    
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (data.success) {
                    console.log('Book added to cart successfully');
                } else {
                    console.error('Failed to add book to cart:', data.message);
                }
            } else {
                console.error('Received non-JSON response:', await response.text());
            }
        } catch (error) {
            console.error('Error adding book to cart:', error);
        }
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
