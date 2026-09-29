import { useState, useEffect } from 'react';
import ProductRequestForm from '../components/ProductRequestForm';

export default function ProductPage() {
  const [requestType, setRequestType] = useState('Buy');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRequestClick = (type) => {
    setRequestType(type);
    const reqElem = document.getElementById('request');
    if (reqElem) {
      reqElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="pt-20 overflow-hidden">
      {/* HERO / PREVIEW STAGE */}
      <section className="relative py-24 bg-gradient-to-br from-purple-50/50 via-slate-50 to-blue-50/50 overflow-hidden">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-indigo-500/20 blur-3xl -top-28 -left-20 animate-float pointer-events-none"></div>
        <div className="absolute w-[280px] h-[280px] rounded-full bg-violet-500/20 blur-3xl top-8 -right-16 animate-float [animation-delay:2s] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-4 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
            SIGNBRIDGE FOR HOSPITALITY
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold font-display tracking-tight text-slate-900 my-6">
            YOUR MENU.<br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              ONE TAP AWAY.
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto mb-9">
            SignBridge Smart Table turns every restaurant table into a smart digital menu experience.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              className="px-7 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
              onClick={() => handleRequestClick('Buy')}
            >
              GET YOUR STARTER KIT →
            </button>
            <button
              className="px-7 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-white border border-blue-600/30 shadow-md hover:bg-blue-50 hover:-translate-y-0.5 transition-all"
              onClick={() => handleRequestClick('Demo')}
            >
              BOOK A 5-MIN DEMO ↗
            </button>
          </div>

          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            NFC + QR · NO APP REQUIRED · CLOUD CONTROL
          </p>

          {/* SIMULATED STAGE */}
          <div className="relative max-w-xl h-[380px] mx-auto mt-16 flex items-center justify-center">
            <div className="w-[170px] h-[240px] bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-2xl shadow-blue-900/30 -rotate-12 flex flex-col justify-between z-20">
              <strong className="font-mono text-xs tracking-widest text-white">SIGNBRIDGE</strong>
              <div className="w-14 h-14 bg-white rounded-lg my-auto self-center flex items-center justify-center text-slate-900 font-extrabold text-xs">
                QR
              </div>
              <small className="font-mono text-[9px] text-blue-300">Tap or scan to view menu</small>
            </div>

            <div className="text-3xl text-cyan-500 font-bold mx-4 animate-pulse">)))</div>

            <div className="w-[190px] h-[360px] border-8 border-slate-900 bg-slate-900 rounded-[28px] shadow-2xl shadow-blue-600/20 rotate-6 overflow-hidden z-20">
              <div className="bg-white rounded-[18px] h-full p-4 flex flex-col text-slate-900">
                <header className="flex justify-between font-bold text-xs">
                  <span>Terra</span>
                  <span>•••</span>
                </header>
                <h4 className="font-mono text-[9px] text-slate-400 tracking-wider my-4">SEASONAL MENU</h4>
                <div className="flex justify-between items-center border-t border-slate-100 py-3 text-xs">
                  <span>Charred citrus</span>
                  <b className="text-blue-600 font-bold">$18</b>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 py-3 text-xs">
                  <span>Wild mushroom</span>
                  <b className="text-blue-600 font-bold">$24</b>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 py-3 text-xs">
                  <span>Olive oil cake</span>
                  <b className="text-blue-600 font-bold">$12</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12" id="product">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-2 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
            FEATURED PRODUCT
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display mt-2 mb-2">
            One card. A smarter table.
          </h2>
          <p className="text-slate-500 text-sm">SignBridge Smart Table Starter Kit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
            <img src="/assets/nfc-menu-starter-kit.png" alt="SIGNBRIDGE NFC Menu Starter Kit" loading="eager" className="w-full h-full object-cover" />
          </div>

          <div>
            <span className="font-mono text-xs font-bold tracking-widest text-blue-600 block mb-3">
              SIGNBRIDGE PRODUCT / 001
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3 font-display">
              NFC Menu<br />
              <em className="text-blue-600 not-italic">Starter Kit.</em>
            </h2>
            <p className="font-mono text-xs text-slate-500 mb-8">Table card · NFC menu · QR backup</p>

            <div className="text-5xl font-extrabold text-slate-900 tracking-tight mb-8">
              $5 <small className="font-mono text-xs text-slate-500 font-normal">one-time</small>
            </div>

            <button
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              onClick={() => handleRequestClick('Buy')}
            >
              BUY STARTER KIT <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-28 text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">
            Simple for every table.
          </h2>
          <p className="text-slate-500 text-sm mt-2">Everything included to give guests quick digital menu access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="features">
          <article className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-900/5">
            <span className="font-mono text-xs font-bold text-blue-600">01</span>
            <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">NFC + QR access</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Guests tap or scan to open the menu instantly.</p>
          </article>
          <article className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-900/5">
            <span className="font-mono text-xs font-bold text-blue-600">02</span>
            <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">No app required</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Works directly in the guest’s phone browser.</p>
          </article>
          <article className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-900/5">
            <span className="font-mono text-xs font-bold text-blue-600">03</span>
            <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">Custom branding</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Keep your restaurant identity across the experience.</p>
          </article>
        </div>
      </section>

      {/* VIDEO DEMO */}
      <section className="py-20 max-w-5xl mx-auto px-6 md:px-12 text-center" id="demo">
        <span className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-2 inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
          PRODUCT DEMO
        </span>
        <h2 className="text-4xl font-extrabold text-slate-900 font-display mt-2 mb-2">
          See Smart Table in action.
        </h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">A quick look at the experience from tap to menu.</p>

        <video
          className="w-full rounded-2xl shadow-2xl mt-10 bg-black overflow-hidden"
          controls
          preload="metadata"
          poster="/assets/nfc-menu-starter-kit.png"
        >
          <source src="/assets/signbridge-product-launch.mp4" type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </section>

      {/* REQUEST SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start" id="request">
        <div>
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-2 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
            START HERE
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display mt-2 mb-4">
            Tell us what you need.
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Book a demo for your restaurant or request the NFC Menu Starter Kit. We will follow up with the next practical step.
          </p>
        </div>

        <ProductRequestForm defaultRequestType={requestType} />
      </section>
    </main>
  );
}
