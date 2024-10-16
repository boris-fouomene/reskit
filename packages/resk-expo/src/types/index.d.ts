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
