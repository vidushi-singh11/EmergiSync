import React from 'react';
import { ArrowRight, Crosshair, Bell, PlusSquare } from 'lucide-react';

const Landingpage = () => {
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
                        <button className="btn btn-primary hero-btn">
                            Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </button>
                        <button className="btn btn-ghost hero-btn">Learn More</button>
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

            {/* Features Section */}
            <section className="features-section container" id="how-it-works">
                <div className="section-header">
                    <h2 className="section-title">How EmergiSync Works</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="features-grid">
                    {/* Card 1 */}
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Crosshair size={24} className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Live GPS Tracking</h3>
                        <p className="feature-description">
                            Continuous high-precision monitoring of all emergency vehicle fleets with sub-second latency for absolute coordination during active dispatches.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Bell size={24} className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Smart Clearance Alerts</h3>
                        <p className="feature-description">
                            Instantly notify junction officers and automated traffic signal systems along the projected route to ensure a clear path before the vehicle arrives.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <PlusSquare size={24} className="feature-icon" />
                        </div>
                        <h3 className="feature-title">Hospital ETA Sync</h3>
                        <p className="feature-description">
                            Real-time arrival estimation synced directly with ER intake terminals, allowing medical staff to prepare specialized equipment based on precise timing.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section container">
                <div className="cta-container">
                    <div className="cta-bg-map"></div>
                    <div className="cta-content">
                        <h2 className="cta-title">Aiming to build a system for every city</h2>
                        <p className="cta-description">
                            Our synchronization layer integrates seamlessly with existing municipal traffic infrastructure and emergency management software.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landingpage;
