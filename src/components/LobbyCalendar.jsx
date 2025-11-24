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
    </>
  );
}