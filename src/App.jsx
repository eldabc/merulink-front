import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from './context/AuthContext';
import { GlobalDataProvider } from "./context/GlobalDataContext";

import Workspace from "./components/Workspace";
import ParticlesCanvas from "./components/Shared/ParticlesCanvas";

export default function App() {
  return (
    <div className="merulink-root">
      <AuthProvider>
        <GlobalDataProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Workspace />
            </BrowserRouter>

            <ParticlesCanvas />  
          </NotificationProvider>
        </GlobalDataProvider>
      </AuthProvider>
    </div>
  );
}