import { createContext, useContext } from "react";
import { IAppBarContext } from "./types";

/**
 * Creates a context for managing the state and behavior of the AppBar component.
 * 
 * The `AppBarContext` provides a way to share AppBar-related data and functions
 * across components without having to pass props down manually at every level.
 * This context can hold information such as the current theme, actions, and
 * visibility state of the AppBar.
 * 
 * @type {React.Context<IAppBarContext<any>>} 
 * @example
 * // Example of using AppBarContext in a component
 * const MyComponent: React.FC = () => {
 *     const appBarContext = React.useContext(AppBarContext);
 *     return <div>{appBarContext.someValue}</div>;
 * };
 */
export const AppBarContext = createContext<IAppBarContext<any>>({} as IAppBarContext<any>);

/**
 * Custom hook to access the AppBar context.
 * 
 * This hook allows components to easily retrieve the current AppBar context
 * without needing to use the `useContext` hook directly. It provides a type-safe
 * way to access the context values and ensures that components can react to
 * changes in the AppBar state.
 * 
 * @template IAppBarActionContext - A generic type parameter that allows extending the context 
 * for AppBar actions, enabling customization of the properties passed to action items.
 * 
 * @returns {IAppBarContext<IAppBarActionContext>} The current AppBar context, which includes
 * properties and methods relevant to the AppBar.
 * 
 * @example
 * const MyAppBar: React.FC = () => {
 *     const appBarContext = useAppBar();
 *     return (
 *         <div style={{ backgroundColor: appBarContext.backgroundColor }}>
 *             <h1>{appBarContext.title}</h1>
 *         </div>
 *     );
 * };
 */
export function useAppBar<IAppBarActionContext = any>(): IAppBarContext<IAppBarActionContext> {
    return useContext(AppBarContext) as IAppBarContext<IAppBarActionContext>;
};