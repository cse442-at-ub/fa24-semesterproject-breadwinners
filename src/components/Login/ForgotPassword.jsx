import React, { useState } from 'react';
import './LoginPage.css'; // Reuse the same CSS as LoginPage

function ForgotPassword({ onGoBack }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP

    const handleSendOtp = (e) => {
        e.preventDefault();
        // Logic to send OTP to the entered email
        setStep(2); // Move to Step 2: Enter OTP
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        // Logic to verify OTP
        // Redirect to reset password page or handle the next step
    };

    return (
        <div className="forgot-password-container">
            {step === 1 ? (
                <>
                    <h2 className="login-title">Forgot <br></br> Password</h2>
                    <p className="welcome-text">Enter your email to receive an OTP</p>
                    <form onSubmit={handleSendOtp} className="login-form">
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
                        <button type="submit" className="login-button">Send OTP</button>
                    </form>
                    <p className="footer-links">
                        Don't have an account? <a href="#">Sign Up</a>
                    </p>
                    <p className="footer-links">
                        <a href="#" onClick={onGoBack}>Back to Login</a>
                    </p>
                </>
            ) : (
                <>
                    <h2 className="login-title">Enter OTP</h2>
                    <p className="welcome-text">Check your email for the OTP</p>
                    <form onSubmit={handleVerifyOtp} className="login-form">
                        <div className="input-group">
                            <label>OTP</label>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Verify OTP</button>
                    </form>
                    <p className="footer-links">
                        Didn't receive OTP? <a href="#" onClick={handleSendOtp}>Resend OTP</a>
                    </p>
                    <p className="footer-links">
                        <a href="#" onClick={onGoBack}>Back to Login</a>
                    </p>
                </>
            )}
        </div>
    );
}

export default ForgotPassword;
