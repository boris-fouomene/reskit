import "@expo/metro-runtime";
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ReskExpoProvider } from "@src/context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ReskExpoProvider>
      <Stack>
        <Stack.Screen name="+not-found" />
      </Stack>
    </ReskExpoProvider>
  );
}
