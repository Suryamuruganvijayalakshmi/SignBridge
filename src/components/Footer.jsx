import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative w-full bg-zinc-950 text-white pt-24 pb-8 px-6 md:px-12 lg:px-20 mt-20" style={{ pointerEvents: 'auto' }}>
            {/* Top Section: CTA & Links */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-16 lg:gap-12 mb-24 md:mb-32">
                
                {/* Left: Big CTA */}
                <div className="flex-1 max-w-2xl">
                    <h2 
                        className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-8 !text-white" 
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Ready to build <br/>
                        <span className="text-[#c4ff55]">something beyond?</span>
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-md mb-8">
                        We transform ambitious ideas into intelligent, scalable digital products through software engineering and AI.
                    </p>
                    <a 
                        href="mailto:hello@signbridge.com" 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-950 rounded-full font-bold uppercase tracking-wide hover:bg-[#ff75a0] hover:text-white transition-all duration-300"
                    >
                        Start a Project <ArrowUpRight size={20} />
                    </a>
                </div>

                {/* Right: Link Columns */}
                <div className="flex flex-wrap gap-12 lg:gap-20 pt-4">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-zinc-500 font-bold tracking-widest text-sm mb-2 uppercase">Expertise</h4>
                        <a href="#services" className="text-lg md:text-xl font-medium !text-zinc-300 hover:!text-[#c4ff55] transition-colors">Software Engineering</a>
                        <a href="#services" className="text-lg md:text-xl font-medium !text-zinc-300 hover:!text-[#c4ff55] transition-colors">Artificial Intelligence</a>
                        <a href="#services" className="text-lg md:text-xl font-medium !text-zinc-300 hover:!text-[#c4ff55] transition-colors">Cloud & IoT</a>
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-zinc-500 font-bold tracking-widest text-sm mb-2 uppercase">Socials</h4>
                        <a href="https://www.instagram.com/sign_bridgee/" target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl font-medium !text-zinc-300 hover:!text-[#ff75a0] transition-colors">Instagram</a>
                        <a href="https://www.linkedin.com/company/signbridgesurya" target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl font-medium !text-zinc-300 hover:!text-[#00ffff] transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Massive Text */}
            <div className="w-full flex flex-col justify-end mt-auto border-t border-zinc-800 pt-12 relative max-w-7xl mx-auto">
                <div className="w-full text-center pb-8">
                    {/* The text-[14vw] scales massively with the screen width */}
                    <h1 
                        className="text-[12vw] font-black tracking-tighter leading-none select-none !text-zinc-100 m-0" 
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        SIGNBRIDGE
                    </h1>
                </div>
                
                {/* Copyright / Credits */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-zinc-500 mt-4 gap-4">
                    <span>© 2026 SIGNBRIDGE. ALL RIGHTS RESERVED.</span>
                    <span>BEYOND DIGITAL // INNOVATION STUDIO</span>
                </div>
            </div>
        </footer>
    );
}
