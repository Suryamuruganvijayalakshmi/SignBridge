import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100 py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 pb-16">
        <div>
          <Link to="/" className="font-extrabold tracking-wider text-base text-white flex items-center">
            <span className="inline-grid place-items-center text-white bg-gradient-to-br from-blue-600 to-violet-600 w-6 h-6 rounded mr-2 font-extrabold text-xs">
              S
            </span>
            SIGNBRIDGE<span className="text-blue-500 ml-0.5">.</span>
          </Link>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Bridging ideas with technology.
          </p>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed">
          Intelligent software, AI applications, web platforms, and IoT systems built for scale and real-world impact.
        </p>

        <div className="flex gap-12 md:justify-end">
          <div className="flex flex-col gap-3">
            <b className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">
              Navigate
            </b>
            <a href="/#capabilities" className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="/#research" className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
              R&amp;D
            </a>
            <a href="/#process" className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
              Process
            </a>
            <a href="/#team" className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
              Team
            </a>
            <Link to="/product" className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
              Smart Table
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <b className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">
              Connect
            </b>
            <a
              href="mailto:signbridge.aiauto@gmail.com"
              className="font-mono text-xs text-slate-400 hover:text-white transition-colors"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-slate-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a href="tel:+919842253267" className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
              Call
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between text-slate-500 font-mono text-xs gap-3">
        <span>© 2026 SIGNBRIDGE. All rights reserved.</span>
        <span>Software · AI · Web · Cloud · IoT</span>
      </div>
    </footer>
  );
}
