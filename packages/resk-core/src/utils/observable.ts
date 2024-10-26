/**
 * @interface IObservableEvent
 * Represents an observable event, which can be a string, null, or undefined.
 *
 * This type is used to define events that can be emitted or observed within a system.
 * 
 * - A string value represents a specific event identifier or name.
 * - A null value indicates that there is no event to observe or that the event is not applicable.
 * - An undefined value suggests that the event has not been initialized or is any.
 *
 * This type can be useful in scenarios where events may not always have a clear identifier,
 * allowing for flexibility in event handling and observation.
 *
 * @example
 * ```ts
 * let eventName: IObservableEvent;
 * 
 * eventName = "dataLoaded"; // valid
 * eventName = null;         // valid
 * eventName = undefined;    // valid
 * eventName = 42;          // TypeScript error: Type 'number' is not assignable to type 'IObservableEvent'.
 * ```
 */
export type IObservableEvent = string | null | undefined;

/**
 * @interface IObservableCallbackOptions
 * Represents the callback options for observable events.
 * 
 * This type defines a function that can be used as a callback for observable events.
 * It accepts a variable number of arguments of any type and returns a value of any type.
 * 
 * Callbacks of this type can be utilized in various event-driven scenarios, allowing 
 * flexibility in the number and types of parameters passed to the callback.
 * 
 * @example
 * ```typescript
 * const callback: IObservableCallbackOptions = (arg1: string, arg2: number) => {
 *   console.log(arg1, arg2); // Outputs the string and number passed to the callback
 * };
 * 
 * // Invoking the callback with different types of arguments
 * callback("Event triggered", 42); // Outputs: Event triggered 42
 * callback("Another event", 100);   // Outputs: Another event 100
 * ```
 */
export type IObservableCallbackOptions = (...args: any[]) => any;



/**
 * Represents the base interface for an observable object.
 * 
 * The `IObservableBase` type defines the structure of an observable object, which can 
 * manage event listeners, trigger events, and provide callback functionalities. 
 * This interface includes methods to add, remove, and trigger event callbacks, 
 * as well as to manage event subscriptions.
 * 
 * @property {boolean} [_____isObservable] - An optional property that indicates whether the object is observable.
 * 
 * @method on - Registers an event listener for a specific event.
 * @param {IObservableEvent} event - The event to listen for.
 * @param {IObservableCallbackOptions} fn - The callback function to execute when the event is triggered.
 * @returns {{ remove: () => any }} An object containing a `remove` method to unregister the listener.
 * 
 * @method finally - Registers an event listener that will be invoked once the event is triggered.
 * @param {IObservableEvent} event - The event to listen for.
 * @param {IObservableCallbackOptions} fn - The callback function to execute when the event is triggered.
 * @returns {IObservable} The observable instance.
 * 
 * @method off - Unregisters an event listener for a specific event.
 * @param {IObservableEvent} event - The event to stop listening for.
 * @param {IObservableCallbackOptions} fn - The callback function to remove.
 * @returns {IObservable} The observable instance.
 * 
 * @method trigger - Triggers an event, invoking all registered listeners for that event.
 * @param {IObservableEvent} event - The event to trigger.
 * @param {...any[]} args - Additional arguments to pass to the callback functions.
 * @returns {IObservable} The observable instance.
 * 
 * @method offAll - Unregisters all event listeners from the observable.
 * @returns {IObservable} The observable instance.
 * 
 * @method one - Registers a one-time event listener for a specific event.
 * @param {string} event - The event to listen for.
 * @param {IObservableCallbackOptions} fn - The callback function to execute when the event is triggered.
 * @returns {{ remove: () => any }} An object containing a `remove` method to unregister the listener.
 * 
 * @method getEventCallBacks - Retrieves all registered callbacks for each event.
 * @returns {{ [key: string]: IObservableCallbackOptions[] }} An object mapping event names to their respective callback functions.
 * 
 * Example:
 * ```typescript
 * interface MyObservable extends IObservableBase {
 *   foo: string;
 * }
 *  * const observable: MyObservable = {
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
export type IObservableBase = {
  _____isObservable?: boolean;
  on: (event: IObservableEvent, fn: IObservableCallbackOptions) => { remove: () => any };
  finally: (event: IObservableEvent, fn: IObservableCallbackOptions) => IObservable;
  off: (event: IObservableEvent, fn: IObservableCallbackOptions) => IObservable;
  trigger: (event: IObservableEvent, ...args: any[]) => IObservable;
  offAll: () => IObservable;
  one: (event: string, fn: IObservableCallbackOptions) => { remove: () => any };
  getEventCallBacks: () => { [key: string]: IObservableCallbackOptions[] };
}


/**
 * @interface IObservable
 * Represents a generic observable interface that extends the base observable functionality.
 * 
 * The `IObservable` type allows for the creation of observable objects that can include
 * additional properties and methods beyond those defined in the `IObservableBase`.
 * It uses TypeScript's generics to enable developers to specify custom types for the 
 * observable's additional properties while retaining the core event management capabilities.
 * 
 * The `Omit` utility type is used to exclude properties defined in the generic type `T`
 * from the base `IObservableBase`, allowing for a clean extension of the observable's 
 * functionality without conflicts.
 * 
 * @template T - An optional generic type parameter that allows for additional properties 
 *                or methods to be defined on the observable.
 * 
 * @example
 * ```typescript
 * interface MyObservableProps {
 *   customProperty: string;
 *   anotherMethod: (arg: number) => void;
 * }
 * 
 * const myObservable: IObservable<MyObservableProps> = {
 *   _____isObservable: true,
 *   on(event, fn) {
 *     // implementation
 *     return { remove: () => {} };
 *   },
 *   finally(event, fn) {
 *     // implementation
 *     return this;
 *   },
 *   off(event, fn) {
 *     // implementation
 *     return this;
 *   },
 *   trigger(event, ...args) {
 *     // implementation
 *     return this;
 *   },
 *   offAll() {
 *     // implementation
 *     return this;
 *   },
 *   one(event, fn) {
 *     // implementation
 *     return { remove: () => {} };
 *   },
 *   getEventCallBacks() {
 *     // implementation
 *     return {};
 *   },
 *   customProperty: "Hello",
 *   anotherMethod(arg) {
 *     console.log(arg);
 *   },
 * };
 * ```
 */
