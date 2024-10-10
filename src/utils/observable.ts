import { IDict, IMerge } from "@types";
import { isObj } from "./object";

/**
 * Represents an observable event, which can be a string, null, or undefined.
 */
export type IObservableEvent = string | null | undefined;

/**
 * Represents the callback options for observable events.
 * 
 * This type defines a function that takes a variable number of arguments of any type and returns any type.
 * 
 * Example:
 * ```typescript
 * const callback: IObservableCallbackOptions = (arg1: string, arg2: number) => {
 *   console.log(arg1, arg2);
 * };
 * ```
 */
export type IObservableCallbackOptions = (...args: any[]) => any;

/**
 * Represents the interface for an observable object.
 * 
 * This type is a merge of two interfaces: one with the observable methods and another with the type T.
 * 
 * The `_____isObservable` property is optional and indicates whether the object is observable.
 * 
 * The `on` method adds a callback function to an event.
 * 
 * The `finally` method adds a callback function to an event that will be triggered once.
 * 
 * The `off` method removes a callback function from an event.
 * 
 * The `trigger` method triggers an event with the provided arguments.
 * 
 * The `offAll` method removes all callback functions from all events.
 * 
 * The `one` method adds a callback function to an event that will be triggered once.
 * 
 * The `getEventCallBacks` method returns a list of callback functions registered to the observable interface.
 * 
 * Example:
 * ```typescript
 * interface MyObservable extends IObservable<string> {
 *   foo: string;
 * }
 * 
 * const observable: MyObservable = {
 *   foo: 'bar',
 *   on(event: IObservableEvent, fn: IObservableCallbackOptions) {
 *     // implementation
 *   },
 *   finally(event: IObservableEvent, fn: IObservableCallbackOptions) {
 *     // implementation
 *   },
 *   off(event: IObservableEvent, fn: IObservableCallbackOptions) {
 *     // implementation
 *   },
 *   trigger(event: IObservableEvent, ...args: any[]) {
 *     // implementation
 *   },
 *   offAll() {
 *     // implementation
 *   },
 *   one(event: string, fn: IObservableCallbackOptions) {
 *     // implementation
 *   },
 *   getEventCallBacks() {
 *     // implementation
 *   }
 * };
 * ```
 */
export type IObservable<T extends unknown = unknown> = IMerge<{
  _____isObservable?: boolean;
  on: (event: IObservableEvent, fn: IObservableCallbackOptions) => { remove: () => any };
  finally: (event: IObservableEvent, fn: IObservableCallbackOptions) => IObservable;
  off: (event: IObservableEvent, fn: IObservableCallbackOptions) => IObservable;
  trigger: (event: IObservableEvent, ...args: any[]) => IObservable;
  offAll: () => IObservable;
  one: (event: string, fn: IObservableCallbackOptions) => { remove: () => any };
  getEventCallBacks: () => { [key: string]: IObservableCallbackOptions[] };
}, T>;

/**
 * Returns an instance of the IObservable interface.
 * 
 * This factory function creates a new observable object with the specified methods.
 * 
 * Example:
 * ```typescript
 * const observable = factory();
 * ```
 */
