import React, { useState } from 'react';
import './LoginPage.css'; // Reuse the same CSS as LoginPage
import { Link} from 'react-router-dom';

function ForgotPassword({ onGoBack }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP, Step 3: Reset password

    const handleSendOtp = (e) => {
        e.preventDefault();
        fetch('./forgot_pw.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'send_otp', email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setStep(2); // Move to Step 2: Enter OTP
            } else {
                alert(data.message); // Handle error
            }
        });
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        fetch('./forgot_pw.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'verify_otp', email, otp })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to reset password page or handle the next step
                alert('OTP Verified! Proceed to reset password.');
                setStep(3);
            } else {
                alert(data.message); // Handle error
            }
        });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
    
        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
    
        fetch('./forgot_pw.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'reset_password', email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password reset successful! Please log in with your new password.');
                // Redirect to login page or handle accordingly
                onGoBack();
            } else {
                alert(data.message); // Handle error
            }
        });
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
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                    <p className="footer-links">
                        <a href="#" onClick={onGoBack}>Back to Login</a>
                    </p>
                </>
            ) : step === 2 ? (
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
            ) : (
                <>
                    <h2 className="login-title">Reset Password</h2>
                    <p className="welcome-text">Enter your new password below</p>
                    <form onSubmit={handleResetPassword} className="login-form">
                        <div className="input-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Reset Password</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default ForgotPassword;
