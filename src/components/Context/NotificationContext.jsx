import { createContext, useContext, useState } from "react";
import Notification from "../Notification";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null);

  const showNotification = (title, message) => {
    setNotif({ title, message });

    setTimeout(() => setNotif(null), 2500);
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
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
