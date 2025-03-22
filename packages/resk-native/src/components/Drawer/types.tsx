import { IAppBarProps } from "@components/AppBar";
import { IMenuItemBase, IMenuItems } from "@components/Menu/types";
import { IViewProps } from "@components/View";
import { IAuthSessionStorage } from "@resk/core/auth/types";
import { IDict } from "@resk/core/types";
import { IObservable } from "@resk/core/observable";
import { ReactNode } from "react";
import { Animated, GestureResponderEvent, PanResponderInstance } from "react-native";


/**
 * Interface representing a Drawer component with observable properties.
 */
export interface IDrawer extends IObservable<IDrawerEvent>, React.PureComponent<IDrawerProps, IDrawerState> {
    /**
     * The last open value of the drawer.
     */
    _lastOpenValue: any;

    /**
     * Unique identifier for the drawer.
     */
    id: string;

    /**
     * PanResponder instance for handling gesture interactions.
     */
    _panResponder: PanResponderInstance;

    /**
     * Indicates if the drawer is in the process of closing.
     */
    _isClosing: boolean;

    /**
     * The anchor value used when closing the drawer.
     */
    _closingAnchorValue: number;

    /**
     * Reference to the navigation view component.
     */
    _navigationViewRef: any;

    /**
     * Reference to the backdrop component.
     */
    _backdropRef: any;

    /**
     * Renders the content of the drawer.
     * @returns The content to be rendered inside the drawer.
     */
    renderContent(): React.ReactNode;

    /**
     * Retrieves the session name associated with the drawer.
     * @returns The session name.
     */
    getSessionName(): string;

    /**
     * Retrieves a session value by key.
     * @param key - The key of the session value to retrieve.
     * @returns The session value associated with the key.
     */
    getSession(key?: string): any;

    /**
     * Sets a session value by key.
     * @param key - The key of the session value to set.
     * @param value - The value to set for the session key.
     * @returns The updated session value.
     */
    setSession(key: string, value?: any): any;

    /**
     * Checks if the drawer is minimizable.
     * @returns True if the drawer is minimizable, false otherwise.
     */
    isMinimizable(): boolean;

    /**
     * Checks if the drawer is minimized.   
     */
    isMinimized(): boolean;

    /**
     * Checks if the drawer is permanent.
     * @returns True if the drawer is permanent, false otherwise.
     */
    isPermanent(): boolean;

    /**
     * Retrieves the state options for the drawer.
     * @param drawerState - Optional state options to retrieve.
     * @returns The state options for the drawer.
     */
    getStateOptions(drawerState?: IDrawerCurrentState | undefined | null): IDrawerCurrentState;

    /**
     * Checks if the drawer can be pinned.
     * @returns True if the drawer can be pinned, false otherwise.
     */
    canBePinned(): boolean;

    /**
     * Retrieves the properties of the drawer.
     * @returns Partial properties of the drawer.
     */
    getProps(): Partial<IDrawerProps & IDrawerState>;

    /**
     * Retrieves the test ID for the drawer.
     * @returns The test ID.
     */
    getTestID(): string;

    /**
     * Checks if the drawer is in full-screen mode.
     * @returns True if the drawer is in full-screen mode, false otherwise.
     */
    isFullScreen(): boolean;

    /**
     * Checks if the drawer can toggle full-screen mode.
     * @returns True if the drawer can toggle full-screen mode, false otherwise.
     */
    canToggleFullScren(): boolean;

    /**
     * Toggles the full-screen mode of the drawer.
     */
    toggleFullScreen(): void;

    /**
     * Retrieves the AppBar properties for the provider.
     * @param handleDrawerWidth - Optional flag to handle drawer width.
     * @returns The AppBar properties.
     */
    getProviderAppBarProps(handleDrawerWidth?: boolean): IAppBarProps;

    /**
     * Renders the title for the provider.
     * @returns The title to be rendered for the provider.
     */
    renderProviderTitle(): React.ReactNode;

    /**
     * Renders the children for the provider.
     * @returns The children to be rendered for the provider.
     */
    renderProviderChildren(): React.ReactNode;

    /**
     * Checks if the drawer is a provider.
     * @returns True if the drawer is a provider, false otherwise.
     */
    isProvider(): boolean;


