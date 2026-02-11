import React from 'react';
import { BsXLg, BsCheck2 } from 'react-icons/bs';

const ProjectModal = ({ project, onClose, darkMode, t }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className={`border w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg relative ${darkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-cyan-500/50'}`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className={`absolute top-4 right-4 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}>
          <BsXLg />
        </button>
        <img src={project.image} className={`w-full h-64 object-cover border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} alt={project.name} />
        <div className="p-8">
          <h2 className={`text-3xl font-bold font-mono mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{project.name}</h2>
          <p className={`leading-relaxed mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{project.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">{t.keyHighlights}</h4>
              <ul className={`space-y-1 text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-500"><BsCheck2 size={14} /></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">{t.impact}</h4>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{project.impact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;