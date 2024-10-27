import View from "@components/View";
import React from "react";
import { isNonNullString } from "@resk/core";
import { IKeyboardAvoidingView } from "./types";
import { View as RNView } from "react-native";

export * from "./types";

/**
 * A custom `KeyboardAvoidingView` component that adjusts its position 
 * when the keyboard is displayed, improving the user experience 
 * for forms and input fields. This component is particularly useful 
 * for mobile applications where keyboard appearance can obscure inputs.
 * 
 * @component
 * 
 * @param {IKeyboardAvoidingView} props - The properties for the component.
 * 
 * @param {React.ReactNode} props.children - The content to be rendered inside 
 * the `KeyboardAvoidingView`. This can include any valid React nodes, such as 
 * forms, buttons, or text inputs.
 * 
 * @param {boolean} [props.isPreloader=false] - A flag indicating whether the 
 * component is in a preloading state. If true, the styles for the wrapper 
 * are not applied, allowing for a different layout or behavior when loading.
 * 
 * @param {KeyboardAvoidingViewProps} [props.rest] - Additional props to be 
 * passed to the underlying `KeyboardAvoidingView`, allowing for further 
 * customization of its behavior and styling.
 * 
 * @param {React.Ref<KeyboardAvoidingView>} ref - A ref that can be used to 
 * access the underlying `KeyboardAvoidingView` component.
 * 
 * @returns {JSX.Element} A `KeyboardAvoidingView` component that adjusts 
 * its position based on the keyboard's visibility.
 * 
 * @example
 * Basic usage of the `KeyboardAvoidingView`:
 * ```tsx
 * <KeyboardAvoidingView>
 *   <TextInput placeholder="Enter your name" />
 *   <Button title="Submit" onPress={() => {}} />
 * </KeyboardAvoidingView>
 * ```
 * 
 * @example
 * Using the `isPreloader` prop to control layout during loading:
 * ```tsx
 * const MyForm = ({ loading }) => (
 *   <KeyboardAvoidingView isPreloader={loading}>
 *     {loading ? <ActivityIndicator /> : (
 *       <>
 *         <TextInput placeholder="Enter your email" />
 *         <Button title="Submit" onPress={() => {}} />
 *       </>
 *     )}
 *   </KeyboardAvoidingView>
 * );
 * ```
 * 
 * @note 
 * The `KeyboardAvoidingView` uses platform-specific behavior 
 * for adjusting its layout. On iOS, it uses 'padding' behavior, while 
 * on Android, it uses 'height'. The `keyboardVerticalOffset` is set 
 * to 80 for iOS to account for any navigation bars or headers.
 */
const KeyboardAvoidingViewComponent = React.forwardRef(({ children, style, testID, ...props }: IKeyboardAvoidingView, ref: React.Ref<RNView>) => {
  testID = testID || 'RNKeyboardAvoidingView';
  return <View  {...props} ref={ref} style={[styles.main, style]} children={children} testID={isNonNullString(testID) ? `${testID}_KeyboardAvoidingView` : "RN_KeyboardAvoidingView"} />
});

const styles = {
  main: {
    flex: 1,
  }
}
KeyboardAvoidingViewComponent.displayName = "KeyboardAvoidingViewComponent";

export { KeyboardAvoidingViewComponent as KeyboardAvoidingView }