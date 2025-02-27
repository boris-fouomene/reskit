import { isObj } from '@resk/core';
import { ITouchableEventNames, ITouchableProps } from '../types';

/**
 * An array of touchable event names that can be used with touchable components.
 * 
 * The `touchableEvents` constant defines the standard touch events that are 
 * commonly used in touchable components. This array can be utilized to 
 * iterate over the events when setting up event handlers or performing 
 * checks to see if any touch event handlers are defined.
 * 
 * The events included in this array are:
 * - `'onPress'`: Triggered when the user taps the component.
 * - `'onLongPress'`: Triggered when the user presses and holds the component.
 * - `'onPressIn'`: Triggered when the user touches the component.
 * - `'onPressOut'`: Triggered when the user releases the touch from the component.
 * 
 * @constant
 * @type {ITouchableEventNames[]}
 * @example
 * // Example usage of touchableEvents
 * touchableEvents.forEach(event => {
 *   console.log(`Listening for event: ${event}`);
 * });
 * 
 * // Output:
 * // Listening for event: onPress
 * // Listening for event: onLongPress
 * // Listening for event: onPressIn
 * // Listening for event: onPressOut
 */
const touchableEvents: ITouchableEventNames[] = [
  'onPress',
  'onLongPress',
  'onPressIn',
  'onPressOut',
  'onTouchStart',
  'onTouchEnd',
  'onTouchCancel',
  'onTouchMove',
];
/**
 * Checks if the provided props object contains any touch event handlers.
 * 
 * This function verifies if the input object is a valid object and checks
 * if it contains any of the defined touchable event handlers. It returns
 * `true` if at least one handler is present, otherwise it returns `false`.
 * 
 * @param {ITouchableProps} props - An object that may contain touch event handlers.
 * @returns {boolean} - Returns `true` if any touch event handler is defined; otherwise, `false`.
 * 
 * @example
 * const handlers = {
 *   onPress: (event) => { console.log('Pressed!'); },
 * };
 * const hasHandlers = hasTouchHandler(handlers); // Returns true
 * 
 * const noHandlers = {};
 * const hasNoHandlers = hasTouchHandler(noHandlers); // Returns false
 * 
 * const invalidInput = null;
 * const isInvalid = hasTouchHandler(invalidInput); // Returns false
 */
export function hasTouchHandler(props: ITouchableProps) {
  if (!isObj(props)) {
    return false;
  }
  for (const event of touchableEvents) {
    if (typeof (props[event]) === 'function') {
      return true;
    }
  }
  return false;
}

/***
 * Returns the touchable props from the provided props object.
 *
 * This function takes an object containing touch event handlers and returns
 * a new object with only the handlers that are defined for the touchable events.
 * If no valid handlers are found, the function returns an empty object.
 *
 * @param {@link ITouchableProps} props - An object that may contain touch event handlers.
 * @returns {@link ITouchableProps | null} An object with the valid touch event handlers, or `null` if none are found.
 *
 * @example
 * // Example usage of getTouchableProps
 * const props = {
 *   onPress: () => console.log('Pressed!'),
 *   onLongPress: () => console.log('Long Pressed!'),
 *   // onPressIn and onPressOut are not defined
 * };
 *
 * const handlers = getTouchableProps(props);
 * console.log(handlers);
 * // Output: { onPress: [Function], onLongPress: [Function] }
 *
 * const emptyHandlers = getTouchableProps({});
 * console.log(emptyHandlers);
 */
export const getTouchableProps = (props: ITouchableProps) => {
  const r: ITouchableProps = {};
  let hasTouchableEvents = false;
  touchableEvents.forEach((event) => {
    if (typeof (props[event]) === 'function') {
      r[event] = props[event];
      hasTouchableEvents = true;
    }
  });
  return hasTouchableEvents ? r : null;
}


/**
 * Extracts touch event handlers from the provided props object.
 *
 * The `pickTouchEventHandlers` function takes an object containing potential 
 * touch event handlers and returns a new object with only the handlers 
 * that are defined for the touchable events. If no valid handlers are found, 
 * the function returns `null`.
 *
 * @param {@link ITouchableProps} props - An object that may contain touch event handlers.
 * @returns {@link ITouchableProps | null} An object with the valid touch event handlers, or `null` if none are found.
 *
 * @example
 * // Example usage of pickTouchEventHandlers
 * const props = {
 *   onPress: () => console.log('Pressed!'),
 *   onLongPress: () => console.log('Long Pressed!'),
 *   // onPressIn and onPressOut are not defined
 * };
 *
 * const handlers = pickTouchEventHandlers(props);
 * console.log(handlers); 
 * // Output: { onPress: [Function], onLongPress: [Function] }
 *
 * const emptyHandlers = pickTouchEventHandlers({});
 * console.log(emptyHandlers); 
 * // Output: null
 */
export function pickTouchEventHandlers(props: ITouchableProps): ITouchableProps | null {
  if (!isObj(props)) {
    return null;
  }
  const r: ITouchableProps = {};
  let hasEvent = false;
  touchableEvents.forEach((event) => {
    if (typeof (props[event]) === 'function') {
      hasEvent = true;
      r[event] = props[event];
    }
  });
  return hasEvent ? r : null;
}
