import React from 'react';

const LoadingScreen = ({ t }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 font-mono text-cyan-500 z-50">
      <div className="w-80">
        <div className="mb-2 text-xs opacity-50">BIOS_CHECK... OK</div>
        <div className="mb-2 text-xs opacity-50">LOADING_MODULES... OK</div>
        <div className="h-1 w-full bg-slate-900 rounded overflow-hidden">
          <div className="h-full bg-cyan-500 animate-[width_2s_ease-out_forwards]" style={{ width: '100%' }}></div>
        </div>
        <div className="mt-2 text-center animate-pulse">{t.loading}</div>
      </div>
    </div>
  );
};

export default LoadingScreen;