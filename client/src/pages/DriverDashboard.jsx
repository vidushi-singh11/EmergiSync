import React from 'react';

const DriverDashboard = () => {
    return (
        <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
            <h1>Ambulance Driver Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '20px' }}>
                Live routing and clearance alerts will appear here.
            </p>
        </div>
    );
};

export default DriverDashboard;
