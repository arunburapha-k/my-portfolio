import signLangImg from '../assets/sign-language-ai.png';
import iotImg from '../assets/iot-lab-monitor.png';
import voiceImg from '../assets/voice-control-system.png';

// ฟังก์ชันรับค่าภาษา (language) แล้วส่งข้อมูลกลับมาตามภาษานั้น
export const getResumeData = (language) => {
  const isEn = language === 'en';

  return {
    contact: {
      email: "arunburapha.k@gmail.com",
      phone: "062-464-5582",
      location: isEn ? "Nonthaburi, TH" : "นนทบุรี, ไทย"
    },
    skills: [
      { category: isEn ? "LANGUAGES" : "ภาษา", items: [{ name: "Python", level: 85 }, { name: "Java", level: 75 }, { name: "C", level: 80 }, { name: "SQL", level: 75 }, { name: "PHP", level: 70 }] },
      { category: isEn ? "WEB STACK" : "เว็บ", items: [{ name: "HTML/CSS", level: 90 }, { name: "JavaScript", level: 80 }, { name: "React", level: 75 }, { name: "Node.js", level: 70 }] },
      { category: isEn ? "DATA/BACKEND" : "ฐานข้อมูล", items: [{ name: "SQLite", level: 80 }, { name: "MySQL", level: 80 }, { name: "Firebase", level: 75 }] },
      { category: isEn ? "SPECIALIZED" : "เฉพาะทาง", items: [{ name: "IoT Systems", level: 85 }, { name: "AI/ML", level: 80 }, { name: "Microcontrollers", level: 85 }] }
    ],
    education: [
      {
        school: isEn ? "KMUTNB" : "มจพ.",
        degree: isEn ? "B.Ind.Tech (Continuing)" : "อุตสาหกรรมศาสตรบัณฑิต (ต่อเนื่อง)",
        field: isEn ? "Electronic Computer Tech" : "เทคโนโลยีคอมพิวเตอร์อิเล็กทรอนิกส์",
        year: "2024 - 2026",
        courses: ["Computer Programming", "Database Tech", "Web App Dev", "Mobile App Dev", "OOP"],
        locationQuery: "King Mongkut's University of Technology North Bangkok"
      },
      {
        school: isEn ? "Chanthaburi Tech" : "วท.จันทบุรี",
        degree: isEn ? "Diploma" : "ปวส.",
        field: isEn ? "Electronics" : "อิเล็กทรอนิกส์",
        year: "2022 - 2024",
        courses: ["Network Systems", "Programming", "Microcontrollers", "PLC"],
        locationQuery: "Chanthaburi Technical College"
      }
    ],
    experience: [
      {
        role: isEn ? "Assistant Technician Intern" : "นักศึกษาฝึกงานผู้ช่วยช่าง",
        company: isEn ? "EV Car (Thailand) Co., Ltd" : "บริษัท อีวี คาร์ (ประเทศไทย) จำกัด",
        description: isEn ? "Assisted in maintenance and service of electric vehicles. Gained hands-on experience with EV systems." : "ปฏิบัติงานผู้ช่วยช่างในการซ่อมบำรุงและบริการรถยนต์ไฟฟ้า เรียนรู้ระบบการทำงานของยานยนต์ไฟฟ้า",
        tag: isEn ? "Internship" : "ฝึกงาน",
        locationQuery: "EV Car Thailand"
      },
      {
        role: isEn ? "Assistant Technician Intern" : "นักศึกษาฝึกงานผู้ช่วยช่าง",
        company: isEn ? "Chiewchan Service Chanthaburi" : "เชี่ยวชาญ เซอร์วิส จันทบุรี",
        description: isEn ? "Service & Spare Parts Center support. Managed inventory and assisted senior technicians." : "สนับสนุนงานศูนย์บริการและคลังอะไหล่ จัดการสต็อกและเป็นผู้ช่วยช่างเทคนิค",
        tag: isEn ? "Internship" : "ฝึกงาน",
        locationQuery: "Chiewchan Service Chanthaburi"
      }
    ],
    projects: [
      {
        name: isEn ? "Sign Language Translation AI" : "AI แปลภาษามือ",
        tech: ["Python", "TensorFlow", "GRU Model", "Kotlin", "Android Studio"],
        description: isEn ? "Implemented a GRU model for sequential gesture recognition, integrated with a native Kotlin Android app for real-time translation." : "พัฒนาระบบจดจำท่าทางด้วยโมเดล GRU สำหรับข้อมูลแบบต่อเนื่อง (Sequence) เชื่อมต่อกับแอป Android ที่เขียนด้วย Kotlin เพื่อการแปลผลที่ลื่นไหล",
        level: "Bachelor Project",
        highlights: isEn ? ["95% Accuracy", "Real-time processing", "Android Integration"] : ["ความแม่นยำ 95%", "ประมวลผลเรียลไทม์", "รองรับ Android"],
        impact: isEn ? "Bridging communication gaps in hospitals." : "ช่วยลดช่องว่างการสื่อสารในโรงพยาบาล",
        image: signLangImg
      },
      {
        name: isEn ? "IoT Lab Monitor" : "ระบบมอนิเตอร์แล็บ IoT",
        tech: ["ESP32", "PZEM-004T", "Blynk App", "WiFi"],
        description: isEn ? "Lab monitoring system using PZEM-004T for precise current measurement, transmitting data via ESP32 to Blynk App for real-time status." : "ระบบตรวจสอบการใช้งานห้องแล็บด้วยเซ็นเซอร์ PZEM-004T วัดกระแสไฟฟ้าแม่นยำสูง ส่งข้อมูลผ่าน ESP32 แสดงผลสถานะบนแอป Blynk",
        level: "Diploma Project",
        highlights: isEn ? ["Non-invasive sensor", "Real-time DB", "Low latency"] : ["เซ็นเซอร์แบบไม่สัมผัส", "ฐานข้อมูลเรียลไทม์", "ความหน่วงต่ำ"],
        impact: isEn ? "Optimized resource usage." : "ช่วยบริหารจัดการทรัพยากรให้คุ้มค่า",
        image: iotImg
      },
      {
        name: isEn ? "Voice Control System" : "ระบบสั่งงานด้วยเสียง",
        tech: ["Google Assistant", "MQTT", "NodeMCU", "Google Cloud"],
        description: isEn ? "Smart home automation integrating Google Assistant via MQTT Cloud protocol for low-latency voice-controlled lighting." : "ระบบบ้านอัจฉริยะเชื่อมต่อ Google Assistant ผ่านโปรโตคอล MQTT Cloud เพื่อสั่งเปิด-ปิดไฟด้วยเสียงจากมือถือได้อย่างรวดเร็ว",
        level: "Vocational Project",
        highlights: isEn ? ["Voice Command", "Cloud Integration", "Safety Cutoff"] : ["สั่งงานด้วยเสียง", "เชื่อมต่อ Cloud", "ระบบตัดไฟนิรภัย"],
        impact: isEn ? "Accessible smart home demo." : "ตัวอย่างบ้านอัจฉริยะที่เข้าถึงได้ง่าย",
        image: voiceImg
      }
    ]
  };
};