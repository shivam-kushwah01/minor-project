import { useState } from "react";
import { Link } from "react-router-dom";
import InfoPage from "../components/InfoPage.jsx";
import { api } from "../api.js";
import { useApp } from "../context.jsx";

const TOPICS = ["General question", "Problem with my account", "Listing / hosting", "Report a listing", "Feedback"];

export default function Contact() {
  const { user } = useApp();
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setValidated(true);
    setError(null);
    if (!e.currentTarget.checkValidity()) return;
    setBusy(true);
    try {
      const d = await api("/contact", { method: "POST", body: form });
      setSent(d.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
    setValidated(false);
    setSent(null);
  }

  return (
    <InfoPage title="Contact us" subtitle="Questions, feedback or trouble with a listing? Send us a message.">
      <div className="contact-wrap">
        {sent ? (
          <div className="contact-form contact-success">
            <i className="fa-regular fa-circle-check"></i>
            <h2>Message sent</h2>
            <p>{sent}</p>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <Link to="/" className="btn btn-danger mb-0">Back to stays</Link>
              <button type="button" className="btn btn-outline-dark mb-0" onClick={reset}>Send another</button>
            </div>
          </div>
        ) : (
          <form className={`contact-form ${validated ? "was-validated" : ""}`} onSubmit={onSubmit} noValidate>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="contact-fields">
              <div>
                <label htmlFor="c-name" className="form-label">Your name</label>
                <input id="c-name" className="form-control" required maxLength={100} autoComplete="name"
                  placeholder={user?.username || ""} value={form.name} onChange={set("name")} />
                <div className="invalid-feedback">Please enter your name.</div>
              </div>
              <div>
                <label htmlFor="c-email" className="form-label">Email</label>
                <input id="c-email" type="email" className="form-control" required maxLength={200} autoComplete="email"
                  value={form.email} onChange={set("email")} />
                <div className="invalid-feedback">Please enter a valid email so we can reply.</div>
              </div>
              <div className="span-2">
                <label htmlFor="c-topic" className="form-label">Topic</label>
                <select id="c-topic" className="form-select" value={form.topic} onChange={set("topic")}>
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="span-2">
                <label htmlFor="c-msg" className="form-label">Message</label>
                <textarea id="c-msg" rows="6" className="form-control" required minLength={10} maxLength={5000}
                  placeholder="How can we help?" value={form.message} onChange={set("message")}></textarea>
                <div className="invalid-feedback">Please write at least 10 characters.</div>
              </div>
            </div>
            <button type="submit" className="btn btn-danger w-100 mt-4 mb-0" disabled={busy}>
              {busy ? (
                <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Sending…</>
              ) : (
                <><i className="fa-regular fa-paper-plane me-2"></i>Send message</>
              )}
            </button>
            <p className="form-text text-center mt-3 mb-0">
              Looking for a quick answer? Check the <Link to="/help">Help centre</Link>.
            </p>
          </form>
        )}
      </div>
    </InfoPage>
  );
}
