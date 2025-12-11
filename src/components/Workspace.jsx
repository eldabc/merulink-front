import React from "react";
import LobbyCalendar from "./LobbyCalendar";
import AssistantInput from "./AssistantInput";
import EmployeeList from "./Employee/EmployeeList";
import DepartmentList from "./Department/DepartmentList";

export default function Workspace({ activeMenu, activePath }) {
  if (activeMenu === 'Lobby') {
    return (
      <div className="content-center">
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

  if (activeMenu === 'RRHH') {
    if (activePath.length === 0) {
      return (
        <div className="main-workspace">
          <EmployeeList />
        </div>
      );
    }else if (activePath[0] === 'Departamentos') {
      return (
        <div className="main-workspace">
          <DepartmentList />
        </div>
      );
    }
  }

  // Vista por defecto para otros menús
  return (
    <div className="content-center">
      <h2 className="title">{activeMenu}</h2>
      <p className="muted">Área de trabajo — {activeMenu}</p>
    </div>
  );
}