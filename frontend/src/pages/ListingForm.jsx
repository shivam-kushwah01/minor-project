import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context.jsx";
import { CATEGORIES } from "../categories.js";
import { formatINR, gstBreakdown } from "../gst.js";

const EMPTY = { title: "", description: "", price: "", location: "", category: [] };

export default function ListingForm({ edit = false }) {
  const { id } = useParams();
  const { user, setFlash } = useApp();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(edit);

  useEffect(() => {
    if (!edit) return;
    api(`/listings/${id}`)
      .then((l) => {
        if (!l.owner || l.owner._id !== user?._id) {
          setFlash("error", "You don't have permission to edit");
          return navigate(`/listing/${id}`, { replace: true });
        }
        setValues({ title: l.Title ?? "", description: l.Description ?? "", price: l.Price ?? "", location: l.Location ?? "", category: l.category ?? [] });
        setLoading(false);
      })
      .catch((err) => {
        setFlash("error", err.message);
        navigate("/", { replace: true });
      });
  }, [edit, id, user, navigate, setFlash]);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const toggleCategory = (key) =>
    setValues((v) => ({
      ...v,
      category: v.category.includes(key) ? v.category.filter((c) => c !== key) : [...v.category, key],
    }));
  const preview = values.price !== "" && Number(values.price) > 0 ? gstBreakdown(values.price) : null;

  async function onSubmit(e) {
    e.preventDefault();
    setValidated(true);
    if (!e.currentTarget.checkValidity()) return;

    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? v.join(",") : v));
    if (image) fd.append("image", image);

    setBusy(true);
    try {
      const d = await api(edit ? `/listings/${id}` : "/listings", { method: edit ? "PUT" : "POST", body: fd });
      setFlash("success", d.message);
      navigate(edit ? `/listing/${id}` : "/");
    } catch (err) {
      setFlash("error", err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-center mt-5 text-muted">Loading…</p>;

  return (
    <div className="mt-3 mb-4">
      <h1>{edit ? "Edit Listing" : "Create New Listing"}</h1>
      <form onSubmit={onSubmit} noValidate className={validated ? "was-validated" : ""}>
        <label htmlFor="title" className="form-label">Title</label>
        <input id="title" type="text" placeholder="Enter title" className="form-control" required value={values.title} onChange={set("title")} />
        <div className="invalid-feedback">Please enter a title.</div>
        <br />

        <label htmlFor="description" className="form-label">Description</label>
        <textarea id="description" rows="5" placeholder="Enter description" className="form-control" required value={values.description} onChange={set("description")}></textarea>
        <div className="invalid-feedback">Please enter a description.</div>
        <br />

        <label htmlFor="price" className="form-label">Price</label>
        <input id="price" type="number" min="0" placeholder="Enter price" className="form-control" required value={values.price} onChange={set("price")} />
        <div className="invalid-feedback">Please enter a valid price.</div>
        {preview && (
          <div className="form-text">
            Guests pay {formatINR(preview.total)} / night incl. {preview.percent}% GST ({formatINR(preview.gst)})
          </div>
        )}
        <br />

        <label className="form-label d-block">Categories</label>
        <div className="category-picker">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.key}
              className={`category-chip ${values.category.includes(c.key) ? "selected" : ""}`}
              onClick={() => toggleCategory(c.key)}
              aria-pressed={values.category.includes(c.key)}
            >
              <i className={c.icon}></i> {c.label}
            </button>
          ))}
        </div>
        <br />

        <label htmlFor="image" className="form-label">{edit ? "Replace Image (optional)" : "Upload Image"}</label>
        <input id="image" type="file" accept="image/*" className="form-control" required={!edit} onChange={(e) => setImage(e.target.files[0] || null)} />
        <div className="invalid-feedback">Please choose an image.</div>
        <br />

        <label htmlFor="location" className="form-label">Location</label>
        <input id="location" type="text" placeholder="Enter Location" className="form-control" required value={values.location} onChange={set("location")} />
        <div className="invalid-feedback">Please enter a location.</div>
        <br />

        <button type="submit" className="btn btn-danger" disabled={busy}>
          {busy ? "Saving…" : edit ? "Edit Listing" : "Add Listing"}
        </button>
      </form>
    </div>
  );
}
