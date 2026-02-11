import React from 'react';
import { BsFilm, BsPeopleFill, BsHeartPulse } from 'react-icons/bs';
import ScrollReveal from '../ui/ScrollReveal';
import SpotlightCard from '../ui/SpotlightCard';

const Interests = ({ darkMode, t }) => {
  // สร้าง Array ไอคอนไว้ภายใน Component นี้เลย
  const hobbyIcons = [<BsFilm />, <BsPeopleFill />, <BsHeartPulse />];

  return (
    <section id="section-interests" data-section="interests">
      <ScrollReveal>
        <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
          <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>07.</span> {t.interestsTitle}
          <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.hobbies.map((hobby, index) => (
            <SpotlightCard key={index} className="p-6 h-full text-center hover-card hover:-translate-y-2 transition-transform duration-300" darkMode={darkMode}>
              <div className={`text-5xl mb-6 flex justify-center ${darkMode ? 'text-cyan-500' : 'text-cyan-600'}`}>
                {hobbyIcons[index]}
              </div>
              <h3 className={`text-xl font-bold font-mono mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {hobby.title}
              </h3>
              <p className={`leading-relaxed text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {hobby.desc}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Interests;