import "@expo/metro-runtime";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import React from 'react';
import StoryBook from "./.storybook";

function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
let AppEntryPoint = App;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
console.log(Constants?.expoConfig?.extra?.storybookEnabled, " is consss ", Constants?.expoConfig)
export default Constants?.expoConfig?.extra?.storybookEnabled ? StoryBook : AppEntryPoint;