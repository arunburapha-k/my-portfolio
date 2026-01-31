import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ─────────────────────────────────────────────
// CONSTANTS & CONFIG
// ─────────────────────────────────────────────
const STORAGE_KEYS = { theme: 'resume.darkMode', lang: 'resume.language' };
const LOADING_DURATION = 2500;
const COUNTER_DURATION = 2000;
const COUNTER_STEPS = 60;
const TYPING_INTERVAL_MS = 50;
const SCROLL_TOP_THRESHOLD = 300;
const NAV_HEIGHT = 70;

const STAT_TARGETS = { gpa: 3.71, projects: 3, skills: 20, courses: 8 };

const TAGLINES = {
  en: 'Transforming ideas into intelligent solutions through code',
  th: 'แปลงไอเดียเป็นโซลูชันอัจฉริยะผ่านการเขียนโค้ด',
};

const GITHUB_STATS = { contributions: 250, repositories: 12, followers: 45 };

// ─────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────
function storageGet(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const v = window.localStorage.getItem(key);
    if (v === null) return fallback;
    return typeof fallback === 'boolean' ? v === '1' : v;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, String(value));
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────
// i18n DATA
// ─────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    availableFor: 'Available for Internship',
    downloadCV: 'Download CV',
    ctaProjects: 'View Projects',
    ctaContact: 'Contact',
    ctaGithub: 'GitHub',
    aboutTitle: 'About Me',
    statsTitle: 'By The Numbers',
    currentGPA: 'Current GPA',
    majorProjects: 'Major Projects',
    technicalSkills: 'Technical Skills',
    honorCourses: 'Honor Courses',
    techStack: 'tech-stack.sh',
    educationTitle: 'Education',
    keyCourses: 'Key Courses:',
    skillsTitle: 'Technical Skills',
    projectsTitle: 'Featured Projects',
    keyHighlights: 'Key Highlights:',
    impact: 'Impact:',
    internshipTitle: 'Internship Opportunity',
    whatIBring: 'What I Bring:',
    interestsTitle: 'Beyond Code',
    contactTitle: 'Contact Me',
    contactSubtitle: 'Have a question or want to work together?',
    contactName: 'Your Name',
    contactEmail: 'Your Email',
    contactMessage: 'Your Message',
    sendMessage: 'Send Message',
    messageSent: 'Message sent successfully!',
    githubStats: 'GitHub Activity',
    totalContributions: 'Contributions',
    repositories: 'Repositories',
    followers: 'Followers',
    viewDemo: 'View Demo',
    viewCode: 'View Code',
    closeModal: 'Close',
    copyright: '© 2024',
    builtWith: 'Designed & Built with React • Open for opportunities',
    quote: '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
    loading: 'Loading',
    name: 'Arunburapha Keoket',
    title: 'Electronic Computer Technology Student',
    about:
      'Fourth-year student in Electronic Computer Technology at King Mongkut\'s University of Technology North Bangkok. I specialize in creating innovative solutions at the intersection of IoT, AI, and web technologies. With a strong foundation in programming and a passion for continuous learning, I\'m seeking opportunities to contribute to meaningful projects while growing professionally.',
    position: 'Seeking Internship Position',
    company: 'Available for Internship',
    period: 'April 2026 - July 2026',
    description:
      'Looking for opportunities in Programming, Web Development, and Database Management where I can contribute to real-world projects and learn from experienced professionals.',
    quickFacts: [
      '🎓 3.71 GPA at KMUTNB',
      '🏆 3.93 GPA in Diploma',
      '🤖 AI & IoT Enthusiast',
      '💡 3 Major Projects Completed',
    ],
    achievements: [
      'Strong understanding of programming principles across multiple languages',
      'Hands-on experience with IoT systems and AI integration',
      'Proven ability to deliver complete projects from concept to deployment',
      'Quick learner with excellent problem-solving capabilities',
    ],
    hobbies: [
      { icon: '🎬', title: 'Movies', desc: 'Enjoy watching diverse genres to analyze narratives and gain new perspectives' },
      { icon: '🤝', title: 'Team Collaboration', desc: 'Keen interest in studying effective teamwork dynamics and collaborative processes' },
      { icon: '🧘', title: 'Self-Improvement', desc: 'Prioritize work-life balance and mindfulness activities to ensure mental readiness' },
    ],
    sections: [
      { id: 'about', label: 'About' },
      { id: 'stats', label: 'Stats' },
      { id: 'education', label: 'Education' },
      { id: 'skills', label: 'Skills' },
      { id: 'projects', label: 'Projects' },
      { id: 'internship', label: 'Internship' },
      { id: 'interests', label: 'Interests' },
      { id: 'contact', label: 'Contact' },
    ],
  },
  th: {
    availableFor: 'พร้อมฝึกงาน',
    downloadCV: 'ดาวน์โหลด CV',
    ctaProjects: 'ดูโปรเจกต์',
    ctaContact: 'ติดต่อ',
    ctaGithub: 'GitHub',
    aboutTitle: 'เกี่ยวกับฉัน',
    statsTitle: 'สถิติโดยสรุป',
    currentGPA: 'เกรดเฉลี่ยปัจจุบัน',
    majorProjects: 'โปรเจกต์หลัก',
    technicalSkills: 'ทักษะทางเทคนิค',
    honorCourses: 'วิชาที่ได้เกรดดี',
    techStack: 'เทคโนโลยีที่ใช้.sh',
    educationTitle: 'การศึกษา',
    keyCourses: 'วิชาสำคัญ:',
    skillsTitle: 'ทักษะทางเทคนิค',
    projectsTitle: 'โปรเจกต์เด่น',
    keyHighlights: 'จุดเด่น:',
    impact: 'ผลกระทบ:',
    internshipTitle: 'โอกาสฝึกงาน',
    whatIBring: 'สิ่งที่ฉันนำมา:',
    interestsTitle: 'นอกจากการเขียนโค้ด',
    contactTitle: 'ติดต่อฉัน',
    contactSubtitle: 'มีคำถามหรืออยากทำงานร่วมกัน?',
    contactName: 'ชื่อของคุณ',
    contactEmail: 'อีเมลของคุณ',
    contactMessage: 'ข้อความของคุณ',
    sendMessage: 'ส่งข้อความ',
    messageSent: 'ส่งข้อความสำเร็จ!',
    githubStats: 'กิจกรรม GitHub',
    totalContributions: 'การมีส่วนร่วม',
    repositories: 'ที่เก็บโค้ด',
    followers: 'ผู้ติดตาม',
    viewDemo: 'ดูตัวอย่าง',
    viewCode: 'ดูโค้ด',
    closeModal: 'ปิด',
    copyright: '© 2024',
    builtWith: 'ออกแบบและสร้างด้วย React • เปิดรับโอกาส',
    quote: '"โค้ดก็เหมือนมุกตลก เมื่อต้องอธิบาย แสดงว่ามันไม่ดี" - Cory House',
    loading: 'กำลังโหลด',
    name: 'อรุณบูรพา แก้วเกล็ด',
    title: 'นักศึกษาอิเล็กทรอนิกส์คอมพิวเตอร์เทคโนโลยี',
    about:
      'นักศึกษาชั้นปีที่ 4 สาขาอิเล็กทรอนิกส์คอมพิวเตอร์เทคโนโลยี มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ ผมเชี่ยวชาญในการสร้างโซลูชันนวัตกรรมที่ผสานเทคโนโลยี IoT, AI และเว็บ ด้วยพื้นฐานการเขียนโปรแกรมที่แข็งแกร่งและความหลงใหลในการเรียนรู้อย่างต่อเนื่อง ผมกำลังมองหาโอกาสในการมีส่วนร่วมในโปรเจกต์ที่มีความหมายพร้อมกับการเติบโตในสายอาชีพ',
    position: 'กำลังหาที่ฝึกงาน',
    company: 'พร้อมฝึกงาน',
    period: 'เมษายน 2026 - กรกฎาคม 2026',
    description:
      'กำลังมองหาโอกาสในด้าน การเขียนโปรแกรม, การพัฒนาเว็บ และการจัดการฐานข้อมูล ที่สามารถมีส่วนร่วมในโปรเจกต์จริงและเรียนรู้จากผู้เชี่ยวชาญ',
    quickFacts: [
      '🎓 เกรดเฉลี่ย 3.71 ที่ มจพ.',
      '🏆 เกรดเฉลี่ย 3.93 ปวส.',
      '🤖 ชื่นชอบ AI & IoT',
      '💡 ทำโปรเจกต์หลัก 3 โปรเจกต์',
    ],
    achievements: [
      'มีความเข้าใจหลักการเขียนโปรแกรมหลายภาษาเป็นอย่างดี',
      'มีประสบการณ์จริงกับระบบ IoT และการผสานระบบ AI',
      'สามารถส่งมอบโปรเจกต์ที่สมบูรณ์ตั้งแต่แนวคิดจนถึงการใช้งาน',
      'เรียนรู้เร็วและมีความสามารถในการแก้ปัญหาดีเยี่ยม',
    ],
    hobbies: [
      { icon: '🎬', title: 'ภาพยนตร์', desc: 'ชอบดูหนังหลากหลายแนวเพื่อวิเคราะห์เรื่องราวและมุมมองใหม่ๆ' },
      { icon: '🤝', title: 'การทำงานเป็นทีม', desc: 'สนใจศึกษาพลวัตการทำงานเป็นทีมและกระบวนการทำงานร่วมกันที่มีประสิทธิภาพ' },
      { icon: '🧘', title: 'การพัฒนาตนเอง', desc: 'ให้ความสำคัญกับสมดุลชีวิตและกิจกรรมเพื่อความพร้อมทางจิตใจ' },
    ],
    sections: [
      { id: 'about', label: 'เกี่ยวกับ' },
      { id: 'stats', label: 'สถิติ' },
      { id: 'education', label: 'การศึกษา' },
      { id: 'skills', label: 'ทักษะ' },
      { id: 'projects', label: 'โปรเจกต์' },
      { id: 'internship', label: 'ฝึกงาน' },
      { id: 'interests', label: 'ความสนใจ' },
      { id: 'contact', label: 'ติดต่อ' },
    ],
  },
};

