import React from 'react';
import './AboutUs.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';

function AboutUs() {
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
        <div className="about-us-page">

            <div className="about-us-content">
                <h1>About Us</h1>
                <p className="about-us-text">Team Breadwinners is a group of aspiring coders from the CSE442 class at UB, with the goal of creating a website that allows for the streamlined uploading and purchasing of books.</p>
            </div>

            <Footer />
        </div>
    );
}

export default AboutUs;