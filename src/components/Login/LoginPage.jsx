import React, { useState } from 'react';
import DOMPurify from 'dompurify'; // Import DOMPurify
import './LoginPage.css';
import BreadWinnersPicture from '../../assets/BreadWinnersPicture.png';
import ForgotPassword from './ForgotPassword';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Sanitize the email and password before sending to backend
            const sanitizedEmail = DOMPurify.sanitize(email);
            const sanitizedPassword = DOMPurify.sanitize(password);

            const response = await fetch('./backend/login_backend.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: sanitizedEmail, password: sanitizedPassword }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                setMessage(DOMPurify.sanitize('Login Successful!'));
                localStorage.setItem('email', email);
                // Navigate to the Homepage after login

                navigate('/Homepage');
            } else {
                setMessage(DOMPurify.sanitize(data.message || 'Login Failed! Please check your credentials.'));
            }
        } catch (error) {
            setMessage(DOMPurify.sanitize(`An error occurred: ${error.message}`));
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('./backend/logout_backend.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();

            if (data.success) {
                setMessage(DOMPurify.sanitize('Logged out successfully'));
                navigate('/');
            } else {
                setMessage(DOMPurify.sanitize(data.message || 'Logout Failed!'));
            }
        } catch (error) {
            setMessage(DOMPurify.sanitize(`An error occurred: ${error.message}`));
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
                                    onChange={(e) => setEmail(DOMPurify.sanitize(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(DOMPurify.sanitize(e.target.value))}
                                    required
                                />
                                <p className="password-hint">Must be at least 8 characters.</p>
                            </div>

                            <button type="submit" className="login-button">Log In</button>
                        </form>

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
