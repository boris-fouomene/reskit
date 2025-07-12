"use client";
import { createContext, createRef, Fragment, ReactElement, ReactNode, Ref, RefObject, useContext } from "react";
import { Breakpoints, cn, createProvider, ObservableComponent } from "@utils/index";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { defaultStr, isNumber, isObj } from "@resk/core/utils";
import i18n from "@resk/core/i18n";
import { isValidElement } from "react";
import { Animated, Dimensions, Keyboard, PanResponder, GestureResponderEvent, PanResponderGestureState, I18nManager, ViewProps, View } from "react-native";
import FontIcon from "@components/Icon/Font";
import { Tooltip } from "@components/Tooltip";
import Platform from "@platform";
import Session from "@resk/core/session";
import { Div } from "@html/Div";
import { Backdrop } from "@components/Backdrop";
import { IClassName, IReactNullableElement } from "@src/types";
import { INavItemProps, INavItemsProps, Nav } from "@components/Nav";
import { Modal } from "@components/Modal";
import { IModalProps } from "@components/Modal/types";
import { IIconVariant } from "@variants/icon";

const useNativeDriver = Platform.canUseNativeDriver();
const MIN_SWIPE_DISTANCE = 3;

const VX_MAX = 0.1;

const IDLE = "Idle";
const DRAGGING = "Dragging";
const SETTLING = "Settling";


export class Drawer extends ObservableComponent<IDrawerProps, IDrawerState, IDrawerEvent> {
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
   * @type {RefObject<any>}
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
    Object.assign(this.state, { children: this.prepareChildrenState(props) });
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
    if (this.isProvider()) return;
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
   * Determines if the drawer can be pinned (minimized or set to permanent mode.).
   * The function checks if the current media matches the desktop breakpoint.
   * @returns {boolean} - Returns true if the drawer can be minimized or set to permanent, otherwise false.
   */
  canBePinned(): boolean {
    return this.canBeMinimizedOrPermanent();
  }

  getComponentProps(): Partial<IDrawerProps> {
    return this.isProvider() && isObj(this.state.providerOptions) ? this.state.providerOptions : this.props;
  }

