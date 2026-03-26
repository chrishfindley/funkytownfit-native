import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Required for Supabase v2 in React Native — keeps the session alive
// when the app moves between foreground and background.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
