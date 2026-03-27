import 'dotenv/config';

export default {
  expo: {
    name: 'Funkytown Fit',
    slug: 'funkytownfit',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#0D0A06',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.funkytownfit.app',
      infoPlist: {
        NSCameraUsageDescription:
          'Used for scanning food barcodes and AI food photo logging',
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#0D0A06',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: 'com.funkytownfit.app',
      permissions: ['CAMERA', 'VIBRATE'],
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission:
            'Allow Funkytown Fit to access your camera for food barcode scanning and AI food photo logging.',
        },
      ],
      'expo-font',
      'expo-web-browser',
    ],
    scheme: 'funkytownfit',
    extra: {
      supabaseUrl:        process.env.SUPABASE_URL,
      supabaseAnonKey:    process.env.SUPABASE_ANON_KEY,
      googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
      spotifyClientId:    process.env.SPOTIFY_CLIENT_ID,
      anthropicApiKey:    process.env.ANTHROPIC_API_KEY,
    },
  },
};
