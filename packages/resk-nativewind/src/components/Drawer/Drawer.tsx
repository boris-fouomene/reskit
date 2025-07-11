"use client";
import { createRef, FC, Fragment, ReactElement, ReactNode, useMemo } from "react";
import { mergeRefs } from "@utils/mergeRefs";
import { Breakpoints, cn, ObservableComponent } from "@utils/index";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { defaultStr, isNumber, isObj, uniqid } from "@resk/core/utils";
import i18n from "@resk/core/i18n";
import { IDict } from "@resk/core/types";
import { isValidElement } from "@utils";
import { Animated, Dimensions, Keyboard, PanResponder, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent, PanResponderGestureState, I18nManager, ViewProps, View } from "react-native";
import { Portal } from "@components/Portal";
import { getDrawerWidth } from "./utils";
import FontIcon from "@components/Icon/Font";
import { Tooltip } from "@components/Tooltip";
import { IDrawerContext, IDrawerPosition, IDrawerCurrentState, IDrawerEvent } from "./types";
import { DrawerContext } from "./hooks";
import Platform from "@platform";
import Session from "@resk/core/session";
import { Div } from "@html/Div";
import { Backdrop } from "@components/Backdrop";

const useNativeDriver = Platform.canUseNativeDriver();
const MIN_SWIPE_DISTANCE = 3;

const VX_MAX = 0.1;

const IDLE = "Idle";
const DRAGGING = "Dragging";
const SETTLING = "Settling";

