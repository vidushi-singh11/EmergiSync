import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusSquare, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { createHospital, linkHospitalToUser } from '../services/firestoreService';

const HospitalSetup = () => {
    const { user, userProfile, loading: authLoading, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('Apollo Emergency Center');
    const [address, setAddress] = useState('15 Sarita Vihar, Mathura Road');
    const [capacity, setCapacity] = useState('700');
    const [availableBeds, setAvailableBeds] = useState('55');
    const [contactNumber, setContactNumber] = useState('+91 11 7890 1234');
    
    // Internal coordinate mock based on prompt request
    const mockLocation = { lat: 28.5355, lng: 77.2890 };
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
        if (!authLoading && userProfile?.assignedHospital) {
            navigate('/hospital-dashboard');
        }
    }, [user, userProfile, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !address || !capacity || !availableBeds || !contactNumber) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            // Generate a unique document ID for the hospital
            const hospitalId = `hosp_${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${Date.now()}`;
            
            const hospData = {
                name,
                address,
                location: mockLocation,
                capacity: parseInt(capacity, 10),
                availableBeds: parseInt(availableBeds, 10),
                emergencyAvailable: true,
                contactNumber
            };

            await createHospital(hospitalId, hospData);
            await linkHospitalToUser(user.uid, hospitalId);
            await refreshProfile();
            
            navigate('/hospital-dashboard');
        } catch (err) {
            console.error('Error setting up hospital:', err);
            setError('Failed to setup hospital environment. Please try again.');
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="setup-container"><p>Loading...</p></div>;
    }

    return (
        <div className="auth-container animate-fade-in" style={{ padding: '80px 24px' }}>
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div className="stepper-header">
                    <div className="step completed"><div className="step-circle">1</div>Role</div>
                    <div className="step-line active"></div>
                    <div className="step active"><div className="step-circle active">2</div>Setup</div>
                    <div className="step-line"></div>
                    <div className="step"><div className="step-circle">3</div>Dashboard</div>
                </div>

                <div className="auth-header" style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--accent-red)' }}>
                        <PlusSquare size={40} />
                    </div>
                    <h2 className="auth-title">Hospital Setup</h2>
                    <p className="auth-subtitle">Configure your facility capabilities for the network</p>
                </div>

                {error && <div className="auth-error"><AlertCircle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Facility Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Physical Address</label>
                        <input
                            type="text"
                            className="form-input"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Total Bed Capacity</label>
                            <input
                                type="number"
                                className="form-input"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Available ER Beds</label>
                            <input
                                type="number"
                                className="form-input"
                                value={availableBeds}
                                onChange={(e) => setAvailableBeds(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Emergency Contact Line</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: '24px' }}>
                        {loading ? 'Initializing Interface...' : 'Join Network & Enter Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HospitalSetup;
