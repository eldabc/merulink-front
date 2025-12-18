import React, { Suspense, lazy } from "react";
import { Routes, Route } from 'react-router-dom';

const LobbyCalendar = lazy(() => import("./LobbyCalendar"));
const AssistantInput = lazy(() => import("./AssistantInput"));
const EmployeeList = lazy(() => import("./Employee/EmployeeList"));
const DepartmentList = lazy(() => import("./Department/DepartmentList"));
const SubDepartmentList = lazy(() => import("./SubDepartment/SubDepartmentList"));
const PositionList = lazy(() => import("./Positions/PositionList"));
const EventsPage = lazy(() => import("./Events/EventsPage"));

export default function Workspace({ activeMenu, activePath }) {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <Routes>
        <Route path="/" element={<div className="content-center"><LobbyCalendar /></div>} />
        <Route path="/ia" element={<div className="ia-workspace"><AssistantInput /></div>} />

        {/* RRHH */}
        <Route path="/empleados" element={<div className="main-workspace"><EmployeeList /></div>} />
        <Route path="/empleados/departamentos" element={<div className="main-workspace"><DepartmentList /></div>} />
        <Route path="/empleados/sub-departamentos" element={<div className="main-workspace"><SubDepartmentList /></div>} />
        <Route path="/empleados/cargos" element={<div className="main-workspace"><PositionList /></div>} />
        {/* Eventos */}
        <Route path="/eventos/*" element={<EventsPage />} />

        {/* Fallback to existing behavior when route not matched */}
        <Route path="*" element={<DefaultWorkspace activeMenu={activeMenu} />} />
      </Routes>
    </Suspense>
  );
}

function DefaultWorkspace({ activeMenu }) {
  return (
    <div className="content-center">
      <h2 className="title">{activeMenu}</h2>
      <p className="muted">Área de trabajo — {activeMenu}</p>
    </div>
  );
}