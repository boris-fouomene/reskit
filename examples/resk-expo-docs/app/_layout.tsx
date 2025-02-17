import * as SplashScreen from 'expo-splash-screen';
import { ITheme, Label, ReskExpoProvider, Theme, useDrawer, useI18n, View } from "@resk/native";
import { Slot } from 'expo-router';
import "../src/i18n/translations";
import "../src/resources";
import { ResourcesManager } from '@resk/core';
import { Users } from '../src/resources';
import { useEffect } from 'react';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const users = ResourcesManager.getResource<Users>("users");
    useI18n();
    useEffect(() => {
        SplashScreen.hideAsync();
        console.log("splaqsh hidden");
    }, [])
    return (<ReskExpoProvider
        drawerNavigationViewProps={{}}
        theme={{ dark: true, colors: { onPrimary: "black" } } as ITheme}
        auth={{
            Login: function ({ signIn }) {
                return <View style={[Theme.styles.h100, Theme.styles.w100]} testID="my-container">
                    <View>
                        <Label colorScheme="error" fontSize={20} textBold>This is the login component.</Label>
                    </View>
                </View>
            }
        }}
    >
        <Slot />
    </ReskExpoProvider>);
}
