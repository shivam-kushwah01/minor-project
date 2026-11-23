import { useEffect, useState } from "react";
import { onSlowChange } from "../api.js";

// Shown while any API request is taking unusually long — typically a free-tier
// backend cold-starting. The page itself is already visible because it's static.
export default function WakeBanner() {
  const [slow, setSlow] = useState(false);
  useEffect(() => onSlowChange(setSlow), []);
  if (!slow) return null;
  return (
    <div className="wake-banner" role="status">
      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
      Waking up the server — this can take up to a minute on the first visit…
    </div>
  );
}
