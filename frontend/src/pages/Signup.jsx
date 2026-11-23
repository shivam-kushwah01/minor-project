import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context.jsx";

export default function Signup() {
  const { setUser, setFlash } = useApp();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setValidated(true);
    if (!e.currentTarget.checkValidity()) return;
    setBusy(true);
    try {
      const d = await api("/auth/signup", { method: "POST", body: values });
      setUser(d.user);
      setFlash("success", d.message);
      navigate("/");
    } catch (err) {
      setFlash("error", err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-center mt-3">Sign Up</h1>
      <div className="row mt-3">
        <div className="col-md-6 offset-md-3">
          <form onSubmit={onSubmit} noValidate className={validated ? "was-validated" : ""}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input id="username" type="text" className="form-control" required pattern="[A-Za-z0-9_]{3,15}" autoComplete="username" value={values.username} onChange={set("username")} />
              <div className="invalid-feedback">Enter a valid username (3-15 characters, no special symbols).</div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" className="form-control" required autoComplete="email" value={values.email} onChange={set("email")} />
              <div className="invalid-feedback">Enter a valid email address.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" className="form-control" required minLength={6} autoComplete="new-password" value={values.password} onChange={set("password")} />
              <div className="invalid-feedback">Password must be at least 6 characters long.</div>
            </div>
            <button type="submit" className="btn btn-success" disabled={busy}>{busy ? "Signing up…" : "Sign Up"}</button>
          </form>
        </div>
      </div>
    </>
  );
}
