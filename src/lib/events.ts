/**
 * Funkytown Fit — Live Fort Worth Events
 *
 * Fetches REAL events from the Eventbrite API.
 * Rule: zero fake or hardcoded events — ever.
 *   • If the API token is missing → return empty array + log a warning.
 *   • If the API call fails         → return empty array + log the error.
 *   • Empty state is always shown honestly: "No upcoming events found."
 *
 * How to get your Eventbrite token:
 *   1. Go to https://www.eventbrite.com/platform/api and create an app.
 *   2. Copy the "Private Token" from the app's API Keys page.
 *   3. Add it to your .env file:  EVENTBRITE_TOKEN=your_token_here
 *
 * Docs: https://www.eventbrite.com/platform/api#/reference/event/search/search-events
 */

import Constants from 'expo-constants';
import { CommunityEvent, EventType } from './community';

// ─── Eventbrite API types ────────────────────────────────────────────────────

interface EBPaginatedResponse<T> {
  events?: T[];
  pagination: { page_count: number; page_number: number };
}

interface EBEvent {
  id: string;
  name:        { text: string; html: string };
  description: { text: string | null };
  start:       { local: string; utc: string };
  end:         { local: string; utc: string };
  url:         string;
  logo:        { url: string } | null;
  venue?: {
    name:    string | null;
    address: { localized_address_display: string | null };
    latitude:  string | null;
    longitude: string | null;
  };
  category_id: string | null;
}

// ─── Category mapping ─────────────────────────────────────────────────────────
// Eventbrite category IDs → our EventType
// https://www.eventbrite.com/platform/api#/reference/category/list/list-categories

const CATEGORY_MAP: Record<string, EventType> = {
  '107': 'food',       // Food & Drink
  '113': 'fitness',    // Sports & Fitness
  '110': 'community',  // Community
  '108': 'fun',        // Arts
  '103': 'fun',        // Music
  '102': 'fun',        // Film, Media & Entertainment
  '109': 'fun',        // Travel & Outdoor
  '111': 'fun',        // Fashion & Beauty
  '114': 'community',  // Government & Politics
  '116': 'community',  // Charity & Causes
  '117': 'community',  // Religion & Spirituality
  '118': 'community',  // Family & Education
  '119': 'community',  // Seasonal & Holiday
  '120': 'fun',        // Home & Lifestyle
  '121': 'fun',        // Auto, Boat & Air
  '122': 'fun',        // Hobbies & Special Interest
  '123': 'fun',        // Business & Professional
  '124': 'community',  // Science & Technology
  '125': 'fitness',    // Health & Wellness
};

function categoryToEventType(categoryId: string | null): EventType {
  if (!categoryId) return 'community';
  return CATEGORY_MAP[categoryId] ?? 'community';
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetch upcoming Fort Worth events from Eventbrite.
 * Returns a list shaped exactly like `CommunityEvent` so it drops into the
 * existing EventCard UI with zero changes.
 *
 * @param limit  Max events to return (default 20, max 50 per Eventbrite page)
 */
export async function fetchFortWorthEvents(limit = 20): Promise<CommunityEvent[]> {
  const token: string | undefined = Constants.expoConfig?.extra?.eventbriteToken;

  if (!token || token === 'your_eventbrite_private_token') {
    console.warn(
      '[events] EVENTBRITE_TOKEN not set. ' +
      'Add it to .env to show live events. Showing no events.'
    );
    return [];
  }

  const params = new URLSearchParams({
    'location.address':       'Fort Worth, TX',
    'location.within':        '30mi',
    'expand':                 'venue',
    'sort_by':                'date',
    'status':                 'live',
    'page_size':              String(Math.min(limit, 50)),
    'start_date.range_start': new Date().toISOString(),
  });

  try {
    const res = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:        'application/json',
        },
      }
    );

    if (!res.ok) {
      console.error(`[events] Eventbrite API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const json: EBPaginatedResponse<EBEvent> = await res.json();
    const rawEvents = json.events ?? [];

    return rawEvents.slice(0, limit).map(ev => mapEBEvent(ev));
  } catch (err) {
    console.error('[events] Eventbrite fetch failed:', err);
    return [];
  }
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapEBEvent(ev: EBEvent): CommunityEvent {
  // Parse date/time from Eventbrite's ISO local string, e.g. "2025-05-10T14:00:00"
  const localStart = ev.start.local;            // "YYYY-MM-DDTHH:MM:SS"
  const eventDate  = localStart.slice(0, 10);  // "YYYY-MM-DD"
  const eventTime  = localStart.slice(11, 16); // "HH:MM"

  const venue = ev.venue;
  const location = venue?.name ?? null;
  const address  = venue?.address?.localized_address_display ?? null;
  const lat  = venue?.latitude  ? parseFloat(venue.latitude)  : null;
  const lng  = venue?.longitude ? parseFloat(venue.longitude) : null;

  return {
    id:          `eb_${ev.id}`,    // prefix so it's distinct from Supabase IDs
    createdBy:   null,
    title:       ev.name.text,
    description: ev.description.text ?? null,
    eventType:   categoryToEventType(ev.category_id),
    eventDate,
    eventTime,
    location,
    address,
    lat,
    lng,
    imageUrl:    ev.logo?.url ?? null,
    externalUrl: ev.url,
    rsvpCount:   0,
    isFeatured:  false,
    createdAt:   new Date().toISOString(),
    isRsvpByMe:  false,
  };
}
