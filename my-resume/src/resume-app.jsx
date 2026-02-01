import React, { useState, useEffect, useRef, useCallback } from 'react';
import profileImg from './assets/profile.png';
// นำเข้า React Icons (Bootstrap Icons)
import {
  BsRobot,
  BsEnvelope, BsTelephone, BsGeoAlt,
  BsFilm, BsPeopleFill, BsHeartPulse,
  BsArrowUp, BsArrowRight, BsTerminal, BsCodeSlash, BsLightningCharge, BsAward, BsBriefcase, BsMap
} from 'react-icons/bs';

// --- UTILS & HOOKS ---
const STORAGE_KEYS = {
  theme: 'resume.darkMode',
  lang: 'resume.language'
};

function storageGet(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const v = window.localStorage.getItem(key);
    if (v === null) return fallback;
    if (typeof fallback === 'boolean') return v === '1';
    return v;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, String(value));
  } catch { /* ignore */ }
}

// --- NEW COMPONENT: TACTICAL CURSOR (Smart Area Detection) ---
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
        @media (pointer: fine) {
          body, a, button, input, textarea { cursor: none !important; }
        }
        .cursor-frame {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          box-sizing: border-box;
          will-change: transform, width, height;
          display: flex;
          align-items: center;
          justify-content: center;
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
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: ${darkMode ? '#22d3ee' : '#0891b2'};
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .cursor-locked .cursor-corner {
          opacity: 1;
        }
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

// --- EXISTING COMPONENTS ---

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ease-out will-change-transform ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const ShinyText = ({ text, disabled = false, speed = 3, className = '' }) => {
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

const Magnet = ({ children, padding = 20, disabled = false, magnetStrength = 20 }) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current || disabled) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

    if (dist < (width / 2 + padding)) {
      setIsActive(true);
      const offsetX = (e.clientX - centerX) / magnetStrength;
      const offsetY = (e.clientY - centerY) / magnetStrength;
      setPosition({ x: offsetX, y: offsetY });
    } else {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => { setIsActive(false); setPosition({ x: 0, y: 0 }); };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={ref} onMouseLeave={handleMouseLeave} className="magnet-target" style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, transition: isActive ? 'transform 0.1s ease-out' : 'transform 0.5s ease-in-out', display: 'inline-block' }}>
      {children}
    </div>
  );
};

const PixelBlast = ({ colors, gap = 12, speed = 0.08 }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let mouse = { x: undefined, y: undefined };
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; initParticles(); }
    };
    class Particle {
      constructor(x, y, color) { this.x = x; this.y = y; this.originX = x; this.originY = y; this.color = color; this.size = Math.floor(Math.random() * 3 + 1); this.vx = 0; this.vy = 0; this.friction = 0.92; this.ease = speed; }
      draw() { ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.size, this.size); }
      update() {
        const dx = mouse.x - this.x; const dy = mouse.y - this.y; const distance = Math.sqrt(dx * dx + dy * dy); const forceDistance = 120; const force = (forceDistance - distance) / forceDistance; const angle = Math.atan2(dy, dx);
        if (distance < forceDistance) { const pushX = Math.cos(angle) * force * 30; const pushY = Math.sin(angle) * force * 30; this.vx -= pushX; this.vy -= pushY; }
        this.vx += (this.originX - this.x) * this.ease; this.vy += (this.originY - this.y) * this.ease; this.vx *= this.friction; this.vy *= this.friction; this.x += this.vx; this.y += this.vy; this.draw();
      }
    }
    const initParticles = () => {
      particles = []; const colCount = Math.floor(canvas.width / gap); const rowCount = Math.floor(canvas.height / gap);
      for (let i = 0; i < colCount; i++) { for (let j = 0; j < rowCount; j++) { const x = i * gap + gap / 2; const y = j * gap + gap / 2; const color = colors[Math.floor(Math.random() * colors.length)]; particles.push(new Particle(x, y, color)); } }
    };
    const animate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => p.update()); animationFrameId = requestAnimationFrame(animate); };
    const handleMouseMove = (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; };
    const handleMouseLeave = () => { mouse.x = undefined; mouse.y = undefined; };
    window.addEventListener("resize", resizeCanvas); canvas.addEventListener("mousemove", handleMouseMove); canvas.addEventListener("mouseleave", handleMouseLeave);
    resizeCanvas(); animate();
    return () => { window.removeEventListener("resize", resizeCanvas); canvas.removeEventListener("mousemove", handleMouseMove); canvas.removeEventListener("mouseleave", handleMouseLeave); cancelAnimationFrame(animationFrameId); };
  }, [colors, gap, speed]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" style={{ opacity: 0.5 }} />;
};

