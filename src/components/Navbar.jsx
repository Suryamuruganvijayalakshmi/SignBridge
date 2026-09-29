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

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isProductPage = location.pathname === '/product';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[78px] flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <Link to="/" className="font-extrabold tracking-wider text-sm text-slate-900 flex items-center">
        <span className="inline-grid place-items-center text-white bg-gradient-to-br from-blue-600 to-violet-600 w-6 h-6 rounded mr-2 font-extrabold text-xs shadow-md shadow-blue-500/20">
          S
        </span>
        SIGNBRIDGE<span className="text-blue-600 ml-0.5">.</span>
      </Link>

      <button
        className="md:hidden p-2 text-slate-800 focus:outline-none"
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="w-6 h-0.5 bg-slate-900 mb-1.5 transition-all"></div>
        <div className="w-6 h-0.5 bg-slate-900 transition-all"></div>
      </button>

      <nav
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row absolute md:static top-[78px] left-5 right-5 bg-white md:bg-transparent border md:border-0 border-slate-200 rounded-xl md:rounded-none p-6 md:p-0 shadow-xl md:shadow-none gap-6 md:gap-8 font-mono text-[11px] uppercase tracking-wider text-slate-600 font-semibold`}
      >
        <Link
          to="/"
          className={`hover:text-blue-600 transition-colors ${!isProductPage ? 'text-blue-600 font-bold' : ''}`}
        >
          Home
        </Link>
        <a href="/#capabilities" className="hover:text-blue-600 transition-colors">
          Capabilities
        </a>
        <a href="/#research" className="hover:text-blue-600 transition-colors">
          R&amp;D
        </a>
        <a href="/#process" className="hover:text-blue-600 transition-colors">
          Process
        </a>
        <a href="/#team" className="hover:text-blue-600 transition-colors">
          Team
        </a>
        <Link
          to="/product"
          className={`hover:text-blue-600 transition-colors ${isProductPage ? 'text-blue-600 font-bold' : ''}`}
        >
          Smart Table Product
        </Link>
        <a href="/#contact" className="hover:text-blue-600 transition-colors">
          Contact
        </a>
      </nav>

      <a
        className="hidden md:inline-flex items-center text-blue-600 border border-blue-600/30 px-4 py-2.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-blue-50 hover:border-blue-600 transition-all shadow-sm"
        href="/#contact"
      >
        Start a project <span className="text-violet-600 ml-2">↗</span>
      </a>
    </header>
  );
}
