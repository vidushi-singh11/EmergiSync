import React from 'react';
import { ArrowRight, Lock, Target, Workflow, Server, MapPin, EyeOff, Hand } from 'lucide-react';

const LearnMore = () => {
    return (
        <div className="learn-more-page">
            {/* Hero Section */}
            <section className="lm-hero">
                <div className="container">
                    <div className="lm-badge">
                        <span className="text-red">▶</span> LEARN MORE: VISION & PHILOSOPHY
                    </div>
                    <h1 className="lm-title">
                        The Vision for<br />
                        <span className="text-red italic">Structured Coordination</span>
                    </h1>
                    <p className="lm-description">
                        EmergiSync exists to address coordination gaps through structured emergency routing philosophy. We advocate for a shift toward software-based visibility, where digital synchronization ensures that responders have the clarity needed to navigate complex urban environments.
                    </p>
                </div>
            </section>

            {/* Gap Section */}
            <section className="lm-gap-section container">
                <div className="lm-gap-content">
                    <h2 className="lm-h2">
                        ADDRESSING THE <span className="text-red">COORDINATION GAP</span>
                    </h2>
                    <p className="lm-p">
                        Modern emergency response often faces challenges in multi-agency synchronization. Fragmented visibility in urban routing creates unnecessary friction when operational clarity is most vital.
                    </p>

                    <div className="lm-gap-list">
                        <div className="lm-gap-item">
                            <div className="lm-icon-wrapper">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <h3>FRAGMENTED COMMUNICATION</h3>
                                <p>Siloed data streams can prevent a unified operational picture across different response teams and jurisdictions.</p>
                            </div>
                        </div>
                        <div className="lm-gap-item">
                            <div className="lm-icon-wrapper">
                                <EyeOff size={18} />
                            </div>
                            <div>
                                <h3>LACK OF ROUTE VISIBILITY</h3>
                                <p>Operational teams may lack real-time awareness of digital clearance over the positioning of software assets.</p>
                            </div>
                        </div>
                        <div className="lm-gap-item">
                            <div className="lm-icon-wrapper">
                                <Hand size={18} />
                            </div>
                            <div>
                                <h3>MANUAL CLEARANCE DEPENDENCY</h3>
                                <p>High reliance on manual procedures creates coordination bottlenecks that can be addressed through structured clearance coordination logic.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lm-gap-graphic">
                    <div className="lm-core-icon">
                        <div className="core-dot center"></div>
                        <div className="core-dot top"></div>
                        <div className="core-dot right"></div>
                        <div className="core-dot bottom"></div>
                        <div className="core-dot left"></div>
                    </div>
                    <p className="lm-graphic-title">THE COORDINATION CORE</p>
                    <p className="lm-graphic-text">
                        "EmergiSync acts as the digital backbone that enables the substitution of manual routing friction with accuracy-based clearance workflows."
                    </p>
                </div>
            </section>

            {/* Structured Digital Coordination */}
            <section className="lm-structured-section">
                <div className="container text-center">
                    <h2 className="lm-h2-center">STRUCTURED DIGITAL COORDINATION</h2>
                    <div className="title-underline sm"></div>

                    <p className="lm-p-center">
                        EmergiSync introduces a conceptual framework for <span className="text-red">Structured Workflows</span>. By providing visibility into
                        the digital intent of routing, we help transform fragmented movements into synchronized corridors of
                        transit.
                    </p>
                    <p className="lm-p-center">
                        Our philosophy centers on <span className="text-red">Live Visibility</span> — a software-based overview of the emergency landscape
                        that allows stakeholders to maintain situational awareness and coordinate clearance logic well in
                        advance.
                    </p>
                    <p className="lm-p-center">
                        Through <span className="text-red">Role-Based Synchronization</span>, relevant data is delivered to specific users, ensuring that
                        coordination logic remains focused and actionable without unnecessary information noise.
                    </p>
                </div>
            </section>

            {/* Design Principles */}
            <section className="lm-principles-section container">
                <h2 className="lm-h2">SYSTEM DESIGN PRINCIPLES</h2>
                <p className="lm-p">The four pillars of our conceptual and operational software philosophy.</p>

                <div className="lm-principles-grid">
                    <div className="lm-principle-card">
                        <Target size={20} className="text-red mb-3" />
                        <h3>REAL-TIME MONITORING</h3>
                        <p>Continuous software-based awareness ensures route coordination logic remains reactive to live digital inputs.</p>
                    </div>
                    <div className="lm-principle-card">
                        <Lock size={20} className="text-red mb-3" />
                        <h3>ROLE-BASED ACCESS</h3>
                        <p>Secure interfaces designed for specific agency roles ensure data relevance and control over coordination workflows.</p>
                    </div>
                    <div className="lm-principle-card">
                        <Workflow size={20} className="text-red mb-3" />
                        <h3>WORKFLOW TRANSPARENCY</h3>
                        <p>Clear digital logging of coordinative movements enables dashboard accountability across the entire routing lifecycle.</p>
                    </div>
                    <div className="lm-principle-card">
                        <Server size={20} className="text-red mb-3" />
                        <h3>SCALABLE ARCHITECTURE</h3>
                        <p>A modular software framework designed to expand from local unit coordination tasks to broader regional visibility requirements.</p>
                    </div>
                </div>
            </section>

            {/* Why it Matters */}
            <section className="lm-matters-section container">
                <div className="lm-matters-container">
                    <div className="lm-matters-content">
                        <h2 className="lm-h2 lg">WHY STRUCTURED<br />COORDINATION MATTERS</h2>
                        <p className="lm-p">
                            Our vision focuses on <span className="text-red">Predictability</span>. By applying structured
                            logic to the coordination between responders, we help
                            minimize the variables that lead to operational uncertainty.
                        </p>
                        <p className="lm-p">
                            Enhanced digital visibility leads to greater operational clarity
                            and improved situational awareness for teams on the ground.
                        </p>
                    </div>

                    <div className="lm-matters-principles">
                        <div className="lm-matters-card">
                            <h4 className="text-red">PRINCIPLE 01</h4>
                            <p>Reduction of intersection uncertainty through proximity-based clearance workflows.</p>
                        </div>
                        <div className="lm-matters-card">
                            <h4 className="text-red">PRINCIPLE 02</h4>
                            <p>Improved situational readiness via real-time digital visibility and route synchronization.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LearnMore;