export const factory = function (): IObservable {
  /**
   * Private variables
   */
  let callbacks: { [key: string]: IObservableCallbackOptions[] } = {},
    finallyCallback: { [key: string]: IObservableCallbackOptions[] } = {},
    slice = Array.prototype.slice;

  return {
    /**
     * Listen to the given `event` and execute the `callback` each time an event is triggered.
     * 
     * @param {IObservableEvent} event - The event to listen to.
     * @param {IObservableCallbackOptions} fn - The callback function to execute.
     * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
     */
    on: function (event: IObservableEvent, fn: IObservableCallbackOptions): { remove: () => any } {
      if (fn && event) {
        (callbacks[event] = callbacks[event] || []).push(fn);
      }
      return {
        remove: () => {
          this.off(event, fn);
        },
      };
    },
     /**
     * Add a finally callback function to an event that will be triggered. this callback is called  after all other callbacks have been called.
     * 
     * @param {IObservableEvent} event - The event to listen to.
     * @param {IObservableCallbackOptions} fn - The callback function to execute.
     * @returns {IObservable} The observable object.
     */
     finally: function (event: IObservableEvent, fn: IObservableCallbackOptions): IObservable {
      if (fn && event) {
        (finallyCallback[event] = finallyCallback[event] || []).push(fn);
        return this;
      }
      return this;
    },
    /**
     * Removes the given `event` listener.
     * 
     * If `fn` is provided, removes the specific callback function from the event.
     * If `fn` is not provided, removes all callback functions from the event.
     * 
     * @param {IObservableEvent} event - The event to remove the listener from.
     * @param {IObservableCallbackOptions} [fn] - The callback function to remove.
     * @returns {IObservable} The observable object.
     */
    off: function (event: IObservableEvent, fn: IObservableCallbackOptions): IObservable {
      if (!event) return this;
      if (event == "*" && !fn) callbacks = {};
      else {
        if (fn) {
          var arr = callbacks[event];
          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
            if (cb == fn) {
              arr.splice(i--, 1);
            }
          }
        } else {
          console.warn("observable, call off on event " + event + " with invalid function " + fn);
          //else delete callbacks[event], le bug qui supprime le callback des évènemenmts lorsque fn est à undefined
        }
      }
      return this;
    },

    /**
     * Listen to the given `event` and execute the `callback` at most once.
     * 
     * @param {string} event - The event to listen to.
     * @param {IObservableCallbackOptions} fn - The callback function to execute.
     * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
     */
    one: function (event: string, fn: IObservableCallbackOptions) {
      const on = (...args: any[]) => {
        this.off(event, on);
        fn.apply(this, args);
      };
      return this.on(event, on);
    },
    /**
     * Execute all callback functions that listen to
     * the given `event`. if the last argument is function then il will be considered as the
     * final callback function to be execute after alls callbacks'execution (
     * \nExample : 
     * ```ts
     *  obj.trigger(even,arg1,arg2,...argN,function(){});
     *  // The execution callback takes the result of the execution of all triggers as a parameter
     * and all arguments passed as parameters to all triggers.
     * If this parameter has no arguments, then no trigger has been found in the observable.
     * ```
     * \nExample:
     * ```typescript
     * const observable = factory();
     * observable.on("event", (arg1, arg2) => {
     *   console.log(arg1, arg2);
     * });
     * observable.trigger("event", "arg1", "arg2", (results, args) => {
     *   console.log(results, args);
     * });
     * ```
     * \nExample with multiple callbacks:
     * ```typescript
     * const observable = factory();
     * observable.on("event", (arg1, arg2) => {
     *   console.log("Callback 1:", arg1, arg2);
     * });
     * observable.on("event", (arg1, arg2) => {
     *   console.log("Callback 2:", arg1, arg2);
     * });
     * observable.trigger("event", "arg1", "arg2", (results, args) => {
     *   console.log("Final callback:", results, args);
     * });
     * ```
     * \nExample with wildcard event:
     * ```typescript
     * const observable = factory();
     * observable.on("*", (arg1, arg2) => {
     *   console.log("Wildcard callback:", arg1, arg2);
     * });
     * observable.trigger("event", "arg1", "arg2");
     * ```
     * @param {IObservableEvent} event - The event to trigger.
     * @param {...any[]} args - The arguments to pass to the callback functions.
     * @returns {IObservable} The observable object.
     */
    trigger: function (event: IObservableEvent, ...args: any[]): IObservable {
      if (!event) return this;
      // getting the arguments
      let fns, fn, i;
      let finaly = null;
      if (typeof args[args.length - 1] == "function") {
        finaly = args.pop();
      }
      fns = slice.call(callbacks[event] || [], 0);
      let fnsReturns = [];
      for (i = 0; (fn = fns[i]); ++i) {
        if (typeof fn === "function") {
          fnsReturns.push(fn.apply(this, args));
        }
      }
      if (callbacks["*"] && event != "*") {
        this.trigger(event, ...args);
        this.trigger("*", ...args);
      }
      //finaly events callback
      var finalCals = slice.call(finallyCallback[event] || [], 0);
      // le premier paramètres, représente un tableau des différents résultats retournés par les écouteurs de l'évènemet
      // Le deuxième paramètre est le tableau contenant toute la liste de tous les arguments qui ont été passés à la fonction trigger
      for (i = 0; (fn = finalCals[i]); ++i) {
        fn.call(this, fnsReturns, args);
      }
      //le callback de fin d'exécution de l'évènement trigger, prend en paramètres:
      // le premier paramètres, représente un tableau des différents résultats retournés par les écouteurs de l'évènemet
      // Le deuxième paramètre est le tableau contenant toute la liste de tous les arguments qui ont été passés à la fonction trigger
      if (finaly) {
        finaly.call(this, fnsReturns, args);
      }
      return this;
    },
  /**
   * Remove all event bindings.
   * 
   * This method removes all callback functions from all events.
   * 
   * @returns {IObservable} The observable object.
   * 
   * Example:
   * ```typescript
   * const observable = factory();
   * observable.on("event", () => {
   *   console.log("Callback");
   * });
   * observable.offAll();
   * observable.trigger("event"); // No callback will be executed
   * ```
   */
  offAll: function (): IObservable {
    callbacks = {};
    finallyCallback = {};
    return this;
  },
  
  /**
   * Get all event callbacks.
   * 
   * This method returns an object containing all callback functions for all events.
   * 
   * @returns {{ [key: string]: IObservableCallbackOptions[] }} An object with event names as keys and arrays of callback functions as values.
   * 
   * Example:
   * ```typescript
   * const observable = factory();
   * observable.on("event", () => {
   *   console.log("Callback");
   * });
   * const callbacks = observable.getEventCallBacks();
   * console.log(callbacks); // { event: [ [Function] ] }
   * ```
   */
  getEventCallBacks: function (): { [key: string]: IObservableCallbackOptions[] } {
    return callbacks;
  },
  };
};
/**
 * Observable event manager.
 * 
 * Usage:
 * ```typescript
 * import observable from "@reskit-core/observable";
 * const context = observable({});
 * const testCb = (e) => console.log("test");
 * context.on("test", testCb);
 * context.trigger("test");
 * context.off("test", testCb);
 * ```
 * 
 * @param {any} element - The object to make observable.
 * @returns {IObservable} The observable object.
 */