    /**
   * Toggles the drawer state between open and closed.
   * 
   * If the drawer is permanent, it will immediately trigger the toggle event.
   * Otherwise, it will either open or close the drawer and then trigger the toggle event.
   * 
   * @param callback - An optional callback function that will be called with the drawer state options after the toggle event is triggered.
   */
    toggle(callback?: (options: IDrawerCurrentState) => void): void;

    /**
     * Sets the minimized state of the drawer.
     *
     * @param minimized - A boolean indicating whether the drawer should be minimized.
     * @param callback - An optional callback function that will be called with the drawer state options after the state is set.
     */
    setMinimized: (minimized: boolean, callback?: (options: IDrawerCurrentState) => any) => void;


    /**
    * Sets the drawer to be permanent or not.
    *
    * @param permanent - A boolean indicating whether the drawer should be permanent.
    * @param callback - An optional callback function that receives the drawer state options.
    *
    * If the drawer cannot be pinned and is not currently permanent, or if the drawer's
    * permanent state is already the same as the provided value, the callback is invoked
    * immediately with the current state options.
    *
    * If the drawer is to be made permanent, it opens the drawer and then sets the permanent
    * state, triggering the appropriate events and setting the session state.
    *
    * If the drawer is to be made non-permanent, it directly sets the permanent state,
    * triggering the appropriate events and setting the session state.
    */
    setPermanent(permanent: boolean, callback?: (options: IDrawerCurrentState) => any): void;


    /**
    * Determines if the drawer component is minimizable.
    *
    * @returns {boolean} True if the drawer can be minimized, false otherwise.
    */
    isMinimizable(): boolean


    /**
     * Sets the drawer to be permanent.
     *
     * @param callback - An optional callback function that receives the drawer state options after the permanent state is set.
     */
    pin(callback?: (options: IDrawerCurrentState) => any): void;

    /**
     * Sets the drawer to be non-permanent.
     *
     * @param callback - An optional callback function that receives the drawer state options after the permanent state is set.
     */
    unpin(callback?: (options: IDrawerCurrentState) => any): void;

    /**
     * Checks if the drawer is pinned (is permanent).
     * 
     * @returns {boolean} - Returns true if the drawer is permanent, otherwise false.
     */
    isPinned: () => boolean;

    /**
     * Returns the width of the device's window, ensuring a minimum width of 280.
     *
     * @returns {number} The width of the device's window or 280, whichever is greater.
     */
    getDeviceWidth(): number;

    /**
     * Determines the position of the drawer based on the current language direction (RTL or LTR)
     * and the provided position prop.
     *
     * @returns {IDrawerPosition} The position of the drawer, either "left" or "right".
     */
    getDrawerPosition(): IDrawerPosition;

    /**
     * Determines if the drawer position is set to "right".
     *
     * @returns {boolean} True if the drawer position is "right", otherwise false.
     */
    isPositionRight(): boolean;

    /**
     * Checks if the drawer is open.
     *
     * @returns {boolean} True if the drawer is open, otherwise false.
     */
    isOpen(): boolean;


    /**
     * Checks if the drawer is closed.
     * @returns {boolean} True if the drawer is closed, otherwise false.
     */
    isClosed(): boolean;

    /**
     * Determines if the drawer can be pinned (minimized or set to permanent mode.).
     * The function checks if the current media matches the desktop breakpoint.
     * @returns {boolean} - Returns true if the drawer can be minimized or set to permanent, otherwise false.
     */
    canBePinned(): boolean;

    /**
    * Retrieves the properties for the Drawer component.
    * 
    * @returns {Partial<IDrawerProps & IDrawerState>} A partial object containing either the provider properties 
    * if the component is a provider, or a combination of the component's props and state.
    */
    getProps(): Partial<IDrawerProps & IDrawerState>;


    /**
    * Retrieves the test ID for the drawer component.
    *
    * @returns {string} The test ID for the drawer component. If the component is a provider, 
    * it returns "resk-drawer-provider", otherwise it returns "resk-drawer".
    */
    getTestID(): string;

    /**
     * Checks if the drawer is in full-screen mode.
     *
     * @returns {boolean} Returns `true` if the drawer is in full-screen mode, otherwise `false`.
     */
    isFullScreen(): boolean;

    /**
     * Determines if the full screen mode can be toggled.
     *
     * @returns {boolean} - Returns `true` if the device is not in mobile media mode, otherwise `false`.
     */
    canToggleFullScren(): boolean;

