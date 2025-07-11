import { IAppBarProps } from "@components/AppBar/types";
import { IAuthSessionStorage } from "@resk/core/auth";
import { IDict } from "@resk/core/types";
import { IObservable } from "@resk/core/observable";
import { Animated, GestureResponderEvent, PanResponderInstance } from "react-native";
import { ReactElement } from "react";



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
 * Represents the position of the drawer component.
 * 
 * @typedef {("left" | "right" | undefined)} IDrawerPosition
 * 
 * @property {"left"} left - The drawer is positioned on the left side.
 * @property {"right"} right - The drawer is positioned on the right side.
 * @property {undefined} undefined - The drawer position is not defined.
 */
export type IDrawerPosition = "left" | "right" | undefined;

/***
 * Interface representing the context of the drawer.
 */
export interface IDrawerContext {
    drawer: IDrawer;
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