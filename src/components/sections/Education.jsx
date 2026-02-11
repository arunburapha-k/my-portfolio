import React from 'react';
import { BsMap, BsCaretRightFill } from 'react-icons/bs';
import ScrollReveal from '../ui/ScrollReveal';
import Magnet from '../ui/Magnet';

const Education = ({ darkMode, t, resumeData, setMapQuery }) => {
  return (
    <section id="section-education" data-section="education">
      <ScrollReveal>
        <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
          <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>04.</span> {t.educationTitle}
          <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className={`space-y-8 pl-4 border-l ${darkMode ? 'border-slate-800' : 'border-slate-300'}`}>
          {resumeData.education.map((edu, idx) => (
            <div key={idx} className="relative pl-8">
              <div className={`absolute -left-[5px] top-2 w-2 h-2 border border-cyan-500 rounded-full ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}></div>

              <div className={`hover-card p-6 border transition-all rounded-xl ${darkMode ? 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/80' : 'border-slate-200 bg-white/60 hover:bg-white/80'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {edu.school}
                    </h3>
                    <Magnet magnetStrength={10}>
                      <button
                        onClick={() => setMapQuery(edu.locationQuery)}
                        className={`text-xs px-2 py-1 flex items-center gap-1 rounded border transition-all 
                                ${darkMode ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20' : 'border-emerald-600/50 text-emerald-600 hover:bg-emerald-100'}`}
                      >
                        <BsMap /> {t.btnPlace}
                      </button>
                    </Magnet>
                  </div>
                  <span className={`font-mono text-xs border px-2 py-1 rounded ${darkMode ? 'text-emerald-400 border-emerald-900 bg-emerald-900/20' : 'text-emerald-700 border-emerald-200 bg-emerald-100'}`}>
                    {edu.year}
                  </span>
                </div>
                <p className={`mb-4 ${darkMode ? 'text-cyan-500' : 'text-cyan-700'}`}>
                  {edu.degree} - {edu.field}
                </p>
                <div className={`grid md:grid-cols-2 gap-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {edu.courses.map((c, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs"><BsCaretRightFill /></span> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Education;