import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

/***
 * Type for a callback function that takes a value of type T.
 * @template T - The type of the value passed to the callback.
 */
export type ICallback<T> = (value: T) => any;



/***
* A custom React hook that extends the useState hook to allow
* for a callback to be executed after the state has been updated.
* 
* This hook is useful for scenarios where you need to perform
* an action after a state change, similar to setState in class components
* but in functional components using hooks.
* 
* The problem with this hook is to perform a setState and then be able to call a 
* callback function once the state has been updated.
* 
* @template T - The generic type associated with the state, defaulting to unknown.
*  @param {T | (() => T)} initialState - The initial value of the state, of type T.
* @returns {[T, (value:SetStateAction<T>, callback?: ICallback<T>) => any]} - An array containing the state 
*          and a function to update the state that accepts an optional callback. It represents the state and a setState function that accepts a callback.
* 
* ### Usage Example:
* ```typescript
* const MyComponent = () => {
*   const [count, setCount] = useStateCallback(0);
*
*   const incrementCount = () => {
*     setCount((prev) => prev + 1, (newValue) => {
*       console.log('Count updated to:', newValue);
*     });
*   };
*
*   return <button onClick={incrementCount}>Increment</button>;
* };
* ```
*/
export default function useStateCallback<T = unknown>(initialState: T | (() => T)): [T, (value: SetStateAction<T>, callback?: ICallback<T>) => any] {
  const [state, _setState] = useState(initialState);
  const callbackRef = useRef<ICallback<T> | undefined | null>(null);
  const isFirstCallbackCall = useRef<boolean>(true);
  const setState = useCallback((setStateAction: SetStateAction<T>, callback?: ICallback<T>): any => {
    callbackRef.current = callback;
    _setState(setStateAction);
  }, []);

  useEffect(() => {
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false;
      return;
    }
    if (typeof callbackRef.current === "function") {
      callbackRef.current(state as T);
    }
  }, [state]);

  return [state, setState];
}
