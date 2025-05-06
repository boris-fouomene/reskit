import { IKeyboardEventHandlerKey, findMatchedKey } from './keyEvents';
import {View} from "@components/View";
import { StyleSheet, View as RNView, TextInputKeyPressEventData } from "react-native";
import { mergeRefs } from "@utils/mergeRefs";
import { IKeyboardEventHandlerEvent, IKeyboardEventHandlerProps, IKeyboardEventHandlerState } from "./types";
import { Component, createRef, isValidElement, RefObject } from 'react';


/**
 * A React Native implementation of a keyboard event handler.
 * 
 * This component listens for keyboard events and allows you to define specific keys to handle.
 * It can be used to create custom keyboard interactions in your application.
 * 
 * @see https://github.com/linsight/react-keyboard-event-handler for documentation.
 */
export default class KeyboardEventHandler<T = TextInputKeyPressEventData> extends Component<IKeyboardEventHandlerProps<T>, IKeyboardEventHandlerState> {
  readonly childRef: RefObject<RNView | null> = createRef();
  /**
  * Finds the matched key from a keyboard event based on the provided keys.
  * 
  * This function takes a keyboard event and an array of keys, and checks if any of the keys
  * match the event. It also supports key aliases and can return a special value if 'all' is included
  * in the keys array.
  * 
  * @param event - The keyboard event to check against the provided keys. 
  *                This can be any event object that contains key information.
  *                Example: 
  *                ```typescript
  *                const event = { key: 'Enter', type: 'keydown' };
  *                ```
  * @param keys - An array of keys to match against the event. 
  *               This can include base keys, modifier keys, or aliases.
  *               Example: 
  *               ```typescript
  *               const keys = ['enter', 'space', 'ctrl+a', 'all'];
  *               ```
  * 
  * @returns The matched key as an `IKeyboardEventHandlerKey`. 
  *          If no key matches and 'all' is included in the keys, it returns 'other'.
  *          If no match is found, it returns `undefined`.
  * 
  * @example
  * ```typescript
  * const event = { key: 'Enter', type: 'keydown' };
  * const keys = ['enter', 'space', 'ctrl+a'];
  * const matchedKey = findMatchedKey(event, keys);
  * console.log(matchedKey); // Output: 'enter'
  * ```
  * 
  * @example
  * ```typescript
  * const event = { key: 'Escape', type: 'keydown' };
  * const keys = ['all'];
  * const matchedKey = findMatchedKey(event, keys);
  * console.log(matchedKey); // Output: 'other'
  * ```
  */
  static findMatchedKey = findMatchedKey;
  /** 
   * An array of exclusive handlers that are currently registered.
   */
  static exclusiveHandlers: KeyboardEventHandler<any>[] = [];

  /** 
   * Default properties for the KeyboardEventHandler component.
   */
  static defaultProps: IKeyboardEventHandlerProps = {
    handleKeys: [],
    handleFocusableElements: false,
    //handleEventType: 'keypress',
    handleEventType: undefined,
    onKeyEvent: () => null,
  }
  /**
   * Creates an instance of KeyboardEventHandler.
   * 
   * @param props - The properties for the component, including key handling options.
   */
  constructor(props: IKeyboardEventHandlerProps<T>) {
    super(props);
    this.registerExclusiveHandler = this.registerExclusiveHandler.bind(this);
    this.deregisterExclusiveHandler = this.deregisterExclusiveHandler.bind(this);

  }
  /**
  * Checks if the component is a filter.
  * 
  * @returns A boolean indicating whether the component is a filter.
  */
  isFilter() {
    return this.props.isFilter;
  }
  /**
   * Lifecycle method that is called after the component updates.
   * 
   * @param prevProps - The previous properties of the component.
   * @param prevState - The previous state of the component.
   * @param snapshot - A snapshot of the component's state before the update.
   */
  componentDidUpdate(prevProps: Readonly<IKeyboardEventHandlerProps<T>>, prevState: Readonly<IKeyboardEventHandlerState>, snapshot?: any): void {
    const { isExclusive, disabled } = prevProps;
    const hasChanged = this.props.isExclusive !== isExclusive || this.props.disabled !== disabled;
    if (hasChanged) {
      if (this.props.isExclusive && !this.props.disabled) {
        this.registerExclusiveHandler();
      } else {
        this.deregisterExclusiveHandler();
      }
    }
  }
  /**
   * Registers the current handler as an exclusive handler.
   */
  registerExclusiveHandler() {
    this.deregisterExclusiveHandler();
    KeyboardEventHandler.exclusiveHandlers.unshift(this);
  }
  /**
   * Deregisters the current handler from the exclusive handlers.
   */
  deregisterExclusiveHandler() {
    if (KeyboardEventHandler.exclusiveHandlers.includes(this)) {
      KeyboardEventHandler.exclusiveHandlers = KeyboardEventHandler.exclusiveHandlers.filter(h => h !== this);
    }
  }
  /**
   * Handles keyboard events and checks if they match the specified keys.
   * 
   * @param event - The keyboard event to handle.
   * @returns A boolean indicating whether the event was handled successfully.
   */
  handleKeyboardEvent(event: IKeyboardEventHandlerEvent<T>): any {
    const {
      disabled, readOnly, handleKeys, onKeyEvent, handleEventType, children, handleFocusableElements,
    } = this.props;
    if (disabled || readOnly) {
      return false;
    }
    const isEventTypeMatched = !handleEventType ? true : handleEventType === event.type;
    if (!isEventTypeMatched) {
      return false;
    }
    const isEligibleEvent = event?.target && typeof document !== 'undefined' && document.body ? document.body : handleFocusableElements;
    const isChildrenEvent = this.childRef.current && this.childRef.current && 'contains' in this.childRef.current && typeof this.childRef.current.contains == 'function' && this.childRef.current.contains(event.target);
    const isValidSource = children ? isChildrenEvent : isEligibleEvent;
    if (!isValidSource) {
      return false;
    }
    const matchedKey = findMatchedKey(event, handleKeys as IKeyboardEventHandlerKey[]);
    if (matchedKey && onKeyEvent) {
      onKeyEvent(matchedKey, event as IKeyboardEventHandlerEvent<T>);
      return true;
    }

    return false;
  }
  /**
   * Renders the component and attaches keyboard event handlers.
   * 
   * @returns A React element representing the keyboard event handler.
   */
  render() {
    let { children, isFilter, innerRef, handleKeys, disabled, readOnly, onKeyEvent, handleEventType, handleFocusableElements, ...rest } = this.props;
    rest = Object.assign({}, rest);
    const events = disabled || readOnly || isFilter ? {} : {
      onKeyPress: this.handleKeyboardEvent.bind(this),
    }
    if (typeof children == 'function') {
      children = children(events);
    }
    if (!isValidElement(children)) return null;
    return <View {...rest} style={[styles.content, rest.style]} ref={mergeRefs(this.childRef, innerRef)}>
      {children}
    </View>
  }
}

export * from "./types";

const styles = StyleSheet.create({
  content: {
    maxWidth: '100%',
    position: 'relative'
  }
})