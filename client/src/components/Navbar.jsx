import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <div className="logo-icon"></div>
                    <span>EMERGISYNC</span>
                </Link>

                <div className="nav-links">
                    <a href="/#about" className="nav-link">About</a>
                    <a href="/#how-it-works" className="nav-link">How It Works</a>
                    <a href="/#contact" className="nav-link">Contact</a>
                </div>

                <div className="nav-actions">
                    <Link to="/login" className="btn btn-ghost" style={{ marginRight: '16px' }}>Login</Link>
                    <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
