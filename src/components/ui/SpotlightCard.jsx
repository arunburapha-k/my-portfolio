import React, { useRef, useState } from 'react';

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(6, 182, 212, 0.15)", darkMode }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const themeClasses = darkMode
    ? "border-neutral-800 bg-neutral-900/50 shadow-none"
    : "border-slate-200 bg-white/70 shadow-sm hover:shadow-md";

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${themeClasses} ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`
        }}
      />
      <div className="relative h-full">{children}</div>
      
      {/* เส้นขอบมุม 4 ด้านเพื่อความเท่ */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-500/30"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-500/30"></div>
    </div>
  );
};

export default SpotlightCard;