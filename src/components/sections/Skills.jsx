import React from 'react';
import { BsCodeSquare, BsLaptop, BsDatabase, BsCpu, BsTerminal } from 'react-icons/bs';
import ScrollReveal from '../ui/ScrollReveal';
import SpotlightCard from '../ui/SpotlightCard';

const Skills = ({ darkMode, t, resumeData, getSkillLevel }) => {
  return (
    <section id="section-skills" data-section="skills">
      <ScrollReveal>
        <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
          <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>02.</span> {t.skillsTitle}
          <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeData.skills.map((category, idx) => {
            // เลือกไอคอนตามหมวดหมู่
            const CategoryIcon = [BsCodeSquare, BsLaptop, BsDatabase, BsCpu][idx] || BsTerminal;
            return (
              <SpotlightCard key={idx} className="p-8 hover-card" darkMode={darkMode}>
                <h3 className={`font-mono mb-6 border-b pb-2 flex items-center gap-2 ${darkMode ? 'text-cyan-400 border-slate-800' : 'text-cyan-700 border-slate-200'}`}>
                  <CategoryIcon className="opacity-70" size={20} />
                  {category.category}
                </h3>
                <div className="space-y-5">
                  {category.items.map((skill, sIdx) => (
                    <div key={sIdx}>
                      <div className={`flex justify-between items-end mb-2 font-mono`}>
                        <span className={`text-base ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {skill.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded border 
                          ${darkMode
                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                            : 'text-emerald-700 border-emerald-600/30 bg-emerald-100'
                          }`}>
                          {getSkillLevel(skill.level)}
                        </span>
                      </div>
                      <div className={`h-1.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Skills;