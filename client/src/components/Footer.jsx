import React, { useRef, useState } from 'react';
import { Mail, Shield, HelpCircle, Phone, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Footer = () => {
    const form = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        // PLACEHOLDER: Replace with your EmailJS credentials
        emailjs.sendForm('service_placeholder', 'template_placeholder', form.current, 'public_key_placeholder')
            .then((result) => {
                console.log(result.text);
                setSubmitStatus('success');
                setIsSubmitting(false);
                e.target.reset();
                setTimeout(() => setSubmitStatus(null), 5000); // clear status after 5s
            }, (error) => {
                console.log(error.text);
                setSubmitStatus('error');
                setIsSubmitting(false);
                setTimeout(() => setSubmitStatus(null), 5000); // clear status after 5s
            });
    };

    return (
        <>
            {/* Contact Section */}
            <section className="contact-section container" id="contact">
                <div className="contact-header">
                    <h2 className="contact-title">Contact EmergiSync</h2>
                    <p className="contact-subtitle">
                        Discuss integrations, enterprise solutions, and mission-critical support<br />for your coordination needs.
                    </p>
                </div>

                <div className="contact-info-grid">
                    <div className="contact-info-card">
                        <Mail size={24} className="text-red mb-3" />
                        <span className="info-label">EMAIL SUPPORT</span>
                        <span className="info-value">support@emergisync.system</span>
                    </div>
                    <div className="contact-info-card">
                        <Phone size={24} className="text-red mb-3" />
                        <span className="info-label">GLOBAL INQUIRY</span>
                        <span className="info-value">+91-000-000-0000</span>
                    </div>
                    <div className="contact-info-card">
                        <Shield size={24} className="text-red mb-3" />
                        <span className="info-label">PLATFORM TYPE</span>
                        <span className="info-value">Web-Based Coordination</span>
                    </div>
                </div>

                <div className="contact-form-container">
                    <form ref={form} onSubmit={sendEmail} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="contact-label">FULL NAME</label>
                                <input type="text" name="user_name" className="contact-input" placeholder="John Doe" required />
                            </div>
                            <div className="form-group">
                                <label className="contact-label">EMAIL ADDRESS</label>
                                <input type="email" name="user_email" className="contact-input" placeholder="john@agency.gov" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="contact-label">SUBJECT</label>
                            <select name="subject" className="contact-input contact-select" required defaultValue="">
                                <option value="" disabled hidden>Platform Integration Inquiry</option>
                                <option value="sales">Sales & Enterprise Pricing</option>
                                <option value="support">Technical Support</option>
                                <option value="partnership">Partnership Opportunities</option>
                                <option value="other">Other Inquiries</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="contact-label">MESSAGE</label>
                            <textarea name="message" className="contact-input contact-textarea" placeholder="Describe your requirements or questions..." required></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary contact-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Secure Message'}
                            {!isSubmitting && <Send size={16} style={{ marginLeft: '8px' }} />}
                        </button>

                        {submitStatus === 'success' && (
                            <div className="form-status success">Message sent successfully. Our team will contact you shortly.</div>
                        )}
                        {submitStatus === 'error' && (
                            <div className="form-status error">Failed to send message. Please ensure your EmailJS keys are configured, or try again later.</div>
                        )}
                    </form>
                </div>
            </section>

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
        </>
    );
};

export default Footer;
