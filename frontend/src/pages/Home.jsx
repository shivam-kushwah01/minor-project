import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, imageSrc, onImageError } from "../api.js";
import { useApp } from "../context.jsx";
import { CATEGORIES } from "../categories.js";
import { formatINR, gstBreakdown } from "../gst.js";

export default function Home() {
  const { showTax, setShowTax } = useApp();
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "";
  const query = (params.get("q") || "").trim().toLowerCase();

  const [listings, setListings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    api("/listings", { signal: ctrl.signal })
      .then(setListings)
      .catch((e) => e.name !== "AbortError" && setError(e.message));
    return () => ctrl.abort();
  }, []);

  const visible = useMemo(() => {
    if (!listings) return [];
    return listings.filter((l) => {
      if (active && !(l.category || []).includes(active)) return false;
      if (query && !`${l.Title} ${l.Location}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [listings, active, query]);

  function toggleCategory(key) {
    const next = new URLSearchParams(params);
    if (!key || key === active) next.delete("category");
    else next.set("category", key);
    setParams(next);
  }

  function clearAll() {
    setParams({});
  }

  return (
    <>
      <div className="filters-bar">
        <div className="filters">
          <button
            type="button"
            className={`filter ${!active ? "active" : ""}`}
            onClick={() => toggleCategory("")}
            aria-pressed={!active}
          >
            <div><i className="fa-solid fa-earth-asia"></i></div>
            <p>All</p>
          </button>
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.key}
              className={`filter ${active === c.key ? "active" : ""}`}
              onClick={() => toggleCategory(c.key)}
              aria-pressed={active === c.key}
            >
              <div><i className={c.icon}></i></div>
              <p>{c.label}</p>
            </button>
          ))}
        </div>
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
            <label className="form-check-label" htmlFor="taxSwitch"> Display total after taxes</label>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {listings && (active || query) && (
        <div className="results-info">
          <span>
            {visible.length} {visible.length === 1 ? "stay" : "stays"}
            {query && <> matching “{params.get("q")}”</>}
          </span>
          <button type="button" className="btn btn-link p-0 mb-0" onClick={clearAll}>Clear filters</button>
        </div>
      )}

      <div className="listings">
        {listings === null && !error &&
          Array.from({ length: 8 }).map((_, i) => (
            <div className="card listing-card placeholder-glow" key={i}>
              <div className="placeholder w-100 rounded-4" style={{ height: "20rem" }}></div>
              <p className="placeholder col-8 mt-3"></p>
              <p className="placeholder col-5"></p>
            </div>
          ))}

        {visible.map((list) => {
          const price = gstBreakdown(list.Price);
          return (
            <div className="card listing-card" key={list._id}>
              <Link to={`/listing/${list._id}`} className="listing-link">
                <div className="listing-img-wrap">
                  <img src={imageSrc(list.imageUrl?.url)} onError={onImageError} className="card-img-top" alt={list.Title} loading="lazy" />
                  {(list.category || []).includes("trending") && (
                    <span className="listing-badge"><i className="fa-solid fa-fire"></i> Trending</span>
                  )}
                </div>
                <div className="card-body">
                  <p className="listing-title">{list.Title}</p>
                  {list.Location && <p className="listing-location"><i className="fa-solid fa-location-dot"></i> {list.Location}</p>}
                  <p className="listing-price">
                    {list.Price ? (
                      showTax ? (
                        <>
                          <b>{formatINR(price.total)}</b> / night <span className="tax-note">incl. {price.percent}% GST</span>
                        </>
                      ) : (
                        <>
                          <b>{formatINR(price.base)}</b> / night <span className="tax-note">+ taxes</span>
                        </>
                      )
                    ) : (
                      "Price not available"
                    )}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {listings && visible.length === 0 && (
        <div className="empty-state">
          <i className="fa-regular fa-compass"></i>
          <h5>No stays found</h5>
          <p className="text-muted">Try another category or search.</p>
          <button type="button" className="btn btn-outline-dark" onClick={clearAll}>Show all stays</button>
        </div>
      )}
    </>
  );
}
