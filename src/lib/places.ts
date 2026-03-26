/**
 * Google Places API (New) wrapper
 * Uses the v1 Places API — requires billing-enabled API key
 * Docs: https://developers.google.com/maps/documentation/places/web-service/op-overview
 */
import Constants from 'expo-constants';

const API_KEY: string =
  (Constants.expoConfig?.extra?.googlePlacesApiKey as string | undefined) ?? '';

const BASE_URL = 'https://places.googleapis.com/v1';

export interface PlaceInfo {
  placeId: string | null;
  isOpen: boolean | null;          // currentOpeningHours.openNow
  photoUri: string | null;         // resolved direct image URL (no redirect)
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
}

/**
 * Resolve a Places photo resource name to a real image URL.
 * Uses skipHttpRedirect=true so we get JSON back with a photoUri field
 * instead of a 302 redirect (which React Native Image doesn't follow reliably).
 */
async function resolvePhotoUri(photoName: string): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(
      `${BASE_URL}/${photoName}/media?maxWidthPx=800&skipHttpRedirect=true&key=${API_KEY}`,
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json.photoUri as string | undefined) ?? null;
  } catch {
    return null;
  }
}

/**
 * Search for a place by text query and return key details.
 * Uses Text Search (New) — POST /v1/places:searchText
 * Only returns the top result.
 */
export async function searchPlace(query: string): Promise<PlaceInfo | null> {
  if (!API_KEY) return null;

  try {
    const response = await fetch(`${BASE_URL}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': [
          'places.id',
          'places.currentOpeningHours.openNow',
          'places.photos',
          'places.rating',
          'places.userRatingCount',
          'places.googleMapsUri',
        ].join(','),
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 1,
        locationBias: {
          // Centre on Fort Worth, TX
          circle: {
            center: { latitude: 32.7555, longitude: -97.3308 },
            radius: 80000.0,
          },
        },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const place = data.places?.[0];
    if (!place) return null;

    // Resolve the first photo to a real image URL at fetch time.
    // This avoids React Native Image having to follow a 302 redirect,
    // which silently fails on some configurations.
    const rawPhotoName: string | null = place.photos?.[0]?.name ?? null;
    const photoUri = rawPhotoName ? await resolvePhotoUri(rawPhotoName) : null;

    return {
      placeId: place.id ?? null,
      isOpen: place.currentOpeningHours?.openNow ?? null,
      photoUri,
      rating: place.rating ?? null,
      userRatingCount: place.userRatingCount ?? null,
      googleMapsUri: place.googleMapsUri ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Open the place in Google Maps (falls back to a directions search).
 */
export function buildMapsUrl(placeName: string, placeInfo: PlaceInfo | null): string {
  if (placeInfo?.googleMapsUri) return placeInfo.googleMapsUri;
  return `https://maps.google.com/?q=${encodeURIComponent(placeName + ' Fort Worth TX')}`;
}
