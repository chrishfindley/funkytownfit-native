import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  StyleSheet, Image, ImageBackground, ActivityIndicator, Alert, Linking,
  TextInput, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';

import { colors, spacing, radius } from '@/theme';
import {
  getSpotifyToken, saveSpotifyToken, clearSpotifyToken,
  fetchMyPlaylists, openPlaylist, openSpotifySearch,
  SpotifyPlaylist, SPOTIFY_SCOPES,
} from '@/lib/spotify';
import { searchPlace, buildMapsUrl, PlaceInfo } from '@/lib/places';
import { RESTAURANTS, Restaurant as RestaurantData } from '@/data/restaurants';
import { RESTAURANTS2 } from '@/data/restaurants2';

WebBrowser.maybeCompleteAuthSession();

const ORANGE  = colors.orange;
const SPOTIFY = '#1DB954';

const SPOTIFY_CLIENT_ID: string =
  (Constants.expoConfig?.extra?.spotifyClientId as string | undefined) ?? '';


// ── Activity data ─────────────────────────────────────────────────────────────
interface Track    { title: string; artist: string; }
interface Activity {
  id: string; emoji: string; name: string; vibe: string;
  description: string; workout: string; color: string;
  imageUrl: string;
  playlist: { name: string; tracks: Track[]; searchQuery: string; };
}

