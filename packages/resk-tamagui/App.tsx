// App.tsx
import { ReskTamaguiProvider } from './src';
import { Text } from '@tamagui/core';
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return (
        <ReskTamaguiProvider>
            <Text fontSize={20} color="$text">Welcome 11  Tamagui</Text>
        </ReskTamaguiProvider>
    );
}


if (typeof document !== "undefined" && document) {
    let root = document.getElementById("root");
    if (!root) {
        root = document.createElement("div");
        document.body.appendChild(root);
    }
    console.log("document hroor is root ", root);
    root.id = "root";
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

export default App;
