import React from 'react';
import { BsRobot, BsGeoAlt, BsMortarboard, BsCpu } from 'react-icons/bs';
import ScrollReveal from '../ui/ScrollReveal';
import SpotlightCard from '../ui/SpotlightCard';

const About = ({ darkMode, t, language }) => {
  return (
    <section id="section-about" data-section="about" className="max-w-4xl mx-auto">
      <ScrollReveal>
        <h2 className="font-mono text-3xl mb-8 flex items-center gap-4 text-slate-400">
          <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>01.</span> {t.aboutTitle}
          <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <SpotlightCard className="p-0 hover-card overflow-hidden" darkMode={darkMode} spotlightColor={darkMode ? "rgba(34, 211, 238, 0.15)" : "rgba(8, 145, 178, 0.1)"}>
          {/* Terminal Header */}
          <div className={`px-4 py-3 border-b flex justify-between items-center select-none ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100/80 border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <span className={`ml-3 font-mono text-[10px] tracking-widest opacity-60 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                USER_PROFILE.SYS
              </span>
            </div>
            <div className={`text-[10px] font-mono opacity-40 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              ID: 6703052411074
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 relative">
            <div className="absolute top-4 right-4 text-[10px] font-mono opacity-10 rotate-90 origin-top-right select-none">
              SEC_01 // BIO
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-5">
                <div className={`hidden md:flex p-3 rounded-lg mt-1 shrink-0 ${darkMode ? 'bg-slate-800 text-cyan-400' : 'bg-slate-200 text-cyan-600'}`}>
                  <BsRobot size={24} />
                </div>
                <div>
                  <p className={`text-lg leading-relaxed font-light ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.about}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className={`mt-2 pt-6 border-t border-dashed grid grid-cols-2 md:grid-cols-4 gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-300'}`}>
                {/* Status */}
                <div>
                  <div className={`text-[10px] font-mono uppercase opacity-50 mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {language === 'en' ? 'STATUS' : 'สถานะ'}
                  </div>
                  <div className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {language === 'en' ? 'Online' : 'ออนไลน์'}
                  </div>
                </div>
                {/* Location */}
                <div>
                  <div className={`text-[10px] font-mono uppercase opacity-50 mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {language === 'en' ? 'LOCATION' : 'ที่อยู่'}
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <BsGeoAlt size={12} className="opacity-70" />
                    {language === 'en' ? 'Nonthaburi, TH' : 'นนทบุรี, ไทย'}
                  </div>
                </div>
                {/* Class */}
                <div>
                  <div className={`text-[10px] font-mono uppercase opacity-50 mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {language === 'en' ? 'CLASS' : 'ระดับชั้น'}
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <BsMortarboard size={12} className="opacity-70" />
                    {language === 'en' ? 'Senior Year' : 'ปี 4'}
                  </div>
                </div>
                {/* Focus */}
                <div>
                  <div className={`text-[10px] font-mono uppercase opacity-50 mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {language === 'en' ? 'FOCUS' : 'ความสนใจ'}
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    <BsCpu size={12} className="opacity-70" />
                    Web Dev / IoT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </ScrollReveal>
    </section>
  );
};

export default About;