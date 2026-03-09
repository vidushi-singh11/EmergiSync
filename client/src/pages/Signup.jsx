import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRoleRedirection = async (user, isNewEmailSignup = false) => {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().role) {
                const role = userDoc.data().role;
                if (role === 'ambulance') navigate('/driver-dashboard');
                else if (role === 'controlRoom') navigate('/control-room');
                else if (role === 'hospital') navigate('/hospital-dashboard');
                else navigate('/role-selection');
            } else {
                // Create an empty profile if logging in with Google for the first time, 
                // or explicitly passing the name from the Email Signup form
                if (!userDoc.exists()) {
                    await setDoc(userDocRef, {
                        email: user.email,
                        name: isNewEmailSignup ? name : user.displayName || 'Officer',
                        createdAt: new Date()
                    });
                }
                navigate('/role-selection');
            }
        } catch (err) {
            console.error("Error fetching user role:", err);
            setError(`Profile Error: ${err.message}`);
            setLoading(false);
        }
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Pass true to flag that we have a 'name' explicitly provided
            await handleRoleRedirection(userCredential.user, true);
        } catch (err) {
            setError(err.message || 'Failed to create account');
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            await handleRoleRedirection(userCredential.user);
        } catch (err) {
            setError(err.message || 'Google authentication failed');
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-icon" style={{ margin: '0 auto 16px', width: '32px', height: '32px' }}></div>
                    <h2 className="auth-title">Request Access</h2>
                    <p className="auth-subtitle">Join the synchronization network</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="btn btn-ghost btn-block google-btn"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="google-icon" />
                    Continue with Google
                </button>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <form className="auth-form" onSubmit={handleEmailSignup}>
                    <div className="form-group">
                        <label className="form-label">Full Name / Callsign</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Unit Commander Ray"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="officer@emergisync.net"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                        {loading ? 'Processing...' : 'Submit Request'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have clearance? <Link to="/login" className="auth-link">Login Here</Link></p>
                </div>

                <div className="security-notice">
                    <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                    <span>All requests are manually verified for security.</span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
