import { Link } from "react-router-dom";
import { CATEGORIES } from "../categories.js";
import { SITE } from "../siteInfo.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <i className="fa-regular fa-compass"></i> {SITE.name}
            </Link>
            <p>
              Handpicked stays across India, from riverside homestays on the Narmada ghats to heritage
              havelis, pool villas and mountain campsites.
            </p>
            <ul className="footer-facts">
              <li><i className="fa-solid fa-indian-rupee-sign"></i> Prices in INR, GST shown upfront</li>
              <li><i className="fa-regular fa-star"></i> Reviews only from signed-in guests</li>
            </ul>
          </div>

          <div>
            <h6>Explore</h6>
            <ul>
              <li><Link to="/">All stays</Link></li>
              {CATEGORIES.map((c) => (
                <li key={c.key}><Link to={`/?category=${c.key}`}>{c.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h6>Hosting</h6>
            <ul>
              <li><Link to="/listing/new">List your property</Link></li>
              <li><Link to="/help#hosting">Hosting guide</Link></li>
              <li><Link to="/help#gst">How GST is calculated</Link></li>
            </ul>
            <h6 className="mt-4">Company</h6>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h6>Support</h6>
            <ul>
              <li><Link to="/help">Help centre &amp; FAQ</Link></li>
              <li><Link to="/privacy">Privacy policy</Link></li>
              <li><Link to="/terms">Terms &amp; conditions</Link></li>
            </ul>
            <div className="footer-contact">
              <p><i className="fa-regular fa-envelope"></i> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
              <p><i className="fa-solid fa-location-dot"></i> {SITE.city}</p>
              <p><i className="fa-regular fa-clock"></i> {SITE.supportHours}</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} {SITE.company}. All rights reserved.</span>
          <span className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/help">Help</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
