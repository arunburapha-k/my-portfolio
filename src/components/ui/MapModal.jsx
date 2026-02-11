import React from 'react';
import { BsXLg } from 'react-icons/bs';

const MapModal = ({ mapQuery, onClose, darkMode, t }) => {
  if (!mapQuery) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className={`border w-full max-w-3xl h-[60vh] rounded-lg relative overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-cyan-500/50'}`} onClick={e => e.stopPropagation()}>
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className={`text-lg font-mono font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{t.modalLocationTitle}</h3>
          <button onClick={onClose} className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <BsXLg />
          </button>
        </div>
        <div className="w-full h-full relative">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            title="Company Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MapModal;