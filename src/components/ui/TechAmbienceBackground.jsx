import React, { useMemo } from 'react'; // 1. อย่าลืม import useMemo

const TechAmbienceBackground = ({ darkMode }) => {
  
  // 2. ใช้ useMemo ครอบส่วนการสร้าง shapes
  // ใส่ [] เป็น dependency array เพื่อให้คำนวณแค่ครั้งเดียวตอนเริ่มโหลดหน้าเว็บ
  const shapes = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 20}s`,
      symbol: Math.random() > 0.6 ? '+' : (Math.random() > 0.5 ? '×' : '•'),
      size: Math.random() > 0.5 ? 'text-xl' : 'text-sm'
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-100px) rotate(45deg); opacity: 0; }
        }
        .tech-shape { animation: floatUp linear infinite; }
      `}</style>

      {/* Background Gradient Layer */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${darkMode ? 'bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,0),_rgba(17,24,39,1))]' : 'bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0),_rgba(255,255,255,1))]'}`}></div>
      
      {/* Glowing Orbs */}
      <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-10 animate-pulse ${darkMode ? 'bg-cyan-600' : 'bg-cyan-300'}`}></div>
      <div className={`absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10 animate-pulse ${darkMode ? 'bg-blue-600' : 'bg-blue-300'}`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-10 animate-pulse ${darkMode ? 'bg-emerald-600' : 'bg-emerald-300'}`} style={{ animationDelay: '4s' }}></div>

      {/* Shapes Rendering */}
      {shapes.map((shape, i) => (
        <div
          key={i}
          className={`tech-shape absolute font-mono font-bold ${shape.size} ${darkMode ? 'text-slate-700' : 'text-slate-300'}`}
          style={{
            left: shape.left,
            top: shape.top,
            animationDuration: shape.duration,
            animationDelay: shape.animationDelay
          }}
        >
          {shape.symbol}
        </div>
      ))}
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.07]"></div>
    </div>
  );
};

export default TechAmbienceBackground;