// GST on hotel accommodation in India (rates effective 22 Sep 2025, "GST 2.0"):
//   room tariff up to ₹7,500 per night  ->  5%
//   room tariff above ₹7,500 per night  -> 18%
// The rate is decided by the per-night tariff of the room.
export const GST_SLAB_LIMIT = 7500;

export const gstRate = (price) => (price > GST_SLAB_LIMIT ? 0.18 : 0.05);

export function gstBreakdown(price) {
  const base = Number(price) || 0;
  const rate = gstRate(base);
  const gst = Math.round(base * rate);
  return { base, rate, percent: Math.round(rate * 100), gst, total: base + gst };
}

export const formatINR = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
