import { TextInputKeyPressEventData } from "react-native";
import { View as RNView, NativeSyntheticEvent } from "react-native";
import { IKeyboardEventHandlerKey } from "./keyEvents";
import { ReactNode } from "react";
import { IHtmlDivProps } from "@html/types";


/**
 * Props for the `KeyboardEventHandler` component.
 *
 * @template T - The type of the keyboard event data. Defaults to `TextInputKeyPressEventData`.
 *
 * @remarks
 * This interface extends `IHtmlDivProps` except for the `children` and `ref` properties.
 *
 * @property handleKeys - An array of keys to handle for keyboard events.
 * @property handleEventType - The type of keyboard event to handle (`keydown`, `keyup`, or `keypress`).
 * @property handleFocusableElements - Indicates if focusable elements should be handled.
 * @property onKeyEvent - Function called when a matching key event is detected.
 * @property isExclusive - Indicates if the handler is exclusive.
 * @property children - Children elements or a function that returns children based on event options.
 * @property innerRef - Reference to the child view component.
 * @property readOnly - Indicates if the component is read-only.
 * @property disabled - Indicates if keyboard event handling is disabled.
 * @property isFilter - Indicates if the component is a filter type.
 */
export interface IKeyboardEventHandlerProps<T = TextInputKeyPressEventData> extends Omit<IHtmlDivProps, 'children' | "ref"> {
    /** 
     * An array of keys to handle for keyboard events.
     */
    handleKeys?: IKeyboardEventHandlerKey[],

    /** 
     * The type of keyboard event to handle (keydown, keyup, keypress).
     */
    handleEventType?: 'keydown' | 'keyup' | 'keypress',

    /** 
     * Indicates if focusable elements should be handled.
     */
    handleFocusableElements?: boolean;

    /** 
     * Function called when a matching key event is detected.
     */
    onKeyEvent?: (matchKey: IKeyboardEventHandlerKey, event: IKeyboardEventHandlerEvent<T>) => any;

    /** 
     * Indicates if the handler is exclusive.
     */
    isExclusive?: boolean,

    /** 
     * Children elements or a function that returns children based on event options.
     */
    children?: ReactNode | ((options: { onKeyPress?: (event: IKeyboardEventHandlerEvent<T>) => any }) => ReactNode);

    /** 
     * Reference to the child view component.
     */
    innerRef?: React.RefObject<RNView | null>,

    /** 
     * Indicates if the component is read-only.
     */
    readOnly?: boolean;

    /** 
     * Indicates if keyboard event handling is disabled.
     */
    disabled?: boolean;

    /** 
     * Indicates if the component is a filter type.
     */
    isFilter?: boolean;
}

/**
 * @interface IKeyboardEventHandlerKey
 * 
 * The event type related to the KeyboardEventHandler component.
 */
export type IKeyboardEventHandlerEvent<T = TextInputKeyPressEventData> = NativeSyntheticEvent<T>;




/**
 * Represents the state for the `KeyboardEventHandler` component.
 * 
 * This interface is currently empty but can be extended in the future to include
 * properties that represent the internal state of the `KeyboardEventHandler`.
 * 
 * For example, you might want to track whether a key is currently pressed,
 * or maintain a history of key events for debugging purposes.
 * 
 * @example
 * ```typescript
 * interface IKeyboardEventHandlerState {
 *     isKeyPressed: boolean; // Indicates if a specific key is currently pressed
 *     lastKeyPressed: string; // Stores the last key that was pressed
 * }
 * ```
 * 
 * By extending this interface, you can manage the component's state more effectively
 * and provide additional functionality based on user interactions with the keyboard.
 */
export interface IKeyboardEventHandlerState { }
