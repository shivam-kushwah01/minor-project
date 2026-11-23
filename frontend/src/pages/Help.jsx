import { Link } from "react-router-dom";
import InfoPage from "../components/InfoPage.jsx";

const FAQ = [
  {
    id: "account",
    title: "Your account",
    items: [
      [
        "How do I create an account?",
        <>Click <Link to="/signup">Sign Up</Link>, choose a username (3–15 letters, numbers or underscores), enter your email and a password of at least 6 characters.</>,
      ],
      [
        "I can't stay logged in. What should I do?",
        "Make sure cookies are enabled for this site. Private/incognito windows and some strict privacy settings can block the login cookie.",
      ],
    ],
  },
  {
    id: "finding",
    title: "Finding a stay",
    items: [
      [
        "How do the filters work?",
        "Use the icons at the top of the home page (Trending, Rooms, Castles, With pools, Camping, Near ghats) to show only that type of stay. Click “All” or the same icon again to see everything.",
      ],
      [
        "How do I search for a place?",
        "Type a city, state or property name in the search bar, e.g. “Goa” or “Jaipur”. The search matches listing titles and locations.",
      ],
    ],
  },
  {
    id: "gst",
    title: "Prices & GST",
    items: [
      [
        "Are prices shown with taxes?",
        "Prices on the cards are the room tariff per night. Turn on “Display total after taxes” to see the total including GST. Each listing page also shows the full breakdown.",
      ],
      [
        "How is GST calculated?",
        <>GST on hotel accommodation in India depends on the room tariff per night: <strong>5%</strong> for tariffs up to ₹7,500 and <strong>18%</strong> for tariffs above ₹7,500. Example: a ₹6,000 room costs ₹6,300 per night including GST; a ₹10,000 room costs ₹11,800.</>,
      ],
    ],
  },
  {
    id: "hosting",
    title: "Hosting",
    items: [
      [
        "How do I list my property?",
        <>Log in and click <Link to="/listing/new">Add New Listings</Link>. Add a title, description, price per night, location, one or more categories and a photo (JPG, PNG, WEBP or GIF, up to 5 MB).</>,
      ],
      [
        "How do I edit or delete my listing?",
        "Open your listing while logged in. As the owner, you'll see Edit and Delete buttons below the photo. You can also replace the photo when editing.",
      ],
      [
        "Which category should I choose?",
        "Pick every category that genuinely fits. A riverside heritage hotel with a pool could be Castles, Near ghats and With pools. Accurate categories help guests find you.",
      ],
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    items: [
      ["Who can leave a review?", "Any logged-in user can rate a stay from 1 to 5 stars and add a comment."],
      ["Can a review be removed?", "The person who wrote a review and the owner of the listing can both delete it."],
    ],
  },
];

export default function Help() {
  return (
    <InfoPage title="Help centre" subtitle="Answers to common questions about WonderLust.">
      <nav className="info-toc">
        {FAQ.map((s) => (
          <a key={s.id} href={`#${s.id}`}>{s.title}</a>
        ))}
      </nav>

      {FAQ.map((section) => (
        <section key={section.id} id={section.id}>
          <h2>{section.title}</h2>
          {section.items.map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <div>{a}</div>
            </details>
          ))}
        </section>
      ))}

      <section className="info-cta">
        <h2>Still need help?</h2>
        <p>Our team usually replies within one working day.</p>
        <Link to="/contact" className="btn btn-danger">Contact us</Link>
      </section>
    </InfoPage>
  );
}
