/**
 * Funkytown Fit — Community Screen
 * Tabs: Feed | Events | Discover
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  RefreshControl, Modal, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radius, typography } from '@/theme';
import {
  CommunityPost, CommunityEvent, PostType, EventType, Friendship,
  getFriendsFeed, createPost, likePost, unlikePost, deletePost,
  getUpcomingEvents, rsvpToEvent, unrsvpFromEvent,
  getFriends, getPendingFriendRequests, acceptFriendRequest, declineFriendRequest,
  sendFitPartnerRequest, getFitPartnershipStatus, FitPartnership,
} from '@/lib/community';
import {
  getMyConversations, getTotalUnread, sendMessage, getMessages,
  markConversationRead, subscribeToConversation,
  Conversation, Message,
} from '@/lib/messaging';
import { getSession } from '@/lib/auth';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function postTypeIcon(type: PostType): IoniconName {
  switch (type) {
    case 'achievement': return 'trophy-outline';
    case 'place':       return 'location-outline';
    case 'playlist':    return 'musical-notes-outline';
    case 'event':       return 'calendar-outline';
    case 'question':    return 'help-circle-outline';
    default:            return 'chatbubble-outline';
  }
}

function postTypeBadge(type: PostType): { label: string; color: string } {
  switch (type) {
    case 'achievement': return { label: '🏆 Achievement', color: '#F59E0B' };
    case 'place':       return { label: '📍 Place Share',  color: '#0EA5E9' };
    case 'playlist':    return { label: '🎵 Playlist',     color: '#1DB954' };
    case 'event':       return { label: '📅 Event',        color: '#8B5CF6' };
    case 'question':    return { label: '❓ Question',      color: '#EC4899' };
    default:            return { label: '',                color: 'transparent' };
  }
}

function eventTypeColor(type: EventType): string {
  switch (type) {
    case 'fitness':   return colors.orange;
    case 'food':      return '#22C55E';
    case 'fun':       return '#8B5CF6';
    case 'community': return '#0EA5E9';
    default:          return colors.textMuted;
  }
}

function eventTypeIcon(type: EventType): IoniconName {
  switch (type) {
    case 'fitness':   return 'barbell-outline';
    case 'food':      return 'restaurant-outline';
    case 'fun':       return 'happy-outline';
    case 'community': return 'people-outline';
    default:          return 'calendar-outline';
  }
}

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const diff = Math.round((d.getTime() - today.setHours(0,0,0,0)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7)   return d.toLocaleDateString('en-US', { weekday: 'long' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Post Card ─────────────────────────────────────────────────────────────────

function PostCard({
  post, myUserId, onLike, onDelete,
}: {
  post: CommunityPost;
  myUserId: string | null;
  onLike: (post: CommunityPost) => void;
  onDelete: (postId: string) => void;
}) {
  const badge   = postTypeBadge(post.postType);
  const isOwner = post.userId === myUserId;

  return (
    <View style={pc.card}>
      {/* Header row */}
      <View style={pc.header}>
        <View style={pc.avatar}>
          <Text style={pc.avatarText}>
            {(post.authorName ?? 'A')[0].toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={pc.authorName}>{post.authorName ?? 'Anonymous'}</Text>
          <Text style={pc.time}>{timeAgo(post.createdAt)}</Text>
        </View>
        {badge.label && (
          <View style={[pc.badge, { backgroundColor: badge.color + '22', borderColor: badge.color + '55' }]}>
            <Text style={[pc.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        )}
        {isOwner && (
          <TouchableOpacity
            style={pc.deleteBtn}
            onPress={() => {
              Alert.alert('Delete post?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(post.id) },
              ]);
            }}
          >
            <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {post.content ? (
        <Text style={pc.content}>{post.content}</Text>
      ) : null}

      {/* Place share */}
      {post.postType === 'place' && post.placeName && (
        <View style={pc.placeChip}>
          <Ionicons name="location" size={13} color={colors.orange} />
          <Text style={pc.placeChipText}>{post.placeName}</Text>
        </View>
      )}

      {/* Playlist share */}
      {post.postType === 'playlist' && post.playlistName && (
        <TouchableOpacity
          style={pc.playlistChip}
          onPress={() => post.playlistUrl && Linking.openURL(post.playlistUrl)}
        >
          <Ionicons name="musical-notes" size={13} color='#1DB954' />
          <Text style={pc.playlistChipText}>{post.playlistName}</Text>
          {post.playlistUrl && <Ionicons name="open-outline" size={12} color={colors.textMuted} />}
        </TouchableOpacity>
      )}

      {/* Achievement tag */}
      {post.postType === 'achievement' && post.achievementTag && (
        <View style={pc.achievementChip}>
          <Ionicons name="trophy" size={13} color="#F59E0B" />
          <Text style={pc.achievementText}>{post.achievementTag}</Text>
        </View>
      )}

      {/* Reactions row */}
      <View style={pc.reactions}>
        <TouchableOpacity style={pc.reactionBtn} onPress={() => onLike(post)}>
          <Ionicons
            name={post.isLikedByMe ? 'heart' : 'heart-outline'}
            size={18}
            color={post.isLikedByMe ? '#EF4444' : colors.textMuted}
          />
          <Text style={[pc.reactionCount, post.isLikedByMe && { color: '#EF4444' }]}>
            {post.likeCount > 0 ? post.likeCount : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={pc.reactionBtn}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.textMuted} />
          <Text style={pc.reactionCount}>
            {post.commentCount > 0 ? post.commentCount : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={pc.reactionBtn}>
          <Ionicons name="share-social-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const pc = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 10 },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.orangeDim,
    borderWidth: 1.5, borderColor: colors.orangeBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '900', color: colors.orange },
  authorName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  time:       { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
  deleteBtn: { padding: 4 },
  content: { fontSize: 14, color: colors.textPrimary, lineHeight: 21, marginBottom: 10 },
  placeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.orangeDim, borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: colors.orangeBorder, marginBottom: 10,
  },
  placeChipText: { fontSize: 12, fontWeight: '700', color: colors.orange },
  playlistChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(29,185,84,0.1)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(29,185,84,0.3)', marginBottom: 10,
  },
  playlistChipText: { fontSize: 12, fontWeight: '700', color: '#1DB954' },
  achievementChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(245,158,11,0.12)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', marginBottom: 10,
  },
  achievementText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  reactions: { flexDirection: 'row', gap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: 10, marginTop: 2 },
  reactionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reactionCount: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
});

