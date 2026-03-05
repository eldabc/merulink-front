import { createContext, useContext, useState } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null);

  const showNotification = (title, message, type) => {
    setNotif({ title, message, type });

    setTimeout(() => setNotif(null), 5000);
  };

  const closeNotification = () => setNotif(null);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Mostrar notificación si existe */}
      {notif && (
        <Notification
          title={notif.title}
          message={notif.message}
          onClose={closeNotification}
          type={notif.type}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