  getTestID(): string {
    return defaultStr(this.getComponentProps().testID, this.isProvider() ? "resk-drawer-provider" : "resk-drawer");
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

  prepareChildrenState(props?: IDrawerProps): IReactNullableElement {
    const { children } = (isObj(props) ? props : this.getComponentProps());
    const child = typeof children == "function" ? children(this.getCallOptions()) : children;
    return isValidElement(child) ? child : null;
  }
  componentDidUpdate(prevProps: Readonly<IDrawerProps>, nextContext: any): void {
    if (this.props.children != prevProps.children && !this.isProvider()) {
      this.setState({ children: this.prepareChildrenState(prevProps) } as IDrawerState);
    }
  }
  renderHeader(): ReactNode {
    const { appBarProps, withAppBar } = this.getComponentProps();
    if (withAppBar === false || !isObj(appBarProps)) return null;
    const testID = this.getTestID();
    return <AppBar
      testID={testID + "drawer-header"}
      onBackActionPress={(event: GestureResponderEvent) => {
        this.close();
        return false;
      }}
      backAction={(opts) => {
        const { className, handleBackPress, computedAppBarVariant } = opts;
        const elt = typeof appBarProps?.backAction == "function" ? appBarProps.backAction(opts as any) : appBarProps?.backAction;
        return (
          <>
            {isValidElement(elt) ? elt : <AppBar.BackAction onPress={handleBackPress} className={className} fontIconName={(this.getDrawerPosition() == "left" ? "chevron-left" : "chevron-right") as never} />}
            {this.canToggleFullScren() ? <Tooltip onPress={this.toggleFullScreen.bind(this)} title={i18n.t("components.drawer.toggleFullScreen")} children={<FontIcon className={computedAppBarVariant.icon()} name={(this.isFullScreen() ? "fullscreen-exit" : "fullscreen") as never} size={20} />} /> : null}
          </>
        );
      }}
      actionsProps={{ ...appBarProps?.actionsProps, viewportWidth: this.getDrawerWidth() }}
      {...appBarProps}
      context={{ ...appBarProps?.context, drawer: this }}
    />;
  }


  getSessionName(): string {
    return this.getComponentProps()?.sessionName || this.isProvider() ? "drawer-provider" : "drawer";
  }

  getDrawerWidth(): number {
    if (this.isProvider()) {
      const fullScreen = this.state.fullScreen;
      if (fullScreen || (this.isProvider() && Breakpoints.getDeviceLayout().isMobile)) {
        return Dimensions.get("window").width;
      }
    }
    const props = this.getComponentProps();
    return Math.min(isNumber(props.drawerWidth) && props.drawerWidth > 0 ? props?.drawerWidth : this.getDrawerWidth());
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
    const { contentClassName, className } = this.getComponentProps();
    const { accessibilityViewIsModal, drawerShown, openValue } = this.state;
    const testID = this.getTestID();
    const permanent = this.isPermanent();
    const drawerWidth = this.getDrawerWidth();

    const posRight = this.isPositionRight();
    const outputRange = permanent ? [0, 0] : this.getDrawerPosition() === "left" ? [-drawerWidth, 0] : [drawerWidth, 0];
    const drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: "clamp",
    });
    const Wrapper = this.isProvider() ? Modal : Fragment;
    const wrapperProps = this.isProvider() ? { testID: testID + "-portal", animationType: "none", visible: this.isOpen() } as IModalProps : {};
    return (
      <Wrapper {...wrapperProps}>
        <DrawerContext.Provider value={{ drawer: this }}>
          <View testID={testID} className={cn("h-full flex-1 flex-col", className)} {...this._panResponder.panHandlers}>
            {!permanent ? (<Backdrop testID={testID + "-backdrop"} />) : null}
            <Animated.View
              testID={testID + "animated-content"}
              accessibilityViewIsModal={accessibilityViewIsModal}
              className={cn("resk-drawer-animated")}
              style={[
                permanent ? { position: "relative" } : { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
                {

                  pointerEvents: "auto",
                  flex: 1,
                  width: drawerWidth,
                  left: !posRight ? 0 : null,
                  right: posRight ? 0 : null,
                  transform: [{ translateX: drawerTranslateX }],
                }
              ]}
            >
              <Div className={cn("flex-1 w-full h-full flex-col", contentClassName)} testID={testID + "drawer-content"}>
                {this.renderHeader()}
                {this.isProvider() && this.state.providerOptions ? this.state.providerOptions.children : this.state.children}
              </Div>
            </Animated.View>
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
    const options = this.getCallOptions({ newState });
    if (this.props.onDrawerStateChanged) {
      this.props.onDrawerStateChanged(options);
    }
    this.trigger("state_changed", options);
  }

  open(options?: IDrawerProps, callback?: IDrawerCallback): Drawer {
    const cb = () => {
      const callOptions = this.getCallOptions();
      this._emitStateChanged(SETTLING);
      Animated.spring(this.state.openValue, {
        toValue: 1,
        bounciness: 0,
        restSpeedThreshold: 0.1,
        useNativeDriver,
      }).start(() => {
        this._emitStateChanged(IDLE);
        this.trigger("opened", callOptions);
        if (typeof callback == "function") {
          callback(callOptions);
        }
        const { onDrawerOpen } = this.getComponentProps();
        if (typeof onDrawerOpen === "function") {
          onDrawerOpen(callOptions);
        }
      });
    }
    if (this.isProvider() && isObj(options) && options) {
      this.setState({ providerOptions: { ...options, children: options.children ? this.prepareChildrenState(options) : this.state.providerOptions?.children } }, cb);
    } else {
      cb();
    }
    return this;
  }

  close(callback?: IDrawerCallback): Drawer {
    this._emitStateChanged(SETTLING);
    callback = typeof callback == "function" ? callback : undefined;
    const callOptions = this.getCallOptions();
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
  static Items = DrawerItems;
  static Item = DrawerItem;
  static ExpandableItem = ExpandableDrawerItem;
  static get Provider() {
    return DrawerProvider;
  }
}


class _DrawerProvider extends Drawer { isProvider(): boolean { return true; } }
class DrawerProvider extends createProvider<IDrawerProps, _DrawerProvider, IDrawerProps>(_DrawerProvider, { permanent: false }, (options) => {
  options.permanent = typeof options.permanent === 'boolean' ? options.permanent : false;
  return options;
}) { }

DrawerProvider.displayName = "Drawer.Provider";

const DrawerContext = createContext<IDrawerContext>({} as IDrawerContext);


export const useDrawer = (): IDrawerContext | null => {
  const context = useContext(DrawerContext);
  return context?.drawer instanceof Drawer ? context : null;
};






function DrawerItem({
  active: customActive,
  testID,
  section,
  style,
  iconProps,
  onPress: customOnPress,
  closeOnPress,
  className,
  ...rest
}: IDrawerItemProps) {
  const drawerContext = useDrawer();
  if (!drawerContext) return null;
  const { drawer } = drawerContext;
  const minimized = drawer.isMinimized();
  const clx = section ? "resk-drawer-item-section" : "resk-drawer-item";
  iconProps = Object.assign({}, iconProps);
  iconProps.variant = Object.assign({}, iconProps.variant);
  iconProps.variant.size = minimized ? MINIMIZED_ICON_SIZE : iconProps.variant.size || ICON_SIZE_VARIANT;
  testID = defaultStr(testID, clx);
  return <Nav.Item
    context={drawerContext}
    onPress={async (event, context) => {
      const callback = () => {
        if (typeof customOnPress === 'function') {
          return customOnPress(event, context);
        }
      };
      closeOnPress !== false ? drawer?.close(callback) : callback();
    }}
    testID={testID}
    iconProps={{ ...iconProps, className: cn(minimized && "items-center", iconProps?.className) }}
    {...rest}
    label={minimized ? undefined : rest.label}
    className={cn(clx, minimized && clx + "-minimized", className)}
  />
};


DrawerItem.displayName = 'Drawer.Item';



function ExpandableDrawerItem({ testID, context, items, divider, expandableProps, ...rest }: IDrawerItemProps) {
  const drawerContext = useDrawer();
  if (!drawerContext) return null;
  const { drawer } = drawerContext;
  testID = defaultStr(testID, "resk-drawer-expandable-item")
  const minimized = drawer.isMinimized();
  expandableProps = Object.assign({}, expandableProps);
  const { expandedIconProps: customExpandedIconProps, collapsedIconProps: customCollapsedIconProps, ...restExpandableProps } = expandableProps;
  const expandedIconProps = Object.assign({}, customCollapsedIconProps),
    collapsedIconProps = Object.assign({}, customExpandedIconProps);
  expandedIconProps.variant = Object.assign({}, expandedIconProps.variant);
  collapsedIconProps.variant = Object.assign({}, collapsedIconProps.variant);
  expandedIconProps.variant.size = minimized ? MINIMIZED_ICON_SIZE : expandedIconProps.variant.size || ICON_SIZE_VARIANT;
  collapsedIconProps.variant.size = minimized ? ICON_SIZE_VARIANT : collapsedIconProps.variant.size || ICON_SIZE_VARIANT;
  return <Nav.ExpandableItem
    {...rest}
    context={Object.assign({}, context, { drawer })}
    expandableProps={{ ...restExpandableProps, expandedIconProps, collapsedIconProps }}
    as={DrawerItem}
    testID={testID}
  />
}


function DrawerItems(props: IDrawerItemsProps) {
  return <Nav.Items
    testID="resk-drawer-items"
    {...props}
    renderExpandableItem={renderExpandableDrawerItem}
    renderItem={renderDrawerItem}
    className={cn(props.className, "resk-drawer-items")}
  />
};

DrawerItems.displayName = "Drawer.Items";
DrawerItem.displayName = "Drawer.Item";

ExpandableDrawerItem.displayName = "Drawer.ExpandableItem";


function renderDrawerItem(item: IDrawerItemProps, index: number) {
  return <DrawerItem {...item} key={index} />;
}
function renderExpandableDrawerItem(item: IDrawerItemProps, index: number) {
  return <ExpandableDrawerItem {...item} key={index} />;
}
const ICON_SIZE_VARIANT: IIconVariant["size"] = "25px";

const MINIMIZED_ICON_SIZE: IIconVariant["size"] = "35px";



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

  providerOptions?: Omit<IDrawerProps, "children"> & { children?: IReactNullableElement };

  children?: IReactNullableElement;
}


export interface IDrawerProps extends Omit<ViewProps, "ref" | "children"> {
  /**
   * Determines if the drawer can be minimized.
   * @default false
   */
  minimizable?: boolean;


