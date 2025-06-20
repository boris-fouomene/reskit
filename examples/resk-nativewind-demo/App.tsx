
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text } from 'react-native';
import { ScreenContent } from 'components/ScreenContent';
import './global.css';
export default function App() {
  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <ScreenContent title="Home" />
    </SafeAreaView>
  );
}


