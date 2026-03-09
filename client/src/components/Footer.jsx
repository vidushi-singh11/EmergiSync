import React from 'react';
import { Mail, Shield, HelpCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-left">
                    <a href="/" className="logo">
                        <div className="logo-icon"></div>
                        <span>EMERGISYNC</span>
                    </a>
                    <p className="footer-mission">
                        EMPOWERING FIRST RESPONDERS WITH PRECISION DATA. OUR<br />
                        MISSION IS TO ELIMINATE TRAFFIC-RELATED DELAYS IN EMERGENCY<br />
                        RESPONSE, SAVING LIVES THROUGH TECHNICAL EXCELLENCE.
                    </p>
                </div>

                <div className="footer-right">
                    <div className="footer-icons">
                        <Mail className="footer-icon" size={18} />
                        <Shield className="footer-icon" size={18} />
                        <HelpCircle className="footer-icon" size={18} />
                    </div>
                    <p className="footer-copyright">
                        EMERGISYNC © 2026. ALL RIGHTS RESERVED. V4.6.2 RELEASE
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