export default class Drawer extends ObservableComponent<IDrawerProps, IDrawerState, IDrawerEvent> {
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
  //readonly id = uniqid(this.isProvider() ? "drawerProviderId-" : "drawerId-");
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
  _navigationViewRef: any = createRef();
  readonly _dimensionChangedListener = Dimensions.addEventListener('change', this._onDimensionsChanged.bind(this));
  constructor(props: IDrawerProps) {
    super(props);
    const permSession = this.getSession("permanent");
    let permanent = typeof props.permanent == "boolean" ? props.permanent : typeof permSession === "boolean" ? permSession : !this.isProvider() && this.canBeMinimizedOrPermanent();
    if (!this.canBeMinimizedOrPermanent()) {
      permanent = false;
    }
    const drawerShown = !this.isProvider() && permanent ? true : false;
    const minimized = typeof this.props.minimized === "boolean" ? this.props.minimized : this.getSession("minimized");
    this.state = {
      accessibilityViewIsModal: false,
      drawerShown,
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
    return !!this.getComponentProps().minimizable;
  }

  /**
   * Sets the drawer to be permanent.
   *
   * @param callback - An optional callback function that receives the drawer state options after the permanent state is set.
   */
  pin(callback?: IDrawerCallback): void {
    this.setPermanent(true, callback);
  }

  /**
   * Sets the drawer to be non-permanent.
   *
   * @param callback - An optional callback function that receives the drawer state options after the permanent state is set.
   */
  unpin(callback?: IDrawerCallback): void {
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
  _setState<K extends keyof IDrawerState>(state: IDrawerState | ((prevState: Readonly<IDrawerState>, props: Readonly<IDrawerProps>) => IDrawerState | Pick<IDrawerState, K> | null) | Pick<IDrawerState, K> | null, callback?: () => void): void {
    return super.setState(state, callback);
  }
  getCallOptions<T extends Record<string, any> = {}>(options?: T): IDrawerCallbackOptions<T> {
    return Object.assign({}, options, { drawer: this });
  }
  setPermanent(permanent: boolean, callback?: IDrawerCallback): void {
    const options = this.getCallOptions()
    if ((!this.canBePinned() && !this.isPermanent()) || this.isPermanent() === permanent) {
      if (typeof callback == "function") callback(options);
      return;
    }
    const cb2 = () => {
      this.setState({ permanent }, () => {
        this.trigger("permanent", this);
        this.setSession("permanent", permanent);
        if ((typeof callback == "function")) {
          callback(options);
        }
      });
    };
    if (permanent) {
      this.open(undefined, cb2);
    } else {
      cb2();
    }
  }

  setMinimized(minimized: boolean, callback?: IDrawerCallback) {
    const options = this.getCallOptions()
    if (!this.canBeMinimizedOrPermanent()) {
      if ((typeof callback == "function")) callback(options);
      return;
    }
    this.setState({ minimized }, () => {
      this.trigger("minimized", this);
      this.setSession("minimized", minimized);
      if ((typeof callback == "function")) {
        callback(options);
      }
    });
  }
  canBeMinimizedOrPermanent(): boolean {
    return !!Breakpoints.getDeviceLayout()?.isDesktop;
  }
  isMinimized(): boolean {
    if (!this.isProvider() && !this.canBeMinimizedOrPermanent()) return false;
    return this.isMinimizable() && !!(this.state.minimized);
  }
  isPermanent(): boolean {
    return this.isProvider() ? false : this.state.permanent || false;
  }


  toggle(callback?: IDrawerCallback) {
    const cb = () => {
      const context = this;
      this.trigger("toggle", context);
      if (callback) {
        callback(this.getCallOptions());
      }
    };
    if (this.isPermanent()) {
      cb();
      return;
    }
    if (this.isOpen()) {
      this.close(cb);
    } else {
      this.open(undefined, cb);
    }
  }
  /**
   * Checks if the drawer is a provider.
  * @returns True if the drawer is a provider, false otherwise.
  */
  isProvider() {
    return false;
  }

  getDeviceWidth(): number {
    const w = Dimensions.get("window").width;
    return w > 280 ? w : Math.min(280, w);
  }


  getDrawerPosition(): IDrawerPosition {
    const rtl = I18nManager.isRTL;
    let position: IDrawerPosition = this.getComponentProps()?.position;
    if (position !== "left" && position !== "right") {
      if (this.isProvider()) {
        position = rtl ? "left" : "right";
      }
    }
    return rtl
      ? position === "left"
        ? "right"
        : "left" // invert it
      : position;
  }

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
  componentWillUnmount(): void {
    super.componentWillUnmount();
    this._dimensionChangedListener?.remove();
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
        this.props.onDrawerSlide(this.getCallOptions());
      }
    });
  }
  /**
   * Renders the navigation view of the drawer.
   *
   * @returns The navigation view or null if no renderNavigationView prop is provided.
   */
  renderNavigationView() {
    if (typeof this.props.renderNavigationView === "function") {
      return this.props.renderNavigationView(this.getCallOptions());
    }
    return null;
  }

  /**
   * Determines if the drawer can be pinned (minimized or set to permanent mode.).
   * The function checks if the current media matches the desktop breakpoint.
   * @returns {boolean} - Returns true if the drawer can be minimized or set to permanent, otherwise false.
   */
  canBePinned(): boolean {
    return this.canBeMinimizedOrPermanent();
  }

  getComponentProps(): Partial<IDrawerProps> {
    return this.props;
  }

  getTestID(): string {
    return defaultStr(this.props.testID, "resk-drawer");
  }

  /**
   * Checks if the drawer is in full-screen mode.
   *
   * @returns {boolean} Returns `true` if the drawer is in full-screen mode, otherwise `false`.
   */
  isFullScreen(): boolean {
    return !!this.state.fullScreen;
  }


  canToggleFullScren(): boolean {
    return this.isProvider() && !this.canBeMinimizedOrPermanent();
  }

  /**
   * Toggles the full-screen mode of the drawer component.
   * 
   * This method animates the `openValue` state using a spring animation to transition
   * to the full-screen mode. The animation configuration includes properties such as
   * `bounciness`, `restSpeedThreshold`, and `useNativeDriver`.
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
      useNativeDriver,
    }).start(() => {
      this.setState({ fullScreen: !this.state.fullScreen }, () => {
        this._isTogglingFullScreen = false;
      });
    });
  }

  getProviderAppBarProps(handleDrawerWidth?: boolean): IAppBarProps {
    const testID = this.getTestID();
    const props = this.getComponentProps();
    const appBarProps = Object.assign({}, props.appBarProps);
    return Object.assign(
      {},
      {
        testID: testID + "drawer-title-container",
        windowWidth: handleDrawerWidth !== false ? this.getDrawerWidth() : undefined,
        onBackActionPress: (event: GestureResponderEvent) => {
          this.close();
          return false;
        },
        backAction: (opts) => {
          const { className, handleBackPress, computedAppBarVariant } = opts;
          const elt = typeof appBarProps?.backAction == "function" ? appBarProps.backAction(opts as any) : appBarProps.backAction;
          return (
            <>
              {isValidElement(elt) ? elt : <AppBar.BackAction fontIconName={(this.getDrawerPosition() == "left" ? "chevron-left" : "chevron-right") as never} />}
              {this.canToggleFullScren() ? <Tooltip onPress={this.toggleFullScreen.bind(this)} title={i18n.t("components.drawer.toggleFullScreen")} children={<FontIcon className={computedAppBarVariant.icon()} style={styles.toggleFullScreenIcon} name={(this.isFullScreen() ? "fullscreen-exit" : "fullscreen") as never} size={20} />} /> : null}
            </>
          );
        },
      } as IAppBarProps,
      appBarProps
    );
  }

  renderTitle(): ReactNode {
    const { appBar } = this.getComponentProps();
    if (appBar === false) return null;
    const appBarProps = this.getProviderAppBarProps();
    if (appBar) {
      const aBar: ReactNode = typeof appBar == "function" ? appBar({ drawer: this, appBarProps }) : appBar;
      return isValidElement(aBar) ? aBar : null;
    }
    return <AppBar {...appBarProps} context={Object.assign({}, appBarProps?.context, { drawer: this })} />;
  }

  renderChildren(): ReactNode {
    const { children } = this.getComponentProps();
    return (
      <>
        {this.renderTitle()}
        <>{isValidElement(children) ? children : null}</>
      </>
    );
  }


  renderContent() {
    return (
      <Div className={cn("flex-1 w-full h-full")} testID={this.getTestID() + "drawer-content"}>
        {this.props.children}
      </Div>
    );
  }


  getSessionName(): string {
    return this.getComponentProps()?.sessionName || this.isProvider() ? "drawer-provider" : "drawer";
  }


  getDrawerWidth(fullScreen?: boolean): number {
    fullScreen = fullScreen || this.state.fullScreen;
    if (fullScreen || (this.isProvider() && Breakpoints.getDeviceLayout().isMobile)) {
      return Dimensions.get("window").width;
    }
    const props = this.getComponentProps();
    return Math.min(isNumber(props.drawerWidth) && props.drawerWidth > 0 ? props?.drawerWidth : getDrawerWidth(this.isProvider()));
  }

  /**
   * Retrieves a session value associated with the given key.
   *
   * @param {string} [key] - The key of the session value to retrieve. If no key is provided, the entire session is returned.
   * @returns {any} The session value associated with the provided key, or the entire session if no key is provided.
   */
  getSession(key: string): any {
    return Session.get(key);
  }

  setSession(key: string, value?: any): any {
    return Session.set(key, value);
  }
  render() {
    const { children, navigationViewRef, ...drawerProps } = this.getComponentProps();
    const content = this.renderContent();
    const { accessibilityViewIsModal, drawerShown, openValue } = this.state;
    const testID = this.getTestID();
    const permanent = this.isPermanent();
    const drawerWidth = this.getDrawerWidth();
    /**
     * We need to use the "original" drawer position here
     * as RTL turns position left and right on its own
     **/
    const posRight = this.isPositionRight();
    const dynamicDrawerStyles = {
      width: drawerWidth,
      left: !posRight ? 0 : null,
      right: posRight ? 0 : null,
    } as IDict;
    /* Drawer styles */
    const outputRange = permanent ? [0, 0] : this.getDrawerPosition() === "left" ? [-drawerWidth, 0] : [drawerWidth, 0];
    const drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: "clamp",
    });
    const animatedDrawerStyles = {
      transform: [{ translateX: drawerTranslateX }],
    };

    const pointerEvents = drawerShown || permanent ? "auto" : "none";
    const Wrapper = this.isProvider() ? Portal : Fragment;
    const canRender = this.isProvider() ? this.isOpen() : true;
    const wrapperProps = this.isProvider() ? { absoluteFill: canRender, testID: testID + "-portal" } : {};
    return (
      <Wrapper {...wrapperProps}>
        <DrawerContext.Provider value={{ drawer: this }}>
          <View testID={testID} style={[{ flex: (canRender && 1) || 0, backgroundColor: "transparent", flexDirection: permanent ? "row" : "column" }, canRender ? styles.providerVisibleContainer : styles.providerNotVisibleContainer]} {...this._panResponder.panHandlers}>
            {!permanent ? (
              <TouchableWithoutFeedback style={[{ pointerEvents }, styles.permanentBackdrop]} testID={testID + "-backdrop-container"} onPress={this._onOverlayPress.bind(this)}>
                <Backdrop testID={testID + "-backdrop"} />
              </TouchableWithoutFeedback>
            ) : null}
            {posRight ? content : null}
            <Animated.View testID={testID + "drawer-navigation-container"} ref={mergeRefs(navigationViewRef, this._navigationViewRef)} accessibilityViewIsModal={accessibilityViewIsModal} style={[styles.drawer, dynamicDrawerStyles, animatedDrawerStyles, permanent ? { position: "relative" } : null]}>
              {children}
            </Animated.View>
            {!posRight ? content : null}
          </View>
        </DrawerContext.Provider>
      </Wrapper>
    );
  }

  _onOverlayPress(e: GestureResponderEvent): void {
    e.stopPropagation();
    const { onOverlayPress, closeOnOverlayClick } = this.getComponentProps();
    if (closeOnOverlayClick === false) return;
    if (typeof onOverlayPress === "function" && onOverlayPress(this.getCallOptions({ event: e })) === false) return;
    if (!this._isLockedClosed() && !this._isLockedOpen()) {
      this.close();
    }
  }
  _onDimensionsChanged() {
    if (this.props.bindResizeEvent !== false && !this.canBeMinimizedOrPermanent() && this.isPermanent()) {
      this.unpin();
    }
  }
  _emitStateChanged(newState: string): void {
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged({ newState, context: this });
    }
    this.trigger("state_changed", this.getCallOptions());
  }

  open(options: IDrawerProps = {}, callback: boolean | Function = false): Drawer {
    options = Object.assign({}, options);
    const callOptions = this.getCallOptions();
    const cb = () => {
      this._emitStateChanged(SETTLING);
      Animated.spring(this.state.openValue, {
        toValue: 1,
        bounciness: 0,
        restSpeedThreshold: 0.1,
        useNativeDriver,
        ...options,
      }).start(() => {
        this._emitStateChanged(IDLE);
        this.trigger("opened", callOptions);
        if (typeof callback == "function") {
          callback = callback(callOptions);
        }
        const { onDrawerOpen } = this.getComponentProps();
        if (typeof onDrawerOpen === "function") {
          onDrawerOpen(callOptions);
        }
      });
    };
    if (this.isProvider()) {
      this.setState({ providerProps: Object.assign({}, this.state.providerProps, options) },
        cb
      );
    } else {
      cb();
    }
    return this;
  }



  close(callback?: Function): Drawer {
    this._emitStateChanged(SETTLING);
    callback = typeof callback == "function" ? callback : undefined;
    const callOptions = this.getCallOptions();
    /******  f1cf9943-958c-4b60-8b76-104ac1d2c950  *******/
    const end = () => {
      if (typeof callback == "function") {
        callback(callOptions);
      }
      const { onDrawerClose } = this.getComponentProps();
      if (typeof onDrawerClose === "function") {
        onDrawerClose(callOptions);
      }
      this._emitStateChanged(IDLE);
      this.trigger("closed", callOptions);
    };
    if (!this.isPermanent() && this.isOpen()) {
      Animated.spring(this.state.openValue, {
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1,
        useNativeDriver,
      }).start(end);
    } else end();
    return this;
  }

  _handleDrawerOpen() {
    if (typeof this.props.onDrawerOpen === "function") {
      this.props.onDrawerOpen(this.getCallOptions());
    }
  }

  _handleDrawerClose() {
    if (typeof this.props.onDrawerClose === "function") {
      this.props.onDrawerClose(this.getCallOptions());
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
        this.open();
      } else if ((vx < 0 && moveX < THRESHOLD) || vx < -VX_MAX || (isWithinVelocityThreshold && !previouslyOpen)) {
        this.close();
      } else if (previouslyOpen) {
        this.open();
      } else {
        this.close();
      }
    } else {
      if ((vx < 0 && moveX < THRESHOLD) || vx <= -VX_MAX || (isWithinVelocityThreshold && previouslyOpen && moveX < THRESHOLD)) {
        this.open();
      } else if ((vx > 0 && moveX > THRESHOLD) || vx > VX_MAX || (isWithinVelocityThreshold && !previouslyOpen)) {
        this.close();
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
    pointerEvents: "auto",
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
    //marginLeft: 0,
  },
  permanentBackdrop: {
    backgroundColor: "transparent",
  }
});





