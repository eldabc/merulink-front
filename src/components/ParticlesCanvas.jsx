// src/components/ParticlesCanvas.jsx

import React, { useEffect, useRef } from "react";

export default function ParticlesCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let DPR = window.devicePixelRatio || 1;

    function setCanvasSize() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(w * DPR));
      canvas.height = Math.max(1, Math.floor(h * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    // Creación de partículas (solo la primera vez)
    const PARTICLE_COUNT = 130;
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: 0.6 + Math.random() * 2.8,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        alpha: 0.06 + Math.random() * 0.16,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Gradient y dibujo de partículas
      const g = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      g.addColorStop(0, 'rgba(255,255,255,0.01)');
      g.addColorStop(1, 'rgba(83,196,255,0.02)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const parts = particlesRef.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        // Lógica de movimiento y rebote
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = canvas.offsetWidth + 20;
        if (p.x > canvas.offsetWidth + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.offsetHeight + 20;
        if (p.y > canvas.offsetHeight + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(150,200,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // Inicio
    setCanvasSize();
    draw();

    // Responsive resize handling
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(setCanvasSize);
      resizeObserverRef.current.observe(canvas);
    } else {
      window.addEventListener('resize', setCanvasSize);
    }

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      else window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-layer" />;
}