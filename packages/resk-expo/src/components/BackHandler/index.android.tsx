import { BackHandler } from "react-native";

/**
 * The `BackHandler` module from React Native provides an interface for handling 
 * the hardware back button on Android devices. It allows developers to listen 
 * for back button events and to override the default behavior when the back button 
 * is pressed.
 * 
 * @module BackHandler
 * 
 * @example
 * Here’s an example of how to use the `BackHandler` to override the default 
 * back button behavior in a component:
 * 
 * ```tsx
 * import React, { useEffect } from 'react';
 * import { View, Text, BackHandler, Alert } from 'react-native';
 * 
 * const MyComponent = () => {
 *   useEffect(() => {
 *     const backAction = () => {
 *       Alert.alert("Hold on!", "Are you sure you want to go back?", [
 *         {
 *           text: "Cancel",
 *           onPress: () => null,
 *           style: "cancel",
 *         },
 *         { text: "YES", onPress: () => BackHandler.exitApp() },
 *       ]);
 *       return true; // Prevent default back action
 *     };
 * 
 *     const backHandler = BackHandler.addEventListener(
 *       "hardwareBackPress",
 *       backAction
 *     );
 * 
 *     return () => backHandler.remove(); // Clean up the event listener
 *   }, []);
 * 
 *   return (
 *     <View>
 *       <Text>Press the back button to see the alert!</Text>
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 * 
 * @note 
 * When using `BackHandler`, it is important to clean up event listeners 
 * to prevent memory leaks. Always return a cleanup function from the 
 * `useEffect` hook to remove the listener when the component unmounts.
 * 
 * This module is primarily used in Android applications, as iOS does not 
 * have a hardware back button.
 */
export default BackHandler;