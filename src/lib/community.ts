/**
 * Funkytown Fit — Community Platform API
 * All Supabase operations for the community/social feature.
 */

import { supabase } from './supabase';
import { getSession } from './auth';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PostType = 'text' | 'achievement' | 'place' | 'playlist' | 'event' | 'question';
export type EventType = 'fitness' | 'food' | 'fun' | 'community';
export type FollowType = 'user' | 'gym' | 'restaurant' | 'place';

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string | null;
  postType: PostType;
  content: string | null;
  imageUrl: string | null;
  placeId: string | null;
  placeName: string | null;
  achievementTag: string | null;
  playlistName: string | null;
  playlistUrl: string | null;
  eventId: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isLikedByMe?: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string | null;
  content: string;
  createdAt: string;
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string | null;
  followingType: FollowType;
  followingName: string | null;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  createdBy: string | null;
  title: string;
  description: string | null;
  eventType: EventType;
  eventDate: string;   // YYYY-MM-DD
  eventTime: string | null;
  location: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  imageUrl: string | null;
  externalUrl: string | null;
  rsvpCount: number;
  isFeatured: boolean;
  createdAt: string;
  isRsvpByMe?: boolean;
}

export interface CreatePostInput {
  postType: PostType;
  content?: string;
  imageUrl?: string;
  placeId?: string;
  placeName?: string;
  achievementTag?: string;
  playlistName?: string;
  playlistUrl?: string;
  eventId?: string;
}

// ─── Posts ─────────────────────────────────────────────────────────────────────

/**
 * Fetch the community feed.
 * Returns the most recent posts from all users (or just followed users if implemented).
 */
export async function getFeed(limit = 30, offset = 0): Promise<CommunityPost[]> {
  const session = await getSession();
  const myId = session?.id ?? null;

  const { data: posts } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (!posts?.length) return [];

  // Check which posts I've liked
  let likedIds = new Set<string>();
  if (myId) {
    const postIds = posts.map(p => p.id);
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', myId)
      .in('post_id', postIds);
    likedIds = new Set((likes ?? []).map(l => l.post_id));
  }

  return posts.map(p => ({ ...rowToPost(p), isLikedByMe: likedIds.has(p.id) }));
}

/** Create a new post */
export async function createPost(input: CreatePostInput): Promise<CommunityPost | null> {
  const session = await getSession();
  if (!session) return null;

  const profile = await supabase
    .from('profiles')
    .select('name')
    .eq('id', session.id)
    .single();

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id:         session.id,
      author_name:     profile.data?.name ?? null,
      post_type:       input.postType,
      content:         input.content ?? null,
      image_url:       input.imageUrl ?? null,
      place_id:        input.placeId ?? null,
      place_name:      input.placeName ?? null,
      achievement_tag: input.achievementTag ?? null,
      playlist_name:   input.playlistName ?? null,
      playlist_url:    input.playlistUrl ?? null,
      event_id:        input.eventId ?? null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return rowToPost(data);
}

/** Delete a post (author only) */
export async function deletePost(postId: string): Promise<void> {
  await supabase.from('community_posts').delete().eq('id', postId);
}

// ─── Likes ─────────────────────────────────────────────────────────────────────

export async function likePost(postId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase.from('post_likes').insert({ post_id: postId, user_id: session.id });
  // Increment like_count
  await supabase.rpc('increment_like_count', { p_post_id: postId });
}

export async function unlikePost(postId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', session.id);
  // Decrement
  await supabase.rpc('decrement_like_count', { p_post_id: postId });
}

// ─── Comments ──────────────────────────────────────────────────────────────────

export async function getComments(postId: string): Promise<PostComment[]> {
  const { data } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  return (data ?? []).map(rowToComment);
}

