import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context.jsx";
import AuthLayout, { PasswordInput } from "../components/AuthLayout.jsx";

const IMAGE = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000&q=75&fm=jpg";

function passwordStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 6) return { level: 1, label: "Too short", cls: "weak" };
  if (score <= 2) return { level: 1, label: "Weak", cls: "weak" };
  if (score === 3) return { level: 2, label: "Fair", cls: "fair" };
  if (score === 4) return { level: 3, label: "Good", cls: "good" };
  return { level: 4, label: "Strong", cls: "strong" };
}

export default function Signup() {
  const { user, authLoaded, setUser, setFlash } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (authLoaded && user && !busy) return <Navigate to="/" replace />;

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const strength = passwordStrength(values.password);

  async function onSubmit(e) {
    e.preventDefault();
    setValidated(true);
    setError(null);
    if (!e.currentTarget.checkValidity()) return;
    setBusy(true);
    try {
      const d = await api("/auth/signup", {
        method: "POST",
        body: { ...values, username: values.username.trim(), email: values.email.trim() },
      });
      setFlash("success", d.message);
      setUser(d.user);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setValidated(false);
      setError(/already registered|exists/i.test(err.message) ? "That username is already taken. Try another one." : err.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join WonderLust to list stays and share reviews. It's free."
      image={IMAGE}
      footer={<>Already have an account? <Link to="/login" state={location.state}>Log in</Link></>}
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
            <input id="username" type="text" className="form-control" required pattern="[A-Za-z0-9_]{3,15}"
              autoComplete="username" autoFocus value={values.username} onChange={set("username")} />
            <div className="invalid-feedback">3–15 characters: letters, numbers or underscores.</div>
          </div>
          {!validated && <div className="form-text">3–15 characters: letters, numbers or underscores.</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="fa-regular fa-envelope"></i></span>
            <input id="email" type="email" className="form-control" required autoComplete="email"
              value={values.email} onChange={set("email")} />
            <div className="invalid-feedback">Enter a valid email address.</div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <PasswordInput id="password" autoComplete="new-password" minLength={6} value={values.password}
            onChange={set("password")} invalidText="Password must be at least 6 characters long." />
          {strength && (
            <div className={`pw-strength ${strength.cls}`} aria-live="polite">
              <div className="pw-bars">
                {[1, 2, 3, 4].map((i) => <span key={i} className={i <= strength.level ? "on" : ""}></span>)}
              </div>
              <small>{strength.label}</small>
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-danger auth-submit" disabled={busy}>
          {busy ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Creating account…</> : "Sign up"}
        </button>
        <p className="auth-terms">
          By signing up you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy policy</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}
