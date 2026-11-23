import { Link } from "react-router-dom";
import InfoPage from "../components/InfoPage.jsx";
import { SITE } from "../siteInfo.js";

export default function Privacy() {
  return (
    <InfoPage title="Privacy policy" subtitle={`How ${SITE.name} collects and uses your information.`} updated>
      <section>
        <h2>1. Information we collect</h2>
        <ul>
          <li><strong>Account details:</strong> your username, email address and password when you sign up. Passwords are stored only as a salted hash, never in plain text.</li>
          <li><strong>Content you add:</strong> listings (title, description, price, location, categories, photos) and reviews (rating and comment), together with which account created them.</li>
          <li><strong>Session cookie:</strong> a cookie that keeps you logged in. It expires after 7 days or when you log out.</li>
          <li><strong>Preferences on your device:</strong> whether “Display total after taxes” is switched on is saved in your browser's local storage, not on our servers.</li>
        </ul>
      </section>

      <section>
        <h2>2. How we use it</h2>
        <ul>
          <li>To create and secure your account and keep you logged in.</li>
          <li>To show your listings and reviews to other visitors, with your username shown as the host or reviewer.</li>
          <li>To respond when you contact us.</li>
        </ul>
        <p>We do not sell your personal information and we do not use advertising trackers.</p>
      </section>

      <section>
        <h2>3. What is public</h2>
        <p>
          Listings, listing photos, reviews and the username attached to them are visible to everyone.
          Your email address and password are never shown publicly.
        </p>
      </section>

      <section>
        <h2>4. Service providers</h2>
        <p>We use a small number of trusted providers to run the site:</p>
        <ul>
          <li><strong>MongoDB Atlas</strong> stores account, listing and review data.</li>
          <li><strong>Cloudinary</strong> stores and delivers listing photos.</li>
          <li><strong>Our hosting providers</strong> run the website and API.</li>
        </ul>
      </section>

      <section>
        <h2>5. Retention &amp; deletion</h2>
        <p>
          Hosts can delete their listings at any time, which also deletes the listing's photo and reviews.
          Reviewers can delete their reviews. To delete your account and associated data,{" "}
          <Link to="/contact">contact us</Link> from the email address on your account.
        </p>
      </section>

      <section>
        <h2>6. Your rights</h2>
        <p>
          You can ask us for a copy of your personal data, ask us to correct it, or ask us to delete it, in line
          with applicable Indian law including the Digital Personal Data Protection Act, 2023.
        </p>
      </section>

      <section>
        <h2>7. Contact</h2>
        <p>
          Questions about this policy: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, {SITE.company}, {SITE.city}.
        </p>
      </section>
    </InfoPage>
  );
}
