/**
 * Funkytown Fit — Fort Worth Places
 * Used by WhereToScreen for AI-keyword search and Leaflet map rendering.
 */

export interface FWPlace {
  id: string;
  name: string;
  emoji: string;
  category: 'fitness' | 'food' | 'fun' | 'outdoors' | 'culture' | 'nightlife' | 'shopping';
  vibe: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  /** Broad keyword tags used for weighted AI search scoring */
  tags: string[];
  workout?: string;
  color: string;
  imageUrl?: string;
  playlist?: {
    name: string;
    searchQuery: string;
    tracks: { title: string; artist: string }[];
  };
}

export const FW_PLACES: FWPlace[] = [
  {
    id: 'stockyards',
    name: 'Stockyards District',
    emoji: '🤠',
    category: 'fun',
    vibe: 'Historic · Cattle drive · Billy Bob\'s',
    description: 'Catch the twice-daily cattle drive, grab the best brisket in Texas, and feel the soul of Fort Worth. This is Cowtown — boot-stomping, belt-buckle-wearing, honky-tonk heaven.',
    address: 'Exchange Ave, Fort Worth, TX 76164',
    lat: 32.7895, lng: -97.3471,
    tags: ['cowboy', 'western', 'historic', 'brisket', 'bbq', 'cattle', 'boots', 'honky-tonk', 'music', 'bar', 'fun', 'iconic', 'fort worth', 'cowtown', 'rodeo', 'country', 'nightlife', 'dining', 'bar crawl'],
    workout: 'Walk + Explore',
    color: '#C4882A',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/0011Fort_Worth_Stockyards_Exchange_Ave_E_Texas.jpg',
    playlist: {
      name: 'Cowtown Classics',
      searchQuery: 'classic country Texas Willie Nelson Waylon',
      tracks: [
        { title: 'On the Road Again', artist: 'Willie Nelson' },
        { title: 'Friends in Low Places', artist: 'Garth Brooks' },
        { title: 'Ring of Fire', artist: 'Johnny Cash' },
        { title: 'Jolene', artist: 'Dolly Parton' },
        { title: 'The Dance', artist: 'Garth Brooks' },
      ],
    },
  },
  {
    id: 'trinity',
    name: 'Trinity Trails',
    emoji: '🏃',
    category: 'fitness',
    vibe: 'Run · Bike · River views',
    description: '40+ miles of trails along the Trinity River. Best sunrise run in Fort Worth — flat, scenic, and completely free. Bikers, joggers, and dog walkers love it year-round.',
    address: 'Trinity Trails, Fort Worth, TX 76102',
    lat: 32.7567, lng: -97.3310,
    tags: ['running', 'biking', 'cycling', 'trail', 'river', 'outdoors', 'fitness', 'walk', 'hike', 'nature', 'free', 'sunrise', 'dog', 'morning', 'exercise', 'cardio', 'scenic', 'view'],
    workout: 'Run or Bike',
    color: '#D4821A',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Fort_Worth_June_2016_34_(Trinity_River).jpg',
    playlist: {
      name: 'Trail Run Flow',
      searchQuery: 'running vibes energetic workout playlist',
      tracks: [
        { title: 'Redbone', artist: 'Childish Gambino' },
        { title: 'Location', artist: 'Khalid' },
        { title: 'August', artist: 'Taylor Swift' },
        { title: 'She Moves', artist: 'Leon Bridges' },
        { title: 'POWER', artist: 'Kanye West' },
      ],
    },
  },
  {
    id: 'magnolia',
    name: 'Magnolia Ave',
    emoji: '🍳',
    category: 'food',
    vibe: 'Brunch · Coffee · Local shops',
    description: 'Fort Worth\'s most walkable strip. Fixe for upscale brunch, Pour Jon\'s for killer coffee, local boutiques to wander. Stack pancakes, sip artisan coffee, and start your day right.',
    address: 'Magnolia Ave, Fort Worth, TX 76104',
    lat: 32.7228, lng: -97.3399,
    tags: ['brunch', 'breakfast', 'coffee', 'brunch spot', 'pancakes', 'local', 'walkable', 'boutique', 'shopping', 'morning', 'cafe', 'foodie', 'food', 'neighborhood', 'artisan', 'eggs', 'mimosa', 'sunday', 'trendy'],
    workout: 'Easy Walk',
    color: '#E8608A',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Magnolia_village_aerial%2C_July_2016.JPG',
    playlist: {
      name: 'Sunday Brunch',
      searchQuery: 'sunday brunch chill R&B SZA playlist',
      tracks: [
        { title: 'Sunday Morning', artist: 'Maroon 5' },
        { title: 'Adorn', artist: 'Miguel' },
        { title: 'The Weekend', artist: 'SZA' },
        { title: 'Slow Motion', artist: 'Leon Bridges' },
        { title: 'Good Days', artist: 'SZA' },
      ],
    },
  },
  {
    id: 'botanic',
    name: 'Fort Worth Botanic Garden',
    emoji: '🌸',
    category: 'outdoors',
    vibe: 'Peaceful · Nature · Japanese garden',
    description: '110 acres of calm in the middle of the city. Serene trails, Japanese garden, rose garden, and native plants. Perfect for a walking meditation and a complete mental reset.',
    address: '3220 Botanic Garden Blvd, Fort Worth, TX 76107',
    lat: 32.7468, lng: -97.3611,
    tags: ['garden', 'nature', 'peaceful', 'walk', 'flowers', 'outdoors', 'japanese', 'meditation', 'calm', 'romantic', 'scenic', 'rose', 'botanical', 'free', 'relaxing', 'mental health', 'green', 'date'],
    workout: 'Walking Meditation',
    color: '#6AB547',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Fort_Worth_Botanical_Gardens_Rose_Garden_Wiki_%281_of_1%29.jpg',
    playlist: {
      name: 'Garden State of Mind',
      searchQuery: 'peaceful meditation ambient Bon Iver',
      tracks: [
        { title: 'Holocene', artist: 'Bon Iver' },
        { title: 'Re: Stacks', artist: 'Bon Iver' },
        { title: 'Breathe (2 AM)', artist: 'Anna Nalick' },
        { title: 'Be Still', artist: 'The Killers' },
        { title: 'Skinny Love', artist: 'Bon Iver' },
      ],
    },
  },
  {
    id: 'w7th',
    name: 'West 7th',
    emoji: '🎵',
    category: 'nightlife',
    vibe: 'Nightlife · Live music · Rooftops',
    description: 'Fort Worth\'s entertainment corridor packed with bars, live music venues, and rooftop patios. Hear everything from honky-tonk to indie rock and dance under the Texas stars.',
    address: 'W 7th St, Fort Worth, TX 76102',
    lat: 32.7392, lng: -97.3582,
    tags: ['nightlife', 'bar', 'live music', 'rooftop', 'drinks', 'cocktails', 'dancing', 'night out', 'fun', 'social', 'friends', 'entertainment', 'trendy', 'patio', 'view', 'sunset', 'happy hour', 'party'],
    workout: 'Dance it out 💃',
    color: '#8B5CF6',
    playlist: {
      name: 'W7 Night Out',
      searchQuery: 'night out dance pop Dua Lipa Harry Styles',
      tracks: [
        { title: 'Levitating', artist: 'Dua Lipa' },
        { title: 'As It Was', artist: 'Harry Styles' },
        { title: 'Blinding Lights', artist: 'The Weeknd' },
        { title: 'Good as Hell', artist: 'Lizzo' },
        { title: 'Bad Guy', artist: 'Billie Eilish' },
      ],
    },
  },
  {
    id: 'clearfork',
    name: 'Clearfork',
    emoji: '🛍',
    category: 'shopping',
    vibe: 'Upscale · Shopping · River walk',
    description: 'Fort Worth\'s upscale outdoor shopping district with a scenic river walk, world-class dining, and plenty of room to move. Shop, eat, and enjoy the refined vibes along the river.',
    address: '5049 Edwards Ranch Rd, Fort Worth, TX 76109',
    lat: 32.7116, lng: -97.3742,
    tags: ['shopping', 'upscale', 'outdoor', 'river', 'walk', 'dining', 'fancy', 'date', 'nice', 'restaurants', 'boutique', 'fitness', 'gym', 'healthy eating', 'view', 'scenic', 'family'],
    workout: 'Casual Walk',
    color: '#0EA5E9',
    playlist: {
      name: 'Clearfork Chill',
      searchQuery: 'upbeat chill pop walking playlist',
      tracks: [
        { title: 'Watermelon Sugar', artist: 'Harry Styles' },
        { title: 'Heat Waves', artist: 'Glass Animals' },
        { title: 'Levitating', artist: 'Dua Lipa' },
        { title: 'drivers license', artist: 'Olivia Rodrigo' },
        { title: 'Peaches', artist: 'Justin Bieber' },
      ],
    },
  },
  {
    id: 'cultural_district',
    name: 'Cultural District',
    emoji: '🎨',
    category: 'culture',
    vibe: 'Culture · Art · World-class museums',
    description: 'Three world-class art museums within walking distance — Kimbell, Modern Art Museum, and Amon Carter. Stretch your legs and your mind in the best cultural mile in Texas.',
    address: 'Camp Bowie Blvd, Fort Worth, TX 76107',
    lat: 32.7479, lng: -97.3661,
    tags: ['art', 'museum', 'culture', 'architecture', 'history', 'walk', 'education', 'indoor', 'family', 'rainy day', 'date', 'sophisticated', 'free', 'painting', 'sculpture', 'exhibition'],
    workout: 'Museum Walk',
    color: '#F59E0B',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Amon_Carter_Museum_of_American_Art,_facade.jpg',
    playlist: {
      name: 'Museum Mood',
      searchQuery: 'lo-fi study chill instrumental jazz',
      tracks: [
        { title: 'Take Five', artist: 'Dave Brubeck' },
        { title: 'So What', artist: 'Miles Davis' },
        { title: 'Autumn Leaves', artist: 'Bill Evans' },
        { title: 'Blue in Green', artist: 'Miles Davis' },
        { title: 'My Favorite Things', artist: 'John Coltrane' },
      ],
    },
  },
  {
    id: 'panther_island',
    name: 'Panther Island Pavilion',
    emoji: '🏄',
    category: 'outdoors',
    vibe: 'Outdoor · Water · River vibes',
    description: 'Fort Worth\'s urban beach on the Trinity River. Paddleboard, kayak, or just soak up the sun at the coolest outdoor venue downtown has to offer. Live events in summer.',
    address: '395 Purcey St, Fort Worth, TX 76102',
    lat: 32.7780, lng: -97.3390,
    tags: ['water', 'kayak', 'paddleboard', 'beach', 'river', 'outdoor', 'summer', 'fun', 'sun', 'events', 'concert', 'festival', 'swim', 'active', 'view', 'scenic', 'downtown', 'refreshing'],
    workout: 'Paddleboard or Kayak',
    color: '#0EA5E9',
    playlist: {
      name: 'Vibe Check',
      searchQuery: 'summer vibes playlist chill',
      tracks: [
        { title: 'Levitating', artist: 'Dua Lipa' },
        { title: 'Watermelon Sugar', artist: 'Harry Styles' },
        { title: 'Heat Waves', artist: 'Glass Animals' },
        { title: 'Good as Hell', artist: 'Lizzo' },
      ],
    },
  },
  {
    id: 'near_southside',
    name: 'Near Southside',
    emoji: '🍻',
    category: 'nightlife',
    vibe: 'Craft bars · Local breweries · Late nights',
    description: 'Fort Worth\'s bar and brewery hub. Craft cocktails at The Usual, pints at Panther Island Brewing, late nights and live music along Rosedale and Hemphill. The indie heart of FW.',
    address: 'Hemphill St & Rosedale St, Fort Worth, TX 76104',
    lat: 32.7228, lng: -97.3320,
    tags: ['bar', 'brewery', 'craft beer', 'cocktails', 'nightlife', 'live music', 'indie', 'local', 'late night', 'social', 'drinks', 'patio', 'friends', 'hip', 'neighborhood', 'fun', 'happy hour'],
    workout: 'Bar Crawl',
    color: '#8B5CF6',
    playlist: {
      name: 'Southside Saturday',
      searchQuery: 'indie rock bar playlist',
      tracks: [
        { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
        { title: 'Reptilia', artist: 'The Strokes' },
        { title: 'Float On', artist: 'Modest Mouse' },
        { title: 'Mr. Brightside', artist: 'The Killers' },
        { title: 'Take Me Out', artist: 'Franz Ferdinand' },
      ],
    },
  },
  {
    id: 'conundrum',
    name: 'Conundrum Farms',
    emoji: '🌻',
    category: 'outdoors',
    vibe: 'Open air · Sunflowers · Farm life',
    description: 'Golden sunflower fields and endless Texas horizons just outside the city. A peaceful escape for morning strolls, sunset walks, and reconnecting with wide-open spaces. Great for photos.',
    address: 'Conundrum Farms, Weatherford, TX',
    lat: 33.0519, lng: -97.3036,
    tags: ['sunflowers', 'farm', 'outdoors', 'nature', 'photography', 'instagram', 'scenic', 'peaceful', 'walk', 'flowers', 'day trip', 'romantic', 'unique', 'country', 'open air', 'sunset', 'morning', 'beautiful'],
    workout: 'Walk + Explore',
    color: '#F97316',
    playlist: {
      name: 'Texas Sun Vibes',
      searchQuery: 'Texas Sun Khruangbin Leon Bridges',
      tracks: [
        { title: 'Texas Sun', artist: 'Khruangbin & Leon Bridges' },
        { title: 'Wild Fire', artist: 'Khruangbin' },
        { title: 'Slow Burn', artist: 'Kacey Musgraves' },
        { title: 'River', artist: 'Leon Bridges' },
        { title: 'Golden Hour', artist: 'Kacey Musgraves' },
      ],
    },
  },
  {
    id: 'kimbell',
    name: 'Kimbell Art Museum',
    emoji: '🏛',
    category: 'culture',
    vibe: 'Fine art · Louis Kahn architecture · World-class',
    description: 'One of the finest art museums in the country, right here in Fort Worth. Louis Kahn\'s masterpiece architecture alone is worth the trip. Free general admission on certain days.',
    address: '3333 Camp Bowie Blvd, Fort Worth, TX 76107',
    lat: 32.7479, lng: -97.3680,
    tags: ['art', 'museum', 'architecture', 'culture', 'sophisticated', 'indoor', 'date', 'world class', 'painting', 'sculpture', 'education', 'elegant', 'quiet', 'history', 'design', 'beautiful'],
    workout: 'Museum Walk',
    color: '#F59E0B',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Kimbell_museum,_Louis_Kahn_(17350270166).jpg',
    playlist: {
      name: 'Sunday Mood',
      searchQuery: 'calm jazz art museum playlist',
      tracks: [
        { title: 'Take Five', artist: 'Dave Brubeck' },
        { title: 'So What', artist: 'Miles Davis' },
        { title: 'Blue in Green', artist: 'Miles Davis' },
        { title: 'Autumn Leaves', artist: 'Bill Evans' },
      ],
    },
  },
  {
    id: 'lone_star_park',
    name: 'Lone Star Park',
    emoji: '🐎',
    category: 'fun',
    vibe: 'Horse racing · Sport · Texas tradition',
    description: 'Live horse racing just west of DFW. Bet a couple bucks, grab a cold beer, and watch pure Texas speed. Seasonal racing with a full grandstand experience and great food.',
    address: '1000 Lone Star Pkwy, Grand Prairie, TX 75050',
    lat: 32.7390, lng: -97.0641,
    tags: ['horses', 'racing', 'sport', 'betting', 'beer', 'texas', 'unique', 'fun', 'outdoor', 'experience', 'entertainment', 'family', 'grand prairie', 'event', 'gambling', 'spectator'],
    workout: 'Hang & Watch',
    color: '#C4882A',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Lone_Star_Park_horse_race.jpg',
    playlist: {
      name: 'Race Day',
      searchQuery: 'country pump up playlist',
      tracks: [
        { title: 'Friends in Low Places', artist: 'Garth Brooks' },
        { title: 'Dirt Road Anthem', artist: 'Jason Aldean' },
        { title: 'My Church', artist: 'Maren Morris' },
        { title: 'Chicken Fried', artist: 'Zac Brown Band' },
      ],
    },
  },
  {
    id: 'sundance',
    name: 'Sundance Square',
    emoji: '🌆',
    category: 'fun',
    vibe: 'Downtown · Dining · City energy',
    description: 'The beating heart of downtown Fort Worth. Outdoor plazas, restaurants from casual to fine dining, live music on weekends, and the most gorgeous city square in Texas.',
    address: 'Sundance Square, Fort Worth, TX 76102',
    lat: 32.7555, lng: -97.3308,
    tags: ['downtown', 'dining', 'plaza', 'city', 'live music', 'restaurants', 'bars', 'shopping', 'entertainment', 'date night', 'outdoor', 'beautiful', 'family', 'iconic', 'weekend', 'fountain', 'taco', 'food'],
    workout: 'City Walk',
    color: '#F97316',
    playlist: {
      name: 'Downtown Vibes',
      searchQuery: 'downtown city vibes playlist',
      tracks: [
        { title: 'Empire State of Mind', artist: 'JAY-Z ft. Alicia Keys' },
        { title: 'Electric Feel', artist: 'MGMT' },
        { title: 'Starboy', artist: 'The Weeknd' },
        { title: 'HUMBLE.', artist: 'Kendrick Lamar' },
      ],
    },
  },
  {
    id: 'railroad_museum',
    name: 'Grapevine Vintage Railroad',
    emoji: '🚂',
    category: 'fun',
    vibe: 'Historic · Unique · Family',
    description: 'Board a vintage steam train for a scenic trip between Fort Worth and Grapevine. A uniquely Texas experience for families, date nights, or anyone who loves a little old-school adventure.',
    address: '705 Grapevine Hwy, Grapevine, TX 76099',
    lat: 32.9138, lng: -97.0780,
    tags: ['train', 'vintage', 'historic', 'family', 'unique', 'date', 'experience', 'adventure', 'fun', 'grapevine', 'scenic', 'kids', 'day trip', 'wine', 'tasting'],
    workout: 'Relaxed Ride',
    color: '#C4882A',
    playlist: {
      name: 'Rail Ride',
      searchQuery: 'country classic road trip playlist',
      tracks: [
        { title: 'Take Me Home, Country Roads', artist: 'John Denver' },
        { title: 'Wagon Wheel', artist: 'Old Crow Medicine Show' },
        { title: 'Outlaw Country', artist: 'Sturgill Simpson' },
      ],
    },
  },
  {
    id: 'lake_worth',
    name: 'Lake Worth',
    emoji: '🌊',
    category: 'outdoors',
    vibe: 'Swimming · Fishing · Lake life',
    description: 'Fort Worth\'s own lake, right in the city. Great for fishing, kayaking, paddleboarding, and just chilling by the water. Grab a spot at the beach and feel miles away from the city.',
    address: 'Lake Worth, Fort Worth, TX 76135',
    lat: 32.8095, lng: -97.4327,
    tags: ['lake', 'swimming', 'fishing', 'kayak', 'paddleboard', 'water', 'outdoors', 'beach', 'summer', 'family', 'relaxing', 'nature', 'boating', 'view', 'scenic', 'sunset', 'picnic'],
    workout: 'Swim or Paddle',
    color: '#0EA5E9',
    playlist: {
      name: 'Lake Day',
      searchQuery: 'lake day summer vibes playlist',
      tracks: [
        { title: 'Knee Deep', artist: 'Zac Brown Band' },
        { title: 'Barefoot Blue Jean Night', artist: 'Jake Owen' },
        { title: 'More Than a Feeling', artist: 'Boston' },
        { title: 'Take It Easy', artist: 'Eagles' },
      ],
    },
  },
  {
    id: 'fixe',
    name: 'Fixe Southern House',
    emoji: '🥞',
    category: 'food',
    vibe: 'Upscale Southern · Best brunch in FW',
    description: 'The gold standard for Fort Worth brunch. Elevated southern comfort food — think shrimp and grits, biscuits with jalapeño honey, bottomless mimosas. A true Fort Worth institution.',
    address: '500 Commerce St, Fort Worth, TX 76102',
    lat: 32.7544, lng: -97.3312,
    tags: ['brunch', 'southern', 'upscale', 'mimosas', 'biscuits', 'shrimp', 'grits', 'comfort food', 'foodie', 'breakfast', 'lunch', 'date', 'sunday', 'restaurant', 'best', 'taco', 'food'],
    color: '#E8608A',
    playlist: {
      name: 'Brunch Hour',
      searchQuery: 'brunch vibes R&B soul playlist',
      tracks: [
        { title: 'Golden Hour', artist: 'Kacey Musgraves' },
        { title: 'Sunday Morning', artist: 'Maroon 5' },
        { title: 'Good Days', artist: 'SZA' },
        { title: 'Slow Motion', artist: 'Leon Bridges' },
      ],
    },
  },
  {
    id: 'joe_t_garcias',
    name: "Joe T. Garcia's",
    emoji: '🌮',
    category: 'food',
    vibe: 'Legendary Tex-Mex · Outdoor patio · Margaritas',
    description: 'Fort Worth\'s most iconic restaurant, open since 1935. A sprawling outdoor garden oasis with Tex-Mex that hits different under string lights. The margaritas are legendary. Come hungry.',
    address: '2201 N Commerce St, Fort Worth, TX 76164',
    lat: 32.7891, lng: -97.3442,
    tags: ['taco', 'tex-mex', 'margarita', 'mexican', 'outdoor', 'patio', 'view', 'garden', 'iconic', 'date', 'family', 'dinner', 'lunch', 'fort worth classic', 'enchiladas', 'chips', 'salsa', 'drinks', 'taco with a view'],
    color: '#22C55E',
    playlist: {
      name: 'Taco Tuesday',
      searchQuery: 'latin vibes reggaeton chill playlist',
      tracks: [
        { title: 'Lean On', artist: 'Major Lazer' },
        { title: 'Mi Gente', artist: 'J Balvin' },
        { title: 'Tusa', artist: 'KAROL G' },
        { title: 'Bad Guy', artist: 'Billie Eilish' },
      ],
    },
  },
  {
    id: 'ellerbe_fine_foods',
    name: 'Ellerbe Fine Foods',
    emoji: '🍷',
    category: 'food',
    vibe: 'Fine dining · Local ingredients · Intimate',
    description: 'One of Fort Worth\'s finest farm-to-table restaurants. Chef Molly McCook sources locally and crafts seasonal menus that make you feel like you\'re eating something truly special.',
    address: '1501 W Magnolia Ave, Fort Worth, TX 76104',
    lat: 32.7224, lng: -97.3433,
    tags: ['fine dining', 'farm to table', 'local', 'upscale', 'date night', 'special occasion', 'wine', 'seasonal', 'chef', 'healthy', 'organic', 'restaurant', 'dinner', 'fancy', 'delicious'],
    color: '#D4821A',
    playlist: {
      name: 'Fine Dining',
      searchQuery: 'romantic dinner jazz playlist',
      tracks: [
        { title: 'La Vie En Rose', artist: 'Édith Piaf' },
        { title: 'Feeling Good', artist: 'Nina Simone' },
        { title: 'Come Away With Me', artist: 'Norah Jones' },
      ],
    },
  },
];

// ─── AI Search Engine ──────────────────────────────────────────────────────────

/**
 * Score a place against a query using weighted keyword matching.
 * Returns a score between 0–100.
 */
function scorePlaceForQuery(place: FWPlace, query: string): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 1);
  let score = 0;

  // Exact name match is very strong
  if (place.name.toLowerCase().includes(q)) score += 50;

  // Word-by-word matching against tags (weight: 10 per match)
  for (const word of words) {
    for (const tag of place.tags) {
      if (tag.toLowerCase().includes(word) || word.includes(tag.toLowerCase())) {
        score += 10;
      }
    }
    // Description match (weight: 4)
    if (place.description.toLowerCase().includes(word)) score += 4;
    // Vibe match (weight: 6)
    if (place.vibe.toLowerCase().includes(word)) score += 6;
    // Name match (weight: 15)
    if (place.name.toLowerCase().includes(word)) score += 15;
    // Category match (weight: 8)
    if (place.category.includes(word)) score += 8;
  }

  // Concept mapping for common query terms
  const conceptMap: Record<string, string[]> = {
    'view': ['scenic', 'rooftop', 'river', 'outdoor', 'patio', 'water', 'lake', 'overlook'],
    'taco': ['tex-mex', 'mexican', 'food', 'dining', 'restaurant'],
    'romantic': ['date', 'wine', 'fine dining', 'peaceful', 'garden', 'intimate'],
    'workout': ['fitness', 'running', 'biking', 'active', 'exercise', 'trail'],
    'morning': ['coffee', 'brunch', 'breakfast', 'sunrise', 'trail'],
    'night': ['nightlife', 'bar', 'music', 'dancing', 'cocktails'],
    'chill': ['relaxing', 'peaceful', 'calm', 'easy', 'nature'],
    'adventure': ['outdoor', 'active', 'kayak', 'unique', 'water', 'trail'],
    'family': ['kids', 'outdoor', 'free', 'walk', 'park', 'fun'],
    'texas': ['iconic', 'fort worth', 'cowboy', 'western', 'bbq', 'country'],
  };

  for (const word of words) {
    const mapped = conceptMap[word];
    if (mapped) {
      for (const concept of mapped) {
        if (place.tags.some(t => t.toLowerCase().includes(concept))) score += 7;
        if (place.description.toLowerCase().includes(concept)) score += 3;
      }
    }
  }

  return score;
}

