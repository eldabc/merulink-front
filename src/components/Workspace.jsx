import React from "react";
import LobbyCalendar from "./LobbyCalendar";
import AssistantInput from "./AssistantInput";

export default function Workspace({ activeMenu }) {
  if (activeMenu === 'Lobby') {
    return (
      <div className="content-center">
        <h2 className="title">Calendario Plaza Meru</h2>
        <LobbyCalendar />
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

  // Vista por defecto para otros menús
  return (
    <div className="content-center">
      <h2 className="title">{activeMenu}</h2>
      <p className="muted">Área de trabajo — {activeMenu}</p>
    </div>
  );
}