// ─────────────────────────────────────────────
// RESUME DATA (language-dependent)
// ─────────────────────────────────────────────
function buildResumeData(lang) {
  const en = lang === 'en';

  return {
    contact: {
      email: 'arunburapha.k@gmail.com',
      phone: '062-464-5582',
      location: en ? 'Nonthaburi, Thailand' : 'นนทบุรี, ไทย',
    },
    skills: [
      {
        category: en ? 'Programming Languages' : 'ภาษาโปรแกรมมิ่ง',
        items: [
          { name: 'Python', level: 85 },
          { name: 'Java', level: 75 },
          { name: 'C', level: 80 },
          { name: 'SQL', level: 75 },
          { name: 'PHP', level: 70 },
        ],
      },
      {
        category: en ? 'Web Development' : 'พัฒนาเว็บ',
        items: [
          { name: 'HTML', level: 90 },
          { name: 'CSS', level: 85 },
          { name: 'JavaScript', level: 80 },
          { name: en ? 'Web Applications' : 'เว็บแอปพลิเคชัน', level: 85 },
        ],
      },
      {
        category: en ? 'Database & Backend' : 'ฐานข้อมูลและแบ็คเอนด์',
        items: [
          { name: 'SQLite', level: 80 },
          { name: 'MySQL', level: 80 },
          { name: 'Firebase', level: 75 },
          { name: en ? 'Database Design' : 'ออกแบบฐานข้อมูล', level: 85 },
        ],
      },
      {
        category: en ? 'Specialized Skills' : 'ทักษะเฉพาะทาง',
        items: [
          { name: en ? 'IoT Systems' : 'ระบบ IoT', level: 85 },
          { name: 'AI & Machine Learning', level: 80 },
          { name: en ? 'Mobile Development' : 'พัฒนาแอปมือถือ', level: 75 },
          { name: 'OOP', level: 90 },
        ],
      },
      {
        category: en ? 'Hardware & Systems' : 'ฮาร์ดแวร์และระบบ',
        items: [
          { name: en ? 'Microcontrollers' : 'ไมโครคอนโทรลเลอร์', level: 85 },
          { name: en ? 'Network Systems' : 'ระบบเครือข่าย', level: 80 },
          { name: en ? 'IoT Hardware' : 'ฮาร์ดแวร์ IoT', level: 85 },
          { name: 'PLC', level: 75 },
        ],
      },
    ],
    education: [
      {
        school: en ? "King Mongkut's University of Technology North Bangkok" : 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ',
        degree: en ? "Bachelor's Degree (Continuing)" : 'ปริญญาตรี (กำลังศึกษา)',
        field: en ? 'Electronic Computer Technology' : 'อิเล็กทรอนิกส์คอมพิวเตอร์เทคโนโลยี',
        year: en ? 'June 2024 - April 2026' : 'มิถุนายน 2024 - เมษายน 2026',
        gpa: '3.71',
        courses: en
          ? ['Computer Programming (B+)', 'Database and Data Technology (A)', 'Web Application Development (A)', 'Mobile Application Development (A)', 'Object Oriented Programming (A)']
          : ['การเขียนโปรแกรมคอมพิวเตอร์ (B+)', 'ฐานข้อมูลและเทคโนโลยีข้อมูล (A)', 'การพัฒนาเว็บแอปพลิเคชัน (A)', 'การพัฒนาแอปมือถือ (A)', 'การเขียนโปรแกรมเชิงวัตถุ (A)'],
      },
      {
        school: en ? 'Chanthaburi Technical College' : 'วิทยาลัยเทคนิคจันทบุรี',
        degree: en ? 'High Vocational Certificate (Diploma)' : 'ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)',
        field: en ? 'Electronics' : 'อิเล็กทรอนิกส์',
        year: en ? 'January 2022 - September 2024' : 'มกราคม 2022 - กันยายน 2024',
        gpa: '3.93',
        courses: en
          ? ['Computer Network Systems (4.0)', 'Computer Programming (4.0)', 'Microcontrollers (4.0)', 'Programmable Logic Controllers (4.0)']
          : ['ระบบเครือข่ายคอมพิวเตอร์ (4.0)', 'การเขียนโปรแกรมคอมพิวเตอร์ (4.0)', 'ไมโครคอนโทรลเลอร์ (4.0)', 'พีแอลซี (4.0)'],
      },
    ],
    projects: [
      {
        name: en ? 'Sign Language Translation Application' : 'แอปพลิเคชันแปลภาษามือ',
        tech: ['Python', 'AI/ML', en ? 'Mobile Dev' : 'พัฒนาแอปมือถือ', en ? 'Computer Vision' : 'คอมพิวเตอร์วิทัศน์'],
        description: en
          ? 'Developed a mobile application to translate sign language gestures related to basic illness symptoms into text. Implemented an AI model to process real-time camera input and interpret hand gestures with high accuracy.'
          : 'พัฒนาแอปพลิเคชันมือถือเพื่อแปลภาษามือที่เกี่ยวกับอาการเจ็บป่วยพื้นฐานเป็นข้อความ ใช้โมเดล AI ในการประมวลผลภาพจากกล้องแบบเรียลไทม์และตีความท่าทางมือด้วยความแม่นยำสูง',
        level: en ? "Bachelor's Degree Project" : 'โปรเจกต์ปริญญาตรี',
        highlights: en
          ? ['Real-time processing', 'High accuracy AI model', 'Accessible healthcare solution']
          : ['ประมวลผลแบบเรียลไทม์', 'โมเดล AI ความแม่นยำสูง', 'โซลูชันสุขภาพที่เข้าถึงได้'],
        impact: en
          ? 'Enables better communication for deaf/mute patients in medical settings'
          : 'ช่วยให้ผู้ป่วยหูหนวกหรือใบ้สามารถสื่อสารได้ดีขึ้นในสถานพยาบาล',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g1)' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='60' fill='white' opacity='0.9'%3E🤟%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='32' font-weight='600' fill='white' opacity='0.95'%3ESign Language AI%3C/text%3E%3C/svg%3E",
        demoLink: '#demo',
        codeLink: '#code',
      },
      {
        name: en ? 'Laboratory Usage Monitoring System' : 'ระบบตรวจสอบการใช้ห้องปฏิบัติการ',
        tech: [en ? 'IoT Sensors' : 'เซ็นเซอร์ IoT', en ? 'Mobile App' : 'แอปมือถือ', en ? 'Real-time Data' : 'ข้อมูลเรียลไทม์'],
        description: en
          ? 'Designed an IoT system to monitor laboratory availability by detecting electrical current usage. Created a mobile interface to display real-time status based on sensor data.'
          : 'ออกแบบระบบ IoT เพื่อตรวจสอบความพร้อมใช้งานของห้องปฏิบัติการโดยการตรวจจับการใช้กระแสไฟฟ้า สร้างส่วนติดต่อผู้ใช้บนมือถือเพื่อแสดงสถานะเรียลไทม์จากข้อมูลเซ็นเซอร์',
        level: en ? 'High Vocational Certificate Project' : 'โปรเจกต์ปวส.',
        highlights: en
          ? ['Real-time monitoring', 'Energy detection', 'Mobile interface']
          : ['ตรวจสอบแบบเรียลไทม์', 'ตรวจจับพลังงาน', 'อินเทอร์เฟซมือถือ'],
        impact: en
          ? 'Improved lab resource management and reduced waiting times'
          : 'ปรับปรุงการจัดการทรัพยากรห้องแล็บและลดเวลารอคอย',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2342a5f5;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231976d2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g2)' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='60' fill='white' opacity='0.9'%3E🔬%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='32' font-weight='600' fill='white' opacity='0.95'%3EIoT Lab Monitor%3C/text%3E%3C/svg%3E",
        demoLink: '#demo',
        codeLink: '#code',
      },
      {
        name: en ? 'IoT Electrical Control System' : 'ระบบควบคุมไฟฟ้าผ่าน IoT',
        tech: ['Google Assistant API', en ? 'IoT Hardware' : 'ฮาร์ดแวร์ IoT', en ? 'Voice Control' : 'ควบคุมด้วยเสียง'],
        description: en
          ? 'Built a demonstration set for controlling electrical systems using Google Assistant. Enabled users to turn electrical devices on or off via voice commands or text input on a smartphone.'
          : 'สร้างชุดสาธิตสำหรับควบคุมระบบไฟฟ้าโดยใช้ Google Assistant ให้ผู้ใช้สามารถเปิด-ปิดอุปกรณ์ไฟฟ้าผ่านคำสั่งเสียงหรือการพิมพ์ข้อความบนสมาร์ทโฟน',
        level: en ? 'Vocational Certificate Project' : 'โปรเจกต์ปวช.',
        highlights: en
          ? ['Voice-activated control', 'Smart home integration', 'User-friendly interface']
          : ['ควบคุมด้วยเสียง', 'รวมระบบบ้านอัจฉริยะ', 'อินเทอร์เฟซใช้งานง่าย'],
        impact: en
          ? 'Demonstrated practical IoT applications for home automation'
          : 'แสดงการประยุกต์ใช้ IoT ในการควบคุมบ้านอัตโนมัติ',
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='g3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2366bb6a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%232e7d32;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g3)' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='60' fill='white' opacity='0.9'%3E🏠%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='32' font-weight='600' fill='white' opacity='0.95'%3ESmart Home%3C/text%3E%3C/svg%3E",
        demoLink: '#demo',
        codeLink: '#code',
      },
    ],
  };
}