    /**
     * Toggles the full-screen mode of the drawer component.
     * 
     * This method animates the `openValue` state using a spring animation to transition
     * to the full-screen mode. The animation configuration includes properties such as
     * `bounciness`, `restSpeedThreshold`, and `useNativeDriver`.
     * 
     * Once the animation completes, the `fullScreen` state is toggled, and the `_isTogglingFullScreen`
     * flag is reset to `false`.
     * 
     * @remarks
     * This method sets the `_isTogglingFullScreen` flag to `true` at the start to indicate
     * that the full-screen toggle process is in progress.
     */
    toggleFullScreen(): void;

    /**
     * Retrieves the properties for the provider's AppBar component.
     *
     * @param {boolean} [handleDrawerWidth] - Optional flag to determine if the drawer width should be handled.
     * @returns {IAppBarProps} The properties for the AppBar component.
     *
     * @remarks
     * - The `testID` is generated by appending "drawer-title-container" to the component's test ID.
     * - The `windowWidth` is set based on the drawer width if `handleDrawerWidth` is not explicitly set to false.
     * - The `onBackActionPress` function closes the drawer and returns false.
     * - The `backAction` function returns a combination of the provided back action element and a toggle for full screen mode if applicable.
     */
    getProviderAppBarProps(handleDrawerWidth?: boolean): IAppBarProps;


    /**
     * Retrieves the session name for the drawer component.
     * 
     * @returns {string} The session name. If the component has a `sessionName` prop, it returns that value.
     * Otherwise, if the component is a provider, it returns "drawer-provider". If neither condition is met,
     * it returns "drawer".
     */
    getSessionName(): string;

    /**
     * Calculates and returns the width of the drawer.
     *
     * @param {boolean} [fullScreen] - Optional parameter to specify if the drawer should be full screen.
     * If not provided, it defaults to the component's state value.
     * @returns {number} - The width of the drawer. If the drawer is in full screen mode or if the device
     * is a mobile device and the component is a provider, it returns the window width. Otherwise, it returns
     * the drawer width specified in the component's props or a default value.
     */
    getDrawerWidth(fullScreen?: boolean): number;

    /**
     * Retrieves the current authentication session storage.
     *
     * @returns {IAuthSessionStorage} The authentication session storage associated with the current session name.
     */
    get session(): IAuthSessionStorage;

    /**
     * Retrieves a session value associated with the given key.
     *
     * @param {string} [key] - The key of the session value to retrieve. If no key is provided, the entire session is returned.
     * @returns {any} The session value associated with the provided key, or the entire session if no key is provided.
     */
    getSession(key?: string): any;

    /**
     * Sets a session value for the given key.
     *
     * @param {string} key - The key for the session value.
     * @param {any} [value] - The value to be set for the session key. If not provided, the value will be undefined.
     * @returns {any} The result of setting the session value.
     */
    setSession(key: string, value?: any): any;


    /**
     * Opens the drawer with the specified options.
     *
     * @param {IDrawerProviderProps} [options={}] - The options for opening the drawer.
     * @param {boolean | Function} [callback=false] - Determines whether to reset provider props or a function that is call after the drawer is opened.
     *
     * @returns {void}
     */
    open: (options?: IDrawerProviderProps, callback?: boolean | Function) => void;

    /**
     * Closes the drawer with optional settings and a callback function.
     * 
     * @param {IDrawerProviderProps} [options] - Optional settings for closing the drawer.
     * @param {Function} [callback] - Optional callback function to be called after the drawer is closed.
     * 
     * The function performs the following actions:
     * - Merges the provided options with default options.
     * - Emits a state change event indicating the drawer is settling.
     * - Defines an `end` function that:
     *   - Calls the provided callback function, if any, with the current state options.
     *   - Calls the `options.callback` function, if any, with the current state options.
     *   - If the drawer is a provider, calls the `onDrawerClose` function from `providerProps`, if defined.
     *   - Otherwise, calls the `onDrawerClose` function from `props`, if defined.
     *   - Emits a state change event indicating the drawer is idle.
     *   - Triggers the `CLOSED` event with the current state options.
     * - If the drawer is not permanent and is currently open, animates the drawer to a closed state and then calls the `end` function.
     * - If the drawer is already closed or permanent, directly calls the `end` function.
     */
    close(options?: IDrawerProviderProps, callback?: Function): void;

