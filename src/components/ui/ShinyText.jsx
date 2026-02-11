import React from 'react';

const ShinyText = ({ text, speed = 3, className = '' }) => {
  const animationDuration = `${speed}s`;
  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      <span className="relative z-0 block">{text}</span>
      <span
        className="absolute inset-0 z-10 block text-transparent bg-clip-text shiny-text pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
        }}
      >
        {text}
      </span>
      <style>{`@keyframes shine { 0% { background-position: 100%; } 100% { background-position: -100%; } } .shiny-text { animation: shine ${animationDuration} linear infinite; }`}</style>
    </div>
  );
};

export default ShinyText;