export async function addComment(postId: string, content: string): Promise<PostComment | null> {
  const session = await getSession();
  if (!session) return null;

  const profile = await supabase
    .from('profiles')
    .select('name')
    .eq('id', session.id)
    .single();

  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id:     postId,
      user_id:     session.id,
      author_name: profile.data?.name ?? null,
      content,
    })
    .select()
    .single();

  if (error || !data) return null;

  // Increment comment_count
  await supabase
    .from('community_posts')
    .update({ comment_count: supabase.rpc('increment', { x: 1 }) as unknown as number })
    .eq('id', postId);

  return rowToComment(data);
}

// ─── Follows ────────────────────────────────────────────────────────────────────

/** Follow another user */
export async function followUser(targetUserId: string, targetName: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase.from('user_follows').insert({
    follower_id:    session.id,
    following_id:   targetUserId,
    following_type: 'user',
    following_name: targetName,
  });
}

/** Unfollow a user */
export async function unfollowUser(targetUserId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', session.id)
    .eq('following_id', targetUserId)
    .eq('following_type', 'user');
}

/** Check if I follow a user */
export async function isFollowing(targetUserId: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const { data } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', session.id)
    .eq('following_id', targetUserId)
    .eq('following_type', 'user')
    .single();

  return !!data;
}

/** Get my follow list */
export async function getMyFollows(): Promise<UserFollow[]> {
  const session = await getSession();
  if (!session) return [];

  const { data } = await supabase
    .from('user_follows')
    .select('*')
    .eq('follower_id', session.id)
    .order('created_at', { ascending: false });

  return (data ?? []).map(rowToFollow);
}

/** Get count of followers for a user */
export async function getFollowerCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('user_follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', userId)
    .eq('following_type', 'user');

  return count ?? 0;
}

/** Get count of posts by a user */
export async function getUserPostCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('community_posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  return count ?? 0;
}

/** Get posts by a specific user */
export async function getUserPosts(userId: string, limit = 20): Promise<CommunityPost[]> {
  const { data } = await supabase
    .from('community_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []).map(rowToPost);
}

// ─── Events ─────────────────────────────────────────────────────────────────────

/** Get upcoming community events */
export async function getUpcomingEvents(limit = 20): Promise<CommunityEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const session = await getSession();
  const myId = session?.id ?? null;

  const { data: events } = await supabase
    .from('community_events')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(limit);

  if (!events?.length) return [];

  let rsvpdIds = new Set<string>();
  if (myId) {
    const eventIds = events.map(e => e.id);
    const { data: rsvps } = await supabase
      .from('event_rsvps')
      .select('event_id')
      .eq('user_id', myId)
      .in('event_id', eventIds);
    rsvpdIds = new Set((rsvps ?? []).map(r => r.event_id));
  }

  return events.map(e => ({ ...rowToEvent(e), isRsvpByMe: rsvpdIds.has(e.id) }));
}

/** Get events filtered by type */
export async function getEventsByType(eventType: EventType): Promise<CommunityEvent[]> {
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from('community_events')
    .select('*')
    .eq('event_type', eventType)
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(20);

  return (data ?? []).map(rowToEvent);
}

/** RSVP to an event */
export async function rsvpToEvent(eventId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase.from('event_rsvps').insert({ event_id: eventId, user_id: session.id });
  // Increment RSVP count
  const { data: event } = await supabase
    .from('community_events')
    .select('rsvp_count')
    .eq('id', eventId)
    .single();
  if (event) {
    await supabase
      .from('community_events')
      .update({ rsvp_count: (event.rsvp_count ?? 0) + 1 })
      .eq('id', eventId);
  }
}

/** Un-RSVP from an event */
export async function unrsvpFromEvent(eventId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase
    .from('event_rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', session.id);

  const { data: event } = await supabase
    .from('community_events')
    .select('rsvp_count')
    .eq('id', eventId)
    .single();
  if (event && event.rsvp_count > 0) {
    await supabase
      .from('community_events')
      .update({ rsvp_count: event.rsvp_count - 1 })
      .eq('id', eventId);
  }
}

