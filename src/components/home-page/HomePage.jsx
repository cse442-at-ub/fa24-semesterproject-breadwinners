// HomePage.jsx
import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';

<<<<<<< HEAD
export default function HomePage() {
    const [rowData, setRowData] = useState([]); 
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortByBestSeller, setSortByBestSeller] = useState(false);
    const navigate = useNavigate();
=======
function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [books, setBooks] = useState([]);
>>>>>>> dev

    useEffect(() => {
        // Fetch books data from the backend
        const fetchBooks = async () => {
            try {
<<<<<<< HEAD
                const response = await fetch(`./backend/fetch_books.php?sortByBestSeller=${sortByBestSeller}`);
                const data = await response.json();
                if (data.success) {
                    setRowData(data.books);
=======
                const response = await fetch('./backend/fetch_books.php');
                const data = await response.json();
                if (data.success) {
                    setBooks(data.books);
>>>>>>> dev
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

<<<<<<< HEAD
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

=======
>>>>>>> dev
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
                        <h2 className="book-title">{book.title}</h2>
                        <h3 className="author">{book.author}</h3>
                        <h3 className="price">${book.price}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
<<<<<<< HEAD
}
=======
}

export default HomePage;
>>>>>>> dev