const DecryptedText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => text.split("").map((letter, index) => { if (index < iteration) return text[index]; return chars[Math.floor(Math.random() * chars.length)]; }).join(""));
      if (iteration >= text.length) clearInterval(interval); iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text, isHovered]);
  return <span className={className} onMouseEnter={() => setIsHovered(!isHovered)}>{displayText}</span>;
};

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(6, 182, 212, 0.15)", darkMode }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const handleMouseMove = (e) => { if (!divRef.current) return; const rect = divRef.current.getBoundingClientRect(); setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top }); };
  const handleMouseEnter = () => setOpacity(1); const handleMouseLeave = () => setOpacity(0);
  const themeClasses = darkMode ? "border-neutral-800 bg-neutral-900/50 shadow-none" : "border-slate-200 bg-white/70 shadow-sm hover:shadow-md";
  return (
    <div ref={divRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${themeClasses} ${className}`}>
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300" style={{ opacity, background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)` }} />
      <div className="relative h-full">{children}</div>
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-500/30"></div><div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-500/30"></div><div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-500/30"></div>
    </div>
  );
};

// --- MAIN APP ---

export default function ResumeApp() {
  const [activeSection, setActiveSection] = useState('about');
  const [darkMode, setDarkMode] = useState(() => storageGet(STORAGE_KEYS.theme, true));
  const [language, setLanguage] = useState(() => storageGet(STORAGE_KEYS.lang, 'en'));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  // NEW STATE: Map Modal
  const [mapQuery, setMapQuery] = useState(null);

  const pixelColors = darkMode
    ? ['#22d3ee', '#34d399', '#ffffff', '#0ea5e9']
    : ['#0891b2', '#059669', '#64748b', '#0369a1'];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { storageSet(STORAGE_KEYS.theme, darkMode ? '1' : '0'); }, [darkMode]);
  useEffect(() => { storageSet(STORAGE_KEYS.lang, language); }, [language]);

  useEffect(() => { const timer = setTimeout(() => { setLoading(false); }, 2000); return () => clearTimeout(timer); }, []);

  useEffect(() => {
    if (loading) return;
    const rolesData = { en: ["AI Engineer", "Software Engineer", "Backend Developer", "DevOps", "Frontend Developer"], th: ["วิศวกร AI", "วิศวกรซอฟต์แวร์", "นักพัฒนา Backend", "DevOps", "นักพัฒนา Frontend"] };
    const currentRoles = rolesData[language] || rolesData.en;
    let roleIndex = 0; let charIndex = 0; let isDeleting = false; let timer;
    const type = () => {
      if (roleIndex >= currentRoles.length) roleIndex = 0;
      const currentRole = currentRoles[roleIndex]; const prefix = "> ";
      if (isDeleting) { setTypedText(prefix + currentRole.substring(0, charIndex)); charIndex--; }
      else { setTypedText(prefix + currentRole.substring(0, charIndex + 1)); charIndex++; }
      let speed = 150; if (isDeleting) speed = 50;
      if (!isDeleting && charIndex === currentRole.length) { speed = 4000; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % currentRoles.length; speed = 1000; }
      timer = setTimeout(type, speed);
    };
    type(); return () => clearTimeout(timer);
  }, [loading, language]);

  useEffect(() => {
    if (loading) return;
    // UPDATED: Added 'experience'
    const ids = ['about', 'skills', 'projects', 'education', 'experience', 'internship', 'interests', 'contact'];
    const elements = ids.map((id) => document.getElementById(`section-${id}`)).filter(Boolean);
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter((e) => e.isIntersecting); if (!visible.length) return; setActiveSection(visible[0].target.getAttribute('data-section')); }, { threshold: 0.3 });
    elements.forEach((el) => observer.observe(el)); return () => observer.disconnect();
  }, [loading, language]);

  const scrollToSection = (id) => { setActiveSection(id); const el = document.getElementById(`section-${id}`); if (el) { const offset = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: offset, behavior: 'smooth' }); } };
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const translations = {
    en: {
      availableFor: "SYSTEM: ONLINE / READY FOR INTERNSHIP",
      ctaProjects: "Initialize Projects",
      ctaContact: "Ping Me",
      ctaGithub: "GitHub Repo",
      aboutTitle: "// ABOUT_ME",
      educationTitle: "// EDUCATION_LOG",
      experienceTitle: "// EXPERIENCE_LOG",
      skillsTitle: "// TECHNICAL_CAPABILITIES",
      projectsTitle: "// DEPLOYED_PROJECTS",
      keyHighlights: "Specs:",
      impact: "Outcome:",
      internshipTitle: "// INTERNSHIP_PROTOCOL",
      whatIBring: "Capabilities:",
      interestsTitle: "// BACKGROUND_PROCESSES",
      contactTitle: "// ESTABLISH_CONNECTION",
      contactSubtitle: "Initiate communication protocol...",
      contactName: "Input Name",
      contactEmail: "Input Email",
      contactMessage: "Input Data Packet",
      sendMessage: "Transmit Data",
      messageSent: "Transmission Successful!",
      builtWith: "System architecture: React • Status: Open",
      quote: '"Hardware eventually fails. Software eventually works." - Michael Hartung',
      loading: "SYSTEM BOOT SEQUENCE...",
      // --- NEW TRANSLATIONS ADDED BELOW ---
      btnPlace: "Location",       // ปุ่มแผนที่
      btnViewSpecs: "VIEW SPECS", // ปุ่มดูรายละเอียดโปรเจกต์
      tagDeployed: "DEPLOYED",    // ป้ายแปะบนรูปโปรเจกต์
      modalLocationTitle: "LOCATION_DATA", // หัวข้อใน Modal แผนที่
      loadingLogs: ["BIOS_CHECK... OK", "LOADING_MODULES... OK"], // ข้อความตอนโหลด

      name: "Arunburapha Keoket",
      title: "Electronic Computer Technology Student",
      about: "Fourth-year student in Electronic Computer Technology at King Mongkut's University of Technology North Bangkok. I possess strong learning agility, a solid grasp of programming concepts, and effective teamwork skills. I am currently seeking an internship opportunity in Programming, Web Development, and Database Management, eager to apply my academic knowledge to real-world projects and contribute to organizational success.",
      position: "Seeking Internship Position",
      company: "Available for Internship",
      period: "20 April 2026 - 31 July 2026",
      description: "Targeting sectors: Programming, Web Development, and Database Management. Ready to deploy skills in real-world environments.",
      achievements: ["Polyglot programming capabilities", "IoT System Architecture & Integration", "Full-cycle project deployment", "Rapid algorithmic problem solving"],
      hobbies: [{ title: "Movies", desc: "Enjoy watching diverse genres to analyze narratives and gain new perspectives." }, { title: "Team Collaboration", desc: "Keen interest in studying effective teamwork dynamics and collaborative processes." }, { title: "Self-Improvement", desc: "Prioritize work-life balance and mindfulness activities to ensure mental readiness for productive work." }],
      sections: [{ id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' }, { id: 'projects', label: 'Projects' }, { id: 'education', label: 'Education' }, { id: 'experience', label: 'Experience' }, { id: 'internship', label: 'Internship' }, { id: 'interests', label: 'Interests' }, { id: 'contact', label: 'Contact' }]
    },
    th: {
      availableFor: "สถานะ: ออนไลน์ / พร้อมฝึกงาน",
      ctaProjects: "ดูโปรเจกต์",
      ctaContact: "ติดต่อ",
      ctaGithub: "GitHub",
      aboutTitle: "// เกี่ยวกับฉัน",
      educationTitle: "// ประวัติการศึกษา",
      experienceTitle: "// ประสบการณ์ทำงาน",
      skillsTitle: "// ทักษะทางเทคนิค",
      projectsTitle: "// โปรเจกต์ที่ใช้งานจริง",
      keyHighlights: "สเปค:",
      impact: "ผลลัพธ์:",
      internshipTitle: "// โอกาสฝึกงาน",
      whatIBring: "ความสามารถ:",
      interestsTitle: "// กระบวนการเบื้องหลัง",
      contactTitle: "// สร้างการเชื่อมต่อ",
      contactSubtitle: "เริ่มโปรโตคอลการสื่อสาร...",
      contactName: "ชื่อของคุณ",
      contactEmail: "อีเมล",
      contactMessage: "ข้อมูลที่ต้องการส่ง",
      sendMessage: "ส่งข้อมูล",
      messageSent: "ส่งข้อมูลสำเร็จ!",
      builtWith: "สถาปัตยกรรมระบบ: React • สถานะ: เปิดรับ",
      quote: '"ฮาร์ดแวร์พังได้เสมอ ซอฟต์แวร์ทำงานได้เสมอ (ในที่สุด)"',
      loading: "กำลังบูตระบบ...",
      // --- NEW TRANSLATIONS ADDED BELOW ---
      btnPlace: "ดูแผนที่",       // ภาษาไทย
      btnViewSpecs: "ดูรายละเอียด", // ภาษาไทย
      tagDeployed: "ใช้งานจริง",    // ภาษาไทย
      modalLocationTitle: "พิกัดตำแหน่ง", // ภาษาไทย
      loadingLogs: ["ตรวจสอบไบออส... เรียบร้อย", "กำลังโหลดโมดูล... เรียบร้อย"], // ภาษาไทย

      name: "อรุณบูรพา แก้วเกล็ด",
      title: "นักศึกษาอิเล็กทรอนิกส์คอมพิวเตอร์เทคโนโลยี",
      about: "นักศึกษาชั้นปีที่ 4 สาขาเทคโนโลยีคอมพิวเตอร์อิเล็กทรอนิกส์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ ผมมีทักษะการเรียนรู้ที่รวดเร็ว เข้าใจหลักการเขียนโปรแกรมอย่างลึกซึ้ง และมีทักษะการทำงานเป็นทีมที่ดีเยี่ยม ขณะนี้กำลังมองหาโอกาสฝึกงานในด้านการเขียนโปรแกรม, การพัฒนาเว็บ และการจัดการฐานข้อมูล โดยมีความมุ่งมั่นที่จะนำความรู้ทางวิชาการมาประยุกต์ใช้กับโปรเจกต์จริงเพื่อสร้างความสำเร็จให้กับองค์กร",
      position: "กำลังหาที่ฝึกงาน",
      company: "พร้อมฝึกงาน",
      period: "20 เมษายน 2026 - 31 กรกฎาคม 2026",
      description: "เป้าหมาย: การเขียนโปรแกรม, การพัฒนาเว็บ และการจัดการฐานข้อมูล พร้อมนำทักษะไปใช้ในสภาพแวดล้อมจริง",
      achievements: ["ความสามารถในการเขียนโปรแกรมหลายภาษา", "สถาปัตยกรรมระบบ IoT และการเชื่อมต่อ", "การส่งมอบโปรเจกต์ครบวงจร", "การแก้ปัญหาเชิงอัลกอริทึมอย่างรวดเร็ว"],
      hobbies: [{ title: "ภาพยนตร์", desc: "ชอบดูภาพยนตร์หลากหลายแนวเพื่อวิเคราะห์การเล่าเรื่องและเปิดมุมมองใหม่ๆ" }, { title: "การทำงานร่วมกัน", desc: "สนใจศึกษาพลวัตการทำงานเป็นทีมและกระบวนการทำงานร่วมกันที่มีประสิทธิภาพ" }, { title: "การพัฒนาตนเอง", desc: "ให้ความสำคัญกับสมดุลชีวิตและการฝึกสติเพื่อเตรียมความพร้อมทางจิตใจสำหรับการทำงานที่มีประสิทธิภาพ" }],
      sections: [{ id: 'about', label: 'เกี่ยวกับ' }, { id: 'skills', label: 'ทักษะ' }, { id: 'projects', label: 'โปรเจกต์' }, { id: 'education', label: 'การศึกษา' }, { id: 'experience', label: 'ประสบการณ์' }, { id: 'internship', label: 'ฝึกงาน' }, { id: 'interests', label: 'ความสนใจ' }, { id: 'contact', label: 'ติดต่อ' }]
    }
  };

  const t = translations[language];
  const resumeData = {
    contact: { email: "arunburapha.k@gmail.com", phone: "062-464-5582", location: language === 'en' ? "Nonthaburi, TH" : "นนทบุรี, ไทย" },
    skills: [
      { category: language === 'en' ? "LANGUAGES" : "ภาษา", items: [{ name: "Python", level: 85 }, { name: "Java", level: 75 }, { name: "C", level: 80 }, { name: "SQL", level: 75 }, { name: "PHP", level: 70 }] },
      { category: language === 'en' ? "WEB STACK" : "เว็บ", items: [{ name: "HTML/CSS", level: 90 }, { name: "JavaScript", level: 80 }, { name: "React", level: 75 }, { name: "Node.js", level: 70 }] },
      { category: language === 'en' ? "DATA/BACKEND" : "ฐานข้อมูล", items: [{ name: "SQLite", level: 80 }, { name: "MySQL", level: 80 }, { name: "Firebase", level: 75 }] },
      { category: language === 'en' ? "SPECIALIZED" : "เฉพาะทาง", items: [{ name: "IoT Systems", level: 85 }, { name: "AI/ML", level: 80 }, { name: "Microcontrollers", level: 85 }] }
    ],
    education: [
      { school: language === 'en' ? "KMUTNB" : "มจพ.", degree: language === 'en' ? "B.Ind.Tech (Continuing)" : "อุตสาหกรรมศาสตรบัณฑิต (ต่อเนื่อง)", field: language === 'en' ? "Electronic Computer Tech" : "เทคโนโลยีคอมพิวเตอร์อิเล็กทรอนิกส์", year: "2024 - 2026", courses: ["Computer Programming", "Database Tech", "Web App Dev", "Mobile App Dev", "OOP"] },
      { school: language === 'en' ? "Chanthaburi Tech" : "วท.จันทบุรี", degree: language === 'en' ? "Diploma" : "ปวส.", field: language === 'en' ? "Electronics" : "อิเล็กทรอนิกส์", year: "2022 - 2024", courses: ["Network Systems", "Programming", "Microcontrollers", "PLC"] }
    ],
    // UPDATED: EXPERIENCE DATA
    experience: [
      {
        role: language === 'en' ? "Assistant Technician Intern" : "นักศึกษาฝึกงานผู้ช่วยช่าง",
        company: language === 'en' ? "EV Car (Thailand) Co., Ltd" : "บริษัท อีวี คาร์ (ประเทศไทย) จำกัด",
        description: language === 'en' ? "Assisted in maintenance and service of electric vehicles. Gained hands-on experience with EV systems." : "ปฏิบัติงานผู้ช่วยช่างในการซ่อมบำรุงและบริการรถยนต์ไฟฟ้า เรียนรู้ระบบการทำงานของยานยนต์ไฟฟ้า",
        tag: language === 'en' ? "Internship" : "ฝึกงาน",
        locationQuery: "EV Car Thailand"
      },
      {
        role: language === 'en' ? "Assistant Technician Intern" : "นักศึกษาฝึกงานผู้ช่วยช่าง",
        company: language === 'en' ? "Chiewchan Service Chanthaburi" : "เชี่ยวชาญ เซอร์วิส จันทบุรี",
        description: language === 'en' ? "Service & Spare Parts Center support. Managed inventory and assisted senior technicians." : "สนับสนุนงานศูนย์บริการและคลังอะไหล่ จัดการสต็อกและเป็นผู้ช่วยช่างเทคนิค",
        tag: language === 'en' ? "Internship" : "ฝึกงาน",
        locationQuery: "Chiewchan Service Chanthaburi"
      }
    ],
    projects: [
      {
        name: language === 'en' ? "Sign Language Translation AI" : "AI แปลภาษามือ",
        tech: ["Python", "OpenCV", "TensorFlow", "Mobile"],
        description: language === 'en' ? "Real-time gesture recognition system for healthcare communication." : "ระบบจดจำท่าทางเรียลไทม์เพื่อการสื่อสารทางการแพทย์",
        level: "Bachelor Project",
        // แก้ไข: เพิ่มเงื่อนไขภาษา
        highlights: language === 'en' ? ["95% Accuracy", "Real-time processing", "Android Integration"] : ["ความแม่นยำ 95%", "ประมวลผลเรียลไทม์", "รองรับ Android"],
        impact: language === 'en' ? "Bridging communication gaps in hospitals." : "ช่วยลดช่องว่างการสื่อสารในโรงพยาบาล",
        image: "data:image/svg+xml,..." // (คงเดิม)
      },
      {
        name: language === 'en' ? "IoT Lab Monitor" : "ระบบมอนิเตอร์แล็บ IoT",
        tech: ["ESP32", "Current Sensor", "Firebase", "App"],
        description: language === 'en' ? "Detects electrical usage to monitor lab availability remotely." : "ตรวจจับการใช้ไฟเพื่อดูสถานะห้องแล็บทางไกล",
        level: "Diploma Project",
        // แก้ไข: เพิ่มเงื่อนไขภาษา
        highlights: language === 'en' ? ["Non-invasive sensor", "Real-time DB", "Low latency"] : ["เซ็นเซอร์แบบไม่สัมผัส", "ฐานข้อมูลเรียลไทม์", "ความหน่วงต่ำ"],
        impact: language === 'en' ? "Optimized resource usage." : "ช่วยบริหารจัดการทรัพยากรให้คุ้มค่า",
        image: "data:image/svg+xml,..." // (คงเดิม)
      },
      {
        name: language === 'en' ? "Voice Control System" : "ระบบสั่งงานด้วยเสียง",
        tech: ["Google Assistant", "NodeMCU", "Relay"],
        description: language === 'en' ? "Voice-activated home automation via Google Cloud." : "ระบบบ้านอัจฉริยะสั่งงานด้วยเสียงผ่าน Google Cloud",
        level: "Vocational Project",
        // แก้ไข: เพิ่มเงื่อนไขภาษา
        highlights: language === 'en' ? ["Voice Command", "Cloud Integration", "Safety Cutoff"] : ["สั่งงานด้วยเสียง", "เชื่อมต่อ Cloud", "ระบบตัดไฟนิรภัย"],
        impact: language === 'en' ? "Accessible smart home demo." : "ตัวอย่างบ้านอัจฉริยะที่เข้าถึงได้ง่าย",
        image: "data:image/svg+xml,..." // (คงเดิม)
      }
    ]
  };

  const hobbyIcons = [<BsFilm />, <BsPeopleFill />, <BsHeartPulse />];

  if (loading) {
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
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        body { font-family: 'Chakra Petch', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', 'Chakra Petch', monospace; }
        .bg-grid-pattern { background-size: 40px 40px; background-image: radial-gradient(circle, ${darkMode ? '#334155' : '#cbd5e1'} 1px, transparent 1px); }
        .scroll-progress { background: linear-gradient(90deg, #06b6d4, #10b981); }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#0f172a' : '#f1f5f9'}; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      {/* --- ADD TACTICAL CURSOR HERE --- */}
      <TacticalCursor darkMode={darkMode} />
      {/* ------------------------------- */}

      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-[0.15] z-0"></div>
      <div className="fixed top-0 left-0 h-1 z-[100] scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      <button onClick={scrollToTop} className={`fixed bottom-8 right-8 z-50 p-3 border border-cyan-500 bg-slate-900/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all duration-300 backdrop-blur shadow-[0_0_15px_rgba(6,182,212,0.3)] group ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <BsArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>

      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <Magnet>
          <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')} className={`w-10 h-10 flex items-center justify-center rounded font-mono text-xs border transition-all backdrop-blur ${darkMode ? 'border-slate-700 bg-slate-900/80 text-cyan-400 hover:bg-cyan-900/20' : 'border-slate-300 bg-white/80 text-cyan-600 hover:bg-cyan-50'}`}>
            {language.toUpperCase()}
          </button>
        </Magnet>
        <Magnet>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-10 flex items-center justify-center rounded border transition-all backdrop-blur ${darkMode ? 'border-slate-700 bg-slate-900/80 text-cyan-400 hover:bg-cyan-900/20' : 'border-slate-300 bg-white/80 text-cyan-600 hover:bg-cyan-50'}`}>
            {darkMode ? '☀' : '☾'}
          </button>
        </Magnet>
      </div>

      {/* HERO SECTION */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* PIXEL BLAST LAYER */}
        <div className="absolute inset-0 z-0">
          <PixelBlast colors={pixelColors} gap={20} speed={0.03} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center content-wrapper">
          {/* Left Column: Text Info */}
          <div className="order-2 md:order-1">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-6 backdrop-blur-sm ${darkMode ? 'border-emerald-500/30 bg-emerald-500/10 bg-black/30' : 'border-emerald-600/30 bg-emerald-100 bg-white/30'}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <ShinyText text={t.availableFor} className={darkMode ? 'text-emerald-400' : 'text-emerald-700'} />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
              <span className={`font-mono text-2xl block mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>{t.aboutTitle}</span>
              <DecryptedText text={t.name} className={darkMode ? 'text-white' : 'text-slate-900'} />
            </h1>
            <p className={`text-xl md:text-2xl font-mono mb-6 ${darkMode ? 'text-cyan-500' : 'text-cyan-700'}`}>{t.title}</p>
            <div className={`h-12 flex items-center font-mono text-xl md:text-2xl mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {typedText}<span className="animate-pulse text-cyan-500">_</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Magnet>
                <button onClick={() => scrollToSection('projects')} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded-none border-l-4 border-white transition-all hover:translate-x-1 flex items-center gap-2 shadow-lg">
                  <BsCodeSlash /> {t.ctaProjects}
                </button>
              </Magnet>
              <Magnet>
                <button onClick={() => scrollToSection('contact')} className={`px-8 py-3 border font-mono rounded-none transition-all flex items-center gap-2 backdrop-blur-sm ${darkMode ? 'border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-500 bg-white/5' : 'border-slate-400 hover:border-cyan-600 text-slate-700 hover:text-cyan-700 bg-white/40'}`}>
                  <BsTerminal /> {t.ctaContact}
                </button>
              </Magnet>
            </div>
          </div>

          {/* Right Column: Profile Image */}
          <div className="order-1 md:order-2 relative flex justify-center md:justify-end items-center h-full min-h-[400px]">

            {/* 1. Background Aura (Layer ล่างสุด z-0) */}
            <div className="absolute top-1/2 left-1/2 md:left-auto md:right-[5%] -translate-x-1/2 -translate-y-1/2 md:translate-x-0 w-[550px] h-[550px] md:w-[750px] md:h-[750px] pointer-events-none z-0">
              {/* วงแหวนหมุนรอบนอก */}
              <div className={`absolute inset-0 border-2 border-dashed rounded-full animate-[spin_30s_linear_infinite] ${darkMode ? 'border-cyan-500/50' : 'border-cyan-600/40'}`}></div>
              {/* วงแหวนหมุนสวนทางรอบใน */}
              <div className={`absolute inset-[15%] border-4 border-dotted rounded-full animate-[spin_20s_linear_infinite_reverse] ${darkMode ? 'border-emerald-500/40' : 'border-emerald-600/30'}`}></div>
              {/* แสงฟุ้งๆ */}
              <div className="absolute inset-[25%] bg-cyan-500/10 blur-3xl rounded-full"></div>
            </div>

            {/* 2. Image Container (Layer บน z-10) */}
            <div className="relative z-10 w-auto h-[450px] md:h-[600px] flex justify-center items-end">
              {/* ตัวรูปโปรไฟล์ */}
              <img
                src={profileImg}
                alt="Arunburapha Profile"
                className="magnet-target relative w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                style={{
                  // ยังคง Mask Blur ด้านล่างไว้ เพื่อความเนียน
                  maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`sticky top-0 z-40 border-y backdrop-blur-md ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <nav className="flex gap-1 md:gap-4 min-w-max py-2">
            {t.sections.map((section) => (
              <Magnet key={section.id} padding={10} magnetStrength={20}>
                <button onClick={() => scrollToSection(section.id)} className={`px-4 py-2 text-sm font-mono rounded-lg transition-all duration-300 ${activeSection === section.id ? (darkMode ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-cyan-100 text-cyan-700 shadow-sm') : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  {section.label.toUpperCase()}
                </button>
              </Magnet>
            ))}
          </nav>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-32">
        <section id="section-about" data-section="about" className="max-w-4xl">
          <ScrollReveal>
            <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
              <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>01.</span> {t.aboutTitle}
              <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            {/* ADD HOVER CARD CLASS */}
            <div className={`hover-card p-8 border rounded-xl shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white/60'}`}>
              <p className={`text-xl leading-relaxed font-light ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.about}</p>
            </div>
          </ScrollReveal>
        </section>

        <section id="section-skills" data-section="skills">
          <ScrollReveal>
            <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
              <span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>02.</span> {t.skillsTitle}
              <span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumeData.skills.map((category, idx) => (
                // ADD HOVER CARD TO COMPONENT
                <SpotlightCard key={idx} className="p-8 hover-card" darkMode={darkMode}>
                  <h3 className={`font-mono mb-6 border-b pb-2 flex items-center gap-2 ${darkMode ? 'text-cyan-400 border-slate-800' : 'text-cyan-700 border-slate-200'}`}>
                    <BsTerminal className="opacity-70" /> {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.items.map((skill, sIdx) => (
                      <div key={sIdx}>
                        <div className={`flex justify-between text-sm mb-1 font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}><span>{skill.name}</span><span>{skill.level}%</span></div>
                        <div className={`h-1 w-full ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}><div className="h-full bg-emerald-500" style={{ width: `${skill.level}%` }}></div></div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section id="section-projects" data-section="projects">
          <ScrollReveal>
            <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400"><span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>03.</span> {t.projectsTitle}<span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span></h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="grid md:grid-cols-3 gap-6">
              {resumeData.projects.map((project, idx) => (
                // ADD HOVER CARD
                <SpotlightCard key={idx} className="group cursor-pointer hover-card" spotlightColor="rgba(16, 185, 129, 0.15)" darkMode={darkMode}>
                  <div onClick={() => setSelectedProject(project)} className="p-6 h-full flex flex-col">
                    <div className={`mb-4 overflow-hidden rounded border relative ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <img src={project.image} alt={project.name} className={`w-full h-40 object-cover group-hover:opacity-100 transition-all group-hover:scale-105 ${darkMode ? 'opacity-80' : 'opacity-90'}`} />
                      <div className={`absolute bottom-2 right-2 px-2 py-1 text-xs font-mono border rounded flex items-center gap-1 ${darkMode ? 'bg-black/80 text-emerald-400 border-emerald-500/50' : 'bg-white/90 text-emerald-700 border-emerald-600/50'}`}><BsLightningCharge /> DEPLOYED</div>
                    </div>
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${darkMode ? 'text-slate-100 group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-600'}`}>{project.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">{project.tech.map((tech, tIdx) => (<span key={tIdx} className={`text-[10px] uppercase font-mono px-2 py-1 rounded-sm ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>{tech}</span>))}</div>
                    <p className={`text-base mb-4 flex-grow font-light ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{project.description}</p>
                    <Magnet magnetStrength={10}><button className={`w-full py-2 border hover:bg-emerald-500/10 text-xs font-mono transition-all flex justify-center items-center gap-2 ${darkMode ? 'border-slate-700 hover:border-emerald-500 hover:text-emerald-400 text-slate-400' : 'border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-slate-500'}`}>VIEW SPECS <BsArrowRight /></button></Magnet>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section id="section-education" data-section="education">
          <ScrollReveal>
            <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400"><span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>04.</span> {t.educationTitle}<span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span></h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className={`space-y-8 pl-4 border-l ${darkMode ? 'border-slate-800' : 'border-slate-300'}`}>
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className={`absolute -left-[5px] top-2 w-2 h-2 border border-cyan-500 rounded-full ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}></div>
                  {/* ADD HOVER CARD */}
                  <div className={`hover-card p-6 border transition-all rounded-xl ${darkMode ? 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/80' : 'border-slate-200 bg-white/60 hover:bg-white/80'}`}>
                    <div className="flex justify-between items-start mb-2"><h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{edu.school}</h3><span className={`font-mono text-xs border px-2 py-1 rounded ${darkMode ? 'text-emerald-400 border-emerald-900 bg-emerald-900/20' : 'text-emerald-700 border-emerald-200 bg-emerald-100'}`}>{edu.year}</span></div>
                    <p className={`mb-4 ${darkMode ? 'text-cyan-500' : 'text-cyan-700'}`}>{edu.degree} - {edu.field}</p>
                    <div className={`grid md:grid-cols-2 gap-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{edu.courses.map((c, cIdx) => (<div key={cIdx} className="flex items-center gap-2"><span className="text-slate-400 text-xs">►</span> {c}</div>))}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* --- NEW SECTION: EXPERIENCE (ADDED) --- */}
        <section id="section-experience" data-section="experience">
          <ScrollReveal>
            <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400"><span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>05.</span> {t.experienceTitle}<span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span></h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className={`space-y-8 pl-4 border-l ${darkMode ? 'border-slate-800' : 'border-slate-300'}`}>
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className={`absolute -left-[5px] top-2 w-2 h-2 border border-cyan-500 rounded-full ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}></div>
                  <div className={`hover-card p-6 border transition-all rounded-xl ${darkMode ? 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/80' : 'border-slate-200 bg-white/60 hover:bg-white/80'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                      {/* Map Button Integration */}
                      <div className="flex items-center gap-3">
                        <h3 className={`text-xl font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                          <BsBriefcase className="text-cyan-500" /> {exp.company}
                        </h3>
                        {/* ส่วนปุ่ม Map Button Integration ที่แก้ไขแล้ว */}
                        <Magnet magnetStrength={10}>
                          <button
                            onClick={() => setMapQuery(exp.locationQuery)}
                            className={`text-xs px-2 py-1 flex items-center gap-1 rounded border transition-all 
                                    ${darkMode
                                ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20'
                                : 'border-emerald-600/50 text-emerald-600 hover:bg-emerald-100'}`}
                          >
                            <BsMap /> {t.btnPlace}  {/* <-- จุดสำคัญ: ใช้ตัวแปรแทนข้อความ Place */}
                          </button>
                        </Magnet>
                      </div>
                      <span className={`font-mono text-xs border px-2 py-1 rounded mt-2 md:mt-0 ${darkMode ? 'text-emerald-400 border-emerald-900 bg-emerald-900/20' : 'text-emerald-700 border-emerald-200 bg-emerald-100'}`}>{exp.tag}</span>
                    </div>
                    <p className={`mb-2 font-mono ${darkMode ? 'text-cyan-500' : 'text-cyan-700'}`}>{exp.role}</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section id="section-internship" data-section="internship">
          <ScrollReveal>
            <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400"><span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>06.</span> {t.internshipTitle}<span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span></h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            {/* ADD HOVER CARD */}
            <div className={`hover-card p-8 border rounded-xl relative overflow-hidden shadow-sm ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white/60'}`}>
              <div className={`absolute top-0 right-0 p-4 opacity-5 ${darkMode ? 'text-white' : 'text-slate-900'}`}><BsAward size={150} /></div>
              <div className="relative z-10">
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.company}</h3>
                <div className={`inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 font-bold rounded text-sm mb-6 ${darkMode ? 'text-slate-900' : 'text-white'}`}>{t.period}</div>
                <p className={`mb-8 max-w-2xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t.description}</p>
                <h4 className="font-mono text-sm text-slate-500 uppercase mb-4">{t.whatIBring}</h4>
                <div className="grid md:grid-cols-2 gap-4">{t.achievements.map((item, i) => (<div key={i} className={`flex items-center gap-3 p-3 border transition-colors rounded ${darkMode ? 'border-slate-800 bg-slate-950/50 hover:border-cyan-500/50' : 'border-slate-200 bg-white/80 hover:border-cyan-500/50'}`}><span className="text-emerald-500"><BsArrowRight /></span><span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item}</span></div>))}</div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section id="section-interests" data-section="interests">
          <ScrollReveal>
            <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400"><span className={darkMode ? 'text-cyan-500' : 'text-cyan-700'}>07.</span> {t.interestsTitle}<span className={`h-px flex-grow ${darkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></span></h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.hobbies.map((hobby, index) => (
                // ADD HOVER CARD
                <SpotlightCard key={index} className="p-6 h-full text-center hover-card hover:-translate-y-2 transition-transform duration-300" darkMode={darkMode}>
                  <div className={`text-5xl mb-6 flex justify-center ${darkMode ? 'text-cyan-500' : 'text-cyan-600'}`}>{hobbyIcons[index]}</div>
                  <h3 className={`text-xl font-bold font-mono mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{hobby.title}</h3>
                  <p className={`leading-relaxed text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{hobby.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <section id="section-contact" data-section="contact" className="max-w-2xl mx-auto">
          <ScrollReveal>
            {/* ADD HOVER CARD */}
            <div className={`hover-card border rounded shadow-2xl overflow-hidden ${darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-300 bg-white'}`}>
              <div className={`px-4 py-2 border-b flex items-center gap-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div><div className="ml-4 font-mono text-xs text-slate-500">root@arunburapha:~</div>
              </div>
              <div className="p-8 font-mono">
                <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); setTimeout(() => setFormSubmitted(false), 3000); }} className="space-y-4">
                  <div className="flex flex-col"><label className={`text-xs mb-1 flex items-center gap-2 ${darkMode ? 'text-cyan-600' : 'text-cyan-700'}`}><BsTerminal /> {t.contactName}</label><input className={`border p-2 focus:outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-500'}`} type="text" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} /></div>
                  <div className="flex flex-col"><label className={`text-xs mb-1 flex items-center gap-2 ${darkMode ? 'text-cyan-600' : 'text-cyan-700'}`}><BsEnvelope /> {t.contactEmail}</label><input className={`border p-2 focus:outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-500'}`} type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} /></div>
                  <div className="flex flex-col"><label className={`text-xs mb-1 flex items-center gap-2 ${darkMode ? 'text-cyan-600' : 'text-cyan-700'}`}><BsCodeSlash /> {t.contactMessage}</label><textarea rows="4" className={`border p-2 focus:outline-none ${darkMode ? 'bg-slate-900 border-slate-700 text-emerald-400 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-500'}`} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })}></textarea></div>
                  <Magnet magnetStrength={30}><button type="submit" className={`w-full py-3 border font-bold flex justify-center items-center gap-2 transition-all ${darkMode ? 'bg-cyan-900/50 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950' : 'bg-cyan-100 border-cyan-500 text-cyan-800 hover:bg-cyan-500 hover:text-white'}`}>{t.sendMessage} <BsArrowRight /></button></Magnet>
                  {formSubmitted && <div className={`text-center animate-pulse ${darkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>{t.messageSent}</div>}
                </form>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>

      <footer className={`mt-32 border-t py-12 text-center font-mono text-xs ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-300 text-slate-500'}`}>
        <p>{t.builtWith}</p>
        <p className="mt-2 text-slate-600">{t.quote}</p>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div className={`border w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg relative ${darkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-cyan-500/50'}`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProject(null)} className={`absolute top-4 right-4 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}>✕</button>
            <img src={selectedProject.image} className={`w-full h-64 object-cover border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} alt="" />
            <div className="p-8">
              <h2 className={`text-3xl font-bold font-mono mb-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>{selectedProject.name}</h2>
              <p className={`leading-relaxed mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedProject.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div><h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">{t.keyHighlights}</h4><ul className={`space-y-1 text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{selectedProject.highlights.map((h, i) => <li key={i}>+ {h}</li>)}</ul></div>
                <div><h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">{t.impact}</h4><p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{selectedProject.impact}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal (Google Maps Embed) */}
      {mapQuery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setMapQuery(null)}>
          <div className={`border w-full max-w-3xl h-[60vh] rounded-lg relative overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900 border-cyan-500/50' : 'bg-white border-cyan-500/50'}`} onClick={e => e.stopPropagation()}>
            <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-lg font-mono font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>LOCATION_DATA</h3>
              <button onClick={() => setMapQuery(null)} className={`p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>✕</button>
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
      )}
    </div>
  );
}