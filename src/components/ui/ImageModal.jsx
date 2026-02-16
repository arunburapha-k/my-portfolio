import React, { useEffect, useState } from 'react';
import { BsX, BsZoomIn, BsZoomOut, BsDownload } from 'react-icons/bs';

const ImageModal = ({ imageSrc, onClose, darkMode }) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Reset ค่าเมื่อเปิดรูปใหม่
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [imageSrc]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, scale]); // เพิ่ม scale dependency เพื่อให้ค่าไม่อัปเดตผิด

  if (!imageSrc) return null;

  // --- Zoom Functions ---
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3)); // Max zoom 3x
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, 1); // Min zoom 1x
      if (newScale === 1) setPosition({ x: 0, y: 0 }); // Reset position ถ้าซูมออกสุด
      return newScale;
    });
  };

  // --- Drag Functions (ใช้เมาส์ลากรูปตอนซูม) ---
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- Download Function ---
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = imageSrc.split('/').pop(); // ใช้ชื่อไฟล์เดิม
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden"
      onClick={onClose}
    >
      {/* --- Toolbar (ปุ่มควบคุม) --- */}
      <div 
        className="absolute top-4 right-4 z-20 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <button onClick={handleZoomOut} className="p-2 hover:text-cyan-500 transition-colors" title="Zoom Out"><BsZoomOut size={20} /></button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-2 hover:text-cyan-500 transition-colors" title="Zoom In"><BsZoomIn size={20} /></button>
        </div>

        <button 
          onClick={handleDownload}
          className={`p-3 rounded-lg border transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-900'}`}
          title="Download Image"
        >
          <BsDownload size={20} />
        </button>

        <button 
          onClick={onClose}
          className={`p-3 rounded-lg border transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-500 hover:text-white'}`}
          title="Close (Esc)"
        >
          <BsX size={24} />
        </button>
      </div>

      {/* --- Image Container --- */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          src={imageSrc} 
          alt="Transcript Preview" 
          className={`transition-transform duration-200 ease-out max-w-full max-h-full object-contain drop-shadow-2xl select-none
            ${isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'}`}
          style={{ 
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
          onClick={(e) => e.stopPropagation()} 
          onMouseDown={handleMouseDown}
          draggable={false} // ป้องกันการลากไฟล์รูปแบบ Default ของ Browser
        />
      </div>

      {/* Hint Text ด้านล่าง */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-xs font-mono backdrop-blur-sm pointer-events-none">
        Scroll / Drag to Pan • Ctrl + Scroll to Zoom
      </div>
    </div>
  );
};

export default ImageModal;