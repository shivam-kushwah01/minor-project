import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, imageSrc } from "../api.js";

const FILTERS = [
  ["fa-solid fa-fire", "Trending"],
  ["fa-solid fa-bed", "Rooms"],
  ["fa-brands fa-fort-awesome", "castle"],
  ["fa-solid fa-person-swimming", "With pools"],
  ["fa-solid fa-campground", "camping"],
  ["fa-solid fa-water", "Near ghats"],
];

export default function Home() {
  const [listings, setListings] = useState(null);
  const [error, setError] = useState(null);
  const [showTax, setShowTax] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    api("/listings", { signal: ctrl.signal })
      .then(setListings)
      .catch((e) => e.name !== "AbortError" && setError(e.message));
    return () => ctrl.abort();
  }, []);

  return (
    <>
      <div className="filters">
        {FILTERS.map(([icon, label]) => (
          <div className="filter" key={label}>
            <div><i className={icon}></i></div>
            <p>{label}</p>
          </div>
        ))}
        <div className="filter-check">
          <div className="form-check-reverse form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="taxSwitch"
              checked={showTax}
              onChange={(e) => setShowTax(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="taxSwitch"> Display with taxes</label>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="listings">
        {listings === null && !error &&
          Array.from({ length: 6 }).map((_, i) => (
            <div className="card listing-card placeholder-glow" key={i}>
              <div className="placeholder w-100 rounded-4" style={{ height: "20rem" }}></div>
              <p className="placeholder col-6 mt-2"></p>
            </div>
          ))}

        {listings?.map((list) => (
          <div className="card listing-card" key={list._id}>
            <Link to={`/listing/${list._id}`} className="listing-link">
              <img src={imageSrc(list.imageUrl?.url)} className="card-img-top" alt={list.Title} style={{ height: "20rem", objectFit: "cover" }} loading="lazy" />
              <div className="card-img-overlay"></div>
              <div className="card-body">
                <p className="card-text">
                  <b>{list.Title}</b>
                  <br />
                  &#8377; {list.Price ? list.Price.toLocaleString("en-IN") : "Price not available"} / Night
                  {showTax && <i> +18% GST</i>}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
