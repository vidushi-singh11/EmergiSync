import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { createAmbulance, linkAmbulanceToUser } from '../services/firestoreService';

const AmbulanceSetup = () => {
    const { user, userProfile, loading: authLoading, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const [unitId, setUnitId] = useState('');
    const [vehicleType, setVehicleType] = useState('BLS');
    const [contactNumber, setContactNumber] = useState('');
    const [baseStation, setBaseStation] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
        if (!authLoading && userProfile?.assignedAmbulance) {
            navigate('/driver-dashboard');
        }
    }, [user, userProfile, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!unitId || !contactNumber || !baseStation) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            // Generate a document ID for the ambulance
            const ambulanceId = `amb_${unitId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${Date.now()}`;
            
            const ambData = {
                unitId,
                driverName: userProfile?.name || user?.email || 'Unknown',
                driverUid: user.uid,
                vehicleType,
                contactNumber,
                baseStation,
            };

            await createAmbulance(ambulanceId, ambData);
            await linkAmbulanceToUser(user.uid, ambulanceId);
            await refreshProfile();
            
            navigate('/driver-dashboard');
        } catch (err) {
            console.error('Error setting up ambulance:', err);
            setError('Failed to setup ambulance unit. Please try again.');
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
                        <Truck size={40} />
                    </div>
                    <h2 className="auth-title">Ambulance Setup</h2>
                    <p className="auth-subtitle">Configure your vehicle to enter the network</p>
                </div>

                {error && <div className="auth-error"><AlertCircle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Unit ID / Callsign</label>
                        <input
                            type="text"
                            className="form-input"
                            value={unitId}
                            onChange={(e) => setUnitId(e.target.value)}
                            placeholder="e.g. AMB-042"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Driver Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={userProfile?.name || ''}
                            disabled
                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Vehicle Type</label>
                        <select 
                            className="form-input"
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            style={{ appearance: 'auto', backgroundColor: '#0a0505', color: 'white' }}
                        >
                            <option value="BLS">Basic Life Support (BLS)</option>
                            <option value="ALS">Advanced Life Support (ALS)</option>
                            <option value="CCV">Critical Care Vehicle (CCV)</option>
                            <option value="NEONATAL">Neonatal Ambulance</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="+91 9876543210"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Base Station / Default Area</label>
                        <input
                            type="text"
                            className="form-input"
                            value={baseStation}
                            onChange={(e) => setBaseStation(e.target.value)}
                            placeholder="e.g. Sector 7 Hospital Hub"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: '24px' }}>
                        {loading ? 'Initializing Unit...' : 'Initialize System & Enter Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AmbulanceSetup;
