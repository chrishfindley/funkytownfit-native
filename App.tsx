import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';

import TabNavigator     from '@/navigation/TabNavigator';
import OnboardingScreen from '@/screens/OnboardingScreen';
import LoginScreen      from '@/screens/LoginScreen';
import SignUpScreen     from '@/screens/SignUpScreen';
import SplashScreen     from '@/screens/SplashScreen';

import { isOnboarded, setOnboarded as markOnboarded } from '@/lib/storage';
import { getSession }   from '@/lib/auth';
import { pushToCloud }  from '@/lib/sync';
import { supabase }     from '@/lib/supabase';
import { colors }       from '@/theme';

type Screen = 'splash' | 'loading' | 'login' | 'signup' | 'onboarding' | 'app';

const FTFTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background:   colors.bg,
    card:         '#1A1208',
    text:         colors.textPrimary,
    border:       colors.cardBorder,
    primary:      colors.orange,
    notification: colors.orange,
  },
};

export default function App() {
  // Start on splash; bootstrap runs in parallel so there's no extra wait
  const [screen, setScreen] = useState<Screen>('splash');
  const [userId, setUserId] = useState<string | null>(null);

  // Holds the auth result so we can transition the moment splash finishes
  const bootstrapResult = useRef<Screen | null>(null);

  useEffect(() => {
    async function bootstrap() {
      const user = await getSession();
      let next: Screen;
      if (!user) {
        next = 'login';
      } else {
        setUserId(user.id);
        const onboarded = await isOnboarded();
        next = onboarded ? 'app' : 'onboarding';
      }
      // If still on splash, store the result — handleSplashComplete will pick it up.
      // If splash already finished (and we're on 'loading'), transition now.
      if (bootstrapResult.current === null) {
        bootstrapResult.current = next;
      }
      setScreen(prev => prev === 'loading' ? next : prev);
    }
    bootstrap();

    // Listen for sign-out from anywhere in the app (e.g. ProfileScreen)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setScreen('login');
        setUserId(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  function handleSplashComplete() {
    // Bootstrap already finished → jump straight to the right screen
    if (bootstrapResult.current !== null) {
      setScreen(bootstrapResult.current);
    } else {
      // Bootstrap still running → show spinner until it resolves
      setScreen('loading');
    }
  }

  function handleLoginSuccess(id: string, needsOnboarding: boolean) {
    setUserId(id);
    setScreen(needsOnboarding ? 'onboarding' : 'app');
  }

  function handleSignUpSuccess(id: string) {
    setUserId(id);
    setScreen('onboarding');
  }

  async function handleOnboardingComplete() {
    await markOnboarded();
    if (userId) pushToCloud(userId); // fire and forget
    setScreen('app');
  }

  // Splash renders outside the NavigationContainer so it covers the full screen cleanly
  if (screen === 'splash') {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.bg} />
        <SplashScreen onComplete={handleSplashComplete} />
      </SafeAreaProvider>
    );
  }

  // Shown only on the rare occasion bootstrap takes longer than 2.7 s
  if (screen === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.orange} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={FTFTheme}>
        <StatusBar style="light" backgroundColor={colors.bg} />

        {screen === 'login'      && <LoginScreen      onLoginSuccess={handleLoginSuccess}  onGoToSignUp={() => setScreen('signup')}  />}
        {screen === 'signup'     && <SignUpScreen     onSignUpSuccess={handleSignUpSuccess} onGoToLogin={() => setScreen('login')}   />}
        {screen === 'onboarding' && <OnboardingScreen onComplete={handleOnboardingComplete} />}
        {screen === 'app'        && <TabNavigator />}

      </NavigationContainer>
    </SafeAreaProvider>
  );
}
