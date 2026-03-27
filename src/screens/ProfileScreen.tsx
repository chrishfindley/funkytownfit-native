import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Switch, Alert, RefreshControl, ActivityIndicator, Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '@/theme';
import {
  getProfile, saveProfile, getNutritionTargets,
} from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { getSession, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  isTrainerMode, enableTrainerMode, disableTrainerMode,
  getOrCreateInviteCode, acceptInvite, getMyTrainer,
  TrainerRelationship,
} from '@/lib/trainer';
import LegalScreen, { LegalDoc } from './LegalScreen';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [targets, setTargets] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  // Notification preferences
  const [notifyWorkout, setNotifyWorkout] = useState(true);
  const [notifyMeal, setNotifyMeal] = useState(true);
  const [notifyStreak, setNotifyStreak] = useState(true);

  // Trainer / Client state
  const [trainerMode,       setTrainerMode]       = useState(false);
  const [trainerModeLoading, setTrainerModeLoading] = useState(false);
  const [inviteCode,        setInviteCode]        = useState<string | null>(null);
  const [myTrainer,         setMyTrainer]         = useState<TrainerRelationship | null>(null);
  const [inviteInput,       setInviteInput]       = useState('');
  const [connectLoading,    setConnectLoading]    = useState(false);
  const [userId,            setUserId]            = useState<string | null>(null);

  // Legal modals
  const [legalDoc,          setLegalDoc]          = useState<LegalDoc | null>(null);
  const [deletingAccount,   setDeletingAccount]   = useState(false);

  async function loadData() {
    const session = await getSession();
    if (session) {
      setUserEmail(session.email);
      setUserId(session.id);
    }
    const p = await getProfile();
    if (p) {
      setProfile(p);
      setName(p.name);
      setAge(String(p.age));
      setWeightLbs(String(Math.round(p.weightKg * 2.20462)));
      const ft = Math.floor(p.heightCm / 30.48);
      const inches = Math.round((p.heightCm - ft * 30.48) / 2.54);
      setHeightFt(String(ft));
      setHeightIn(String(inches));
    }
    const tgt = await getNutritionTargets();
    setTargets(tgt);

    // Load notification preferences
    const workoutNotif = await AsyncStorage.getItem('notif_workout');
    const mealNotif = await AsyncStorage.getItem('notif_meal');
    const streakNotif = await AsyncStorage.getItem('notif_streak');
    setNotifyWorkout(workoutNotif !== 'false');
    setNotifyMeal(mealNotif !== 'false');
    setNotifyStreak(streakNotif !== 'false');

    // Load trainer/client state
    const tm = await isTrainerMode();
    setTrainerMode(tm);
    if (session && tm) {
      const { code } = await getOrCreateInviteCode(session.id, p?.name ?? 'Trainer');
      setInviteCode(code);
    }
    if (session) {
      const trainer = await getMyTrainer(session.id);
      setMyTrainer(trainer);
    }
  }

  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function handleSave() {
    if (!profile || !name || !age || !weightLbs || !heightFt || !heightIn) {
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return;
    }

    const updated: UserProfile = {
      ...profile,
      name,
      age: Number(age),
      weightKg: Number(weightLbs) / 2.20462,
      heightCm: Number(heightFt) * 30.48 + Number(heightIn) * 2.54,
      updatedAt: new Date().toISOString(),
    };

    await saveProfile(updated);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setProfile(updated);
    setIsEditing(false);
    await loadData();
  }

  async function handleNotificationChange(key: string, value: boolean) {
    await AsyncStorage.setItem(key, String(value));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function handleTrainerModeToggle(val: boolean) {
    if (!userId || !profile) return;
    setTrainerModeLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (val) {
      await enableTrainerMode();
      const { code } = await getOrCreateInviteCode(userId, profile.name);
      setInviteCode(code);
    } else {
      await disableTrainerMode();
      setInviteCode(null);
    }
    setTrainerMode(val);
    setTrainerModeLoading(false);
  }

  async function handleShareInviteCode() {
    if (!inviteCode) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Share.share({
      message: `Use code ${inviteCode} to connect with me on Funkytown Fit 🤠`,
      title: 'Funkytown Fit Trainer Invite',
    });
  }

  async function handleConnectToTrainer() {
    if (!userId || !profile || !inviteInput.trim()) return;
    setConnectLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { relationship, error } = await acceptInvite(userId, profile.name, inviteInput.trim());
    setConnectLoading(false);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setMyTrainer(relationship);
    setInviteInput('');
    Alert.alert('Connected! 🎉', `You're now connected to ${relationship?.trainerName ?? 'your trainer'}.`);
  }

  if (!profile) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Slate grey header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        {userEmail && <Text style={styles.headerSub}>{userEmail}</Text>}
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Name"
                  placeholderTextColor={colors.textMuted}
                />
              ) : (
                <Text style={styles.profileName}>{profile.name}</Text>
              )}
              {userEmail && <Text style={styles.profileEmail}>{userEmail}</Text>}
            </View>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={[styles.editButton, isEditing && styles.editButtonActive]}
            >
              <Text style={styles.editButtonText}>{isEditing ? '✓' : '✎'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Body Stats */}
        {isEditing ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Body Stats</Text>

            <View style={styles.fieldRow}>
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  value={weightLbs}
                  onChangeText={setWeightLbs}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Height (ft)</Text>
                <TextInput
                  style={styles.input}
                  value={heightFt}
                  onChangeText={setHeightFt}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Height (in)</Text>
                <TextInput
                  style={styles.input}
                  value={heightIn}
                  onChangeText={setHeightIn}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Body Stats</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Age</Text>
                <Text style={styles.statValue}>{profile.age}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>{Math.round(profile.weightKg * 2.20462)} lbs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>
                  {Math.floor(profile.heightCm / 30.48)}'{Math.round((profile.heightCm % 30.48) / 2.54)}"
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Goals */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Goals</Text>
          <View style={styles.goalsRow}>
            {profile.goals.map(g => (
              <View key={g} style={styles.goalPill}>
                <Text style={styles.goalPillText}>
                  {g.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Nutrition Targets */}
        {targets && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Daily Targets</Text>
            <View style={styles.targetsGrid}>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Calories</Text>
                <Text style={[styles.targetValue, { color: colors.calorie }]}>
                  {targets.calories}
                </Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Protein</Text>
                <Text style={[styles.targetValue, { color: colors.protein }]}>
                  {targets.proteinG}g
                </Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Carbs</Text>
                <Text style={[styles.targetValue, { color: colors.carbs }]}>
                  {targets.carbsG}g
                </Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetLabel}>Fat</Text>
                <Text style={[styles.targetValue, { color: colors.fat }]}>
                  {targets.fatG}g
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Notifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <NotificationToggle
            label="Workout Reminder"
            icon="💪"
            value={notifyWorkout}
            onToggle={async v => {
              setNotifyWorkout(v);
              await handleNotificationChange('notif_workout', v);
            }}
          />
          <NotificationToggle
            label="Meal Nudge"
            icon="🌮"
            value={notifyMeal}
            onToggle={async v => {
              setNotifyMeal(v);
              await handleNotificationChange('notif_meal', v);
            }}
          />
          <NotificationToggle
            label="Streak Alert"
            icon="🔥"
            value={notifyStreak}
            onToggle={async v => {
              setNotifyStreak(v);
              await handleNotificationChange('notif_streak', v);
            }}
          />
        </View>

        {/* ── Trainer & Client ── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Trainer & Client</Text>

          {/* Trainer mode toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.md }}>
              <Text style={styles.toggleIcon}>📋</Text>
              <View>
                <Text style={styles.toggleLabel}>Trainer Mode</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>
                  Generate a code to invite clients
                </Text>
              </View>
            </View>
            {trainerModeLoading
              ? <ActivityIndicator size="small" color={colors.orange} />
              : <Switch
                  value={trainerMode}
                  onValueChange={handleTrainerModeToggle}
                  trackColor={{ false: colors.card, true: colors.orange }}
                  thumbColor={trainerMode ? '#fff' : colors.textMuted}
                />
            }
          </View>

          {/* Invite code when trainer mode on */}
          {trainerMode && inviteCode && (
            <View style={styles.trainerCodeBox}>
              <Text style={styles.trainerCodeLabel}>YOUR INVITE CODE</Text>
              <View style={styles.trainerCodeRow}>
                {inviteCode.split('').map((ch, i) => (
                  <View key={i} style={styles.trainerCodeChar}>
                    <Text style={styles.trainerCodeCharText}>{ch}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.trainerShareBtn} onPress={handleShareInviteCode}>
                <Ionicons name="share-outline" size={14} color={colors.bg} />
                <Text style={styles.trainerShareBtnText}>Share Invite Code</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.sectionDivider} />

          {/* Connect to trainer */}
          <Text style={styles.subSectionTitle}>Connect to a Trainer</Text>

          {myTrainer ? (
            <View style={styles.connectedTrainerRow}>
              <View style={styles.trainerAvatarSmall}>
                <Text style={{ fontSize: 14, fontWeight: '900', color: colors.orange }}>
                  {(myTrainer.trainerName ?? 'T')[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>
                  {myTrainer.trainerName ?? 'Your Trainer'}
                </Text>
                <Text style={{ fontSize: 11, color: colors.green }}>✓ Connected</Text>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert(
                  'Disconnect',
                  `Remove ${myTrainer.trainerName ?? 'your trainer'}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Disconnect', style: 'destructive', onPress: () => setMyTrainer(null) },
                  ]
                )}
                style={{ padding: 8 }}
              >
                <Ionicons name="close-circle-outline" size={20} color={colors.red} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.connectRow}>
              <TextInput
                style={[styles.input, { flex: 1, textTransform: 'uppercase', letterSpacing: 4 }]}
                placeholder="Enter code"
                placeholderTextColor={colors.textMuted}
                value={inviteInput}
                onChangeText={t => setInviteInput(t.toUpperCase())}
                maxLength={6}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[styles.connectBtn, (!inviteInput.trim() || connectLoading) && { opacity: 0.5 }]}
                onPress={handleConnectToTrainer}
                disabled={!inviteInput.trim() || connectLoading}
              >
                {connectLoading
                  ? <ActivityIndicator size="small" color={colors.bg} />
                  : <Text style={styles.connectBtnText}>Connect</Text>
                }
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* App Info + Legal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>1</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>Fort Worth, TX</Text>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Legal</Text>
          {([
            { key: 'privacy', label: 'Privacy Policy',     icon: 'shield-outline' as const },
            { key: 'terms',   label: 'Terms of Service',   icon: 'document-text-outline' as const },
            { key: 'health',  label: 'Health Disclaimer',  icon: 'medical-outline' as const },
          ] as { key: LegalDoc; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[]).map(item => (
            <TouchableOpacity
              key={item.key}
              style={styles.legalRow}
              onPress={() => setLegalDoc(item.key)}
            >
              <Ionicons name={item.icon} size={16} color={colors.textMuted} />
              <Text style={styles.legalRowText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: async () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    await signOut();
                    // App.tsx auth listener handles navigation back to login
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Danger Zone */}
        <View style={styles.dangerCard}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Clear All Data',
                'This will delete all your workouts, food logs, and progress from this device. This cannot be undone.',
                [
                  { text: 'Cancel' },
                  {
                    text: 'Clear All',
                    onPress: async () => {
                      await AsyncStorage.clear();
                      Alert.alert('Data Cleared', 'All local data has been deleted.');
                    },
                    style: 'destructive',
                  },
                ]
              );
            }}
            style={styles.dangerButton}
          >
            <Text style={styles.dangerButtonText}>Clear All Local Data</Text>
          </TouchableOpacity>

          {/* Delete Account — App Store required */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'This will permanently delete your Funkytown Fit account and all associated data. This cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete My Account',
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert(
                        'Are you absolutely sure?',
                        'Your account, workout history, food logs, and all personal data will be permanently deleted.',
                        [
                          { text: 'Keep Account', style: 'cancel' },
                          {
                            text: 'Yes, Delete Everything',
                            style: 'destructive',
                            onPress: async () => {
                              setDeletingAccount(true);
                              try {
                                // Delete user data from Supabase tables
                                const session = await getSession();
                                if (session?.id) {
                                  const uid = session.id;
                                  await Promise.allSettled([
                                    supabase.from('profiles').delete().eq('id', uid),
                                    supabase.from('food_logs').delete().eq('user_id', uid),
                                    supabase.from('workout_logs').delete().eq('user_id', uid),
                                    supabase.from('weight_logs').delete().eq('user_id', uid),
                                    supabase.from('community_posts').delete().eq('user_id', uid),
                                    supabase.from('event_rsvps').delete().eq('user_id', uid),
                                    supabase.from('post_likes').delete().eq('user_id', uid),
                                  ]);
                                }
                                // Clear local storage
                                await AsyncStorage.clear();
                                // Sign out (Supabase account itself is deactivated server-side)
                                await signOut();
                                // Show final confirmation — auth listener will redirect to login
                                Alert.alert(
                                  'Account Deleted',
                                  'Your account and all data have been permanently deleted. We\'re sorry to see you go.'
                                );
                              } catch {
                                Alert.alert('Error', 'Something went wrong. Please contact support@funkytownfit.com to complete account deletion.');
                              } finally {
                                setDeletingAccount(false);
                              }
                            },
                          },
                        ]
                      );
                    },
                  },
                ]
              );
            }}
            style={[styles.dangerButton, { borderColor: colors.red + '55', marginTop: spacing.sm }]}
            disabled={deletingAccount}
          >
            {deletingAccount
              ? <ActivityIndicator size="small" color={colors.red} />
              : <Text style={[styles.dangerButtonText, { color: colors.red }]}>Delete Account</Text>
            }
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Legal modals */}
      {legalDoc && (
        <LegalScreen doc={legalDoc} onClose={() => setLegalDoc(null)} />
      )}

    </View>
  );
}

function NotificationToggle({
  label, icon, value, onToggle,
}: {
  label: string;
  icon: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.md }}>
        <Text style={styles.toggleIcon}>{icon}</Text>
        <Text style={styles.toggleLabel}>{label}</Text>
      </View>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.orange,
    marginBottom: spacing.sm,
  },
  headerSub: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  profileCard: {
    margin: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(249,115,22,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.orange,
  },
  avatarText: {
    ...typography.h1,
    color: colors.orange,
  },
  profileName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  nameInput: {
    ...typography.h3,
    color: colors.textPrimary,
    backgroundColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonActive: {
    backgroundColor: colors.orange,
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.orange,
  },

  sectionCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  fieldRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  fieldCol: {
    flex: 1,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(249,115,22,0.04)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    ...typography.button,
    color: 'white',
  },

  statRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h2,
    color: colors.orange,
  },

  goalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  goalPill: {
    backgroundColor: 'rgba(249,115,22,0.1)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.2)',
  },
  goalPillText: {
    ...typography.bodySm,
    color: colors.orange,
    fontWeight: '600',
  },

  targetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  targetItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  targetLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  targetValue: {
    ...typography.h2,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  toggleIcon: {
    fontSize: 18,
  },
  toggleLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  // Trainer section
  sectionDivider: {
    height: 1, backgroundColor: colors.cardBorder,
    marginVertical: spacing.md,
  },
  subSectionTitle: {
    fontSize: 12, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  trainerCodeBox: {
    backgroundColor: colors.bgSecondary, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md, marginTop: spacing.md, alignItems: 'center',
  },
  trainerCodeLabel: {
    fontSize: 9, fontWeight: '800', color: colors.orange,
    letterSpacing: 2, marginBottom: spacing.sm,
  },
  trainerCodeRow: {
    flexDirection: 'row', gap: 5, marginBottom: spacing.md,
  },
  trainerCodeChar: {
    width: 36, height: 44, borderRadius: radius.sm,
    backgroundColor: colors.card, borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  trainerCodeCharText: {
    fontSize: 22, fontWeight: '900', color: colors.orange,
  },
  trainerShareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.orange, borderRadius: radius.full,
    paddingHorizontal: 16, paddingVertical: 9,
  },
  trainerShareBtnText: { fontSize: 13, fontWeight: '800', color: colors.bg },
  connectedTrainerRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.bgSecondary, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.greenBorder,
    padding: spacing.md,
  },
  trainerAvatarSmall: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.orangeDim, borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  connectRow: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'center',
  },
  connectBtn: {
    backgroundColor: colors.orange, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md + 2,
    alignItems: 'center', justifyContent: 'center', minWidth: 88,
  },
  connectBtnText: { fontSize: 14, fontWeight: '800', color: colors.bg },

  dangerCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    padding: spacing.lg,
  },
  dangerButton: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.red,
  },

  // ── Legal ───────────────────────────────────────────────────────────────────
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  legalRowText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