export interface IDrawerState {
  /**
   * Indicates if the drawer's accessibility view is modal.
   */
  accessibilityViewIsModal: boolean;

  /**
   * Indicates if the drawer is currently shown.
   */
  drawerShown: boolean;

  /**
   * Indicates if the drawer is permanent.
   * Optional.
   */
  permanent?: boolean;

  /**
   * Indicates if the drawer is minimized.
   * Optional.
   */
  minimized?: boolean;

  /**
   * Animated value representing the open state of the drawer.
   */
  openValue: Animated.Value;

  /**
   * Width of the drawer.
   * Optional.
   */
  drawerWidth?: number;

  /**
   * Mode for dismissing the keyboard when interacting with the drawer.
   * Can be "none" or "on-drag".
   * Optional.
   */
  keyboardDismissMode?: "none" | "on-drag";

  /**
   * Callback function called when the drawer is closed.
   * Optional.
   */
  onDrawerClose?: IDrawerCallback;

  /**
   * Callback function called when the drawer is opened.
   * Optional.
   */
  onDrawerOpen?: IDrawerCallback;

  /**
   * Callback function called when the drawer is sliding.
   * Optional.
   */
  onDrawerSlide?: IDrawerCallback;

  /**
   * Indicates if the drawer is in full screen mode.
   * Optional.
   */
  fullScreen?: boolean;

