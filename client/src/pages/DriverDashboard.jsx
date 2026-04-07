import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, User, MapPin, Radio, Activity, AlertCircle, History, Navigation, Plus, Minus, Crosshair } from 'lucide-react';

const DriverDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.currentUser);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="driver-dashboard">
            {/* Top Navigation Bar */}
            <nav className="dashboard-nav">
                <div className="nav-left">
                    <div className="logo-icon small"></div>
                    <span className="logo-text">EmergiSync</span>
                </div>
                
                <div className="nav-right">
                    <div className="role-badge">ROLE: AMBULANCE</div>
                    <div className="unit-info">
                        <div className="unit-number">Unit AMB-042</div>
                        <div className="driver-name">Driver: {user?.email?.split('@')[0] || 'Unknown'}</div>
                    </div>
                    
                    <div className="profile-menu-container">
                        <button 
                            className="profile-btn" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <User size={18} />
                        </button>
                        
                        {isMenuOpen && (
                            <div className="profile-dropdown">
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="logout-btn-header" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="dashboard-content">
                {/* Map Section */}
                <div className="map-section">
                    {/* Floating Status Bar */}
                    <div className="floating-status-bar">
                        <div className="status-item">
                            <div className="label">UNIT ID</div>
                            <div className="value">AMB-042</div>
                        </div>
                        <div className="status-item">
                            <div className="label">STATUS</div>
                            <div className="value status-idle">
                                <span className="status-dot-green"></span> Idle
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="label">CURRENT LOCATION</div>
                            <div className="value">Sector 7, Urban ...</div>
                        </div>
                        <div className="status-item">
                            <div className="label">LAST UPDATE</div>
                            <div className="value">{currentTime}</div>
                        </div>
                        <button className="btn btn-red start-trip-btn">
                            <Radio size={18} className="mr-2" /> START EMERGENCY TRIP
                        </button>
                    </div>

                    {/* Map Area */}
                    <div className="map-view">
                        <div className="map-grid"></div>
                        
                        <div className="map-overlay-title">
                            <h3>Live Tracking</h3>
                            <p><span className="dot"></span> NEARBY FACILITIES (8KM RADIUS)</p>
                        </div>
                        
                        {/* Map Controls */}
                        <div className="map-controls">
                            <button className="map-control-btn"><Plus size={18} /></button>
                            <button className="map-control-btn"><Minus size={18} /></button>
                            <div className="divider"></div>
                            <button className="map-control-btn"><Crosshair size={18} /></button>
                        </div>

                        {/* Map Points */}
                        <div className="map-node hospital" style={{ top: '35%', left: '46%' }}>
                            <div className="node-icon">H</div>
                        </div>
                        
                        <div className="map-node hospital-labeled" style={{ top: '40%', left: '27%' }}>
                            <div className="node-icon">H</div>
                            <div className="node-label">City General - 3.2km</div>
                        </div>
                        
                        <div className="map-node hospital" style={{ top: '52%', left: '57%' }}>
                            <div className="node-icon">H</div>
                        </div>
                        
                        <div className="map-node hospital-labeled" style={{ top: '72%', left: '52%' }}>
                            <div className="node-icon">H</div>
                            <div className="node-label">St. Jude - 6.5km</div>
                        </div>

                        <div className="map-node ambulance">
                            <div className="pulsing-ring"></div>
                            <div className="ambulance-icon">
                                <Activity size={24} color="white" />
                            </div>
                            <div className="node-label center">LIVE TRACKING ACTIVE - UNIT IDLE</div>
                        </div>
                        
                        <div className="search-bar-container">
                            <input type="text" placeholder="Search coordinates or hospital..." className="map-search-input" />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="dashboard-sidebar">
                    <div className="sidebar-section active-trip-section align-center">
                        <h3 className="section-title">
                            <AlertCircle size={16} className="text-red mr-2" /> Trip Information
                        </h3>
                        
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Navigation size={24} />
                            </div>
                            <h4>No Active Trip</h4>
                            <p>Awaiting dispatch assignment. Telemetry and route details will populate here once a trip is active.</p>
                        </div>
                    </div>
                    
                    <div className="sidebar-section history-section">
                        <div className="history-header">
                            <History size={16} className="mr-2 text-gray" /> 
                            <span>Recent Trips</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