// ─────────────────────────────────────────────
// CUSTOM HOOKS
// ─────────────────────────────────────────────

/** Persist a value to localStorage whenever it changes */
function usePersist(key, value) {
  useEffect(() => {
    storageSet(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
  }, [key, value]);
}

/** Scroll progress (0-100) + whether to show "back to top" */
function useScrollTracker() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / total) * 100);
      setShowTop(window.scrollY > SCROLL_TOP_THRESHOLD);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { progress, showTop };
}

/** Animated counter that runs once after loading finishes */
function useAnimatedStats(loading) {
  const [stats, setStats] = useState({ gpa: 0, projects: 0, skills: 0, courses: 0 });

  useEffect(() => {
    if (loading) return;

    let step = 0;
    const interval = COUNTER_DURATION / COUNTER_STEPS;

    const timer = setInterval(() => {
      step++;
      const p = step / COUNTER_STEPS;
      setStats({
        gpa: (STAT_TARGETS.gpa * p).toFixed(2),
        projects: Math.floor(STAT_TARGETS.projects * p),
        skills: Math.floor(STAT_TARGETS.skills * p),
        courses: Math.floor(STAT_TARGETS.courses * p),
      });
      if (step >= COUNTER_STEPS) {
        clearInterval(timer);
        setStats(STAT_TARGETS);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [loading]);

  return stats;
}

/** Character-by-character typing effect; resets on language change */
function useTypingEffect(loading, language) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (loading) return;
    const text = TAGLINES[language];
    let i = 0;

    const timer = setInterval(() => {
      i++;
      if (i <= text.length) {
        setTyped(text.slice(0, i));
      } else {
        clearInterval(timer);
      }
    }, TYPING_INTERVAL_MS);

    return () => {
      clearInterval(timer);
      setTyped('');
    };
  }, [loading, language]);

  return typed;
}

/** Track which section is currently in view via IntersectionObserver */
function useActiveSectionTracker(loading, sections) {
  const [active, setActive] = useState('about');

  useEffect(() => {
    if (loading || !sections.length) return;

    const elements = sections
      .map((s) => document.getElementById(`section-${s.id}`))
      .filter(Boolean);
    if (!elements.length) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const id = visible[0].target.getAttribute('data-section');
        if (!id) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setActive(id));
      },
      { threshold: [0.1, 0.2, 0.35, 0.5, 0.65], rootMargin: '-20% 0px -70% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [loading, sections]);

  return active;
}

// ─────────────────────────────────────────────
// REUSABLE SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Inline SVG icons used across the app */
const Icons = {
  Sun: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
    </svg>
  ),
  Moon: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
    </svg>
  ),
  Email: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-blue-500">
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-500">
      <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
    </svg>
  ),
  Location: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-red-500">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
  ),
  GitHub: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className="opacity-80">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
    </svg>
  ),
  Code: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
    </svg>
  ),
  ArrowUp: () => (
    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
    </svg>
  ),
};

