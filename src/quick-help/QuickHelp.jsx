import React from 'react';
import './QuickHelp.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';

function QuickHelp() {
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
        <div className="quick-help-page">

            <div className="quick-help-content">
                <h1>Quick Help</h1>
                <p className="quick-help-text">Go to the Discord for help, or contact the PM/Instructor</p>
            </div>

            <Footer />
        </div>
    );
}

export default QuickHelp;