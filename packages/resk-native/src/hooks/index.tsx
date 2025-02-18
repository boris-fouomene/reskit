import { IReactComponent } from "@src/types";
import { IAppBarProps } from "@components/AppBar";
import { IWithHOCOptions, withHOC } from "./withHOC";
import AppBarLayout from "@layouts/AppBarLayout";
import { IReskNativeContextCallback } from "@src/context/types";
import { useReskNative } from "@src/context/hooks";



/**
 * @function withAppBar
 * A Higher-Order Component (HOC) that wraps a given component with an AppBar.
 * 
 * The `withAppBar` function enhances a React component by adding an 
 * AppBar layout above it. This is useful for creating consistent 
 * navigation headers across different screens in an application. 
 * The AppBar can be customized through the `appBarProps` parameter, 
 * allowing developers to specify titles, actions, and other properties 
 * for the AppBar.
 * 
 * ### Type Parameters
 * 
 * - `T`: The type of the props for the component being wrapped. This 
 *   allows for type safety and ensures that the wrapped component 
 *   receives the correct props.
 * 
 * - `TState`: The type of the state for the component being wrapped (if that component is a class component).
 * 
 * ### Parameters
 * 
 * - `Component` (IReactComponent<T>): The React component to be wrapped 
 *   with the AppBar. This component will be rendered below the AppBar.
 * 
 * - `appBarProps` (IAppBarProps): Optional properties to customize the 
 *   AppBar. This includes settings like title, subtitle, actions, and 
 *   back action properties.
 * 
 * - `options` (IWithHOCOptions): Optional settings for the HOC, such as 
 *   display name and fallback rendering options.
 * 
 * ### Example Usage
 * 
 * Here is an example of how you might use the `withAppBar` function to 
 * create a new component with an AppBar:
 * 
 * ```typescript
 * import React from 'react';
 * import { withAppBar } from '@resk/native';
 * 
 * const MyComponent: React.FC<{ message: string }> = ({ message }) => {
 *     return <div>{message}</div>;
 * };
 * 
 * const MyComponentWithAppBar = withAppBar(MyComponent, {
 *     title: "My App",
 *     subtitle: "Welcome to my application",
 *     actions: [
 *         { label: 'Settings', onPress: () => console.log('Settings pressed') },
 *         { label: 'Profile', onPress: () => console.log('Profile pressed') },
 *     ],
 * });
 * 
 * const App = () => {
 *     return <MyComponentWithAppBar />;
 * };
 * ```
 * 
 * In this example, `MyComponent` is wrapped with an AppBar that has a 
 * title and actions. The resulting `MyComponentWithAppBar` can be used 
 * in the application, providing a consistent AppBar layout.
 * 
 * @see {@link IAppBarProps} for more information on the AppBar properties.
 * @see {@link IReactComponent} for more information on the React component type.
 * @see {@link IWithHOCOptions} for more information on the HOC options.
 * @see {@link withHOC} for a higher-order component that can be used to enhance a component.
 * @see {@link IReactComponent} for more information on the React component type.
 * ### Return Value
 * 
 * The function returns a new component that includes the AppBar and the 
 * wrapped component. This new component can be rendered like any other 
 * React component.
 * 
 * @returns {React.FC<T>} A new React component that renders the AppBar 
 * and the wrapped component.
 */
export function withAppBar<T extends object, TState extends object = any>(Component: IReactComponent<T, TState>, appBarProps?: IAppBarProps | IReskNativeContextCallback<IAppBarProps>, options?: IWithHOCOptions) {
    options = options || {};
    options.displayName = options.displayName || Component?.displayName || "RN_WithAppBarComponent";
    return withHOC<T>(function (props: T) {
        const reskExpoContext = useReskNative();
        const _appBarProps = Object.assign({}, (typeof appBarProps === "function" ? appBarProps(reskExpoContext) : appBarProps)) as IAppBarProps;
        return <>
            <AppBarLayout {..._appBarProps} />
            <Component {...(props)} />
        </>
    }, options);
}

export * from "./withHOC";
export * from "./label2left2right";