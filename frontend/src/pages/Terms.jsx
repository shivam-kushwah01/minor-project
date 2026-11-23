import { Link } from "react-router-dom";
import InfoPage from "../components/InfoPage.jsx";
import { SITE } from "../siteInfo.js";

export default function Terms() {
  return (
    <InfoPage title="Terms & conditions" subtitle={`The rules for using ${SITE.name}.`} updated>
      <section>
        <h2>1. About these terms</h2>
        <p>
          By using {SITE.name} (operated by {SITE.company}) you agree to these terms. If you don't agree,
          please don't use the site.
        </p>
      </section>

      <section>
        <h2>2. Your account</h2>
        <ul>
          <li>You must provide a valid email address and keep your password secure.</li>
          <li>You are responsible for everything done through your account.</li>
          <li>One person, one account. Don't impersonate anyone else.</li>
        </ul>
      </section>

      <section>
        <h2>3. Listings (for hosts)</h2>
        <ul>
          <li>Only list properties you own or are authorised to offer.</li>
          <li>Descriptions, prices, locations and categories must be accurate and kept up to date.</li>
          <li>Only upload photos of the actual property that you own or have the right to use.</li>
          <li>
            Prices are entered as the room tariff per night in Indian Rupees. GST is shown to guests at the
            applicable rate (currently 5% up to ₹7,500 per night and 18% above). Hosts are responsible for
            their own tax registration and compliance.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Reviews</h2>
        <p>
          Reviews must be honest and based on genuine experience. No abusive, discriminatory, misleading or
          promotional content. We may remove reviews that break these rules.
        </p>
      </section>

      <section>
        <h2>5. Prohibited use</h2>
        <ul>
          <li>Posting false, illegal, offensive or infringing content.</li>
          <li>Attempting to access other users' accounts or interfere with the site's security or operation.</li>
          <li>Scraping or automated bulk access without permission.</li>
        </ul>
      </section>

      <section>
        <h2>6. Content you post</h2>
        <p>
          You keep ownership of the listings, photos and reviews you post. You allow {SITE.name} to display them
          on the site. We may remove content or suspend accounts that violate these terms.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer</h2>
        <p>
          {SITE.name} is a platform that connects guests with hosts. Hosts are responsible for their properties and
          listings. We do our best to keep the site accurate and available but provide it “as is”, without guarantees.
        </p>
      </section>

      <section>
        <h2>8. Changes &amp; governing law</h2>
        <p>
          We may update these terms; the date above shows the latest version. These terms are governed by the laws of
          India. Questions? <Link to="/contact">Contact us</Link>.
        </p>
      </section>
    </InfoPage>
  );
}
