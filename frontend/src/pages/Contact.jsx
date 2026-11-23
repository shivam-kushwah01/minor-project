import { useState } from "react";
import { Link } from "react-router-dom";
import InfoPage from "../components/InfoPage.jsx";
import { SITE } from "../siteInfo.js";

const TOPICS = ["General question", "Problem with my account", "Listing / hosting", "Report a listing", "Feedback"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [validated, setValidated] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // No email service on the backend yet, so the form opens the visitor's email app
  // with everything filled in.
  function onSubmit(e) {
    e.preventDefault();
    setValidated(true);
    if (!e.currentTarget.checkValidity()) return;
    const subject = `[${form.topic}] from ${form.name}`;
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <InfoPage title="Contact us" subtitle="Questions, feedback or trouble with a listing? We're happy to help.">
      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-card">
            <i className="fa-regular fa-envelope"></i>
            <h3>Email</h3>
            <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
          </div>
          <div className="info-card">
            <i className="fa-regular fa-clock"></i>
            <h3>Support hours</h3>
            <p>{SITE.supportHours}</p>
          </div>
          <div className="info-card">
            <i className="fa-solid fa-location-dot"></i>
            <h3>Office</h3>
            <p>{SITE.city}</p>
          </div>
          <p className="text-muted small mt-2">
            Looking for a quick answer? Check the <Link to="/help">Help centre</Link>.
          </p>
        </div>

        <form className={`contact-form ${validated ? "was-validated" : ""}`} onSubmit={onSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="c-name" className="form-label">Your name</label>
            <input id="c-name" className="form-control" required value={form.name} onChange={set("name")} />
            <div className="invalid-feedback">Please enter your name.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="c-email" className="form-label">Email</label>
            <input id="c-email" type="email" className="form-control" required value={form.email} onChange={set("email")} />
            <div className="invalid-feedback">Please enter a valid email.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="c-topic" className="form-label">Topic</label>
            <select id="c-topic" className="form-select" value={form.topic} onChange={set("topic")}>
              {TOPICS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="c-msg" className="form-label">Message</label>
            <textarea id="c-msg" rows="5" className="form-control" required minLength={10} value={form.message} onChange={set("message")}></textarea>
            <div className="invalid-feedback">Please write at least 10 characters.</div>
          </div>
          <button type="submit" className="btn btn-danger mb-0">
            <i className="fa-regular fa-paper-plane"></i> Send message
          </button>
          <p className="form-text mt-2">This opens your email app with your message ready to send.</p>
        </form>
      </div>
    </InfoPage>
  );
}
