import 'react-native-reanimated';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { IViewProps, ReskExpoProvider, Theme, useTheme, View } from "@resk/expo";
import { Slot } from 'expo-router';
import React from 'react';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    return (<ReskExpoProvider>
        <Children><Slot /></Children>
    </ReskExpoProvider>);
}

const Children = ({ children }: IViewProps) => {
    const theme = useTheme();
    return <View style={[Theme.styles.flex1, { backgroundColor: theme.colors.background }]}>
        {children}
    </View>
}
