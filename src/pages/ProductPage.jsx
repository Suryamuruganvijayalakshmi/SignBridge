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
    <main style={{ paddingTop: '78px' }}>
      {/* HERO / PREVIEW STAGE */}
      <section className="product-hero hero">
        <div className="orb one"></div>
        <div className="orb two"></div>
        <div className="wrap hero-inner">
          <span className="eyebrow"><span className="dot"></span>SIGNBRIDGE FOR HOSPITALITY</span>
          <h1>YOUR MENU.<br /><span>ONE TAP AWAY.</span></h1>
          <p className="sub">SignBridge Smart Table turns every restaurant table into a smart digital menu experience.</p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => handleRequestClick('Buy')}>
              GET YOUR STARTER KIT →
            </button>
            <button className="btn btn-secondary" onClick={() => handleRequestClick('Demo')}>
              BOOK A 5-MIN DEMO ↗
            </button>
          </div>
          <p className="trust">NFC + QR · NO APP REQUIRED · CLOUD CONTROL</p>

          <div className="stage">
            <div className="table-card">
              <strong>SIGNBRIDGE</strong>
              <div className="qr"></div>
              <small>Tap or scan to view menu</small>
            </div>
            <div className="waves">)))</div>
            <div className="phone">
              <div className="screen">
                <header><span>Terra</span><span>•••</span></header>
                <h4>SEASONAL MENU</h4>
                <div className="dish"><span>Charred citrus</span><b>$18</b></div>
                <div className="dish"><span>Wild mushroom</span><b>$24</b></div>
                <div className="dish"><span>Olive oil cake</span><b>$12</b></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT SHOWCASE */}
      <section className="info" id="product">
        <div className="section-head product-heading">
          <span className="eyebrow"><span className="dot"></span>FEATURED PRODUCT</span>
          <h2>One card. A smarter table.</h2>
          <p>SignBridge Smart Table Starter Kit</p>
        </div>

        <div className="product-showcase">
          <div className="product-image">
            <img src="/assets/nfc-menu-starter-kit.png" alt="SIGNBRIDGE NFC Menu Starter Kit" loading="eager" />
          </div>
          <div className="product-details">
            <span className="product-label">SIGNBRIDGE PRODUCT / 001</span>
            <h2>NFC Menu<br /><em>Starter Kit.</em></h2>
            <p className="product-short">Table card · NFC menu · QR backup</p>
            <div className="product-price">$5 <small>one-time</small></div>
            <button className="btn btn-primary product-buy" onClick={() => handleRequestClick('Buy')}>
              BUY STARTER KIT <span>→</span>
            </button>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="section-head features-heading">
          <h2>Simple for every table.</h2>
          <p>Everything included to give guests quick digital menu access.</p>
        </div>

        <div className="grid" id="features">
          <article className="card">
            <span>01</span>
            <h3>NFC + QR access</h3>
            <p>Guests tap or scan to open the menu instantly.</p>
          </article>
          <article className="card">
            <span>02</span>
            <h3>No app required</h3>
            <p>Works directly in the guest’s phone browser.</p>
          </article>
          <article className="card">
            <span>03</span>
            <h3>Custom branding</h3>
            <p>Keep your restaurant identity across the experience.</p>
          </article>
        </div>
      </section>

      {/* VIDEO DEMO PLAYER */}
      <section className="video-section" id="demo">
        <div className="section-head">
          <span className="eyebrow"><span className="dot"></span>PRODUCT DEMO</span>
          <h2>See Smart Table in action.</h2>
          <p>A quick look at the experience from tap to menu.</p>
        </div>
        <video
          className="video-frame"
          controls
          preload="metadata"
          poster="/assets/nfc-menu-starter-kit.png"
        >
          <source src="/assets/signbridge-product-launch.mp4" type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </section>

      {/* REQUEST / ORDER FORM */}
      <section className="request-section" id="request">
        <div className="request-copy">
          <span className="eyebrow"><span class="dot"></span>START HERE</span>
          <h2>Tell us what you need.</h2>
          <p>Book a demo for your restaurant or request the NFC Menu Starter Kit. We will follow up with the next practical step.</p>
        </div>

        <ProductRequestForm defaultRequestType={requestType} />
      </section>
    </main>
  );
}