/** Section wrapper: provides id + data-section for IntersectionObserver, applies shared styles */
function Section({ id, children, className = '' }) {
  return (
    <section
      id={`section-${id}`}
      data-section={id}
      className={`section-block section-appear ${className}`}
    >
      {children}
    </section>
  );
}

/** Gradient heading used in every section */
function SectionTitle({ children }) {
  return (
    <h2 className="serif-display text-4xl md:text-5xl font-bold mb-12 gradient-text">
      {children}
    </h2>
  );
}

/** Card with timeline line + pulsing dot — used in Education & Internship */
function TimelineCard({ children, darkMode }) {
  return (
    <div className="experience-timeline">
      <div className="timeline-dot" />
      <div className={`timeline-card p-6 rounded-xl ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}`}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION COMPONENTS
// ─────────────────────────────────────────────

function LoadingScreen({ darkMode, t }) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center ${darkMode ? 'bg-neutral-950' : 'bg-white'}`}>
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse flex items-center justify-center text-6xl">
            👨‍💻
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin" />
        </div>
        <div className={`text-2xl font-bold mb-2 ${darkMode ? 'text-neutral-100' : 'text-black'}`}>
          {t.loading}
        </div>
        <div className="flex gap-2 justify-center">
          {[0, 0.2, 0.4].map((delay) => (
            <div key={delay} className="w-3 h-3 rounded-full animate-bounce"
              style={{ backgroundColor: delay === 0 ? '#3b82f6' : delay === 0.2 ? '#8b5cf6' : '#ec4899', animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TopBar({ darkMode, language, setDarkMode, setLanguage, t, downloadCV }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex gap-3">
      <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
        className={`p-3 rounded-full ${darkMode ? 'bg-neutral-800 text-neutral-100' : 'bg-neutral-100 text-black border border-neutral-300'} shadow-lg hover:shadow-xl transition-all font-semibold text-sm`}
        aria-label="Toggle language"
      >
        {language === 'en' ? 'TH' : 'EN'}
      </button>

      <button onClick={() => setDarkMode(!darkMode)}
        className={`p-3 rounded-full ${darkMode ? 'bg-neutral-800 text-neutral-100' : 'bg-neutral-100 text-black border border-neutral-300'} shadow-lg hover:shadow-xl transition-all`}
        aria-label="Toggle theme"
      >
        {darkMode ? <Icons.Sun /> : <Icons.Moon />}
      </button>

      <button onClick={downloadCV}
        className={`download-btn px-4 py-3 rounded-full ${darkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100' : 'bg-black hover:bg-neutral-800 text-white'} shadow-lg hover:shadow-xl font-medium text-sm transition-all flex items-center gap-2`}
      >
        <Icons.Download />
        {t.downloadCV}
      </button>
    </div>
  );
}

function HeroSection({ darkMode, language, t, resumeData, typedText, scrollToSection }) {
  const quickFactTargets = ['education', 'education', 'projects', 'projects'];
  const quickFactColors = ['blue', 'purple', 'green', 'pink'];

  return (
    <div className="content-wrapper">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        {/* Avatar + Text */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 transition-transform duration-300 group-hover:scale-110">
              <div className={`w-full h-full rounded-full flex items-center justify-center text-8xl ${darkMode ? 'bg-neutral-950' : 'bg-white'} transition-all duration-300`}>
                👨‍💻
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <span className="pulse-dot w-2 h-2 bg-white rounded-full" />
              {t.availableFor}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="serif-display hero-title text-5xl md:text-7xl font-bold mb-4 leading-tight">{t.name}</h1>
            <p className="text-xl md:text-2xl font-light mb-4 opacity-80">{t.title}</p>
            <p className="gradient-text text-lg md:text-xl font-medium mb-8 min-h-[2rem]">
              {typedText}<span className="typing-cursor">|</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start mb-8">
              <button onClick={() => scrollToSection('projects')}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] flex items-center justify-center gap-2"
              >
                <span>✨</span> {t.ctaProjects}
              </button>
              <button onClick={() => scrollToSection('contact')}
                className={`px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] flex items-center justify-center gap-2 ${darkMode ? 'bg-neutral-900 border border-neutral-800 hover:border-purple-500 text-neutral-100' : 'bg-white border border-neutral-200 hover:border-purple-500 text-black'}`}
              >
                <span>💬</span> {t.ctaContact}
              </button>
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className={`px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] flex items-center justify-center gap-2 ${darkMode ? 'bg-neutral-900 border border-neutral-800 hover:border-blue-500 text-neutral-100' : 'bg-white border border-neutral-200 hover:border-blue-500 text-black'}`}
              >
                <Icons.GitHub /> {t.ctaGithub}
              </a>
            </div>

            {/* Contact Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {[
                { Icon: Icons.Email, value: resumeData.contact.email },
                { Icon: Icons.Phone, value: resumeData.contact.phone },
                { Icon: Icons.Location, value: resumeData.contact.location },
              ].map(({ Icon, value }) => (
                <div key={value} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <Icon />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`h-px w-full mb-12 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />

        {/* Quick Facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {t.quickFacts.map((fact, i) => (
            <button key={i} onClick={() => scrollToSection(quickFactTargets[i])}
              className={`quick-fact p-4 rounded-xl ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'} text-center font-medium text-sm hover:scale-105 transition-transform cursor-pointer hover:border-${quickFactColors[i]}-500`}
            >
              {fact}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StickyNav({ sections, activeSection, scrollToSection, darkMode }) {
  return (
    <div className={`sticky top-0 backdrop-blur-xl z-40 border-b transition-colors ${darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/80 border-neutral-200'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex gap-8 overflow-x-auto py-4 scrollbar-hide">
          {sections.map((section) => (
            <button key={section.id} onClick={() => scrollToSection(section.id)}
              className={`nav-button whitespace-nowrap text-sm font-medium pb-1 ${activeSection === section.id ? 'active opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function AboutSection({ t }) {
  return (
    <Section id="about" className="max-w-4xl">
      <SectionTitle>{t.aboutTitle}</SectionTitle>
      <p className="text-lg leading-relaxed font-light opacity-90">{t.about}</p>
    </Section>
  );
}

function StatsSection({ t, stats, darkMode, language }) {
  const statCards = [
    { value: stats.gpa, label: t.currentGPA },
    { value: stats.projects, label: t.majorProjects },
    { value: `${stats.skills}+`, label: t.technicalSkills },
    { value: stats.courses, label: t.honorCourses },
  ];

  const githubCards = [
    { value: GITHUB_STATS.contributions, label: t.totalContributions, color: 'blue' },
    { value: GITHUB_STATS.repositories, label: t.repositories, color: 'purple' },
    { value: GITHUB_STATS.followers, label: t.followers, color: 'pink' },
  ];

  const en = language === 'en';
  const terminalLines = [
    { label: en ? 'Languages' : 'ภาษา', value: 'Python, Java, C, SQL, PHP' },
    { label: 'Web', value: 'HTML, CSS, JavaScript' },
    { label: en ? 'Database' : 'ฐานข้อมูล', value: 'MySQL, SQLite, Firebase' },
    { label: en ? 'Specialized' : 'เฉพาะทาง', value: `IoT, AI/ML, ${en ? 'Mobile Dev' : 'แอปมือถือ'}` },
    { label: en ? 'Hardware' : 'ฮาร์ดแวร์', value: 'Microcontrollers, PLCs' },
  ];

  return (
    <Section id="stats">
      <SectionTitle>{t.statsTitle}</SectionTitle>

      {/* Animated Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, i) => (
          <div key={i} className={`stat-card p-8 rounded-2xl text-center ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}`} style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{card.value}</div>
            <div className="text-sm opacity-70">{card.label}</div>
          </div>
        ))}
      </div>

      {/* GitHub Stats */}
      <div className={`p-8 rounded-2xl mb-12 ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}`}>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Icons.GitHub size={24} />
          <span>{t.githubStats}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {githubCards.map((card) => (
            <div key={card.label} className={`github-stat text-center p-6 rounded-xl bg-gradient-to-br from-${card.color}-500/10 to-${card.color}-500/5`}>
              <div className={`text-3xl font-bold text-${card.color}-500 mb-2`}>{card.value}</div>
              <div className="text-sm opacity-70">{card.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Tech Stack */}
      <div className={`p-6 rounded-xl font-mono text-sm ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-900 border border-neutral-700'}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-neutral-500">{t.techStack}</span>
        </div>
        <div className="text-green-400">
          <div className="mb-1">$ cat tech_stack.txt</div>
          <div className="text-neutral-400 ml-4">
            {terminalLines.map((line) => (
              <div key={line.label}>→ {line.label}: {line.value}</div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span>$</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function EducationSection({ t, resumeData, darkMode }) {
  return (
    <Section id="education">
      <SectionTitle>{t.educationTitle}</SectionTitle>
      <div className="space-y-12">
        {resumeData.education.map((edu, i) => (
          <TimelineCard key={i} darkMode={darkMode}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                <p className="text-base opacity-80 mb-1">{edu.field}</p>
                <p className="font-light opacity-70">{edu.school}</p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p className="text-sm opacity-60">{edu.year}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold">
                  GPAX: {edu.gpa}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-3 opacity-70">{t.keyCourses}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {edu.courses.map((course, idx) => (
                  <div key={idx} className={`flex items-center gap-2 text-sm p-2 rounded ${darkMode ? 'bg-neutral-800' : 'bg-white'} hover:scale-105 transition-transform`}>
                    <span className="text-blue-500">✓</span>
                    <span>{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </TimelineCard>
        ))}
      </div>
    </Section>
  );
}

function SkillsSection({ t, resumeData }) {
  return (
    <Section id="skills">
      <SectionTitle>{t.skillsTitle}</SectionTitle>
      <div className="space-y-10">
        {resumeData.skills.map((group, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold mb-6 tracking-wide uppercase text-sm opacity-70">{group.category}</h3>
            <div className="space-y-4">
              {group.items.map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm opacity-60">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    <div className="skill-bar-fill h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 skill-bar" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProjectsSection({ t, resumeData, setSelectedProject, darkMode }) {
  return (
    <Section id="projects">
      <SectionTitle>{t.projectsTitle}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resumeData.projects.map((project, i) => (
          <div key={i} onClick={() => setSelectedProject(project)}
            className={`project-card p-6 rounded-2xl cursor-pointer ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}`}
          >
            <img src={project.image} alt={project.name} className="project-image mb-4" />
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tech.slice(0, 3).map((tech, idx) => (
                <span key={idx} className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">{tech}</span>
              ))}
            </div>
            <p className="text-sm opacity-80 mb-4 line-clamp-2">{project.description}</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
                <Icons.Play /> {t.viewDemo}
              </button>
              <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-current hover:bg-current/10 transition-colors flex items-center justify-center gap-1">
                <Icons.Code /> {t.viewCode}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProjectModal({ project, t, darkMode, onClose }) {
  if (!project) return null;
  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`modal-content max-w-4xl w-full rounded-2xl p-8 ${darkMode ? 'bg-neutral-900' : 'bg-white'} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-3xl font-bold">{project.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors"><Icons.Close /></button>
        </div>
        <img src={project.image} alt={project.name} className="w-full h-64 object-cover rounded-xl mb-6" />
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech, idx) => (
            <span key={idx} className="px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">{tech}</span>
          ))}
        </div>
        <p className="text-lg leading-relaxed mb-6 opacity-90">{project.description}</p>
        <div className="mb-6">
          <p className="text-sm font-semibold mb-3 opacity-70">{t.keyHighlights}</p>
          <div className="space-y-2">
            {project.highlights.map((h, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} border-l-4 border-blue-500`}>
          <p className="text-sm font-semibold mb-1 opacity-70">{t.impact}</p>
          <p className="opacity-90">{project.impact}</p>
        </div>
      </div>
    </div>
  );
}

function InternshipSection({ t, darkMode }) {
  return (
    <Section id="internship">
      <SectionTitle>{t.internshipTitle}</SectionTitle>
      <div className="experience-timeline">
        <div className="timeline-dot" />
        <div className={`timeline-card p-8 rounded-2xl ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{t.position}</h3>
              <p className="text-lg gradient-text font-semibold">{t.company}</p>
            </div>
            <div className="mt-4 md:mt-0 inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-sm font-semibold">
              {t.period}
            </div>
          </div>
          <p className="opacity-90 mb-6 text-lg leading-relaxed">{t.description}</p>
          <div>
            <p className="font-semibold mb-4 text-sm opacity-70">{t.whatIBring}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.achievements.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-lg ${darkMode ? 'bg-neutral-800' : 'bg-white'} hover:scale-[1.02] transition-transform`}>
                  <span className="text-blue-500 text-xl flex-shrink-0">→</span>
                  <span className="leading-relaxed">{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function InterestsSection({ t, darkMode }) {
  return (
    <Section id="interests">
      <SectionTitle>{t.interestsTitle}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.hobbies.map((hobby, i) => (
          <div key={i} className={`hobby-card p-6 rounded-2xl ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}`}>
            <div className="text-4xl mb-4">{hobby.icon}</div>
            <h3 className="text-xl font-bold mb-3">{hobby.title}</h3>
            <p className="leading-relaxed opacity-80">{hobby.desc}</p>
          </div>
        ))}
      </div>
      <div className={`mt-12 p-6 rounded-xl text-center ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}`}>
        <p className="text-sm opacity-60 italic">{t.quote}</p>
      </div>
    </Section>
  );
}

function ContactSection({ t, darkMode, contactForm, setContactForm, formSubmitted, onSubmit }) {
  return (
    <Section id="contact" className="max-w-3xl mx-auto">
      <SectionTitle className="text-center">{t.contactTitle}</SectionTitle>
      <p className="text-center opacity-70 mb-12">{t.contactSubtitle}</p>

      <form onSubmit={onSubmit} className="space-y-6">
        {[
          { type: 'text', key: 'name', placeholder: t.contactName },
          { type: 'email', key: 'email', placeholder: t.contactEmail },
        ].map(({ type, key, placeholder }) => (
          <input key={key} type={type} placeholder={placeholder} value={contactForm[key]}
            onChange={(e) => setContactForm({ ...contactForm, [key]: e.target.value })}
            className={`contact-input w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-300 text-black'} focus:outline-none focus:border-blue-500`}
            required
          />
        ))}
        <textarea placeholder={t.contactMessage} value={contactForm.message} rows={5}
          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
          className={`contact-input w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-300 text-black'} focus:outline-none focus:border-blue-500 resize-none`}
          required
        />
        <button type="submit"
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <Icons.Send /> {t.sendMessage}
        </button>
      </form>

      {formSubmitted && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500 text-green-500 rounded-lg text-center font-medium animate-pulse">
          ✓ {t.messageSent}
        </div>
      )}
    </Section>
  );
}

