import React, { useEffect, useRef } from 'react';

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 200;
    const colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      spin: number;
      spinSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 5 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 1;
        this.spin = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.spin);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 2);
        ctx.restore();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.spin += this.spinSpeed;
        
        if (this.y > height) {
            this.opacity -= 0.02;
        }
      }
    }

    function init() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    let animationFrameId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        if(p.opacity <= 0) {
            particles.splice(index, 1);
        }
      });
      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    init();
    animate();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        if(canvas) {
           canvas.width = width;
           canvas.height = height;
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }} />;
};
