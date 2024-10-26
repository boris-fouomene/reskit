import React from 'react';
import { ExpoRoot } from 'expo-router';

function App() {
  const ctx = (require as any).context('./app');
  return <ExpoRoot context={ctx} >
  </ExpoRoot>
}

export default App;