import React, { useState } from 'react';

const Magnet = ({ children, disabled = false, magnetStrength = 20 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (disabled) return;
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const offsetX = (clientX - centerX) / magnetStrength;
    const offsetY = (clientY - centerY) / magnetStrength;

    setPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="magnet-target inline-block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

export default Magnet;