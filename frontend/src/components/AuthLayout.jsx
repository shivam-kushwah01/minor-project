import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../siteInfo.js";

const PERKS = [
  ["fa-solid fa-map-location-dot", "Stays across India, from ghats to the Himalayas"],
  ["fa-solid fa-indian-rupee-sign", "Clear nightly prices with GST shown upfront"],
  ["fa-regular fa-star", "Real reviews from signed-in guests"],
];

// Two-panel card used by the Login and Sign up pages
export default function AuthLayout({ title, subtitle, image, children, footer }) {
  useEffect(() => {
    document.title = `${title} · ${SITE.name}`;
    return () => {
      document.title = SITE.name;
    };
  }, [title]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <aside className="auth-aside" style={{ backgroundImage: `url(${image})` }}>
          <div className="auth-aside-inner">
            <Link to="/" className="auth-aside-brand">
              <i className="fa-regular fa-compass"></i> {SITE.name}
            </Link>
            <ul>
              {PERKS.map(([icon, text]) => (
                <li key={text}><i className={icon}></i> {text}</li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="auth-main">
          <div className="auth-head">
            <i className="fa-regular fa-compass auth-logo"></i>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="auth-foot">{footer}</div>}
        </section>
      </div>
    </div>
  );
}

// Password field with a show/hide toggle
export function PasswordInput({ id, value, onChange, autoComplete, minLength, invalidText }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-group has-validation">
      <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
      <input
        id={id}
        type={show ? "text" : "password"}
        className="form-control"
        required
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="input-group-text password-toggle"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        title={show ? "Hide password" : "Show password"}
      >
        <i className={show ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
      </button>
      {invalidText && <div className="invalid-feedback">{invalidText}</div>}
    </div>
  );
}
