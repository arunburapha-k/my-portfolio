import React from 'react';
import { BsLightningCharge, BsArrowRight } from 'react-icons/bs';
import ScrollReveal from '../ui/ScrollReveal';
import SpotlightCard from '../ui/SpotlightCard';
import Magnet from '../ui/Magnet';

const Projects = ({ darkMode, t, resumeData, setSelectedProject }) => {
  return (
    <section id="section-projects" data-section="projects">
      <ScrollReveal>
        <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
          <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>03.</span> {t.projectsTitle}
          <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <div className="grid md:grid-cols-3 gap-6">
          {resumeData.projects.map((project, idx) => (
            <SpotlightCard key={idx} className="group cursor-pointer hover-card" spotlightColor="rgba(16, 185, 129, 0.15)" darkMode={darkMode}>
              <div onClick={() => setSelectedProject(project)} className="p-6 h-full flex flex-col">
                <div className={`mb-4 overflow-hidden rounded border relative ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <img src={project.image} alt={project.name} className={`w-full h-40 object-cover group-hover:opacity-100 transition-all group-hover:scale-105 ${darkMode ? 'opacity-80' : 'opacity-90'}`} />
                  <div className={`absolute bottom-2 right-2 px-2 py-1 text-xs font-mono border rounded flex items-center gap-1 ${darkMode ? 'bg-black/80 text-emerald-400 border-emerald-500/50' : 'bg-white/90 text-emerald-700 border-emerald-600/50'}`}>
                    <BsLightningCharge /> DEPLOYED
                  </div>
                </div>
                <h3 className={`text-xl font-bold mb-2 transition-colors ${darkMode ? 'text-slate-100 group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-600'}`}>
                  {project.name}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, tIdx) => (
                    <span key={tIdx} className={`text-[10px] uppercase font-mono px-2 py-1 rounded-sm ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <p className={`text-base mb-4 flex-grow font-light ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {project.description}
                </p>
                <Magnet magnetStrength={10}>
                  <button className={`w-full py-2 border hover:bg-emerald-500/10 text-xs font-mono transition-all flex justify-center items-center gap-2 ${darkMode ? 'border-slate-700 hover:border-emerald-500 hover:text-emerald-400 text-slate-400' : 'border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-slate-500'}`}>
                    VIEW SPECS <BsArrowRight />
                  </button>
                </Magnet>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Projects;