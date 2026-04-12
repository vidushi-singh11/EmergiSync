import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Radio, Activity, AlertCircle, History, Navigation, Plus, Minus, Crosshair, MapPin, Truck, CheckCircle2, Clock, Map as MapIcon } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useGeolocation from '../hooks/useGeolocation';
import {
    setAmbulanceOnline,
    updateAmbulanceLocation,
    getHospitals,
    createTrip,
    getActiveTrip,
    getTripHistory,
    updateTripStatus
} from '../services/firestoreService';
import { calculateFastestHospital } from '../services/routingService';

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Icons
const ambIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2894/2894975.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const hospIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3004/3004451.png',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
});

const destHospIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3004/3004451.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
    className: 'pulsing-hospital-marker'
});

// Auto-Center Map Component
const MapRecenter = ({ lat, lng }) => {
    const map = useMap();
    const hasInit = React.useRef(false);

    useEffect(() => {
        if (lat && lng && lat !== 0 && lng !== 0 && !hasInit.current) {
            map.flyTo([lat, lng], 13);
            hasInit.current = true;
        }
    }, [lat, lng, map]);
    return null;
};

const DriverDashboard = () => {
    const navigate = useNavigate();
    const { user, userProfile, ambulance, loading: authLoading, logout } = useAuth();

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Status
    const [isOnline, setIsOnline] = useState(true);

    // Data
    const [hospitals, setHospitals] = useState([]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [tripHistory, setTripHistory] = useState([]);

    // Modals & UI
    const [showTripModal, setShowTripModal] = useState(false);
    const [tripTimer, setTripTimer] = useState('00:00:00');

    // Routing state
    const [calculatingNearest, setCalculatingNearest] = useState(false);
    const [activeRouteGeometry, setActiveRouteGeometry] = useState(null);
    const [calculatedEta, setCalculatedEta] = useState(null);

    // Form State
    const [newTrip, setNewTrip] = useState({
        patientName: '',
        emergencyType: 'TRAUMA',
        destinationHospital: '',
        useCurrentLocation: true,
        customAddress: ''
    });

    const handleLocationUpdate = async (location) => {
        if (!ambulance?.id) return;

        await updateAmbulanceLocation(ambulance.id, {
            lat: location.lat,
            lng: location.lng,
            speed: location.speed,
            heading: location.heading,
            address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
        });
    };

    const geoTracking = useGeolocation({
        enabled: isOnline && !!ambulance?.id,
        onLocationUpdate: handleLocationUpdate,
        updateInterval: 5000
    });

    // Init & Timers
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (authLoading) return;
        if (!user || userProfile?.role !== 'ambulance') {
            navigate('/login');
        } else if (!userProfile?.assignedAmbulance) {
            navigate('/ambulance-setup');
        }
    }, [user, userProfile, authLoading, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!ambulance?.id) return;
            try {
                const [hospData, activeT, history] = await Promise.all([
                    getHospitals(),
                    getActiveTrip(ambulance.id),
                    getTripHistory(ambulance.id)
                ]);

                setHospitals(hospData);
                setActiveTrip(activeT);
                setTripHistory(history);
                setIsOnline(ambulance.isOnline !== false);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        fetchData();
    }, [ambulance?.id]);

    useEffect(() => {
        let interval;
        if (activeTrip && activeTrip.timestamps?.startedAt) {
            interval = setInterval(() => {
                const start = activeTrip.timestamps.startedAt.toDate();
                const now = new Date();
                const diff = (now - start) / 1000;

                const hrs = Math.floor(diff / 3600).toString().padStart(2, '0');
                const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
                const secs = Math.floor(diff % 60).toString().padStart(2, '0');

                setTripTimer(`${hrs}:${mins}:${secs}`);
            }, 1000);
        } else {
            setTripTimer('00:00:00');
        }
        return () => clearInterval(interval);
    }, [activeTrip]);

    // Attempt to parse route geometry if it exists statically, or we can fetch dynamically
    useEffect(() => {
        if (activeTrip?.routeData?.geometry) {
            // Leaflet expects [lat, lng], so flip GeoJSON [lng, lat]
            const coords = activeTrip.routeData.geometry.coordinates.map(pt => [pt[1], pt[0]]);
            setActiveRouteGeometry(coords);
        } else {
            setActiveRouteGeometry(null);
        }
    }, [activeTrip]);

    const handleLogout = async () => {
        if (ambulance?.id) {
            await setAmbulanceOnline(ambulance.id, false);
        }
        await logout();
        navigate('/login');
    };

    const toggleOnline = async () => {
        if (!ambulance?.id) return;
        const newState = !isOnline;
        setIsOnline(newState);
        await setAmbulanceOnline(ambulance.id, newState);
    };

    const handleFindNearest = async () => {
        if (!geoTracking.lat || !geoTracking.lng || hospitals.length === 0) {
            alert("Waiting for valid GPS lock...");
            return;
        }

        setCalculatingNearest(true);
        try {
            const currentLoc = { lat: geoTracking.lat, lng: geoTracking.lng };
            const result = await calculateFastestHospital(currentLoc, hospitals);

            if (result) {
                setNewTrip(prev => ({
                    ...prev,
                    destinationHospital: result.id
                }));
                // Calculate ETA string
                const minutes = Math.ceil(result.routeData.duration / 60);
                const distanceKm = (result.routeData.distance / 1000).toFixed(1);
                setCalculatedEta(`ETA: ${minutes} min (${distanceKm} km via optimal route)`);

                // Store temporary route geometry so we can save it on trip creation
                setActiveRouteGeometry(result.routeData.geometry.coordinates.map(pt => [pt[1], pt[0]]));
            } else {
                alert("Failed to calculate routes to hospitals.");
            }
        } catch (e) {
            console.error(e);
            alert("Routing service error.");
        } finally {
            setCalculatingNearest(false);
            setShowTripModal(true);
        }
    };

    const handleStartTrip = async (e) => {
        e.preventDefault();
        if (!newTrip.patientName || !newTrip.destinationHospital) return;

        const tripData = {
            ambulanceId: ambulance.id,
            driverUid: user.uid,
            patientName: newTrip.patientName,
            emergencyType: newTrip.emergencyType,
            destinationHospital: newTrip.destinationHospital,
            pickupLocation: {
                lat: newTrip.useCurrentLocation ? geoTracking.lat : 0,
                lng: newTrip.useCurrentLocation ? geoTracking.lng : 0,
                address: newTrip.useCurrentLocation ? 'Current Location' : newTrip.customAddress
            }
        };

        try {
            // We can optionally store the routeData inside the trip if we want to retrieve it later
            const trip = await createTrip({
                ...tripData,
                // Hack: We append geometry to the activeTrip state locally for current session display
                routeGeometryFallback: activeRouteGeometry
            });
            setActiveTrip({ ...trip, localGeometry: activeRouteGeometry });
            setShowTripModal(false);
            setCalculatedEta(null);
            setNewTrip({
                patientName: '',
                emergencyType: 'TRAUMA',
                destinationHospital: '',
                useCurrentLocation: true,
                customAddress: ''
            });
        } catch (err) {
            console.error("Failed to start trip:", err);
            alert("Failed to start trip");
        }
    };

    const updateCurrentTripStatus = async (status) => {
        if (!activeTrip?.id) return;

        try {
            await updateTripStatus(activeTrip.id, status);

            if (status === 'completed' || status === 'cancelled') {
                setActiveTrip(null);
                setActiveRouteGeometry(null);
                // Refresh history
                const updatedHistory = await getTripHistory(ambulance.id);
                setTripHistory(updatedHistory);
            } else {
                setActiveTrip(prev => ({ ...prev, status }));
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status");
        }
    };

    if (authLoading || !ambulance) {
        return <div className="setup-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1016', color: 'white' }}>Initializing telemetry...</div>;
    }

    // Default map center (Delhi logic usually)
    const defaultCenter = [geoTracking.lat || 28.6139, geoTracking.lng || 77.2090];

    return (
        <div className="driver-dashboard">
            {/* Top Navigation Bar */}
            <nav className="dashboard-nav">
                <div className="nav-left">
                    <div className="logo-icon small"></div>
                    <span className="logo-text">EmergiSync</span>
                </div>

                <div className="nav-right">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
                        <span style={{ fontSize: '12px', color: '#8b8c9c' }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
                        <div className={`toggle-switch ${isOnline ? 'active' : ''}`} onClick={toggleOnline}>
                            <div className="toggle-slider"></div>
                        </div>
                    </div>

                    <div className="role-badge" style={{ backgroundColor: activeTrip ? 'rgba(255,152,0,0.1)' : '', borderColor: activeTrip ? 'rgba(255,152,0,0.3)' : '', color: activeTrip ? '#ff9800' : '' }}>
                        {activeTrip ? 'DISPATCHED' : 'AMBULANCE'}
                    </div>

                    <div className="unit-info">
                        <div className="unit-number">Unit {ambulance.unitId}</div>
                        <div className="driver-name">{ambulance.driverName}</div>
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
                                <div className="dropdown-item" style={{ fontSize: '11px', color: '#8b8c9c', pointerEvents: 'none', borderBottom: '1px solid #2a2b36', paddingBottom: '8px' }}>
                                    {user.email}
                                </div>
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="dashboard-content">
                {/* Map Section */}
                <div className="map-section" style={{ position: 'relative' }}>
                    <div className="floating-status-bar">
                        <div className="status-item">
                            <div className="label">GPS STATUS</div>
                            <div className="value">
                                {geoTracking.isTracking ? (
                                    <span style={{ color: '#00e676', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Activity size={14} /> Active
                                    </span>
                                ) : (
                                    <span style={{ color: '#ff2a2a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <AlertCircle size={14} /> Offline
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="label">LOCATION</div>
                            <div className="value" style={{ fontSize: '14px', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {geoTracking.lat !== 0 ? `${geoTracking.lat.toFixed(4)}, ${geoTracking.lng.toFixed(4)}` : 'Resolving...'}
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="label">SPEED</div>
                            <div className="value" style={{ fontSize: '18px' }}>
                                {Math.round(geoTracking.speed * 3.6)} <span style={{ fontSize: '10px', color: '#8b8c9c' }}>KM/H</span>
                            </div>
                        </div>
                        <div className="status-item">
                            <div className="label">SYSTEM CLOCK</div>
                            <div className="value" style={{ fontFamily: 'monospace' }}>{currentTime}</div>
                        </div>

                        {!activeTrip && isOnline && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="btn"
                                    style={{ backgroundColor: '#2a2b36', color: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    onClick={handleFindNearest}
                                    disabled={calculatingNearest}
                                >
                                    {calculatingNearest ? <span className="spinner-mini"></span> : <MapIcon size={16} />}
                                    {calculatingNearest ? 'CALCULATING...' : 'AUTO-FIND NEAREST'}
                                </button>
                                <button className="btn btn-red start-trip-btn" onClick={() => {
                                    setCalculatedEta(null);
                                    setActiveRouteGeometry(null);
                                    setShowTripModal(true);
                                }}>
                                    <Radio size={16} className="mr-2" /> MANUAL
                                </button>
                            </div>
                        )}
                        {activeTrip && (
                            <div className="trip-status-indicator pulse-glow">
                                EN ROUTE
                            </div>
                        )}
                        {!isOnline && (
                            <button className="btn" style={{ backgroundColor: '#2a2b36', color: 'white' }} onClick={toggleOnline}>
                                GO ONLINE
                            </button>
                        )}
                    </div>

                    {/* True Map Integration */}
                    <div className="map-view" style={{ flex: 1, zIndex: 1, height: '100%', width: '100%' }}>
                        <MapContainer
                            center={defaultCenter}
                            zoom={13}
                            style={{ height: '100%', width: '100%', background: '#0F1016' }}
                            zoomControl={false}
                        >
                            {/* Dark mode friendly map tiles */}
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />

                            {/* Auto-recenter on GPS movement if tracking */}
                            {geoTracking.isTracking && <MapRecenter lat={geoTracking.lat} lng={geoTracking.lng} />}

                            {/* The optimal route polyline */}
                            {activeRouteGeometry && (
                                <Polyline
                                    positions={activeRouteGeometry}
                                    color="#ff2a2a"
                                    weight={6}
                                    opacity={0.7}
                                    dashArray="10, 10"
                                    lineCap="round"
                                />
                            )}

                            {/* Render Hospitals */}
                            {hospitals.map(hosp => {
                                const isDest = activeTrip?.destinationHospital === hosp.id;
                                return (
                                    <Marker
                                        key={hosp.id}
                                        position={[hosp.location.lat, hosp.location.lng]}
                                        icon={isDest ? destHospIcon : hospIcon}
                                    >
                                        <Popup className="dark-popup">
                                            <strong>{hosp.name}</strong><br />
                                            {hosp.availableBeds} beds available.
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/* Render Ambulance */}
                            {geoTracking.isTracking && geoTracking.lat !== 0 && (
                                <Marker
                                    position={[geoTracking.lat, geoTracking.lng]}
                                    icon={ambIcon}
                                    zIndexOffset={1000}
                                >
                                    <Popup className="dark-popup">You are here</Popup>
                                </Marker>
                            )}
                        </MapContainer>

                        <div className="map-overlay-title" style={{ pointerEvents: 'none' }}>
                            <h3 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Live Routing System</h3>
                            <p style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}><span className="dot"></span> OSRM PATHFINDING OK</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="dashboard-sidebar">
                    <div className={`sidebar-section active-trip-section ${!activeTrip ? 'align-center' : ''}`}>
                        <h3 className="section-title">
                            <AlertCircle size={16} className={`${activeTrip ? 'text-orange' : 'text-red'} mr-2`} />
                            {activeTrip ? 'Active Dispatch' : 'Dispatch Info'}
                        </h3>

                        {!activeTrip ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <Navigation size={24} />
                                </div>
                                <h4>No Active Trip</h4>
                                <p>Awaiting dispatch assignment. Stay online to receive incoming requests.</p>
                            </div>
                        ) : (
                            <div className="active-trip-panel animate-fade-in">
                                <div className="trip-header">
                                    <div className="patient-name">{activeTrip.patientName}</div>
                                    <div className={`type-badge type-${activeTrip.emergencyType.toLowerCase()}`}>
                                        {activeTrip.emergencyType}
                                    </div>
                                </div>

                                <div className="trip-timer">
                                    <Clock size={14} className="mr-2" /> {tripTimer}
                                </div>

                                <div className="trip-details">
                                    <div className="detail-row">
                                        <MapPin size={14} className="text-gray" />
                                        <span>
                                            Pickup: <br /><strong>{activeTrip.pickupLocation?.address || 'Current Location'}</strong>
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <Plus size={14} className="text-gray" />
                                        <span>
                                            Destination: <br />
                                            <strong>{hospitals.find(h => h.id === activeTrip.destinationHospital)?.name || 'Routing...'}</strong>
                                        </span>
                                    </div>
                                </div>

                                <div className="trip-progress">
                                    <div className={`progress-step ${['accepted', 'en_route', 'at_scene', 'transporting'].includes(activeTrip.status) ? 'active' : ''}`}>
                                        <div className="step-dot"></div><span>Accepted</span>
                                    </div>
                                    <div className="progress-line"></div>
                                    <div className={`progress-step ${['en_route', 'at_scene', 'transporting'].includes(activeTrip.status) ? 'active' : ''}`}>
                                        <div className="step-dot"></div><span>En Route</span>
                                    </div>
                                    <div className="progress-line"></div>
                                    <div className={`progress-step ${['at_scene', 'transporting'].includes(activeTrip.status) ? 'active' : ''}`}>
                                        <div className="step-dot"></div><span>At Scene</span>
                                    </div>
                                    <div className="progress-line"></div>
                                    <div className={`progress-step ${['transporting'].includes(activeTrip.status) ? 'active' : ''}`}>
                                        <div className="step-dot"></div><span>Transport</span>
                                    </div>
                                </div>

                                <div className="trip-actions">
                                    {activeTrip.status === 'accepted' && (
                                        <button className="action-btn btn-orange" onClick={() => updateCurrentTripStatus('en_route')}>Mark En Route</button>
                                    )}
                                    {activeTrip.status === 'en_route' && (
                                        <button className="action-btn btn-blue" onClick={() => updateCurrentTripStatus('at_scene')}>Arrived at Scene</button>
                                    )}
                                    {activeTrip.status === 'at_scene' && (
                                        <button className="action-btn btn-purple" onClick={() => updateCurrentTripStatus('transporting')}>Start Transport</button>
                                    )}
                                    {activeTrip.status === 'transporting' && (
                                        <button className="action-btn btn-green" onClick={() => updateCurrentTripStatus('completed')}>Complete Transfer</button>
                                    )}
                                    <button className="action-btn btn-outline-red" style={{ marginTop: '12px' }} onClick={() => {
                                        if (window.confirm("Are you sure you want to cancel this trip?")) {
                                            updateCurrentTripStatus('cancelled');
                                        }
                                    }}>Cancel Trip</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="sidebar-section history-section" style={{ flex: !activeTrip ? 'none' : '1', overflowY: 'auto' }}>
                        <div className="history-header" style={{ marginBottom: '16px' }}>
                            <History size={16} className="mr-2 text-gray" />
                            <span>Recent Transfers</span>
                        </div>

                        <div className="history-list">
                            {tripHistory.length === 0 ? (
                                <div style={{ fontSize: '12px', color: '#6b6c7c', textAlign: 'center', marginTop: '20px' }}>No recent history</div>
                            ) : (
                                tripHistory.map(trip => (
                                    <div key={trip.id} className="history-card">
                                        <div className="history-card-header">
                                            <span style={{ fontWeight: 600, fontSize: '13px' }}>{trip.patientName}</span>
                                            <span className={`status-pill ${trip.status === 'completed' ? 'success' : 'error'}`}>
                                                {trip.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#8b8c9c', marginTop: '4px' }}>
                                            {trip.createdAt ? new Date(trip.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'} - {trip.emergencyType}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual/Auto Dispatch Modal */}
            {showTripModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in">
                        <div className="modal-header">
                            <Radio size={20} className="text-red mr-2" />
                            <h3>{calculatedEta ? 'Optimal Route Confirm' : 'Initiate Manual Dispatch'}</h3>
                            <button className="close-btn" onClick={() => setShowTripModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleStartTrip} className="modal-form">
                            <div className="form-group">
                                <label>Patient Name / ID</label>
                                <input
                                    type="text"
                                    required
                                    value={newTrip.patientName}
                                    onChange={(e) => setNewTrip({ ...newTrip, patientName: e.target.value })}
                                    placeholder="John Doe or UNK-MALE"
                                />
                            </div>

                            <div className="form-group">
                                <label>Emergency Category</label>
                                <select
                                    required
                                    value={newTrip.emergencyType}
                                    onChange={(e) => setNewTrip({ ...newTrip, emergencyType: e.target.value })}
                                >
                                    <option value="CARDIAC">Cardiac Arrest / Pain</option>
                                    <option value="TRAUMA">Physical Trauma / Accident</option>
                                    <option value="STROKE">Stroke / Neurological</option>
                                    <option value="MATERNITY">Maternity / Labor</option>
                                    <option value="RESPIRATORY">Respiratory Distress</option>
                                    <option value="OTHER">Other Emergency</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '8px' }}>
                                <label>Location</label>
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={newTrip.useCurrentLocation}
                                        onChange={(e) => setNewTrip({ ...newTrip, useCurrentLocation: e.target.checked })}
                                        disabled={!!calculatedEta} // Lock to true if we did an auto-find
                                    />
                                    <span>Use Current GPS Location</span>
                                </label>
                            </div>

                            {!newTrip.useCurrentLocation && (
                                <div className="form-group animate-fade-in">
                                    <input
                                        type="text"
                                        required
                                        value={newTrip.customAddress}
                                        onChange={(e) => setNewTrip({ ...newTrip, customAddress: e.target.value })}
                                        placeholder="Enter exact pickup address"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Destination Facility {calculatedEta && <span style={{ color: '#00e676', marginLeft: '6px' }}>{calculatedEta}</span>}</label>
                                <select
                                    required
                                    value={newTrip.destinationHospital}
                                    onChange={(e) => {
                                        setNewTrip({ ...newTrip, destinationHospital: e.target.value });
                                        // If they manually change it, the optimal ETA clears
                                        setCalculatedEta(null);
                                        setActiveRouteGeometry(null);
                                    }}
                                >
                                    <option value="" disabled>Select nearest available facility...</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name} ({h.availableBeds} beds available)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions" style={{ marginTop: '24px' }}>
                                <button type="button" className="btn btn-ghost" onClick={() => setShowTripModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-red">Initiate Transport</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;
