import { supabase } from './supabase';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  id: string;
  email: string;
}

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { name } },
  });
  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: 'Sign-up failed. Please try again.' };
  return { user: { id: data.user.id, email: data.user.email! }, error: null };
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: 'Sign-in failed. Please try again.' };
  return { user: { id: data.user.id, email: data.user.email! }, error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return null;
  return {
    id: data.session.user.id,
    email: data.session.user.email!,
  };
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
  return { error: error?.message ?? null };
}

export async function signInWithGoogle(): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    // Use the scheme-based URI for production (EAS builds).
    // In Expo Go, custom-scheme deep links are not interceptable — Google OAuth
    // requires an EAS development build to work end-to-end.
    const redirectUri = makeRedirectUri({ scheme: 'funkytownfit' });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUri, skipBrowserRedirect: true },
    });

    if (error || !data.url) {
      return { user: null, error: error?.message ?? 'Google sign-in failed.' };
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type !== 'success') {
      // In Expo Go the browser will open but the redirect can't be intercepted —
      // the session IS created on Supabase's side; poll for it.
      const polled = await pollForSession(6);
      if (polled) return { user: polled, error: null };
      return { user: null, error: 'Sign-in was cancelled or could not be completed in Expo Go.' };
    }

    // Extract tokens from the redirect URL — could be in the fragment (#) or
    // query string (?) depending on Supabase config.
    const raw = result.url;
    const separator = raw.includes('#') ? '#' : '?';
    const fragment = raw.split(separator)[1] ?? '';
    const params = new URLSearchParams(fragment);
    const accessToken  = params.get('access_token');
    const refreshToken = params.get('refresh_token') ?? '';

    if (!accessToken) {
      // Fragment not captured — try polling (Expo Go fallback)
      const polled = await pollForSession(4);
      if (polled) return { user: polled, error: null };
      return { user: null, error: 'No token received. Try signing in with email instead.' };
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError || !sessionData.user) {
      return { user: null, error: sessionError?.message ?? 'Failed to set session.' };
    }

    return {
      user: { id: sessionData.user.id, email: sessionData.user.email! },
      error: null,
    };
  } catch (e: any) {
    return { user: null, error: e?.message ?? 'Google sign-in failed.' };
  }
}

/**
 * Poll supabase.auth.getSession() up to `attempts` times, 1.5s apart.
 * Handles the Expo Go case where the OAuth redirect is intercepted by the OS
 * but the session is already stored in Supabase.
 */
async function pollForSession(attempts: number): Promise<AuthUser | null> {
  for (let i = 0; i < attempts; i++) {
    await new Promise(res => setTimeout(res, 1500));
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      return { id: data.session.user.id, email: data.session.user.email! };
    }
  }
  return null;
}
