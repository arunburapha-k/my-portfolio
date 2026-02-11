import React, { useEffect, useRef } from 'react';

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
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
      }
    };

    class Particle {
      constructor(x, y, color) {
        this.x = x; this.y = y; this.originX = x; this.originY = y;
        this.color = color; this.size = Math.floor(Math.random() * 3 + 1);
        this.vx = 0; this.vy = 0; this.friction = 0.92; this.ease = speed;
      }
      draw() { ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.size, this.size); }
      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDistance = 120;
        const force = (forceDistance - distance) / forceDistance;
        const angle = Math.atan2(dy, dx);

        if (distance < forceDistance) {
          const pushX = Math.cos(angle) * force * 30;
          const pushY = Math.sin(angle) * force * 30;
          this.vx -= pushX;
          this.vy -= pushY;
        }
        this.vx += (this.originX - this.x) * this.ease;
        this.vy += (this.originY - this.y) * this.ease;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const colCount = Math.floor(canvas.width / gap);
      const rowCount = Math.floor(canvas.height / gap);
      for (let i = 0; i < colCount; i++) {
        for (let j = 0; j < rowCount; j++) {
          const x = i * gap + gap / 2;
          const y = j * gap + gap / 2;
          const color = colors[Math.floor(Math.random() * colors.length)];
          particles.push(new Particle(x, y, color));
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => p.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => { mouse.x = undefined; mouse.y = undefined; };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, gap, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" style={{ opacity: 0.5 }} />;
};

export default PixelBlast;