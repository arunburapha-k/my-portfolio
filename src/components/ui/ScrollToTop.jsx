import React from 'react';
import { BsArrowUp } from 'react-icons/bs';

const ScrollToTop = ({ show, scrollToTop }) => {
  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 border border-cyan-500 bg-slate-900/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all duration-300 backdrop-blur shadow-[0_0_15px_rgba(6,182,212,0.3)] group 
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <BsArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
    </button>
  );
};

export default ScrollToTop;