const ACTIVITIES: Activity[] = [
  {
    id: 'conundrum',
    emoji: '🌻', name: 'Conundrum Farms', color: ORANGE,
    vibe: 'Open air · Sunflowers · Farm life',
    imageUrl: '',
    description: 'Golden sunflower fields and endless Texas horizons just outside the city. A peaceful escape for morning strolls, sunset walks, and reconnecting with wide-open spaces.',
    workout: 'Walk + Explore',
    playlist: {
      name: 'Texas Sun Vibes',
      searchQuery: 'Texas Sun Khruangbin Leon Bridges',
      tracks: [
        { title: 'Texas Sun',   artist: 'Khruangbin & Leon Bridges' },
        { title: 'Wild Fire',   artist: 'Khruangbin' },
        { title: 'Slow Burn',   artist: 'Kacey Musgraves' },
        { title: 'River',       artist: 'Leon Bridges' },
        { title: 'Golden Hour', artist: 'Kacey Musgraves' },
      ],
    },
  },
  {
    id: 'trinity',
    emoji: '🏃', name: 'Trinity Trails', color: '#D4821A',
    vibe: 'Run · Bike · River views',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Fort_Worth_June_2016_34_(Trinity_River).jpg',
    description: '40+ miles of trails along the Trinity River. Best sunrise run in Fort Worth — flat, scenic, and completely free.',
    workout: 'Run or Bike',
    playlist: {
      name: 'Trail Run Flow',
      searchQuery: 'running vibes energetic workout playlist',
      tracks: [
        { title: 'Redbone',     artist: 'Childish Gambino' },
        { title: 'Location',    artist: 'Khalid' },
        { title: 'August',      artist: 'Taylor Swift' },
        { title: 'She Moves',   artist: 'Leon Bridges' },
        { title: 'POWER',       artist: 'Kanye West' },
      ],
    },
  },
  {
    id: 'stockyards',
    emoji: '🤠', name: 'Stockyards District', color: '#C4882A',
    vibe: 'Historic · Cattle drive · Billy Bob\'s',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/0011Fort_Worth_Stockyards_Exchange_Ave_E_Texas.jpg',
    description: 'Catch the twice-daily cattle drive, grab the best brisket in Texas, and feel the soul of Fort Worth. This is Cowtown.',
    workout: 'Walk + Explore',
    playlist: {
      name: 'Cowtown Classics',
      searchQuery: 'classic country Texas Willie Nelson Waylon',
      tracks: [
        { title: 'On the Road Again',   artist: 'Willie Nelson' },
        { title: 'Friends in Low Places', artist: 'Garth Brooks' },
        { title: 'Ring of Fire',        artist: 'Johnny Cash' },
        { title: 'Jolene',              artist: 'Dolly Parton' },
        { title: 'The Dance',           artist: 'Garth Brooks' },
      ],
    },
  },
  {
    id: 'magnolia',
    emoji: '🍳', name: 'Magnolia Ave', color: '#E8608A',
    vibe: 'Brunch · Coffee · Local shops',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Magnolia_village_aerial%2C_July_2016.JPG',
    description: 'Fort Worth\'s most walkable strip. Fixe for brunch, Pour Jon\'s for coffee, local boutiques to wander. Stack pancakes, sip artisan coffee, and start your day right.',
    workout: 'Easy Walk',
    playlist: {
      name: 'Sunday Brunch',
      searchQuery: 'sunday brunch chill R&B SZA playlist',
      tracks: [
        { title: 'Sunday Morning', artist: 'Maroon 5' },
        { title: 'Adorn',          artist: 'Miguel' },
        { title: 'The Weekend',    artist: 'SZA' },
        { title: 'Slow Motion',    artist: 'Leon Bridges' },
        { title: 'Good Days',      artist: 'SZA' },
      ],
    },
  },
  {
    id: 'botanic',
    emoji: '🌸', name: 'Botanic Garden', color: '#6AB547',
    vibe: 'Peaceful · Nature · Japanese garden',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Fort_Worth_Botanical_Gardens_Rose_Garden_Wiki_%281_of_1%29.jpg',
    description: '110 acres of calm in the middle of the city. Serene trails, Japanese gardens, and native plants. Perfect for a walking meditation and reconnecting with nature.',
    workout: 'Walking Meditation',
    playlist: {
      name: 'Garden State of Mind',
      searchQuery: 'peaceful meditation ambient Bon Iver',
      tracks: [
        { title: 'Holocene',       artist: 'Bon Iver' },
        { title: 'Re: Stacks',     artist: 'Bon Iver' },
        { title: 'Breathe (2 AM)', artist: 'Anna Nalick' },
        { title: 'Be Still',       artist: 'The Killers' },
        { title: 'Skinny Love',    artist: 'Bon Iver' },
      ],
    },
  },
  {
    id: 'w7th',
    emoji: '🎵', name: 'West 7th', color: '#8B5CF6',
    vibe: 'Nightlife · Live music · Rooftops',
    imageUrl: '',
    description: 'Fort Worth\'s entertainment corridor packed with bars, live music venues, and rooftop patios. Hear everything from honky-tonk to indie rock and dance under the Texas stars.',
    workout: 'Dance it out 💃',
    playlist: {
      name: 'W7 Night Out',
      searchQuery: 'night out dance pop Dua Lipa Harry Styles',
      tracks: [
        { title: 'Levitating',      artist: 'Dua Lipa' },
        { title: 'As It Was',       artist: 'Harry Styles' },
        { title: 'Blinding Lights', artist: 'The Weeknd' },
        { title: 'Good as Hell',    artist: 'Lizzo' },
        { title: 'Bad Guy',         artist: 'Billie Eilish' },
      ],
    },
  },
  {
    id: 'clearfork',
    emoji: '🛍', name: 'Clearfork', color: '#0EA5E9',
    vibe: 'Upscale · Shopping · River walk',
    imageUrl: '',
    description: 'Fort Worth\'s upscale outdoor shopping district with a scenic river walk, world-class dining, and plenty of room to move. Shop, eat, and enjoy the refined vibes.',
    workout: 'Casual Walk',
    playlist: {
      name: 'Clearfork Chill',
      searchQuery: 'upbeat chill pop walking playlist',
      tracks: [
        { title: 'Watermelon Sugar', artist: 'Harry Styles' },
        { title: 'Heat Waves',       artist: 'Glass Animals' },
        { title: 'Levitating',       artist: 'Dua Lipa' },
        { title: 'drivers license',  artist: 'Olivia Rodrigo' },
        { title: 'Peaches',          artist: 'Justin Bieber' },
      ],
    },
  },
  {
    id: 'museumway',
    emoji: '🎨', name: 'Museum Way', color: '#F59E0B',
    vibe: 'Culture · Art · Architecture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Amon_Carter_Museum_of_American_Art,_facade.jpg',
    description: 'The Cultural District — Kimbell, Modern, Amon Carter. World-class art within walking distance. Stretch your legs and your mind.',
    workout: 'Museum Walk',
    playlist: {
      name: 'Museum Mood',
      searchQuery: 'lo-fi study chill instrumental jazz',
      tracks: [
        { title: 'Take Five',   artist: 'Dave Brubeck' },
        { title: 'So What',     artist: 'Miles Davis' },
        { title: 'Autumn Leaves', artist: 'Bill Evans' },
        { title: 'Blue in Green', artist: 'Miles Davis' },
        { title: 'My Favorite Things', artist: 'John Coltrane' },
      ],
    },
  },
  {
    id: 'panther_island',
    emoji: '🏄', name: 'Panther Island Pavilion', color: '#0EA5E9',
    vibe: 'Outdoor · Water · River vibes',
    imageUrl: '',
    description: "Fort Worth's urban beach on the Trinity River. Paddleboard, kayak, or just soak up the sun at the coolest spot downtown has to offer.",
    workout: 'Paddleboard or Kayak',
    playlist: {
      name: 'Vibe Check',
      searchQuery: 'summer vibes playlist chill',
      tracks: [
        { title: 'Levitating',      artist: 'Dua Lipa' },
        { title: 'Watermelon Sugar', artist: 'Harry Styles' },
        { title: 'Heat Waves',       artist: 'Glass Animals' },
        { title: 'Good as Hell',     artist: 'Lizzo' },
      ],
    },
  },
  {
    id: 'golf_fw',
    emoji: '⛳', name: 'Colonial Country Club', color: '#6AB547',
    vibe: 'Golf · Sport · Country club',
    imageUrl: '',
    description: "Tee it up at one of Fort Worth's legendary courses. Colonial has hosted the PGA Tour for decades — swing where the pros swing.",
    workout: 'Golf Round',
    playlist: {
      name: '19th Hole',
      searchQuery: 'laid back country golf playlist',
      tracks: [
        { title: 'Take It Easy',    artist: 'Eagles' },
        { title: 'Margaritaville',  artist: 'Jimmy Buffett' },
        { title: 'What a Wonderful World', artist: 'Louis Armstrong' },
        { title: 'Coming Down the Mountain', artist: 'Sturgill Simpson' },
      ],
    },
  },
  {
    id: 'kimbell',
    emoji: '🎨', name: 'Kimbell Art Museum', color: '#F59E0B',
    vibe: 'Culture · Art · Architecture',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Kimbell_museum,_Louis_Kahn_(17350270166).jpg',
    description: "One of the best art museums in the country, and it's right here in FW. Louis Kahn's architecture alone is worth the trip.",
    workout: 'Museum Walk',
    playlist: {
      name: 'Sunday Mood',
      searchQuery: 'calm jazz art museum playlist',
      tracks: [
        { title: 'Take Five',   artist: 'Dave Brubeck' },
        { title: 'So What',     artist: 'Miles Davis' },
        { title: 'Blue in Green', artist: 'Miles Davis' },
        { title: 'Autumn Leaves', artist: 'Bill Evans' },
      ],
    },
  },
  {
    id: 'lone_star_park',
    emoji: '🐎', name: 'Lone Star Park', color: '#C4882A',
    vibe: 'Racing · Horses · Texas fun',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Lone_Star_Park_horse_race.jpg',
    description: 'Live horse racing just west of DFW. Bet a couple bucks, grab a cold beer, and watch pure Texas speed.',
    workout: 'Hang & Watch',
    playlist: {
      name: 'Race Day',
      searchQuery: 'country pump up playlist',
      tracks: [
        { title: 'Friends in Low Places', artist: 'Garth Brooks' },
        { title: 'Dirt Road Anthem',     artist: 'Jason Aldean' },
        { title: 'My Church',            artist: 'Maren Morris' },
        { title: 'Chicken Fried',        artist: 'Zac Brown Band' },
      ],
    },
  },
  {
    id: 'near_southside',
    emoji: '🍻', name: 'Near Southside', color: '#8B5CF6',
    vibe: 'Nightlife · Craft bars · Local breweries',
    imageUrl: '',
    description: "Fort Worth's bar and brewery hub. Think craft cocktails at The Usual, pints at Panther Island Brewing, late nights and live music along Rosedale and Hemphill.",
    workout: 'Bar Crawl',
    playlist: {
      name: 'Southside Saturday',
      searchQuery: 'indie rock bar playlist',
      tracks: [
        { title: 'Do I Wanna Know?',  artist: 'Arctic Monkeys' },
        { title: 'Reptilia',          artist: 'The Strokes' },
        { title: 'Float On',          artist: 'Modest Mouse' },
        { title: 'Young Folks',       artist: 'Peter Bjorn and John' },
      ],
    },
  },
  {
    id: 'fairmount',
    emoji: '🌳', name: 'Fairmount', color: '#5A9E6F',
    vibe: 'Historic · Walkable · Bungalows',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Fairmount_Historic_District_Fort_Worth_Wiki_%281_of_1%29.jpg',
    description: "Named one of the best neighborhoods in the country by Neighborhoods USA — twice. Fairmount's tree-lined streets and century-old bungalows make it the most charming walk in Fort Worth. Artsy, residential, and proud of it.",
    workout: 'Morning Walk',
    playlist: {
      name: 'Sunday Stroll',
      searchQuery: 'morning chill indie folk walk playlist',
      tracks: [
        { title: 'Better Together',   artist: 'Jack Johnson' },
        { title: 'Banana Pancakes',   artist: 'Jack Johnson' },
        { title: 'Home',              artist: 'Edward Sharpe & The Magnetic Zeros' },
        { title: 'Ho Hey',            artist: 'The Lumineers' },
        { title: 'Stubborn Love',     artist: 'The Lumineers' },
      ],
    },
  },
  {
    id: 'bass_hall',
    emoji: '🎭', name: 'Bass Performance Hall', color: '#E84040',
    vibe: 'Music · Theatre · Broadway',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Fort_Worth_June_2016_55_(Bass_Performance_Hall).jpg',
    description: 'One of the finest performance halls in the country. World-class symphony, ballet, Broadway — right in downtown FW.',
    workout: 'Date Night',
    playlist: {
      name: 'Curtain Call',
      searchQuery: 'classical orchestra playlist',
      tracks: [
        { title: 'The Four Seasons: Spring',  artist: 'Antonio Vivaldi' },
        { title: 'Moonlight Sonata',          artist: 'Ludwig van Beethoven' },
        { title: 'Clair de Lune',             artist: 'Claude Debussy' },
        { title: 'Eine Kleine Nachtmusik',    artist: 'Wolfgang Amadeus Mozart' },
      ],
    },
  },
  {
    id: 'benbrook_lake',
    emoji: '🎣', name: 'Benbrook Lake', color: '#06B6D4',
    vibe: 'Lake · Fishing · Nature',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/USACE_Benbrook_Lake_and_Dam.jpg',
    description: 'Hit the water without leaving Tarrant County. Fish, kayak, camp, or just watch the sunset over the lake. Pure Texas evening.',
    workout: 'Fishing or Kayak',
    playlist: {
      name: 'Lakeside Chill',
      searchQuery: 'acoustic chill outdoor playlist',
      tracks: [
        { title: 'Wonderwall',  artist: 'Oasis' },
        { title: 'Pink Cadillac', artist: 'Bruce Springsteen' },
        { title: 'Skinny Love', artist: 'Bon Iver' },
        { title: 'Holocene',    artist: 'Bon Iver' },
      ],
    },
  },
  {
    id: 'shopping_fw',
    emoji: '🛍️', name: 'Clearfork & La Gran Plaza', color: '#0EA5E9',
    vibe: 'Shopping · Fashion · Hangout',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/The_exterior_entrance_of_La_Gran_Plaza_de_Fort_Worth_shopping_mall_in_Fort_Worth%2C_Texas.jpg',
    description: 'From Neiman Marcus at Clearfork to the local boutiques at La Gran Plaza — FW has serious shopping options for every vibe.',
    workout: 'Shopping Walk',
    playlist: {
      name: 'Shopping Mode',
      searchQuery: 'pop hits shopping playlist',
      tracks: [
        { title: 'Good as Hell',    artist: 'Lizzo' },
        { title: 'Levitating',      artist: 'Dua Lipa' },
        { title: 'Anti-Hero',       artist: 'Taylor Swift' },
        { title: 'As It Was',       artist: 'Harry Styles' },
      ],
    },
  },
];