    /**
     * Function to render the navigation view of the drawer.
     * @param drawerState - The current state options of the drawer.
     * @returns The React node to be rendered as the navigation view.
     */
    renderNavigationView: () => React.ReactNode;

    _onOverlayClick(e: GestureResponderEvent): void;
}



/**
 * Interface representing the options for the drawer state.
 * 
 * @interface IDrawerCurrentState
 * @extends {IDict}
 * 
 * @property {IDrawer} context - The context, the drawer layout itself.
 * @property {string} [eventName] - The name of the event triggered at the time of option execution.
 * @property {string} [id] - Represents the ID of the drawer layout.
 * @property {GestureResponderEvent} [event] - The gesture responder event.
 * @property {string} [newState] - The new state of the drawer.
 * @property {boolean} [minimized] - Indicates if the drawer is minimized.
 * @property {boolean} [isPermanent] - Indicates if the drawer state is permanent.
 * @property {boolean} [isPinned] - Indicates if the drawer state is pinned, alias to isPermanent.
 * @property {boolean} [isMinimizable] - Indicates if the drawer can be minimized.
 * @property {boolean} [canBePinned] - Indicates if the drawer can be pinned.
 * @property {boolean} [isTemporary] - Indicates if the drawer is temporary at the current moment.
 * @property {Object} [nativeEvent] - The native event object.
 * @property {number} [nativeEvent.offset] - The offset value in the native event.
 */
export interface IDrawerCurrentState {
    context: IDrawer;
    eventName?: string;
    id?: string;
    event?: GestureResponderEvent;
    newState?: string;
    minimized?: boolean;
    minimizable?: boolean;
    isPermanent?: boolean;
    isPinned?: boolean; //si le drawer state est épinglé, alias à isPermanant
    isMinimizable?: boolean;
    canBePinned?: boolean; //si le drawer peut être épinglé
    isTemporary?: boolean; //si le drawer à l'instant t est temporaire
    nativeEvent?: {
        offset?: number;
    };
}

/**
 * Interface representing the state of a drawer component.
 * @interface IDrawerState
 */
export interface IDrawerState {
    /**
     * Indicates if the drawer's accessibility view is modal.
     */
    accessibilityViewIsModal: boolean;

    /**
     * Indicates if the drawer is currently shown.
     */
    drawerShown: boolean;

    /**
     * Indicates if the drawer is permanent.
     * Optional.
     */
    permanent?: boolean;

    /**
     * Indicates if the drawer is minimized.
     * Optional.
     */
    minimized?: boolean;

    /**
     * Indicates if the drawer is provided by a provider.
     */
    isProvider: boolean;

    /**
     * Properties of the drawer provider.
     */
    providerProps: IDrawerProviderProps;

    /**
     * Animated value representing the open state of the drawer.
     */
    openValue: Animated.Value;

    /**
     * Width of the drawer.
     * Optional.
     */
    drawerWidth?: number;

    /**
     * Mode for dismissing the keyboard when interacting with the drawer.
     * Can be "none" or "on-drag".
     * Optional.
     */
    keyboardDismissMode?: "none" | "on-drag";

    /**
     * Callback function called when the drawer is closed.
     * Optional.
     */
    onDrawerClose?: (options: IDrawerCurrentState) => any;

    /**
     * Callback function called when the drawer is opened.
     * Optional.
     */
    onDrawerOpen?: (options: IDrawerCurrentState) => any;

    /**
     * Callback function called when the drawer is sliding.
     * Optional.
     */
    onDrawerSlide?: (options: IDrawerCurrentState) => any;

    /**
     * Indicates if the drawer is in full screen mode.
     * Optional.
     */
    fullScreen?: boolean;
}


/**
 * Represents the position of the drawer component.
 * 
 * @typedef {("left" | "right" | undefined)} IDrawerPosition
 * 
 * @property {"left"} left - The drawer is positioned on the left side.
 * @property {"right"} right - The drawer is positioned on the right side.
 * @property {undefined} undefined - The drawer position is not defined.
 */
export type IDrawerPosition = "left" | "right" | undefined;


