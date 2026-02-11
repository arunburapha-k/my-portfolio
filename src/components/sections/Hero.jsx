import React from 'react';
import { BsTelephone, BsEnvelope, BsCodeSlash, BsTerminal } from 'react-icons/bs';
import profileImg from '../../assets/profile.png'; 
import Magnet from '../ui/Magnet';
import ShinyText from '../ui/ShinyText';
import DecryptedText from '../ui/DecryptedText';
import PixelBlast from '../ui/PixelBlast';

const Hero = ({ darkMode, t, typedText, scrollToSection }) => {
  const pixelColors = darkMode
    ? ['#22d3ee', '#34d399', '#ffffff', '#0ea5e9']
    : ['#0891b2', '#059669', '#64748b', '#0369a1'];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <PixelBlast colors={pixelColors} gap={20} speed={0.03} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="order-2 md:order-1 text-center md:text-left">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] md:text-xs font-mono mb-6 backdrop-blur-sm ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-600/30 bg-emerald-100'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <ShinyText text={t.availableFor} className={darkMode ? 'text-emerald-400' : 'text-emerald-700'} />
          </div>

          {/* Responsive Heading: เล็กในมือถือ ใหญ่ในจอคอม */}
          <h1 className="text-4xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
            <span className={`font-mono text-lg md:text-2xl block mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>{t.aboutTitle}</span>
            <DecryptedText text={t.name} className={darkMode ? 'text-white' : 'text-slate-900'} />
          </h1>
          
          <p className={`text-lg md:text-2xl font-mono mb-6 ${darkMode ? 'text-cyan-500' : 'text-cyan-700'}`}>{t.title}</p>
          
          {/* Contact Details */}
          <div className={`flex flex-col md:flex-row justify-center md:justify-start gap-3 md:gap-6 mb-8 font-mono text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <a href="tel:0624645582" className="flex items-center justify-center md:justify-start gap-2 hover:text-emerald-500 transition-colors group">
              <span className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <BsTelephone size={14} />
              </span>
              062-464-5582
            </a>
            <a href="mailto:arunburapha.k@gmail.com" className="flex items-center justify-center md:justify-start gap-2 hover:text-emerald-500 transition-colors group">
              <span className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <BsEnvelope size={14} />
              </span>
              arunburapha.k@gmail.com
            </a>
          </div>
          
          <div className={`h-12 flex items-center justify-center md:justify-start font-mono text-lg md:text-2xl mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {typedText}<span className="animate-pulse text-cyan-500">_</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Magnet>
              <button onClick={() => scrollToSection('projects')} className="px-6 md:px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-sm md:text-base transition-all flex items-center gap-2">
                <BsCodeSlash /> {t.ctaProjects}
              </button>
            </Magnet>
            <Magnet>
              <button onClick={() => scrollToSection('contact')} className={`px-6 md:px-8 py-3 border font-mono text-sm md:text-base transition-all flex items-center gap-2 backdrop-blur-sm ${darkMode ? 'border-slate-600 text-slate-300 hover:text-cyan-500' : 'border-slate-400 text-slate-700 hover:text-cyan-700'}`}>
                <BsTerminal /> {t.ctaContact}
              </button>
            </Magnet>
          </div>
        </div>

        {/* Profile Image with Animated Aura */}
        <div className="order-1 md:order-2 relative flex justify-center items-center h-full min-h-[300px] md:min-h-[400px]">
          <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] pointer-events-none z-0">
            <div className={`absolute inset-0 border-2 border-dashed rounded-full animate-[spin_30s_linear_infinite] ${darkMode ? 'border-cyan-500/30' : 'border-cyan-600/20'}`}></div>
            <div className={`absolute inset-[10%] border-2 border-dotted rounded-full animate-[spin_20s_linear_infinite_reverse] ${darkMode ? 'border-emerald-500/20' : 'border-emerald-600/10'}`}></div>
          </div>
          <div className="relative z-10 w-[250px] md:w-auto h-[350px] md:h-[550px] flex justify-center items-end">
            <img
              src={profileImg}
              alt="Profile"
              className="magnet-target w-full h-full object-contain drop-shadow-2xl"
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