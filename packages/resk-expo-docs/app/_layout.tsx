import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { ITheme, ReskExpoProvider, useDrawer, useI18n } from "@resk/expo";
import { Slot } from 'expo-router';
import "../src/i18n/translations";
import "../src/resources";
import { ResourcesManager } from '@resk/core';
import { Users } from '../src/resources';
// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const users = ResourcesManager.getResource<Users>("users");
    useI18n();
    return (<ReskExpoProvider
        drawerNavigationViewProps={{}}
        theme={{ dark: true } as ITheme}>
        <Slot />
    </ReskExpoProvider>);
}