/**
 * Props for the DrawerProvider component.
 * 
 * @extends IDrawerToggleOptions
 * 
 * @property {IDrawerPosition} [position] - The position of the drawer.
 * @property {boolean} [minimizable] - Indicates if the drawer is minimizable.
 * @property {boolean} [minimized] - Indicates if the drawer is minimized.
 * @property {string} [sessionName] - The name of the session to use for persisting the drawer state.
 * @property {string} [testID] - The test ID of the provider.
 * @property {any} [children] - The child elements.
 * @property {boolean} [closeOnOverlayClick] - Indicates if the drawer will close when clicking on the overlay. This is only applicable when the drawer is in temporary mode.
 * @property {IAppBarProps | null} [appBarProps] - The props for the AppBar component, useful for rendering the AppBar.
 * @property {boolean} [permanent] - Indicates if the provider is permanent.
 * @property {(options: IDrawerCurrentState) => any} [onDrawerOpen] - Callback when the drawer is opened.
 * @property {(options: IDrawerCurrentState) => any} [onDrawerClose] - Callback when the drawer is closed.
 * @property {(options: IDrawerCurrentState) => any} [onOverlayClick] - Callback when clicking on the overlay.
 * @property {number} [drawerWidth] - The width of the drawer.
 * @property {boolean} [resetProvider] - Indicates if the drawer should be reset.
 * @property {ReactNode | ((options: IDrawerContext & { appBarProps: IAppBarProps }) => ReactNode)} [appBar] - The AppBar component to render within the DrawerProvider. This can be a ReactNode or a function that returns a ReactNode when used.
 */
export interface IDrawerProviderProps extends IDrawerToggleOptions {
    position?: IDrawerPosition;
    minimizable?: boolean; //si le drawer est minimizable
    minimized?: boolean; // si le drawer est minimisé
    sessionName?: string; //le nom de la session à utiliser pour persister l'état du drawer
    testID?: string; //le test id du provider
    children?: any; //la prop enfant
    closeOnOverlayClick?: boolean; // si le drawer sera fermé lorsqu'on clique sur l'espace vide. c'est valable seulement lorsque le drawer est en mode temporaire
    appBarProps?: IAppBarProps | null; //les pross du composant AppBar, utiles pour le rendu du appBar
    permanent?: boolean; //su le provider est permanent
    onDrawerOpen?: (options: IDrawerCurrentState) => any; //lorsque le drawer est open
    onDrawerClose?: (options: IDrawerCurrentState) => any; //lorsque le drawer est closed
    onOverlayClick?: (options: IDrawerCurrentState) => any; //lorsque l'on clique sur l'espace autre que le drawer (overlay)
    drawerWidth?: number; //la largeur du drawer
    resetProvider?: boolean; //si le drawer  doit être réinitialisé
    /****l'on peut directement décider de render l'appBar au composant Drawer provider
      dans ce cas, il suffit de spécifier la props AppBar de type reactNode ou de type fonction qui lorsqu'elle est utilisée, retourne un reactNode
    */
    appBar?: ReactNode | ((options: IDrawerContext & { appBarProps: IAppBarProps }) => ReactNode);
}


/***
 * Interface representing the context of the drawer.
 */
export interface IDrawerContext {
    drawer: IDrawer;
}


/**
 * Options for toggling the drawer.
 * 
 * This type extends `Animated.SpringAnimationConfig` excluding the `toValue` and `useNativeDriver` properties.
 * 
 * @property {function} [callback] - Optional callback function that receives `IDrawerCurrentState` as an argument.
 */
export type IDrawerToggleOptions = Omit<Animated.SpringAnimationConfig, "toValue" | "useNativeDriver"> & {
    callback?: (options: IDrawerCurrentState) => void;
};


/**
 * @interface IDrawerProps
 * @extends IViewProps
 * Interface representing the properties for the Drawer component.
 * Extends the properties of IViewProps.
 * @see {@link IViewProps} for more details.
 */
export interface IDrawerProps extends IViewProps {
    /**
     * Indicates if the drawer is a provider.
     * @default false
     */
    isProvider?: boolean;

    /**
     * Determines if the drawer can be minimized.
     * @default false
     */
    minimizable?: boolean;

    /**
     * Indicates if the drawer is currently minimized.
     * @default false
     */
    minimized?: boolean;

    /**
     * The name of the session used to persist the drawer's state.
     */
    sessionName?: string;

