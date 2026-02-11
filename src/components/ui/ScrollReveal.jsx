import React, { useState, useEffect, useRef } from 'react';

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // 1. สร้างตัวแปรมารับค่า ref.current เก็บไว้ก่อน
    const currentRef = ref.current; 

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 2. ใช้ currentRef แทน ref.current
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    // 3. ใช้ currentRef ในการ observe
    if (currentRef) observer.observe(currentRef);

    return () => {
      // 4. ใช้ currentRef ในการ cleanup (จุดที่ Error ฟ้อง)
      if (currentRef) observer.disconnect();
    };
  }, []); // dependency array ว่างเหมือนเดิม

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

export default ScrollReveal;