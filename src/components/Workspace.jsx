import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from 'react-router-dom';
const Calendar = lazy(() => import("./Calendar/Calendar"));
const AssistantInput = lazy(() => import("./AssistantInput"));
const DepartmentPage = lazy(() => import("./Department/DepartmentPage"));
const SubDepartmentList = lazy(() => import("./SubDepartment/SubDepartmentList"));
const PositionList = lazy(() => import("./Positions/PositionList"));
const LockerRoomPage = lazy(() => import("./LockerRoom/LockerRoomPage"));
const PadlockPage = lazy(() => import("./Padlock/PadlockPage"));
const EventsPage = lazy(() => import("./Events/EventsPage"));
const DefaultWorkspace = lazy(() => import("./DefaultWorkspace"));
const PadlockPatternPage = lazy(() => import("./PadlockPattern/PadlockPatternPage"));
const LockerAssignPage = lazy(() => import("./LockerAssign/LockerAssignPage"));
const EmployeePage = lazy(() => import("./Employee/EmployeePage"));

import { EventProvider } from "../context/EventContext";
import { LockerRoomProvider } from "../context/LockerRoomContext";
import { PadlockProvider } from "../context/PadlockContext";
import { LockerAssignProvider } from "../context/LockerAssignContext";
import { EmployeeProvider } from '../context/EmployeeContext'; 
import { DepartmentProvider } from '../context/DepartmentContext'; 
import { PadlockPatternProvider } from '../context/PadlockPatternContext'; 
import { useNotification } from "../context/NotificationContext";

const EventLayout = ({ showNotification }) => (
  <EventProvider showNotification={showNotification}>
    <Outlet />
  </EventProvider>
);

const LockerLayout = () => (
  <LockerRoomProvider>
    <Outlet />
  </LockerRoomProvider>
);

const PadlockLayout = () => (
  <PadlockProvider>
    <Outlet />
  </PadlockProvider>
);

const LockerAssignLayout = () => (
  <LockerAssignProvider>
    <Outlet />
  </LockerAssignProvider>
);

const EmployeeLayout = () => (
  <EmployeeProvider>
    <Outlet />
  </EmployeeProvider>
);

const DepartmentLayout = () => (
  <DepartmentProvider>
    <Outlet />
  </DepartmentProvider>
)

const PadlockPatternLayout = () => (
  <PadlockPatternProvider>
    <Outlet />
  </PadlockPatternProvider>
);

export default function Workspace({ activeMenu, activePath }) {
  const { showNotification } = useNotification();
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <Routes>
        
        <Route path="/ia" element={<div className="ia-workspace"><AssistantInput /></div>} />

        {/* RRHH */}
        <Route element={<EmployeeLayout />}>
          <Route path="/empleados/*" element={<div className="main-workspace"><EmployeePage /></div>} />
        </Route>

        {/* Departamentos */}
        <Route element={<DepartmentLayout />}>
          <Route path="/empleados/departamentos/*" element={<div className="main-workspace"><DepartmentPage /></div>} />
        </Route>

        <Route path="/empleados/sub-departamentos" element={<div className="main-workspace"><SubDepartmentList /></div>} />
        <Route path="/empleados/cargos" element={<div className="main-workspace"><PositionList /></div>} />
        
        {/* Locker Room */}
        <Route element={<LockerLayout />}>
          <Route path="/empleados/vestuarios/lockers/*" element={<LockerRoomPage/> } />
        </Route>

        {/* Padlock */}
        <Route element={<PadlockLayout />}>
          <Route path="/empleados/vestuarios/candados/*" element={<PadlockPage/> } />
        </Route>

        {/* Padlock Pattern */}
        <Route element={<PadlockPatternLayout />}>
          <Route path="/empleados/vestuarios/candados/patrones/*" element={<PadlockPatternPage/> } />
        </Route>


        {/* LockerAssign */}
        <Route element={<LockerAssignLayout />}>
          <Route path="/empleados/vestuarios/casilleros/*" element={<LockerAssignPage/> } />
        </Route>

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