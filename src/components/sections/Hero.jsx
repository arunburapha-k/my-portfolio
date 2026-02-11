import React from 'react';
import { BsTelephone, BsEnvelope, BsCodeSlash, BsTerminal } from 'react-icons/bs';
import profileImg from '../../assets/profile.png'; // ปรับ Path ตามจริง
// Import Components ที่จำเป็น
import Magnet from '../ui/Magnet'; // สมมติว่าแยก Magnet ไว้ที่ ui
import ShinyText from '../ui/ShinyText';
import DecryptedText from '../ui/DecryptedText';
import PixelBlast from '../ui/PixelBlast';

const Hero = ({ darkMode, t, typedText, scrollToSection }) => {
  const pixelColors = darkMode
    ? ['#22d3ee', '#34d399', '#ffffff', '#0ea5e9']
    : ['#0891b2', '#059669', '#64748b', '#0369a1'];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* PIXEL BLAST LAYER */}
      <div className="absolute inset-0 z-0">
        <PixelBlast colors={pixelColors} gap={20} speed={0.03} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center content-wrapper">
        {/* Left Column: Text Info */}
        <div className="order-2 md:order-1">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-6 backdrop-blur-sm ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10 bg-black/30' : 'border-emerald-600/30 bg-emerald-100 bg-white/30'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <ShinyText text={t.availableFor} className={darkMode ? 'text-emerald-400' : 'text-emerald-700'} />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
            <span className={`font-mono text-2xl block mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>{t.aboutTitle}</span>
            <DecryptedText text={t.name} className={darkMode ? 'text-white' : 'text-slate-900'} />
          </h1>
          <p className={`text-xl md:text-2xl font-mono mb-6 ${darkMode ? 'text-cyan-500' : 'text-cyan-700'}`}>{t.title}</p>
          
          {/* Contact Info */}
          <div className={`flex flex-col md:flex-row gap-2 md:gap-6 mb-8 font-mono text-sm md:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <a href="tel:0624645582" className="flex items-center gap-2 hover:text-emerald-500 transition-colors group">
              <span className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-800 group-hover:bg-emerald-500/20' : 'bg-slate-200 group-hover:bg-emerald-100'}`}>
                <BsTelephone size={14} />
              </span>
              062-464-5582
            </a>
            <a href="mailto:arunburapha.k@gmail.com" className="flex items-center gap-2 hover:text-emerald-500 transition-colors group">
              <span className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-800 group-hover:bg-emerald-500/20' : 'bg-slate-200 group-hover:bg-emerald-100'}`}>
                <BsEnvelope size={14} />
              </span>
              arunburapha.k@gmail.com
            </a>
          </div>
          
          <div className={`h-12 flex items-center font-mono text-xl md:text-2xl mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {typedText}<span className="animate-pulse text-cyan-500">_</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Magnet>
              <button onClick={() => scrollToSection('projects')} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded-none border-l-4 border-white transition-all hover:translate-x-1 flex items-center gap-2 shadow-lg">
                <BsCodeSlash /> {t.ctaProjects}
              </button>
            </Magnet>
            <Magnet>
              <button onClick={() => scrollToSection('contact')} className={`px-8 py-3 border font-mono rounded-none transition-all flex items-center gap-2 backdrop-blur-sm ${darkMode ? 'border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-500 bg-white/5' : 'border-slate-400 hover:border-cyan-600 text-slate-700 hover:text-cyan-700 bg-white/40'}`}>
                <BsTerminal /> {t.ctaContact}
              </button>
            </Magnet>
          </div>
        </div>

        {/* Right Column: Profile Image */}
        <div className="order-1 md:order-2 relative flex justify-center md:justify-end items-center h-full min-h-[400px]">
          <div className="absolute top-1/2 left-1/2 md:left-auto md:right-[5%] -translate-x-1/2 -translate-y-1/2 md:translate-x-0 w-[550px] h-[550px] md:w-[750px] md:h-[750px] pointer-events-none z-0">
            <div className={`absolute inset-0 border-2 border-dashed rounded-full animate-[spin_30s_linear_infinite] ${darkMode ? 'border-cyan-500/50' : 'border-cyan-600/40'}`}></div>
            <div className={`absolute inset-[15%] border-4 border-dotted rounded-full animate-[spin_20s_linear_infinite_reverse] ${darkMode ? 'border-emerald-500/40' : 'border-emerald-600/30'}`}></div>
            <div className="absolute inset-[25%] bg-cyan-500/10 blur-3xl rounded-full"></div>
          </div>
          <div className="relative z-10 w-auto h-[450px] md:h-[600px] flex justify-center items-end">
            <img
              src={profileImg}
              alt="Arunburapha Profile"
              className="magnet-target relative w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              style={{
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;