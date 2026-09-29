import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NetworkCanvas from '../components/NetworkCanvas';
import ContactForm from '../components/ContactForm';
import { SIGNBRIDGE_PROFILE, FOUNDER_DATA } from '../data/galleryData';

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero section-dark" id="home">
        <div className="hero-noise"></div>
        <div className="hero-layout">
          <div className="hero-copy reveal">
            <p className="eyebrow"><i></i> Software engineering &amp; AI studio</p>
            <h1>We build<br /><em>what’s next.</em></h1>
            <p className="hero-lede">
              SignBridge transforms ambitious ideas into intelligent, scalable digital products through software engineering, AI, cloud, IoT and emerging technologies.
            </p>
            <div className="hero-actions">
              <a className="button button-lime magnetic" href="#research">
                Explore our work <span>→</span>
              </a>
              <a className="text-link" href="#contact">
                Start a project <span>↗</span>
              </a>
            </div>
            <div className="hero-proof">
              <span><strong>07</strong> disciplines</span>
              <span><strong>∞</strong> possibilities</span>
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="visual-kicker">
              <span>SB / 001</span>
              <span>LIVE SYSTEM MAP</span>
            </div>
            <div className="bridge-node node-ai">
              <b>AI</b>
              <small>intelligence</small>
            </div>
            <div className="bridge-node node-software">
              <b>SOFTWARE</b>
              <small>systems</small>
            </div>
            <div className="bridge-node node-cloud">
              <b>CLOUD</b>
              <small>infrastructure</small>
            </div>
            <div className="bridge-node node-iot">
              <b>IoT</b>
              <small>connected edge</small>
            </div>
            <div className="bridge-core">
              <span>SB</span>
              <i></i>
            </div>
            <div className="bridge-orbit orbit-a"></div>
            <div className="bridge-orbit orbit-b"></div>

            <NetworkCanvas />
          </div>
        </div>

        <div className="scroll-cue">Scroll to explore <span>↓</span></div>
        <div className="hero-index">01 <span>/</span> 07</div>
      </section>

      {/* INTRO & MARQUEE */}
      <section className="intro section-light" id="capabilities">
        <div className="section-frame">
          <p className="eyebrow dark-eyebrow">What we build</p>
          <h2 className="statement reveal">
            From intelligent software to connected hardware, we turn complex ideas into <em>usable technology.</em>
          </h2>
        </div>
        <div className="marquee" aria-label="Technology disciplines">
          <div className="marquee-track">
            <span>AI</span><b>✳</b>
            <span>SOFTWARE</span><b>✳</b>
            <span>WEB</span><b>✳</b>
            <span>CLOUD</span><b>✳</b>
            <span>IoT</span><b>✳</b>
            <span>EDGE AI</span><b>✳</b>
            <span>AUTOMATION</span><b>✳</b>
            <span>INNOVATION</span><b>✳</b>
            <span>AI</span><b>✳</b>
            <span>SOFTWARE</span><b>✳</b>
            <span>WEB</span><b>✳</b>
            <span>CLOUD</span>
          </div>
        </div>
      </section>

      {/* CAPABILITIES GRID */}
      <section className="capabilities section-dark">
        <div className="section-frame">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow"><i></i> 02 — Capabilities</p>
              <h2>Technology that<br /><em>builds the bridge.</em></h2>
            </div>
            <p>A multidisciplinary engineering stack designed to move products from concept to deployment.</p>
          </div>

          <div className="capability-grid">
            {SIGNBRIDGE_PROFILE.capabilities.map((cap, idx) => (
              <article key={idx} className="capability reveal">
                <span className="card-number">{cap.number}</span>
                <div className="cap-icon">{cap.icon}</div>
                <h3>{cap.title}</h3>
                <p>{cap.description}</p>
                <small>{cap.techStack}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT */}
      <section className="product section-light">
        <div className="section-frame">
          <div className="product-section-heading reveal">
            <p className="eyebrow dark-eyebrow">Featured product</p>
            <h2>SignBridge Smart Table.</h2>
            <p>One simple product for every table.</p>
          </div>

          <div className="product-team-card reveal">
            <div className="product-team-image">
              <span className="product-image-note">
                SMART TABLE<br />
                <small>NFC / QR MENU</small>
              </span>
              <img src="/assets/nfc-menu-starter-kit.png" alt="SIGNBRIDGE NFC menu card at a restaurant table" loading="lazy" />
            </div>
            <div className="product-team-info">
              <span className="catalog-number">PRODUCT / 001</span>
              <h2>NFC Menu Starter Kit</h2>
              <p>Table card · NFC menu · QR backup</p>
              <div className="product-team-bottom">
                <strong>$5 <small>one-time</small></strong>
                <Link className="button button-dark" to="/product">
                  View product <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* R&D LAB */}
      <section className="research section-dark" id="research">
        <div className="section-frame">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow"><i></i> 03 — R&amp;D lab</p>
              <h2>Exploring what<br /><em>comes next.</em></h2>
            </div>
            <p>Our R&amp;D work explores the intersection of software engineering, artificial intelligence, IoT, edge computing and emerging technologies.</p>
          </div>

          <div className="project-grid">
            {SIGNBRIDGE_PROFILE.rdCapabilities.map((proj) => (
              <article key={proj.id} className={`project project-${proj.id === 'shopcart' ? 'shop' : proj.id === 'indianoil-sales-hub' ? 'sales' : proj.id === 'iot-edge-ai' ? 'eco' : 'space'} reveal`}>
                <div className="project-visual">
                  {proj.id === 'iot-edge-ai' ? (
                    <div className="project-visual eco-visual" style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                      <div className="waveform">∿ ∿ ∿ ∿</div>
                      <div className="eco-chip">ESP32<br /><strong>TinyML</strong></div>
                    </div>
                  ) : proj.id === 'aerospace-tech' ? (
                    <div className="project-visual space-visual" style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                      <div className="orbit-ring"></div>
                      <div className="satellite">◆</div>
                    </div>
                  ) : (
                    <img src={proj.image} alt={proj.title} loading="lazy" />
                  )}
                </div>
                <div className="project-meta">
                  <span>{proj.number} / {proj.domain}</span>
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                  <div className="tags">
                    {proj.tags.map((tag, tIdx) => (
                      <b key={tIdx}>{tag}</b>
                    ))}
                  </div>
                  <a href="#contact">Explore project ↗</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="process section-light" id="process">
        <div className="section-frame">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow dark-eyebrow">04 — Our process</p>
              <h2>From idea to<br /><em>deployment.</em></h2>
            </div>
            <p>A systematic engineering process for transforming complex requirements into production-ready products.</p>
          </div>

          <div className="timeline">
            <div className="timeline-line"></div>
            {SIGNBRIDGE_PROFILE.pipeline.map((item, index) => (
              <div
                key={item.step}
                className={`step ${activeStep === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <b>{item.step}</b>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team section-dark" id="team">
        <div className="section-frame">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow"><i></i> 05 — The team</p>
              <h2>The people behind<br /><em>SignBridge.</em></h2>
            </div>
            <p>A multidisciplinary team combining product thinking, design, software engineering and data systems.</p>
          </div>

          <div className="team-grid">
            {FOUNDER_DATA.team.map((member) => (
              <article key={member.id} className="person reveal">
                <img src={member.image} alt={member.name} />
                <span>{member.badge}</span>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISION BANNER */}
      <section className="vision section-dark">
        <div className="vision-content reveal">
          <p className="eyebrow"><i></i> The signal</p>
          <h2>Technology should<br />not just work.</h2>
          <h2 className="lime">It should move<br />things forward.</h2>
          <div className="vision-pillars">
            Software · AI · Web · Cloud · IoT · Automation · Innovation
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services section-light">
        <div className="section-frame">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow dark-eyebrow">06 — Capabilities in practice</p>
              <h2>What can we build<br /><em>together?</em></h2>
            </div>
          </div>

          <div className="service-list">
            {SIGNBRIDGE_PROFILE.services.map((svc) => (
              <div key={svc.number}>
                <span>{svc.number}</span>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <b>↗</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact section-dark" id="contact">
        <div className="section-frame contact-grid">
          <div className="contact-copy reveal">
            <p className="eyebrow"><i></i> Let’s work together</p>
            <h2>Have an idea<br /><em>worth building?</em></h2>
            <p>Tell us what you're building, improving or automating. We'll help define the next practical step.</p>
            <div className="contact-details">
              <a href="mailto:signbridge.aiauto@gmail.com">signbridge.aiauto@gmail.com ↗</a>
              <a href="tel:+919842253267">+91 98422 53267</a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="faq section-light">
        <div className="section-frame faq-grid">
          <div>
            <p className="eyebrow dark-eyebrow">Questions, answered</p>
            <h2>Good to<br /><em>know.</em></h2>
          </div>

          <div className="faq-list">
            {SIGNBRIDGE_PROFILE.faqs.map((faq, fIdx) => (
              <details key={fIdx}>
                <summary>
                  {faq.q}
                  <span>+</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
