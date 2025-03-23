import * as React from 'react';

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
export default class Component<IProps = unknown, IState = unknown> extends React.PureComponent<IProps, IState> {
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
