import React, { useEffect, useRef, useState } from "react";

// MeruLink Interfaz Definitiva Glass Dark UI – Versión 1.3 (partículas optimizadas)
export default function MeruLinkApp() {
  const [activeMenu, setActiveMenu] = useState("Lobby");

  const topMenuItems = ["IA", "Empleados", "Infraestructura", "Inventario", "Whatsapp", "Configuración", "Documentos"];
  const submenus = {
    Empleados: ["Lista", "Roles", "Casilleros"],
    Infraestructura: ["APs Internet", "Domotica", "Mantenimiento"],
    Inventario: ["Stock", "Entradas", "Salidas"],
    Configuración: ["Sistema", "Seguridad", "Notificaciones"],
    Documentos: ["Memos", "Reglamento"],
    Whatsapp: ["Recepcion", "Ventas", "AyB"],
  };

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);
  const hoy = new Date().getDate();

  // particles refs/state
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]); // persistent particles array
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    // initialize when canvas is mounted
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

    // create particles once (tripled count)
    const PARTICLE_COUNT = 130;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: 0.6 + Math.random() * 2.8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: 0.06 + Math.random() * 0.16,
    }));

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // subtle overlay gradient
      const g = ctx.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      g.addColorStop(0, 'rgba(255,255,255,0.01)');
      g.addColorStop(1, 'rgba(83,196,255,0.02)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const parts = particlesRef.current;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
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

    // initial size + start loop
    setCanvasSize();
    draw();

    // responsive resize handling
    if (window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(() => {
        setCanvasSize();
      });
      resizeObserverRef.current.observe(canvas);
    } else {
      window.addEventListener('resize', setCanvasSize);
    }

    // cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      else window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  function renderLobbyCalendar() {
    return (
      <div className="calendar-card">
        <div className="calendar-header">
          <div className="month-nav">
            <button className="nav-btn">◀</button>
            <div className="month-title">Octubre 2025</div>
            <button className="nav-btn">▶</button>
          </div>
        </div>

        <div className="weekdays">
          {diasSemana.map(d => (
            <div key={d} className="weekday-header">{d}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {diasMes.map(dia => (
            <div key={dia} className={`day-cell ${dia === hoy ? 'today' : ''}`}>{dia}</div>
          ))}
        </div>
      </div>
    );
  }

  function AssistantInput() {
    return (
      <div className="assistant-card" role="region" aria-label="Assistant input visual">
        <span className="placeholder-text">Como te puedo ayudar?...</span>
      </div>
    );
  }

  function renderWorkspace() {
    if (activeMenu === 'Lobby') {
      return (
        <div className="content-center">
          <h2 className="title">Calendario Plaza Meru</h2>
          {renderLobbyCalendar()}
          <footer className="mt-6 footer-muted">Hotel Plaza Meru — V1.0 2025</footer>
        </div>
      );
    }

    if (activeMenu === 'IA') {
      return (
        <div className="ia-workspace">
          <AssistantInput />
        </div>
      );
    }

    return (
      <div className="content-center">
        <h2 className="title">{activeMenu}</h2>
        <p className="muted">Área de trabajo — {activeMenu}</p>
        <footer className="mt-6 footer-muted">Hotel Plaza Meru — V1.0 2025</footer>
      </div>
    );
  }

  const currentSubmenu = submenus[activeMenu] || [];

  return (
    <div className="merulink-root">
      <style>{`
        :root{ --bg1:#0f2027; --bg2:#203a43; --bg3:#2c5364; --glass-bg:rgba(255,255,255,0.05); --glass-border:rgba(255,255,255,0.10); --text-primary:#e6f0fa; --text-muted:rgba(180,200,210,0.78); --accent-1:#667eea; --accent-2:#764ba2 }
        html,body,#root{height:100%}
        .merulink-root{min-height:100vh;width:100vw;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto;color:var(--text-primary);background:linear-gradient(120deg,var(--bg1),var(--bg2),var(--bg3));background-size:300% 300%;animation:bgShift 18s linear infinite;display:flex;flex-direction:column;overflow:hidden;position:relative}
        @keyframes bgShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

        .particles-layer{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.92}

        .topbar{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:16px 28px;backdrop-filter:blur(8px);background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));border-bottom:1px solid var(--glass-border)}
        .brand-area{display:flex;align-items:center;gap:16px}
        .logo-text{font-weight:700;font-size:18px;color:var(--text-primary);background:linear-gradient(135deg,var(--accent-1),var(--accent-2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .top-menu{display:flex;gap:8px;align-items:center}
        .top-menu button{background:transparent;border:none;padding:8px 12px;color:var(--text-muted);border-radius:10px;cursor:pointer;font-weight:600}
        .top-menu button:hover{color:var(--text-primary);background:rgba(255,255,255,0.02)}
        .top-menu button.active{color:var(--text-primary);background:rgba(102,126,234,0.08);box-shadow:0 8px 20px rgba(20,40,60,0.12)}

        .user-block{text-align:right}.user-block .name{font-weight:700}.user-block .dept{color:var(--text-muted);font-size:13px}

        .main-area{position:relative;z-index:2;display:flex;flex:1;min-height:0}
        .sidebar{width:260px;padding:20px;border-right:1px solid var(--glass-border);background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));backdrop-filter:blur(6px)}
        .sidebar.hidden{display:none}.submenu-title{color:var(--text-muted);font-size:12px;margin-bottom:8px;text-transform:uppercase}
        .submenu-btn{display:block;width:100%;text-align:left;padding:10px 12px;margin-bottom:8px;border-radius:10px;background:transparent;color:var(--text-primary);border:none;cursor:pointer;font-weight:600}
        .submenu-btn:hover{background:rgba(255,255,255,0.02)}.submenu-btn.active{background:rgba(83,196,255,0.12);color:#fff}

        .workspace{flex:1;padding:28px;overflow:auto;display:flex;justify-content:center;align-items:flex-start}
        .calendar-card{width:100%;max-width:1200px;margin:0 auto;background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));border-radius:16px;padding:26px;border:1px solid rgba(255,255,255,0.06);box-shadow:0 16px 50px rgba(2,6,23,0.6);backdrop-filter:blur(10px);transition:all 0.3s ease}
        .calendar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.month-title{color:#cfeeff;font-weight:700}.nav-btn{background:transparent;border:1px solid rgba(255,255,255,0.04);color:var(--text-primary);padding:8px 12px;border-radius:10px}
        .weekday-header{text-align:center;font-weight:700;color:#9fd8ff;padding:6px 0}.calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:14px}.day-cell{min-height:80px;padding:10px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.03);color:var(--text-primary);display:flex;justify-content:flex-end;align-items:flex-start;font-weight:600;transition:all 0.18s ease}.day-cell:hover{transform:translateY(-3px);background:rgba(255,255,255,0.035)}.day-cell.today{border:1px solid #53c4ff;box-shadow:0 0 18px rgba(83,196,255,0.45);background:linear-gradient(135deg,rgba(83,196,255,0.16),rgba(83,196,255,0.06));transform:scale(1.02)}

        .ia-workspace{width:100%;display:flex;justify-content:center;align-items:flex-start;padding-top:40px}.assistant-card{width:60%;max-width:720px;background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.10);border-radius:14px;padding:18px 20px;color:#cfeeff;box-shadow:0 12px 40px rgba(5,20,40,0.6);backdrop-filter:blur(12px);position:relative;overflow:hidden;transition:all 0.28s ease}.assistant-card::before{content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;background:linear-gradient(120deg,rgba(83,196,255,0.35),transparent 70%);transform:skewX(-20deg);opacity:0;transition:all 0.5s ease}.assistant-card:hover{transform:translateY(-3px);box-shadow:0 0 30px rgba(83,196,255,0.34)}.assistant-card:hover::before{left:120%;opacity:1}.placeholder-text{color:rgba(200,230,255,0.78)}

        .title{font-size:20px;margin-bottom:12px;color:#cfeeff;text-align:center}.muted{color:var(--text-muted);margin-top:8px}.footer-muted{color:var(--text-muted);margin-top:18px;text-align:center}
        @media (max-width:900px){.sidebar{display:none}.workspace{padding:18px}.calendar-card{max-width:100%}.assistant-card{width:92%}.top-menu{display:none}}
      `}</style>

      {/* particles canvas */}
      <canvas ref={canvasRef} className="particles-layer" />

      {/* topbar */}
      <header className="topbar">
        <div className="brand-area">
          <div className="logo-text" onClick={() => setActiveMenu('Lobby')}>MeruLink</div>
          <nav className="top-menu" aria-label="Main menu">
            {topMenuItems.map(item => (
              <button key={item} onClick={() => setActiveMenu(item)} className={activeMenu === item ? 'active' : ''}>{item}</button>
            ))}
          </nav>
        </div>
        <div className="user-block">
          <div className="name">Riad Abdo</div>
          <div className="dept">Sistemas y Tecnología</div>
        </div>
      </header>

      {/* main area */}
      <div className="main-area">
        <aside className={`sidebar ${currentSubmenu.length === 0 ? 'hidden' : ''}`}>{currentSubmenu.length > 0 && (
          <>
            <div className="submenu-title">Secciones</div>
            {currentSubmenu.map(s => (<button key={s} className="submenu-btn">{s}</button>))}
          </>
        )}</aside>

        <main className="workspace">{renderWorkspace()}</main>
      </div>
    </div>
  );
}
