export const trips = [
  {
    id: 1,
    name: "Everest Base Camp Trek",
    location: "Nepal",
    duration: "14 days",
    price: 2499,
    difficulty: "Moderate",
    image: "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Experience the ultimate adventure with our Everest Base Camp trek. Journey through the stunning Khumbu valley, witness breathtaking mountain views, and stand at the base of the world's highest peak.",
    bestTime: "Mar-May, Sep-Nov",
    altitude: "5,364m",
    groupSize: "8-12 people",
    itinerary: [
      { title: "Arrival in Kathmandu", description: "Arrive in Kathmandu, meet your guide, and prepare for the adventure ahead." },
      { title: "Fly to Lukla & Trek to Namche", description: "Scenic flight to Lukla followed by trek to Namche Bazaar, the gateway to Everest." },
      { title: "Acclimatization Day", description: "Rest day in Namche with optional hikes to help acclimatize." },
      { title: "Trek to Tengboche", description: "Continue to Tengboche monastery with stunning mountain views." },
      { title: "Trek to Dingboche", description: "Climb to Dingboche village for further acclimatization." },
      { title: "Everest Base Camp", description: "The highlight day - reach Everest Base Camp and celebrate!" },
      { title: "Return Journey", description: "Begin the return journey to Lukla over several days." }
    ],
    inclusions: [
      "Professional English-speaking guide",
      "All accommodation during the trek",
      "All meals during the trek",
      "Domestic flights (Kathmandu-Lukla-Kathmandu)",
      "All necessary permits and fees",
      "Porter service (1 porter for 2 trekkers)"
    ],
    exclusions: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal expenses",
      "Tips for guide and porter",
      "Extra accommodation in Kathmandu"
    ]
  },
  {
    id: 2,
    name: "Annapurna Circuit Trek",
    location: "Nepal",
    duration: "16 days",
    price: 1899,
    difficulty: "Moderate",
    image: "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Complete the classic Annapurna Circuit, crossing the challenging Thorong La Pass at 5,416m. Experience diverse landscapes from subtropical valleys to alpine meadows.",
    bestTime: "Oct-Dec, Mar-May",
    altitude: "5,416m",
    groupSize: "6-10 people",
    itinerary: [
      { title: "Drive to Besisahar", description: "Journey from Kathmandu to the starting point of the trek." },
      { title: "Trek to Manang", description: "Multi-day trek through beautiful villages to Manang." },
      { title: "Acclimatization in Manang", description: "Rest and acclimatization day in Manang valley." },
      { title: "Cross Thorong La Pass", description: "Early morning crossing of the challenging pass." },
      { title: "Muktinath Temple", description: "Visit the sacred temple and explore the area." },
      { title: "Return to Pokhara", description: "Complete the circuit and return to Pokhara." }
    ],
    inclusions: [
      "Experienced trekking guide",
      "Teahouse accommodation",
      "All meals during trek",
      "Transportation to/from trailhead",
      "Permits and entry fees",
      "Porter service"
    ],
    exclusions: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal gear",
      "Tips and gratuities",
      "Hotel accommodation in cities"
    ]
  },
  {
    id: 3,
    name: "Mont Blanc Circuit",
    location: "France/Italy/Switzerland",
    duration: "11 days",
    price: 2799,
    difficulty: "Moderate",
    image: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Trek around Western Europe's highest peak through three countries. Experience Alpine culture, stunning glaciers, and world-class mountain scenery.",
    bestTime: "Jun-Sep",
    altitude: "2,665m",
    groupSize: "8-12 people",
    itinerary: [
      { title: "Arrival in Chamonix", description: "Meet in Chamonix, gear check, and orientation." },
      { title: "Chamonix to Argentière", description: "Begin the circuit with stunning glacier views." },
      { title: "Cross into Switzerland", description: "Trek through Champex and Swiss Alpine meadows." },
      { title: "Enter Italy", description: "Courmayeur and Italian Alpine culture." },
      { title: "Return to France", description: "Complete the circuit back to Chamonix." }
    ],
    inclusions: [
      "Certified mountain guide",
      "Mountain hut accommodation",
      "Half-board meals",
      "Cable car transfers",
      "Emergency rescue insurance",
      "Group equipment"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal climbing gear",
      "Lunches during trek",
      "Drinks and snacks",
      "Hotel stays in Chamonix"
    ]
  },
  {
    id: 4,
    name: "Patagonia W Trek",
    location: "Chile",
    duration: "5 days",
    price: 1299,
    difficulty: "Challenging",
    image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Explore the iconic granite towers and glacial lakes of Torres del Paine National Park. One of the world's most spectacular short treks.",
    bestTime: "Nov-Mar",
    altitude: "1,200m",
    groupSize: "6-8 people",
    itinerary: [
      { title: "Base Torres Hike", description: "Iconic sunrise hike to the base of Torres del Paine." },
      { title: "Cuernos del Paine", description: "Trek to the distinctive horn-shaped peaks." },
      { title: "French Valley", description: "Explore the spectacular French Valley glacier." },
      { title: "Grey Glacier", description: "Walk to the impressive Grey Glacier viewpoint." },
      { title: "Return to Puerto Natales", description: "Complete the W trek and return to town." }
    ],
    inclusions: [
      "Professional guide",
      "Camping equipment",
      "All meals during trek",
      "Park entry fees",
      "Transportation to/from park",
      "Safety equipment"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal gear",
      "Accommodation in Puerto Natales",
      "Tips for guide",
      "Extra activities"
    ]
  },
  {
    id: 5,
    name: "Kilimanjaro Machame Route",
    location: "Tanzania",
    duration: "7 days",
    price: 2299,
    difficulty: "Challenging",
    image: "https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Summit Africa's highest peak via the scenic Machame route. Experience diverse ecosystems from rainforest to arctic summit conditions.",
    bestTime: "Jun-Oct, Dec-Mar",
    altitude: "5,895m",
    groupSize: "8-10 people",
    itinerary: [
      { title: "Machame Gate to Machame Camp", description: "Begin through lush rainforest to first camp." },
      { title: "Machame to Shira Camp", description: "Enter the moorland zone with expanding views." },
      { title: "Shira to Barranco", description: "Acclimatization day with high/sleep low principle." },
      { title: "Barranco to Karanga", description: "Cross the famous Barranco Wall." },
      { title: "Summit Day", description: "Pre-dawn summit attempt to Uhuru Peak." },
      { title: "Descent to Mweka", description: "Celebrate success and descend to lower camps." }
    ],
    inclusions: [
      "Certified mountain guide",
      "Camping equipment and tents",
      "All meals during climb",
      "Park fees and permits",
      "Professional porters",
      "Emergency evacuation insurance"
    ],
    exclusions: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal climbing gear",
      "Tips for crew",
      "Hotel accommodation"
    ]
  },
  {
    id: 6,
    name: "Inca Trail to Machu Picchu",
    location: "Peru",
    duration: "4 days",
    price: 899,
    difficulty: "Moderate",
    image: "https://images.pexels.com/photos/1252814/pexels-photo-1252814.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Follow the ancient Inca Trail to the mystical city of Machu Picchu. Experience incredible history, archaeology, and stunning Andean scenery.",
    bestTime: "May-Sep",
    altitude: "4,215m",
    groupSize: "12-16 people",
    itinerary: [
      { title: "Cusco to Wayllabamba", description: "Begin the classic Inca Trail journey." },
      { title: "Cross Dead Woman's Pass", description: "Challenge yourself over the highest pass." },
      { title: "Explore Inca Ruins", description: "Visit ancient Inca sites along the trail." },
      { title: "Sunrise at Machu Picchu", description: "Enter through Sun Gate for magical sunrise." }
    ],
    inclusions: [
      "Professional guide",
      "Camping equipment",
      "All meals during trek",
      "Machu Picchu entrance fee",
      "Train tickets",
      "Porter service"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal gear",
      "Accommodation in Cusco",
      "Tips for porters",
      "Extra activities"
    ]
  },
  {
    id: 7,
    name: "Dolomites Alta Via 1",
    location: "Italy",
    duration: "8 days",
    price: 1899,
    difficulty: "Moderate",
    image: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Trek through the stunning Dolomites on the famous Alta Via 1. Experience dramatic limestone peaks, Alpine meadows, and traditional mountain huts.",
    bestTime: "Jun-Sep",
    altitude: "2,752m",
    groupSize: "8-12 people",
    itinerary: [
      { title: "Lago di Braies to Rifugio Fanes", description: "Start at the beautiful lake and climb to first hut." },
      { title: "Fanes to Lagazuoi", description: "Cross high passes with World War I history." },
      { title: "Lagazuoi to Cinque Torri", description: "Iconic five towers formation." },
      { title: "Cortina d'Ampezzo region", description: "Explore the famous resort town area." },
      { title: "Final ascent to Belluno", description: "Complete the Alta Via 1 traverse." }
    ],
    inclusions: [
      "Mountain guide",
      "Rifugio accommodation",
      "Half-board meals",
      "Cable car transfers",
      "Maps and route information",
      "Emergency support"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal gear",
      "Lunches during trek",
      "Drinks and extras",
      "Hotel accommodation"
    ]
  },
  {
    id: 8,
    name: "GR20 Corsica",
    location: "France",
    duration: "15 days",
    price: 2599,
    difficulty: "Challenging",
    image: "https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Tackle Europe's toughest long-distance trek across the island of Corsica. Experience rugged granite peaks, pristine lakes, and Mediterranean beauty.",
    bestTime: "Jun-Sep",
    altitude: "2,225m",
    groupSize: "6-10 people",
    itinerary: [
      { title: "Calenzana to Ortu di u Piobbu", description: "Begin the challenging GR20 from the north." },
      { title: "Cross Monte Cinto region", description: "Corsica's highest peak area." },
      { title: "Bergeries de Ballone", description: "Traditional shepherds' huts." },
      { title: "Bavella needles", description: "Spectacular granite spires." },
      { title: "Conca finish", description: "Complete the full GR20 traverse." }
    ],
    inclusions: [
      "Expert mountain guide",
      "Camping equipment",
      "All meals during trek",
      "Transfers to/from airports",
      "Emergency evacuation insurance",
      "Route maps and guides"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal gear",
      "Accommodation before/after",
      "Tips and gratuities",
      "Extra activities"
    ]
  },
  {
    id: 9,
    name: "Torres del Paine O Circuit",
    location: "Chile",
    duration: "9 days",
    price: 1999,
    difficulty: "Challenging",
    image: "https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
    description: "Complete the full O Circuit around Torres del Paine. Experience the complete park including the famous W trek plus the remote back side of the massif.",
    bestTime: "Nov-Mar",
    altitude: "1,200m",
    groupSize: "6-8 people",
    itinerary: [
      { title: "Las Torres Base", description: "Classic sunrise hike to Torres base." },
      { title: "Cuernos del Paine", description: "Trek along the horns of Paine." },
      { title: "French Valley", description: "Spectacular glacial valley." },
      { title: "Grey Glacier", description: "Massive glacial formation." },
      { title: "Back side circuit", description: "Remote areas with fewer crowds." },
      { title: "John Gardner Pass", description: "Challenging high pass crossing." }
    ],
    inclusions: [
      "Professional guide",
      "Camping equipment",
      "All meals during trek",
      "Park entrance fees",
      "Transportation",
      "Safety equipment"
    ],
    exclusions: [
      "International flights",
      "Travel insurance",
      "Personal gear",
      "Accommodation in Puerto Natales",
      "Tips for guide",
      "Extra meals in town"
    ]
  }
];

export default trips;