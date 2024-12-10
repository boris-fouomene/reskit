import React, { Fragment, ReactNode, useMemo } from "react";
import { mergeRefs } from "@utils/mergeRefs";
import { ObservableComponent } from "@utils/index";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { IDict, IObservable, IObservableEvent, uniqid } from "@resk/core";
import { canBeMinimizedOrPermanent } from "./utils";
import { isValidElement } from "@utils";
import Breakpoints from "@breakpoints";
import { Animated, Dimensions, Keyboard, PanResponder, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent, PanResponderGestureState, I18nManager } from "react-native";
import { Portal } from "@components/Portal";
import View from "@components/View";
import { Colors, useTheme } from "@theme";
import { getDrawerWidth, E_DRAWER_EVENTS } from "./utils";
import FontIcon from "@components/Icon/Font";
import { Tooltip } from "@components/Tooltip";
import { IDrawer, IDrawerContext, IDrawerPosition, IDrawerProps, IDrawerProviderProps, IDrawerState, IDrawerStateOptions } from "./types";
import { DrawerContext } from "./hooks";
import { ISessionStorage } from "@resk/core/build/session";
import { IAuthSessionStorage } from "@src/auth/types";
import { getAuthSessionStorage } from "@src/auth/session";

const MIN_SWIPE_DISTANCE = 3;

const VX_MAX = 0.1;

const IDLE = "Idle";
const DRAGGING = "Dragging";
const SETTLING = "Settling";

