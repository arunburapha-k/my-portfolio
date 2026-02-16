import React from 'react';
import { BsSun, BsMoonStars } from 'react-icons/bs'; // ใช้ BsTranslate ถ้ามี
import Magnet from './Magnet';

const SettingsControls = ({ darkMode, setDarkMode, language, setLanguage }) => {
  return (
    <div className="absolute top-6 right-6 z-50 flex gap-3">
      {/* ปุ่มเปลี่ยนภาษา */}
      <Magnet>
        <button
          onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
          className={`w-10 h-10 flex items-center justify-center rounded font-mono text-base font-bold border transition-all backdrop-blur 
            ${darkMode ? 'border-slate-700 bg-slate-900/80 text-cyan-400 hover:bg-cyan-900/20' : 'border-slate-300 bg-white/80 text-cyan-600 hover:bg-cyan-50'}`}
        >
          <div className="flex flex-col items-center scale-75">
            <span className="text-[20px] font-bold mt-0.5">{language.toUpperCase()}</span>
          </div>
        </button>
      </Magnet>

      {/* ปุ่มเปลี่ยนธีม */}
      <Magnet>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-10 h-10 flex items-center justify-center rounded border transition-all backdrop-blur 
            ${darkMode ? 'border-slate-700 bg-slate-900/80 text-yellow-400 hover:bg-cyan-900/20' : 'border-slate-300 bg-white/80 text-slate-600 hover:bg-cyan-50'}`}
        >
          {darkMode ? <BsSun size={18} /> : <BsMoonStars size={16} />}
        </button>
      </Magnet>
    </div>
  );
};

export default SettingsControls;