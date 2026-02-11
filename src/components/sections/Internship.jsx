import React from 'react';
import { BsAward, BsArrowRight } from 'react-icons/bs';
import ScrollReveal from '../ui/ScrollReveal';

const Internship = ({ darkMode, t }) => {
  return (
    <section id="section-internship" data-section="internship">
      <ScrollReveal>
        <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
          <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>06.</span> {t.internshipTitle}
          <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className={`hover-card p-8 border rounded-xl relative overflow-hidden shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white/60'}`}>
          <div className={`absolute top-0 right-0 p-4 opacity-5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <BsAward size={150} />
          </div>
          <div className="relative z-10">
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              {t.company}
            </h3>
            <div className={`inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 font-bold rounded text-sm mb-6 ${darkMode ? 'text-slate-900' : 'text-white'}`}>
              {t.period}
            </div>
            <p className={`mb-8 max-w-2xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.description}
            </p>
            <h4 className="font-mono text-sm text-slate-500 uppercase mb-4">{t.whatIBring}</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {t.achievements.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 border transition-colors rounded ${darkMode ? 'border-slate-800 bg-slate-950/50 hover:border-cyan-500/50' : 'border-slate-200 bg-white/80 hover:border-cyan-500/50'}`}>
                  <span className="text-emerald-500"><BsArrowRight /></span>
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Internship;