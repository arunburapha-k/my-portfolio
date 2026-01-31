import React, { useState, useEffect, useRef } from 'react';
// นำเข้า React Icons (Bootstrap Icons)
import { 
  BsRobot, 
  BsEnvelope, BsTelephone, BsGeoAlt, 
  BsFilm, BsPeopleFill, BsHeartPulse, 
  BsArrowUp, BsArrowRight, BsTerminal, BsCodeSlash, BsLightningCharge, BsAward
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

// --- COMPONENTS ---

const DecryptedText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, isHovered]);

  return (
    <span 
      className={className}
      onMouseEnter={() => setIsHovered(!isHovered)}
    >
      {displayText}
    </span>
  );
};

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(6, 182, 212, 0.15)" }) => {
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

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`
        }}
      />
      <div className="relative h-full">{children}</div>
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-500/30"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-cyan-500/30"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-500/30"></div>
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

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const taglines = {
      en: "> Initializing intelligent solutions...",
      th: "> กำลังเริ่มต้นโซลูชันอัจฉริยะ..."
    };
    const text = taglines[language];
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
      } else { clearInterval(timer); }
    }, 50);
    return () => { clearInterval(timer); setTypedText(''); };
  }, [loading, language]);

  useEffect(() => {
    if (loading) return;
    // Updated order of IDs to match the new logical flow
    const ids = ['about', 'skills', 'projects', 'education', 'internship', 'interests', 'contact'];
    const elements = ids.map((id) => document.getElementById(`section-${id}`)).filter(Boolean);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        setActiveSection(visible[0].target.getAttribute('data-section'));
      },
      { threshold: 0.3 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, language]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const translations = {
    en: {
      availableFor: "SYSTEM: ONLINE / READY FOR INTERNSHIP",
      ctaProjects: "Initialize Projects",
      ctaContact: "Ping Me",
      ctaGithub: "GitHub Repo",
      aboutTitle: "// ABOUT_ME",
      educationTitle: "// EDUCATION_LOG",
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
      viewDemo: "Run Demo",
      viewCode: "Source Code",
      builtWith: "System architecture: React • Status: Open",
      quote: '"Hardware eventually fails. Software eventually works." - Michael Hartung',
      loading: "SYSTEM BOOT SEQUENCE...",

      name: "Arunburapha Keoket",
      title: "Electronic Computer Technology Student",
      about: "Fourth-year student in Electronic Computer Technology at King Mongkut's University of Technology North Bangkok. I possess strong learning agility, a solid grasp of programming concepts, and effective teamwork skills. I am currently seeking an internship opportunity in Programming, Web Development, and Database Management, eager to apply my academic knowledge to real-world projects and contribute to organizational success.",

      position: "Seeking Internship Position",
      company: "Available for Internship",
      period: "20 April 2026 - 31 July 2026",
      description: "Targeting sectors: Programming, Web Development, and Database Management. Ready to deploy skills in real-world environments.",

      achievements: [
        "Polyglot programming capabilities",
        "IoT System Architecture & Integration",
        "Full-cycle project deployment",
        "Rapid algorithmic problem solving"
      ],
      hobbies: [
        { title: "Movies", desc: "Enjoy watching diverse genres to analyze narratives and gain new perspectives." },
        { title: "Team Collaboration", desc: "Keen interest in studying effective teamwork dynamics and collaborative processes." },
        { title: "Self-Improvement", desc: "Prioritize work-life balance and mindfulness activities to ensure mental readiness for productive work." }
      ],
      // CORRECTED ORDER for Navbar
      sections: [
        { id: 'about', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'projects', label: 'Projects' },
        { id: 'education', label: 'Education' },
        { id: 'internship', label: 'Internship' },
        { id: 'interests', label: 'Interests' },
        { id: 'contact', label: 'Contact' }
      ]
    },
    th: {
      availableFor: "สถานะ: ออนไลน์ / พร้อมฝึกงาน",
      ctaProjects: "ดูโปรเจกต์",
      ctaContact: "ติดต่อ",
      ctaGithub: "GitHub",
      aboutTitle: "// เกี่ยวกับฉัน",
      educationTitle: "// ประวัติการศึกษา",
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
      viewDemo: "รันเดโม",
      viewCode: "ดูซอร์สโค้ด",
      builtWith: "สถาปัตยกรรมระบบ: React • สถานะ: เปิดรับ",
      quote: '"ฮาร์ดแวร์พังได้เสมอ ซอฟต์แวร์ทำงานได้เสมอ (ในที่สุด)"',
      loading: "กำลังบูตระบบ...",

      name: "อรุณบูรพา แก้วเกล็ด",
      title: "นักศึกษาอิเล็กทรอนิกส์คอมพิวเตอร์เทคโนโลยี",
      about: "นักศึกษาชั้นปีที่ 4 สาขาเทคโนโลยีคอมพิวเตอร์อิเล็กทรอนิกส์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ ผมมีทักษะการเรียนรู้ที่รวดเร็ว เข้าใจหลักการเขียนโปรแกรมอย่างลึกซึ้ง และมีทักษะการทำงานเป็นทีมที่ดีเยี่ยม ขณะนี้กำลังมองหาโอกาสฝึกงานในด้านการเขียนโปรแกรม, การพัฒนาเว็บ และการจัดการฐานข้อมูล โดยมีความมุ่งมั่นที่จะนำความรู้ทางวิชาการมาประยุกต์ใช้กับโปรเจกต์จริงเพื่อสร้างความสำเร็จให้กับองค์กร",

      position: "กำลังหาที่ฝึกงาน",
      company: "พร้อมฝึกงาน",
      period: "20 เมษายน 2026 - 31 กรกฎาคม 2026",
      description: "เป้าหมาย: การเขียนโปรแกรม, การพัฒนาเว็บ และการจัดการฐานข้อมูล พร้อมนำทักษะไปใช้ในสภาพแวดล้อมจริง",

      achievements: [
        "ความสามารถในการเขียนโปรแกรมหลายภาษา",
        "สถาปัตยกรรมระบบ IoT และการเชื่อมต่อ",
        "การส่งมอบโปรเจกต์ครบวงจร",
        "การแก้ปัญหาเชิงอัลกอริทึมอย่างรวดเร็ว"
      ],
      hobbies: [
        { title: "ภาพยนตร์", desc: "ชอบดูภาพยนตร์หลากหลายแนวเพื่อวิเคราะห์การเล่าเรื่องและเปิดมุมมองใหม่ๆ" },
        { title: "การทำงานร่วมกัน", desc: "สนใจศึกษาพลวัตการทำงานเป็นทีมและกระบวนการทำงานร่วมกันที่มีประสิทธิภาพ" },
        { title: "การพัฒนาตนเอง", desc: "ให้ความสำคัญกับสมดุลชีวิตและการฝึกสติเพื่อเตรียมความพร้อมทางจิตใจสำหรับการทำงานที่มีประสิทธิภาพ" }
      ],
      // CORRECTED ORDER for Navbar
      sections: [
        { id: 'about', label: 'เกี่ยวกับ' },
        { id: 'skills', label: 'ทักษะ' },
        { id: 'projects', label: 'โปรเจกต์' },
        { id: 'education', label: 'การศึกษา' },
        { id: 'internship', label: 'ฝึกงาน' },
        { id: 'interests', label: 'ความสนใจ' },
        { id: 'contact', label: 'ติดต่อ' }
      ]
    }
  };

  const t = translations[language];
  const resumeData = {
    contact: { email: "arunburapha.k@gmail.com", phone: "062-464-5582", location: language === 'en' ? "Nonthaburi, TH" : "นนทบุรี, ไทย" },
    skills: [
      {
        category: language === 'en' ? "LANGUAGES" : "ภาษา",
        items: [{ name: "Python", level: 85 }, { name: "Java", level: 75 }, { name: "C", level: 80 }, { name: "SQL", level: 75 }, { name: "PHP", level: 70 }]
      },
      {
        category: language === 'en' ? "WEB STACK" : "เว็บ",
        items: [{ name: "HTML/CSS", level: 90 }, { name: "JavaScript", level: 80 }, { name: "React", level: 75 }, { name: "Node.js", level: 70 }]
      },
      {
        category: language === 'en' ? "DATA/BACKEND" : "ฐานข้อมูล",
        items: [{ name: "SQLite", level: 80 }, { name: "MySQL", level: 80 }, { name: "Firebase", level: 75 }]
      },
      {
        category: language === 'en' ? "SPECIALIZED" : "เฉพาะทาง",
        items: [{ name: "IoT Systems", level: 85 }, { name: "AI/ML", level: 80 }, { name: "Microcontrollers", level: 85 }]
      }
    ],
    education: [
      {
        school: language === 'en' ? "KMUTNB" : "มจพ.",
        degree: language === 'en' ? "B.Ind.Tech (Continuing)" : "อุตสาหกรรมศาสตรบัณฑิต (ต่อเนื่อง)",
        field: language === 'en' ? "Electronic Computer Tech" : "เทคโนโลยีคอมพิวเตอร์อิเล็กทรอนิกส์",
        year: "2024 - 2026",
        courses: ["Computer Programming", "Database Tech", "Web App Dev", "Mobile App Dev", "OOP"]
      },
      {
        school: language === 'en' ? "Chanthaburi Tech" : "วท.จันทบุรี",
        degree: language === 'en' ? "Diploma" : "ปวส.",
        field: language === 'en' ? "Electronics" : "อิเล็กทรอนิกส์",
        year: "2022 - 2024",
        courses: ["Network Systems", "Programming", "Microcontrollers", "PLC"]
      }
    ],
    projects: [
      {
        name: language === 'en' ? "Sign Language Translation AI" : "AI แปลภาษามือ",
        tech: ["Python", "OpenCV", "TensorFlow", "Mobile"],
        description: language === 'en' ? "Real-time gesture recognition system for healthcare communication." : "ระบบจดจำท่าทางเรียลไทม์เพื่อการสื่อสารทางการแพทย์",
        level: "Bachelor Project",
        highlights: ["95% Accuracy", "Real-time processing", "Android Integration"],
        impact: "Bridging communication gaps in hospitals.",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230ea5e9;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2310b981;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='%230f172a' width='400' height='300'/%3E%3Crect fill='url(%23g1)' x='50' y='50' width='300' height='200' rx='10' opacity='0.2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='40' fill='%2322d3ee'%3EAI_HAND_RECOGNITION%3C/text%3E%3C/svg%3E"
      },
      {
        name: language === 'en' ? "IoT Lab Monitor" : "ระบบมอนิเตอร์แล็บ IoT",
        tech: ["ESP32", "Current Sensor", "Firebase", "App"],
        description: language === 'en' ? "Detects electrical usage to monitor lab availability remotely." : "ตรวจจับการใช้ไฟเพื่อดูสถานะห้องแล็บทางไกล",
        level: "Diploma Project",
        highlights: ["Non-invasive sensor", "Real-time DB", "Low latency"],
        impact: "Optimized resource usage.",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f172a' width='400' height='300'/%3E%3Ccircle cx='200' cy='150' r='60' stroke='%2310b981' stroke-width='4' fill='none'/%3E%3Cpath d='M170 150 L200 180 L230 120' stroke='%2310b981' stroke-width='4' fill='none'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='24' fill='%2310b981'%3EIOT_SENSOR_GRID%3C/text%3E%3C/svg%3E"
      },
      {
        name: language === 'en' ? "Voice Control System" : "ระบบสั่งงานด้วยเสียง",
        tech: ["Google Assistant", "NodeMCU", "Relay"],
        description: language === 'en' ? "Voice-activated home automation via Google Cloud." : "ระบบบ้านอัจฉริยะสั่งงานด้วยเสียงผ่าน Google Cloud",
        level: "Vocational Project",
        highlights: ["Voice Command", "Cloud Integration", "Safety Cutoff"],
        impact: "Accessible smart home demo.",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%230f172a' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='60' fill='%23f59e0b'%3E🎙️%3C/text%3E%3Ctext x='50%25' y='70%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='24' fill='%23f59e0b'%3EVOICE_CMD_PROTOCOL%3C/text%3E%3C/svg%3E"
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
            <div className="h-full bg-cyan-500 animate-[width_2s_ease-out_forwards]" style={{width: '100%'}}></div>
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
        
        /* Unified Font: Chakra Petch for everything */
        body { font-family: 'Chakra Petch', sans-serif; }
        
        /* FIX FONT INCONSISTENCY: Add Chakra Petch to font-mono stack so Thai chars render in Tech style */
        .font-mono { font-family: 'JetBrains Mono', 'Chakra Petch', monospace; }

        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: radial-gradient(circle, ${darkMode ? '#334155' : '#cbd5e1'} 1px, transparent 1px);
        }
        .scroll-progress { background: linear-gradient(90deg, #06b6d4, #10b981); }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#0f172a' : '#f1f5f9'}; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none bg-grid-pattern opacity-[0.15] z-0"></div>
      <div className="fixed top-0 left-0 h-1 z-[100] scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* SCROLL TOP */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 border border-cyan-500 bg-slate-900/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 transition-all duration-300 backdrop-blur shadow-[0_0_15px_rgba(6,182,212,0.3)] group ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <BsArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>

      {/* NAV */}
      <div className="fixed top-6 right-6 z-50 flex gap-3">
        <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')} className="p-2 px-4 rounded font-mono text-sm border border-slate-700 bg-slate-900/80 text-cyan-400 hover:bg-cyan-900/20 transition-all backdrop-blur">
          [{language.toUpperCase()}]
        </button>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded border border-slate-700 bg-slate-900/80 text-cyan-400 hover:bg-cyan-900/20 transition-all backdrop-blur">
          {darkMode ? '☀' : '☾'}
        </button>
      </div>

      {/* HERO */}
      <div className="relative z-10 min-h-screen flex items-center justify-center content-wrapper">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.availableFor}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-tight">
              <span className="text-slate-500 font-mono text-2xl block mb-2">{t.aboutTitle}</span>
              <DecryptedText text={t.name} className={`${darkMode ? 'text-white' : 'text-slate-900'}`} />
            </h1>
            <p className="text-xl md:text-2xl text-cyan-500 font-mono mb-6">{t.title}</p>
            <div className="h-8 font-mono text-slate-400 mb-8">
              {typedText}<span className="animate-pulse">_</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollToSection('projects')} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded-none border-l-4 border-white transition-all hover:translate-x-1 flex items-center gap-2">
                <BsCodeSlash /> {t.ctaProjects}
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-8 py-3 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-500 font-mono rounded-none transition-all flex items-center gap-2">
                <BsTerminal /> {t.ctaContact}
              </button>
            </div>
          </div>
          <div className="relative group flex justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-slate-800 p-2 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
              <div className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
              {/* Profile Icon */}
              <BsRobot className="text-9xl text-cyan-500/80 hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <div className={`sticky top-0 z-40 border-y ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
          <nav className="flex gap-1 md:gap-8 min-w-max">
            {t.sections.map((section) => (
              <button key={section.id} onClick={() => scrollToSection(section.id)} className={`px-4 py-4 text-sm font-mono border-b-2 transition-colors ${activeSection === section.id ? 'border-cyan-500 text-cyan-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                {section.label.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-32">
        
        {/* ABOUT (01) */}
        <section id="section-about" data-section="about" className="max-w-4xl">
           <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
            <span className="text-cyan-500">01.</span> {t.aboutTitle}
            <span className="h-px bg-slate-800 flex-grow"></span>
          </h2>
          <div className="p-8 border border-slate-800 bg-slate-900/30 rounded-xl">
             <p className="text-lg leading-relaxed text-slate-600 font-light">{t.about}</p>
          </div>
        </section>

        {/* SKILLS (02) - Reordered to be consistent */}
        <section id="section-skills" data-section="skills">
          <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
            <span className="text-cyan-500">02.</span> {t.skillsTitle}
            <span className="h-px bg-slate-800 flex-grow"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumeData.skills.map((category, idx) => (
              <SpotlightCard key={idx} className="p-8">
                <h3 className="font-mono text-cyan-400 mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <BsTerminal className="opacity-70"/> {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((skill, sIdx) => (
                    <div key={sIdx}>
                      <div className="flex justify-between text-sm mb-1 font-mono text-slate-300">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800">
                        <div className="h-full bg-emerald-500" style={{width: `${skill.level}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* PROJECTS (03) */}
        <section id="section-projects" data-section="projects">
          <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
            <span className="text-cyan-500">03.</span> {t.projectsTitle}
            <span className="h-px bg-slate-800 flex-grow"></span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resumeData.projects.map((project, idx) => (
              <SpotlightCard key={idx} className="group cursor-pointer" spotlightColor="rgba(16, 185, 129, 0.15)">
                <div onClick={() => setSelectedProject(project)} className="p-6 h-full flex flex-col">
                  <div className="mb-4 overflow-hidden rounded border border-slate-800 relative">
                     <img src={project.image} alt={project.name} className="w-full h-40 object-cover opacity-60 group-hover:opacity-100 transition-all group-hover:scale-105" />
                     <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono text-emerald-400 border border-emerald-500/50 rounded flex items-center gap-1">
                       <BsLightningCharge /> DEPLOYED
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, tIdx) => (
                       <span key={tIdx} className="text-[10px] uppercase font-mono px-2 py-1 bg-slate-800 text-slate-300 rounded-sm">
                         {tech}
                       </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-100 mb-4 flex-grow font-light">{project.description}</p>
                  <button className="w-full py-2 border border-slate-700 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-400 text-slate-100 text-xs font-mono transition-all flex justify-center items-center gap-2">
                    VIEW SPECS <BsArrowRight />
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* EDUCATION (04) */}
        <section id="section-education" data-section="education">
          <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
            <span className="text-cyan-500">04.</span> {t.educationTitle}
            <span className="h-px bg-slate-800 flex-grow"></span>
          </h2>
          <div className="space-y-8 pl-4 border-l border-slate-800">
            {resumeData.education.map((edu, idx) => (
               <div key={idx} className="relative pl-8">
                 <div className="absolute -left-[5px] top-2 w-2 h-2 bg-slate-950 border border-cyan-500 rounded-full"></div>
                 <div className="p-6 border border-slate-800 bg-slate-900/30 hover:bg-slate-900/80 transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl text-white font-semibold">{edu.school}</h3>
                       <span className="font-mono text-xs text-emerald-400 border border-emerald-900 bg-emerald-900/20 px-2 py-1">{edu.year}</span>
                    </div>
                    <p className="text-cyan-500 mb-4">{edu.degree} - {edu.field}</p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-100">
                      {edu.courses.map((c, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2">
                          <span className="text-slate-300 text-xs">►</span> {c}
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </section>

        {/* INTERNSHIP (05) */}
        <section id="section-internship" data-section="internship">
           <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
            <span className="text-cyan-500">05.</span> {t.internshipTitle}
            <span className="h-px bg-slate-800 flex-grow"></span>
          </h2>
          <div className="p-8 border border-slate-800 bg-slate-900/30 rounded-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <BsAward size={150} />
             </div>
             <div className="relative z-10">
               <h3 className="text-2xl font-bold text-white mb-2">{t.company}</h3>
               <div className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-bold rounded text-sm mb-6">
                 {t.period}
               </div>
               <p className="text-slate-100 mb-8 max-w-2xl">{t.description}</p>
               <h4 className="font-mono text-sm text-slate-500 uppercase mb-4">{t.whatIBring}</h4>
               <div className="grid md:grid-cols-2 gap-4">
                 {t.achievements.map((item, i) => (
                   <div key={i} className="flex items-center gap-3 p-3 border border-slate-800 bg-slate-950/50 hover:border-cyan-500/50 transition-colors">
                     <span className="text-emerald-500"><BsArrowRight/></span>
                     <span className="text-slate-300 text-sm">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </section>

        {/* INTERESTS (06) */}
        <section id="section-interests" data-section="interests">
          <h2 className="font-mono text-3xl mb-12 flex items-center gap-4 text-slate-400">
            <span className="text-cyan-500">06.</span> {t.interestsTitle}
            <span className="h-px bg-slate-800 flex-grow"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.hobbies.map((hobby, index) => (
              <SpotlightCard key={index} className="p-6 h-full text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-6 text-cyan-500 flex justify-center">
                  {hobbyIcons[index]}
                </div>
                <h3 className="text-xl font-bold font-mono text-white mb-4 text-cyan-400">{hobby.title}</h3>
                <p className="text-slate-100 leading-relaxed text-sm">{hobby.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="section-contact" data-section="contact" className="max-w-2xl mx-auto">
           <div className="border border-slate-700 bg-slate-950 rounded shadow-2xl overflow-hidden">
             <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <div className="ml-4 font-mono text-xs text-slate-500">root@arunburapha:~</div>
             </div>
             <div className="p-8 font-mono">
                <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); setTimeout(() => setFormSubmitted(false), 3000); }} className="space-y-4">
                   <div className="flex flex-col">
                     <label className="text-xs text-cyan-600 mb-1 flex items-center gap-2"><BsTerminal/> {t.contactName}</label>
                     <input className="bg-slate-900 border border-slate-700 p-2 text-emerald-400 focus:border-cyan-500 focus:outline-none" type="text" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                   </div>
                   <div className="flex flex-col">
                     <label className="text-xs text-cyan-600 mb-1 flex items-center gap-2"><BsEnvelope/> {t.contactEmail}</label>
                     <input className="bg-slate-900 border border-slate-700 p-2 text-emerald-400 focus:border-cyan-500 focus:outline-none" type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                   </div>
                   <div className="flex flex-col">
                     <label className="text-xs text-cyan-600 mb-1 flex items-center gap-2"><BsCodeSlash/> {t.contactMessage}</label>
                     <textarea rows="4" className="bg-slate-900 border border-slate-700 p-2 text-emerald-400 focus:border-cyan-500 focus:outline-none" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}></textarea>
                   </div>
                   <button type="submit" className="w-full py-3 bg-cyan-900/50 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all font-bold flex justify-center items-center gap-2">
                     {t.sendMessage} <BsArrowRight />
                   </button>
                   {formSubmitted && <div className="text-center text-emerald-500 animate-pulse">{t.messageSent}</div>}
                </form>
             </div>
           </div>
        </section>

      </div>
      
      {/* FOOTER */}
      <footer className="mt-32 border-t border-slate-800 py-12 text-center text-slate-500 font-mono text-xs">
        <p>{t.builtWith}</p>
        <p className="mt-2 text-slate-600">{t.quote}</p>
      </footer>
      
      {/* MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div className="bg-slate-900 border border-cyan-500/50 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <img src={selectedProject.image} className="w-full h-64 object-cover border-b border-slate-800" alt="" />
            <div className="p-8">
              <h2 className="text-3xl font-bold font-mono text-cyan-400 mb-4">{selectedProject.name}</h2>
              <p className="text-slate-300 leading-relaxed mb-6">{selectedProject.description}</p>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">{t.keyHighlights}</h4>
                   <ul className="space-y-1 text-sm text-emerald-400">
                     {selectedProject.highlights.map((h, i) => <li key={i}>+ {h}</li>)}
                   </ul>
                 </div>
                 <div>
                   <h4 className="text-xs font-mono text-slate-500 mb-2 uppercase">{t.impact}</h4>
                   <p className="text-sm text-slate-300">{selectedProject.impact}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}