function Footer({ t, darkMode }) {
  return (
    <footer className={`border-t mt-32 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <p className="opacity-60 text-sm mb-2">{t.copyright} {t.name}</p>
        <p className="opacity-40 text-xs">{t.builtWith}</p>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// GLOBAL STYLES (extracted as a constant)
// ─────────────────────────────────────────────
function GlobalStyles({ language, darkMode }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');

      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        font-family: ${language === 'th' ? "'IBM Plex Sans Thai', sans-serif" : "'DM Sans', sans-serif"};
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }

      .serif-display {
        font-family: ${language === 'th' ? "'IBM Plex Sans Thai', serif" : "'Playfair Display', serif"};
      }

      /* ── Scroll Progress Bar ── */
      .scroll-progress {
        position: fixed; top: 0; left: 0; height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
        z-index: 9999; transition: width 0.1s ease-out;
      }

      /* ── Page Entry ── */
      .content-wrapper { animation: fadeInUp 0.8s ease-out; }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Nav Button Active Underline ── */
      .nav-button { position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      .nav-button::after {
        content: ''; position: absolute; bottom: -2px; left: 0;
        width: 0; height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        transition: width 0.3s ease;
      }
      .nav-button.active::after { width: 100%; }

      /* ── Section Entrance ── */
      .section-appear { animation: sectionFade 0.6s ease-out; }
      .section-block { scroll-margin-top: 96px; }
      @keyframes sectionFade {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Stat Cards ── */
      .stat-card { animation: statPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
      @keyframes statPop {
        0%   { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1);   opacity: 1; }
      }

      /* ── Skill Bars ── */
      .skill-bar { transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
      .skill-item {
        transition: all 0.3s ease; padding: 1rem;
        border-radius: 8px; position: relative;
      }
      .skill-item::before {
        content: ''; position: absolute; inset: 0; border-radius: 8px;
        background: linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05));
        opacity: 0; transition: opacity 0.3s ease;
      }
      .skill-item:hover                { transform: translateX(4px); }
      .skill-item:hover::before        { opacity: 1; }
      .skill-item:hover .skill-bar-fill {
        filter: brightness(1.2);
        box-shadow: 0 0 12px rgba(59,130,246,0.5);
      }

      /* ── Project Cards ── */
      .project-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative; overflow: hidden;
      }
      .project-card::before {
        content: ''; position: absolute; top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent);
        transition: left 0.6s ease;
      }
      .project-card::after {
        content: ''; position: absolute; inset: -2px; border-radius: 16px; padding: 2px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        opacity: 0; transition: opacity 0.3s ease;
      }
      .project-card:hover::before       { left: 100%; }
      .project-card:hover::after        { opacity: 1; }
      .project-card:hover               { transform: translateY(-8px) scale(1.02); box-shadow: 0 12px 32px rgba(59,130,246,0.3); }
      .project-image                    { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; transition: transform 0.4s ease; }
      .project-card:hover .project-image { transform: scale(1.05); }

      /* ── Quick Facts ── */
      .quick-fact { animation: fadeInLeft 0.6s ease-out backwards; position: relative; overflow: hidden; }
      .quick-fact::before {
        content: ''; position: absolute; top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent);
        transition: left 0.5s ease;
      }
      .quick-fact:hover::before { left: 100%; }
      .quick-fact:hover         { box-shadow: 0 8px 24px rgba(59,130,246,0.3); }
      .quick-fact:nth-child(1)  { animation-delay: 0.1s; }
      .quick-fact:nth-child(2)  { animation-delay: 0.2s; }
      .quick-fact:nth-child(3)  { animation-delay: 0.3s; }
      .quick-fact:nth-child(4)  { animation-delay: 0.4s; }
      @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      /* ── Download Button Ripple ── */
      .download-btn { position: relative; overflow: hidden; }
      .download-btn::before {
        content: ''; position: absolute; top: 50%; left: 50%;
        width: 0; height: 0; background: rgba(255,255,255,0.3);
        border-radius: 50%; transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      .download-btn:hover::before { width: 300px; height: 300px; }

      /* ── Gradient Text ── */
      .gradient-text {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      }

      /* ── Timeline ── */
      .experience-timeline { position: relative; padding-left: 2rem; }
      .experience-timeline::before {
        content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
        background: linear-gradient(180deg, #3b82f6, #8b5cf6, #ec4899);
      }
      .timeline-card {
        position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .timeline-card::after {
        content: ''; position: absolute; inset: -2px; border-radius: 12px; padding: 2px;
        background: linear-gradient(135deg, transparent, transparent);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        opacity: 0; transition: opacity 0.3s ease;
      }
      .timeline-card:hover         { transform: translateX(8px); box-shadow: -4px 8px 24px rgba(59,130,246,0.2); }
      .timeline-card:hover::after  { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); opacity: 1; }
      .timeline-dot {
        position: absolute; left: -5px; top: 0; width: 12px; height: 12px;
        background: #3b82f6; border-radius: 50%;
        box-shadow: 0 0 0 4px ${darkMode ? '#0a0a0a' : '#ffffff'};
        animation: pulse-dot 2s infinite;
      }
      @keyframes pulse-dot {
        0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.7); }
        50%      { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
      }

      /* ── Hobby Cards ── */
      .hobby-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer; position: relative;
      }
      .hobby-card::before {
        content: ''; position: absolute; inset: -2px; border-radius: 16px; padding: 2px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        opacity: 0; transition: opacity 0.3s ease;
      }
      .hobby-card:hover         { transform: translateY(-8px) scale(1.03); box-shadow: 0 12px 32px rgba(139,92,246,0.3); }
      .hobby-card:hover::before { opacity: 1; }

      /* ── Modal ── */
      .modal-overlay {
        background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
        z-index: 1000; animation: fadeIn 0.3s ease;
      }
      .modal-content { animation: slideUp 0.4s ease; }
      @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* ── Scroll-to-Top ── */
      .scroll-to-top {
        position: fixed; bottom: 2rem; right: 2rem;
        width: 48px; height: 48px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.3s ease; z-index: 100;
        opacity: 0; transform: translateY(20px); pointer-events: none;
      }
      .scroll-to-top.show          { opacity: 1; transform: translateY(0); pointer-events: all; }
      .scroll-to-top:hover         { transform: translateY(-4px); }
      .scroll-to-top:active        { transform: translateY(-2px); }

      /* ── GitHub Stat Cards ── */
      .github-stat { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
      .github-stat::before {
        content: ''; position: absolute; inset: -2px; border-radius: 12px; padding: 2px;
        background: linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(236,72,153,0.5));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor; mask-composite: exclude;
        opacity: 0; transition: opacity 0.3s ease;
      }
      .github-stat:hover         { transform: translateY(-6px) scale(1.05); box-shadow: 0 8px 24px rgba(59,130,246,0.4); }
      .github-stat:hover::before { opacity: 1; }

      /* ── Contact Inputs ── */
      .contact-input { transition: all 0.3s ease; }
      .contact-input:focus { transform: translateY(-2px); }

      /* ── Typing Cursor ── */
      .typing-cursor { animation: blink 1s infinite; }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

      /* ── Pulse Dot (online badge) ── */
      .pulse-dot { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

      /* ── Responsive ── */
      @media (max-width: 768px) {
        .hero-title { font-size: 2.5rem !important; }
      }
    `}</style>
  );
}