    /**
     * Specifies the lock mode of the drawer.
     * - "unlocked": The drawer can be opened and closed freely.
     * - "locked-closed": The drawer is locked in the closed position.
     * - "locked-open": The drawer is locked in the open position.
     */
    drawerLockMode?: "unlocked" | "locked-closed" | "locked-open" | undefined;

    /**
     * The position of the drawer.
     */
    position?: IDrawerPosition;

    /**
     * The width of the drawer.
     */
    drawerWidth?: number;

    /**
     * Function to get the state options of the drawer.
     * @param drawerState - The current state options of the drawer.
     * @returns The updated state options of the drawer.
     */
    getStateOptions?(drawerState?: IDrawerCurrentState): IDrawerCurrentState;

    /**
     * Determines if the drawer should close when clicking on the overlay.
     * This is only applicable when the drawer is in temporary mode.
     * @default false
     */
    closeOnOverlayClick?: boolean;

    /**
     * Specifies the keyboard dismiss mode.
     * - "none": The keyboard will not be dismissed.
     * - "on-drag": The keyboard will be dismissed when dragging the drawer.
     */
    keyboardDismissMode?: "none" | "on-drag";

    /**
     * Callback function triggered when the drawer is closed.
     * @param options - The state options of the drawer.
     */
    onDrawerClose?: (options: IDrawerCurrentState) => any;

    /**
     * Callback function triggered when the drawer is opened.
     * @param options - The state options of the drawer.
     */
    onDrawerOpen?: (options: IDrawerCurrentState) => any;

    /**
     * Callback function triggered when clicking on the overlay.
     * @param options - The state options of the drawer.
     */
    onOverlayClick?: (options: IDrawerCurrentState) => any;

    /**
     * Callback function triggered when the drawer is sliding.
     * @param options - The state options of the drawer.
     */
    onDrawerSlide?: (options: IDrawerCurrentState) => any;

    /**
     * Callback function triggered when the drawer state changes.
     * @param drawerState - The new state options of the drawer.
     */
    onDrawerStateChanged?: (drawerState: IDrawerCurrentState) => any;

    /**
     * Function to render the navigation view of the drawer.
     * @param drawerState - The current state options of the drawer.
     * @returns The React node to be rendered as the navigation view.
     */
    renderNavigationView?: (drawerState: IDrawerCurrentState) => React.ReactNode;

    /**
     * The background color of the status bar.
     */
    statusBarBackgroundColor?: string;

    /**
     * Determines if gestures are enabled for the drawer.
     * @default true
     */
    gesturesEnabled?: boolean;

    /**
     * Properties for the drawer provider.
     */
    providerProps?: IDrawerProviderProps;

    /**
     * The background color of the drawer.
     */
    backgroundColor?: string;

    /**
     * The elevation of the drawer.
     */
    elevation?: number;

    /**
     * Indicates if the drawer is permanent.
     * @default false
     */
    permanent?: boolean;

    /**
     * Reference to the navigation view.
     */
    navigationViewRef?: any;

    /***
     * make the drawer update its state when the window is resized.
     * @default true
     */
    bindResizeEvent?: boolean;
}


/**
 * Interface representing a drawer session.
 */
export interface IDrawerSession {
    /**
     * Optional name of the session.
     */
    sessionName?: string;

    /**
     * Gets the name of the session.
     */
    get name(): string;

    /**
     * Retrieves a value associated with the given key.
     * @param a - The key to retrieve the value for.
     * @returns The value associated with the key.
     */
    get: (a: string) => any;

    /**
     * Sets a value for the given key or updates multiple values.
     * @param a - The key to set the value for, or an object containing multiple key-value pairs to update.
     * @param b - The value to set for the given key.
     * @returns The result of the set operation.
     */
    set: (a: string | object, b: any) => any;
};


/**
 * Interface representing the properties for Drawer items.
 * 
 * @extends IMenuItems<IDrawerContext>
 * 
 * @example
 * // Example usage of IDrawerItemsProps
 * const drawerItems: IDrawerItemsProps = {
 *   items: [
 *     { id: 'home', label: 'Home', context: { isActive: true } },
 *     { id: 'settings', label: 'Settings', context: { isActive: false } }
 *   ],
 *   onItemSelect: (item) => console.log(`Selected item: ${item.label}`)
 * };
 * 
 * @remarks
 * This interface extends the `IMenuItems` interface with a generic type `IDrawerContext`.
 * It is used to define the properties required for rendering drawer items in a component.
 * 
 * @see {@link IMenuItems}
 * @see {@link IDrawerContext}
 */
