import React, { useState } from 'react';
import './landPage.css';
import Image1 from '../../assets/1.png';
import Image2 from '../../assets/2.png';
import Image3 from '../../assets/3.png';
import Image4 from '../../assets/4.png';
import Image5 from '../../assets/5.png';
import Image6 from '../../assets/6.png';
import Image7 from '../../assets/7.png';
import Image8 from '../../assets/8.png';
import search from '../../assets/search-removebg-preview.png';
import { Link } from 'react-router-dom';

function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);



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

            {/* Title for Best Sellers */}
            <h3 className="best-sellers-title">Explore Our Best Sellers</h3>
            {/* Blue Divider Line */}
            <hr className="divider-line" />
            {/* Search bar section */}
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
                <div className="book">
                    <img src={Image1} alt="Book 1" />
                    <h3>Book Title 1</h3>
                    <p className="author">Author 1</p>
                </div>
                <div className="book">
                    <img src={Image2} alt="Book 2" />
                    <h3>Book Title 2</h3>
                    <p className="author">Author 2</p>
                </div>
                <div className="book">
                    <img src={Image3} alt="Book 3" />
                    <h3>Book Title 3</h3>
                    <p className="author">Author 3</p>
                </div>
                <div className="book">
                    <img src={Image4} alt="Book 4" />
                    <h3>Book Title 4</h3>
                    <p className="author">Author 4</p>
                </div>
                <div className="book">
                    <img src={Image5} alt="Book 5" />
                    <h3>Book Title 5</h3>
                    <p className="author">Author 5</p>
                </div>
                <div className="book">
                    <img src={Image6}alt="Book 6" />
                    <h3>Book Title 6</h3>
                    <p className="author">Author 6</p>
                </div>
                <div className="book">
                    <img src={Image7} alt="Book 7" />
                    <h3>Book Title 7</h3>
                    <p className="author">Author 7</p>
                </div>
                <div className="book">
                    <img src={Image8} alt="Book 8" />
                    <h3>Book Title 8</h3>
                    <p className="author">Author 8</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;