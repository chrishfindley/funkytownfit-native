import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const TOKEN_KEY = 'ftf_spotify_token';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SpotifyToken {
  accessToken: string;
  expiresAt: number;   // ms timestamp
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  imageUrl: string | null;
  trackCount: number;
  uri: string;              // spotify:playlist:xxx
  externalUrl: string;      // https://open.spotify.com/playlist/xxx
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumArt: string | null;
  uri: string;              // spotify:track:xxx
  durationMs: number;
}

export interface SpotifyShow {
  id: string;
  name: string;
  publisher: string;
  imageUrl: string | null;
  uri: string;              // spotify:show:xxx
}

export type SearchResultItem =
  | { type: 'track';    data: SpotifyTrack }
  | { type: 'playlist'; data: SpotifyPlaylist }
  | { type: 'show';     data: SpotifyShow };

export interface SpotifySearchResults {
  items: SearchResultItem[];
}

// Scopes required — exported so WhereToModal can use the full set
export const SPOTIFY_SCOPES = [
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

// ── Token storage ─────────────────────────────────────────────────────────────
export async function getSpotifyToken(): Promise<SpotifyToken | null> {
  try {
    const raw = await AsyncStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const token: SpotifyToken = JSON.parse(raw);
    if (Date.now() > token.expiresAt) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  } catch { return null; }
}

export async function saveSpotifyToken(accessToken: string, expiresInSecs: number): Promise<void> {
  const token: SpotifyToken = {
    accessToken,
    expiresAt: Date.now() + expiresInSecs * 1000,
  };
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export async function clearSpotifyToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ── Search ───────────────────────────────────────────────────────────────────
// Returns a mixed list of tracks, playlists, and podcast shows for a query.
export async function searchSpotify(
  accessToken: string,
  query: string,
  limit = 5,
): Promise<SpotifySearchResults> {
  try {
    const q = encodeURIComponent(query);
    const url = `https://api.spotify.com/v1/search?q=${q}&type=track,playlist,show&limit=${limit}&market=US`;
    const res  = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const data = await res.json();

    const items: SearchResultItem[] = [];

    // Tracks
    for (const t of data.tracks?.items ?? []) {
      items.push({
        type: 'track',
        data: {
          id:         t.id,
          name:       t.name,
          artist:     t.artists?.map((a: any) => a.name).join(', ') ?? '',
          albumArt:   t.album?.images?.[0]?.url ?? null,
          uri:        t.uri,
          durationMs: t.duration_ms ?? 0,
        },
      });
    }

    // Playlists
    for (const p of data.playlists?.items ?? []) {
      if (!p) continue;
      items.push({
        type: 'playlist',
        data: {
          id:          p.id,
          name:        p.name,
          imageUrl:    p.images?.[0]?.url ?? null,
          trackCount:  p.tracks?.total ?? 0,
          uri:         p.uri,
          externalUrl: p.external_urls?.spotify ?? `https://open.spotify.com/playlist/${p.id}`,
        },
      });
    }

    // Podcast shows
    for (const s of data.shows?.items ?? []) {
      if (!s) continue;
      items.push({
        type: 'show',
        data: {
          id:        s.id,
          name:      s.name,
          publisher: s.publisher ?? '',
          imageUrl:  s.images?.[0]?.url ?? null,
          uri:       s.uri,
        },
      });
    }

    return { items };
  } catch { return { items: [] }; }
}

// ── Playback control via Web API ──────────────────────────────────────────────
// Sends a play command to the user's active Spotify device (phone/watch/desktop).
// The Spotify app must be running in the background on at least one device.
// Requires Spotify Premium. Returns a status string.
export type PlayResult =
  | 'ok'
  | 'no_premium'      // 403 — Premium required
  | 'no_device'       // 404 — No active Spotify device found
  | 'token_expired'   // 401
  | 'error';

export async function playUri(
  accessToken: string,
  uri: string,           // spotify:track:xxx  OR  spotify:playlist:xxx  OR  spotify:show:xxx
): Promise<PlayResult> {
  try {
    // For playlists/shows use context_uri; for individual tracks use uris array
    const isTrack = uri.startsWith('spotify:track:');
    const body = isTrack
      ? JSON.stringify({ uris: [uri] })
      : JSON.stringify({ context_uri: uri });

    const res = await fetch('https://api.spotify.com/v1/me/player/play', {
      method:  'PUT',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (res.status === 204) return 'ok';
    if (res.status === 401) return 'token_expired';
    if (res.status === 403) return 'no_premium';
    if (res.status === 404) return 'no_device';
    return 'error';
  } catch { return 'error'; }
}

// ── Library ───────────────────────────────────────────────────────────────────
export async function fetchMyPlaylists(accessToken: string): Promise<SpotifyPlaylist[]> {
  try {
    const res  = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (!data.items) return [];
    return data.items.map((item: any) => ({
      id:          item.id,
      name:        item.name,
      imageUrl:    item.images?.[0]?.url ?? null,
      trackCount:  item.tracks?.total ?? 0,
      uri:         item.uri,
      externalUrl: item.external_urls?.spotify ?? `https://open.spotify.com/playlist/${item.id}`,
    }));
  } catch { return []; }
}

// ── Deep-link fallbacks (used in WhereToModal browse view) ───────────────────
export async function openPlaylist(externalUrl: string, uri: string): Promise<void> {
  const canOpen = await Linking.canOpenURL('spotify:');
  await Linking.openURL(canOpen ? uri : externalUrl);
}

export async function openSpotifySearch(query: string): Promise<void> {
  const encoded    = encodeURIComponent(query);
  const spotifyUrl = `spotify:search:${encoded}`;
  const webUrl     = `https://open.spotify.com/search/${encoded}`;
  const canOpen    = await Linking.canOpenURL('spotify:');
  await Linking.openURL(canOpen ? spotifyUrl : webUrl);
}