// ─── Event Card ────────────────────────────────────────────────────────────────

function EventCard({ event, onRsvp }: { event: CommunityEvent; onRsvp: (event: CommunityEvent) => void }) {
  const typeColor = eventTypeColor(event.eventType);
  const typeIcon  = eventTypeIcon(event.eventType);

  return (
    <View style={[ec.card, event.isFeatured && ec.cardFeatured]}>
      {event.isFeatured && (
        <View style={ec.featuredBadge}>
          <Ionicons name="star" size={9} color={colors.bg} />
          <Text style={ec.featuredText}>FEATURED</Text>
        </View>
      )}

      <View style={ec.topRow}>
        <View style={[ec.typeIcon, { backgroundColor: typeColor + '22', borderColor: typeColor + '44' }]}>
          <Ionicons name={typeIcon} size={18} color={typeColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ec.title}>{event.title}</Text>
          <View style={ec.metaRow}>
            <Ionicons name="calendar-outline" size={11} color={colors.textMuted} />
            <Text style={ec.meta}>{formatEventDate(event.eventDate)}</Text>
            {event.eventTime && (
              <>
                <Text style={{ color: colors.textMuted, fontSize: 10 }}>·</Text>
                <Text style={ec.meta}>{event.eventTime}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {event.description ? (
        <Text style={ec.desc} numberOfLines={2}>{event.description}</Text>
      ) : null}

      <View style={ec.footer}>
        {event.location ? (
          <View style={ec.locationRow}>
            <Ionicons name="location-outline" size={11} color={colors.textMuted} />
            <Text style={ec.locationText} numberOfLines={1}>{event.location}</Text>
          </View>
        ) : <View />}

        <TouchableOpacity
          style={[ec.rsvpBtn, event.isRsvpByMe && ec.rsvpBtnActive]}
          onPress={() => onRsvp(event)}
        >
          <Ionicons
            name={event.isRsvpByMe ? 'checkmark-circle' : 'add-circle-outline'}
            size={14}
            color={event.isRsvpByMe ? colors.bg : typeColor}
          />
          <Text style={[ec.rsvpText, event.isRsvpByMe && { color: colors.bg }]}>
            {event.isRsvpByMe ? "I'm In!" : "RSVP"}
          </Text>
          {event.rsvpCount > 0 && (
            <Text style={[ec.rsvpCount, event.isRsvpByMe && { color: colors.bg }]}>
              {event.rsvpCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ec = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  cardFeatured: {
    borderColor: colors.orangeBorder,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featuredBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: colors.orange,
    borderRadius: radius.full,
    paddingHorizontal: 7, paddingVertical: 2,
    marginBottom: 8,
  },
  featuredText: { fontSize: 8, fontWeight: '900', color: colors.bg, letterSpacing: 1 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: 8 },
  typeIcon: { width: 38, height: 38, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title:   { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta:    { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  desc:    { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 10 },
  footer:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1, marginRight: 8 },
  locationText: { fontSize: 11, color: colors.textMuted, flex: 1 },
  rsvpBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: colors.orange,
  },
  rsvpBtnActive: { backgroundColor: colors.orange },
  rsvpText:  { fontSize: 11, fontWeight: '800', color: colors.orange, letterSpacing: 0.5 },
  rsvpCount: { fontSize: 11, fontWeight: '700', color: colors.orange },
});

// ─── New Post Modal ────────────────────────────────────────────────────────────

const POST_TYPES: { type: PostType; label: string; emoji: string; placeholder: string }[] = [
  { type: 'text',        label: 'Update',      emoji: '💬', placeholder: 'What\'s on your mind?' },
  { type: 'achievement', label: 'Achievement', emoji: '🏆', placeholder: 'Share a win! PR? Milestone? Goal crushed?' },
  { type: 'place',       label: 'Place',       emoji: '📍', placeholder: 'Recommend a spot in Fort Worth...' },
  { type: 'playlist',    label: 'Playlist',    emoji: '🎵', placeholder: 'Share your workout or vibe playlist...' },
  { type: 'question',    label: 'Question',    emoji: '❓', placeholder: 'Ask the community something...' },
];

function NewPostModal({
  visible, onClose, onPost,
}: {
  visible: boolean;
  onClose: () => void;
  onPost: (post: CommunityPost) => void;
}) {
  const [postType,      setPostType]      = useState<PostType>('text');
  const [content,       setContent]       = useState('');
  const [placeName,     setPlaceName]     = useState('');
  const [playlistName,  setPlaylistName]  = useState('');
  const [playlistUrl,   setPlaylistUrl]   = useState('');
  const [achieveTag,    setAchieveTag]    = useState('');
  const [submitting,    setSubmitting]    = useState(false);

  const currentPT = POST_TYPES.find(p => p.type === postType)!;

  function reset() {
    setContent(''); setPlaceName(''); setPlaylistName(''); setPlaylistUrl(''); setAchieveTag('');
    setPostType('text');
  }

  async function submit() {
    if (!content.trim() && postType !== 'place' && postType !== 'playlist') {
      Alert.alert('Add some content', 'Write something before posting!');
      return;
    }
    setSubmitting(true);
    const result = await createPost({
      postType,
      content: content.trim() || undefined,
      placeName: placeName.trim() || undefined,
      placeId: placeName.trim() ? 'custom' : undefined,
      playlistName: playlistName.trim() || undefined,
      playlistUrl: playlistUrl.trim() || undefined,
      achievementTag: achieveTag.trim() || undefined,
    });
    setSubmitting(false);
    if (result) {
      onPost(result);
      reset();
    } else {
      Alert.alert('Error', 'Could not post. Please try again.');
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.bgSecondary }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={npm.header}>
          <TouchableOpacity onPress={() => { onClose(); reset(); }}>
            <Text style={npm.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={npm.title}>New Post</Text>
          <TouchableOpacity onPress={submit} disabled={submitting} style={npm.postBtn}>
            {submitting ? (
              <ActivityIndicator size="small" color={colors.bg} />
            ) : (
              <Text style={npm.postBtnText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Type picker */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={npm.typeRow}>
            {POST_TYPES.map(pt => (
              <TouchableOpacity
                key={pt.type}
                style={[npm.typePill, postType === pt.type && npm.typePillActive]}
                onPress={() => setPostType(pt.type)}
              >
                <Text style={{ fontSize: 14 }}>{pt.emoji}</Text>
                <Text style={[npm.typePillLabel, postType === pt.type && npm.typePillLabelActive]}>
                  {pt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Main text input */}
          <View style={npm.inputWrap}>
            <TextInput
              style={npm.mainInput}
              placeholder={currentPT.placeholder}
              placeholderTextColor={colors.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              autoFocus
            />
          </View>

          {/* Extra fields */}
          {postType === 'place' && (
            <View style={npm.extraWrap}>
              <Text style={npm.extraLabel}>Place name</Text>
              <TextInput
                style={npm.extraInput}
                placeholder="e.g. Joe T. Garcia's"
                placeholderTextColor={colors.textMuted}
                value={placeName}
                onChangeText={setPlaceName}
              />
            </View>
          )}

          {postType === 'playlist' && (
            <View style={npm.extraWrap}>
              <Text style={npm.extraLabel}>Playlist name</Text>
              <TextInput
                style={npm.extraInput}
                placeholder="e.g. Leg Day Bangers"
                placeholderTextColor={colors.textMuted}
                value={playlistName}
                onChangeText={setPlaylistName}
              />
              <Text style={[npm.extraLabel, { marginTop: 10 }]}>Playlist link (optional)</Text>
              <TextInput
                style={npm.extraInput}
                placeholder="Spotify or Apple Music URL"
                placeholderTextColor={colors.textMuted}
                value={playlistUrl}
                onChangeText={setPlaylistUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          )}

          {postType === 'achievement' && (
            <View style={npm.extraWrap}>
              <Text style={npm.extraLabel}>Achievement tag</Text>
              <TextInput
                style={npm.extraInput}
                placeholder="e.g. New PR · 30-day streak · Goal hit"
                placeholderTextColor={colors.textMuted}
                value={achieveTag}
                onChangeText={setAchieveTag}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const npm = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
    backgroundColor: colors.bgSecondary,
  },
  cancelText:       { fontSize: 15, color: colors.textSecondary },
  title:            { ...typography.h3 },
  postBtn:          { backgroundColor: colors.orange, borderRadius: radius.full, paddingHorizontal: 16, paddingVertical: 7 },
  postBtnText:      { fontSize: 14, fontWeight: '800', color: colors.bg },
  typeRow:          { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  typePill:         { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  typePillActive:   { backgroundColor: colors.orangeDim, borderColor: colors.orangeBorder },
  typePillLabel:    { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  typePillLabelActive: { color: colors.orange },
  inputWrap:        { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  mainInput:        { fontSize: 16, color: colors.textPrimary, lineHeight: 24, minHeight: 120 },
  extraWrap:        { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  extraLabel:       { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
  extraInput:       { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: colors.textPrimary },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

// ─── Chat Modal ───────────────────────────────────────────────────────────────

function ChatModal({
  visible, conversation, myUserId, onClose,
}: {
  visible: boolean;
  conversation: Conversation | null;
  myUserId: string | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const otherName = conversation
    ? (conversation.participant1Id === myUserId
        ? conversation.participant2Name
        : conversation.participant1Name) ?? 'User'
    : '';

  useEffect(() => {
    if (!visible || !conversation) return;
    getMessages(conversation.id).then(msgs => {
      setMessages(msgs);
      markConversationRead(conversation.id);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    });
    const unsub = subscribeToConversation(conversation.id, myUserId ?? '', msg => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return unsub;
  }, [visible, conversation?.id]);

  async function handleSend() {
    if (!text.trim() || !conversation) return;
    setSending(true);
    const { message } = await sendMessage(conversation.id, text.trim());
    setSending(false);
    if (message) {
      setMessages(prev => [...prev, message]);
      setText('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.bgSecondary }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[chat.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={onClose} style={chat.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={chat.avatar}>
            <Text style={chat.avatarText}>{otherName[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <Text style={chat.otherName}>{otherName}</Text>
          {conversation?.convType === 'trainer_client' && (
            <View style={chat.typeBadge}>
              <Text style={chat.typeBadgeText}>TRAINER</Text>
            </View>
          )}
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.md, gap: 8 }}
        >
          {messages.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 36 }}>👋</Text>
              <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 8 }}>
                Say hi to {otherName}!
              </Text>
            </View>
          )}
          {messages.map(msg => (
            <View key={msg.id} style={[chat.bubble, msg.isMine ? chat.mine : chat.theirs]}>
              <Text style={[chat.bubbleText, msg.isMine && chat.mineText]}>
                {msg.content}
              </Text>
              <Text style={[chat.bubbleTime, msg.isMine && { color: 'rgba(255,255,255,0.6)' }]}>
                {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={[chat.inputRow, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={chat.input}
            placeholder="Message..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[chat.sendBtn, (!text.trim() || sending) && { opacity: 0.4 }]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={colors.bg} />
            ) : (
              <Ionicons name="send" size={16} color={colors.bg} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const chat = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
    backgroundColor: colors.bgSecondary,
  },
  backBtn:    { padding: 4 },
  avatar:     { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.orangeDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.orangeBorder },
  avatarText: { fontSize: 14, fontWeight: '900', color: colors.orange },
  otherName:  { flex: 1, ...typography.h3 },
  typeBadge:  { backgroundColor: colors.orangeDim, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.orangeBorder },
  typeBadgeText: { fontSize: 9, fontWeight: '900', color: colors.orange, letterSpacing: 1 },
  bubble:     { maxWidth: '75%', borderRadius: radius.lg, padding: 10, paddingHorizontal: 13 },
  mine:       { alignSelf: 'flex-end', backgroundColor: colors.orange, borderBottomRightRadius: 3 },
  theirs:     { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderBottomLeftRadius: 3 },
  bubbleText: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  mineText:   { color: colors.bg },
  bubbleTime: { fontSize: 9, color: colors.textMuted, marginTop: 3, textAlign: 'right' },
  inputRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: spacing.md, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.cardBorder, backgroundColor: colors.bgSecondary },
  input:      { flex: 1, backgroundColor: colors.card, borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: colors.textPrimary },
  sendBtn:    { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
});

// ─── Messages Inbox Modal ─────────────────────────────────────────────────────

function InboxModal({
  visible, myUserId, onClose,
}: {
  visible: boolean;
  myUserId: string | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openConvo, setOpenConvo] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getMyConversations().then(c => { setConvos(c); setLoading(false); });
  }, [visible]);

  const otherName = (c: Conversation) =>
    c.participant1Id === myUserId ? (c.participant2Name ?? 'User') : (c.participant1Name ?? 'User');

  return (
    <>
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: colors.bgSecondary }}>
          <View style={[{ paddingTop: insets.top + 10, paddingHorizontal: spacing.md, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.cardBorder, flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={{ flex: 1, ...typography.h1 }}>Messages</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={colors.orange} />
            </View>
          ) : convos.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 64, gap: 10 }}>
              <Text style={{ fontSize: 48 }}>💬</Text>
              <Text style={{ ...typography.h3 }}>No messages yet</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.xl }}>
                Add friends or connect with a trainer to start messaging.
              </Text>
            </View>
          ) : (
            <ScrollView>
              {convos.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.cardBorder }}
                  onPress={() => setOpenConvo(c)}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.convType === 'trainer_client' ? colors.orangeDim : colors.card, borderWidth: 1.5, borderColor: c.convType === 'trainer_client' ? colors.orangeBorder : colors.cardBorder, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: c.convType === 'trainer_client' ? colors.orange : colors.textSecondary }}>
                      {otherName(c)[0]?.toUpperCase() ?? '?'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>{otherName(c)}</Text>
                      {c.convType === 'trainer_client' && (
                        <View style={{ backgroundColor: colors.orangeDim, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                          <Text style={{ fontSize: 8, fontWeight: '900', color: colors.orange, letterSpacing: 1 }}>TRAINER</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                      {c.lastMessage ?? 'No messages yet'}
                    </Text>
                  </View>
                  {c.unreadCount > 0 && (
                    <View style={{ backgroundColor: colors.orange, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, minWidth: 20, alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, fontWeight: '900', color: colors.bg }}>{c.unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      <ChatModal
        visible={openConvo !== null}
        conversation={openConvo}
        myUserId={myUserId}
        onClose={() => setOpenConvo(null)}
      />
    </>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();

  const [tab,          setTab]          = useState<'feed' | 'events' | 'discover'>('feed');
  const [posts,        setPosts]        = useState<CommunityPost[]>([]);
  const [events,       setEvents]       = useState<CommunityEvent[]>([]);
  const [eventFilter,  setEventFilter]  = useState<EventType | 'all'>('all');
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [showPost,     setShowPost]     = useState(false);
  const [myUserId,     setMyUserId]     = useState<string | null>(null);
  const [myName,       setMyName]       = useState<string>('');
  const [pendingReqs,  setPendingReqs]  = useState<Friendship[]>([]);
  const [showInbox,    setShowInbox]    = useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [friends,      setFriends]      = useState<Friendship[]>([]);

  async function loadFeed() {
    const session = await getSession();
    const uid = session?.id ?? null;
    setMyUserId(uid);

    const [feedPosts, upcomingEvents, pending, unread] = await Promise.all([
      getFriendsFeed(30),
      getUpcomingEvents(20),
      uid ? getPendingFriendRequests() : Promise.resolve([]),
      getTotalUnread(),
    ]);

    if (uid) {
      const fl = await getFriends(uid);
      setFriends(fl);
    }

    setPosts(feedPosts);
    setEvents(upcomingEvents);
    setPendingReqs(pending);
    setUnreadCount(unread);
    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    setLoading(true);
    loadFeed();
  }, []));

  async function onRefresh() {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  }

  async function handleAcceptFriend(req: Friendship) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await acceptFriendRequest(req.id);
    setPendingReqs(prev => prev.filter(r => r.id !== req.id));
    // Reload feed now we have a new friend
    loadFeed();
  }

  async function handleDeclineFriend(req: Friendship) {
    await declineFriendRequest(req.id);
    setPendingReqs(prev => prev.filter(r => r.id !== req.id));
  }

  async function handleLike(post: CommunityPost) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (post.isLikedByMe) {
      await unlikePost(post.id);
      setPosts(prev => prev.map(p => p.id === post.id
        ? { ...p, isLikedByMe: false, likeCount: Math.max(0, p.likeCount - 1) }
        : p));
    } else {
      await likePost(post.id);
      setPosts(prev => prev.map(p => p.id === post.id
        ? { ...p, isLikedByMe: true, likeCount: p.likeCount + 1 }
        : p));
    }
  }

  async function handleDelete(postId: string) {
    await deletePost(postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
  }

  async function handleRsvp(event: CommunityEvent) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (event.isRsvpByMe) {
      await unrsvpFromEvent(event.id);
      setEvents(prev => prev.map(e => e.id === event.id
        ? { ...e, isRsvpByMe: false, rsvpCount: Math.max(0, e.rsvpCount - 1) }
        : e));
    } else {
      await rsvpToEvent(event.id);
      setEvents(prev => prev.map(e => e.id === event.id
        ? { ...e, isRsvpByMe: true, rsvpCount: e.rsvpCount + 1 }
        : e));
    }
  }

  const filteredEvents = eventFilter === 'all'
    ? events
    : events.filter(e => e.eventType === eventFilter);

  return (
    <View style={[s.root, { backgroundColor: colors.bg }]}>
      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Community</Text>
          <Text style={s.headerSub}>Fort Worth · Funkytown Fit</Text>
        </View>

        {/* Messages icon with unread badge */}
        <TouchableOpacity
          style={s.msgBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowInbox(true); }}
        >
          <Ionicons name="chatbubbles-outline" size={22} color={colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={s.unreadBadge}>
              <Text style={s.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={s.newPostBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowPost(true); }}
        >
          <Ionicons name="add" size={20} color={colors.bg} />
          <Text style={s.newPostBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* ── Pending friend requests banner ── */}
      {pendingReqs.length > 0 && (
        <View style={s.pendingBanner}>
          <Ionicons name="person-add-outline" size={14} color={colors.orange} />
          <Text style={s.pendingBannerText}>
            {pendingReqs.length} friend {pendingReqs.length === 1 ? 'request' : 'requests'}
          </Text>
          <TouchableOpacity
            onPress={() => setTab('discover')}
            style={s.pendingBannerBtn}
          >
            <Text style={s.pendingBannerBtnText}>Review</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Tab bar ── */}
      <View style={s.tabBar}>
        {([
          { key: 'feed',     label: 'Feed',    icon: 'home-outline'         as IoniconName },
          { key: 'events',   label: 'Events',  icon: 'calendar-outline'     as IoniconName },
          { key: 'discover', label: 'Discover',icon: 'search-outline'        as IoniconName },
        ] as const).map(t => (
          <TouchableOpacity
            key={t.key}
            style={[s.tabItem, tab === t.key && s.tabItemActive]}
            onPress={() => { Haptics.selectionAsync(); setTab(t.key); }}
          >
            <Ionicons name={t.icon} size={16} color={tab === t.key ? colors.orange : colors.textMuted} />
            <Text style={[s.tabLabel, tab === t.key && s.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator color={colors.orange} size="large" />
        </View>
      ) : (
        <>
          {/* FEED TAB */}
          {tab === 'feed' && (
            <ScrollView
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />}
              contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: insets.bottom + spacing.xl + 20 }}
            >
              {posts.length === 0 ? (
                <View style={s.emptyState}>
                  <Text style={{ fontSize: 48 }}>{friends.length === 0 ? '🤝' : '🌆'}</Text>
                  <Text style={s.emptyTitle}>
                    {friends.length === 0 ? 'Add friends to see their posts' : 'Nothing yet from friends'}
                  </Text>
                  <Text style={s.emptySub}>
                    {friends.length === 0
                      ? 'Your feed shows posts from friends. Head to Discover to connect with people you know.'
                      : 'Your friends haven\'t posted yet. Be the first to share something!'}
                  </Text>
                  <TouchableOpacity style={s.emptyBtn} onPress={() => friends.length === 0 ? setTab('discover') : setShowPost(true)}>
                    <Ionicons name={friends.length === 0 ? 'person-add' : 'add-circle'} size={16} color={colors.bg} />
                    <Text style={s.emptyBtnText}>{friends.length === 0 ? 'Find Friends' : 'Create post'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    myUserId={myUserId}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </ScrollView>
          )}

          {/* EVENTS TAB */}
          {tab === 'events' && (
            <View style={{ flex: 1 }}>
              {/* Event type filter */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.eventFilterRow}>
                {([ 'all', 'fitness', 'food', 'fun', 'community' ] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[s.eventFilterPill, eventFilter === type && s.eventFilterActive]}
                    onPress={() => setEventFilter(type)}
                  >
                    {type !== 'all' && (
                      <Ionicons
                        name={eventTypeIcon(type as EventType)}
                        size={11}
                        color={eventFilter === type ? colors.bg : eventTypeColor(type as EventType)}
                      />
                    )}
                    <Text style={[s.eventFilterLabel, eventFilter === type && s.eventFilterLabelActive]}>
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />}
                contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: insets.bottom + spacing.xl + 20 }}
              >
                {filteredEvents.length === 0 ? (
                  <View style={s.emptyState}>
                    <Text style={{ fontSize: 48 }}>📅</Text>
                    <Text style={s.emptyTitle}>No events yet</Text>
                    <Text style={s.emptySub}>
                      Events here are posted by community members — not auto-generated. Know of something happening in Fort Worth? Post it!
                    </Text>
                    <TouchableOpacity style={s.emptyBtn} onPress={() => Alert.alert('Coming Soon', 'Event creation is coming in the next update!')}>
                      <Ionicons name="add-circle" size={16} color={colors.bg} />
                      <Text style={s.emptyBtnText}>Add an Event</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
                  ))
                )}
              </ScrollView>
            </View>
          )}

          {/* DISCOVER TAB */}
          {tab === 'discover' && (
            <ScrollView
              contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: insets.bottom + spacing.xl + 20 }}
            >
              <View style={s.discoverHeader}>
                <Text style={s.discoverTitle}>Discover Fort Worth</Text>
                <Text style={s.discoverSub}>Connect with friends, Fit Partners, gyms, and local spots.</Text>
              </View>

              {/* Pending Friend Requests section */}
              {pendingReqs.length > 0 && (
                <View style={s.discoverSection}>
                  <Text style={s.discoverSectionTitle}>👋  FRIEND REQUESTS</Text>
                  {pendingReqs.map(req => (
                    <View key={req.id} style={s.discoverItem}>
                      <View style={[s.discoverAvatar, { backgroundColor: colors.orangeDim, borderColor: colors.orangeBorder }]}>
                        <Text style={{ fontSize: 16, fontWeight: '900', color: colors.orange }}>
                          {(req.requesterName ?? 'U')[0].toUpperCase()}
                        </Text>
                      </View>
                      <Text style={s.discoverItemName}>{req.requesterName ?? 'Someone'}</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <TouchableOpacity
                          style={[s.followBtn, { backgroundColor: colors.orange, borderColor: colors.orange }]}
                          onPress={() => handleAcceptFriend(req)}
                        >
                          <Text style={[s.followBtnText, { color: colors.bg }]}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={s.followBtn}
                          onPress={() => handleDeclineFriend(req)}
                        >
                          <Text style={s.followBtnText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Friends section */}
              {friends.length > 0 && (
                <View style={s.discoverSection}>
                  <Text style={s.discoverSectionTitle}>🤝  YOUR FRIENDS  ({friends.length})</Text>
                  {friends.map(f => {
                    const friendName = f.requesterId === myUserId ? f.addresseeName : f.requesterName;
                    const friendId   = f.requesterId === myUserId ? f.addresseeId  : f.requesterId;
                    return (
                      <View key={f.id} style={s.discoverItem}>
                        <View style={[s.discoverAvatar, { backgroundColor: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.3)' }]}>
                          <Text style={{ fontSize: 16, fontWeight: '900', color: '#22C55E' }}>
                            {(friendName ?? 'F')[0].toUpperCase()}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.discoverItemName}>{friendName ?? 'Friend'}</Text>
                        </View>
                        <TouchableOpacity
                          style={[s.followBtn, { borderColor: '#22C55E' }]}
                          onPress={async () => {
                            const { error } = await sendFitPartnerRequest(friendId ?? '');
                            if (!error) {
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                              Alert.alert('Fit Partner Request Sent!', 'When they accept, you\'ll be able to share workouts, nutrition, and more.');
                            } else {
                              Alert.alert('', error);
                            }
                          }}
                        >
                          <Text style={[s.followBtnText, { color: '#22C55E' }]}>💪 Fit Partner</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Social guide */}
              <View style={s.socialGuideCard}>
                <Text style={s.socialGuideTitle}>How connections work</Text>
                <View style={s.socialGuideRow}>
                  <Text style={s.socialGuideEmoji}>🤝</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.socialGuideLabel}>Friends</Text>
                    <Text style={s.socialGuideSub}>See each other's posts and profiles in the Feed.</Text>
                  </View>
                </View>
                <View style={s.socialGuideRow}>
                  <Text style={s.socialGuideEmoji}>💪</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.socialGuideLabel}>Fit Partners</Text>
                    <Text style={s.socialGuideSub}>Share workout logs, nutrition data, and more — you choose what to share.</Text>
                  </View>
                </View>
                <View style={s.socialGuideRow}>
                  <Text style={s.socialGuideEmoji}>💬</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.socialGuideLabel}>Messaging</Text>
                    <Text style={s.socialGuideSub}>Message friends and trainers directly. Tap the chat icon in the header.</Text>
                  </View>
                </View>
              </View>

              {/* Categories to follow */}
              {[
                { title: 'Fitness',    emoji: '💪', items: ['Anytime Fitness FW', 'CrossFit Cow Town', 'Orange Theory FW', 'Gold\'s Gym FW'] },
                { title: 'Foodie Spots', emoji: '🍔', items: ['Joe T. Garcia\'s', 'Fixe Southern House', 'Ellerbe Fine Foods', 'Salsa Limon', 'Cattlemen\'s Steakhouse'] },
                { title: 'Places',    emoji: '📍', items: ['Stockyards', 'Trinity Trails', 'Panther Island', 'Clearfork', 'Near Southside'] },
              ].map(section => (
                <View key={section.title} style={s.discoverSection}>
                  <Text style={s.discoverSectionTitle}>{section.emoji}  {section.title.toUpperCase()}</Text>
                  {section.items.map(item => (
                    <View key={item} style={s.discoverItem}>
                      <View style={s.discoverAvatar}>
                        <Text style={{ fontSize: 16 }}>{section.emoji}</Text>
                      </View>
                      <Text style={s.discoverItemName}>{item}</Text>
                      <TouchableOpacity style={s.followBtn} onPress={() => Haptics.selectionAsync()}>
                        <Text style={s.followBtnText}>+ Follow</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}

      {/* ── New Post Modal ── */}
      <NewPostModal
        visible={showPost}
        onClose={() => setShowPost(false)}
        onPost={newPost => {
          setPosts(prev => [newPost, ...prev]);
          setShowPost(false);
        }}
      />

      {/* ── Inbox / Messages Modal ── */}
      <InboxModal
        visible={showInbox}
        myUserId={myUserId}
        onClose={() => { setShowInbox(false); loadFeed(); }}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: { ...typography.h1 },
  headerSub:   { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  newPostBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.orange,
    borderRadius: radius.full,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  newPostBtnText: { fontSize: 14, fontWeight: '800', color: colors.bg },

  msgBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 4,
  },
  unreadBadge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8, minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  unreadBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff' },

  pendingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: spacing.lg, paddingVertical: 10,
    backgroundColor: colors.orangeDim,
    borderBottomWidth: 1, borderBottomColor: colors.orangeBorder,
  },
  pendingBannerText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.orange },
  pendingBannerBtn: { borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.orange },
  pendingBannerBtnText: { fontSize: 12, fontWeight: '800', color: colors.bg },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
  },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 11 },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: colors.orange },
  tabLabel:      { fontSize: 12, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.3 },
  tabLabelActive: { color: colors.orange },

  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  emptyState: {
    alignItems: 'center', paddingVertical: 64, paddingHorizontal: spacing.xl, gap: 10,
  },
  emptyTitle: { ...typography.h3 },
  emptySub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8,
    backgroundColor: colors.orange, borderRadius: radius.full,
    paddingHorizontal: 20, paddingVertical: 11,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '800', color: colors.bg },

  // Events filter
  eventFilterRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 6, backgroundColor: colors.bgSecondary },
  eventFilterPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.full, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  eventFilterActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  eventFilterLabel:  { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  eventFilterLabelActive: { color: colors.bg },

  // Discover
  discoverHeader: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  discoverTitle:  { ...typography.h2, marginBottom: 4 },
  discoverSub:    { fontSize: 13, color: colors.textSecondary },
  discoverSection: { marginBottom: spacing.md },
  discoverSectionTitle: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.4,
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm, textTransform: 'uppercase',
  },
  discoverItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  discoverAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  discoverItemName: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  followBtn: {
    borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: colors.orange,
  },
  followBtnText: { fontSize: 11, fontWeight: '800', color: colors.orange },

  // Social guide card in Discover
  socialGuideCard: {
    marginHorizontal: spacing.md, marginBottom: spacing.lg,
    backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  socialGuideTitle: { fontSize: 12, fontWeight: '900', color: colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  socialGuideRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  socialGuideEmoji: { fontSize: 20, width: 28 },
  socialGuideLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  socialGuideSub:   { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
});
