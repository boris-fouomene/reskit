import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { Icon, ITheme, ReskExpoProvider, useDrawer } from "@resk/expo";
import { Slot } from 'expo-router';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    return (<ReskExpoProvider theme={{ dark: true } as ITheme}>
        <Slot />
    </ReskExpoProvider>);
}
