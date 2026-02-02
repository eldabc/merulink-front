import React from 'react';

export default function NotificationPanel({ isOpen }) {
  if (!isOpen) return null;

  const notifications = [
    { id: 1, text: "Nuevo evento programado", time: "Hace 5 min" },
    { id: 2, text: "Lunes bancario próximo", time: "Hace 1 hora" },
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-[#3c4042] border border-[#ffffff21] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="p-4 border-b border-[#ffffff10] flex justify-between items-center">
        <h3 className="text-white font-bold">Notificaciones</h3>
        <a className="text-xs text-[#9fd8ff] cursor-pointer">Marcar como leídas</a>
      </div>
      <ul className="max-h-96 overflow-y-auto">
        {notifications.map((n) => (
          <li key={n.id} className="p-4 border-b border-[#ffffff05] hover:bg-[#ffffff05] transition-colors cursor-pointer">
            <p className="mr-2 text-sm text-gray-200">{n.text}</p>
            <span className="mr-2 text-xs text-gray-500">{n.time}</span>
          </li>
        ))}
      </ul>
      <div className="p-2 text-center bg-[#4e5051]">
        <a className="text-xs hover:text-white">Ver todas</a>
      </div>
    </div>
  );
}