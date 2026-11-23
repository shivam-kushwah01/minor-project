import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api.js";

const AppContext = createContext(null);

const TAX_KEY = "wonderlust:showTax";
const readTaxPref = () => {
  try {
    return localStorage.getItem(TAX_KEY) === "1";
  } catch {
    return false;
  }
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [flash, setFlashState] = useState(null); // { type: "success" | "error", message }
  const [showTax, setShowTaxState] = useState(readTaxPref);

  useEffect(() => {
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoaded(true));
  }, []);

  const setFlash = useCallback((type, message) => setFlashState(message ? { type, message } : null), []);

  const setShowTax = useCallback((value) => {
    setShowTaxState(value);
    try {
      localStorage.setItem(TAX_KEY, value ? "1" : "0");
    } catch {
      /* storage unavailable: preference just isn't remembered */
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, authLoaded, flash, setFlash, showTax, setShowTax }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