export const observable = function (element: any): IObservable {
  /**
   * Check if the element is already observable.
   * 
   * If the element is already observable, return it immediately.
   */
  if (isObservable(element)) return element; ///avoid redefine observable

  /**
   * Create a new observable object.
   */
  const context = element || {};

  /**
   * Create a new observable instance using the factory function.
   */
  const obj = factory();

  /**
   * Extend the context object with the observable methods.
   */
  Object.defineProperties(context, {
    /**
     * Flag indicating whether the object is observable.
     */
    _____isObservable: { value: true },

    /**
     * Listen to the given `event` and execute the `callback` each time an event is triggered.
     * 
     * @param {IObservableEvent} event - The event to listen to.
     * @param {IObservableCallbackOptions} fn - The callback function to execute.
     * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
     */
    on: {
      value: obj.on.bind(context),
    },

    /**
     * Add a callback function to an event that will be triggered once.
     * 
     * @param {IObservableEvent} event - The event to listen to.
     * @param {IObservableCallbackOptions} fn - The callback function to execute.
     * @returns {IObservable} The observable object.
     */
    finally: {
      value: obj.finally.bind(context),
    },

    /**
     * Removes the given `event` listener.
     * 
     * If `fn` is provided, removes the specific callback function from the event.
     * If `fn` is not provided, removes all callback functions from the event.
     * 
     * @param {IObservableEvent} event - The event to remove the listener from.
     * @param {IObservableCallbackOptions} [fn] - The callback function to remove.
     * @returns {IObservable} The observable object.
     */
    off: {
      value: obj.off.bind(context),
    },

    /**
     * Remove all event bindings.
     * 
     * @returns {IObservable} The observable object.
     */
    offAll: {
      value: obj.offAll.bind(context),
    },

    /**
     * Listen to the given `event` and execute the `callback` at most once.
     * 
     * @param {string} event - The event to listen to.
     * @param {IObservableCallbackOptions} fn - The callback function to execute.
     * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
     */
    one: {
      value: obj.one.bind(context),
    },

    /**
     * Get all event callbacks.
     * 
     * @returns {{ [key: string]: IObservableCallbackOptions[] }} An object with event names as keys and arrays of callback functions as values.
     */
    getEventCallBacks: {
      value: obj.getEventCallBacks.bind(context),
    },

    /**
     * Execute all callback functions that listen to the given `event`.
     * 
     * If the last argument is a function, it will be considered as the final callback function to be executed after all callbacks' execution.
     * 
     * @param {IObservableEvent} event - The event to trigger.
     * @param {...any[]} args - The arguments to pass to the callback functions.
     * @returns {IObservable} The observable object.
     */
    trigger: {
      value: obj.trigger.bind(context),
    },
  });
  return context;
};

