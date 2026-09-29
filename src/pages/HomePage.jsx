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
    <main className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen bg-[radial-gradient(ellipse_at_78%_46%,rgba(219,234,254,0.72),transparent_27%),linear-gradient(120deg,#fff_0%,#f8fbff_52%,#f4f1ff_100%)] pt-28 pb-20 overflow-hidden" id="home">
        <div className="absolute inset-0 opacity-65 bg-[linear-gradient(rgba(37,99,235,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(90deg,transparent_42%,#000_66%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 min-h-[calc(100vh-112px)] grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] items-center gap-12 relative z-10">
          <div className="max-w-2xl reveal">
            <p className="font-mono text-xs font-bold tracking-widest uppercase text-slate-800 mb-7 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_14px_rgba(37,99,235,0.65)] inline-block"></span>
              Software engineering &amp; AI studio
            </p>

            <h1 className="text-5xl md:text-7xl lg:text-[110px] leading-[0.86] tracking-tight font-extrabold uppercase text-slate-900 mb-8">
              We build<br />
              <em className="block bg-gradient-to-r from-blue-700 via-blue-600 to-violet-600 bg-clip-text text-transparent not-italic">
                what’s next.
              </em>
            </h1>

            <p className="text-slate-700 max-w-xl text-base md:text-lg font-medium leading-relaxed mb-9">
              SignBridge transforms ambitious ideas into intelligent, scalable digital products through software engineering, AI, cloud, IoT and emerging technologies.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-12">
              <a
                className="inline-flex items-center px-6 py-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
                href="#research"
              >
                Explore our work <span className="ml-2 text-violet-200">→</span>
              </a>
              <a
                className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-blue-600 transition-colors flex items-center"
                href="#contact"
              >
                Start a project <span className="text-blue-600 ml-2">↗</span>
              </a>
            </div>

            <div className="flex gap-8 pt-5 border-t border-slate-900/10 font-mono text-xs uppercase tracking-wider text-slate-600">
              <span><strong className="text-blue-600 text-lg font-bold mr-1">07</strong> disciplines</span>
              <span><strong className="text-blue-600 text-lg font-bold mr-1">∞</strong> possibilities</span>
            </div>
          </div>

          <div className="relative h-[440px] lg:h-[580px] rounded-3xl border border-blue-600/20 bg-gradient-to-br from-white/90 via-blue-50/60 to-purple-50/80 shadow-2xl shadow-blue-500/10 overflow-hidden reveal">
            <div className="absolute top-5 left-6 right-6 flex justify-between font-mono text-[10px] font-bold tracking-wider text-slate-700 z-30">
              <span>SB / 001</span>
              <span className="text-blue-700 font-extrabold">LIVE SYSTEM MAP</span>
            </div>

            <div className="absolute z-20 top-[19%] left-[17%] flex flex-col gap-1 p-3 rounded-xl border border-blue-600/30 bg-white/95 shadow-lg shadow-blue-500/15 font-mono text-xs font-extrabold text-blue-700">
              <b>AI</b>
              <small className="text-slate-700 text-[9px] uppercase tracking-wider font-bold">intelligence</small>
            </div>

            <div className="absolute z-20 top-[29%] right-[11%] flex flex-col gap-1 p-3 rounded-xl border border-blue-600/30 bg-white/95 shadow-lg shadow-blue-500/15 font-mono text-xs font-extrabold text-blue-700">
              <b>SOFTWARE</b>
              <small className="text-slate-700 text-[9px] uppercase tracking-wider font-bold">systems</small>
            </div>

            <div className="absolute z-20 bottom-[20%] right-[16%] flex flex-col gap-1 p-3 rounded-xl border border-blue-600/30 bg-white/95 shadow-lg shadow-blue-500/15 font-mono text-xs font-extrabold text-blue-700">
              <b>CLOUD</b>
              <small className="text-slate-700 text-[9px] uppercase tracking-wider font-bold">infrastructure</small>
            </div>

            <div className="absolute z-20 bottom-[27%] left-[13%] flex flex-col gap-1 p-3 rounded-xl border border-blue-600/30 bg-white/95 shadow-lg shadow-blue-500/15 font-mono text-xs font-extrabold text-blue-700">
              <b>IoT</b>
              <small className="text-slate-700 text-[9px] uppercase tracking-wider font-bold">connected edge</small>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-22 h-22 rounded-full grid place-items-center bg-gradient-to-br from-blue-600 to-violet-600 shadow-[0_0_45px_rgba(37,99,235,0.35)] z-30 text-white font-extrabold text-2xl">
              <span>SB</span>
              <i className="absolute -inset-7 border border-blue-600/30 rounded-full animate-core-pulse pointer-events-none"></i>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[330px] h-[170px] border border-blue-600/25 rounded-full -rotate-[28deg] z-20 pointer-events-none"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[360px] border border-purple-600/25 rounded-full rotate-[38deg] z-20 pointer-events-none"></div>

            <NetworkCanvas />
          </div>
        </div>

        <div className="absolute bottom-8 left-6 md:left-12 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 z-20">
          Scroll to explore <span className="text-blue-600 text-lg ml-2">↓</span>
        </div>
        <div className="absolute bottom-8 right-6 md:right-12 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 z-20">
          01 <span className="text-blue-600 mx-1.5">/</span> 07
        </div>
      </section>

      {/* INTRO & MARQUEE */}
      <section className="py-28 bg-white" id="capabilities">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold">
            What we build
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold leading-[1.04] tracking-tight max-w-5xl mb-20 text-slate-900 reveal">
            From intelligent software to connected hardware, we turn complex ideas into{' '}
            <em className="text-blue-600 not-italic">usable technology.</em>
          </h2>
        </div>

        <div className="border-y border-slate-200 overflow-hidden whitespace-nowrap py-6 bg-slate-50/50" aria-label="Technology disciplines">
          <div className="inline-flex items-center gap-10 min-w-full animate-marquee">
            <span className="text-lg font-bold tracking-wider text-blue-600">AI</span><b className="text-slate-400">✳</b>
            <span className="text-lg font-bold tracking-wider text-violet-600">SOFTWARE</span><b className="text-slate-400">✳</b>
            <span className="text-lg font-bold tracking-wider text-cyan-600">WEB</span><b className="text-slate-400">✳</b>
            <span className="text-lg font-bold tracking-wider text-blue-600">CLOUD</span><b className="text-slate-400">✳</b>
            <span className="text-lg font-bold tracking-wider text-emerald-600">IoT</span><b className="text-slate-400">✳</b>
            <span className="text-lg font-bold tracking-wider text-violet-600">EDGE AI</span><b className="text-slate-400">✳</b>
            <span className="text-lg font-bold tracking-wider text-cyan-600">AUTOMATION</span><b className="text-slate-400">✳</b>
            <span className="text-lg font-bold tracking-wider text-blue-600">INNOVATION</span><b className="text-slate-400">✳</b>
          </div>
        </div>
      </section>

      {/* CAPABILITIES GRID */}
      <section className="py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16 reveal">
            <div>
              <p className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                02 — Capabilities
              </p>
              <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.96] tracking-tight text-slate-900">
                Technology that<br />
                <em className="text-blue-600 not-italic">builds the bridge.</em>
              </h2>
            </div>
            <p className="text-slate-600 max-w-xs leading-relaxed self-end">
              A multidisciplinary engineering stack designed to move products from concept to deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-slate-200">
            {SIGNBRIDGE_PROFILE.capabilities.map((cap, idx) => (
              <article
                key={idx}
                className="p-8 border-r border-b border-slate-200 bg-white hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/30 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl reveal"
              >
                <span className="font-mono text-xs font-bold tracking-widest text-blue-600">{cap.number}</span>
                <div className="text-3xl text-blue-600 my-7">{cap.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{cap.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{cap.description}</p>
                <small className="font-mono text-xs text-slate-500 block">{cap.techStack}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-12 reveal">
            <p className="font-mono text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              Featured product
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-2">
              SignBridge Smart Table.
            </h2>
            <p className="font-mono text-xs text-slate-500">One simple product for every table.</p>
          </div>

          <div className="max-w-xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden reveal">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
              <span className="absolute z-10 left-5 top-1/2 -translate-y-1/2 font-mono text-xs tracking-widest text-white bg-slate-900/90 px-3 py-2 border-l-2 border-blue-500 rounded-r-md">
                SMART TABLE<br />
                <small className="text-blue-300 text-[8px]">NFC / QR MENU</small>
              </span>
              <img
                src="/assets/nfc-menu-starter-kit.png"
                alt="SIGNBRIDGE NFC menu card at a restaurant table"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-7">
              <span className="font-mono text-xs font-bold tracking-widest text-blue-600 block mb-2">
                PRODUCT / 001
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                NFC Menu Starter Kit
              </h2>
              <p className="font-mono text-xs text-slate-500 mb-6">Table card · NFC menu · QR backup</p>

              <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                <div>
                  <strong className="text-3xl font-extrabold text-slate-900 tracking-tight">$5</strong>{' '}
                  <small className="font-mono text-xs text-slate-500">one-time</small>
                </div>
                <Link
                  className="inline-flex items-center px-5 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-md hover:shadow-lg transition-all"
                  to="/product"
                >
                  View product <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* R&D LAB */}
      <section className="py-28 bg-gradient-to-br from-slate-100 via-blue-50/40 to-purple-50/40" id="research">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16 reveal">
            <div>
              <p className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                03 — R&amp;D lab
              </p>
              <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.96] tracking-tight text-slate-900">
                Exploring what<br />
                <em className="text-blue-600 not-italic">comes next.</em>
              </h2>
            </div>
            <p className="text-slate-600 max-w-xs leading-relaxed self-end">
              Our R&amp;D work explores the intersection of software engineering, artificial intelligence, IoT, edge computing and emerging technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {SIGNBRIDGE_PROFILE.rdCapabilities.map((proj) => (
              <article key={proj.id} className="reveal group">
                <div className="h-96 rounded-2xl bg-white border border-slate-200/80 shadow-lg shadow-slate-900/5 overflow-hidden grid place-items-center relative">
                  {proj.id === 'iot-edge-ai' ? (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-cyan-50 grid place-items-center relative">
                      <div className="text-5xl text-cyan-600 tracking-[12px] -rotate-12 font-bold">∿ ∿ ∿ ∿</div>
                      <div className="absolute bottom-8 right-8 border border-cyan-500 rounded-xl p-4 bg-white/80 backdrop-blur-sm font-mono text-xs text-slate-700">
                        ESP32<br /><strong className="text-cyan-600 text-xl font-bold">TinyML</strong>
                      </div>
                    </div>
                  ) : proj.id === 'aerospace-tech' ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 grid place-items-center relative">
                      <div className="w-64 h-28 border border-purple-500/50 rounded-full -rotate-25 shadow-xl shadow-purple-500/20"></div>
                      <div className="absolute text-violet-600 text-3xl font-bold">◆</div>
                    </div>
                  ) : (
                    <img
                      src={proj.image}
                      alt={proj.title}
                      loading="lazy"
                      className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="py-6">
                  <span className="font-mono text-xs font-bold text-blue-600">{proj.number} / {proj.domain}</span>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-3 mb-2">{proj.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{proj.description}</p>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {proj.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="font-mono text-xs bg-white border border-slate-200 px-3 py-1 rounded-md text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href="#contact" className="font-mono text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline">
                    Explore project ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-28 bg-white" id="process">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16 reveal">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold">
                04 — Our process
              </p>
              <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.96] tracking-tight text-slate-900">
                From idea to<br />
                <em className="text-blue-600 not-italic">deployment.</em>
              </h2>
            </div>
            <p className="text-slate-600 max-w-xs leading-relaxed self-end">
              A systematic engineering process for transforming complex requirements into production-ready products.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 pt-12 relative">
            <div className="absolute left-0 right-0 top-[60px] border-t border-slate-300 hidden md:block"></div>
            {SIGNBRIDGE_PROFILE.pipeline.map((item, index) => (
              <div
                key={item.step}
                className={`cursor-pointer pt-6 relative z-10 transition-all ${
                  activeStep === index ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div
                  className={`w-5 h-5 rounded-full border border-slate-300 bg-white mb-6 flex items-center justify-center transition-all ${
                    activeStep === index ? 'bg-gradient-to-br from-blue-600 to-violet-600 border-blue-600 shadow-md shadow-blue-500/30' : ''
                  }`}
                ></div>
                <h3 className="font-bold text-base text-slate-900 mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-28 bg-white border-t border-slate-100" id="team">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between gap-10 mb-16 reveal">
            <div>
              <p className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                05 — The team
              </p>
              <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.96] tracking-tight text-slate-900">
                The people behind<br />
                <em className="text-blue-600 not-italic">SignBridge.</em>
              </h2>
            </div>
            <p className="text-slate-600 max-w-xs leading-relaxed self-end">
              A multidisciplinary team combining product thinking, design, software engineering and data systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOUNDER_DATA.team.map((member) => (
              <article key={member.id} className="reveal group">
                <div className="overflow-hidden rounded-2xl shadow-lg shadow-slate-900/10 mb-4 aspect-[1/1.1] bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="font-mono text-xs font-bold text-blue-600 block">{member.badge}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-2 mb-1">{member.name}</h3>
                <p className="font-mono text-xs text-slate-500">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISION BANNER */}
      <section className="min-h-[70vh] grid place-items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 text-center py-20 relative">
        <div className="reveal max-w-4xl px-6">
          <p className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-6 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
            The signal
          </p>
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-extrabold uppercase tracking-tight leading-none text-slate-900 mb-4">
            Technology should<br />not just work.
          </h2>
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-extrabold uppercase tracking-tight leading-none text-blue-600">
            It should move<br />things forward.
          </h2>
          <div className="font-mono text-xs tracking-widest text-slate-500 uppercase mt-12">
            Software · AI · Web · Cloud · IoT · Automation · Innovation
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 reveal">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold">
              06 — Capabilities in practice
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.96] tracking-tight text-slate-900">
              What can we build<br />
              <em className="text-blue-600 not-italic">together?</em>
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {SIGNBRIDGE_PROFILE.services.map((svc) => (
              <div
                key={svc.number}
                className="py-7 grid grid-cols-[40px_1fr] md:grid-cols-[70px_1fr_1fr_30px] items-center gap-4 hover:px-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 transition-all duration-300"
              >
                <span className="font-mono text-xs text-slate-500 font-bold">{svc.number}</span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{svc.title}</h3>
                <p className="text-xs text-slate-500 col-span-2 md:col-span-1">{svc.desc}</p>
                <b className="text-blue-600 text-lg font-bold">↗</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-32 bg-gradient-to-br from-white via-slate-50 to-blue-50/50" id="contact">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-16">
          <div className="reveal">
            <p className="font-mono text-xs font-bold tracking-widest uppercase text-blue-600 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
              Let’s work together
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.96] tracking-tight text-slate-900 mb-8">
              Have an idea<br />
              <em className="text-blue-600 not-italic">worth building?</em>
            </h2>
            <p className="text-slate-600 max-w-md leading-relaxed text-base mb-10">
              Tell us what you're building, improving or automating. We'll help define the next practical step.
            </p>
            <div className="flex flex-col gap-4 font-mono text-xs text-blue-600 font-bold">
              <a href="mailto:signbridge.aiauto@gmail.com" className="hover:underline">
                signbridge.aiauto@gmail.com ↗
              </a>
              <a href="tel:+919842253267" className="text-slate-900 hover:underline">
                +91 98422 53267
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">
                LinkedIn ↗
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold">
              Questions, answered
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.96] tracking-tight text-slate-900">
              Good to<br />
              <em className="text-blue-600 not-italic">know.</em>
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {SIGNBRIDGE_PROFILE.faqs.map((faq, fIdx) => (
              <details key={fIdx} className="py-6 group">
                <summary className="list-none cursor-pointer font-bold text-lg text-slate-900 flex justify-between items-center">
                  {faq.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-slate-600 text-sm leading-relaxed mt-4 max-w-xl">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
