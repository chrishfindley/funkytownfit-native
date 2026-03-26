/**
 * Funkytown Fit — Messaging API
 * Handles conversations between friends AND between trainers and clients.
 * Backed by the `conversations` and `messages` tables from
 * supabase_community_v2_migration.sql
 */

import { supabase } from './supabase';
import { getSession } from './auth';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConvType = 'friend' | 'trainer_client';

export interface Conversation {
  id: string;
  convType: ConvType;
  participant1Id: string;
  participant2Id: string;
  participant1Name: string | null;
  participant2Name: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;   // unread count for the current user
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string | null;
  content: string;
  readAt: string | null;
  createdAt: string;
  isMine: boolean;   // convenience flag set client-side
}

// ─── Conversations ─────────────────────────────────────────────────────────────

/**
 * Get or create a 1-on-1 conversation between two users.
 * Always orders participant IDs lo-uuid first for uniqueness.
 */
export async function getOrCreateConversation(
  otherUserId: string,
  otherUserName: string,
  myName: string,
  convType: ConvType = 'friend',
): Promise<{ conversation: Conversation | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { conversation: null, error: 'Not authenticated' };

  const myId = session.id;

  // Enforce deterministic ordering so the unique constraint always matches
  const [p1Id, p2Id] = myId < otherUserId
    ? [myId, otherUserId]
    : [otherUserId, myId];
  const [p1Name, p2Name] = myId < otherUserId
    ? [myName, otherUserName]
    : [otherUserName, myName];

  // Try to find existing
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('participant1_id', p1Id)
    .eq('participant2_id', p2Id)
    .maybeSingle();

  if (existing) {
    return { conversation: rowToConversation(existing, myId), error: null };
  }

  // Create new
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      conv_type:         convType,
      participant1_id:   p1Id,
      participant2_id:   p2Id,
      participant1_name: p1Name,
      participant2_name: p2Name,
    })
    .select()
    .single();

  if (error || !data) return { conversation: null, error: error?.message ?? 'Failed to create conversation' };
  return { conversation: rowToConversation(data, myId), error: null };
}

/**
 * Get all conversations for the current user, ordered by most recent message.
 */
export async function getMyConversations(): Promise<Conversation[]> {
  const session = await getSession();
  if (!session) return [];

  const myId = session.id;

  const { data } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant1_id.eq.${myId},participant2_id.eq.${myId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  return (data ?? []).map(row => rowToConversation(row, myId));
}

/**
 * Get the total unread message count across all conversations.
 */
export async function getTotalUnread(): Promise<number> {
  const convos = await getMyConversations();
  return convos.reduce((sum, c) => sum + c.unreadCount, 0);
}

// ─── Messages ─────────────────────────────────────────────────────────────────

/**
 * Send a message in a conversation.
 */
export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<{ message: Message | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { message: null, error: 'Not authenticated' };

  const myId = session.id;

  // Get sender name from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', myId)
    .single();
  const senderName = profile?.name ?? null;

  const { data: msg, error: msgErr } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id:       myId,
      sender_name:     senderName,
      content,
    })
    .select()
    .single();

  if (msgErr || !msg) return { message: null, error: msgErr?.message ?? 'Failed to send' };

  // Update conversation's last_message cache + increment unread for the other participant
  const { data: convo } = await supabase
    .from('conversations')
    .select('participant1_id, unread_p1, unread_p2')
    .eq('id', conversationId)
    .single();

  if (convo) {
    const isP1 = convo.participant1_id === myId;
    await supabase
      .from('conversations')
      .update({
        last_message:    content.length > 60 ? content.slice(0, 60) + '…' : content,
        last_message_at: msg.created_at,
        // Increment the OTHER participant's unread count
        ...(isP1
          ? { unread_p2: (convo.unread_p2 ?? 0) + 1 }
          : { unread_p1: (convo.unread_p1 ?? 0) + 1 }),
      })
      .eq('id', conversationId);
  }

  return { message: rowToMessage(msg, myId), error: null };
}

/**
 * Get messages for a conversation, newest last (for chat display).
 */
export async function getMessages(
  conversationId: string,
  limit = 50,
): Promise<Message[]> {
  const session = await getSession();
  if (!session) return [];

  const myId = session.id;

  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);

  return (data ?? []).map(row => rowToMessage(row, myId));
}

/**
 * Mark all messages in a conversation as read by me.
 * Also resets my unread counter on the conversation row.
 */
export async function markConversationRead(conversationId: string): Promise<void> {
  const session = await getSession();
  if (!session) return;

  const myId = session.id;
  const now = new Date().toISOString();

  // Mark all unread messages I did NOT send as read
  await supabase
    .from('messages')
    .update({ read_at: now })
    .eq('conversation_id', conversationId)
    .neq('sender_id', myId)
    .is('read_at', null);

  // Reset my unread counter on the conversation
  const { data: convo } = await supabase
    .from('conversations')
    .select('participant1_id')
    .eq('id', conversationId)
    .single();

  if (convo) {
    const isP1 = convo.participant1_id === myId;
    await supabase
      .from('conversations')
      .update(isP1 ? { unread_p1: 0 } : { unread_p2: 0 })
      .eq('id', conversationId);
  }
}

/**
 * Subscribe to new messages in a conversation (real-time).
 * Returns an unsubscribe function.
 */
export function subscribeToConversation(
  conversationId: string,
  myId: string,
  onMessage: (msg: Message) => void,
): () => void {
  const channel = supabase
    .channel(`conv:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event:  'INSERT',
        schema: 'public',
        table:  'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      payload => {
        onMessage(rowToMessage(payload.new as any, myId));
      },
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

// ─── Trainer ↔ Client messaging helper ───────────────────────────────────────

/**
 * Open (or find) the trainer↔client DM thread.
 */
export async function getOrCreateTrainerClientConversation(
  trainerId: string,
  trainerName: string,
  clientId: string,
  clientName: string,
  viewerName: string,
): Promise<{ conversation: Conversation | null; error: string | null }> {
  const session = await getSession();
  if (!session) return { conversation: null, error: 'Not authenticated' };

  const otherUserId = session.id === trainerId ? clientId : trainerId;
  const otherUserName = session.id === trainerId ? clientName : trainerName;

  return getOrCreateConversation(otherUserId, otherUserName, viewerName, 'trainer_client');
}

// ─── Row mappers ──────────────────────────────────────────────────────────────

function rowToConversation(row: any, myId: string): Conversation {
  const isP1 = row.participant1_id === myId;
  return {
    id:               row.id,
    convType:         row.conv_type as ConvType,
    participant1Id:   row.participant1_id,
    participant2Id:   row.participant2_id,
    participant1Name: row.participant1_name ?? null,
    participant2Name: row.participant2_name ?? null,
    lastMessage:      row.last_message ?? null,
    lastMessageAt:    row.last_message_at ?? null,
    unreadCount:      isP1 ? (row.unread_p1 ?? 0) : (row.unread_p2 ?? 0),
    createdAt:        row.created_at,
  };
}

function rowToMessage(row: any, myId: string): Message {
  return {
    id:             row.id,
    conversationId: row.conversation_id,
    senderId:       row.sender_id,
    senderName:     row.sender_name ?? null,
    content:        row.content,
    readAt:         row.read_at ?? null,
    createdAt:      row.created_at,
    isMine:         row.sender_id === myId,
  };
}
