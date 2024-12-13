
import React, { Fragment, ReactNode, useMemo } from "react";
import { mergeRefs } from "@utils/mergeRefs";
import { ObservableComponent } from "@utils/index";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { IDict, IObservable, IObservableEvent, uniqid } from "@resk/core";
import { canDrawerBeMinimizedOrPermanent } from "./utils";
import { isValidElement } from "@utils";
import Breakpoints from "@breakpoints";
import { Animated, Dimensions, Keyboard, PanResponder, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent, PanResponderGestureState, I18nManager, Pressable } from "react-native";
import { Portal } from "@components/Portal";
import View from "@components/View";
import { Colors, useTheme } from "@theme";
import { getDrawerWidth } from "./utils";
import FontIcon from "@components/Icon/Font";
import { Tooltip } from "@components/Tooltip";
import { IDrawer, IDrawerContext, IDrawerPosition, IDrawerProps, IDrawerProviderProps, IDrawerState, IDrawerCurrentState } from "./types";
import { DrawerContext } from "./hooks";
import { ISessionStorage } from "@resk/core/build/session";
import { IAuthSessionStorage } from "@src/auth/types";
import { getAuthSessionStorage } from "@src/auth/session";

const MIN_SWIPE_DISTANCE = 3;

const VX_MAX = 0.1;