  /**
   * Properties for the drawer provider.
   */
  providerProps?: IDrawerProps;
}


export interface IDrawerProps extends Omit<ViewProps, "ref"> {
  /**
   * Determines if the drawer can be minimized.
   * @default false
   */
  minimizable?: boolean;

  /**
   * Indicates if the drawer is currently minimized.
   * @default false
   */
  minimized?: boolean;

  /**
   * The name of the session used to persist the drawer's state.
   */
  sessionName?: string;

  /**
   * Specifies the lock mode of the drawer.
   * - "unlocked": The drawer can be opened and closed freely.
   * - "locked-closed": The drawer is locked in the closed position.
   * - "locked-open": The drawer is locked in the open position.
   */
  drawerLockMode?: "unlocked" | "locked-closed" | "locked-open" | undefined;

  /**
   * The position of the drawer.
   */
  position?: IDrawerPosition;

  /**
   * The width of the drawer.
   */
  drawerWidth?: number;

  /**
   * Function to get the state options of the drawer.
   * @param drawerState - The current state options of the drawer.
   * @returns The updated state options of the drawer.
   */
  getStateOptions?(drawerState?: IDrawerCurrentState): IDrawerCurrentState;

  /**
   * Determines if the drawer should close when clicking on the overlay.
   * This is only applicable when the drawer is in temporary mode.
   * @default false
   */
  closeOnOverlayClick?: boolean;

