import React from 'react';

const HospitalDashboard = () => {
    return (
        <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
            <h1>Hospital ETA Intake Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '20px' }}>
                Incoming emergency arrivals and exact ETAs will appear here.
            </p>
        </div>
    );
};

export default HospitalDashboard;
