import React from 'react';
import './TermsOfService.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';

function TermsOfService() {
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
        <div className="terms-of-service-page">

            <div className="terms-of-service-content">
                <h1>Terms Of Service</h1>
                <p className="terms-of-service-text">Welcome to the Breadwinners book store website. Our terms are as follows:</p>
                <p className="terms-of-service-text">Do not modify, copy, and/or directly take the code involved in creating the website.</p>
                <p className="terms-of-service-text">Do not upload content that is illegal.</p>
                <p className="terms-of-service-text">Developers reserve the right to adjust catalogue as deemed necessary.</p>
                <p className="terms-of-service-text">Every user can have an account that is protected with a password.</p>
                <p className="terms-of-service-text">Breaking one of the rules involves potentially forfeitting the right to access and use the website. </p>
            </div>

            <Footer />
        </div>
    );
}

export default TermsOfService;