export interface IDrawerItemsProps extends IMenuItems<IDrawerContext> {

}


/**
 * Represents the properties for a drawer item component.
 * 
 * @template IDrawerContext - The context type for the drawer.
 * 
 * @property {boolean | (() => boolean)} [active] - Specifies whether the item is active or not. 
 * Can be a boolean value or a function that returns a boolean.
 * 
 * @example
 * // Example of using a boolean value
 * const drawerItemProps: IDrawerItemProps = {
 *   active: true,
 *   routePath: '/home',
 *   routeParams: { userId: 123 },
 *   isRendable: true
 * };
 * 
 * @example
 * // Example of using a function
 * const drawerItemProps: IDrawerItemProps = {
 *   active: ({drawer}) => checkIfActive(drawer),
 *   routePath: '/profile',
 *   routeParams: { userId: 456 },
 *   isRendable: false
 * };
 * 
 * @property {string} [routePath] - The route path to navigate to when the drawer item is clicked. 
 * This route is called when the `onPress` prop does not return false.
 * 
 * @example
 * const drawerItemProps: IDrawerItemProps = {
 *   routePath: '/settings',
 *   routeParams: { theme: 'dark' },
 *   isRendable: true
 * };
 * 
 * @property {IDict} [routeParams] - The parameters for the route.
 * 
 * @example
 * const drawerItemProps: IDrawerItemProps = {
 *   routePath: '/details',
 *   routeParams: { itemId: 789 },
 *   isRendable: true
 * };
 * 
 * @property {boolean} [isRendable] - Specifies whether the item should be rendered or not.
 * 
 * @example
 * const drawerItemProps: IDrawerItemProps = {
 *   isRendable: false
 * };
 */
export type IDrawerItemProps = IMenuItemBase<IDrawerContext> & {
    active?: boolean | ((options: IDrawerContext) => boolean);
    routePath?: string;
    routeParams?: IDict;
    isRendable?: boolean;
}

/**
 * Represents the various events that can occur in a drawer component.
 * 
 * The `IDrawerEvent` type is a union of string literals that define the 
 * different states or actions that a drawer can undergo. This type is 
 * particularly useful for event handling in UI components where 
 * a drawer is used to show or hide content.
 * 
 * ### Possible Values:
 * - `"minimized"`: Indicates that the drawer has been minimized, 
 *   typically reducing its size to show only a handle or icon.
 * - `"permanent"`: Indicates that the drawer is in a permanent state, 
 *   meaning it is always visible and does not toggle.
 * - `"toggle"`: Represents an action where the drawer's visibility 
 *   is toggled between open and closed states.
 * - `"state_changed"`: Signifies that the state of the drawer has 
 *   changed, which could be due to user interaction or programmatic 
 *   changes.
 * - `"opened"`: Indicates that the drawer has been opened, making 
 *   its contents visible to the user.
 * - `"closed"`: Indicates that the drawer has been closed, hiding 
 *   its contents from the user.
 * 
 * ### Example Usage:
 * 
 * Here is an example of how you might use the `IDrawerEvent` type 
 * in a function that handles drawer events:
 * 
 * ```typescript
 * function handleDrawerEvent(event: IDrawerEvent): void {
 *     switch (event) {
 *         case "minimized":
 *             console.log("The drawer has been minimized.");
 *             break;
 *         case "permanent":
 *             console.log("The drawer is in a permanent state.");
 *             break;
 *         case "toggle":
 *             console.log("Toggling the drawer state.");
 *             break;
 *         case "state_changed":
 *             console.log("The drawer state has changed.");
 *             break;
 *         case "opened":
 *             console.log("The drawer is now opened.");
 *             break;
 *         case "closed":
 *             console.log("The drawer is now closed.");
 *             break;
 *         default:
 *             console.error("Unknown drawer event.");
 *     }
 * }
 * ```
 * 
 * In this example, the `handleDrawerEvent` function takes an event 
 * of type `IDrawerEvent` and logs a message based on the event type. 
 * This demonstrates how to effectively utilize the `IDrawerEvent` 
 * type in event handling scenarios.
 */
export type IDrawerEvent = "minimized" | "permanent" | "toggle" | "state_changed" | "opened" | "closed";