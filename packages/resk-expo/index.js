import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import "@expo/metro-runtime";

init();
// Must be exported or Fast Refresh won't update the context
const App = Logger.wrap(function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} >
  </ExpoRoot>
});

registerRootComponent(App);