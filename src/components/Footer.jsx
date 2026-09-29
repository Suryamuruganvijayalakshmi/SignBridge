import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer section-dark">
      <div className="section-frame footer-top">
        <div>
          <Link className="wordmark" to="/">
            <span className="wordmark-mark">S</span>
            SIGNBRIDGE<span className="signal-dot">.</span>
          </Link>
          <p style={{ marginTop: '16px' }}>Bridging ideas with technology.</p>
        </div>

        <p>Intelligent software, AI applications, web platforms, and IoT systems built for scale.</p>

        <div className="footer-links">
          <div>
            <b>Navigate</b>
            <a href="/#capabilities">Capabilities</a>
            <a href="/#research">R&amp;D</a>
            <a href="/#process">Process</a>
            <a href="/#team">Team</a>
            <Link to="/product">Smart Table</Link>
          </div>
          <div>
            <b>Connect</b>
            <a href="mailto:signbridge.aiauto@gmail.com">Email</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="tel:+919842253267">Call</a>
          </div>
        </div>
      </div>

      <div className="section-frame footer-bottom">
        <span>© 2026 SIGNBRIDGE. All rights reserved.</span>
        <span>Software · AI · Web · Cloud · IoT</span>
      </div>
    </footer>
  );
}
