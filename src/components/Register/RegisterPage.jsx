import React, { useState } from 'react';
import './RegisterPage.css';
import Image from '../../assets/bookstore-register-removebg-preview.png'; 

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        // Handle registration logic here
    };

    return (
        <div className="register-page">
              {/* Image Container */}
              <div className="image-container">
                        <img src={Image} alt="Description" className="registration-image" />
                </div>



            <div className="register-container">
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
                    <p>Already have an account? <a href="#">Log In</a></p>
                </div>
            </div>
            
        </div>
    );
}

export default RegisterPage;