import "../src/session";
import * as SplashScreen from 'expo-splash-screen';
import { ReskNativeProvider, useI18n } from "@resk/native";
import { Slot } from 'expo-router';
import "../src/i18n/translations";
import "../src/resources";
import { useEffect } from 'react';

export default function RootLayout() {
    SplashScreen.preventAutoHideAsync();
    useI18n();
    useEffect(() => {
        SplashScreen.hideAsync();
    }, [])
    return (<ReskNativeProvider
        auth={{}}
    >
        <Slot />
    </ReskNativeProvider>);
}
