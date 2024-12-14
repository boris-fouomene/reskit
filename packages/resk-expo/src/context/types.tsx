import { IBreakpoints } from "@src/breakpoints/types";
import { ITheme } from "@theme/types";
import { EdgeInsets } from 'react-native-safe-area-context';
import { IDrawerNavigationViewProps } from "@layouts/DrawerNavigationView";

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
 * @interface IReskExpoProvider
 * Type definition for the ReskExpoProvider interface (the provider itself).
 * This type extends the IReskExpoProviderProps type and adds additional properties and methods.
 * 
 * @property {ITheme} theme - The theme object that is required for the provider.
 * 
 * **Example**:
 * ```tsx
 * const providerProps: IReskExpoProvider = {
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
export type IReskExpoProvider = Omit<IReskExpoProviderProps, "type"> & {
    theme: ITheme;
    updateTheme: (theme: ITheme) => any;

    /***
     * SafeAreaInsets
     */
    safeAreaInsets: EdgeInsets
}