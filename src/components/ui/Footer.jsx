import React from 'react';

const Footer = ({ t, darkMode }) => {
  return (
    <footer className={`mt-32 border-t py-12 text-center font-mono text-xs ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-500'}`}>
      <p>{t.builtWith}</p>
      <p className="mt-2 text-slate-600">{t.quote}</p>
    </footer>
  );
};

export default Footer;