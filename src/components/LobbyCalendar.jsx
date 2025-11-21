import React from 'react';
import Calendar from './Calendar';

// Datos (pueden ser extraídos a un archivo de constantes si crecen)
const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const diasMes = Array.from({ length: 30 }, (_, i) => i + 1);
const hoy = new Date().getDate();

export default function LobbyCalendar() {
  return (

    <>
      <Calendar />
    <br></br>
    <div className="calendar-card">
      <div className="calendar-header">
        <div className="month-nav">
          <button className="nav-btn">◀</button>
          <div className="month-title">Octubre 2025</div>
          <button className="nav-btn">▶</button>
        </div>
      </div>
      
      <div className="weekdays-grid">
        {diasSemana.map((d) => (
          <div key={d} className="weekday-header">{d}</div>
        ))}
      </div>

      <div className="calendar-grid-wide">
        {diasMes.map((dia) => (
          <div key={dia} className={`day-cell ${dia === hoy ? "today" : ""}`}>{dia}</div>
        ))}
      </div>
    </div>
    </>
  );
}