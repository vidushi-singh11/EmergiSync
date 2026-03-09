import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRoleRedirection = async (user) => {
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
                navigate('/role-selection');
            }
        } catch (err) {
            console.error("Error fetching user role:", err);
            setError(`Profile Error: ${err.message}`);
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleRoleRedirection(userCredential.user);
        } catch (err) {
            setError(err.message || 'Failed to authenticate');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
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
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Login to the command center</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="btn btn-ghost btn-block google-btn"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="google-icon" />
                    Continue with Google
                </button>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <form className="auth-form" onSubmit={handleEmailLogin}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="form-label">Password</label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
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
                        {loading ? 'Authenticating...' : 'Authenticate'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have clearance? <Link to="/signup" className="auth-link">Request Access</Link></p>
                </div>

                <div className="security-notice">
                    <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                    <span>Restricted System. Authorized personnel only.</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
