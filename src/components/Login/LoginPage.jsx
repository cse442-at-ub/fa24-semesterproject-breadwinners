import React, { useState } from 'react';
import './LoginPage.css';

import BreadWinnersPicture from '../../assets/BreadWinnersPicture.png';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
    };

    return (
        <div className="login-page">
            <div className="gradient-background">
              <img src={BreadWinnersPicture} alt="BreadWinners" className="breadwinners-image" />
            </div>
            <div className="login-container">
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

                <div className="footer-links">
                    <p>Don't have an account? <a href="#">Sign Up</a></p>
                    <p><a href="#">Forgot Password?</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
