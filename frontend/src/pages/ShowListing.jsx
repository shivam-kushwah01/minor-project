import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, imageSrc } from "../api.js";
import { useApp } from "../context.jsx";
import NotFound from "./NotFound.jsx";

export default function ShowListing() {
  const { id } = useParams();
  const { user, setFlash } = useApp();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setList(null);
    setError(null);
    api(`/listings/${id}`).then(setList).catch(setError);
  }, [id]);

  if (error?.status === 404) return <NotFound />;
  if (error) return <div className="alert alert-danger mt-4">{error.message}</div>;
  if (!list) return <p className="text-center mt-5 text-muted">Loading…</p>;

  const isOwner = user && list.owner && user._id === list.owner._id;

  async function deleteListing() {
    if (!confirm("Delete this listing?")) return;
    try {
      const d = await api(`/listings/${id}`, { method: "DELETE" });
      setFlash("success", d.message);
      navigate("/");
    } catch (err) {
      setFlash("error", err.message);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    setValidated(true);
    if (!e.currentTarget.checkValidity()) return;
    setBusy(true);
    try {
      const d = await api(`/listings/${id}/reviews`, { method: "POST", body: { rating, comment } });
      setList((l) => ({ ...l, review: [...l.review, d.review] }));
      setComment("");
      setRating(1);
      setValidated(false);
    } catch (err) {
      setFlash("error", err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteReview(reviewId) {
    try {
      const d = await api(`/listings/${id}/reviews/${reviewId}`, { method: "DELETE" });
      setList((l) => ({ ...l, review: l.review.filter((r) => r._id !== reviewId) }));
      setFlash("success", d.message);
    } catch (err) {
      setFlash("error", err.message);
    }
  }

  return (
    <div className="container m-0 d-flex justify-content-center">
      <div className="col-lg-8 col-md-10 col-sm-12 text-center">
        <h1 className="mb-4 mt-3 fw-bold">{list.Title}</h1>

        <div className="card mx-auto mb-4" style={{ maxWidth: 700, backgroundColor: "transparent", border: "none" }}>
          <img
            src={imageSrc(list.imageUrl?.url)}
            className="card-img-top img-fluid"
            alt={list.Title}
            style={{ height: "25rem", objectFit: "cover" }}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/fort.webp"; }}
          />
          <div className="card-body text-start">
            <p className="card-text">
              <strong>Owner:</strong> {list.owner?.username ?? "Unknown"}<br />
              {list.Description}<br />
              &#8377; {list.Price ? list.Price.toLocaleString("en-IN") : "Price not available"} / Night<br />
              {list.Location}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5">
            <Link to={`/listing/${id}/edit`} className="btn btn-danger px-4">Edit</Link>
            <button className="btn btn-dark px-4" onClick={deleteListing}>Delete</button>
          </div>
        )}

        <div className="mx-auto" style={{ maxWidth: 700, textAlign: "left" }}>
          <hr className="my-4" />

          {user && (
            <>
              <h4 className="mb-3 text-center">Leave a Review</h4>
              <form onSubmit={submitReview} noValidate className={`mb-5 ${validated ? "was-validated" : ""}`}>
                <div className="mb-3">
                  <label className="form-label">Rating</label><br />
                  <fieldset className="starability-slot">
                    <input type="radio" id="no-rate" className="input-no-rate" name="rating" value="1" checked={false} readOnly aria-label="No rating." />
                    {[["Terrible", 1], ["Not good", 2], ["Average", 3], ["Very good", 4], ["Amazing", 5]].map(([title, n]) => (
                      <Fragment key={n}>
                        <input type="radio" id={`rate${n}`} name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} />
                        <label htmlFor={`rate${n}`} title={title}>{n} star{n > 1 ? "s" : ""}</label>
                      </Fragment>
                    ))}
                  </fieldset>
                </div>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Comment</label>
                  <textarea id="comment" rows="4" className="form-control" required value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                  <div className="invalid-feedback">Please enter a comment.</div>
                </div>
                <div className="text-center">
                  <button className="btn btn-outline-dark px-5" disabled={busy}>{busy ? "Submitting…" : "Submit"}</button>
                </div>
              </form>
            </>
          )}

          <div>
            <h5 className="fw-semibold mb-3">All Reviews</h5>
            {list.review.length === 0 && <p className="text-muted">No reviews yet.</p>}
            {list.review.map((review) => (
              <div className="card mb-3 shadow-sm" key={review._id}>
                <div className="card-body p-3">
                  <h6 className="card-title">@{review.author?.username ?? "unknown"}</h6>
                  <p className="card-text mb-1">{review.comment}</p>
                  <p className="starability-result" data-rating={review.rating}></p>
                </div>
                {user && (isOwner || user._id === review.author?._id) && (
                  <div className="px-3 pb-3">
                    <button className="btn btn-sm btn-dark mb-0" onClick={() => deleteReview(review._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
