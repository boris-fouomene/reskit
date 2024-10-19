import "@expo/metro-runtime";
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} >
  </ExpoRoot>
}

registerRootComponent(App);

export * from "./src";