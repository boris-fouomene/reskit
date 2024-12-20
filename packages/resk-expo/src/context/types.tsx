import { IBreakpoints } from "@src/breakpoints/types";
import { ITheme } from "@theme/types";
import { EdgeInsets } from 'react-native-safe-area-context';
import { IDrawerNavigationViewProps } from "@layouts/DrawerNavigationView";
import { I18n } from "@resk/core";

/**
 * @group ReskExpoProvider
 * @interface IReskExpoProviderProps
 * Type definition for the props of the ReskExpoProvider component.
 * This type includes the properties that can be passed to the provider.
 * 
 * @property {React.ReactNode} [children] - The child elements to be rendered within the provider.
 * 
 * **Example**:
 * ```tsx
 * <ReskExpoProvider>
 *   <YourComponent />
 * </ReskExpoProvider>
 * ```
 * 
 * @property {ITheme} [theme] - An optional theme object that defines the styling for the provider.
 * 
 * **Example**:
 * ```tsx
 * const customTheme: ITheme = {
 *   primaryColor: '#6200ee',
 *   secondaryColor: '#03dac6',
 * };
 * 
 * <ReskExpoProvider theme={customTheme}>
 *   <YourComponent />
 * </ReskExpoProvider>
 * ```
 *  @property {IBreakpoints} [breakpoints] - An optional breakpoints object that defines the application breakpoints.
 * 
 *  @property {IDrawerNavigationViewProps} [drawerNavigationViewProps] - An optional object that defines the properties for the drawer navigation view.
 */
export type IReskExpoProviderProps = {
    children?: React.ReactNode;
    theme?: ITheme;
    breakpoints?: IBreakpoints;
    drawerNavigationViewProps?: Omit<IDrawerNavigationViewProps, 'drawerState'>;
}

/**
 * @group ReskExpoProvider
 * @interface IReskExpoContext
 * Type definition for the ReskExpoProvider interface (the provider itself).
 * This type extends the IReskExpoProviderProps type and adds additional properties and methods.
 * 
 * @property {ITheme} theme - The theme object that is required for the provider.
 * 
 * **Example**:
 * ```tsx
 * const providerProps: IReskExpoContext = {
 *   theme: {
 *     primaryColor: '#ff5722',
 *     secondaryColor: '#ffc107',
 *   },
 *   updateTheme: (newTheme) => { //update logic//},
 * };
 * ```
 * 
 * @property {(theme: ITheme) => any} updateTheme - A method to update the current theme.
 * 
 * **Example**:
 * ```tsx
 * const updateTheme = (newTheme: ITheme) => {
 *   // Logic to update the theme
 * };
 * 
 * updateTheme({
 *   primaryColor: '#3f51b5',
 *   secondaryColor: '#f44336',
 * });
 * ```
 */
export interface IReskExpoContext extends Omit<IReskExpoProviderProps, "type"> {
    theme: ITheme;
    updateTheme: (theme: ITheme) => any;

    /***
     * SafeAreaInsets
     */
    safeAreaInsets: EdgeInsets;

    /***
     * i18n instance library
     */
    i18n: I18n;
}


/**
 * @group ReskExpoContext
 * @typedef IReskExpoContextCallback
 * 
 * A callback type that takes an `IReskExpoContext` as an argument and returns a value of type `ReturnType`.
 * This type is designed for functions that need to interact with the context provided by the `ReskExpoProvider`.
 * 
 * @template ReturnType - The type of the value returned by the callback. Defaults to `any` if not specified.
 * 
 * @param {IReskExpoContext} reskExpoContext - The context object provided by the `ReskExpoProvider`.
 * This object contains essential properties and methods that can be utilized within the callback, such as theme settings, safe area insets, and internationalization (i18n) functionalities.
 * 
 * @returns {ReturnType} The value returned by the callback function, which can be of any type specified by `ReturnType`.
 * 
 * @example
 * // Example of a callback function that utilizes the IReskExpoContext
 * const myCallback: IReskExpoContextCallback<number> = (context) => {
 *   // Accessing the safe area insets from the context
 *   const insets = context.safeAreaInsets;
 *   // Calculating a value based on the insets and returning it
 *   return insets.top + insets.bottom; // Returns the total vertical safe area insets
 * };
 * 
 * // Example of using the callback in a function
 * const executeCallback = (callback: IReskExpoContextCallback<number>) => {
 *   const context: IReskExpoContext = {
 *     theme: { primaryColor: '#6200ee', secondaryColor: '#03dac6' },
 *     updateTheme: (newTheme) => {  },
 *     safeAreaInsets: { top: 20, bottom: 20, left: 0, right: 0 },
 *     i18n: {  },
 *   };
 *   const result = callback(context);
 *   console.log(`Total safe area insets: ${result}`); // Output: "Total safe area insets: 40"
 * };
 * 
 * // Invoking the function with the callback
 * executeCallback(myCallback);
 * 
 * @note This type is particularly useful in scenarios where you need to pass the context to various components or functions that require access to the `ReskExpoProvider` context, allowing for flexible and type-safe interactions.
 */
export type IReskExpoContextCallback<ReturnType = any> = ((reskExpoContext: IReskExpoContext) => ReturnType);