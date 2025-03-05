import { NativeEventSubscription } from "react-native";
import { BackPressEventName } from "react-native";

/**
 * A mock implementation of the `BackHandler` component used in Android environments 
 * to allow interoperability. This custom `BackHandler` provides methods to manage 
 * the hardware back button behavior, including adding and removing event listeners 
 * and exiting the application.
 * 
 * @module BackHandler
 * 
 * @example
 * Here’s an example of how to use the custom `BackHandler`:
 * 
 * ```tsx
 * import React, { useEffect } from 'react';
 * import { View, Text } from 'react-native';
 * import BackHandler from './BackHandler'; // Adjust the import path as necessary
 * 
 * const MyComponent = () => {
 *   useEffect(() => {
 *     const handleBackPress = () => {
 *       console.log("Back button pressed!");
 *       // Here you could add logic to handle back navigation
 *       return true; // Prevent default back action
 *     };
 * 
 *     const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);
 * 
 *     return () => backHandler.remove(); // Clean up the event listener
 *   }, []);
 * 
 *   return (
 *     <View>
 *       <Text>Press the back button to see the log!</Text>
 *     </View>
 *   );
 * };
 * 
 * export default MyComponent;
 * ```
 * 
 * @methods
 * 
 * - **exitApp**: A function that simulates exiting the application. This is a no-op in this mock implementation.
 * 
 * - **addEventListener(event?: string, callback?: Function)**: Adds an event listener for the specified event. 
 *   Returns an object with a `remove` method to unregister the listener.
 * 
 * - **removeEventListener**: A function that simulates removing an event listener. This is a no-op in this mock implementation.
 * 
 * @note 
 * This implementation is intended for web environment where 
 * the actual `BackHandler` functionality is not required or available. 
 * In a production environment, you should use the actual `BackHandler` 
 * from React Native.
 */
function emptyFunction() { }

class BackHandler {
  static exitApp= emptyFunction;
  static addEventListener(eventName: BackPressEventName,handler: () => boolean | null | undefined): NativeEventSubscription{
    return {
      remove: emptyFunction,
    };
  }
  static removeEventListener(eventName: BackPressEventName,handler: () => boolean | null | undefined) {
  
  };
};

export default BackHandler;