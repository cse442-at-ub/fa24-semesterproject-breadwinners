import React, { useState } from 'react';
import './LoginPage.css';
import BreadWinnersPicture from '../../assets/BreadWinnersPicture.png';
import ForgotPassword from './ForgotPassword';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [isForgotPassword, setIsForgotPassword] = useState(false); // New state for forgot password view
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // Message for login feedback

    const handleLogin = async (e) => {
        e.preventDefault();

        // Send the login data to the backend PHP
        try {
            const response = await fetch('./auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage('Login Successful!'); // Success message
            } else {
                setMessage('Login Failed! Please check your credentials.'); // Failure message
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.'); // Network or server error
        }
    };
        return (
            <div className="login-page">
                <div className="gradient-background">
                  <img src={BreadWinnersPicture} alt="BreadWinners" className="breadwinners-image" />
                </div>
                <div className="login-container">
                    {!isForgotPassword ? (
                        <>
                            <h2 className="login-title">Log In</h2>
                            <p className="welcome-text">Welcome Back!</p>
    
                            <form onSubmit={handleLogin} className="login-form">
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="eg. johnfrans@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
    
                                <div className="input-group">
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
    
                                <button type="submit" className="login-button">Log In</button>
                            </form>

                            {/* Display the message after form submission */}
                            {message && <p className="login-message">{message}</p>}
    
                            <div className="footer-links">
                                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                                <p><a href="#" onClick={() => setIsForgotPassword(true)}>Forgot Password?</a></p>
                            </div>
                        </>
                    ) : (
                        <ForgotPassword onGoBack={() => setIsForgotPassword(false)} />
                    )}
                </div>
            </div>
        );
    }
    
export default LoginPage;
    