import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { Icon, ITheme, ReskExpoProvider, useDrawer } from "@resk/expo";
import { Slot } from 'expo-router';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    return (<ReskExpoProvider
        drawerNavigationViewProps={{
            items: [
                {
                    label: 'Home', icon: 'home', onPress: (event) => {
                        console.log('Home pressed', event);
                    }
                },
                { label: 'Settings', icon: 'camera', onPress: () => console.log('Settings pressed') },
                { label: 'Profile', icon: 'account-circle', onPress: () => console.log('Profile pressed') },
            ]
        }}
        theme={{ dark: true } as ITheme
        }>
        <Slot />
    </ReskExpoProvider>);
}
