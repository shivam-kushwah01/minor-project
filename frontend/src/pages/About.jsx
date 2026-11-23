import { Link } from "react-router-dom";
import InfoPage from "../components/InfoPage.jsx";
import { CATEGORIES } from "../categories.js";

export default function About() {
  return (
    <InfoPage title="About WonderLust" subtitle="Find a stay that feels like part of the journey.">
      <section>
        <h2>Our story</h2>
        <p>
          WonderLust started on the ghats of Maheshwar, a small temple town on the Narmada known for its fort,
          its handloom weavers and its evening aarti. Travellers kept asking the same question: <em>where should
          we stay?</em> The answer was rarely on a big booking site. So we built a simple place where local hosts
          can list their homestays, heritage havelis and riverside rooms, and guests can find them easily.
        </p>
        <p>
          Today WonderLust lists stays across India, from Rajasthan's palaces to Kerala's backwaters and
          Himalayan campsites, while keeping the same idea: honest listings, clear prices and real reviews.
        </p>
      </section>

      <section>
        <h2>What we believe in</h2>
        <div className="info-cards">
          <div className="info-card">
            <i className="fa-solid fa-indian-rupee-sign"></i>
            <h3>Transparent pricing</h3>
            <p>Turn on “Display total after taxes” to see the exact nightly price including GST, with no surprises.</p>
          </div>
          <div className="info-card">
            <i className="fa-solid fa-house-chimney-user"></i>
            <h3>Local hosts first</h3>
            <p>Anyone can list a property in minutes. Hosts manage their own listings and photos.</p>
          </div>
          <div className="info-card">
            <i className="fa-regular fa-star"></i>
            <h3>Real reviews</h3>
            <p>Only signed-in guests can leave a rating and review, so feedback comes from real people.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Explore by style of stay</h2>
        <div className="category-chips">
          {CATEGORIES.map((c) => (
            <Link key={c.key} to={`/?category=${c.key}`} className="category-chip">
              <i className={c.icon}></i> {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="info-cta">
        <h2>Have a place to share?</h2>
        <p>List your homestay, hotel or campsite on WonderLust. It's free.</p>
        <Link to="/listing/new" className="btn btn-danger">List your property</Link>
      </section>
    </InfoPage>
  );
}
