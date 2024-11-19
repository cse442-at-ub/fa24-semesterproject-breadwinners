import React from 'react';
import './Privacy.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';

function Privacy() {
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

    return (
        <div className="privacy-page">

            <div className="privacy-content">
                <h1>Privacy Terms</h1>
                <p className="privacy-text">We respect your privacy, and will not share any data you put insert for your account</p>
            </div>

            <Footer />
        </div>
    );
}

export default Privacy;