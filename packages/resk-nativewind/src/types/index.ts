import { IInputFormatterResult } from "@resk/core/types";
import { II18nLocale } from "@src/i18n/types";
import { Component, ComponentClass, ExoticComponent, FunctionComponent, JSXElementConstructor, ReactElement } from "react";
import { ViewStyle, TextStyle, ImageStyle, StyleProp, NativeSyntheticEvent, TextInputChangeEventData, Animated, PressableProps, TouchableWithoutFeedbackProps } from "react-native";
import { type ClassValue } from 'clsx';
import { IVariantPropsAll } from "@variants/all";


export type IClassName = ClassValue;

export interface INativewindBaseProps extends Omit<IVariantPropsAll, "disabled"> {
  className?: IClassName;
  disabled?: PressableProps["disabled"];
}
/**
  @interface
 * Defines a type that can represent either a Functional Component or a Class Component in React.
 * 
 * This type is useful for situations where you want to accept both types of 
 * React components as props or within other components. The type is generic, 
 * allowing you to specify the props and state types for class components.
 * 
 * @template Props - The type of the component's props.
 * @template State - The type of the component's state.
 * ### Usage Example:
 * 
 * ```tsx
 * import * as React from 'react';
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
export type IReactComponent<Props = any, State = any> =
  FunctionComponent<Props>                                    // Functional Component
  | (new (props: Props) => Component<Props, State>) // Class Component Constructor
  | ComponentClass<Props, State>                 // Class Component Class
  | ExoticComponent<Props>                       // Exotic Components (like Memo, Lazy)
  | ((props: Props) => ReactElement | null)            // Basic Function Component
  | JSXElementConstructor<Props>                       // Any component that can be used in JSX

/**
 * @typedef ITextStyle
 * Type alias for TextStyle props.
 * This type is used to define styles for Text components.
 * @example
 * const textStyle: ITextStyle = { fontSize: 24, color: 'black' };
 * @see {@link https://reactnative.dev/docs/text} for more information about Text component styles.
 */
export type ITextStyle = StyleProp<TextStyle>;

/**
 * Type alias for ViewStyle props.
 * This type is used to define styles for View components.
 * @example
 * const viewStyle: IViewStyle = { flex: 1, justifyContent: 'center', alignItems: 'center' };
 * @see {@link https://reactnative.dev/docs/view} for more information about View component styles.
 */
export type IViewStyle = StyleProp<ViewStyle>;

/**
 * @typedef IStyle
 * Type alias for styles that can be applied to various components.
 * This type is a union of ITextStyle, IViewStyle, and IImageStyle.
 * It allows for flexibility in defining styles for different types of components.
 * @example
 * const style: IStyle = { fontSize: 16, color: 'blue' };
 * @see {@link ITextStyle} for more information about Text component styles.
 * @see {@link IViewStyle} for more information about View component styles.
 * @see {@link IImageStyle} for more information about Image component styles.
 */
export type IStyle = ITextStyle | IViewStyle | IImageStyle;

/**
 * Type alias for ImageStyle props.
 * This type is used to define styles for Image components.
 * @example
 * const imageStyle: IImageStyle = { width: 100, height: 100, borderRadius: 50 };
 * @see {@link https://reactnative.dev/docs/image} for more information about Image component styles.
 */
export type IImageStyle = StyleProp<ImageStyle>;

/**
 * @typedef IAnimatedViewStyle
 * Represents the style type for an `Animated.View`.
 * 
 * This type extends the base `ViewStyle` to include support for animated values.
 * It is compatible with both static styles (e.g., `{ opacity: 0.5 }`) and dynamic
 * styles using `Animated.Value` or interpolated values.
 * 
 * @example
 * const animatedValue = new Animated.Value(0);
 * const viewStyle: IAnimatedViewStyle = {
 *   opacity: animatedValue,
 *   transform: [{ scale: animatedValue }],
 * };
 * @see {@link https://reactnative.dev/docs/animated} for more information about Animated component styles.
 */
export type IAnimatedViewStyle = Animated.WithAnimatedValue<StyleProp<ViewStyle>>;

/**
 * @typedef IAnimatedTextStyle
 * Represents the style type for an `Animated.Text`.
 * 
 * This type extends the base `TextStyle` to include support for animated values.
 * It is compatible with both static styles (e.g., `{ fontSize: 16 }`) and dynamic
 * styles using `Animated.Value` or interpolated values.
 * 
 * @example
 * const animatedValue = new Animated.Value(0);
 * const textStyle: IAnimatedTextStyle = {
 *   fontSize: animatedValue.interpolate({
 *     inputRange: [0, 1],
 *     outputRange: [12, 24],
 *   }),
 * };
 *  @see {@link https://reactnative.dev/docs/animated} for more information about Animated component styles.
 */
export type IAnimatedTextStyle = Animated.WithAnimatedValue<StyleProp<TextStyle>>;

/**
 * @typedef IAnimatedImageStyle
 * Represents the style type for an `Animated.Image`.
 * 
 * This type extends the base `ImageStyle` to include support for animated values.
 * It is compatible with both static styles (e.g., `{ width: 100, height: 100 }`)
 * and dynamic styles using `Animated.Value` or interpolated values.
 * 
 * @example
 * const animatedValue = new Animated.Value(0);
 * const imageStyle: IAnimatedImageStyle = {
 *   width: 100,
 *   height: 100,
 *   borderRadius: animatedValue.interpolate({
 *     inputRange: [0, 1],
 *     outputRange: [0, 50],
 *   }),
 * };
 *  @see {@link https://reactnative.dev/docs/animated} for more information about Animated component styles.
 */
export type IAnimatedImageStyle = Animated.WithAnimatedValue<StyleProp<ImageStyle>>;



/**
 * @interface IOnChangeOptions
 * Represents the options for an onChange event handler with extended capabilities.
 * It represents the extended options for onChange events, typically used in TextInput components.
 * This type allows for further customization and extension of the base onChange options.

 * @template OnChangeEventType - The type of the event that triggered the change. 
 *                        Defaults to The type of the event object, defaults to React Native's text input event `NativeSyntheticEvent<TextInputChangeEventData> | null`.
 * @template ValueType - The type of the value being changed. Defaults to `any`. 
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
export interface IOnChangeOptions<OnChangeEventType = unknown | null, ValueType = unknown> {
  event?: OnChangeEventType;
  value?: ValueType;
  previousValue?: any;
  focused?: boolean;
  fieldName?: string;
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
export type ITouchableEventNames = keyof ITouchableProps;


/**
 * @interface ITouchableProps
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
export interface ITouchableProps {
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  onPressIn?: PressableProps['onPressIn'];
  onPressOut?: PressableProps['onPressOut'];
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
export type IReactNullableElement = ReactElement | null;


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

  /***
   * An array of supported languages for the i18n instance.
   */
  languages?: II18nLocale[];

  /***
   * An array of supported locales for the i18n instance.
   */
  locales?: string[];
}