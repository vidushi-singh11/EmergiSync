import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Truck, Monitor, PlusSquare } from 'lucide-react';

const RoleSelection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRoleSelect = async (role, path) => {
        if (!auth.currentUser) {
            setError("No authenticated user found. Please login again.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userDocRef, { role: role }, { merge: true });
            navigate(path);
        } catch (err) {
            console.error(err);
            setError("Failed to assign role. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in" style={{ padding: '80px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Select Your Portal</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Identify your operative role to access the correct command center.</p>
                {error && <div className="auth-error" style={{ maxWidth: '400px', margin: '20px auto 0' }}>{error}</div>}
            </div>

            <div className="role-grid">
                <div
                    className={`role-card ${loading ? 'disabled' : ''}`}
                    onClick={() => !loading && handleRoleSelect('ambulance', '/driver-dashboard')}
                >
                    <Truck size={32} className="role-icon" />
                    <h3 className="role-title">Ambulance Driver</h3>
                    <p className="role-description">Access live routing, clearance alerts, and fleet coordination.</p>
                </div>

                <div
                    className={`role-card ${loading ? 'disabled' : ''}`}
                    onClick={() => !loading && handleRoleSelect('controlRoom', '/control-room')}
                >
                    <Monitor size={32} className="role-icon" />
                    <h3 className="role-title">Control Room</h3>
                    <p className="role-description">Manage dispatches, monitor fleet status, and coordinate infrastructure.</p>
                </div>

                <div
                    className={`role-card ${loading ? 'disabled' : ''}`}
                    onClick={() => !loading && handleRoleSelect('hospital', '/hospital-dashboard')}
                >
                    <PlusSquare size={32} className="role-icon" />
                    <h3 className="role-title">Hospital Staff</h3>
                    <p className="role-description">Receive ETA syncs and prepare incoming critical care intakes.</p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