/**
 * Exports the Observable class that implements the IObservable interface.
 * 
 * This class provides a way to create observable objects that can emit events and have listeners attached to them.
 */
export class Observable implements IObservable {
  /**
   * Flag indicating whether the object is observable.
   */
  readonly _____isObservable?: boolean | undefined = true;

  /**
   * The internal observable object that provides the observable functionality.
   */
  readonly _observable = factory();

  /**
   * Listen to the given `event` and execute the `callback` each time an event is triggered.
   * 
   * @param {IObservableEvent} event - The event to listen to.
   * @param {IObservableCallbackOptions} fn - The callback function to execute.
   * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
   */
  on(event: IObservableEvent, fn: IObservableCallbackOptions): { remove: () => any } {
    return this._observable.on.call(this, event, fn);
  }

  /**
   * Add a callback function to an event that will be triggered once.
   * 
   * @param {IObservableEvent} event - The event to listen to.
   * @param {IObservableCallbackOptions} fn - The callback function to execute.
   * @returns {IObservable} The observable object.
   */
  finally(event: IObservableEvent, fn: IObservableCallbackOptions): IObservable {
    return this._observable.finally.call(this, event, fn);
  }

  /**
   * Removes the given `event` listener.
   * 
   * If `fn` is provided, removes the specific callback function from the event.
   * If `fn` is not provided, removes all callback functions from the event.
   * 
   * @param {IObservableEvent} event - The event to remove the listener from.
   * @param {IObservableCallbackOptions} [fn] - The callback function to remove.
   * @returns {IObservable} The observable object.
   */
  off(event: IObservableEvent, fn: IObservableCallbackOptions): IObservable {
    return this._observable.off.call(this, event, fn);
  }

  /**
   * Execute all callback functions that listen to the given `event`.
   * 
   * If the last argument is a function, it will be considered as the final callback function to be executed after all callbacks' execution.
   * 
   * @param {IObservableEvent} event - The event to trigger.
   * @param {...any[]} args - The arguments to pass to the callback functions.
   * @returns {IObservable} The observable object.
   */
  trigger(event: IObservableEvent, ...args: any[]): IObservable {
    return this._observable.trigger.call(this, event, ...args);
  }

  /**
   * Remove all event bindings.
   * 
   * @returns {IObservable} The observable object.
   */
  offAll(): IObservable {
    return this._observable.offAll.call(this);
  }

  /**
   * Listen to the given `event` and execute the `callback` at most once.
   * 
   * @param {string} event - The event to listen to.
   * @param {IObservableCallbackOptions} fn - The callback function to execute.
   * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
   */
  one(event: string, fn: IObservableCallbackOptions): { remove: () => any } {
    return this._observable.one.call(this, event, fn);
  }

  /**
   * Get all event callbacks.
   * 
   * @returns {{ [key: string]: IObservableCallbackOptions[] }} An object with event names as keys and arrays of callback functions as values.
   */
  getEventCallBacks(): { [key: string]: IObservableCallbackOptions[] } {
    return this._observable.getEventCallBacks.call(this);
  }
}

/**
 * Checks if the given object is an observable element.
 * 
 * An object is considered observable if it implement IObservable interface and has the following properties and methods:
 * - `_____isObservable` set to `true`
 * - `on` method
 * - `trigger` method
 * - `off` method
 * 
 * @param {any} obj - The object to check.
 * @returns {boolean} `true` if the object is observable, `false` otherwise.
 * 
 * Example:
 * ```typescript
 * const observable = factory();
 * console.log(isObservable(observable)); // true
 * 
 * const nonObservable = {};
 * console.log(isObservable(nonObservable)); // false
 * ```
 */
export function isObservable(obj: any): boolean {
  /**
   * Check if the object is null or undefined, or if it's a primitive type (string, boolean, number).
   * If so, return false immediately.
   */
  if (!obj || ["string", "boolean", "number"].includes(typeof obj)) return false;
  try {
    /**
     * Check if the object has the required properties and methods.
     * If any of these checks fail, the object is not observable.
     */
    return obj?._____isObservable === true && typeof obj?.on === "function" && typeof obj?.trigger === "function" && typeof obj?.off === "function";
  } catch (e) {
    /**
     * If an error occurs during the checks, return false.
     */
  }
  return false;
}

export default observable;