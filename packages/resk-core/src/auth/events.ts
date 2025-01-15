import { Global, isObj } from "@utils/index";
import { IObservable, observable } from "@utils/observable";
import { IAuthEvent } from "./types";

declare global {
    interface Window {
        eventsResourcesObservableHandler: IObservable<IAuthEvent>;
    }
}

/**
 * Authentication event handler.
 * Initializes an observable event handler for authentication events.
 * 
 * This constant `events` is assigned an instance of `IObservable<IAuthEvent>`, which is used to manage 
 * authentication-related events in the application. The initialization checks if the global 
 * `Global.eventsResourcesObservableHandler` exists and is an object. If it does, it assigns it to 
 * `events`; otherwise, it defaults to an empty object cast as `IObservable<IAuthEvent>`.
 * 
 * This pattern allows for flexible handling of events, ensuring that the application can respond 
 * to authentication actions such as sign-in, sign-out, and sign-up.
 * 
 * @type {IObservable<IAuthEvent>}
 * 
 * @example
 * import {Auth} from '@resk/core';
 * // Example of subscribing to an authentication event
 * events.on('SIGN_IN', (user) => {
 *     console.log(`User  signed in: ${user.username}`);
 * });
 * 
 * // Example of triggering an authentication event
 * function userSignIn(user) {
 *     events.trigger('SIGN_IN', user);
 * }
 * 
 * // Example of checking if the events handler is available
 * if (events) {
 *     console.log('Events handler is ready to use.');
 * } else {
 *     console.log('No events handler found, using default implementation.');
 * }
 */
const events: IObservable<IAuthEvent> =
    (isObj((Global as any)?.eventsResourcesObservableHandler) &&
        typeof (Global as any)?.eventsResourcesObservableHandler === "object" &&
        (Global as any)?.eventsResourcesObservableHandler) ||
    {} as IObservable<IAuthEvent>;

if (!isObj((Global as any)?.eventsResourcesObservableHandler)) {
    observable<IAuthEvent>(events);
    Object.defineProperties((Global as any), {
        eventsResourcesObservableHandler: {
            value: events,
        },
    });
}

export default events;