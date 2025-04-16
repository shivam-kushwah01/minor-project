const sampleListings = [
  {
    Title: "Ahilya Fort",
    Description: "A luxurious heritage hotel located inside the historic Ahilya Fort, offering a royal experience with stunning views of the Narmada River.",
    imageUrl :  {
      filename: "listingimage",
      url: "../../images/ahilyafort.jpeg" ,
    },   
    Price: 10000 ,
    Location: "Near Maheshwar Ghat, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Narmada Retreat",

    Description: "A serene riverside property offering comfortable rooms and cottages, perfect for a peaceful stay.",
    imageUrl :  {
      filename: "listingimage",
      url: "../../images/narmadaRetrev.jpeg" ,
    }, 
    Price: 3000 ,
    
    Location: "Narmada Riverfront, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Ganpati",

    Description: "A budget-friendly hotel near the ghats, ideal for travelers looking for affordable accommodations.", 
    imageUrl :  {
      filename: "listingimage",
      url: "../../images/Ganpati.jpeg" ,
    }, 
    Price: 1500 ,
    
    Location: "Near Maheshwar Ghat, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Maheshwar",

    Description: "A mid-range hotel with basic facilities, located close to the main attractions of Maheshwar.",
    imageUrl :  {
      filename: "listingimage",
      url:"../../images/rajmahal.jpeg"  ,
    }, 
    Price: 2000,
    
    Location: "Maheshwar Town Center, Madhya Pradesh"
  },
  {
    Title: "Shri Krishna Palace",

    Description: "A budget hotel near the main market, offering clean and comfortable rooms.",
    imageUrl :  {
      filename: "listingimage",
      url:"../../images/krishnpalace.jpeg"   ,
    }, 

    Price: 1000,
    
    Location: "Near Maheshwar Market, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Narmada Guest House",

    Description: "A simple guesthouse with river views, perfect for budget travelers.",

    imageUrl :  {
      filename: "listingimage",
      url:"../../images/npmnarmada.jpeg"  ,
    }, 
    Price: 800,
    
    Location: "Narmada Riverfront, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Shree Ram",

    Description: "A budget hotel near the bus stand, offering AC and non-AC rooms.",
    
    Price: 1200,

    imageUrl :  {
      filename: "listingimage",
      url:"images/shreeramhotel.jpeg"  ,
    }, 
    
    Location: "Near Maheshwar Bus Stand, Madhya Pradesh"
  },
  {
    Title: "Hotel Narmada View",

    Description: "A riverside hotel with scenic views of the Narmada River, offering comfortable accommodations.",
    
    Price: 2000,
    imageUrl :  {
      filename: "listingimage",
      url:"../../images/narmadaRetrev.jpeg" ,
    }, 
    Location: "Narmada Riverfront, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Shivam",

    Description: "A budget hotel in the town center, offering clean rooms and basic amenities.",

    imageUrl :  {
      filename: "listingimage",
      url:"../../images/shivamhotel.jpeg" ,
    }, 
    Price: 1500,
    
    Location: "Maheshwar Town Center, Madhya Pradesh"
  },
  {
    Title: "Hotel Narmada Kinara",

    Description:" A riverside hotel with comfortable accommodations and a peaceful ambiance.",

    imageUrl :  {
      filename: "listingimage",
      url:"../../images/narmadaresort.jpeg" ,
    }, 
    Price: 2500,
    
    Location: "Narmada Riverfront, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Shree Krishna",

Description: "A budget hotel near the ghats, offering clean and affordable rooms.",

imageUrl :  {
  filename: "listingimage",
  url:"../../images/hotelkrishna.jpeg" ,
}, 
Price: 1000,

Location: "Near Maheshwar Ghat, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Narmada Palace",

Description: "A mid-range hotel with modern facilities, located close to the main attractions.",

imageUrl :  {
  filename: "listingimage",
  url:"../../images/npmnarmada.jpeg" ,
}, 

Price: 2000 ,

Location: "Maheshwar Town Center, Madhya Pradesh"
  },
  {
    Title: "Hotel Shiv Vilas",

Description: "A budget hotel near the main market, offering basic amenities and clean rooms.",

imageUrl :  {
  filename: "listingimage",
  url: "../../images/shivvilas.jpeg" ,
}, 
Price: 1200,

Location: "Near Maheshwar Market, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Narmada Residency",

Description: "A mid-range hotel with comfortable rooms and modern amenities.",

imageUrl :  {
  filename: "listingimage",
  url: "../../images/narmadaretrev.jpeg" ,
}, 
Price: 2500,

Location: "Maheshwar Town Center, Madhya Pradesh"
  },
  {
    Title: "Hotel Rajmahal",

Description: "A budget hotel near the bus stand, offering clean and affordable rooms.",

imageUrl :  {
  filename: "listingimage",
  url: "../../images/rajmahal.jpeg" ,
}, 
Price: 1000,

Location: "Near Maheshwar Bus Stand, Madhya Pradesh"
  },
  {
    Title: "Hotel Narmada Bhavan",

    Description: "A simple guesthouse with basic facilities, ideal for budget travelers.",

    imageUrl :  {
      filename: "listingimage",
      url: "../../images/ahilyafort.jpeg" ,
    }, 
    Price: 800,
    
    Location: "Narmada Riverfront, Maheshwar, Madhya Pradesh  "  
  },
  {
    Title: "Hotel Shivam Palace",

Description: "A mid-range hotel with modern amenities, offering comfortable accommodations.",

imageUrl :  {
  filename: "listingimage",
  url: "../../images/shivamhotel.jpeg" ,
}, 
Price: 2000,

Location: "Maheshwar Town Center, Madhya Pradesh"
  },
  {
    Title: "Hotel Narmada Inn",

Description: "A budget hotel near the ghats, offering clean rooms and basic amenities.",

imageUrl :  {
  filename: "listingimage",
  url: "../../images/npmnarmada.jpeg"  ,
}, 
Price: 1500,

Location: "Near Maheshwar Ghat, Maheshwar, Madhya Pradesh"
  },
  {
    Title: "Hotel Shree Ganesh",

Description: "A budget hotel in the town center, offering basic rooms and Wi-Fi.",

imageUrl :  {
  filename: "listingimage",
  url: "../../images/Ganpati.jpeg"  ,
}, 
Price: 1000,

Location: "Maheshwar Town Center, Madhya Pradesh"
  },
  {
    Title: "Hotel Narmada Cottage",

Description: "A riverside cottage with a peaceful ambiance, offering scenic views of the Narmada River.",

imageUrl :  {
  filename: "listingimage",
  url: "../../images/narmadaresort.jpeg"  ,
}, 
Price: 1500,

Location: "Narmada Riverfront, Maheshwar, Madhya Pradesh"
  }
];
module.exports = { data: sampleListings };