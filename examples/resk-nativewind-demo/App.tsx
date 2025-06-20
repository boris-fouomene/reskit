
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView} from 'react-native-safe-area-context';
import { ScreenContent } from 'components/ScreenContent';
import { PortalProvider } from '@resk/nativewind';
import './global.css';
export default function App() {
  return (
    <PortalProvider>
      <SafeAreaView>
        <StatusBar style="auto" />
        <ScreenContent title="Home" />
      </SafeAreaView>
    </PortalProvider>
  );
}


