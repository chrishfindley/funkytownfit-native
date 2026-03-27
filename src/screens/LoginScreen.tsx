import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radius, typography } from '@/theme';
import { signIn, signInWithGoogle, resetPassword } from '@/lib/auth';
import { pullFromCloud } from '@/lib/sync';
import { isOnboarded } from '@/lib/storage';

interface Props {
  onLoginSuccess: (userId: string, needsOnboarding: boolean) => void;
  onGoToSignUp: () => void;
}

export default function LoginScreen({ onLoginSuccess, onGoToSignUp }: Props) {
  const insets = useSafeAreaInsets();
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [resetSent,  setResetSent]  = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { user, error: authError } = await signIn(email, password);
    if (authError || !user) {
      setError(authError ?? 'Login failed.');
      setLoading(false);
      return;
    }

    // Pull cloud data into local storage (best-effort)
    await pullFromCloud(user.id);

    const onboarded = await isOnboarded();
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onLoginSuccess(user.id, !onboarded);
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { user, error: authError } = await signInWithGoogle();
    if (authError || !user) {
      setError(authError ?? 'Google sign-in failed.');
      setGoogleLoading(false);
      return;
    }
    await pullFromCloud(user.id);
    const onboarded = await isOnboarded();
    setGoogleLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onLoginSuccess(user.id, !onboarded);
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email above first.');
      return;
    }
    setLoading(true);
    const { error: e } = await resetPassword(email);
    setLoading(false);
    if (e) {
      setError(e);
    } else {
      setResetSent(true);
      setError(null);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / wordmark */}
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>⚡</Text>
          </View>
          <Text style={styles.appName}>FUNKYTOWN FIT</Text>
          <Text style={styles.tagline}>Your personal gym. Everywhere.</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSub}>Sign in to continue your journey</Text>

          {/* Google */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={colors.textPrimary} />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <View style={[styles.inputWrap, error && styles.inputError]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={t => { setEmail(t); setError(null); }}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={[styles.inputWrap, error && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={t => { setPassword(t); setError(null); }}
                placeholder="Your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error / Reset sent */}
          {error && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={15} color={colors.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          {resetSent && (
            <View style={styles.successRow}>
              <Ionicons name="checkmark-circle-outline" size={15} color={colors.green} />
              <Text style={styles.successText}>Reset link sent — check your email.</Text>
            </View>
          )}

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginBtn, (loading || !email || !password) && { opacity: 0.55 }]}
            onPress={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginBtnText}>Sign In</Text>
            }
          </TouchableOpacity>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword} disabled={loading}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>New here? </Text>
          <TouchableOpacity onPress={onGoToSignUp}>
            <Text style={styles.signupLink}>Create an account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: insets.bottom + spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, flexGrow: 1 },

  logoBlock: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.orangeDim,
    borderWidth: 2, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 20,
  },
  logoEmoji: { fontSize: 36 },
  appName:   { fontSize: 22, fontWeight: '900', color: colors.orange, letterSpacing: 3 },
  tagline:   { fontSize: 13, color: colors.textSecondary, marginTop: 4 },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.07, shadowRadius: 16,
  },
  cardTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: 4 },
  cardSub:   { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xl },

  fieldGroup:  { marginBottom: spacing.md },
  fieldLabel:  { fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: spacing.sm },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md, height: 50,
  },
  inputError: { borderColor: colors.red },
  inputIcon:  { marginRight: 10 },
  input: {
    flex: 1, fontSize: 15, color: colors.textPrimary,
  },
  eyeBtn: { padding: 4 },

  errorRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  errorText:  { fontSize: 13, color: colors.red, flex: 1 },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  successText:{ fontSize: 13, color: colors.green, flex: 1 },

  loginBtn: {
    backgroundColor: colors.orange,
    borderRadius: radius.lg, paddingVertical: 16,
    alignItems: 'center', marginTop: spacing.sm,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 14,
  },
  loginBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.4 },

  forgotBtn:  { alignItems: 'center', marginTop: spacing.md },
  forgotText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder,
    paddingVertical: 13, marginBottom: spacing.md,
  },
  googleIcon: { fontSize: 16, fontWeight: '900', color: '#4285F4' },
  googleText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
  dividerText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },

  signupRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, alignItems: 'center' },
  signupText: { fontSize: 14, color: colors.textSecondary },
  signupLink: { fontSize: 14, fontWeight: '800', color: colors.orange },
});