// ── Restaurant data ─────────────────────────────────────────────────────────────
const ALL_RESTAURANTS = [...RESTAURANTS, ...RESTAURANTS2];

// ── Google Places search queries (one per activity id) ─────────────────────────
const PLACE_QUERIES: Record<string, string> = {
  conundrum:      'Conundrum Farms Fort Worth TX',
  trinity:        'Trinity Trails Fort Worth TX',
  stockyards:     'Fort Worth Stockyards National Historic District TX',
  magnolia:       'Magnolia Avenue Fort Worth TX',
  botanic:        'Fort Worth Botanic Garden TX',
  w7th:           'West 7th Street Fort Worth TX',
  clearfork:      'Shops at Clearfork Fort Worth TX',
  museumway:      'Kimbell Art Museum Fort Worth TX',
  panther_island: 'Panther Island Pavilion Fort Worth TX',
  bass_hall:      'Bass Performance Hall Fort Worth TX',
  benbrook_lake:  'Benbrook Lake Tarrant County TX',
  shopping_fw:    'La Gran Plaza Fort Worth TX',
};

const FOOD_KEYWORDS = [
  'food', 'eat', 'taco', 'burger', 'bbq', 'sushi', 'pizza', 'steak', 'brunch',
  'breakfast', 'lunch', 'dinner', 'drink', 'bar', 'coffee', 'wings', 'sandwich',
  'salad', 'ramen', 'thai', 'mexican', 'italian', 'chinese', 'restaurant', 'spot',
  'place', 'hungry', 'bite', 'meal',
];

