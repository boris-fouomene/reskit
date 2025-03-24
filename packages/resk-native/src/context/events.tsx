import { IObservable, observable } from "@resk/core/observable";

/**
 * Represents the types of events that can be emitted within the Resk Native context.
 * 
 * The `IReskNativeEvent` type defines the possible event names that can be observed
 * and handled in the application. These events are used to notify different parts
 * of the application about specific lifecycle or state changes.
 * 
 * @typedef IReskNativeEvent
 * 
 * @example
 * ```typescript
 * // Example usage of IReskNativeEvent:
 * const event: IReskNativeEvent = "appReady";
 * console.log(event); // Output: "appReady"
 * ```
 * appReady is called 
 * appMounted is called when ReskNativeProvider is mounted
 * appUnmounted is called when ReskNativeProvider is unmounted
 */
export type IReskNativeEvent = "appReady" | "appMounted" | "appUnmounted";

/**
 * A utility class for managing and observing events in the Resk Native context.
 * 
 * The `ReskNativeEvents` class provides a static observable object that allows
 * different parts of the application to subscribe to and emit events. This is
 * particularly useful for managing application lifecycle events or custom events
 * in a centralized manner.
 * 
 * @class ReskNativeEvents
 * 
 * @property {IObservable<IReskNativeEvent>} events - A static observable object
 * that allows subscribing to and emitting events of type `IReskNativeEvent`.
 * 
 * @example
 * ```typescript
 * import { ReskNativeEvents } from "./events";
 * 
 * // Subscribe to an event
 * ReskNativeEvents.events.subscribe("appReady", () => {
 *   console.log("The app is ready!");
 * });
 * 
 * // Emit an event
 * ReskNativeEvents.events.emit("appReady");
 * ```
 * 
 * @remarks
 * - The `events` property is an instance of `IObservable`, which provides methods
 *   for subscribing to and emitting events.
 * - This class is designed to be used as a singleton, with the `events` property
 *   being the central point for event management.
 * 
 * @see {@link IObservable} for the observable implementation.
 */
export class ReskNativeEvents {
    /**
     * A static observable object for managing events of type `IReskNativeEvent`.
     * 
     * The `events` property allows subscribing to specific events and emitting
     * them to notify subscribers. It is implemented using the `observable` utility
     * from `@resk/core/observable`.
     * 
     * @type {IObservable<IReskNativeEvent>}
     * 
     * @example
     * ```typescript
     * // Subscribe to an event
     * ReskNativeEvents.events.subscribe("appReady", () => {
     *   console.log("The app is ready!");
     * });
     * 
     * // Emit an event
     * ReskNativeEvents.events.emit("appReady");
     * ```
     */
    static events: IObservable<IReskNativeEvent> = observable<IReskNativeEvent>({});
}