const IDLE = "Idle";
const DRAGGING = "Dragging";
const SETTLING = "Settling";
/**
 * Drawer component that extends ObservableComponent and implements IDrawer interface.
 * It provides functionality for a drawer that can be opened, closed, pinned, unpinned, minimized, and toggled.
 * It also supports gestures for opening and closing the drawer.
 *
 * @class Drawer
 * @extends {ObservableComponent<IDrawerProps, IDrawerState>}
 * @implements {IDrawer}
 *
 * @property {any} _lastOpenValue - The last open value of the drawer.
 * @property {string} id - The unique identifier for the drawer.
 * @property {PanResponderInstance} _panResponder - The PanResponder instance for handling gestures.
 * @property {boolean} _isClosing - Indicates if the drawer is in the process of closing.
 * @property {boolean} _isTogglingFullScreen - Indicates if the drawer is toggling full screen mode.
 * @property {number} _closingAnchorValue - The anchor value for closing the drawer.
 * @property {React.RefObject<any>} _navigationViewRef - Reference to the navigation view.
 * @property {React.RefObject<any>} _backdropRef - Reference to the backdrop view.
 *
 * @constructor
 * @param {IDrawerProps} props - The properties for the drawer component.
 *
 * @method isMinimizable - Checks if the drawer is minimizable.
 * @returns {boolean} - True if the drawer is minimizable, false otherwise.
 *
 * @method trigger - Overrides the trigger function defined in the event observer.
 * @param {IObservableEvent} event - The event to trigger.
 * @param {...any[]} args - Additional arguments for the event.
 * @returns {IObservable | null} - The observable instance or null.
 *
 * @method pin - Pins the drawer, making it permanent.
 * @param {Function} [callback] - Optional callback function to execute after pinning.
 *
 * @method unpin - Unpins the drawer, making it temporary.
 * @param {Function} [callback] - Optional callback function to execute after unpinning.
 *
 * @method isPinned - Checks if the drawer is pinned.
 * @returns {boolean} - True if the drawer is pinned, false otherwise.
 *
 * @method setPermanent - Sets the drawer to permanent or temporary mode.
 * @param {boolean} permanent - True to set the drawer to permanent mode, false to set it to temporary mode.
 * @param {Function} [callback] - Optional callback function to execute after setting the mode.
 *
 * @method setMinimized - Minimizes or restores the drawer.
 * @param {boolean} minimized - True to minimize the drawer, false to restore it.
 * @param {Function} [callback] - Optional callback function to execute after minimizing or restoring.
 *
 * @method isMinimized - Checks if the drawer is minimized.
 * @returns {boolean} - True if the drawer is minimized, false otherwise.
 *
 * @method isPermanent - Checks if the drawer is permanent.
 * @returns {boolean} - True if the drawer is permanent, false otherwise.
 *
 * @method getStateOptions - Gets the state options for the drawer.
 * @param {IDrawerCurrentState} [drawerState] - Optional drawer state options to merge.
 * @returns {IDrawerCurrentState} - The merged drawer state options.
 *
 * @method toggle - Toggles the drawer open or closed.
 * @param {Function} [callback] - Optional callback function to execute after toggling.
 *
 * @method isProvider - Checks if the drawer is a provider.
 * @returns {boolean} - True if the drawer is a provider, false otherwise.
 *
 * @method getDeviceWidth - Gets the device width.
 * @returns {number} - The device width.
 *
 * @method getDrawerPosition - Gets the position of the drawer (left or right).
 * @returns {IDrawerPosition} - The position of the drawer.
 *
 * @method isPositionRight - Checks if the drawer position is right.
 * @returns {boolean} - True if the drawer position is right, false otherwise.
 *
 * @method isOpen - Checks if the drawer is open.
 * @returns {boolean} - True if the drawer is open, false otherwise.
 *
 * @method isClosed - Checks if the drawer is closed.
 * @returns {boolean} - True if the drawer is closed, false otherwise.
 *
 * @method componentDidMount - Lifecycle method called after the component is mounted.
 *
 * @method renderNavigationView - Renders the navigation view of the drawer.
 * @returns {ReactNode | null} - The navigation view or null.
 *
 * @method canBePinned - Checks if the drawer can be pinned.
 * @returns {boolean} - True if the drawer can be pinned, false otherwise.
 *
 * @method getProps - Gets the properties of the drawer.
 * @returns {Partial<IDrawerProps & IDrawerState>} - The properties of the drawer.
 *
 * @method getTestID - Gets the test ID of the drawer.
 * @returns {string} - The test ID of the drawer.
 *
 * @method isFullScreen - Checks if the drawer is in full screen mode.
 * @returns {boolean} - True if the drawer is in full screen mode, false otherwise.
 *
 * @method canToggleFullScren - Checks if the drawer can toggle full screen mode.
 * @returns {boolean} - True if the drawer can toggle full screen mode, false otherwise.
 *
 * @method toggleFullScreen - Toggles the drawer full screen mode.
 *
 * @method getProviderAppBarProps - Gets the app bar properties for the provider.
 * @param {boolean} [handleDrawerWidth] - Optional flag to handle drawer width.
 * @returns {IAppBarProps} - The app bar properties.
 *
 * @method renderProviderTitle - Renders the provider title.
 * @returns {ReactNode} - The provider title.
 *
 * @method renderProviderChildren - Renders the provider children.
 * @returns {ReactNode} - The provider children.
 *
 * @method renderContent - Renders the content of the drawer.
 * @returns {ReactNode} - The content of the drawer.
 *
 * @method getSessionName - Gets the session name of the drawer.
 * @returns {string} - The session name of the drawer.
 *
 * @method getDrawerWidth - Gets the width of the drawer.
 * @param {boolean} [fullScreen] - Optional flag to get the width in full screen mode.
 * @returns {number} - The width of the drawer.
 *
 * @method getSession - Gets the session value for a given key.
 * @param {string} [key] - The key to get the session value for.
 * @returns {any} - The session value.
 *
 * @method setSession - Sets the session value for a given key.
 * @param {string} key - The key to set the session value for.
 * @param {any} [value] - The value to set in the session.
 * @returns {any} - The set session value.
 *
 * @method render - Renders the drawer component.
 * @returns {ReactNode} - The rendered drawer component.
 *
 * @method _onOverlayClick - Handles the overlay click event.
 * @param {GestureResponderEvent} e - The gesture responder event.
 *
 * @method _emitStateChanged - Emits the state changed event.
 * @param {string} newState - The new state of the drawer.
 *
 * @method open - Opens the drawer.
 * @param {IDrawerProviderProps} [options] - Optional options for opening the drawer.
 * @param {boolean | Function} [callback] - Optional flag or function to reset provider properties.
 *
 * @method close - Closes the drawer.
 * @param {IDrawerProviderProps} [options] - Optional options for closing the drawer.
 * @param {Function} [callback] - Optional callback function to execute after closing.
 *
 * @method _handleDrawerOpen - Handles the drawer open event.
 *
 * @method _handleDrawerClose - Handles the drawer close event.
 *
 * @method _shouldSetPanResponder - Determines if the pan responder should be set.
 * @param {GestureResponderEvent} e - The gesture responder event.
 * @param {PanResponderGestureState} gestureState - The gesture state.
 * @returns {boolean} - True if the pan responder should be set, false otherwise.
 *
 * @method _panResponderGrant - Handles the pan responder grant event.
 *
 * @method _panResponderMove - Handles the pan responder move event.
 * @param {GestureResponderEvent} e - The gesture responder event.
 * @param {PanResponderGestureState} gestureState - The gesture state.
 *
 * @method getThreshold - Gets the threshold value for the drawer.
 * @returns {number} - The threshold value.
 *
 * @method _panResponderRelease - Handles the pan responder release event.
 * @param {GestureResponderEvent} e - The gesture responder event.
 * @param {PanResponderGestureState} gestureState - The gesture state.
 *
 * @method _isLockedClosed - Checks if the drawer is locked closed.
 * @returns {boolean} - True if the drawer is locked closed, false otherwise.
 *
 * @method _isLockedOpen - Checks if the drawer is locked open.
 * @returns {boolean} - True if the drawer is locked open, false otherwise.
 *
 * @method _getOpenValueForX - Gets the open value for a given x position.
 * @param {number} x - The x position.
 * @example : 
 * import {Drawer} from '@resk/expo';
  const MyComponent = () => {
    return (
      <Drawer
        isProvider={false}
        drawerWidth={300}
        onDrawerOpen={(options) => console.log('Drawer opened', options)}
        onDrawerClose={(options) => console.log('Drawer closed', options)}
      >
        <View>
          <Text>Drawer Content</Text>
        </View>
      </Drawer>
    );
  };
 * 
 * @returns {number} - The open value.
 */