  /**
   * Specifies the keyboard dismiss mode.
   * - "none": The keyboard will not be dismissed.
   * - "on-drag": The keyboard will be dismissed when dragging the drawer.
   */
  keyboardDismissMode?: "none" | "on-drag";

  /**
   * Callback function triggered when the drawer is closed.
   * @param options - The state options of the drawer.
   */
  onDrawerClose?: IDrawerCallback;

  /**
   * Callback function triggered when the drawer is opened.
   * @param options - The state options of the drawer.
   */
  onDrawerOpen?: IDrawerCallback;

  /**
   * Callback function triggered when clicking on the overlay.
   * @param options - The state options of the drawer.
   */
  onOverlayPress?: (options: IDrawerCallbackOptions<{ event: GestureResponderEvent }>) => any;

  /**
   * Callback function triggered when the drawer is sliding.
   * @param options - The state options of the drawer.
   */
  onDrawerSlide?: IDrawerCallback;

  /**
   * Callback function triggered when the drawer state changes.
   * @param drawerState - The new state options of the drawer.
   */
  onDrawerStateChanged?: (drawerState: IDrawerCurrentState) => any;

  /**
   * Function to render the navigation view of the drawer.
   * @param drawerState - The current state options of the drawer.
   * @returns The React node to be rendered as the navigation view.
   */
  renderNavigationView?: (drawerState: IDrawerCurrentState) => React.ReactNode;

  /**
   * The background color of the status bar.
   */
  statusBarBackgroundColor?: string;

  /**
   * Determines if gestures are enabled for the drawer.
   * @default true
   */
  gesturesEnabled?: boolean;

  /**
   * The background color of the drawer.
   */
  backgroundColor?: string;

  /**
   * The elevation of the drawer.
   */
  elevation?: number;

  /**
   * Indicates if the drawer is permanent.
   * @default false
   */
  permanent?: boolean;

  /**
   * Reference to the navigation view.
   */
  navigationViewRef?: any;

  /***
   * make the drawer update its state when the window is resized.
   * @default true
   */
  bindResizeEvent?: boolean;

  appBarProps?: IAppBarProps<IDrawerContext>;

  appBar?: false | ReactElement | null | ((options: IDrawerContext & { appBarProps: IAppBarProps }) => ReactElement | null);
}


export type IDrawerCallbackOptions<Options extends Record<string, any> = {}> = Options & {
  drawer: Drawer;
}

export type IDrawerCallback = (options: IDrawerCallbackOptions) => void;