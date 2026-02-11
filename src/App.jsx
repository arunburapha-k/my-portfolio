import React, { useState, useEffect } from 'react';

// 1. นำเข้าข้อมูลและเครื่องมือ
import { translations } from './data/translations';
import { getResumeData } from './data/resumeData';
import { storageGet, storageSet, STORAGE_KEYS } from './utils/storage';

// 2. นำเข้า UI Components
import TacticalCursor from './components/ui/TacticalCursor';
import TechAmbienceBackground from './components/ui/TechAmbienceBackground';
import LoadingScreen from './components/ui/LoadingScreen';
import Navbar from './components/ui/Navbar';
import SettingsControls from './components/ui/SettingsControls';
import ScrollToTop from './components/ui/ScrollToTop';
import Footer from './components/ui/Footer';
import ProjectModal from './components/ui/ProjectModal';
import MapModal from './components/ui/MapModal';

// 3. นำเข้า Section Components
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import Internship from './components/sections/Internship';
import Interests from './components/sections/Interests';
import Contact from './components/sections/Contact';

export default function ResumeApp() {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [darkMode, setDarkMode] = useState(() => storageGet(STORAGE_KEYS.theme, true));
  const [language, setLanguage] = useState(() => storageGet(STORAGE_KEYS.lang, 'en'));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mapQuery, setMapQuery] = useState(null);
  const [typedText, setTypedText] = useState('');

  // --- DERIVED DATA ---
  const t = translations[language];
  const resumeData = React.useMemo(() => getResumeData(language), [language]);

  // --- EFFECTS ---
  useEffect(() => { storageSet(STORAGE_KEYS.theme, darkMode ? '1' : '0'); }, [darkMode]);
  useEffect(() => { storageSet(STORAGE_KEYS.lang, language); }, [language]);

  useEffect(() => { 
    const timer = setTimeout(() => { setLoading(false); }, 2000); 
    return () => clearTimeout(timer); 
  }, []);

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

  useEffect(() => {
    if (loading) return;
    const rolesData = { 
      en: ["AI Engineer", "Software Engineer", "Backend Developer", "DevOps", "Frontend Developer"], 
      th: ["วิศวกร AI", "วิศวกรซอฟต์แวร์", "นักพัฒนา Backend", "DevOps", "นักพัฒนา Frontend"] 
    };
    const currentRoles = rolesData[language] || rolesData.en;
    let roleIndex = 0; let charIndex = 0; let isDeleting = false; let timer;
    
    const type = () => {
      if (roleIndex >= currentRoles.length) roleIndex = 0;
      const currentRole = currentRoles[roleIndex]; 
      const prefix = "> ";
      if (isDeleting) { 
        setTypedText(prefix + currentRole.substring(0, charIndex)); 
        charIndex--; 
      } else { 
        setTypedText(prefix + currentRole.substring(0, charIndex + 1)); 
        charIndex++; 
      }
      let speed = 150; 
      if (isDeleting) speed = 50;
      if (!isDeleting && charIndex === currentRole.length) { 
        speed = 4000; isDeleting = true; 
      } else if (isDeleting && charIndex === 0) { 
        isDeleting = false; 
        roleIndex = (roleIndex + 1) % currentRoles.length; 
        speed = 1000; 
      }
      timer = setTimeout(type, speed);
    };
    type(); 
    return () => clearTimeout(timer);
  }, [loading, language]);

  useEffect(() => {
    if (loading) return;
    const ids = ['about', 'skills', 'projects', 'education', 'experience', 'internship', 'interests', 'contact'];
    const elements = ids.map((id) => document.getElementById(`section-${id}`)).filter(Boolean);
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => { 
      const visible = entries.filter((e) => e.isIntersecting); 
      if (!visible.length) return; 
      setActiveSection(visible[0].target.getAttribute('data-section')); 
    }, { threshold: 0.3 });
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

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const getSkillLevel = (level) => {
    if (language === 'en') {
      if (level >= 90) return "Advanced";
      if (level >= 75) return "Upper-Intermediate";
      if (level >= 60) return "Intermediate";
      if (level >= 40) return "Pre-Intermediate";
      return "Beginner";
    } else {
      if (level >= 90) return "เชี่ยวชาญ";
      if (level >= 75) return "ระดับสูง";
      if (level >= 60) return "ระดับกลาง";
      if (level >= 40) return "พื้นฐาน";
      return "เริ่มต้น";
    }
  };

  if (loading) return <LoadingScreen t={t} />;

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

      {/* --- Global UI Elements --- */}
      <TacticalCursor darkMode={darkMode} />
      <TechAmbienceBackground darkMode={darkMode} />
      
      <div className="fixed top-0 left-0 h-1 z-[100] scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      
      <SettingsControls 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        language={language} 
        setLanguage={setLanguage} 
      />

      {/* --- Main Structure Changes Here --- */}
      <div className="relative z-10">
        
        {/* 1. HERO SECTION (วางก่อน Navbar เพื่อให้เต็มจอแรก) */}
        <Hero 
          darkMode={darkMode} 
          t={t} 
          typedText={typedText} 
          scrollToSection={scrollToSection} 
        />

        {/* 2. NAVBAR (วางต่อจาก Hero เพื่อให้ Sticky ทำงานถูกต้อง) */}
        <Navbar 
          t={t} 
          darkMode={darkMode} 
          activeSection={activeSection} 
          scrollToSection={scrollToSection} 
        />

        {/* 3. CONTENT SECTIONS (วางล่างสุด) */}
        <div className="max-w-6xl mx-auto px-6 space-y-32 py-16">
          <About darkMode={darkMode} t={t} language={language} />
          
          <Skills 
            darkMode={darkMode} 
            t={t} 
            resumeData={resumeData} 
            getSkillLevel={getSkillLevel} 
          />
          
          <Projects 
            darkMode={darkMode} 
            t={t} 
            resumeData={resumeData} 
            setSelectedProject={setSelectedProject} 
          />
          
          <Education 
            darkMode={darkMode} 
            t={t} 
            resumeData={resumeData} 
            setMapQuery={setMapQuery} 
          />
          
          <Experience 
            darkMode={darkMode} 
            t={t} 
            resumeData={resumeData} 
            setMapQuery={setMapQuery} 
          />
          
          <Internship darkMode={darkMode} t={t} />
          
          <Interests darkMode={darkMode} t={t} />
          
          <Contact darkMode={darkMode} t={t} />
        </div>
      </div>

      <Footer t={t} darkMode={darkMode} />
      <ScrollToTop show={showScrollTop} scrollToTop={scrollToTop} />

      {/* --- Modals --- */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        darkMode={darkMode} 
        t={t} 
      />
      
      <MapModal 
        mapQuery={mapQuery} 
        onClose={() => setMapQuery(null)} 
        darkMode={darkMode} 
        t={t} 
      />

    </div>
  );
}