export default class Drawer extends ObservableComponent<IDrawerProps, IDrawerState> implements IDrawer {
  /**
   * Stores the last open value of the drawer.
   * @type {any}
   * @private
   */
  _lastOpenValue: any = null;
  /**
   * Unique identifier for the drawer instance.
   * @type {string}
   * @readonly
   */
  readonly id = uniqid(this.isProvider() ? "drawerProviderId-" : "drawerId-");
  /**
   * PanResponder instance to handle gesture interactions.
   * @type {PanResponderInstance}
   * @readonly
   */
  readonly _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: this._shouldSetPanResponder.bind(this),
    onPanResponderGrant: this._panResponderGrant.bind(this),
    onPanResponderMove: this._panResponderMove.bind(this),
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: this._panResponderRelease.bind(this),
    onPanResponderTerminate: () => { },
  });
  /**
   * Indicates whether the drawer is in the process of closing.
   * @type {boolean}
   * @private
   */
  _isClosing: boolean = false;
  /**
   * Indicates whether the drawer is toggling full screen mode.
   * @type {boolean}
   * @private
   */
  _isTogglingFullScreen: boolean = false;
  /**
   * Stores the anchor value when the drawer is closing.
   * @type {number}
   * @private
   */
  _closingAnchorValue: number = 0;
  /**
   * Reference to the navigation view element.
   * @type {React.RefObject<any>}
   * @private
   */
  _navigationViewRef: any = React.createRef();
  /**
   * Reference to the backdrop element.
   * @type {React.RefObject<any>}
   * @private
   */
  _backdropRef: any = React.createRef();
  constructor(props: IDrawerProps) {
    super(props);
    const isProvider = !!props.isProvider;
    const permSession = this.getSession("permanent");
    let permanent = typeof props.permanent == "boolean" ? props.permanent : typeof permSession === "boolean" ? permSession : !this.isProvider() && canDrawerBeMinimizedOrPermanent();
    if (!canDrawerBeMinimizedOrPermanent()) {
      permanent = false;
    }
    const drawerShown = !isProvider && permanent ? true : false;
    const providerProps = Object.assign({}, this.props.providerProps);

    const minimized = typeof this.props.minimized === "boolean" ? this.props.minimized : this.getSession("minimized");
    this.state = {
      accessibilityViewIsModal: false,
      drawerShown,
      isProvider,
      providerProps: { ...providerProps },
      openValue: new Animated.Value(drawerShown ? 1 : 0) as Animated.Value,
      minimized,
      permanent,
    };
  }
  /**
   * Determines if the drawer component is minimizable.
   *
   * @returns {boolean} True if the drawer can be minimized, false otherwise.
   */
  isMinimizable(): boolean {
    return !!this.getProps().minimizable;
  }

  /**
   * Triggers an observable event with the provided arguments.
   *
   * @param event - The observable event to trigger.
   * @param args - Additional arguments to pass to the event handler.
   * @returns The observable instance or null if the event is not handled.
   */
  trigger(event: IObservableEvent, ...args: any[]): IObservable | null {
    return super.trigger(event, {
      ...this.getStateOptions(),
      eventName: event,
    });
  }
  /**
   * Sets the drawer to be permanent.
   *
   * @param callback - An optional callback function that receives the drawer state options after the permanent state is set.
   */
  pin(callback?: (options: IDrawerCurrentState) => any): void {
    this.setPermanent(true, callback);
  }

  /**
   * Sets the drawer to be non-permanent.
   *
   * @param callback - An optional callback function that receives the drawer state options after the permanent state is set.
   */
  unpin(callback?: (options: IDrawerCurrentState) => any): void {
    this.setPermanent(false, callback);
  }
  /**
   * Checks if the drawer is pinned (is permanent).
   * 
   * @returns {boolean} - Returns true if the drawer is permanent, otherwise false.
   */
  isPinned() {
    return this.isPermanent();
  }

  /**
   * Sets the drawer to be permanent or not.
   *
   * @param permanent - A boolean indicating whether the drawer should be permanent.
   * @param callback - An optional callback function that receives the drawer state options.
   *
   * If the drawer cannot be pinned and is not currently permanent, or if the drawer's
   * permanent state is already the same as the provided value, the callback is invoked
   * immediately with the current state options.
   *
   * If the drawer is to be made permanent, it opens the drawer and then sets the permanent
   * state, triggering the appropriate events and setting the session state.
   *
   * If the drawer is to be made non-permanent, it directly sets the permanent state,
   * triggering the appropriate events and setting the session state.
   */
  setPermanent(permanent: boolean, callback?: (options: IDrawerCurrentState) => any): void {
    if ((!this.canBePinned() && !this.isPermanent()) || this.isPermanent() === permanent) {
      if (callback) callback(this.getStateOptions());
      return;
    }
    const cb2 = () => {
      this.setState({ permanent }, () => {
        const options = this.getStateOptions();
        this.trigger("permanent", options);
        this.setSession("permanent", permanent);
        if (callback) {
          callback(options);
        }
      });
    };
    if (permanent) {
      this.open({ callback: cb2 });
    } else {
      cb2();
    }
  }

  /**
   * Sets the minimized state of the drawer.
   *
   * @param minimized - A boolean indicating whether the drawer should be minimized.
   * @param callback - An optional callback function that will be called with the drawer state options after the state is set.
   */
  setMinimized(minimized: boolean, callback?: (options: IDrawerCurrentState) => any) {
    const options = this.getStateOptions();
    if (!canDrawerBeMinimizedOrPermanent()) {
      if (callback) callback(options);
      return;
    }
    this.setState({ minimized }, () => {
      this.trigger("minimized", options);
      this.setSession("minimized", minimized);
      if (callback) {
        callback(options);
      }
    });
  }
  /**
   * Determines if the drawer is minimized.
   *
   * @returns {boolean} - Returns `true` if the drawer is minimized, otherwise `false`.
   */
  isMinimized(): boolean {
    if (!this.isProvider() && !canDrawerBeMinimizedOrPermanent()) return false;
    return this.isMinimizable() && !!(this.isProvider() ? this.state.providerProps.minimized : this.state.minimized);
  }
  /**
   * Determines if the drawer should be permanent.
   *
   * @returns {boolean} - Returns `true` if the drawer is permanent, otherwise `false`.
   */
  isPermanent(): boolean {
    return this.isProvider() ? false : this.getProps().permanent || false;
  }
  /**
   * Generates and returns the state options for the drawer component.
   *
   * @param {IDrawerCurrentState} [drawerState] - Optional initial state options to be merged.
   * @returns {IDrawerCurrentState} The complete state options for the drawer.
   */
  getStateOptions(drawerState?: IDrawerCurrentState): IDrawerCurrentState {
    drawerState = Object.assign({}, drawerState);
    return {
      ...drawerState,
      context: this as unknown as IDrawer,
      id: this.id,
      minimized: this.isMinimized(),
      minimizable: this.isMinimizable(),
      isPermanent: this.isPermanent(),
      isPinned: this.isPinned(),
      isTemporary: !this.isPermanent(),
      canBePinned: this.canBePinned(),
    };
  }
  /**
   * Toggles the drawer state between open and closed.
   * 
   * If the drawer is permanent, it will immediately trigger the toggle event.
   * Otherwise, it will either open or close the drawer and then trigger the toggle event.
   * 
   * @param callback - An optional callback function that will be called with the drawer state options after the toggle event is triggered.
   */
  toggle(callback?: (options: IDrawerCurrentState) => void) {
    const cb = () => {
      const options = this.getStateOptions();
      this.trigger("toggle", options);
      if (callback) {
        callback(options);
      }
    };
    if (this.isPermanent()) {
      cb();
      return;
    }
    if (this.isOpen()) {
      this.close({ callback: cb });
    } else {
      this.open({ callback: cb });
    }
  }
  /**
   * Checks if the drawer is a provider.
  * @returns True if the drawer is a provider, false otherwise.
  */
  isProvider() {
    return !!this.state?.isProvider;
  }
  /**
   * Returns the width of the device's window, ensuring a minimum width of 280.
   *
   * @returns {number} The width of the device's window or 280, whichever is greater.
   */
  getDeviceWidth(): number {
    return Math.max(Dimensions.get("window").width, 280);
  }

  /**
   * Determines the position of the drawer based on the current language direction (RTL or LTR)
   * and the provided position prop.
   *
   * @returns {IDrawerPosition} The position of the drawer, either "left" or "right".
   */
  getDrawerPosition(): IDrawerPosition {
    const rtl = I18nManager.isRTL;
    let position: IDrawerPosition = this.getProps()?.position;
    if (position !== "left" && position !== "right") {
      position = this.isProvider() ? "right" : "left";
    }
    return rtl
      ? position === "left"
        ? "right"
        : "left" // invert it
      : position;
  }
  /**
   * Determines if the drawer position is set to "right".
   *
   * @returns {boolean} True if the drawer position is "right", otherwise false.
   */
  isPositionRight(): boolean {
    return this.getDrawerPosition() === "right";
  }
  /**
   * Checks if the drawer is open.
   *
   * @returns {boolean} True if the drawer is open, otherwise false.
   */
  isOpen(): boolean {
    return this.state.drawerShown;
  }
  /**
   * Checks if the drawer is closed.
   * @returns {boolean} True if the drawer is closed, otherwise false.
   */
  isClosed(): boolean {
    return !this.state.drawerShown;
  }

  componentDidMount() {
    super.componentDidMount();
    const { openValue } = this.state;
    openValue.addListener(({ value }) => {
      const drawerShown = value > 0;
      const accessibilityViewIsModal = drawerShown;
      if (drawerShown !== this.state.drawerShown) {
        this.setState({ drawerShown, accessibilityViewIsModal });
      }

      if (this.props.keyboardDismissMode === "on-drag") {
        Keyboard.dismiss();
      }

      this._lastOpenValue = value;
      if (this.props.onDrawerSlide) {
        this.props.onDrawerSlide(this.getStateOptions({ nativeEvent: { offset: value } } as IDrawerCurrentState));
      }
    });
  }
  /**
   * Renders the navigation view of the drawer.
   *
   * @returns The navigation view or null if no renderNavigationView prop is provided.
   */
  renderNavigationView() {
    if (this.props.renderNavigationView) {
      return this.props.renderNavigationView(this.getStateOptions());
    }
    return null;
  }

  /**
   * Determines if the drawer can be pinned (minimized or set to permanent mode.).
   * The function checks if the current media matches the desktop breakpoint.
   * @returns {boolean} - Returns true if the drawer can be minimized or set to permanent, otherwise false.
   */
  canBePinned(): boolean {
    return canDrawerBeMinimizedOrPermanent();
  }

  /**
   * Retrieves the properties for the Drawer component.
   * 
   * @returns {Partial<IDrawerProps & IDrawerState>} A partial object containing either the provider properties 
   * if the component is a provider, or a combination of the component's props and state.
   */
  getProps(): Partial<IDrawerProps & IDrawerState> {
    return this.isProvider() ? this.state.providerProps || {} : { ...this.props, ...this.state };
  }

  /**
   * Retrieves the test ID for the drawer component.
   *
   * @returns {string} The test ID for the drawer component. If the component is a provider, 
   * it returns "resk-drawer-provider", otherwise it returns "resk-drawer".
   */
  getTestID(): string {
    return this.getProps()?.testID || this.isProvider() ? "resk-drawer-provider" : "resk-drawer";
  }

  /**
   * Checks if the drawer is in full-screen mode.
   *
   * @returns {boolean} Returns `true` if the drawer is in full-screen mode, otherwise `false`.
   */
  isFullScreen(): boolean {
    return !!this.state.fullScreen;
  }

  /**
   * Determines if the full screen mode can be toggled.
   *
   * @returns {boolean} - Returns `true` if the device is not in mobile media mode, otherwise `false`.
   */
  canToggleFullScren(): boolean {
    return !Breakpoints.isMobileMedia();
  }
  /**
   * Toggles the full-screen mode of the drawer component.
   * 
   * This method animates the `openValue` state using a spring animation to transition
   * to the full-screen mode. The animation configuration includes properties such as
   * `bounciness`, `restSpeedThreshold`, and `useNativeDriver`. The `useNativeDriver`
   * property is determined based on the `useNativeAnimations` prop.
   * 
   * Once the animation completes, the `fullScreen` state is toggled, and the `_isTogglingFullScreen`
   * flag is reset to `false`.
   * 
   * @remarks
   * This method sets the `_isTogglingFullScreen` flag to `true` at the start to indicate
   * that the full-screen toggle process is in progress.
   */
  toggleFullScreen(): void {
    this._isTogglingFullScreen = true;
    Animated.spring(this.state.openValue, {
      toValue: 1,
      bounciness: 0,
      restSpeedThreshold: 0.1,
      useNativeDriver: typeof this.props.useNativeAnimations == "boolean" ? this.props.useNativeAnimations : false,
    }).start(() => {
      this.setState({ fullScreen: !this.state.fullScreen }, () => {
        this._isTogglingFullScreen = false;
      });
    });
  }
  /**
   * Retrieves the properties for the provider's AppBar component.
   *
   * @param {boolean} [handleDrawerWidth] - Optional flag to determine if the drawer width should be handled.
   * @returns {IAppBarProps} The properties for the AppBar component.
   *
   * @remarks
   * - The `testID` is generated by appending "drawer-title-container" to the component's test ID.
   * - The `windowWidth` is set based on the drawer width if `handleDrawerWidth` is not explicitly set to false.
   * - The `onBackActionPress` function closes the drawer and returns false.
   * - The `backAction` function returns a combination of the provided back action element and a toggle for full screen mode if applicable.
   */
  getProviderAppBarProps(handleDrawerWidth?: boolean): IAppBarProps {
    const testID = this.getTestID();
    const appBarProps = Object.assign({}, this.state.providerProps.appBarProps);
    return Object.assign(
      {},
      {
        testID: testID + "drawer-title-container",
        windowWidth: handleDrawerWidth !== false ? this.getDrawerWidth() : undefined,
        onBackActionPress: (event: GestureResponderEvent) => {
          this.close();
          return false;
        },
        backAction: (backActionProps) => {
          const elt = typeof appBarProps?.backAction == "function" ? appBarProps.backAction(backActionProps) : appBarProps.backAction;
          return (
            <>
              {isValidElement(elt) ? elt : <AppBar.BackAction size={25} {...backActionProps} iconName={appBarProps.backActionProps?.iconName || this.getDrawerPosition() == "left" ? "chevron-left" : "chevron-right"} />}
              {this.canToggleFullScren() ? <Tooltip onPress={this.toggleFullScreen.bind(this)} tooltip={this.isFullScreen() ? "Cliquez pour sortir du mode plein écran" : "Cliquez pour basculer en plein écran "} children={<FontIcon color={backActionProps?.color} style={styles.toggleFullScreenIcon} name={this.isFullScreen() ? "fullscreen-exit" : "fullscreen"} size={20} />} /> : null}
            </>
          );
        },
      } as IAppBarProps,
      appBarProps
    );
  }
  renderProviderTitle(): ReactNode {
    const { appBar } = this.state.providerProps;
    const appBarProps = this.getProviderAppBarProps();
    if (appBar) {
      const aBar: ReactNode = typeof appBar == "function" ? appBar({ drawer: this, appBarProps }) : appBar;
      return isValidElement(aBar) ? aBar : null;
    }
    if (this.state.providerProps?.appBarProps === null) return null;
    return <AppBar {...appBarProps} />;
  }
  renderProviderChildren(): ReactNode {
    return (
      <>
        {this.renderProviderTitle()}
        <Fragment key={this.state?.providerProps?.resetProvider !== false && !this._isTogglingFullScreen ? uniqid("drawerId-") : "resetProvider"}>{React.isValidElement(this.state.providerProps?.children) ? this.state.providerProps?.children : null}</Fragment>
      </>
    );
  }
  renderContent() {
    return (
      <View style={[styles.main]} testID={this.getTestID() + "drawer-content"}>
        {this.props.children}
      </View>
    );
  }

  /**
   * Retrieves the session name for the drawer component.
   * 
   * @returns {string} The session name. If the component has a `sessionName` prop, it returns that value.
   * Otherwise, if the component is a provider, it returns "drawer-provider". If neither condition is met,
   * it returns "drawer".
   */
  getSessionName(): string {
    return this.getProps()?.sessionName || this.isProvider() ? "drawer-provider" : "drawer";
  }

  /**
   * Calculates and returns the width of the drawer.
   *
   * @param {boolean} [fullScreen] - Optional parameter to specify if the drawer should be full screen.
   * If not provided, it defaults to the component's state value.
   * @returns {number} - The width of the drawer. If the drawer is in full screen mode or if the device
   * is a mobile device and the component is a provider, it returns the window width. Otherwise, it returns
   * the drawer width specified in the component's props or a default value.
   */
  getDrawerWidth(fullScreen?: boolean): number {
    fullScreen = fullScreen || this.state.fullScreen;
    if (fullScreen || (this.isProvider() && Breakpoints.isMobileMedia())) {
      return Dimensions.get("window").width;
    }
    const props = this.getProps();
    return Math.min(typeof props?.drawerWidth == "number" ? props?.drawerWidth : getDrawerWidth(this.isProvider()));
  }
  /**
   * Retrieves the current authentication session storage.
   *
   * @returns {IAuthSessionStorage} The authentication session storage associated with the current session name.
   */
  get session(): IAuthSessionStorage {
    return getAuthSessionStorage(this.getSessionName());
  }
  /**
   * Retrieves a session value associated with the given key.
   *
   * @param {string} [key] - The key of the session value to retrieve. If no key is provided, the entire session is returned.
   * @returns {any} The session value associated with the provided key, or the entire session if no key is provided.
   */
  getSession(key?: string): any {
    return this.session.get(key);
  }
  /**
   * Sets a session value for the given key.
   *
   * @param {string} key - The key for the session value.
   * @param {any} [value] - The value to be set for the session key. If not provided, the value will be undefined.
   * @returns {any} The result of setting the session value.
   */
  setSession(key: string, value?: any): any {
    return this.session.set(key, value);
  }
  render() {
    return <DrawerChildren drawer={this} />;
  }

  _onOverlayClick(e: GestureResponderEvent): void {
    e.stopPropagation();
    if (this.getProps()?.closeOnOverlayClick === false) return;
    if (this.getProps()?.onOverlayClick && (this.getProps() as IDict)?.onOverlayClick({ event: e, ...this.getStateOptions() }) === false) return;
    if (!this._isLockedClosed() && !this._isLockedOpen()) {
      this.close();
    }
  }

  _emitStateChanged(newState: string): void {
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged({ newState, context: this });
    }
    this.trigger("state_changed", this.getStateOptions());
  }


  /**
   * Opens the drawer with the specified options.
   *
   * @param {IDrawerProviderProps} [options={}] - The options for opening the drawer.
   * @param {boolean | Function} [callback=false] - Determines whether to reset provider props or a function that is call after the drawer is opened.
   *
   * @returns {void}
   */
  open(options: IDrawerProviderProps = {}, callback: boolean | Function = false): void {
    options = Object.assign({}, options);
    const cb = () => {
      this._emitStateChanged(SETTLING);
      Animated.spring(this.state.openValue, {
        toValue: 1,
        bounciness: 0,
        restSpeedThreshold: 0.1,
        useNativeDriver: typeof this.props.useNativeAnimations == "boolean" ? this.props.useNativeAnimations : false,
        ...options,
      }).start(() => {
        this._emitStateChanged(IDLE);
        this.trigger("opened", this.getStateOptions());
        if (typeof callback == "function") {
          callback = callback(this.getStateOptions());
        }
        if (typeof options.callback == "function") {
          options.callback(this.getStateOptions());
        }
        if (this.isProvider()) {
          if (this.state.providerProps.onDrawerOpen) {
            this.state.providerProps.onDrawerOpen(this.getStateOptions());
          }
        } else if (this.props.onDrawerOpen) {
          this.props.onDrawerOpen(this.getStateOptions());
        }
      });
    };

    if (this.isProvider()) {
      callback = options?.resetProvider !== false || callback;
      this.setState(
        {
          providerProps: callback
            ? Object.assign({}, options, { resetProvider: callback })
            : {
              ...Object.assign({}, this.state.providerProps),
              ...options,
              resetProvider: callback,
            },
        },
        cb
      );
    } else {
      cb();
    }
  }


  /**
   * Closes the drawer with optional settings and a callback function.
   * 
   * @param {IDrawerProviderProps} [options] - Optional settings for closing the drawer.
   * @param {Function} [callback] - Optional callback function to be called after the drawer is closed.
   * 
   * The function performs the following actions:
   * - Merges the provided options with default options.
   * - Emits a state change event indicating the drawer is settling.
   * - Defines an `end` function that:
   *   - Calls the provided callback function, if any, with the current state options.
   *   - Calls the `options.callback` function, if any, with the current state options.
   *   - If the drawer is a provider, calls the `onDrawerClose` function from `providerProps`, if defined.
   *   - Otherwise, calls the `onDrawerClose` function from `props`, if defined.
   *   - Emits a state change event indicating the drawer is idle.
   *   - Triggers the `CLOSED` event with the current state options.
   * - If the drawer is not permanent and is currently open, animates the drawer to a closed state and then calls the `end` function.
   * - If the drawer is already closed or permanent, directly calls the `end` function.
   */
  close(options?: IDrawerProviderProps, callback?: Function): void {
    options = Object.assign({}, options);
    this._emitStateChanged(SETTLING);
    callback = typeof callback == "function" ? callback : options?.callback;
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * A callback function that is called when the drawer is closed. It is used to cleanup and emit the CLOSED event.
     * @param {IDrawerCurrentState} options - The options passed to the drawer.
     */
    /******  f1cf9943-958c-4b60-8b76-104ac1d2c950  *******/
    const end = () => {
      if (typeof callback == "function") {
        callback(this.getStateOptions());
      }
      if (typeof options?.callback == "function") {
        options.callback(this.getStateOptions());
      }
      if (this.isProvider()) {
        if (this.state.providerProps.onDrawerClose) {
          this.state.providerProps.onDrawerClose(this.getStateOptions());
        }
      } else if (this.props.onDrawerClose) {
        this.props.onDrawerClose(this.getStateOptions());
      }
      this._emitStateChanged(IDLE);
      this.trigger("closed", this.getStateOptions());
    };
    if (!this.isPermanent() && this.isOpen()) {
      Animated.spring(this.state.openValue, {
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1,
        useNativeDriver: typeof this.props.useNativeAnimations == "boolean" ? this.props.useNativeAnimations : false,
        ...options,
      }).start(end);
    } else end();
  }

  _handleDrawerOpen() {
    if (this.props.onDrawerOpen) {
      this.props.onDrawerOpen(this.getStateOptions());
    }
  }

  _handleDrawerClose() {
    if (this.props.onDrawerClose) {
      this.props.onDrawerClose(this.getStateOptions());
    }
  }

  _shouldSetPanResponder(e: GestureResponderEvent, { moveX, dx, dy }: PanResponderGestureState) {
    if (this.isProvider() || this.props.gesturesEnabled === false) return false;
    if (!dx || !dy || Math.abs(dx) < MIN_SWIPE_DISTANCE) {
      return false;
    }

    if (this._isLockedClosed() || this._isLockedOpen()) {
      return false;
    }
    if (this.getDrawerPosition() === "left") {
      const deviceWidth = this.getDeviceWidth();
      const overlayArea = deviceWidth - (deviceWidth - this.getDrawerWidth());

      if (this._lastOpenValue === 1) {
        if ((dx < 0 && Math.abs(dx) > Math.abs(dy) * 3) || moveX > overlayArea) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX <= 35 && dx > 0) {
          this._isClosing = false;
          return true;
        }

        return false;
      }
    } else {
      const deviceWidth = this.getDeviceWidth();
      const overlayArea = deviceWidth - this.getDrawerWidth();
      if (this._lastOpenValue === 1) {
        if ((dx > 0 && Math.abs(dx) > Math.abs(dy) * 3) || moveX < overlayArea) {
          this._isClosing = true;
          this._closingAnchorValue = this._getOpenValueForX(moveX);
          return true;
        }
      } else {
        if (moveX >= deviceWidth - 35 && dx < 0) {
          this._isClosing = false;
          return true;
        }

        return false;
      }
    }
    return false;
  }

  _panResponderGrant() {
    this._emitStateChanged(DRAGGING);
  }

  _panResponderMove(e: GestureResponderEvent, { moveX }: PanResponderGestureState) {
    let openValue = this._getOpenValueForX(moveX);

    if (this._isClosing) {
      openValue = 1 - (this._closingAnchorValue - openValue);
    }

    if (openValue > 1) {
      openValue = 1;
    } else if (openValue < 0) {
      openValue = 0;
    }

    this.state.openValue.setValue(openValue);
  }
  getThreshold(): number {
    return this.getDeviceWidth() / 2;
  }
  _panResponderRelease(e: GestureResponderEvent, { moveX, vx }: PanResponderGestureState) {
    const previouslyOpen = this._isClosing;
    const isWithinVelocityThreshold = vx < VX_MAX && vx > -VX_MAX;
    const THRESHOLD = this.getThreshold();
    if (this.getDrawerPosition() === "left") {
      if ((vx > 0 && moveX > THRESHOLD) || vx >= VX_MAX || (isWithinVelocityThreshold && previouslyOpen && moveX > THRESHOLD)) {
        this.open({ velocity: vx });
      } else if ((vx < 0 && moveX < THRESHOLD) || vx < -VX_MAX || (isWithinVelocityThreshold && !previouslyOpen)) {
        this.close({ velocity: vx });
      } else if (previouslyOpen) {
        this.open();
      } else {
        this.close();
      }
    } else {
      if ((vx < 0 && moveX < THRESHOLD) || vx <= -VX_MAX || (isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD)) {
        this.open({ velocity: -1 * vx });
      } else if ((vx > 0 && moveX > THRESHOLD) || vx > VX_MAX || (isWithinVelocityThreshold && !previouslyOpen)) {
        this.close({ velocity: -1 * vx });
      } else if (previouslyOpen) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  _isLockedClosed() {
    return this.props.drawerLockMode === "locked-closed" && !this.state.drawerShown;
  }

  _isLockedOpen() {
    return this.props.drawerLockMode === "locked-open" && this.state.drawerShown;
  }

  _getOpenValueForX(x: number): number {
    const drawerWidth = this.getDrawerWidth();

    if (this.getDrawerPosition() === "left") {
      return x / drawerWidth;
    }

    // position === 'right'
    return (this.getDeviceWidth() - x) / drawerWidth;
  }
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 1001,
  },
  main: {
    flex: 1,
    zIndex: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
  },
  providerVisibleContainer: StyleSheet.absoluteFillObject,
  providerNotVisibleContainer: {
    opacity: 0,
  },
  providerTitle: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    flexWrap: "nowrap",
  },
  providerTitleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleFullScreenIcon: {
    marginLeft: -5,
  },
  permanentBackdrop: {
    backgroundColor: "transparent",
  }
});



