/*
======================= START OF LICENSE NOTICE =======================
  Copyright (C) 2024 BORIS. All Rights Reserved

  NO WARRANTY. THE PRODUCT IS PROVIDED BY DEVELOPER "AS IS" AND ANY
  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL DEVELOPER BE LIABLE FOR
  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
  OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE PRODUCT, EVEN
  IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
======================== END OF LICENSE NOTICE ========================
  Primary Author: BORIS
*/

// App.tsx
import { ReskTamaguiProvider } from './src';
import { Text, View } from '@tamagui/core';
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return (
        <ReskTamaguiProvider>
            <View
                onPress={(e) => {
                    console.log(e, " is view pressed");
                }}>
                <Text fontSize={20} color="$text">Welcome 11  Tamagui</Text>
            </View>
        </ReskTamaguiProvider>
    );
}


if (typeof document !== "undefined" && document) {
    let root = document.getElementById("root");
    if (!root) {
        root = document.createElement("div");
        document.body.appendChild(root);
    }
    root.id = "root";
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

export default App;
