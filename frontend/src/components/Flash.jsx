import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../context.jsx";

export default function Flash() {
  const { flash, setFlash } = useApp();
  const location = useLocation();
  const firstPath = useRef(location.pathname);

  // Like server-side flash: a message survives one navigation, then clears.
  useEffect(() => {
    if (!flash) {
      firstPath.current = location.pathname;
      return;
    }
    if (location.pathname !== firstPath.current) {
      firstPath.current = location.pathname;
      const t = setTimeout(() => setFlash(null), 4000);
      return () => clearTimeout(t);
    }
  }, [location.pathname, flash, setFlash]);

  if (!flash) return null;
  const cls = flash.type === "success" ? "alert-success" : "alert-warning";
  return (
    <div className={`alert ${cls} alert-dismissible fade show col-md-6 offset-md-3 mt-3`} role="alert">
      {flash.message}
      <button type="button" className="btn-close" aria-label="Close" onClick={() => setFlash(null)}></button>
    </div>
  );
}
