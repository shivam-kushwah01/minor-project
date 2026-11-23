import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [flash, setFlashState] = useState(null); // { type: "success" | "error", message }

  useEffect(() => {
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoaded(true));
  }, []);

  const setFlash = useCallback((type, message) => setFlashState(message ? { type, message } : null), []);

  return (
    <AppContext.Provider value={{ user, setUser, authLoaded, flash, setFlash }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
