import React, { useState, useEffect, useRef } from 'react';

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

export default ScrollReveal;