export type IObservable<T = any> = Omit<IObservableBase, keyof T> & T;

/**
 * Returns an instance of the IObservable interface.
 * The `observableFactory` function creates a new observable object with methods to manage
 * event listeners and trigger events. The returned observable object allows for adding,
 * removing, and triggering event callbacks, as well as managing final callbacks that execute 
 * after all other callbacks for an event.
 * 
 * @returns {IObservable} A new instance of the observable object.
 * 
 * @example
 * ```typescript
 * const observable = observableFactory();
 * observable.on("event", (arg1, arg2) => {
 *   console.log(arg1, arg2);
 * });
 * observable.trigger("event", "Hello", "World"); // Outputs: Hello World
 * observable.on("event",function(){
 *  console.log("event triggered");
 * })
 * ```
 */
export const observableFactory = function (): IObservable {
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
     * const observable = observableFactory();
     * observable.on("event", (arg1, arg2) => {
     *   console.log(arg1, arg2);
     * });
     * observable.trigger("event", "arg1", "arg2", (results, args) => {
     *   console.log(results, args);
     * });
     * ```
     * \nExample with multiple callbacks:
     * ```typescript
     * const observable = observableFactory();
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
     * const observable = observableFactory();
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
     * const observable = observableFactory();
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
     * const observable = observableFactory();
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
 * Creates an observable object based on the provided element.
 * 
 * The `observable` function checks if the given element is already observable. If it is, 
 * the function returns the existing observable instance. If not, it creates a new observable 
 * instance and extends the provided element with observable methods. This allows the element 
 * to listen for events, trigger callbacks, and manage event listeners.
 * 
 * @param {any} element - The element to make observable. This can be any object or value.
 * @returns {IObservable} The observable object, which includes methods for event handling.
 * 
 * @example
 * ```typescript
 * import observable from "@resk/core";
 * const context = observable({});
 * const testCb = (e) => console.log("test");
 * context.on("test", testCb);
 * context.trigger("test");
 * context.off("test", testCb);
 * context.offAll();
 * ```
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
   * Create a new observable instance using the observableFactory function.
   */
  const obj = observableFactory();

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
 * Exports the ObservableClass that implements the IObservable interface.
 * 
 * This class provides a way to create observable objects that can emit events and have 
 * listeners attached to them. It encapsulates the observable functionality, allowing 
 * users to manage events and their corresponding callbacks in a structured manner.
 * 
 * The ObservableClass is particularly useful in scenarios where you need to implement 
 * an event-driven architecture, enabling decoupled communication between different parts 
 * of an application.
 */
export class ObservableClass implements IObservable {
  /**
   * Flag indicating whether the object is observable.
   * 
   * This property is used internally to identify instances of observable objects.
   * It is set to true for all instances of this class.
   */
  readonly _____isObservable?: boolean | undefined = true;

  /**
   * The internal observable object that provides the observable functionality.
   * 
   * This object is created using the observableFactory function and contains 
   * the core methods for managing event listeners and triggering events.
   */
  readonly _observable = observableFactory();

  /**
   * Listen to the given `event` and execute the `callback` each time an event is triggered.
   * 
   * @param {IObservableEvent} event - The event to listen to.
   * @param {IObservableCallbackOptions} fn - The callback function to execute.
   * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
   * 
   * @example
   * ```typescript
   * const observable = new ObservableClass();
   * const subscription = observable.on("dataReceived", (data) => {
   *   console.log("Data received:", data);
   * });
   * ```
   */
  on(event: IObservableEvent, fn: IObservableCallbackOptions): { remove: () => any } {
    return this._observable.on.call(this, event, fn);
  }

  /**
   * Add a callback function to an event that will be triggered once.
   * 
   * This method ensures that the callback is executed only the first time the event is triggered.
   * 
   * @param {IObservableEvent} event - The event to listen to.
   * @param {IObservableCallbackOptions} fn - The callback function to execute.
   * @returns {IObservable} The observable object.
   * 
   * @example
   * ```typescript
   * observable.finally("dataProcessed", () => {
   *   console.log("Data has been processed.");
   * });
   * ```
   */
  finally(event: IObservableEvent, fn: IObservableCallbackOptions): IObservable {
    return this._observable.finally.call(this, event, fn);
  }

  /**
   * Removes the given `event` listener.
   * 
   * If `fn` is provided, this method removes the specific callback function from the event.
   * If `fn` is not provided, it removes all callback functions associated with the event.
   * 
   * @param {IObservableEvent} event - The event to remove the listener from.
   * @param {IObservableCallbackOptions} [fn] - The callback function to remove.
   * @returns {IObservable} The observable object.
   * 
   * @example
   * ```typescript
   * observable.off("dataReceived", subscription.remove);
   * ```
   */
  off(event: IObservableEvent, fn?: IObservableCallbackOptions): IObservable {
    return this._observable.off.call(this, event, fn);
  }

  /**
   * Execute all callback functions that listen to the given `event`.
   * 
   * If the last argument is a function, it will be treated as the final callback function 
   * to be executed after all other callbacks.
   * 
   * @param {IObservableEvent} event - The event to trigger.
   * @param {...any[]} args - The arguments to pass to the callback functions.
   * @returns {IObservable} The observable object.
   * 
   * @example
   * ```typescript
   * observable.trigger("dataReceived", { id: 1, value: "Hello" });
   * ```
   */
  trigger(event: IObservableEvent, ...args: any[]): IObservable {
    return this._observable.trigger.call(this, event, ...args);
  }

  /**
   * Remove all event bindings.
   * 
   * This method clears all event listeners for the observable object.
   * 
   * @returns {IObservable} The observable object.
   * 
   * @example
   * ```typescript
   * observable.offAll();
   * ```
   */
  offAll(): IObservable {
    return this._observable.offAll.call(this);
  }

  /**
   * Listen to the given `event` and execute the `callback` at most once.
   * 
   * This method ensures that the callback is executed only once, even if the event is triggered multiple times.
   * 
   * @param {string} event - The event to listen to.
   * @param {IObservableCallbackOptions} fn - The callback function to execute.
   * @returns {{ remove: () => any }} An object with a `remove` method to remove the callback.
   * 
   * @example
   * ```typescript
   * const subscription = observable.one("dataLoaded", () => {
   *   console.log("Data has been loaded.");
   * });
   * ```
   */
  one(event: string, fn: IObservableCallbackOptions): { remove: () => any } {
    return this._observable.one.call(this, event, fn);
  }

  /**
   * Get all event callbacks.
   * 
   * This method returns an object with event names as keys and arrays of callback functions as values.
   * 
   * @returns {{ [key: string]: IObservableCallbackOptions[] }} An object with event names as keys and arrays of callback functions as values.
   * 
   * @example
   * ```typescript
   * const callbacks = observable.getEventCallBacks();
   * console.log(callbacks);
   * ```
   */
  getEventCallBacks(): { [key: string]: IObservableCallbackOptions[] } {
    return this._observable.getEventCallBacks.call(this);
  }
}

/**
 * Checks if the given object is an observable element.
 * 
 * An object is considered observable if it implements the IObservable interface and has 
 * the following properties and methods:
 * - `_____isObservable` set to `true`
 * - `on` method
 * - `trigger` method
 * - `off` method
 * 
 * @param {any} obj - The object to check.
 * @returns {boolean} `true` if the object is observable, `false` otherwise.
 * 
 * @example
 * ```typescript
 * const observable = new ObservableClass();
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