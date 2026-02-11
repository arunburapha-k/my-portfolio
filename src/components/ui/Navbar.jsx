import React from 'react';
import Magnet from './Magnet';

const Navbar = ({ t, darkMode, activeSection, scrollToSection }) => {
  return (
    <div className={`sticky top-0 z-40 border-y backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
      <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
        <nav className="flex gap-1 md:gap-4 min-w-max py-2">
          {t.sections.map((section) => (
            <Magnet key={section.id} padding={10} magnetStrength={20}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 text-sm font-mono rounded-lg transition-all duration-300 
                  ${activeSection === section.id 
                    ? (darkMode ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-cyan-100 text-cyan-700 shadow-sm') 
                    : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                {section.label.toUpperCase()}
              </button>
            </Magnet>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;