  children?: IReactNullableElement | ((options: IDrawerCallbackOptions) => IReactNullableElement);



  ref?: Ref<Drawer>

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


  onDrawerStateChanged?: (options: IDrawerCallbackOptions<{ newState: string }>) => any;

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

  /***
   * make the drawer update its state when the window is resized.
   * @default true
   */
  bindResizeEvent?: boolean;

  appBarProps?: IAppBarProps<IDrawerContext>;

  withAppBar?: boolean;

  contentClassName?: IClassName;
}


export type IDrawerCallbackOptions<Options extends Record<string, any> = {}> = Options & {
  drawer: Drawer;
}
export interface IDrawerContext {
  drawer: Drawer;
}
export type IDrawerCallback = (options: IDrawerCallbackOptions) => void;



/**
 * Represents the position of the drawer component.
 * 
 * @typedef {("left" | "right" | undefined)} IDrawerPosition
 * 
 * @property {"left"} left - The drawer is positioned on the left side.
 * @property {"right"} right - The drawer is positioned on the right side.
 * @property {undefined} undefined - The drawer position is not defined.
 */
export type IDrawerPosition = "left" | "right" | undefined;



/**
 * Interface representing a drawer session.
 */
export interface IDrawerSession {
  /**
   * Optional name of the session.
   */
  sessionName?: string;

  /**
   * Gets the name of the session.
   */
  get name(): string;

  /**
   * Retrieves a value associated with the given key.
   * @param a - The key to retrieve the value for.
   * @returns The value associated with the key.
   */
  get: (a: string) => any;

  /**
   * Sets a value for the given key or updates multiple values.
   * @param a - The key to set the value for, or an object containing multiple key-value pairs to update.
   * @param b - The value to set for the given key.
   * @returns The result of the set operation.
   */
  set: (a: string | object, b: any) => any;
};



export interface IDrawerItemsProps extends INavItemsProps<IDrawerContext> {

}

export interface IDrawerItemProps extends INavItemProps<IDrawerContext> {
  active?: boolean | ((options: IDrawerContext) => boolean);
  isRendable?: boolean;
}


export type IDrawerEvent = "minimized" | "permanent" | "toggle" | "state_changed" | "opened" | "closed";