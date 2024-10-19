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
 * @description
 * Represents the base options for onChange events in form components.
 * This type is generic, allowing for customization of value and event types.
 * 
 * @template IValueType The type of the value being changed, defaults to any
 * @template IEventType The type of the event object, defaults to React Native's text input event
 * 
 * @example
 * // Using IOnChangeOptionsBase with default types
 * const handleChange = (options: IOnChangeOptionsBase) => {
 *   console.log('New value:', options.value);
 *   console.log('Field name:', options.fieldName);
 * };
 * 
 * @example
 * // Using IOnChangeOptionsBase with custom types
 * type CustomEvent = { target: { value: string } };
 * const handleCustomChange = (options: IOnChangeOptionsBase<string, CustomEvent>) => {
 *   console.log('New value:', options.value);
 *   console.log('Event type:', options.event?.target.value);
 * };
 * 
 * @property {IEventType} [event] - The event that triggered the change.
 * @property {IValueType} [value] - The new value after the change.
 * @property {any} [previousValue] - The value before the change occurred.
 * @property {boolean} [focused] - Indicates whether the component is focused at the time of the change.
 * @property {string} [fieldName] - The name of the field if it's part of a form.
 */
export type IOnChangeOptionsBase<
  IValueType = any,
  IEventType = NativeSyntheticEvent<TextInputChangeEventData> | null
> = {
  event?: IEventType;
  value?: IValueType;
  previousValue?: any;
  focused?: boolean;
  fieldName?: string;
}

/**
 * @interface IOnChangeOptionsExtends
 * @description
 * Represents the extended options for onChange events, typically used in TextInput components.
 * This type allows for further customization and extension of the base onChange options.
 * 
 * @template IOnChangeOptionsExtends Additional properties to extend the base options, defaults to any
 * @template IValueType The type of the value being changed, defaults to any
 * @template IEventType The type of the event object, defaults to React Native's text input event or null
 * 
 * @example
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
 * @typedef {Omit<IOnChangeOptionsBase<IValueType, IEventType>, keyof IOnChangeOptionsExtends> & IOnChangeOptionsExtends} IOnChangeOptions
 */
export type IOnChangeOptions<
  IOnChangeOptionsExtends = any,
  IValueType = any,
  IEventType = NativeSyntheticEvent<TextInputChangeEventData> | null
> = Omit<IOnChangeOptionsBase<IValueType, IEventType>, keyof IOnChangeOptionsExtends> & IOnChangeOptionsExtends;