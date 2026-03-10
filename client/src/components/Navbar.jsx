import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, LogOut } from 'lucide-react';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsMenuOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

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
                    {user ? (
                        <div className="profile-menu-container" ref={menuRef}>
                            <button
                                className="profile-btn"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="User menu"
                            >
                                <User size={20} />
                            </button>

                            {isMenuOpen && (
                                <div className="profile-dropdown">
                                    <div className="dropdown-item" style={{ pointerEvents: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px', paddingBottom: '12px' }}>
                                        <div style={{ maxWidth: '100%', fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {user.email}
                                        </div>
                                    </div>
                                    <button
                                        className="dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost" style={{ marginRight: '16px' }}>Login</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
