// Base URL of the backend.
//  - Leave VITE_API_URL empty when the host proxies /api to the backend
//    (vite dev server, vercel.json rewrites, Netlify _redirects). Recommended:
//    cookies stay first-party and no CORS is needed.
//  - Or set VITE_API_URL=https://your-backend.onrender.com to call it directly.
export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Requests slower than this trigger the "server is waking up" banner.
const SLOW_MS = 2500;
let pending = 0;
const slowListeners = new Set();
export function onSlowChange(fn) {
  slowListeners.add(fn);
  return () => slowListeners.delete(fn);
}
const emitSlow = (v) => slowListeners.forEach((fn) => fn(v));

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { method = "GET", body, signal } = {}) {
  const opts = { method, credentials: "include", signal, headers: {} };
  if (body instanceof FormData) {
    opts.body = body;
  } else if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  pending++;
  const timer = setTimeout(() => emitSlow(true), SLOW_MS);
  try {
    let res;
    try {
      res = await fetch(`${API_BASE}/api${path}`, opts);
    } catch (err) {
      if (err.name === "AbortError") throw err;
      console.error(`Network error calling ${API_BASE || window.location.origin}/api${path}`, err);
      throw new ApiError(0, `Can't reach the server (${API_BASE || "/api proxy"}). It may be starting up or misconfigured — please try again shortly.`);
    }
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await res.json().catch(() => ({})) : {};
    if (!res.ok) throw new ApiError(res.status, data.error || `Server error (${res.status})`);
    if (!isJson) throw new ApiError(res.status, "Unexpected response from server — check the API URL / proxy settings");
    return data;
  } finally {
    clearTimeout(timer);
    if (--pending === 0) emitSlow(false);
  }
}

// Fire-and-forget ping so a sleeping backend starts booting as soon as the page loads.
export function warmUp() {
  fetch(`${API_BASE}/api/health`, { credentials: "include" }).catch(() => {});
}

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

// <img onError={onImageError}> swaps a broken image for the placeholder (once).
export function onImageError(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER_IMAGE;
}

// Seed data stores paths like "../../images/x.jpeg" (served by this frontend),
// uploads are "/uploads/..." or "uploads\\x" (served by the backend),
// and Cloudinary images are full https URLs.
export function imageSrc(url) {
  if (!url) return PLACEHOLDER_IMAGE;
  // Cloudinary: let it pick the best format (webp/avif) and compression per browser
  if (url.includes("res.cloudinary.com") && url.includes("/upload/") && !url.includes("/upload/f_auto")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }
  if (/^https?:\/\//.test(url)) return url;
  const clean = url.replace(/\\/g, "/");
  const uploadIdx = clean.indexOf("uploads/");
  if (uploadIdx !== -1) return `${API_BASE}/${clean.slice(uploadIdx)}`;
  const imgIdx = clean.indexOf("images/");
  if (imgIdx !== -1) return `/${clean.slice(imgIdx)}`;
  return clean.startsWith("/") ? clean : `/${clean}`;
}
