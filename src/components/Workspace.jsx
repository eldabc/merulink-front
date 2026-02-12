import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from 'react-router-dom';
const Calendar = lazy(() => import("./Calendar/Calendar"));
const AssistantInput = lazy(() => import("./AssistantInput"));
const EmployeeList = lazy(() => import("./Employee/EmployeeList"));
const DepartmentList = lazy(() => import("./Department/DepartmentList"));
const SubDepartmentList = lazy(() => import("./SubDepartment/SubDepartmentList"));
const PositionList = lazy(() => import("./Positions/PositionList"));
const LockerRoomPage = lazy(() => import("./LockerRoom/LockerRoomPage"));
const EventsPage = lazy(() => import("./Events/EventsPage"));
import { EventProvider } from "../context/EventContext";
import { useNotification } from "../context/NotificationContext";

const EventLayout = ({ showNotification }) => (
  <EventProvider showNotification={showNotification}>
    <Outlet />
  </EventProvider>
);

export default function Workspace({ activeMenu, activePath }) {
    const { showNotification } = useNotification();
  
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <Routes>
        
        <Route path="/ia" element={<div className="ia-workspace"><AssistantInput /></div>} />

        {/* RRHH */}
        <Route path="/empleados" element={<div className="main-workspace"><EmployeeList /></div>} />
        <Route path="/empleados/departamentos" element={<div className="main-workspace"><DepartmentList /></div>} />
        <Route path="/empleados/sub-departamentos" element={<div className="main-workspace"><SubDepartmentList /></div>} />
        <Route path="/empleados/cargos" element={<div className="main-workspace"><PositionList /></div>} />
        
        {/* Locker Room */}
        <Route path="/empleados/vestuarios/lockers" element={<LockerRoomPage/> } />

        {/* Calendario - Eventos */}
        <Route element={<EventLayout showNotification={showNotification} />}>
          <Route path="/" element={<div className="content-center"><Calendar /></div>} />
          <Route path="/eventos/*" element={<EventsPage />} />
        </Route>

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