export interface PlaceSearchResult {
  place: FWPlace;
  score: number;
  contextDescription: string; // Contextual blurb referencing the query
}

/**
 * Generate a short contextual description referencing the search query.
 */
function generateContextDesc(place: FWPlace, query: string): string {
  const q = query.toLowerCase();
  const name = place.name;

  // Specific patterns
  if (q.includes('taco') && q.includes('view')) {
    if (place.id === 'joe_t_garcias') return `${name} nails the taco-with-a-view brief — an open garden oasis with legendary Tex-Mex and string lights that set the mood perfectly.`;
    if (place.id === 'sundance') return `${name} keeps you close to great taco spots with some of the best skyline views in downtown Fort Worth.`;
    if (place.id === 'clearfork') return `${name} has riverside dining with outdoor views — and plenty of taco-worthy spots nearby along the walk.`;
  }
  if (q.includes('brunch') || q.includes('breakfast')) {
    return `Looking for ${query}? ${name} is one of Fort Worth's top picks — ${place.vibe.toLowerCase()} and exactly the kind of morning energy you're after.`;
  }
  if (q.includes('run') || q.includes('trail') || q.includes('bike')) {
    return `If you're searching for "${query}", ${name} should be your first stop — ${place.description.split('.')[0].toLowerCase()}.`;
  }
  if (q.includes('bar') || q.includes('drink') || q.includes('night')) {
    return `"${query}" fits ${name} perfectly — ${place.vibe.toLowerCase()} with the kind of energy that makes a night out in Fort Worth unforgettable.`;
  }
  if (q.includes('nature') || q.includes('outdoor') || q.includes('hike')) {
    return `For "${query}", ${name} delivers — ${place.description.split('.')[0].toLowerCase()}.`;
  }
  if (q.includes('date') || q.includes('romantic')) {
    return `${name} checks every box for "${query}" — ${place.vibe.toLowerCase()}, and the kind of place that makes a real impression.`;
  }

  // Default: generic but warm contextual blurb
  const firstSentence = place.description.split('.')[0];
  return `Searching for "${query}"? ${name} fits the bill: ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}.`;
}

/**
 * Search Fort Worth places by natural language query.
 * Returns all places sorted by relevance score (descending), with context descriptions.
 */
export function searchFWPlaces(query: string): PlaceSearchResult[] {
  if (!query.trim()) {
    // Return all places in default order
    return FW_PLACES.map(place => ({
      place,
      score: 50,
      contextDescription: place.description,
    }));
  }

  const scored = FW_PLACES.map(place => ({
    place,
    score: scorePlaceForQuery(place, query),
    contextDescription: generateContextDesc(place, query),
  }));

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Pick a random place */
export function randomFWPlace(): FWPlace {
  return FW_PLACES[Math.floor(Math.random() * FW_PLACES.length)];
}
