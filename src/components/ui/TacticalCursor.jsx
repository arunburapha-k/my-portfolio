import React, { useState, useEffect, useRef } from 'react';

const TacticalCursor = ({ darkMode }) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const hoveredElementRef = useRef(null);
  const [isClicking, setIsClicking] = useState(false);

  const mouse = useRef({ x: -100, y: -100 });
  const cursor = useRef({ x: -100, y: -100, w: 32, h: 32 });

  useEffect(() => {
    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      let interactable = target.closest(`
        button, a, input, textarea, .magnet-target,
        p, h1, h2, h3, h4, h5, h6, img, li, label,
        .hover-card
      `);

      if (interactable) {
        const parentControl = interactable.closest('button, a, .magnet-target');
        if (parentControl) {
          interactable = parentControl;
        }
      }
      hoveredElementRef.current = interactable;
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let animationFrame;
    const animate = () => {
      let targetX, targetY, targetW, targetH, targetRadius;
      const ease = 0.2;

      if (hoveredElementRef.current) {
        const rect = hoveredElementRef.current.getBoundingClientRect();
        const isCard = hoveredElementRef.current.classList.contains('hover-card') || hoveredElementRef.current.classList.contains('p-8');
        const padding = isCard ? 10 : 20;

        targetW = rect.width + padding;
        targetH = rect.height + padding;
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;

        const computedStyle = window.getComputedStyle(hoveredElementRef.current);
        targetRadius = computedStyle.borderRadius !== '0px' ? computedStyle.borderRadius : '12px';
      } else {
        targetW = 32;
        targetH = 32;
        targetX = mouse.current.x;
        targetY = mouse.current.y;
        targetRadius = "50%";
      }

      cursor.current.x += (targetX - cursor.current.x) * ease;
      cursor.current.y += (targetY - cursor.current.y) * ease;
      cursor.current.w += (targetW - cursor.current.w) * ease;
      cursor.current.h += (targetH - cursor.current.h) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%)`;
        cursorRef.current.style.width = `${cursor.current.w}px`;
        cursorRef.current.style.height = `${cursor.current.h}px`;
        cursorRef.current.style.borderRadius = targetRadius;

        if (hoveredElementRef.current) {
          cursorRef.current.classList.add('cursor-locked');
          cursorRef.current.classList.remove('cursor-idle');
        } else {
          cursorRef.current.classList.remove('cursor-locked');
          cursorRef.current.classList.add('cursor-idle');
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <style>{`
        @media (pointer: fine) { body, a, button, input, textarea { cursor: none !important; } }
        .cursor-frame {
          position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
          box-sizing: border-box; will-change: transform, width, height;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background-color 0.2s, border-radius 0.2s; 
        }
        .cursor-idle {
          border: 2px solid ${darkMode ? 'rgba(34, 211, 238, 0.6)' : 'rgba(8, 145, 178, 0.6)'};
          background-color: transparent;
        }
        .cursor-locked {
          border: 1px dashed ${darkMode ? 'rgba(34, 211, 238, 0.5)' : 'rgba(8, 145, 178, 0.5)'};
          background-color: ${darkMode ? 'rgba(34, 211, 238, 0.03)' : 'rgba(8, 145, 178, 0.03)'};
        }
        .cursor-corner {
          position: absolute; width: 10px; height: 10px;
          border-color: ${darkMode ? '#22d3ee' : '#0891b2'};
          opacity: 0; transition: opacity 0.2s ease;
        }
        .cursor-locked .cursor-corner { opacity: 1; }
        .c-tl { top: -2px; left: -2px; border-top-width: 3px; border-left-width: 3px; border-top-left-radius: 4px; }
        .c-tr { top: -2px; right: -2px; border-top-width: 3px; border-right-width: 3px; border-top-right-radius: 4px; }
        .c-bl { bottom: -2px; left: -2px; border-bottom-width: 3px; border-left-width: 3px; border-bottom-left-radius: 4px; }
        .c-br { bottom: -2px; right: -2px; border-bottom-width: 3px; border-right-width: 3px; border-bottom-right-radius: 4px; }
      `}</style>

      <div ref={cursorRef} className={`cursor-frame ${isClicking ? 'scale-95' : 'scale-100'}`}>
        <div className="cursor-corner c-tl"></div>
        <div className="cursor-corner c-tr"></div>
        <div className="cursor-corner c-bl"></div>
        <div className="cursor-corner c-br"></div>
      </div>
      <div ref={dotRef} className={`fixed top-0 left-0 pointer-events-none z-[10000] w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full mix-blend-difference ${darkMode ? 'bg-cyan-400' : 'bg-cyan-600'}`} />
    </>
  );
};

export default TacticalCursor;