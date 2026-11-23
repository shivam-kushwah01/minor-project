// Demo listings used by `npm run seed`.
// `image` is either an Unsplash photo id (free to use under the Unsplash licence)
// or a path to a local file; the seed script uploads each one to Cloudinary.
// Categories: trending | rooms | castles | pools | camping | ghats

const sampleListings = [
  // ---- Castles & heritage ----
  {
    Title: "Mughal Arch Heritage Stay",
    Description:
      "A Mughal-era heritage mansion with red-sandstone arches, courtyard gardens and rooftop views of the Taj Mahal at sunrise.",
    Price: 12000,
    Location: "Taj Ganj, Agra, Uttar Pradesh",
    category: ["castles", "trending"],
    image: { unsplash: "1548013146-72479768bada" },
  },
  {
    Title: "Amer Heritage Haveli",
    Description:
      "A restored sandstone haveli at the foot of Amer Fort with royal suites, a rooftop dining terrace and elephant-gate views at dawn.",
    Price: 8500,
    Location: "Amer, Jaipur, Rajasthan",
    category: ["castles", "trending"],
    image: { unsplash: "1599661046289-e31897846e41" },
  },
  {
    Title: "Pink City Palace Stay",
    Description:
      "Heritage rooms a short walk from Hawa Mahal and the old bazaars. Block-printed linens, courtyard breakfasts and evening folk music.",
    Price: 6200,
    Location: "Old City, Jaipur, Rajasthan",
    category: ["castles"],
    image: { unsplash: "1477587458883-47145ed94245" },
  },

  // ---- Pools ----
  {
    Title: "Infinity Bay Resort",
    Description:
      "Cliffside resort with a sea-facing infinity pool, private cabanas and a beach club. Perfect for a sunny Goa escape.",
    Price: 18500,
    Location: "Vagator, Goa",
    category: ["pools", "trending"],
    image: { unsplash: "1540541338287-41700207dee6" },
  },
  {
    Title: "Palm Grove Pool Villa",
    Description:
      "Tropical pool villa surrounded by palms and misty hills, with an outdoor shower, daybeds and Kerala-style breakfasts.",
    Price: 14000,
    Location: "Munnar, Kerala",
    category: ["pools"],
    image: { unsplash: "1520250497591-112f2f40a3f4" },
  },
  {
    Title: "White Sands Villa",
    Description:
      "Whitewashed Mediterranean-style villa with a reflecting pool that glows at sunset. Five minutes to the beach.",
    Price: 11000,
    Location: "Candolim, Goa",
    category: ["pools", "trending"],
    image: { unsplash: "1551882547-ff40c63fe5fa" },
  },
  {
    Title: "Palm Lagoon Cottages",
    Description:
      "Thatched cottages around a lagoon-style pool, a short canoe ride from the Alleppey backwaters.",
    Price: 7200,
    Location: "Alappuzha, Kerala",
    category: ["pools"],
    image: { unsplash: "1563911302283-d2bc129e7570" },
  },
  {
    Title: "Andaman Driftwood Lodge",
    Description:
      "Timber lodge with a pool deck facing the Andaman Sea. Snorkelling gear and island-hopping trips on request.",
    Price: 9800,
    Location: "Havelock Island, Andaman & Nicobar",
    category: ["pools"],
    image: { unsplash: "1566073771259-6a8506099945" },
  },
  {
    Title: "Sunset Deck Resort",
    Description:
      "Infinity pool, wooden sun deck and hammocks overlooking the Arabian Sea on a quiet Konkan beach.",
    Price: 6800,
    Location: "Gokarna, Karnataka",
    category: ["pools"],
    image: { unsplash: "1582719508461-905c673771fd" },
  },

  // ---- Near ghats ----
  {
    Title: "Ganga Ghat Guest House",
    Description:
      "Simple, clean rooms right on the ghats. Watch boats drift past at sunrise and the Ganga aarti from the rooftop.",
    Price: 1800,
    Location: "Dashashwamedh Ghat, Varanasi, Uttar Pradesh",
    category: ["ghats", "trending"],
    image: { unsplash: "1585409677983-0f6c41ca9c3b" },
  },
  {
    Title: "Narmada Ghat Homestay",
    Description:
      "Family-run homestay by the river with home-cooked Nimari food and a short walk to the handloom weavers.",
    Price: 950,
    Location: "Maheshwar, Madhya Pradesh",
    category: ["ghats", "rooms"],
    image: { unsplash: "1571536802807-30451e3955d8" },
  },
  {
    Title: "Temple Town Inn",
    Description:
      "Comfortable rooms in the heart of the temple town, ideal for early-morning darshan and evening walks.",
    Price: 2200,
    Location: "Madurai, Tamil Nadu",
    category: ["ghats", "rooms"],
    image: { unsplash: "1582510003544-4d00b7f74220" },
  },

  // ---- Camping ----
  {
    Title: "Glamping Dome Rishikesh",
    Description:
      "Luxury tent with a real bed and a forest view framed by the door. Rafting, yoga and bonfires included.",
    Price: 3500,
    Location: "Shivpuri, Rishikesh, Uttarakhand",
    category: ["camping", "trending"],
    image: { unsplash: "1504280390367-361c6d9f38f4" },
  },
  {
    Title: "Pine Forest Campsite",
    Description:
      "Pitch-ready tents under tall deodars, with fairy lights, hot meals and guided treks to nearby waterfalls.",
    Price: 1500,
    Location: "Old Manali, Himachal Pradesh",
    category: ["camping"],
    image: { unsplash: "1487730116645-74489c95b41b" },
  },
  {
    Title: "Starlight Hilltop Camp",
    Description:
      "Remote high-altitude camp with some of the darkest skies in India. Telescope nights and the Milky Way overhead.",
    Price: 2400,
    Location: "Kaza, Spiti Valley, Himachal Pradesh",
    category: ["camping"],
    image: { unsplash: "1517824806704-9040b037703b" },
  },
  {
    Title: "Riverside Hammock Camp",
    Description: "Budget camp by the river with tents, hammocks and a common kitchen. Great for backpackers.",
    Price: 999,
    Location: "Kasol, Himachal Pradesh",
    category: ["camping"],
    image: { unsplash: "1537225228614-56cc3556d7ed" },
  },
  {
    Title: "Campfire Valley Camp",
    Description: "Group-friendly campsite with nightly campfires, music and barbecue under the pines.",
    Price: 1200,
    Location: "Tosh, Parvati Valley, Himachal Pradesh",
    category: ["camping"],
    image: { unsplash: "1478131143081-80f7f84ca84d" },
  },

  // ---- Rooms ----
  {
    Title: "Skyline Glass Suite",
    Description:
      "Floor-to-ceiling windows, a glass-walled bath and city views from bed. Business lounge and airport transfers included.",
    Price: 16000,
    Location: "Bandra, Mumbai, Maharashtra",
    category: ["rooms", "trending"],
    image: { unsplash: "1578683010236-d716f9a3f461" },
  },
  {
    Title: "Lakeview Cliff Room",
    Description: "A cosy room perched over the lake with a private balcony and mountain sunrises.",
    Price: 5800,
    Location: "Nainital, Uttarakhand",
    category: ["rooms", "trending"],
    image: { unsplash: "1596394516093-501ba68a0ba6" },
  },
  {
    Title: "Royal Nawabi Suite",
    Description: "Classic suite with a sitting area, chandeliers and Awadhi breakfast served in-room.",
    Price: 5500,
    Location: "Hazratganj, Lucknow, Uttar Pradesh",
    category: ["rooms"],
    image: { unsplash: "1590490360182-c33d57733427" },
  },
  {
    Title: "Teak Wood Suite",
    Description: "Warm teak interiors, a private sit-out and coffee estate walks every morning.",
    Price: 4200,
    Location: "Madikeri, Coorg, Karnataka",
    category: ["rooms"],
    image: { unsplash: "1611892440504-42a792e24d32" },
  },
  {
    Title: "City Business Hotel",
    Description: "Modern, quiet rooms with fast Wi-Fi and a work desk, close to the lake and DB Mall.",
    Price: 3200,
    Location: "Bhopal, Madhya Pradesh",
    category: ["rooms"],
    image: { unsplash: "1631049307264-da0ec9d70304" },
  },
  {
    Title: "Minimal Loft Room",
    Description: "Bright, minimalist room in a quiet lane, walking distance to cafes and the metro.",
    Price: 2900,
    Location: "Indiranagar, Bengaluru, Karnataka",
    category: ["rooms"],
    image: { unsplash: "1609766857041-ed402ea8069a" },
  },
  {
    Title: "Budget Twin Room",
    Description: "Clean AC twin room with a 24x7 front desk, close to Sarafa Bazaar and the railway station.",
    Price: 850,
    Location: "Indore, Madhya Pradesh",
    category: ["rooms"],
    image: { unsplash: "1595576508898-0ad5c879a061" },
  },
];

module.exports = { data: sampleListings };
