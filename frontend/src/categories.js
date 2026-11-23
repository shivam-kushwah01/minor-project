// Keep the keys in sync with CATEGORIES in backend/model/listing.js
export const CATEGORIES = [
  { key: "trending", label: "Trending", icon: "fa-solid fa-fire" },
  { key: "rooms", label: "Rooms", icon: "fa-solid fa-bed" },
  { key: "castles", label: "Castles", icon: "fa-brands fa-fort-awesome" },
  { key: "pools", label: "With pools", icon: "fa-solid fa-person-swimming" },
  { key: "camping", label: "Camping", icon: "fa-solid fa-campground" },
  { key: "ghats", label: "Near ghats", icon: "fa-solid fa-water" },
];

export const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label ?? key;
