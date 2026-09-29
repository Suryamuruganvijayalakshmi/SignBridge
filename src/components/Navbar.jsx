import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route/hash change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isProductPage = location.pathname === '/product';

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`} id="main-nav">
      <Link className="wordmark" to="/" aria-label="SIGNBRIDGE home">
        <span className="wordmark-mark">S</span>
        SIGNBRIDGE<span className="signal-dot">.</span>
      </Link>

      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
      </button>

      <nav className={`site-nav ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
        <Link to="/" className={!isProductPage ? 'active' : ''}>Home</Link>
        <a href="/#capabilities">Capabilities</a>
        <a href="/#research">R&amp;D</a>
        <a href="/#process">Process</a>
        <a href="/#team">Team</a>
        <Link to="/product" className={isProductPage ? 'active' : ''}>Smart Table Product</Link>
        <a href="/#contact">Contact</a>
      </nav>

      <a className="header-cta magnetic" href="/#contact">
        Start a project <span>↗</span>
      </a>
    </header>
  );
}
