import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Download, AlertTriangle, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getAllActiveTrips, getAllAmbulances, getHospitals } from '../services/firestoreService';

const severityConfig = {
    'CARDIAC': { level: 'L1 - CRITICAL', class: 'sev-l1' },
    'TRAUMA': { level: 'L2 - SEVERE', class: 'sev-l2' },
    'STROKE': { level: 'L1 - CRITICAL', class: 'sev-l1' },
    'MATERNITY': { level: 'L3 - MODERATE', class: 'sev-l3' },
    'RESPIRATORY': { level: 'L2 - SEVERE', class: 'sev-l2' },
    'OTHER': { level: 'L4 - STABLE', class: 'sev-l4' }
};

const HospitalDashboard = () => {
    const { user, userProfile, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [ambulances, setAmbulances] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user || userProfile?.role !== 'hospital') {
            navigate('/login');
        }
    }, [user, userProfile, authLoading, navigate]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [tripsData, ambData, hospData] = await Promise.all([
                    getAllActiveTrips(),
                    getAllAmbulances(),
                    getHospitals()
                ]);
                setTrips(tripsData);
                setAmbulances(ambData);
                setHospitals(hospData);
            } catch (err) {
                console.error("Error fetching data", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchDashboardData();
        // In a production app, we would use onSnapshot instead of getDocs for live updates here.
        // For the sake of the demo UI, polling every 10 seconds is an easy substitute.
        const interval = setInterval(fetchDashboardData, 10000);
        return () => clearInterval(interval);
    }, []);

    // Helper: Map an ambulance ID to its Unit ID
    const getUnitId = (ambId) => {
        const match = ambulances.find(a => a.id === ambId);
        return match ? match.unitId : 'UNK-UNIT';
    };

    // Helper: Map hospital ID to Name
    const getHospName = (hospId) => {
        const match = hospitals.find(h => h.id === hospId);
        return match ? match.name : 'Unknown Destination';
    };

    // Helper: Format Time Difference as ETA MM:SS
    const calculateEta = (trip) => {
        if (!trip.timestamps?.startedAt) return '00:00';
        const start = trip.timestamps.startedAt.toDate();
        const now = new Date();
        const elapsedSecs = Math.floor((now - start) / 1000);

        // Let's pretend trips have a nominal 15 minute (900s) ETA countdown
        let remaining = 900 - elapsedSecs;
        if (remaining < 0) remaining = 0;

        const m = Math.floor(remaining / 60).toString().padStart(2, '0');
        const s = (remaining % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Helper: determine styles and status pills
    const getStatusUI = (status) => {
        switch (status) {
            case 'accepted': return { text: 'PREPARING', class: 'stat-preparing' };
            case 'en_route': return { text: 'READY', class: 'stat-ready' };
            case 'at_scene': return { text: 'PROCESSING', class: 'stat-processing' };
            case 'transporting': return { text: 'INBOUND', class: 'stat-ready' };
            default: return { text: 'UNKNOWN', class: 'stat-processing' };
        }
    };

    if (authLoading || loadingData) {
        return <div className="control-dash-container" style={{ alignItems: 'center', justifyContent: 'center' }}>Loading Command Center...</div>;
    }

    const myTrips = trips.filter(t => t.destinationHospital === userProfile?.assignedHospital);

    const sortedTrips = [...myTrips].sort((a, b) => {
        const sevA = severityConfig[a.emergencyType] || severityConfig['OTHER'];
        const sevB = severityConfig[b.emergencyType] || severityConfig['OTHER'];
        const rank = { 'L1 - CRITICAL': 1, 'L2 - SEVERE': 2, 'L3 - MODERATE': 3, 'L4 - STABLE': 4 };
        const scoreA = rank[sevA.level] || 5;
        const scoreB = rank[sevB.level] || 5;
        if (scoreA !== scoreB) return scoreA - scoreB;
        return 0; // fallback
    });

    return (
        <div className="control-dash-container animate-fade-in">
            {/* Top Navigation Strip */}
            <nav className="control-nav">
                <div className="logo-area">
                    <div className="logo-icon small"></div>
                    <span className="logo-text" style={{ fontSize: '14px', letterSpacing: '1px' }}>EMERGISYNC</span>
                </div>

                <div className="nav-tabs">
                    <div className="nav-tab">Live Operations</div>
                    <div className="nav-tab">Police Coordination</div>
                    <div className="nav-tab active">Hospital Coordination</div>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="role-badge" style={{ backgroundColor: 'rgba(255, 42, 42, 0.1)', color: '#ff2a2a', borderColor: 'rgba(255, 42, 42, 0.3)', padding: '6px 12px' }}>
                        <User size={12} style={{ marginRight: '6px' }} />
                        ROLE: {userProfile?.role === 'hospital' ? 'HOSPITAL STAFF' : 'CONTROL ROOM'}
                    </div>
                </div>
            </nav>

            <div className="control-main">
                {/* Left Panel: Active Trips Table */}
                <div className="dash-left">
                    <div className="dash-header-row">
                        <div>
                            <h2>Active Incoming Arrivals</h2>
                            <p>Real-time telemetry for inbound medical transports to your facility.</p>
                        </div>
                        <div className="dash-actions">
                            <button className="btn-dark-outline"><Filter size={14} /> FILTER</button>
                            <button className="btn-dark-outline"><Download size={14} /> EXPORT</button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="control-table">
                            <thead>
                                <tr>
                                    <th>Patient / ID</th>
                                    <th>Unit</th>
                                    <th>Emergency</th>
                                    <th>Severity</th>
                                    <th>ETA</th>
                                    <th>ER Status</th>
                                    <th>Ack Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTrips.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', color: '#6b6c7c', padding: '40px' }}>No active incoming arrivals to your facility</td>
                                    </tr>
                                ) : (
                                    myTrips.map((trip, idx) => {
                                        const sev = severityConfig[trip.emergencyType] || severityConfig['OTHER'];
                                        const statUI = getStatusUI(trip.status);
                                        const isCritical = sev.level.includes('CRITICAL');
                                        const etaStr = calculateEta(trip);
                                        
                                        // Patient Name or ID
                                        const patientName = trip.patientName || `UNK-${trip.id.substring(0, 4).toUpperCase()}`;
                                        
                                        const ackDate = trip.timestamps?.assignedAt?.toDate() || new Date();
                                        const ackStr = ackDate.toLocaleTimeString('en-US', { hour12: false });
                                        
                                        return (
                                            <tr key={trip.id}>
                                                <td style={{ fontWeight: 600 }}>{patientName}</td>
                                                <td style={{ color: '#a3a3a3', fontFamily: 'monospace' }}>{getUnitId(trip.ambulanceId)}</td>
                                                <td style={{ color: '#a3a3a3' }}>{trip.emergencyType}</td>
                                                <td><span className={`sev-pill ${sev.class}`}>{sev.level}</span></td>
                                                <td className={isCritical ? 'eta-red' : 'eta-white'}>{etaStr}</td>
                                                <td><span className={`status-pill-small ${statUI.class}`}>{statUI.text}</span></td>
                                                <td className="ack-time">{ackStr}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel: Priority Facility Monitoring -> Priority Patient Triage */}
                <div className="dash-right">
                    <div className="right-header">
                        <h3>Inbound Patient Triage</h3>
                        <p>
                            <span>Monitoring high-acuity inbound patients based on severity.</span>
                        </p>
                        <p style={{ marginTop: '8px', color: '#a3a3a3', fontWeight: 800 }}>
                            <span style={{ color: '#00e676' }}>TRACKING {myTrips.length} PATIENTS</span> 
                            <span style={{ color: '#ff9800' }}>SORTED BY: CLINICAL SEVERITY</span>
                        </p>
                    </div>
                    
                    <div className="facility-list">
                        {myTrips.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#6b6c7c', marginTop: '40px', fontSize: '13px' }}>Standby mode active.</div>
                        ) : sortedTrips.map((trip, idx) => {
                            const sev = severityConfig[trip.emergencyType] || severityConfig['OTHER'];
                            const isCritical = sev.level.includes('CRITICAL');
                            
                            // Let's generate some realistic looking "Vitals" metrics based on severity
                            let heartRate = 80;
                            let o2Sat = 98;
                            let colorClass = 'green';
                            
                            if (isCritical) {
                                heartRate = 130 + Math.floor(Math.random() * 20); // 130-150
                                o2Sat = 85 + Math.floor(Math.random() * 5); // 85-90
                                colorClass = 'red';
                            } else if (sev.level.includes('SEVERE')) {
                                heartRate = 110 + Math.floor(Math.random() * 15);
                                o2Sat = 92 + Math.floor(Math.random() * 3);
                                colorClass = 'orange';
                            }

                            const patientName = trip.patientName || `UNK-${trip.id.substring(0, 4).toUpperCase()}`;
                            const etaStr = calculateEta(trip);

                            return (
                                <div key={trip.id} className={`facility-card ${isCritical ? 'high-priority' : ''}`}>
                                    <div className="card-top-row">
                                        <div>
                                            <h4 style={{ textTransform: 'capitalize' }}>{patientName}</h4>
                                            <div style={{ fontSize: '10px', color: '#6b6c7c', marginTop: '4px', fontFamily: 'monospace' }}>
                                                {trip.emergencyType} • UNIT: {getUnitId(trip.ambulanceId)}
                                            </div>
                                        </div>
                                        <div className="facility-badges">
                                            {isCritical && <span className="f-badge">RAPID RESPONSE REQ</span>}
                                            <span className={`f-badge ${isCritical ? '' : (colorClass==='orange' ? 'orange' : '')}`} style={{ borderColor: colorClass==='green'?'#00e676':'', color: colorClass==='green'?'#00e676':'' }}>
                                                {sev.level}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="util-center" style={{ display: 'flex', justifyContent: 'space-around', margin: '16px 0' }}>
                                        <div>
                                            <div className={`util-pct ${colorClass}`}>{heartRate}</div>
                                            <div className="util-label">BPM</div>
                                        </div>
                                        <div style={{ width: '1px', background: '#1f2029' }}></div>
                                        <div>
                                            <div className={`util-pct ${colorClass}`}>{o2Sat}%</div>
                                            <div className="util-label">SpO2</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bed-grid" style={{ marginBottom: 0 }}>
                                        <div className="bed-box">
                                            <label>ESTIMATED Time of Arrival</label>
                                            <div className="bed-count" style={{ color: isCritical ? '#ff2a2a' : '#fff' }}>{etaStr} MIN</div>
                                        </div>
                                        <div className="bed-box">
                                            <label>TRANSPORT STATUS</label>
                                            <div className="bed-count" style={{ textTransform: 'uppercase' }}>{getStatusUI(trip.status).text}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Escalation Strip (Fixed) */}
            <div className="escalation-footer animate-slide-up">
                <div className="esc-header">
                    <span><AlertTriangle size={12} /> ACTIVE ESCALATION MONITOR</span>
                    <span className="esc-count">1 CRITICAL ALERT ACTIVE</span>
                </div>

                <div className="esc-body">
                    {/* Active Alert Card */}
                    <div className="esc-card">
                        <div className="esc-icon-zone">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="esc-content">
                            <div className="esc-top-line">
                                <h5>TRIP - 882</h5>
                                <span className="esc-crit-badge">CRITICAL</span>
                            </div>
                            <p className="esc-message">ETA &lt; 3m & ER Readiness Not Confirmed</p>
                            <p className="esc-sub">GENERAL MEMORIAL HOSPITAL • DISPATCH: SARAH J.</p>
                        </div>
                        <div className="esc-actions">
                            <button className="esc-btn-primary">ESCALATE</button>
                            <button className="esc-btn-secondary">RESOLVE</button>
                        </div>
                    </div>

                    <div className="esc-copy">EMERGISYNC © 2026 • PROPRIETARY CONTROL ROOM TERMINAL</div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
