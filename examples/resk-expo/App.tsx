import "@expo/metro-runtime";
import  "@resk/native/build/session";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ReskNativeProvider,Button, TouchableRipple, Label,TextInput } from '@resk/native';


export default function App() {
  return (
    <ReskNativeProvider>
      <View style={styles.container}>
        <TextInput type="date" label="Date" />
        <Text>Open up App.tsx to start working on your app!</Text>
        <Button
          children="Click me"
        />
        <TouchableRipple  style={{backgroundColor:"blue"}}>
          <View>
            <Label> A label, Ripple Me</Label>
          </View>
        </TouchableRipple>
        <Pressable android_ripple={{ color: 'blue' }}>
          <Text>Press Me, For Rippling</Text>
        </Pressable>
      </View>
    </ReskNativeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
