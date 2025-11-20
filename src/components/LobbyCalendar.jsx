import React from "react";

export default function LobbyCalendar() {
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);
  const hoy = new Date().getDate(); // Asumiendo que esta fecha es relevante

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