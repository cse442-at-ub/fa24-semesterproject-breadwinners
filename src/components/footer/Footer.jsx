import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer">
            <nav className="footer-nav">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#help">Quick Help</a></li>
                    <li><a href="#terms">Terms of Use</a></li>
                    <li><a href="#privacy">Privacy</a></li>
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;