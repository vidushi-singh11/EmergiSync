import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Crosshair, Bell, PlusSquare, MapPin, Route, TrafficCone, Shield, Users, Server, Database, Monitor, AlertCircle, CheckCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Landingpage = () => {
    const navigate = useNavigate();

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists() && userDoc.data().role) {
                        const role = userDoc.data().role;
                        if (role === 'ambulance') navigate('/driver-dashboard');
                        else if (role === 'controlRoom') navigate('/control-room');
                        else if (role === 'hospital') navigate('/hospital-dashboard');
                    }
                } catch (err) {
                    console.error("Error fetching user role for redirect:", err);
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section container">
                <div className="hero-content animate-fade-in">
                    <div className="status-badge">
                        <span className="status-dot"></span>
                        OPERATIONAL STATUS: ACTIVE
                    </div>
                    <h1 className="hero-title">
                        Synchronizing<br />
                        Emergency<br />
                        Response<br />
                        <span className="text-red">In Real-Time</span>
                    </h1>
                    <p className="hero-description">
                        Intelligent traffic clearance, mission-critical routing, and unified communications for first responders. Minimize response times when every second counts.
                    </p>
                    <div className="hero-actions">
                        <Link to="/signup" className="btn btn-primary hero-btn">
                            Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                        <Link to="/learn-more" className="btn btn-ghost hero-btn">Learn More</Link>
                    </div>
                </div>

                <div className="hero-graphic animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="graphic-container">
                        {/* Grid background */}
                        <div className="graphic-grid"></div>
                        {/* Map points and paths */}
                        <div className="map-path"></div>

                        <div className="map-point start-point">
                            <div className="cross-icon">*</div>
                        </div>
                        <div className="map-point node-point">
                            <div className="node-marker">1</div>
                        </div>
                        <div className="map-point end-point">
                            <div className="circle-icon"></div>
                        </div>
                        <div className="map-point warning-point">
                            <div className="cross-icon">*</div>
                        </div>

                        {/* Info Panels */}
                        <div className="info-panel panel-left">
                            <div className="panel-row">
                                <span className="panel-label">UNIT_019</span>
                            </div>
                            <div className="panel-row">
                                <span className="panel-text">ETA:</span>
                                <span className="panel-value">03:42</span>
                            </div>
                            <div className="panel-row">
                                <span className="panel-text">STATUS:</span>
                                <span className="panel-value text-green">OPTIMIZED</span>
                            </div>
                        </div>

                        <div className="info-panel panel-right">
                            <div className="panel-row">
                                <span className="panel-label">TRAFFIC_SYS</span>
                            </div>
                            <div className="panel-row">
                                <span className="panel-text">ZONE:</span>
                                <span className="panel-value">HOSPITAL_DIST</span>
                            </div>
                            <div className="panel-row">
                                <span className="panel-text">CLEARANCE:</span>
                                <span className="panel-value text-red">GRANTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section container" id="about">
                <div className="about-content animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="status-badge" style={{ marginBottom: '16px' }}>
                        <span className="status-dot"></span>
                        SYSTEM OVERVIEW
                    </div>
                    <h2 className="about-title">About EmergiSync</h2>
                    <p className="about-description">
                        EmergiSync is a structured real-time emergency coordination platform focused on live tracking, clearance workflows, and role-based synchronization. Our system facilitates organized traffic clearance through software-driven coordination and standardized data exchange between dispatchers and field units.
                    </p>

                    <div className="vision-container">
                        <div className="vision-header">
                            <div className="vision-line"></div>
                            <h3 className="vision-title">Our Vision</h3>
                        </div>
                        <p className="vision-description">
                            We are building a digital framework dedicated to improving coordination and reducing manual communication during emergency routing. By creating a unified synchronization layer, EmergiSync provides improved transparency and predictability for emergency unit logistics in urban environments.
                        </p>

                        <div className="vision-cards">
                            <div className="vision-card">
                                <h4 className="vision-card-title text-red">RELIABILITY</h4>
                                <p className="vision-card-subtitle">SYSTEM STABILITY</p>
                            </div>
                            <div className="vision-card">
                                <h4 className="vision-card-title text-red">STANDARDIZED</h4>
                                <p className="vision-card-subtitle">DATA PROTOCOLS</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="about-graphic animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="software-window">
                        <div className="software-content">
                            {/* Decorative background code lines representing software architecture */}
                            <div className="code-lines">
                                <div className="code-line w-80"></div>
                                <div className="code-line w-60"></div>
                                <div className="code-line w-90"></div>
                                <div className="code-line w-70"></div>
                                <div className="code-line w-85"></div>
                                <div className="code-line w-50"></div>
                                <div className="code-line w-75"></div>
                                <div className="code-line w-65"></div>
                                <div className="code-line w-80"></div>
                                <div className="code-line w-60"></div>
                                <div className="code-line w-90"></div>
                                <div className="code-line w-70"></div>
                                <div className="code-line w-85"></div>
                                <div className="code-line w-50"></div>
                                <div className="code-line w-75"></div>
                                <div className="code-line w-65"></div>
                            </div>

                            <div className="abstract-toggle">
                                <div className="toggle-track">
                                    <div className="toggle-thumb"></div>
                                </div>
                                <div className="toggle-track active">
                                    <div className="toggle-thumb right"></div>
                                </div>
                            </div>

                            <div className="software-label">
                                SOFTWARE_COORDINATION_LAYER_V4.0
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="hiw-section container" id="how-it-works">
                <div className="hiw-header">
                    <div className="hiw-badge">DOCUMENTATION</div>
                    <h2 className="hiw-title">How EmergiSync Works</h2>
                    <p className="hiw-subtitle">
                        A real-time coordination system designed for the precise tracking, synchronization, and management of emergency response resources across urban environments.
                    </p>
                </div>

                {/* Workflow Sequence */}
                <div className="hiw-sequence">
                    <div className="sequence-header">
                        <h3>Workflow Sequence</h3>
                        <div className="sequence-line"></div>
                        <span className="sequence-meta">END-TO-END LOGIC</span>
                    </div>

                    <div className="sequence-timeline">
                        <div className="timeline-track"></div>
                        <div className="timeline-step">
                            <div className="step-icon bg-red"><AlertCircle size={16} color="white" /></div>
                            <h4>Trip Initiated</h4>
                            <p>Emergency call received and vehicle dispatched.</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-icon"><MapPin size={16} className="text-red" /></div>
                            <h4>Live Tracking</h4>
                            <p>Continuous GPS and status updates transmitted.</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-icon"><Route size={16} className="text-red" /></div>
                            <h4>Route Segmentation</h4>
                            <p>Automated path analysis and traffic routing.</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-icon"><TrafficCone size={16} className="text-red" /></div>
                            <h4>Clearance Notification</h4>
                            <p>Active signal priority and route clearing.</p>
                        </div>
                        <div className="timeline-step">
                            <div className="step-icon"><PlusSquare size={16} className="text-red" /></div>
                            <h4>Hospital ETA Sync</h4>
                            <p>Real-time arrival synchronization for medical teams.</p>
                        </div>
                    </div>
                </div>

                {/* Role-Based Coordination */}
                <div className="hiw-roles">
                    <div className="role-header">
                        <div className="role-line-vertical"></div>
                        <h3>ROLE-BASED COORDINATION</h3>
                    </div>

                    <div className="role-grid">
                        <div className="role-card">
                            <div className="role-icon"><Crosshair size={20} className="text-red" /></div>
                            <h4>Ambulance</h4>
                            <p>Transmits real-time vehicle location and critical patient status updates to the central engine.</p>
                        </div>
                        <div className="role-card">
                            <div className="role-icon"><Users size={20} className="text-red" /></div>
                            <h4>Control Room</h4>
                            <p>Oversees entire city-wide traffic flow and manages high-level dispatch coordination protocols.</p>
                        </div>
                        <div className="role-card">
                            <div className="role-icon"><Shield size={20} className="text-red" /></div>
                            <h4>Police</h4>
                            <p>Facilitates automated green-wave clearances and physical route security in high-congestion zones.</p>
                        </div>
                        <div className="role-card">
                            <div className="role-icon"><PlusSquare size={20} className="text-red" /></div>
                            <h4>Hospital</h4>
                            <p>Prepares receiving medical teams and trauma rooms based on hyper-accurate live arrival estimates.</p>
                        </div>
                    </div>
                </div>

                {/* Operational Benefits */}
                <div className="hiw-benefits">
                    <div className="benefits-list">
                        <h3 className="benefits-title">Operational Benefits</h3>

                        <div className="benefit-item">
                            <div className="check-icon"><CheckCircle size={16} /></div>
                            <div className="benefit-content">
                                <h4>Reduced manual coordination</h4>
                                <p>Automated protocols minimize voice-radio dependency during critical phases.</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="check-icon"><CheckCircle size={16} /></div>
                            <div className="benefit-content">
                                <h4>Improved trip visibility</h4>
                                <p>Holistic view of emergency assets and their real-time impact on the city grid.</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="check-icon"><CheckCircle size={16} /></div>
                            <div className="benefit-content">
                                <h4>Structured clearance tracking</h4>
                                <p>Log-based validation of route clearing and priority signal activation.</p>
                            </div>
                        </div>
                    </div>

                    <div className="benefits-certified">
                        <Shield size={40} className="text-red mb-4 certified-icon" />
                        <h4>CERTIFIED OPERATIONAL LOGIC</h4>
                        <p>Mission-Critical Ready</p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Landingpage;
