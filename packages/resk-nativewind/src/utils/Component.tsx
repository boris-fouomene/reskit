"use client";
import { PureComponent } from "react";
import { IObservable, observableFactory, IObservableAllEventType, IObservableCallback, IObservableCallbacks } from "@resk/core/observable";

/**
 * A base React component that extends `React.PureComponent` with 
 * additional functionality to track the mounted state of the component.
 * 
 * This class is useful for managing component lifecycle and 
 * ensuring that operations are only performed when the component 
 * is mounted, which can help prevent memory leaks and errors 
 * when interacting with asynchronous operations.
 * 
 * @template IProps - The type of the component's props, defaulting to `unknown`.
 * @template IState - The type of the component's state, defaulting to `unknown`.
 */
export class Component<IProps = unknown, IState = unknown> extends PureComponent<IProps, IState> {
  /**
   * A private flag indicating whether the component is currently mounted.
   * 
   * @private
   * @type {boolean}
   */
  private _isMounted: boolean = false;

  /**
   * Lifecycle method that is called after the component has been mounted.
   * Sets the `_isMounted` flag to true.
   */
  componentDidMount() {
    this._isMounted = true;
  }

  /**
   * Lifecycle method that is called just before the component is unmounted.
   * Sets the `_isMounted` flag to false.
   */
  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * Checks if the component is currently mounted.
   * 
   * @returns {boolean} `true` if the component is mounted; otherwise, `false`.
   */
  isMounted(): boolean {
    return this._isMounted;
  }
  /***
   * Overrides the `setState` method to only update the state if the component is mounted.
   * Prevents unnecessary re-renders and improves performance on the server side.
   */
  setState<K extends keyof IState>(
    state: ((prevState: Readonly<IState>, props: Readonly<IProps>) => Pick<IState, K> | IState | null) | (Pick<IState, K> | IState | null),
    callback?: () => void,
  ): void {
    if (!this.isMounted()) return;
    super.setState(state, callback);
  }
}
/**
 * Extends the React component by defining an observable component.
 * 
 * This class integrates observable functionality into a React component, allowing it 
 * to handle events and callbacks in an observable manner. It provides methods for 
 * subscribing to events, triggering events, and managing event listeners.
 * 
 * @template IProps - The type of the component's props.
 * @template IState - The type of the component's state.
 * @template ObservableEventType - The type of the observable events.
 */
export class ObservableComponent<IProps = unknown, IState = unknown, ObservableEventType extends string = string> extends Component<IProps, IState> implements IObservable<ObservableEventType> {
  /** An observable factory instance. */
  readonly _observable = observableFactory<ObservableEventType>();

  /** A flag indicating if the component is observable. */
  readonly _____isObservable?: boolean | undefined = true;

  /**
   * Subscribes a callback function to a specific event.
   * 
   * @param event - The event name to listen for.
   * @param fn - The callback function to be invoked when the event is triggered.
   * @returns An object containing a remove method to unsubscribe from the event.
   * 
   * ### Usage Example:
   * ```typescript
   * const unsubscribe = this.on('eventName', () => {
   *   console.log('Event triggered!');
   * });
   * 
   * // To remove the event listener
   * unsubscribe.remove();
   * ```
   */
  on(event: ObservableEventType, fn: IObservableCallback): { remove: () => any } {
    return this._observable.on.call(this, event, fn);
  }

  /**
   * Registers a callback to be invoked finally when an event is triggered.
   * 
   * @param event - The event name.
   * @param fn - The callback function to be invoked.
   * @returns The observable instance.
   */
  finally(event: ObservableEventType, fn: IObservableCallback): IObservable<ObservableEventType> {
    return this._observable.finally.call(this, event, fn);
  }

  /**
   * Unsubscribes a callback from a specific event.
   * 
   * @param event - The event name.
   * @param fn - The callback function to remove.
   * @returns The observable instance.
   */
  off(event: ObservableEventType, fn: IObservableCallback): IObservable<ObservableEventType> {
    return this._observable.off.call(this, event, fn);
  }

  /**
   * Triggers a specific event with optional arguments.
   * 
   * @param event - The event name to trigger.
   * @param args - Optional arguments to pass to the event callbacks.
   * @returns The observable instance.
   */
  trigger(event: ObservableEventType | IObservableAllEventType, ...args: any[]): IObservable<ObservableEventType> {
    return this._observable.trigger.call(this, event, ...args);
  }

  /**
   * Unsubscribes all event callbacks for this component.
   * 
   * @returns The observable instance.
   */
  offAll(): IObservable<ObservableEventType> {
    return this._observable.offAll.call(this);
  }

  /**
   * Subscribes a callback function to be triggered once for a specific event.
   * 
   * @param event - The event name.
   * @param fn - The callback function to be invoked.
   * @returns An object containing a remove method to unsubscribe from the event.
   */
  once(event: ObservableEventType, fn: IObservableCallback): { remove: () => any } {
    return this._observable.once.call(this, event, fn);
  }

  /**
   * Retrieves all registered event callbacks.
   * 
   * @returns An object mapping event names to their respective callback functions.
   */
  getEventCallBacks(): IObservableCallbacks<ObservableEventType> {
    return this._observable.getEventCallBacks.call(this);
  }

  /**
   * Lifecycle method called when the component is about to unmount.
   * Cleans up all event subscriptions to prevent memory leaks.
   */
  componentWillUnmount(): void {
    super.componentWillUnmount();
    this._observable.offAll.call(this);
  }

  /**
   * Lifecycle method called when the component is mounted.
   * You can add additional setup here if necessary.
   */
  componentDidMount(): void {
    super.componentDidMount();
  }
}
