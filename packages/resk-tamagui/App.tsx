// App.tsx
import { ReskTamaguiProvider } from './src';
import { TamaguiProvider, Text } from '@tamagui/core';

function App() {
    return (
        <ReskTamaguiProvider>
            <Text fontSize={20} color="$text">Welcome 11  Tamagui</Text>
        </ReskTamaguiProvider>
    );
}

export default App;
