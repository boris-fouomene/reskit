import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { ITheme, ReskExpoProvider, useDrawer } from "@resk/expo";
import { Slot } from 'expo-router';
import "../src/i18n/translations";
import "../src/resources";
import { ResourcesManager } from '@resk/core';
import { Users } from '../src/resources';
// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const users = ResourcesManager.getResource<Users>("users");
    return (<ReskExpoProvider
        drawerNavigationViewProps={{
            items: [
                {
                    label: 'Home', icon: 'home', onPress: (event) => {
                        console.log('Home pressed', event);
                    }
                },
                {
                    label: users?.getLabel(), icon: 'material-search',
                    onPress: () => console.log('Search pressed'),
                    items: [
                        { label: 'Search 1', icon: 'material-sell', onPress: () => console.log('Search 1 pressed') },
                        { label: 'Search 2', icon: 'car-pickup', onPress: () => console.log('Search 2 pressed') },
                        { label: 'Search 3', icon: 'car-wash', onPress: () => console.log('Search 3 pressed') },
                    ],
                },
                { label: 'Settings', icon: 'camera', onPress: () => console.log('Settings pressed') },
                { label: 'Profile', icon: 'account-circle', onPress: () => console.log('Profile pressed') },
                { label: 'Logout', icon: 'logout', onPress: () => console.log('Logout pressed') },
            ]
        }}
        theme={{ dark: true } as ITheme}>
        <Slot />
    </ReskExpoProvider>);
}