/** Create a new community event */
export async function createEvent(input: {
  title: string;
  description?: string;
  eventType: EventType;
  eventDate: string;
  eventTime?: string;
  location?: string;
  address?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  externalUrl?: string;
}): Promise<CommunityEvent | null> {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('community_events')
    .insert({
      created_by:   session.id,
      title:        input.title,
      description:  input.description ?? null,
      event_type:   input.eventType,
      event_date:   input.eventDate,
      event_time:   input.eventTime ?? null,
      location:     input.location ?? null,
      address:      input.address ?? null,
      lat:          input.lat ?? null,
      lng:          input.lng ?? null,
      image_url:    input.imageUrl ?? null,
      external_url: input.externalUrl ?? null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return rowToEvent(data);
}

// ─── Row mappers ───────────────────────────────────────────────────────────────

function rowToPost(row: any): CommunityPost {
  return {
    id:             row.id,
    userId:         row.user_id,
    authorName:     row.author_name ?? null,
    postType:       row.post_type as PostType,
    content:        row.content ?? null,
    imageUrl:       row.image_url ?? null,
    placeId:        row.place_id ?? null,
    placeName:      row.place_name ?? null,
    achievementTag: row.achievement_tag ?? null,
    playlistName:   row.playlist_name ?? null,
    playlistUrl:    row.playlist_url ?? null,
    eventId:        row.event_id ?? null,
    likeCount:      row.like_count ?? 0,
    commentCount:   row.comment_count ?? 0,
    createdAt:      row.created_at,
  };
}

function rowToComment(row: any): PostComment {
  return {
    id:         row.id,
    postId:     row.post_id,
    userId:     row.user_id,
    authorName: row.author_name ?? null,
    content:    row.content,
    createdAt:  row.created_at,
  };
}

function rowToFollow(row: any): UserFollow {
  return {
    id:            row.id,
    followerId:    row.follower_id,
    followingId:   row.following_id ?? null,
    followingType: row.following_type as FollowType,
    followingName: row.following_name ?? null,
    createdAt:     row.created_at,
  };
}

function rowToEvent(row: any): CommunityEvent {
  return {
    id:          row.id,
    createdBy:   row.created_by ?? null,
    title:       row.title,
    description: row.description ?? null,
    eventType:   row.event_type as EventType,
    eventDate:   row.event_date,
    eventTime:   row.event_time ?? null,
    location:    row.location ?? null,
    address:     row.address ?? null,
    lat:         row.lat ?? null,
    lng:         row.lng ?? null,
    imageUrl:    row.image_url ?? null,
    externalUrl: row.external_url ?? null,
    rsvpCount:   row.rsvp_count ?? 0,
    isFeatured:  row.is_featured ?? false,
    createdAt:   row.created_at,
  };
}

// ─── Friendship Types ──────────────────────────────────────────────────────────

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  requesterName: string | null;
  addresseeName: string | null;
  status: FriendshipStatus;
  createdAt: string;
}

// ─── Friendship Functions ──────────────────────────────────────────────────────

/**
 * Send a friend request to another user.
 */
export async function sendFriendRequest(
  targetId: string,
  targetName: string,
  myName: string,
): Promise<{ friendship: Friendship | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { friendship: null, error: 'Not authenticated' };
  if (session.id === targetId) return { friendship: null, error: 'Cannot friend yourself' };

  // Check if a relationship already exists in either direction
  const { data: existing } = await supabase
    .from('friendships')
    .select('*')
    .or(
      `and(requester_id.eq.${session.id},addressee_id.eq.${targetId}),` +
      `and(requester_id.eq.${targetId},addressee_id.eq.${session.id})`,
    )
    .maybeSingle();

  if (existing) {
    return { friendship: rowToFriendship(existing), error: null };
  }

  const { data, error } = await supabase
    .from('friendships')
    .insert({
      requester_id:   session.id,
      addressee_id:   targetId,
      requester_name: myName,
      addressee_name: targetName,
      status:         'pending',
    })
    .select()
    .single();

  if (error || !data) return { friendship: null, error: error?.message ?? 'Failed to send request' };
  return { friendship: rowToFriendship(data), error: null };
}

/**
 * Accept a pending friend request addressed to me.
 */
export async function acceptFriendRequest(
  friendshipId: string,
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', friendshipId)
    .eq('addressee_id', session.id)
    .eq('status', 'pending');

  return { error: error?.message ?? null };
}

/**
 * Decline a pending friend request.
 */
export async function declineFriendRequest(
  friendshipId: string,
): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase
    .from('friendships')
    .update({ status: 'declined', updated_at: new Date().toISOString() })
    .eq('id', friendshipId)
    .eq('addressee_id', session.id);
}

