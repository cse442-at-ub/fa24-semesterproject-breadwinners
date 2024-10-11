import React, { useState } from 'react';
import './RegisterPage.css';
import Image from '../../assets/bookstore-register-removebg-preview.png'; 
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        const requestBody = {
            firstName,
            lastName,
            email,
            password
        };
    
        try {
            const response = await fetch('./auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const data = await response.json();
            if (data.status === 'success') {
                alert('Registration successful!');
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="register-page">
              {/* Image Container */}
              <div className="image-container">
                        <img src={Image} alt="Description" className="registration-image" />
                </div>



            <div className="register-container">
                <h2 className="breadwinners-title">Breadwinners</h2>
                <h2 className="register-title">Create an Account</h2>
                <p className="welcome-text">Enter your personal data to create your account</p>
                <br/>
                <br/>

                <form onSubmit={handleRegister} className="register-form">
                    {/* Name Input Group */}
                    <div className="name-group">
                        {/* First Name Input */}
                        <div className="input-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Last Name Input */}
                        <div className="input-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    

                

                    {/* Email Input */}
                    <div className="input-group" style={{ marginTop: '20px' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="input-group" style={{ marginTop: '20px' }} >
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="password-hint">Must be at least 8 characters.</p>
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="register-button" style={{ marginTop: '40px' }}>Sign Up</button>
                </form>
                <div className="footer-links">
                    <p>Already have an account? <Link to="/login">Log In</Link> </p>
                </div>
            </div>
            
        </div>
    );
}

export default RegisterPage;