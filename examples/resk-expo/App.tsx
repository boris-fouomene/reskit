import "@expo/metro-runtime";
import  "@resk/native/build/session";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ReskNativeProvider,Button, TouchableRipple, Label,TextInput,Dropdown } from '@resk/native';


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
        <Dropdown<{ label: string; value: string }>
          label="Select an option"
          items={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
          ]}
          getItemLabel={({item}) => item.label}
          getItemValue={({item}) => item.value}
        />
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