// ─────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────
export default function ResumeApp() {
  // ── Core State ──
  const [darkMode, setDarkMode] = useState(() => storageGet(STORAGE_KEYS.theme, false));
  const [language, setLanguage] = useState(() => storageGet(STORAGE_KEYS.lang, 'en'));
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // ── Derived / Memoised ──
  const t = TRANSLATIONS[language];
  const resumeData = useMemo(() => buildResumeData(language), [language]);

  // ── Persist preferences ──
  usePersist(STORAGE_KEYS.theme, darkMode);
  usePersist(STORAGE_KEYS.lang, language);

  // ── Loading timer ──
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // ── Custom Hooks ──
  const { progress: scrollProgress, showTop: showScrollTop } = useScrollTracker();
  const stats = useAnimatedStats(loading);
  const typedText = useTypingEffect(loading, language);
  const activeSection = useActiveSectionTracker(loading, t.sections);

  // ── Handlers ──
  const scrollToSection = useCallback((id) => {
    setTimeout(() => {
      const el = document.getElementById(`section-${id}`);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT, behavior: 'smooth' });
    }, 100);
  }, []);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  const downloadCV = useCallback(() => {
    alert(language === 'en'
      ? 'CV download feature - This would generate a PDF version of the resume!'
      : 'ฟีเจอร์ดาวน์โหลด CV - จะสร้างไฟล์ PDF ของเรซูเม่!');
  }, [language]);

  const handleContactSubmit = useCallback((e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  }, []);

  // ── Loading Screen ──
  if (loading) return <LoadingScreen darkMode={darkMode} t={t} />;

  // ── Main Render ──
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-white text-black'}`}>
      <GlobalStyles language={language} darkMode={darkMode} />

      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <TopBar darkMode={darkMode} language={language} setDarkMode={setDarkMode} setLanguage={setLanguage} t={t} downloadCV={downloadCV} />

      <HeroSection darkMode={darkMode} language={language} t={t} resumeData={resumeData} typedText={typedText} scrollToSection={scrollToSection} />

      <StickyNav sections={t.sections} activeSection={activeSection} scrollToSection={scrollToSection} darkMode={darkMode} />

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        <AboutSection t={t} />
        <StatsSection t={t} stats={stats} darkMode={darkMode} language={language} />
        <EducationSection t={t} resumeData={resumeData} darkMode={darkMode} />
        <SkillsSection t={t} resumeData={resumeData} />
        <ProjectsSection t={t} resumeData={resumeData} setSelectedProject={setSelectedProject} darkMode={darkMode} />
        <ProjectModal project={selectedProject} t={t} darkMode={darkMode} onClose={() => setSelectedProject(null)} />
        <InternshipSection t={t} darkMode={darkMode} />
        <InterestsSection t={t} darkMode={darkMode} />
        <ContactSection t={t} darkMode={darkMode} contactForm={contactForm} setContactForm={setContactForm} formSubmitted={formSubmitted} onSubmit={handleContactSubmit} />
      </div>

      <button onClick={scrollToTop} aria-label="Scroll to top"
        className={`scroll-to-top ${showScrollTop ? 'show' : ''} ${darkMode ? 'bg-neutral-800 text-neutral-100 border border-neutral-700' : 'bg-white text-black border border-neutral-300'} shadow-lg hover:shadow-xl`}
      >
        <Icons.ArrowUp />
      </button>

      <Footer t={t} darkMode={darkMode} />
    </div>
  );
}