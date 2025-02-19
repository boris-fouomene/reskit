import { IInputFormatterResult } from "@resk/core";
import { ViewStyle, TextStyle, ImageStyle, StyleProp, NativeSyntheticEvent, TextInputChangeEventData, GestureResponderEvent, PressableProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from "react-native";
/**
   @interface
 * Represents a reference to a React component or DOM element.
 * 
 * This type can be used to hold references to either mutable objects or legacy 
 * refs in React applications. It supports generic types to define the 
 * structure of the referenced object.
 * 
 * ### Usage Example:
 * 
 * ```tsx
 * import React, { useRef } from 'react';
 * 
 * const MyComponent: React.FC = () => {
 *   const myRef: IReactRef<HTMLDivElement> = useRef(null);
 * 
 *   const handleClick = () => {
 *     if (myRef.current) {
 *       myRef.current.focus(); // Example of using the ref to access the DOM element
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleClick}>Focus the div</button>
 *       <div ref={myRef}>This div can be focused!</div>
 *     </div>
 *   );
 * };
 * ```
 */
export type IReactRef<T extends unknown = unknown> = React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null;

/**
  @interface
 * Defines a type that can represent either a Functional Component or a Class Component in React.
 * 
 * This type is useful for situations where you want to accept both types of 
 * React components as props or within other components. The type is generic, 
 * allowing you to specify the props and state types for class components.
 * 
 * ### Usage Example:
 * 
 * ```tsx
 * import React from 'react';
 * 
 * interface MyProps {
 *   message: string;
 * }
 * 
 * // Functional Component
 * const MyFunctionalComponent: React.FC<MyProps> = ({ message }) => (
 *   <div>{message}</div>
 * );
 * 
 * // Class Component
 * class MyClassComponent extends React.Component<MyProps> {
 *   render() {
 *     return <div>{this.props.message}</div>;
 *   }
 * }
 * 
 * // A function that accepts either component type
 * const renderComponent = (Component: IReactComponent<MyProps>, props: MyProps) => {
 *   return <Component {...props} />;
 * };
 * 
 * const App: React.FC = () => (
 *   <div>
 *     {renderComponent(MyFunctionalComponent, { message: "Hello from Functional Component!" })}
 *     {renderComponent(MyClassComponent, { message: "Hello from Class Component!" })}
 *   </div>
 * );
 * ```
 */
export type IReactComponent<IProps = {}, IState = {}> = React.ComponentType<IProps> | React.ComponentClass<IProps, IState>;


/**
 * @interface IFlatStyle
 * @description
 * Represents a flat style definition in React Native.
 *
 * This type allows for the definition of styles directly as plain objects,
 * which is commonly used in React Native applications. The styles can be 
 * defined using the `StyleSheet.create` method or directly as an object.
 *
 * The `IFlatStyle` type can encompass various style types, including:
 * 
 * - `ViewStyle`: Styles applicable to View components.
 * - `TextStyle`: Styles applicable to Text components.
 * - `ImageStyle`: Styles applicable to Image components.
 *
 * Example usage:
 * 
 * ```typescript
 * const myStyle: IFlatStyle = {
 *   paddingHorizontal: 10,
 *   fontSize: 14,
 *   color: 'blue',
 * };
 * ```
 *
 * In the example above, `myStyle` is an object that defines padding, 
 * font size, and color, which can be applied to a Text or View component.
 *
 * This type is particularly useful for creating reusable styles 
 * that can be easily applied across multiple components in a React 
 * Native application, promoting consistency and maintainability.
 */
export type IFlatStyle = ViewStyle | TextStyle | ImageStyle;


/**
 * @interface IStyle
 * @description
 * Represents a flexible style type that can be used for various React Native components.
 * This type union includes styles for View, Text, and Image components, as well as
 * undefined and null for optional styling.
 * 
 * @typedef {StyleProp<ViewStyle> | StyleProp<TextStyle> | StyleProp<ImageStyle> | undefined | null} IStyle
 * 
 * @example
 * // Using IStyle for a custom component
 * interface MyComponentProps {
 *   style?: IStyle;
 * }
 * 
 * const MyComponent: React.FC<MyComponentProps> = ({ style }) => {
 *   return <View style={style}>
 *     <Text>Styled component</Text>
 *   </View>
 * };
 * 
 * @example
 * // Using IStyle with different React Native components
 * const styles = {
 *   container: {
 *     flex: 1,
 *     backgroundColor: 'white',
 *   } as IStyle,
 *   text: {
 *     fontSize: 16,
 *     color: 'black',
 *   } as IStyle,
 *   image: {
 *     width: 100,
 *     height: 100,
 *     resizeMode: 'cover',
 *   } as IStyle,
 * };
 * 
 * const App = () => (
 *   <View style={styles.container}>
 *     <Text style={styles.text}>Hello, World!</Text>
 *     <Image source={{uri: 'https://example.com/image.jpg'}} style={styles.image} />
 *   </View>
 * );
 * 
 * @example
 * // Using IStyle with conditional styling
 * const ConditionalStyle: React.FC<{ isActive: boolean }> = ({ isActive }) => {
 *   const dynamicStyle: IStyle = isActive
 *     ? { backgroundColor: 'blue', color: 'white' }
 *     : { backgroundColor: 'gray', color: 'black' };
 * 
 *   return <View style={dynamicStyle}>
 *     <Text>Conditional Styling</Text>
 *   </View>
 * };
 */
export type IStyle =
  | StyleProp<ViewStyle>
  | StyleProp<TextStyle>
  | StyleProp<ImageStyle>
  | undefined
  | null;


/**
 * @interface IOnChangeOptionsBase
 * Represents the base options for an onChange event handler.
 * This type is generic, allowing for flexibility in the types of values
 * and events that can be passed to the handler.
 *
 * @extends {Partial<IInputFormatterResult>} This extends the `IInputFormatterResult` interface, providing additional properties for formatting and parsing values. This includes properties such as `formatValue`
 * @template ValueType - The type of the value being changed. Defaults to `any`.
 * @template OnChangeEventType - The type of the event that triggered the change. 
 *                        Defaults to React Native's text input event (`NativeSyntheticEvent<TextInputChangeEventData>) | null`.
 *
 * @property {OnChangeEventType} [event] - An optional event object that contains details
 *                                   about the change event. This can be useful for 
 *                                   accessing properties such as target value or 
 *                                   other event-specific data.
 *
 * @property {ValueType} [value] - The current value after the change. This 
 *                                   represents the new state of the input or field 
 *                                   that has changed.
 *
 * @property {any} [previousValue] - The value before the change occurred. This 
 *                                    can be useful for comparison or for undo 
 *                                    functionalities.
 *
 * @property {boolean} [focused] - Indicates whether the input field was focused 
 *                                 when the change occurred. This can help in 
 *                                 determining if the change was user-initiated.
 *
 * @property {string} [fieldName] - The name of the field that triggered the 
 *                                   change event. This is particularly useful in 
 *                                   forms with multiple fields to identify 
 *                                   which field's value has changed.
 *
 * @example
 * // Example usage of IOnChangeOptionsBase
 * const handleChange = (options: IOnChangeOptionsBase<string>) => {
 *   console.log(`Field: ${options.fieldName}`);
 *   console.log(`Previous Value: ${options.previousValue}`);
 *   console.log(`Current Value: ${options.value}`);
 *   console.log(`Event Type: ${options.event?.type}`);
 *   console.log(`Is Focused: ${options.focused}`);
 * };
 *
 * // Simulating a change event
 * handleChange({
 *   event: { type: 'change', target: { value: 'Hello World' } },
 *   value: 'Hello World',
 *   previousValue: 'Hello',
 *   focused: true,
 *   fieldName: 'greeting'
 * });
 * 
 *  * @example
 * // Using IOnChangeOptionsBase with custom types
 * type CustomEvent = { target: { value: string } };
 * const handleCustomChange = (options: IOnChangeOptionsBase<string, CustomEvent>) => {
 *   console.log('New value:', options.value);
 *   console.log('Event type:', options.event?.target.value);
 * };
 * @see {@link IInputFormatterResult} for more information on the `IInputFormatterResult` interface.
 * @returns {void} - This type does not return any value, as it is typically used 
 *                   as an argument for an event handler function.
 */
export interface IOnChangeOptionsBase<OnChangeEventType = NativeSyntheticEvent<TextInputChangeEventData> | null, ValueType = any> extends Partial<IInputFormatterResult> {
  event?: OnChangeEventType;
  value?: ValueType;
  previousValue?: any;
  focused?: boolean;
  fieldName?: string;
};

/**
 * @interface IOnChangeOptions
 * Represents the options for an onChange event handler with extended capabilities.
 * It represents the extended options for onChange events, typically used in TextInput components.
 * This type allows for further customization and extension of the base onChange options.

 * @template OnChangeEventType - The type of the event that triggered the change. 
 *                        Defaults to The type of the event object, defaults to React Native's text input event `NativeSyntheticEvent<TextInputChangeEventData> | null`.
 * @template ValueType - The type of the value being changed. Defaults to `any`. 
 *
 * @extends {IOnChangeOptionsBase<ValueType, OnChangeEventType>} 
 * This extends the base options
 *
 * @example
 * // Example usage of IOnChangeOptions
 * interface CustomOptions {
 *   customField: string;
 *   timestamp: number;
 * }
 *
 * const handleChange = (options: IOnChangeOptions<CustomOptions>) => {
 *   console.log(`Custom Field: ${options.customField}`);
 *   console.log(`Timestamp: ${options.timestamp}`);
 *   console.log(`Field: ${options.fieldName}`);
 *   console.log(`Previous Value: ${options.previousValue}`);
 *   console.log(`Current Value: ${options.value}`);
 *   console.log(`Event Type: ${options.event?.type}`);
 *   console.log(`Is Focused: ${options.focused}`);
 * };
 *
 * // Simulating a change event with custom options
 * handleChange({
 *   customField: 'example',
 *   timestamp: Date.now(),
 *   event: { type: 'change', target: { value: 'Hello World' } },
 *   value: 'Hello World',
 *   previousValue: 'Hello',
 *   focused: true,
 *   fieldName: 'greeting'
 * });
 *
 *  * @example
 * // Using IOnChangeOptions with custom extensions
 * interface CustomExtension {
 *   timestamp: number;
 * }
 * 
 * const handleExtendedChange = (options: IOnChangeOptions<CustomExtension, string>) => {
 *   console.log('New value:', options.value);
 *   console.log('Timestamp:', options.timestamp);
 * };
 * 
 * @example
 * // Using IOnChangeOptions in a React component
 * const TextInput: React.FC<{ onChange: (options: IOnChangeOptions) => void }> = ({ onChange }) => {
 *   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *     onChange({
 *       event: e,
 *       value: e.target.value,
 *       fieldName: 'customField',
 *       focused: true
 *     });
 *   };
 *   
 *   return <input onChange={handleInputChange} />;
 * };
 * 
 * @returns {void} - This type does not return any value, as it is typically used 
 *                   as an argument for an event handler function.
 */
export interface IOnChangeOptions<OnChangeEventType = any | null, ValueType = any> extends IOnChangeOptionsBase<OnChangeEventType, ValueType> {

}



/**
 * @interface ITouchableEventNames
 * A union type representing the available touchable event names.
 * 
 * This type includes the standard touch events that can be used in
 * touchable components, allowing developers to specify which events
 * they want to handle in their applications.
 * 
 * The following events are included:
 * - `'onPress'`: Triggered when the user taps the component.
 * - `'onLongPress'`: Triggered when the user presses and holds the component.
 * - `'onPressIn'`: Triggered when the user touches the component.
 * - `'onPressOut'`: Triggered when the user releases the touch from the component.
 * 
 * @example
 * // Example usage of ITouchableEventNames
 * const handleEvent = (event: ITouchableEventNames) => {
 *   switch (event) {
 *     case 'onPress':
 *       console.log('Component was pressed.');
 *       break;
 *     case 'onLongPress':
 *       console.log('Component was long pressed.');
 *       break;
 *     case 'onPressIn':
 *       console.log('Touch started on the component.');
 *       break;
 *     case 'onPressOut':
 *       console.log('Touch ended on the component.');
 *       break;
 *   }
 * };
 * 
 * // Simulating an event
 * handleEvent('onPress'); // Output: Component was pressed.
 */
export type ITouchableEventNames = keyof ITouchableEvents;


/**
 * @interface ITouchableEvents
 * A type representing an object that can contain optional touch event handlers.
 *
 * The `ITouchableEventObject` type is a partial record where the keys are 
 * the touchable event names defined in `ITouchableEventNames`, and the values 
 * are functions that handle the respective events. Each function receives 
 * a `GestureResponderEvent` as an argument, which contains information 
 * about the touch event.
 *
 * This type allows developers to specify only the event handlers they 
 * need for their components, making it flexible and convenient for use 
 * in touchable components.
 *
 * @typedef {Object} ITouchableEventObject
 * @property {(event: GestureResponderEvent) => void} [onPress] - Optional handler for the press event.
 * @property {(event: GestureResponderEvent) => void} [onLongPress] - Optional handler for the long press event.
 * @property {(event: GestureResponderEvent) => void} [onPressIn] - Optional handler for the press-in event.
 * @property {(event: GestureResponderEvent) => void} [onPressOut] - Optional handler for the press-out event.
 * @property {(event: GestureResponderEvent) => void} [onTouchStart] - Optional handler for the touch start event.
 * @property {(event: GestureResponderEvent) => void} [onTouchEnd] - Optional handler for the touch end event.
 * @property {(event: GestureResponderEvent) => void} [onTouchCancel] - Optional handler for the touch cancel event.
 * @property {(event: GestureResponderEvent) => void} [onTouchMove] - Optional handler for the touch move event.
 *
 * @example
 * // Example usage of ITouchableEventObject
 * const touchableHandlers: ITouchableEventObject = {
 *   onPress: (event) => { console.log('Pressed!', event); },
 *   onLongPress: (event) => { console.log('Long Pressed!', event); },
 * };
 *
 * // Simulating an event handler call
 * const simulatePress = (handler: ITouchableEventObject['onPress']) => {
 *   const mockEvent: GestureResponderEvent = { } as GestureResponderEvent;
 *   handler(mockEvent); // This would log 'Pressed!' to the console.
 * };
 *
 * simulatePress(touchableHandlers.onPress); // Output: Pressed!
 */
export type ITouchableEvents = {
  onPress?: TouchableWithoutFeedbackProps['onPress'];
  onLongPress?: TouchableWithoutFeedbackProps['onLongPress'];
  onPressIn?: TouchableWithoutFeedbackProps['onPressIn'];
  onPressOut?: TouchableWithoutFeedbackProps['onPressOut'];
  onTouchStart?: PressableProps['onTouchStart'];
  onTouchEnd?: PressableProps['onTouchEnd'];
  onTouchCancel?: PressableProps['onTouchCancel'];
  onTouchMove?: PressableProps['onTouchMove'];
};

/**
 * Represents a React element that can either be a valid React element or null.
 * This type is useful for defining props or return types where a component
 * may conditionally render a React element or nothing at all.
 *
 * @example
 * const MyComponent: React.FC = () => {
 *   const shouldRender = true; // Condition to determine rendering
 *   return (
 *     <div>
 *       {shouldRender ? <span>Hello, World!</span> : null}
 *     </div>
 *   );
 * };
 */
export type IReactNullableElement = React.ReactElement | null;


/**
 * @group i18n
 * @interface IUseI18nOptions
 * 
 * An interface that defines options for configuring the internationalization (i18n) instance.
 * This interface allows developers to specify how the i18n library should handle locale settings,
 * including the option to use the device's locale and the ability to set a specific locale.
 * 
 * @property {boolean} [useLocaleFromDevice] - 
 * A flag indicating whether the locale should be automatically set from the device's locale.
 * If this flag is set to `true`, the i18n instance will attempt to match the device's locale
 * with the supported locales. If a match is found, it will use that locale; otherwise, it will fall back to the default locale.
 * 
 * @property {string} [locale] - 
 * The specific locale to use for the i18n instance. If this property is not provided, the i18n instance will use the default locale.
 * This allows for explicit control over the locale used in the application, regardless of the device settings.
 * 
 * @example
 * // Example of using IUseI18nOptions to configure i18n
 * const i18nOptions: IUseI18nOptions = {
 *   useLocaleFromDevice: true, // Automatically use the device's locale
 *   locale: 'fr-FR', // Explicitly set the locale to French (France)
 * };
 * 
 * // Example of using IUseI18nOptions with only the device locale option
 * const deviceLocaleOptions: IUseI18nOptions = {
 *   useLocaleFromDevice: true, // Use the device's locale if supported
 * };
 * 
 * @note This interface is particularly useful for applications that require localization support,
 * allowing for flexible configuration of locale settings based on user preferences or device settings.
 */
export interface IUseI18nOptions {
  /**
   * A flag indicating whether the locale should be set from the device's locale if it matches the supported locales.
   */
  useLocaleFromDevice?: boolean;

  /**
   * The locale to use for the i18n instance. If not provided, the default locale will be used.
   */
  locale?: string;
}