export const DrawerChildren: React.FC<IDrawerContext> = ({ drawer }) => {
  const theme = useTheme();
  const children = useMemo(() => {
    return drawer.isProvider() ? drawer.renderProviderChildren() : drawer.renderNavigationView();
  }, [drawer.isProvider(), drawer.state?.providerProps, drawer?.state?.providerProps?.appBarProps, theme, drawer.props.renderNavigationView]);
  const content = useMemo(() => {
    return drawer.renderContent();
  }, [theme, drawer.props.children]);
  const { accessibilityViewIsModal, drawerShown, openValue } = drawer.state;
  const elevation = typeof drawer.props.elevation == "number" ? drawer.props.elevation : 5;
  const elev = drawer.isPermanent() ? (theme.elevations[elevation] ?? null) : null;
  const testID = drawer.getTestID();
  const permanent = drawer.isPermanent();
  const { navigationViewRef } = drawer.props;
  const drawerWidth = drawer.getDrawerWidth();
  const props = drawer.getProps();
  /**
   * We need to use the "original" drawer position here
   * as RTL turns position left and right on its own
   **/
  const posRight = drawer.isPositionRight();
  const dynamicDrawerStyles = {
    backgroundColor: Colors.isValid(props.backgroundColor) ? props.backgroundColor : theme.colors.surface,
    width: drawerWidth,
    left: !posRight ? 0 : null,
    right: posRight ? 0 : null,
  } as IDict;
  /* Drawer styles */
  const outputRange = permanent ? [0, 0] : drawer.getDrawerPosition() === "left" ? [-drawerWidth, 0] : [drawerWidth, 0];
  const drawerTranslateX = openValue.interpolate({
    inputRange: [0, 1],
    outputRange,
    extrapolate: "clamp",
  });
  const animatedDrawerStyles = {
    transform: [{ translateX: drawerTranslateX }],
  };

  /* Overlay styles */
  const overlayOpacity = openValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
    extrapolate: "clamp",
  });
  const animatedOverlayStyles = { opacity: overlayOpacity };
  const pointerEvents = drawerShown || permanent ? "auto" : "none";
  const Wrapper = drawer.isProvider() ? Portal : React.Fragment;
  const canRender = drawer.isProvider() ? drawer.isOpen() : true;
  return (
    <Wrapper>
      <DrawerContext.Provider value={{ drawer }}>
        <View id={drawer.id} testID={testID} style={[{ flex: (canRender && 1) || 0, backgroundColor: "transparent", flexDirection: permanent ? "row" : "column" }, canRender ? styles.providerVisibleContainer : styles.providerNotVisibleContainer]} {...drawer._panResponder.panHandlers}>
          {!permanent ? (
            <TouchableWithoutFeedback style={[{ pointerEvents }, styles.permanentBackdrop]} testID={testID + "-backdrop-container"} onPress={drawer._onOverlayClick.bind(drawer)}>
              <Animated.View testID={testID + "-backdrop"} ref={drawer._backdropRef} style={[styles.overlay, { backgroundColor: theme.colors.backdrop }, { pointerEvents }, animatedOverlayStyles]} />
            </TouchableWithoutFeedback>
          ) : null}
          {posRight ? content : null}
          <Animated.View testID={testID + "drawer-navigation-container"} ref={mergeRefs(navigationViewRef, drawer._navigationViewRef)} accessibilityViewIsModal={accessibilityViewIsModal} style={[styles.drawer, dynamicDrawerStyles, elev, animatedDrawerStyles, permanent ? { position: "relative" } : null]}>
            {children}
          </Animated.View>
          {!posRight ? content : null}
        </View>
      </DrawerContext.Provider>
    </Wrapper>
  );
};

DrawerChildren.displayName = "DrawerChildren";
