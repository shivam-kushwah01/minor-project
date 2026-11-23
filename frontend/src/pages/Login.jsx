import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context.jsx";
import AuthLayout, { PasswordInput } from "../components/AuthLayout.jsx";

const IMAGE = "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000&q=75&fm=jpg";

export default function Login() {
  const { user, authLoaded, setUser, setFlash } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (authLoaded && user && !busy) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setValidated(true);
    setError(null);
    if (!e.currentTarget.checkValidity()) return;
    setBusy(true);
    try {
      const d = await api("/auth/login", { method: "POST", body: { username: username.trim(), password } });
      setFlash("success", d.message);
      setUser(d.user);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setValidated(false);
      setError(err.status === 401 ? "Incorrect username or password." : err.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to list your property and leave reviews."
      image={IMAGE}
      footer={<>New to WonderLust? <Link to="/signup" state={location.state}>Create an account</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className={validated ? "was-validated" : ""}>
        {error && (
          <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="fa-regular fa-user"></i></span>
            <input id="username" type="text" className="form-control" required autoComplete="username" autoFocus
              value={username} onChange={(e) => setUsername(e.target.value)} />
            <div className="invalid-feedback">Please enter your username.</div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <PasswordInput id="password" autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} invalidText="Please enter your password." />
        </div>
        <button type="submit" className="btn btn-danger auth-submit" disabled={busy}>
          {busy ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Logging in…</> : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