function isFoodSearch(query: string): boolean {
  const q = query.toLowerCase();
  return FOOD_KEYWORDS.some(kw => q.includes(kw));
}

function searchRestaurants(query: string): RestaurantData[] {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);
  return ALL_RESTAURANTS
    .map(r => {
      let score = 0;
      const haystack = `${r.name} ${r.category}`.toLowerCase();
      words.forEach(w => { if (haystack.includes(w)) score += 2; });
      return { restaurant: r, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(x => x.restaurant);
}

// ── Search scoring ─────────────────────────────────────────────────────────────
function scoreActivity(activity: Activity, query: string): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  const haystack = [
    activity.name, activity.vibe, activity.description,
    activity.workout, activity.emoji,
  ].join(' ').toLowerCase();
  let score = 0;
  for (const w of words) {
    if (haystack.includes(w)) score += 1;
  }
  return score;
}

function findBestMatch(query: string): Activity | null {
  if (!query.trim()) return null;
  const scored = ACTIVITIES.map(a => ({ a, score: scoreActivity(a, query) }));
  scored.sort((x, y) => y.score - x.score);
  return scored[0].score > 0 ? scored[0].a : null;
}

// ── View states ────────────────────────────────────────────────────────────────
type ViewState = 'landing' | 'result' | 'restaurant_result' | 'browse';

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { visible: boolean; onClose: () => void; }

export default function WhereToModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();

  const [viewState,       setViewState]       = useState<ViewState>('landing');
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [currentRestaurant, setCurrentRestaurant] = useState<RestaurantData | null>(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [searchNoResult, setSearchNoResult] = useState(false);

  // Spotify
  const [spotifyToken,     setSpotifyToken]     = useState<string | null>(null);
  const [myPlaylists,      setMyPlaylists]      = useState<SpotifyPlaylist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [spotifySearch,    setSpotifySearch]    = useState('');

  // Browse expand
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Google Places — live open/closed + photo for the current result
  const [placeInfo, setPlaceInfo]   = useState<PlaceInfo | null>(null);
  const [placeFetching, setPlaceFetching] = useState(false);
  const placeCache = useRef<Record<string, PlaceInfo | null>>({});

  // Fade animation for result card
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── OAuth (PKCE flow — Spotify no longer supports implicit/token flow) ───
  const redirectUri = 'https://auth.expo.io/@chrishfindley/funkytownfit';
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId:     SPOTIFY_CLIENT_ID,
      scopes:       SPOTIFY_SCOPES,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE:      true,
    },
    { authorizationEndpoint: 'https://accounts.spotify.com/authorize' }
  );

  useEffect(() => {
    if (response?.type !== 'success') return;
    const { code } = response.params;
    if (!code || !request?.codeVerifier) return;
    // Exchange authorization code for access token (PKCE — no client secret needed)
    const body = new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  redirectUri,
      client_id:     SPOTIFY_CLIENT_ID,
      code_verifier: request.codeVerifier,
    });
    fetch('https://accounts.spotify.com/api/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    body.toString(),
    })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          saveSpotifyToken(data.access_token, data.expires_in ?? 3600);
          setSpotifyToken(data.access_token);
          loadPlaylists(data.access_token);
        }
      })
      .catch(() => {});
  }, [response]);

  useEffect(() => {
    if (!visible) return;
    setViewState('landing');
    setCurrentActivity(null);
    setCurrentRestaurant(null);
    setSearchQuery('');
    setSearchNoResult(false);
    getSpotifyToken().then(token => {
      if (token) { setSpotifyToken(token.accessToken); loadPlaylists(token.accessToken); }
    });
  }, [visible]);

  async function loadPlaylists(token: string) {
    setLoadingPlaylists(true);
    const lists = await fetchMyPlaylists(token);
    setMyPlaylists(lists);
    setLoadingPlaylists(false);
  }

  // ── Google Places helpers ─────────────────────────────────────────────────
  async function fetchPlaceInfoFor(cacheKey: string, query: string) {
    // Already cached (even if null — means API found nothing)
    if (cacheKey in placeCache.current) {
      setPlaceInfo(placeCache.current[cacheKey]);
      return;
    }
    setPlaceFetching(true);
    const info = await searchPlace(query);
    placeCache.current[cacheKey] = info;
    setPlaceInfo(info);
    setPlaceFetching(false);
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  function showActivity(a: Activity) {
    setCurrentActivity(a);
    setCurrentRestaurant(null);
    setPlaceInfo(null);
    setViewState('result');
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Fetch live place data in background
    const query = PLACE_QUERIES[a.id];
    if (query) fetchPlaceInfoFor(a.id, query);
  }

  function showRestaurant(r: RestaurantData) {
    setCurrentRestaurant(r);
    setCurrentActivity(null);
    setPlaceInfo(null);
    setViewState('restaurant_result');
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Fetch live open/closed status for this restaurant
    fetchPlaceInfoFor(`rest_${r.id}`, `${r.name} Fort Worth TX`);
  }

  function spinRandom() {
    const idx = Math.floor(Math.random() * ACTIVITIES.length);
    showActivity(ACTIVITIES[idx]);
  }

  function handleSearch() {
    const q = searchQuery.trim();
    if (!q) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const match = findBestMatch(q);
    if (match) {
      setSearchNoResult(false);
      showActivity(match);
    } else if (isFoodSearch(q)) {
      const restaurants = searchRestaurants(q);
      if (restaurants.length > 0) {
        setSearchNoResult(false);
        showRestaurant(restaurants[0]);
      } else {
        setSearchNoResult(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } else {
      setSearchNoResult(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }

  async function handleConnectSpotify() {
    if (!SPOTIFY_CLIENT_ID || SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID_HERE') {
      Alert.alert('Spotify Setup Required',
        'Add your Spotify Client ID to app.json under extra.spotifyClientId.\n\nGet one free at developer.spotify.com',
        [
          { text: 'Open Spotify Dev', onPress: () => Linking.openURL('https://developer.spotify.com/dashboard') },
          { text: 'OK' },
        ]);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await promptAsync();
  }

  async function handleDisconnect() {
    await clearSpotifyToken();
    setSpotifyToken(null);
    setMyPlaylists([]);
    setSpotifySearch('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleSpotifySearch() {
    const q = spotifySearch.trim();
    if (!q) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openSpotifySearch(q);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.root, { paddingBottom: insets.bottom }]}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════════════ */}
        {/* LANDING                                                  */}
        {/* ════════════════════════════════════════════════════════ */}
        {viewState === 'landing' && (
          <View style={styles.landingWrap}>
            {/* Hero photo banner */}
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80' }}
              style={styles.landingHero}
              imageStyle={styles.landingHeroImage}
              resizeMode="cover"
            >
              <View style={styles.landingHeroOverlay} />
              <Text style={styles.landingTitle}>Where To?</Text>
              <Text style={styles.landingSub}>Fort Worth · Funkytown edition</Text>
            </ImageBackground>

            {/* Search + actions — padded container */}
            <View style={styles.landingBody}>
              <View style={styles.searchWrap}>
                <View style={styles.searchBar}>
                  <Text style={styles.searchIcon}>🔍</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder={`"taco spot with a view"`}
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={t => { setSearchQuery(t); setSearchNoResult(false); }}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    autoCorrect={false}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchNoResult(false); }}>
                      <Text style={styles.clearBtn}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity style={styles.searchGoBtn} onPress={handleSearch}>
                  <Text style={styles.searchGoBtnText}>Search</Text>
                </TouchableOpacity>
              </View>

              {searchNoResult && (
                <Text style={styles.noResultText}>No match found — try "trail run", "tacos", "chill walk"…</Text>
              )}

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerStar}>✦</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Go button */}
              <TouchableOpacity style={styles.goBtn} onPress={spinRandom} activeOpacity={0.85}>
                <Text style={styles.goBtnText}>Go →</Text>
              </TouchableOpacity>
              <Text style={styles.goHint}>Tap to spin a random Fort Worth spot</Text>

              {/* Browse all */}
              <TouchableOpacity style={styles.browseBtn} onPress={() => setViewState('browse')}>
                <Text style={styles.browseBtnText}>Browse All Spots</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/* RESULT                                                   */}
        {/* ════════════════════════════════════════════════════════ */}
        {viewState === 'result' && currentActivity && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.resultScroll}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fadeAnim }}>

              {/* Photo — Google Places photo if available, else real location photo, else color fallback */}
              <View style={styles.photoWrap}>
                {(placeInfo?.photoUri || currentActivity.imageUrl) ? (
                  <Image
                    source={{ uri: placeInfo?.photoUri ?? currentActivity.imageUrl }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.photo, { backgroundColor: currentActivity.color + '22', alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ fontSize: 80 }}>{currentActivity.emoji}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 10, fontStyle: 'italic' }}>
                      Photo coming soon
                    </Text>
                  </View>
                )}
                <View style={styles.photoOverlay} />
                <View style={styles.photoMeta}>
                  <Text style={styles.photoEmoji}>{currentActivity.emoji}</Text>
                  <Text style={styles.photoName}>{currentActivity.name}</Text>
                  <View style={styles.photoPillRow}>
                    <View style={[styles.workoutPill, { borderColor: currentActivity.color + '90' }]}>
                      <Text style={[styles.workoutPillText, { color: currentActivity.color }]}>
                        {currentActivity.workout}
                      </Text>
                    </View>
                    {placeFetching && (
                      <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" style={{ marginLeft: 8 }} />
                    )}
                    {!placeFetching && placeInfo?.isOpen !== null && placeInfo?.isOpen !== undefined && (
                      <View style={[styles.openBadge, { backgroundColor: placeInfo.isOpen ? '#22C55E30' : '#EF444430' }]}>
                        <Text style={[styles.openBadgeText, { color: placeInfo.isOpen ? '#22C55E' : '#EF4444' }]}>
                          {placeInfo.isOpen ? '● OPEN' : '● CLOSED'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Vibe + description + directions */}
              <View style={styles.descCard}>
                <View style={styles.descTopRow}>
                  <Text style={[styles.vibeText, { flex: 1 }]}>{currentActivity.vibe}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      Linking.openURL(buildMapsUrl(currentActivity.name, placeInfo));
                    }}
                    style={styles.directionsBtn}
                  >
                    <Text style={styles.directionsBtnText}>📍 Directions</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.descText}>{currentActivity.description}</Text>
                {placeInfo?.rating != null && (
                  <Text style={styles.ratingText}>
                    ⭐ {placeInfo.rating.toFixed(1)}{placeInfo.userRatingCount != null ? `  ·  ${placeInfo.userRatingCount.toLocaleString()} reviews` : ''}
                  </Text>
                )}
              </View>

              {/* Playlist card */}
              <View style={[styles.playlistCard, { borderLeftColor: currentActivity.color }]}>
                <View style={styles.playlistHeader}>
                  <Text style={styles.playlistIcon}>🎵</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.playlistName}>{currentActivity.playlist.name}</Text>
                    <Text style={styles.playlistSub}>Funkytown Fit · {currentActivity.playlist.tracks.length} tracks</Text>
                  </View>
                </View>
                {currentActivity.playlist.tracks.map((track, i) => (
                  <View key={i} style={styles.trackRow}>
                    <Text style={styles.trackNum}>{i + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.trackTitle}>{track.title}</Text>
                      <Text style={styles.trackArtist}>{track.artist}</Text>
                    </View>
                    {i === 0 && (
                      <View style={styles.startsPill}>
                        <Text style={styles.startsPillText}>starts here</Text>
                      </View>
                    )}
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.openSpotifyBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    openSpotifySearch(currentActivity.playlist.searchQuery);
                  }}
                >
                  <Text style={styles.openSpotifyText}>♫  Open in Spotify</Text>
                </TouchableOpacity>
              </View>

              {/* Spotify — Your Music */}
              <View style={styles.spotifySection}>
                <View style={styles.spotifyHeaderRow}>
                  <Text style={styles.sectionLabel}>YOUR MUSIC</Text>
                  {spotifyToken && (
                    <TouchableOpacity onPress={handleDisconnect}>
                      <Text style={styles.disconnectText}>Disconnect</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {!spotifyToken ? (
                  <TouchableOpacity style={styles.connectBtn} onPress={handleConnectSpotify} disabled={!request}>
                    <Text style={styles.connectBtnText}>♫  Connect Spotify</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <View style={styles.spotifySearchWrap}>
                      <View style={styles.spotifySearchBar}>
                        <TextInput
                          style={styles.spotifySearchInput}
                          placeholder="Search anything on Spotify…"
                          placeholderTextColor={colors.textMuted}
                          value={spotifySearch}
                          onChangeText={setSpotifySearch}
                          onSubmitEditing={handleSpotifySearch}
                          returnKeyType="search"
                          autoCorrect={false}
                        />
                      </View>
                      <TouchableOpacity style={styles.spotifyGoBtn} onPress={handleSpotifySearch}>
                        <Text style={styles.spotifyGoBtnText}>Go</Text>
                      </TouchableOpacity>
                    </View>

                    {loadingPlaylists ? (
                      <ActivityIndicator color={SPOTIFY} style={{ marginTop: 16 }} />
                    ) : myPlaylists.length > 0 ? (
                      <View style={styles.playlistGrid}>
                        {myPlaylists.slice(0, 9).map(pl => (
                          <TouchableOpacity key={pl.id} style={styles.playlistGridItem}
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); openPlaylist(pl.externalUrl, pl.uri); }}>
                            {pl.imageUrl ? (
                              <Image source={{ uri: pl.imageUrl }} style={styles.playlistThumb} />
                            ) : (
                              <View style={[styles.playlistThumb, styles.playlistThumbFallback]}>
                                <Text style={{ fontSize: 22 }}>♫</Text>
                              </View>
                            )}
                            <Text style={styles.playlistGridName} numberOfLines={2}>{pl.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.emptyText}>No playlists found. Use the search above.</Text>
                    )}
                  </>
                )}
              </View>

              {/* Spin again + Browse all */}
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.spinAgainBtn} onPress={spinRandom}>
                  <Text style={styles.spinAgainText}>🎲  Spin Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.browseAllBtn} onPress={() => setViewState('browse')}>
                  <Text style={styles.browseAllText}>Browse All →</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </Animated.View>
          </ScrollView>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/* RESTAURANT RESULT                                        */}
        {/* ════════════════════════════════════════════════════════ */}
        {viewState === 'restaurant_result' && currentRestaurant && (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.resultScroll}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fadeAnim }}>

              {/* Restaurant Header */}
              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantEmoji}>{currentRestaurant.emoji}</Text>
                <Text style={styles.restaurantName}>{currentRestaurant.name}</Text>
                <View style={styles.restaurantCategory}>
                  <Text style={styles.restaurantCategoryText}>{currentRestaurant.category}</Text>
                </View>
                {/* Live open/closed badge */}
                {placeFetching && (
                  <ActivityIndicator size="small" color={colors.textMuted} style={{ marginTop: 10 }} />
                )}
                {!placeFetching && placeInfo?.isOpen !== null && placeInfo?.isOpen !== undefined && (
                  <View style={[styles.openBadgeLarge, {
                    backgroundColor: placeInfo.isOpen ? '#22C55E18' : '#EF444418',
                    borderColor: placeInfo.isOpen ? '#22C55E50' : '#EF444450',
                  }]}>
                    <Text style={[styles.openBadgeLargeText, { color: placeInfo.isOpen ? '#22C55E' : '#EF4444' }]}>
                      {placeInfo.isOpen ? '● OPEN NOW' : '● CLOSED'}
                    </Text>
                  </View>
                )}
                {placeInfo?.rating != null && (
                  <Text style={[styles.ratingText, { marginTop: 6 }]}>
                    ⭐ {placeInfo.rating.toFixed(1)}{placeInfo.userRatingCount != null ? `  ·  ${placeInfo.userRatingCount.toLocaleString()} reviews` : ''}
                  </Text>
                )}
                {/* Directions */}
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Linking.openURL(buildMapsUrl(currentRestaurant.name, placeInfo));
                  }}
                  style={[styles.directionsBtn, { marginTop: 12 }]}
                >
                  <Text style={styles.directionsBtnText}>📍 Get Directions</Text>
                </TouchableOpacity>
              </View>

              {/* Menu Items */}
              <View style={styles.restaurantMenuCard}>
                <Text style={styles.restaurantMenuLabel}>TOP ITEMS</Text>
                {currentRestaurant.items.slice(0, 3).map((item, i) => (
                  <View key={i} style={styles.restaurantMenuItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.restaurantItemName}>{item.name}</Text>
                      <Text style={styles.restaurantItemMacro}>{item.calories} cal · {item.proteinG}g protein</Text>
                    </View>
                  </View>
                ))}
                <Text style={styles.restaurantMenuNote}>📍 Full menu in the Eat Right tab</Text>
              </View>

              {/* Restaurant actions */}
              <View style={styles.resultActions}>
                <TouchableOpacity style={styles.spinAgainBtn} onPress={spinRandom}>
                  <Text style={styles.spinAgainText}>🎲  Spin Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.browseAllBtn} onPress={() => setViewState('browse')}>
                  <Text style={styles.browseAllText}>Browse All →</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </Animated.View>
          </ScrollView>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/* BROWSE ALL                                               */}
        {/* ════════════════════════════════════════════════════════ */}
        {viewState === 'browse' && (
          <View style={{ flex: 1 }}>
            <View style={styles.browseHeader}>
              <TouchableOpacity onPress={() => setViewState('landing')}>
                <Text style={styles.backBtn}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.browseTitle}>All Fort Worth Spots</Text>
              <View style={{ width: 50 }} />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.browseScroll}
              showsVerticalScrollIndicator={false}
            >
              {ACTIVITIES.map(activity => {
                const isOpen = expandedId === activity.id;
                return (
                  <View key={activity.id} style={styles.actCard}>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setExpandedId(prev => prev === activity.id ? null : activity.id);
                      }}
                      style={styles.actHeader}
                    >
                      <View style={[styles.actEmojiWrap, { backgroundColor: activity.color + '22' }]}>
                        <Text style={styles.actEmoji}>{activity.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.actName}>{activity.name}</Text>
                        <Text style={styles.actVibe}>{activity.vibe}</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.goSmallBtn, { backgroundColor: activity.color + '18', borderColor: activity.color + '50' }]}
                        onPress={() => showActivity(activity)}
                      >
                        <Text style={[styles.goSmallText, { color: activity.color }]}>Go</Text>
                      </TouchableOpacity>
                      <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>›</Text>
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={styles.actBody}>
                        <Text style={styles.actDesc}>{activity.description}</Text>
                        <Text style={[styles.actVibe, { marginTop: 4 }]}>🏃 {activity.workout}</Text>
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Restaurants Section */}
              <View style={{ marginTop: 24, marginBottom: 12 }}>
                <Text style={[styles.sectionLabel, { marginLeft: spacing.lg, marginBottom: 12 }]}>🍽️  FEATURED RESTAURANTS</Text>
                {ALL_RESTAURANTS.slice(0, 10).map(restaurant => (
                  <View key={restaurant.id} style={styles.actCard}>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => showRestaurant(restaurant)}
                      style={styles.actHeader}
                    >
                      <View style={[styles.actEmojiWrap, { backgroundColor: colors.orange + '22' }]}>
                        <Text style={styles.actEmoji}>{restaurant.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.actName}>{restaurant.name}</Text>
                        <Text style={styles.actVibe}>{restaurant.category}</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.goSmallBtn, { backgroundColor: colors.orange + '18', borderColor: colors.orange + '50' }]}
                        onPress={() => showRestaurant(restaurant)}
                      >
                        <Text style={[styles.goSmallText, { color: ORANGE }]}>Go</Text>
                      </TouchableOpacity>
                      <Text style={[styles.chevron]}>›</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text style={styles.browseFooter}>TRINITY TRAIL · STOCKYARDS · MAGNOLIA AVE · W. 7TH</Text>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        )}

      </View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  // ── Minimal header ─────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: spacing.lg, paddingBottom: 12, alignItems: 'flex-end',
    backgroundColor: colors.bg,
  },
  closeBtn:     { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },

  // ── Landing ─────────────────────────────────────────────────────────────────
  landingWrap: { flex: 1, paddingBottom: 60 },
  landingHero: {
    height: 200,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
  },
  landingHeroImage: { opacity: 0.75 },
  landingHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,15,0.55)',
  },
  landingTitle: { fontSize: 44, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1.5, marginBottom: 4 },
  landingEmoji: { fontSize: 40, marginBottom: 8 },
  landingSub:   { fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: '600' },
  landingBody:  { paddingHorizontal: spacing.xl, alignItems: 'center' },

  searchWrap:   { flexDirection: 'row', gap: 10, alignItems: 'center', width: '100%', marginBottom: 8 },
  searchBar:    { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 12, paddingVertical: 12 },
  searchIcon:   { fontSize: 14 },
  searchInput:  { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '600', padding: 0 },
  clearBtn:     { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
  searchGoBtn:  { backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: colors.cardBorder },
  searchGoBtnText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  noResultText: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginBottom: 12 },

  dividerRow:  { flexDirection: 'row', alignItems: 'center', width: '60%', gap: 10, marginBottom: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
  dividerStar: { fontSize: 14, color: ORANGE, fontWeight: '700' },

  goBtn: {
    backgroundColor: ORANGE, borderRadius: radius.full,
    paddingHorizontal: 52, paddingVertical: 18,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    marginBottom: 10,
  },
  goBtnText: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  goHint:    { fontSize: 12, color: colors.textMuted, marginBottom: 24, fontWeight: '500' },
  browseBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder },
  browseBtnText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },

  // ── Result ──────────────────────────────────────────────────────────────────
  resultScroll: { paddingBottom: 20 },

  photoWrap:    { height: 240, position: 'relative' },
  photo:        { width: '100%', height: '100%' },
  photoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  photoMeta:    { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg },
  photoEmoji:   { fontSize: 28, marginBottom: 4 },
  photoName:    { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5, marginBottom: 8 },
  workoutPill:     { alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.4)' },
  workoutPillText: { fontSize: 11, fontWeight: '700' },
  photoPillRow:    { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 0 },
  openBadge:       { borderRadius: radius.full, paddingHorizontal: 9, paddingVertical: 4 },
  openBadgeText:   { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  descCard:       { backgroundColor: colors.card, marginHorizontal: spacing.lg, marginTop: -1, borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md, padding: spacing.md, borderWidth: 1, borderTopWidth: 0, borderColor: colors.cardBorder, marginBottom: 12 },
  descTopRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  vibeText:       { fontSize: 11, fontWeight: '700', color: ORANGE, letterSpacing: 0.5, textTransform: 'uppercase' },
  descText:       { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  ratingText:     { fontSize: 12, color: colors.textSecondary, marginTop: 6, fontWeight: '600' },
  directionsBtn:  { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.orange + '60', borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  directionsBtnText: { fontSize: 11, fontWeight: '700', color: ORANGE },

  sectionLabel: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },

  // Playlist card
  playlistCard: {
    backgroundColor: colors.card, borderRadius: radius.md,
    padding: spacing.md, borderLeftWidth: 3,
    borderWidth: 1, borderColor: colors.cardBorder,
    marginHorizontal: spacing.lg, marginBottom: 12,
  },
  playlistHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  playlistIcon:   { fontSize: 20 },
  playlistName:   { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  playlistSub:    { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  trackRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  trackNum:       { fontSize: 11, fontWeight: '700', color: colors.textMuted, width: 16, textAlign: 'center' },
  trackTitle:     { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  trackArtist:    { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  startsPill:     { backgroundColor: ORANGE + '20', borderRadius: radius.full, paddingHorizontal: 7, paddingVertical: 2 },
  startsPillText: { fontSize: 9, fontWeight: '800', color: ORANGE },
  openSpotifyBtn: { backgroundColor: SPOTIFY, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  openSpotifyText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  // Spotify section
  spotifySection:    { marginHorizontal: spacing.lg, marginBottom: 12 },
  spotifyHeaderRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  disconnectText:    { fontSize: 12, fontWeight: '700', color: '#E84040' },
  connectBtn:        { backgroundColor: SPOTIFY, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  connectBtnText:    { fontSize: 15, fontWeight: '800', color: '#fff' },
  spotifySearchWrap: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 12 },
  spotifySearchBar:  { flex: 1, backgroundColor: colors.card, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 12, paddingVertical: 10 },
  spotifySearchInput:{ fontSize: 13, color: colors.textPrimary, fontWeight: '600', padding: 0 },
  spotifyGoBtn:      { backgroundColor: SPOTIFY, borderRadius: radius.sm, paddingHorizontal: 16, paddingVertical: 12 },
  spotifyGoBtnText:  { fontSize: 13, fontWeight: '800', color: '#fff' },
  playlistGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  playlistGridItem:  { width: '30%', alignItems: 'center' },
  playlistThumb:     { width: '100%', aspectRatio: 1, borderRadius: radius.sm, marginBottom: 4, backgroundColor: colors.card },
  playlistThumbFallback: { alignItems: 'center', justifyContent: 'center' },
  playlistGridName:  { fontSize: 11, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  emptyText:         { fontSize: 12, color: colors.textMuted, textAlign: 'center', paddingVertical: 12 },

  // Result actions
  resultActions:  { flexDirection: 'row', gap: 12, paddingHorizontal: spacing.lg, marginTop: 4 },
  spinAgainBtn:   { flex: 1, paddingVertical: 14, borderRadius: radius.md, borderWidth: 1, borderColor: ORANGE + '60', backgroundColor: ORANGE + '12', alignItems: 'center' },
  spinAgainText:  { fontSize: 15, fontWeight: '800', color: ORANGE },
  browseAllBtn:   { flex: 1, paddingVertical: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, alignItems: 'center' },
  browseAllText:  { fontSize: 15, fontWeight: '700', color: colors.textSecondary },

  // ── Browse ──────────────────────────────────────────────────────────────────
  browseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: 14, backgroundColor: colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  backBtn:      { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  browseTitle:  { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  browseScroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  actCard:     { backgroundColor: colors.card, borderRadius: radius.md, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.cardBorder },
  actHeader:   { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: 10 },
  actEmojiWrap:{ width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  actEmoji:    { fontSize: 22 },
  actName:     { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  actVibe:     { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  goSmallBtn:  { borderWidth: 1, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  goSmallText: { fontSize: 12, fontWeight: '700' },
  chevron:     { fontSize: 22, color: colors.textMuted, fontWeight: '300', transform: [{ rotate: '90deg' }] },
  chevronOpen: { transform: [{ rotate: '-90deg' }] },
  actBody:     { paddingHorizontal: spacing.md, paddingBottom: spacing.md, paddingTop: 0 },
  actDesc:     { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  browseFooter:{ fontSize: 9, fontWeight: '700', letterSpacing: 1.4, color: colors.textMuted, textAlign: 'center', marginTop: 24 },

  // ── Restaurant result ───────────────────────────────────────────────────────
  restaurantHeader: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 32, backgroundColor: colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  restaurantEmoji: { fontSize: 48, marginBottom: 12 },
  restaurantName: { fontSize: 28, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5, marginBottom: 8 },
  restaurantCategory: { backgroundColor: ORANGE + '20', borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  restaurantCategoryText: { fontSize: 12, fontWeight: '700', color: ORANGE },
  openBadgeLarge: { marginTop: 10, borderWidth: 1, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 6 },
  openBadgeLargeText: { fontSize: 13, fontWeight: '800' },

  restaurantMenuCard: { backgroundColor: colors.card, marginHorizontal: spacing.lg, marginTop: spacing.lg, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 12 },
  restaurantMenuLabel: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 12 },
  restaurantMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  restaurantItemName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  restaurantItemMacro: { fontSize: 12, color: colors.textSecondary },
  restaurantMenuNote: { fontSize: 12, color: colors.textSecondary, marginTop: 12, fontStyle: 'italic' },
});
