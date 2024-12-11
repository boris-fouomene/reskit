import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { Icon, ITheme, ReskExpoProvider, useDrawer } from "@resk/expo";
import { Slot } from 'expo-router';
import Drawer from '@resk/expo/build/components/Drawer/Drawer';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    return (<ReskExpoProvider theme={{ dark: true } as ITheme}>
        <Drawer
            renderNavigationView={({ context: drawer }) => {
                return <Icon.Button iconName="menu" size={30} onPress={(e) => {
                    console.log("will toggle drawer ?", drawer?.isPermanent());
                    drawer.isPinned() ? drawer.unpin() : drawer.pin();
                }} />
            }}
            position="right"
            drawerWidth={300}
        >
            <Slot />
        </Drawer>
    </ReskExpoProvider>);
}
