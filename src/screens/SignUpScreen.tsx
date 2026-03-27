import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radius, typography } from '@/theme';
import { signUp, signInWithGoogle } from '@/lib/auth';

interface Props {
  onSignUpSuccess: (userId: string) => void;
  onGoToLogin: () => void;
}

export default function SignUpScreen({ onSignUpSuccess, onGoToLogin }: Props) {
  const insets = useSafeAreaInsets();
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  const passwordStrong = password.length >= 8;
  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && passwordStrong;

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { user, error: authError } = await signInWithGoogle();
    if (authError || !user) {
      setError(authError ?? 'Google sign-in failed.');
      setGoogleLoading(false);
      return;
    }
    setGoogleLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSignUpSuccess(user.id);
  }

  async function handleSignUp() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { user, error: authError } = await signUp(email, password, name.trim());
    if (authError || !user) {
      setError(authError ?? 'Sign-up failed. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // New user always needs onboarding
    onSignUpSuccess(user.id);
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
        {/* Header */}
        <TouchableOpacity style={styles.backBtn} onPress={onGoToLogin}>
          <Ionicons name="arrow-back" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>Create account</Text>
          <Text style={styles.headerSub}>Join Funkytown Fit and start your journey</Text>
        </View>

        <View style={styles.card}>
          {/* Google */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignUp}
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
            <Text style={styles.dividerText}>or sign up with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>YOUR NAME</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={t => { setName(t); setError(null); }}
                placeholder="First name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <View style={styles.inputWrap}>
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
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={t => { setPassword(t); setError(null); }}
                placeholder="At least 8 characters"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPass}
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {/* Password strength indicator */}
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={[styles.strengthBar, { backgroundColor: passwordStrong ? colors.green : colors.red }]} />
                <Text style={[styles.strengthText, { color: passwordStrong ? colors.green : colors.red }]}>
                  {passwordStrong ? 'Strong enough' : 'Too short (min 8 chars)'}
                </Text>
              </View>
            )}
          </View>

          {/* Error */}
          {error && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={15} color={colors.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Create account button */}
          <TouchableOpacity
            style={[styles.submitBtn, (!canSubmit || loading) && { opacity: 0.5 }]}
            onPress={handleSignUp}
            disabled={!canSubmit || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitBtnText}>Create Account</Text>
            }
          </TouchableOpacity>

          <Text style={styles.legalText}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
            Funkytown Fit is for general wellness only — not medical advice.
            Always consult a doctor before starting a new fitness or diet program.
          </Text>
        </View>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onGoToLogin}>
            <Text style={styles.loginLink}>Sign in</Text>
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

  backBtn:      { marginBottom: spacing.lg },
  headerBlock:  { marginBottom: spacing.xl },
  headerTitle:  { ...typography.h1, color: colors.textPrimary },
  headerSub:    { fontSize: 14, color: colors.textSecondary, marginTop: 4 },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.07, shadowRadius: 16,
  },

  fieldGroup:  { marginBottom: spacing.md },
  fieldLabel:  { fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: spacing.sm },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md, height: 50,
  },
  inputIcon:  { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary },
  eyeBtn:     { padding: 4 },

  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  strengthBar: { width: 24, height: 3, borderRadius: 2 },
  strengthText:{ fontSize: 11, fontWeight: '600' },

  errorRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  errorText: { fontSize: 13, color: colors.red, flex: 1 },

  submitBtn: {
    backgroundColor: colors.orange,
    borderRadius: radius.lg, paddingVertical: 16,
    alignItems: 'center', marginTop: spacing.sm,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 14,
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.4 },

  legalText: {
    fontSize: 11, color: colors.textMuted, textAlign: 'center',
    marginTop: spacing.md, lineHeight: 16,
  },

  loginRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl, alignItems: 'center' },
  loginText: { fontSize: 14, color: colors.textSecondary },
  loginLink: { fontSize: 14, fontWeight: '800', color: colors.orange },

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
  dividerText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
});