export default class Drawer extends ObservableComponent<IDrawerProps, IDrawerState> implements IDrawer {
  _lastOpenValue: any = null;
  readonly id = uniqid(this.isProvider() ? "drawerProviderId-" : "drawerId-");
  readonly _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: this._shouldSetPanResponder.bind(this),
    onPanResponderGrant: this._panResponderGrant.bind(this),
    onPanResponderMove: this._panResponderMove.bind(this),
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: this._panResponderRelease.bind(this),
    onPanResponderTerminate: () => { },
  });
  _isClosing: boolean = false;
  _isTogglingFullScreen: boolean = false;
  _closingAnchorValue: number = 0;
  _navigationViewRef: any = React.createRef();
  _backdropRef: any = React.createRef();
  constructor(props: IDrawerProps) {
    super(props);
    const isProvider = !!props.isProvider;
    const permSession = this.getSession("permanent");
    let permanent = typeof props.permanent == "boolean" ? props.permanent : typeof permSession === "boolean" ? permSession : !this.isProvider() && canBeMinimizedOrPermanent();
    if (!canBeMinimizedOrPermanent()) {
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
  isMinimizable(): boolean {
    return !!this.getProps().minimizable;
  }
  /***
   * override de la fonction trigger définie dans l'overvateur d'évènement
   */
  trigger(event: IObservableEvent, ...args: any[]): IObservable | null {
    return super.trigger(event, {
      ...this.getStateOptions(),
      eventName: event,
    });
  }
  pin(callback?: (options: IDrawerStateOptions) => any): void {
    this.setPermanent(true, callback);
  }
  unpin(callback?: (options: IDrawerStateOptions) => any): void {
    this.setPermanent(false, callback);
  }
  isPinned() {
    return this.isPermanent();
  }
  /***
   * fait passer le drawer en mode permanentement
   */
  setPermanent(permanent: boolean, callback?: (options: IDrawerStateOptions) => any): void {
    if ((!this.canPin() && !this.isPermanent()) || this.isPermanent() === permanent) {
      if (callback) callback(this.getStateOptions());
      return;
    }
    const cb2 = () => {
      this.setState({ permanent }, () => {
        const options = this.getStateOptions();
        this.trigger(E_DRAWER_EVENTS.PERMANENT, options);
        this.setSession(E_DRAWER_EVENTS.PERMANENT, permanent);
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
  /***
   * permet de minimiser le drawer
   */
  setMinimized(minimized: boolean, callback?: (options: IDrawerStateOptions) => any) {
    const options = this.getStateOptions();
    if (!canBeMinimizedOrPermanent()) {
      if (callback) callback(options);
      return;
    }
    this.setState({ minimized }, () => {
      this.trigger(E_DRAWER_EVENTS.MINIMIZED, options);
      this.setSession(E_DRAWER_EVENTS.MINIMIZED, minimized);
      if (callback) {
        callback(options);
      }
    });
  }
  isMinimized(): boolean {
    if (!this.isProvider() && !canBeMinimizedOrPermanent()) return false;
    return this.isMinimizable() && !!(this.isProvider() ? this.state.providerProps.minimized : this.state.minimized);
  }
  isPermanent(): boolean {
    return this.isProvider() ? false : this.getProps().permanent || false;
  }
  getStateOptions(drawerState?: IDrawerStateOptions): IDrawerStateOptions {
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
      canPin: this.canPin(),
    };
  }
  /***
   * cette méthode permet d'ouvrir et de fermer le drawer
   */
  toggle(callback?: (options: IDrawerStateOptions) => void) {
    const cb = () => {
      const options = this.getStateOptions();
      this.trigger(E_DRAWER_EVENTS.TOGGLE, options);
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
  isProvider() {
    return !!this.state?.isProvider;
  }
  getDeviceWidth(): number {
    return Math.max(Dimensions.get("window").width, 280);
  }
  getDrawerPosition() {
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
  isPositionRight() {
    return this.getDrawerPosition() === "right";
  }
  isOpen() {
    return this.state.drawerShown;
  }

  isClosed() {
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
        this.props.onDrawerSlide(this.getStateOptions({ nativeEvent: { offset: value } } as IDrawerStateOptions));
      }
    });
  }
  renderNavigationView() {
    if (this.props.renderNavigationView) {
      return this.props.renderNavigationView(this.getStateOptions());
    }
    return null;
  }
  /***
   * si le mode du drawer petu passer de permanent à temporaire et vice verça
   */
  canPin() {
    return canBeMinimizedOrPermanent();
  }
  getProps(): Partial<IDrawerProps & IDrawerState> {
    return this.isProvider() ? this.state.providerProps || {} : { ...this.props, ...this.state };
  }
  getTestID() {
    return this.getProps()?.testID || this.isProvider() ? "resk-drawer-provider" : "resk-drawer";
  }
  isFullScreen() {
    return !!this.state.fullScreen;
  }
  canToggleFullScren() {
    return !Breakpoints.isMobileMedia();
  }
  toggleFullScreen() {
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
  getProviderAppBarProps(handleDrawerWidth?: boolean) {
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
  getSessionName() {
    return this.getProps()?.sessionName || this.isProvider() ? "drawer-provider" : "drawer";
  }
  /***
   * retourne le min entre la dimension de l'écran et la prop drawerWidth passée en paramètre
   */
  getDrawerWidth(fullScreen?: boolean) {
    fullScreen = fullScreen || this.state.fullScreen;
    if (fullScreen || (this.isProvider() && Breakpoints.isMobileMedia())) {
      return Dimensions.get("window").width;
    }
    const props = this.getProps();
    return Math.min(typeof props?.drawerWidth == "number" ? props?.drawerWidth : getDrawerWidth(this.isProvider()));
  }
  get session(): IAuthSessionStorage {
    return getAuthSessionStorage(this.getSessionName());
  }
  getSession(key?: string): any {
    return this.session.get(key);
  }
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
    //this.trigger(E_DRAWER_EVENTS.STATE_CHANGED, this.getStateOptions());
  }

  /***
   *
   */
  open(options: IDrawerProviderProps = {}, resetProviderProps: boolean | Function = false): void {
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
        this.trigger(E_DRAWER_EVENTS.OPENED, this.getStateOptions());
        if (typeof resetProviderProps == "function") {
          resetProviderProps = resetProviderProps(this.getStateOptions());
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
      resetProviderProps = options?.resetProvider !== false || resetProviderProps;
      this.setState(
        {
          providerProps: resetProviderProps
            ? Object.assign({}, options, { resetProvider: resetProviderProps })
            : {
              ...Object.assign({}, this.state.providerProps),
              ...options,
              resetProvider: resetProviderProps,
            },
        },
        cb
      );
    } else {
      cb();
    }
  }

  /***
   * permet de fermer le drawer en cours d'exécution
   */
  close(options?: IDrawerProviderProps, callback?: Function): void {
    options = Object.assign({}, options);
    this._emitStateChanged(SETTLING);
    callback = typeof callback == "function" ? callback : options?.callback;
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * A callback function that is called when the drawer is closed. It is used to cleanup and emit the CLOSED event.
     * @param {IDrawerStateOptions} options - The options passed to the drawer.
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
      this.trigger(E_DRAWER_EVENTS.CLOSED, this.getStateOptions());
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
            <TouchableWithoutFeedback style={{ pointerEvents }} testID={testID + "-backdrop-container"} onPress={drawer._onOverlayClick.bind(drawer)}>
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
