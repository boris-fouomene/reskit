import { Div } from "@html/Div";
import { IKeyboardAvoidingViewProps } from "./types";
import { defaultStr } from "@resk/core";

export * from "./types";

/**
 * A custom `KeyboardAvoidingView` component that adjusts its position 
 * when the keyboard is displayed, improving the user experience 
 * for forms and input fields. This component is particularly useful 
 * for mobile applications where keyboard appearance can obscure inputs.
 * 
 * @component
 * 
 * @param {IKeyboardAvoidingViewProps} props - The properties for the component.
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
 * 
 * @returns {ReactElement} A `KeyboardAvoidingView` component that adjusts 
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
export function KeyboardAvoidingView({ children, behavior, contentContainerStyle, keyboardVerticalOffset, enabled, testID, ...props }: IKeyboardAvoidingViewProps) {
  testID = defaultStr(testID, 'resk-keyboard-avoiding-view');
  return <Div  {...props} children={children} testID={testID} />;
}
KeyboardAvoidingView.displayName = "KeyboardAvoidingView";