/**
 * Remove a friend (delete the friendship row).
 */
export async function removeFriend(friendId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase
    .from('friendships')
    .delete()
    .or(
      `and(requester_id.eq.${session.id},addressee_id.eq.${friendId}),` +
      `and(requester_id.eq.${friendId},addressee_id.eq.${session.id})`,
    );
}

/**
 * Get all accepted friends for a user.
 */
export async function getFriends(userId: string): Promise<Friendship[]> {
  const { data } = await supabase
    .from('friendships')
    .select('*')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  return (data ?? []).map(rowToFriendship);
}

/**
 * Get just the user IDs of my friends (for feed filtering).
 */
export async function getFriendIds(userId: string): Promise<string[]> {
  const friends = await getFriends(userId);
  return friends.map(f => f.requesterId === userId ? f.addresseeId : f.requesterId);
}

/**
 * Get pending friend requests addressed TO me.
 */
export async function getPendingFriendRequests(): Promise<Friendship[]> {
  const session = await getSession();
  if (!session) return [];

  const { data } = await supabase
    .from('friendships')
    .select('*')
    .eq('addressee_id', session.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (data ?? []).map(rowToFriendship);
}

/**
 * Get the friendship status between me and another user.
 * Returns null if no relationship exists.
 */
export async function getFriendshipStatus(
  targetId: string,
): Promise<{ friendship: Friendship | null; iAmRequester: boolean }> {
  const session = await getSession();
  if (!session) return { friendship: null, iAmRequester: false };

  const { data } = await supabase
    .from('friendships')
    .select('*')
    .or(
      `and(requester_id.eq.${session.id},addressee_id.eq.${targetId}),` +
      `and(requester_id.eq.${targetId},addressee_id.eq.${session.id})`,
    )
    .maybeSingle();

  if (!data) return { friendship: null, iAmRequester: false };
  return {
    friendship:   rowToFriendship(data),
    iAmRequester: data.requester_id === session.id,
  };
}

// ─── Friends Feed ─────────────────────────────────────────────────────────────

/**
 * Fetch posts only from friends (+ my own posts + featured promoted posts).
 */
export async function getFriendsFeed(limit = 30, offset = 0): Promise<CommunityPost[]> {
  const session = await getSession();
  if (!session) return [];

  const friendIds = await getFriendIds(session.id);
  // Include my own posts too
  const allowedIds = [session.id, ...friendIds];

  const { data: posts } = await supabase
    .from('community_posts')
    .select('*')
    .in('user_id', allowedIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (!posts?.length) return [];

  const postIds = posts.map(p => p.id);
  const { data: likes } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('user_id', session.id)
    .in('post_id', postIds);
  const likedIds = new Set((likes ?? []).map(l => l.post_id));

  return posts.map(p => ({ ...rowToPost(p), isLikedByMe: likedIds.has(p.id) }));
}

// ─── Fit Partnership Types ─────────────────────────────────────────────────────

export type FitPartnerStatus = 'pending' | 'active' | 'paused' | 'removed';

export interface FitPartnerSharedData {
  workouts: boolean;
  nutrition: boolean;
  weight: boolean;
}

export interface FitPartnership {
  id: string;
  requesterId: string;
  partnerId: string;
  status: FitPartnerStatus;
  sharedData: FitPartnerSharedData;
  createdAt: string;
}

// ─── Fit Partnership Functions ─────────────────────────────────────────────────

/**
 * Send a fit partner request.
 */
export async function sendFitPartnerRequest(
  targetId: string,
): Promise<{ partnership: FitPartnership | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { partnership: null, error: 'Not authenticated' };

  // Must already be friends
  const friendIds = await getFriendIds(session.id);
  if (!friendIds.includes(targetId)) {
    return { partnership: null, error: 'You must be friends first to become Fit Partners.' };
  }

  const { data, error } = await supabase
    .from('fit_partnerships')
    .insert({
      requester_id: session.id,
      partner_id:   targetId,
      status:       'pending',
      shared_data:  { workouts: true, nutrition: true, weight: false },
    })
    .select()
    .single();

  if (error || !data) return { partnership: null, error: error?.message ?? 'Failed to send request' };
  return { partnership: rowToPartnership(data), error: null };
}

/**
 * Accept a pending fit partner request.
 */
export async function acceptFitPartnerRequest(
  partnershipId: string,
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('fit_partnerships')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', partnershipId)
    .eq('partner_id', session.id)
    .eq('status', 'pending');

  return { error: error?.message ?? null };
}

/**
 * Decline or remove a fit partnership.
 */
export async function removeFitPartnership(partnerId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  await supabase
    .from('fit_partnerships')
    .update({ status: 'removed', updated_at: new Date().toISOString() })
    .or(
      `and(requester_id.eq.${session.id},partner_id.eq.${partnerId}),` +
      `and(requester_id.eq.${partnerId},partner_id.eq.${session.id})`,
    );
}

/**
 * Get all active fit partnerships for a user.
 */
export async function getFitPartners(userId: string): Promise<FitPartnership[]> {
  const { data } = await supabase
    .from('fit_partnerships')
    .select('*')
    .eq('status', 'active')
    .or(`requester_id.eq.${userId},partner_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  return (data ?? []).map(rowToPartnership);
}

/**
 * Get just the user IDs of my active fit partners.
 */
export async function getFitPartnerIds(userId: string): Promise<string[]> {
  const partners = await getFitPartners(userId);
  return partners.map(p => p.requesterId === userId ? p.partnerId : p.requesterId);
}

/**
 * Update what data is shared in a fit partnership.
 */
export async function updateFitPartnerSharedData(
  partnershipId: string,
  sharedData: Partial<FitPartnerSharedData>,
): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const { data: existing } = await supabase
    .from('fit_partnerships')
    .select('shared_data')
    .eq('id', partnershipId)
    .single();

  const merged = { ...(existing?.shared_data ?? {}), ...sharedData };

  await supabase
    .from('fit_partnerships')
    .update({ shared_data: merged, updated_at: new Date().toISOString() })
    .eq('id', partnershipId)
    .or(`requester_id.eq.${session.id},partner_id.eq.${session.id}`);
}

/**
 * Get the fit partnership status between me and another user.
 */
export async function getFitPartnershipStatus(
  targetId: string,
): Promise<FitPartnership | null> {
  const session = await getSession();
  if (!session) return null;

  const { data } = await supabase
    .from('fit_partnerships')
    .select('*')
    .or(
      `and(requester_id.eq.${session.id},partner_id.eq.${targetId}),` +
      `and(requester_id.eq.${targetId},partner_id.eq.${session.id})`,
    )
    .maybeSingle();

  return data ? rowToPartnership(data) : null;
}

// ─── Row mappers ───────────────────────────────────────────────────────────────

function rowToFriendship(row: any): Friendship {
  return {
    id:            row.id,
    requesterId:   row.requester_id,
    addresseeId:   row.addressee_id,
    requesterName: row.requester_name ?? null,
    addresseeName: row.addressee_name ?? null,
    status:        row.status as FriendshipStatus,
    createdAt:     row.created_at,
  };
}

function rowToPartnership(row: any): FitPartnership {
  return {
    id:          row.id,
    requesterId: row.requester_id,
    partnerId:   row.partner_id,
    status:      row.status as FitPartnerStatus,
    sharedData:  row.shared_data as FitPartnerSharedData,
    createdAt:   row.created_at,
  };
}
