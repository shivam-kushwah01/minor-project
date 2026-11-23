import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context.jsx";

export default function Login() {
  const { setUser, setFlash } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setValidated(true);
    if (!e.currentTarget.checkValidity()) return;
    setBusy(true);
    try {
      const d = await api("/auth/login", { method: "POST", body: { username, password } });
      setUser(d.user);
      setFlash("success", d.message);
      navigate(location.state?.from || "/");
    } catch (err) {
      setFlash("error", err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-center mt-3">Login</h1>
      <div className="row mt-3">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={onSubmit} noValidate className={validated ? "was-validated" : ""}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input id="username" type="text" className="form-control" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <div className="invalid-feedback">Please enter your username.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" className="form-control" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="invalid-feedback">Please enter your password.</div>
            </div>
            <button type="submit" className="btn btn-success" disabled={busy}>{busy ? "Logging in…" : "Login"}</button>
          </form>
        </div>
      </div>
    </>
  );
}
