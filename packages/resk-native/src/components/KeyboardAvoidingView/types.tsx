import { KeyboardAvoidingViewProps } from "react-native";

/**
 * Type definition for the properties of the custom `KeyboardAvoidingView`.
 * This type extends the standard `KeyboardAvoidingViewProps` from React Native, 
 * adding an additional property to control the loading state of the component.
 * 
 * @typedef IKeyboardAvoidingView
 * 
 * @extends KeyboardAvoidingViewProps
 * 
 * @property {boolean} [isPreloader] - An optional flag that indicates whether the 
 * component is in a preloading state. When set to true, it can modify the 
 * layout behavior, such as hiding certain styles or elements to accommodate 
 * loading indicators.
 * 
 * @example
 * Here’s an example of how to use the `IKeyboardAvoidingView` type in a 
 * functional component:
 * 
 * ```tsx
 * import React from 'react';
 * import { KeyboardAvoidingView, TextInput, Button, ActivityIndicator } from 'react-native';
 * import { IKeyboardAvoidingView } from './types';
 * 
 * const MyForm: React.FC<IKeyboardAvoidingView> = ({ isPreloader }) => (
 *   <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
 *     {isPreloader ? (
 *       <ActivityIndicator size="large" color="#0000ff" />
 *     ) : (
 *       <>
 *         <TextInput placeholder="Enter your name" />
 *         <Button title="Submit" onPress={() => {}} />
 *       </>
 *     )}
 *   </KeyboardAvoidingView>
 * );
 * ```
 * 
 * @note 
 * This type is particularly useful for ensuring that components 
 * using `KeyboardAvoidingView` can easily manage loading states 
 * while still benefiting from the keyboard management features 
 * provided by React Native.
 */
export type IKeyboardAvoidingView = KeyboardAvoidingViewProps & {
    isPreloader?: boolean;
}