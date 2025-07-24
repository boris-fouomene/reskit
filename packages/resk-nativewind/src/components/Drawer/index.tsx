"use client";
import { createContext, Fragment, ReactElement, ReactNode, Ref, useContext } from "react";
import { Breakpoints, cn, createProvider, getInitialHydrationStatus, ObservableComponent } from "@utils/index";
import { AppBar, IAppBarProps } from "@components/AppBar";
import { defaultStr, isNonNullString, isNumber, isObj } from "@resk/core/utils";
import { i18n } from "@resk/core/i18n";
import { isValidElement } from "react";
import { Animated, Dimensions, PanResponder, GestureResponderEvent, PanResponderGestureState, I18nManager, ViewProps, StyleSheet, EmitterSubscription } from "react-native";
import FontIcon from "@components/Icon/Font";
import { Tooltip } from "@components/Tooltip";
import { Platform } from "@platform";
import { Session } from "@resk/core/session";
import { Div } from "@html/Div";
import { Backdrop } from "@components/Backdrop";
import { IClassName, IReactNullableElement } from "@src/types";
import { INavItemProps, INavItemsProps, Nav } from "@components/Nav";
import { Modal } from "@components/Modal";
import { IModalProps } from "@components/Modal/types";
import { IIconVariant } from "@variants/icon";
import { drawerVariant, IDrawerVariant } from "@variants/drawer";
import { VStack } from "@components/Stack";
import { ActivityIndicator } from "@components/ActivityIndicator";


const useNativeDriver = Platform.canUseNativeDriver();
const MIN_SWIPE_DISTANCE = 3;

const VX_MAX = 0.1;

const IDLE = "Idle";
const DRAGGING = "Dragging";
const SETTLING = "Settling";

/**
 * @fileoverview Drawer component providing a sliding navigation panel with extensive functionality
 * @module Drawer
 * @version 1.0.0
 * @author Resk UI Framework
 * @since 1.0.0
 * 
 * @description
 * The Drawer component is a versatile navigation container that can slide in from the left or right
 * side of the screen. It supports multiple modes including temporary (overlay), permanent (always visible),
 * and minimized states. The component is fully responsive and includes gesture support, session persistence,
 * and comprehensive accessibility features.
 * 
 * @example
 * ```tsx
 * // Basic drawer usage
 * <Drawer>
 *   <Text>Navigation Content</Text>
 * </Drawer>
 * ```
 * 
 * @example
 * ```tsx
 * // Permanent drawer with navigation items
 * <Drawer 
 *   permanent={true}
 *   items={[
 *     { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
 *     { label: "Settings", icon: "settings", href: "/settings" }
 *   ]}
 *   appBarProps={{ title: "Main Menu" }}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Drawer with session persistence and minimizable state
 * <Drawer 
 *   sessionName="mainNavigation"
 *   minimizable={true}
 *   onDrawerOpen={({ drawer }) => console.log("Drawer opened")}
 *   onDrawerClose={({ drawer }) => console.log("Drawer closed")}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Using drawer as a provider for context sharing
 * <Drawer.Provider permanent={false}>
 *   {({ drawer }) => (
 *     <View>
 *       <Button onPress={() => drawer.open()}>Open Menu</Button>
 *       <Text>Content goes here</Text>
 *     </View>
 *   )}
 * </Drawer.Provider>
 * ```
 * 
 * @example
 * ```tsx
 * // Advanced configuration with responsive behavior
 * <Drawer
 *   position="right"
 *   drawerWidth={350}
 *   responsiveResize={true}
 *   gesturesEnabled={true}
 *   drawerLockMode="unlocked"
 *   variant={{ theme: "dark", elevation: 3 }}
 *   onDrawerStateChanged={({ newState, drawer }) => {
 *     console.log(`Drawer state: ${newState}`, drawer.isOpen());
 *   }}
 * />
 * ```
 */
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

  private _inMemomerySession: Record<string, any> = {};

  public setInMemorySession(key: string, value: any) {
    if (isNonNullString(key)) {
      this._inMemomerySession[key] = value;
    }
  }
  public getInMemorySession(key: string) {
    if (isNonNullString(key)) {
      return this._inMemomerySession[key];
    }
    return undefined;
  }

  private _dimensionChangedListener: EmitterSubscription | undefined;
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
      isHydrated: getInitialHydrationStatus(),
    };
    const children = this.prepareChildrenState(props);
    if (this.isProvider()) {
      this.setState({ providerOptions: { ...this.state.providerOptions, children: this.prepareChildrenState(props) } });
    } else {
      Object.assign(this.state, { children });
    }
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
   * Pins the drawer to the screen by setting it to permanent mode.
   * 
   * When pinned, the drawer becomes always visible and cannot be closed by user interaction.
   * This is particularly useful on desktop layouts where persistent navigation is desired.
   * The drawer will automatically open if it's currently closed when pinned.
   * 
   * @param {IDrawerCallback} [callback] - Optional callback function executed after the pin operation completes.
   *   The callback receives drawer context options including the drawer instance.
   * @param {boolean} [persist=true] - Whether to persist the pinned state to session storage.
   *   When true, the pinned state will be restored on subsequent app loads.
   * 
   * @returns {void}
   * 
   * @example
   * ```tsx
   * // Pin the drawer without callback
   * drawer.pin();
   * ```
   * 
   * @example
   * ```tsx
   * // Pin with callback to handle completion
   * drawer.pin(({ drawer }) => {
   *   console.log('Drawer pinned successfully:', drawer.isPermanent());
   *   updateUILayout();
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Pin without persisting to session (temporary pin)
   * drawer.pin(undefined, false);
   * ```
   * 
   * @example
   * ```tsx
   * // Pin with both callback and persistence control
   * drawer.pin(
   *   ({ drawer }) => {
   *     console.log('Pin operation completed');
   *     // Update app state or UI
   *     setDrawerPinned(drawer.isPermanent());
   *   },
   *   true // Persist to session storage
   * );
   * ```
   * 
   * @see {@link unpin} - To unpin the drawer
   * @see {@link setPermanent} - Lower-level method for setting permanent state
   * @see {@link isPermanent} - To check if the drawer is currently pinned
   * @see {@link canBePinned} - To check if the drawer can be pinned
   * 
   * @since 1.0.0
   */
  pin(callback?: IDrawerCallback, persist?: boolean): void {
    this.setPermanent(true, callback, persist);
  }

  /**
   * Unpins the drawer by removing it from permanent mode.
   * 
   * When unpinned, the drawer returns to normal behavior where it can be opened and closed
   * by user interaction. If the drawer was open due to being pinned, it will be closed
   * as part of the unpinning process.
   * 
   * @param {IDrawerCallback} [callback] - Optional callback function executed after the unpin operation completes.
   *   The callback receives drawer context options including the drawer instance.
   * @param {boolean} [persist=true] - Whether to persist the unpinned state to session storage.
   *   When true, the unpinned state will be restored on subsequent app loads.
   * 
   * @returns {void}
   * 
   * @example
   * ```tsx
   * // Unpin the drawer without callback
   * drawer.unpin();
   * ```
   * 
   * @example
   * ```tsx
   * // Unpin with callback to handle completion
   * drawer.unpin(({ drawer }) => {
   *   console.log('Drawer unpinned successfully:', !drawer.isPermanent());
   *   // Maybe show a temporary overlay or notification
   *   showNotification('Navigation drawer unpinned');
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Unpin without persisting to session (temporary unpin)
   * drawer.unpin(undefined, false);
   * ```
   * 
   * @example
   * ```tsx
   * // Unpin with responsive behavior handling
   * drawer.unpin(
   *   ({ drawer }) => {
   *     // Check if we need to adjust layout for mobile
   *     if (!drawer.canBeMinimizedOrPermanent()) {
   *       adjustLayoutForMobile();
   *     }
   *     updateNavigationState(false);
   *   },
   *   true
   * );
   * ```
   * 
   * @see {@link pin} - To pin the drawer
   * @see {@link setPermanent} - Lower-level method for setting permanent state
   * @see {@link isPermanent} - To check if the drawer is currently pinned
   * @see {@link canBePinned} - To check if the drawer can be pinned
   * 
   * @since 1.0.0
   */
  unpin(callback?: IDrawerCallback, persist?: boolean): void {
    this.setPermanent(false, callback, persist);
  }

  /**
   * Checks if the drawer is pinned (permanently visible).
   * 
   * A pinned drawer is one that is set to permanent mode, meaning it remains visible
   * and cannot be closed through normal user interactions like tapping outside or
   * using gestures. This is an alias for the `isPermanent()` method, providing
   * more intuitive naming for the pinning functionality.
   * 
   * @returns {boolean} True if the drawer is pinned (permanent), false otherwise.
   * 
   * @example
   * ```tsx
   * // Check if drawer is pinned before performing an action
   * if (drawer.isPinned()) {
   *   console.log('Drawer is pinned - always visible');
   *   // Adjust layout accordingly
   *   setMainContentMargin(drawer.getDrawerWidth());
   * } else {
   *   console.log('Drawer is unpinned - can be hidden');
   *   setMainContentMargin(0);
   * }
   * ```
   * 
   * @example
   * ```tsx
   * // Use in conditional rendering
   * const PinToggleButton = () => (
   *   <Button onPress={() => {
   *     if (drawer.isPinned()) {
   *       drawer.unpin();
   *     } else {
   *       drawer.pin();
   *     }
   *   }}>
   *     {drawer.isPinned() ? 'Unpin Drawer' : 'Pin Drawer'}
   *   </Button>
   * );
   * ```
   * 
   * @example
   * ```tsx
   * // Use in state management
   * const [isPinned, setIsPinned] = useState(() => drawer.isPinned());
   * 
   * useEffect(() => {
   *   const handlePinChange = () => setIsPinned(drawer.isPinned());
   *   drawer.on('permanent', handlePinChange);
   *   return () => drawer.off('permanent', handlePinChange);
   * }, []);
   * ```
   * 
   * @example
   * ```tsx
   * // Use with responsive behavior
   * const shouldShowOverlay = !drawer.isPinned() && drawer.isOpen();
   * const contentPadding = drawer.isPinned() ? drawer.getDrawerWidth() : 0;
   * ```
   * 
   * @see {@link pin} - To pin the drawer
   * @see {@link unpin} - To unpin the drawer
   * @see {@link isPermanent} - Equivalent method with different naming
   * @see {@link canBePinned} - To check if the drawer supports pinning
   * 
   * @since 1.0.0
   */
  isPinned() {
    return this.isPermanent();
  }

  /**
   * Creates callback options object for drawer event handlers.
   * 
   * This method generates a standardized options object that includes the drawer instance
   * along with any additional custom options. It's used internally to provide consistent
   * callback parameters across all drawer events and methods.
   * 
   * @template T - Additional options type that extends Record<string, any>
   * @param {T} [options] - Optional additional options to merge with the base callback options
   * @returns {IDrawerCallbackOptions<T>} Combined options object containing the drawer instance and any additional options
   * 
   * @example
   * ```tsx
   * // Basic usage - get callback options with just the drawer instance
   * const options = drawer.getCallOptions();
   * console.log(options.drawer.isOpen()); // Access drawer methods
   * ```
   * 
   * @example
   * ```tsx
   * // With additional custom options
   * const options = drawer.getCallOptions({ 
   *   timestamp: Date.now(), 
   *   eventType: 'user_action' 
   * });
   * console.log(options.drawer.isOpen());
   * console.log(options.timestamp); // Additional custom data
   * console.log(options.eventType); // Additional custom data
   * ```
   * 
   * @example
   * ```tsx
   * // Internal usage in drawer methods
   * close(callback?: IDrawerCallback) {
   *   const options = this.getCallOptions({ action: 'close' });
   *   // ... animation logic
   *   if (callback) {
   *     callback(options); // Callback receives drawer + custom options
   *   }
   * }
   * ```
   * 
   * @example
   * ```tsx
   * // Type-safe usage with specific option types
   * interface CustomOptions {
   *   source: 'gesture' | 'button' | 'api';
   *   metadata?: Record<string, any>;
   * }
   * 
   * const options = drawer.getCallOptions<CustomOptions>({
   *   source: 'gesture',
   *   metadata: { x: 100, y: 200 }
   * });
   * ```
   * 
   * @see {@link IDrawerCallbackOptions} - The return type interface
   * @see {@link IDrawerCallback} - Callback function type that receives these options
   * 
   * @since 1.0.0
   */
  getCallOptions<T extends Record<string, any> = {}>(options?: T): IDrawerCallbackOptions<T> {
    return Object.assign({}, options, { drawer: this });
  }

  /**
   * Sets the permanent state of the drawer with optional session persistence.
   * 
   * When set to permanent mode, the drawer becomes always visible and cannot be dismissed
   * by user interaction. This is particularly useful for desktop layouts where persistent
   * navigation is desired. When disabled, the drawer returns to normal behavior.
   * 
   * @param {boolean} permanent - Whether to set the drawer to permanent mode
   * @param {IDrawerCallback} [callback] - Optional callback executed after the state change completes
   * @param {boolean} [persist=true] - Whether to persist the permanent state to session storage
   * @returns {void}
   * 
   * @remarks
   * - This method has no effect when called on a provider drawer
   * - If the drawer cannot be pinned (mobile context) and is not already permanent, the operation is skipped
   * - When setting to permanent, the drawer will automatically open if closed
   * - When unsetting permanent, the drawer will close if it was open due to permanent mode
   * - The operation emits a 'permanent' event and updates session storage (unless persist is false)
   * 
   * @example
   * ```tsx
   * // Set drawer to permanent mode
   * drawer.setPermanent(true, ({ drawer }) => {
   *   console.log('Drawer is now permanent:', drawer.isPermanent());
   *   updateLayoutForPermanentDrawer();
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Remove permanent mode and close drawer
   * drawer.setPermanent(false, ({ drawer }) => {
   *   console.log('Drawer is no longer permanent:', !drawer.isPermanent());
   *   resetLayoutForNormalDrawer();
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Set permanent without persisting to session
   * drawer.setPermanent(true, undefined, false);
   * ```
   * 
   * @example
   * ```tsx
   * // Conditional permanent setting based on screen size
   * const shouldBePermanent = window.innerWidth > 1024;
   * drawer.setPermanent(shouldBePermanent, ({ drawer }) => {
   *   // Update app layout based on new permanent state
   *   adjustMainContentMargin(drawer.isPermanent() ? drawer.getDrawerWidth() : 0);
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Error handling and validation
   * if (drawer.canBePinned()) {
   *   drawer.setPermanent(true, ({ drawer }) => {
   *     if (drawer.isPermanent()) {
   *       showNotification('Navigation pinned successfully');
   *     }
   *   });
   * } else {
   *   showNotification('Cannot pin navigation on mobile devices');
   * }
   * ```
   * 
   * @fires permanent - Emitted when the permanent state changes
   * @see {@link pin} - Convenience method to set permanent to true
   * @see {@link unpin} - Convenience method to set permanent to false
   * @see {@link isPermanent} - Check current permanent state
   * @see {@link canBePinned} - Check if drawer can be set to permanent
   * 
   * @since 1.0.0
   */
  setPermanent(permanent: boolean, callback?: IDrawerCallback, persist?: boolean): void {
    if (this.isProvider()) return;
    const options = this.getCallOptions()
    if ((!this.canBePinned() && !this.isPermanent()) || this.isPermanent() === permanent) {
      if (typeof callback == "function") callback(options);
      return;
    }
    const cb2 = () => {
      this.setState({ permanent }, () => {
        this.trigger("permanent", this);
        if (persist !== false) {
          this.setSession("permanent", permanent);
        }
        if ((typeof callback == "function")) {
          callback(options);
        }
      });
    };
    if (permanent) {
      if (!this.isOpen()) {
        this.open(undefined, cb2);
      }
    } else {
      cb2();
    }
  }

  /**
   * Sets the minimized state of the drawer with session persistence.
   * 
   * When minimized, the drawer collapses to show only icons without labels,
   * providing a compact navigation experience while maintaining accessibility
   * to all drawer functions. This feature is typically available on desktop
   * layouts where space optimization is beneficial.
   * 
   * @param {boolean} minimized - Whether to set the drawer to minimized state
   * @param {IDrawerCallback} [callback] - Optional callback executed after the state change completes
   * @returns {void}
   * 
   * @remarks
   * - This method only works when the drawer can be minimized (typically on desktop)
   * - The minimized state is automatically persisted to session storage
   * - Icons in minimized mode typically display larger and centered
   * - Labels and secondary content are hidden in minimized mode
   * - The operation emits a 'minimized' event
   * 
   * @example
   * ```tsx
   * // Minimize the drawer
   * drawer.setMinimized(true, ({ drawer }) => {
   *   console.log('Drawer minimized:', drawer.isMinimized());
   *   adjustLayoutForMinimizedDrawer();
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Expand the drawer from minimized state
   * drawer.setMinimized(false, ({ drawer }) => {
   *   console.log('Drawer expanded:', !drawer.isMinimized());
   *   adjustLayoutForExpandedDrawer();
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Toggle minimized state with user preference
   * const currentMinimized = drawer.isMinimized();
   * drawer.setMinimized(!currentMinized, ({ drawer }) => {
   *   saveUserPreference('drawerMinimized', drawer.isMinimized());
   *   updateIconSizes(drawer.isMinimized());
   * });
   * ```
   * 
   * @example
   * ```tsx
   * // Conditional minimization based on content width
   * const shouldMinimize = contentWidth < 1200;
   * if (drawer.canBeMinimizedOrPermanent()) {
   *   drawer.setMinimized(shouldMinimize, ({ drawer }) => {
   *     adjustContentPadding(drawer.isMinimized());
   *   });
   * }
   * ```
   * 
   * @example
   * ```tsx
   * // Auto-minimize on hover out (advanced UX)
   * const handleMouseLeave = () => {
   *   if (drawer.isPermanent() && !drawer.isMinimized()) {
   *     setTimeout(() => {
   *       if (!drawer.isHovered()) {
   *         drawer.setMinimized(true);
   *       }
   *     }, 2000); // Delay to prevent accidental minimization
   *   }
   * };
   * ```
   * 
   * @fires minimized - Emitted when the minimized state changes
   * @see {@link isMinimized} - Check current minimized state
   * @see {@link isMinimizable} - Check if drawer supports minimization
   * @see {@link canBeMinimizedOrPermanent} - Check if minimization is available
   * 
   * @since 1.0.0
   */
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

  /**
   * Determines if the drawer can be minimized or set to permanent mode.
   * 
   * This method checks the current device layout capabilities to determine
   * if the drawer supports advanced features like permanent mode or minimization.
   * These features are typically available on desktop layouts where there's
   * sufficient screen real estate.
   * 
   * @returns {boolean} True if the current device layout supports permanent/minimized modes
   * 
   * @example
   * ```tsx
   * if (drawer.canBeMinimizedOrPermanent()) {
   *   // Enable permanent mode toggle
   *   showPinButton();
   * } else {
   *   // Hide permanent mode options on mobile
   *   hidePinButton();
   * }
   * ```
   * 
   * @example
   * ```tsx
   * // Responsive drawer configuration
   * const drawerConfig = {
   *   permanent: drawer.canBeMinimizedOrPermanent(),
   *   gesturesEnabled: !drawer.canBeMinimizedOrPermanent()
   * };
   * ```
   * 
   * @see {@link Breakpoints.getDeviceLayout} - The underlying breakpoint detection
   * @see {@link canBePinned} - Alias method with same functionality
   * @see {@link isMinimizable} - Check if specific drawer instance supports minimization
   * 
   * @since 1.0.0
   */
  canBeMinimizedOrPermanent(): boolean {
    const layout = Breakpoints.getDeviceLayout();
    // Consider both desktop and large tablet as capable of permanent/minimized modes
    return !!(layout?.isDesktop || (layout?.windowWidth > 1024));
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
    const rtl = Platform.isRTL();
    let position: IDrawerPosition = this.getComponentProps()?.position;
    if (position !== "left" && position !== "right") {
      if (this.isProvider()) {
        position = rtl ? "left" : "right";
      } else {
        position = "left";
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
  isHydrated() {
    return this.state.isHydrated;
  }
  componentDidMount() {
    super.componentDidMount();
    const callback = () => {
      this._dimensionChangedListener = Dimensions.addEventListener('change', this._onDimensionsChanged.bind(this));
      const { openValue } = this.state;
      openValue?.addListener(({ value }) => {
        const drawerShown = value > 0;
        const accessibilityViewIsModal = drawerShown;
        if (drawerShown !== this.state.drawerShown) {
          this.setState({ drawerShown, accessibilityViewIsModal });
        }
        this._lastOpenValue = value;
        if (this.props.onDrawerSlide) {
          this.props.onDrawerSlide(this.getCallOptions());
        }
      });
    }
    if (!this.state.isHydrated) {
      this.setState({ isHydrated: true }, callback);
    } else {
      callback();
    }
  }


  canBePinned(): boolean {
    return this.canBeMinimizedOrPermanent();
  }

  getComponentProps(): Partial<IDrawerProps> {
    return this.isProvider() && isObj(this.state?.providerOptions) ? this.state.providerOptions : this.props;
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
    return this.isProvider() && this.canBeMinimizedOrPermanent();
  }


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
    if (withAppBar === false || (!isObj(appBarProps) && !this.isProvider() && this.isPermanent())) return null;
    const testID = this.getTestID();
    const isRightPosition = this.isPositionRight();
    return <AppBar
      testID={testID + "drawer-header"}
      onBackActionPress={(event: GestureResponderEvent) => {
        this.close();
        return false;
      }}
      backActionPosition={isRightPosition ? "left" : "right"}
      {...appBarProps}
      actionsProps={{
        ...appBarProps?.actionsProps,
        viewportWidth: this.getDrawerWidth(),
      }}
      backAction={(opts) => {
        const { className, variant, handleBackPress, computedAppBarVariant, backActionProps } = opts;
        const elt = typeof appBarProps?.backAction == "function" ? appBarProps.backAction(opts as any) : appBarProps?.backAction;

        const canToggleFullScreen = this.canToggleFullScren();

        const togglePosition = canToggleFullScreen ? <Tooltip onPress={this.toggleFullScreen.bind(this)} title={i18n.t("components.drawer.toggleFullScreen")} children={<FontIcon className={computedAppBarVariant.icon()} name={(this.isFullScreen() ? "fullscreen-exit" : "fullscreen") as never} size={20} />} /> : null;
        return (
          <>
            {isRightPosition ? togglePosition : null}
            {isValidElement(elt) ? elt : <AppBar.BackAction variant={variant} {...backActionProps} onPress={handleBackPress} className={className} fontIconName={(!isRightPosition ? "chevron-left" : "chevron-right") as never} />}
            {!isRightPosition ? togglePosition : null}
          </>
        );
      }}
      context={{ ...appBarProps?.context, drawer: this }}
    />;
  }
  getDrawerWidth(): number {
    const { isMobile, isDesktop, windowWidth } = Breakpoints.getDeviceLayout();
    const isProvider = this.isProvider();
    if (this.isFullScreen() || (isProvider && isMobile)) {
      return windowWidth;
    }
    const { drawerWidth } = this.getComponentProps();
    if (isNumber(drawerWidth) && drawerWidth > 50) return drawerWidth;
    const W = isProvider ? 400 : 280;
    if (windowWidth > W) return W;
    return Math.floor((isDesktop ? 82 : 80) * windowWidth / 100);
  }



  getSessionName(): string {
    return defaultStr(this.getComponentProps()?.sessionName);
  }
  getSessionKey(key: string): string {
    if (!isNonNullString(key)) return "";
    const sessionName = this.getSessionName();
    if (!sessionName) return "";
    return `${sessionName}-${key}`;
  }
  getSession(key: string): any {
    const sessKey = this.getSessionKey(key);
    const inMomValue = this.getInMemorySession(key);
    if (!sessKey) return inMomValue;
    const v = Session.get(sessKey);
    return v !== undefined ? v : inMomValue;
  }

  setSession(key: string, value?: any): any {
    const sessKey = this.getSessionKey(key);
    this.setInMemorySession(key, value);
    if (!sessKey) return undefined;
    return Session.set(sessKey, value);
  }
  computeVariant(): ReturnType<typeof drawerVariant> {
    const { variant } = this.getComponentProps();
    return drawerVariant({ ...variant, permanent: this.isPermanent() });
  }
  render() {
    const { containerClassName, items, itemsProps, style, children, className, hydrationFallback } = this.getComponentProps();
    const { accessibilityViewIsModal, drawerShown, openValue } = this.state;
    const computedVariant = this.computeVariant();
    const testID = this.getTestID();
    const permanent = this.isPermanent();
    const drawerWidth = this.getDrawerWidth();
    const isProvider = this.isProvider();

    const posRight = this.isPositionRight();
    const outputRange = permanent ? [0, 0] : this.isPositionRight() ? [drawerWidth, 0] : [-drawerWidth, 0];
    const drawerTranslateX = openValue.interpolate({
      inputRange: [0, 1],
      outputRange,
      extrapolate: "clamp",
    });
    const canRenderTemp = isProvider || !permanent;
    const Wrapper = canRenderTemp ? Modal : Fragment;
    const wrapperProps = canRenderTemp ? { backdropClassName: cn("resk-drawer-backdrop"), onRequestClose: this.close.bind(this), className: "resk-drawer-modal", withBackdrop: true, testID: testID + "-modal", animationType: "fade", visible: this.isOpen() } as IModalProps : {};
    return (
      <Wrapper {...wrapperProps}>
        <DrawerContext.Provider value={{ drawer: this }}>
          {!this.isHydrated() ? <>
            {hydrationFallback || <VStack testID={testID + "-no-hydrated-fallback"} className={cn("p-4 resk-drawer-no-hydrated-fallback items-center justify-center", className)}>
              <ActivityIndicator testID={testID + "-no-hydrated-indicator"} variant={{ color: "primary" }} />
            </VStack>}
          </> :
            <Div testID={testID + "-container"} className={cn("resk-drawer-container relative h-full flex-col items-start justify-start", isProvider && "resk-drawer-provider-container", computedVariant.container(), containerClassName)}>
              {!permanent && this.isOpen() ? (<Backdrop transparent onPress={() => this.close()} testID={testID + "-backdrop"} className={cn("resk-drawer-backdrop")} />) : null}
              {<Animated.View
                {...(canRenderTemp ? this._panResponder.panHandlers : {})}
                testID={testID + "-animated-content"}
                accessibilityViewIsModal={accessibilityViewIsModal}
                className={cn("resk-drawer-animated")}
                style={[
                  permanent ? { position: "relative" } : { position: "absolute", zIndex: 10, top: 0, bottom: 0, left: 0, right: 0 },
                  {

                    pointerEvents: "auto",
                    flex: 1,
                    width: drawerWidth,
                    height: "100%",
                    left: !posRight ? 0 : null,
                    right: posRight ? 0 : null,
                    transform: [{ translateX: drawerTranslateX }],
                  }
                ]}
              >
                {<Div style={StyleSheet.flatten(style)} className={cn("flex-1 pointer-events-auto w-full h-full flex-col resk-drawer", isProvider && "resk-drawer-provider", computedVariant.base(), className)} testID={testID + "drawer-content"}>
                  {this.renderHeader()}
                  {Array.isArray(items) && items.length > 0 ? <DrawerItems
                    {...itemsProps}
                    items={items}
                  /> : null}
                  {isProvider ? (this.state.providerOptions ? this.state.providerOptions.children : null) : this.state.children}
                </Div>}
              </Animated.View>}
            </Div>}
        </DrawerContext.Provider>
      </Wrapper>
    );
  }

  /**
   * Handles responsive behavior when device dimensions change.
   * 
   * This method automatically adjusts the drawer's behavior based on the current
   * device layout capabilities:
   * 
   * **Desktop → Mobile/Tablet:**
   * - Converts permanent drawer to temporary (overlay) mode
   * - Closes the drawer to prevent blocking mobile content
   * - Maintains user's manual state preferences when possible
   * 
   * **Mobile/Tablet → Desktop:**
   * - Converts temporary drawer to permanent mode
   * - Opens the drawer automatically for better desktop UX
   * - Restores previous permanent state if available
   * 
   * @private
   * @returns {void}
   * 
   * @example
   * // This method is called automatically when screen orientation or size changes
   * // No manual invocation needed - handled by Dimensions.addEventListener
   * 
   * @since 1.0.0
   */
  _onDimensionsChanged() {
    if (!this.isMounted()) return;

    const canBeMinimizedOrPermanent = this.canBeMinimizedOrPermanent();
    const isPermanent = this.isPermanent();
    const isOpen = this.isOpen();

    // Only proceed if responsive resize is enabled
    if (this.props.responsiveResize !== false) {

      // Desktop → Mobile/Tablet transition
      if (!canBeMinimizedOrPermanent && isPermanent) {
        // Store the fact that user had it permanent for potential restoration
        this.setSession("wasPermanentBeforeMobile", true);

        // Convert to temporary mode and close for mobile UX
        this.unpin(() => {
          // Close drawer on mobile to prevent content blocking
          // But preserve provider drawers for app-level navigation
          if (!this.isProvider() && isOpen) {
            this.close();
          }
        }, false); // Don't persist the unpin since it's responsive, not user choice
      }

      // Mobile/Tablet → Desktop transition
      else if (canBeMinimizedOrPermanent && !isPermanent) {
        // Check if user previously had it permanent before going mobile
        const wasPreviouslyPermanent = this.getSession("wasPermanentBeforeMobile");

        // Auto-pin on desktop for better UX, unless user explicitly unpinned
        const shouldAutoPermanent = wasPreviouslyPermanent !== false;

        if (shouldAutoPermanent) {
          this.pin(() => {
            // Ensure drawer is visible on desktop
            if (!this.isOpen()) {
              this.open();
            }
            // Clear the temporary session flag
            this.setSession("wasPermanentBeforeMobile", undefined);
          }, false); // Don't persist since this is responsive behavior
        }
      }
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
    if (!this.isPermanent()) {
      Animated.spring(this.state.openValue, {
        toValue: 0,
        bounciness: 0,
        restSpeedThreshold: 1,
        useNativeDriver,
      }).start(end);
    } else {
      // If permanent, just call the end callback without animation
      end();
    }
    return this;
  }

  _shouldSetPanResponder(e: GestureResponderEvent, { moveX, dx, dy }: PanResponderGestureState) {
    if (this.props.gesturesEnabled === false) return false;
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
const DrawerProvider = createProvider<IDrawerProps, _DrawerProvider>(_DrawerProvider, { permanent: false }, (options) => {
  options.permanent = typeof options.permanent === 'boolean' ? options.permanent : false;
  return options;
});


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
  const { iconVariant, ...restExpandableProps } = expandableProps;
  return <Nav.ExpandableItem
    {...rest}
    context={Object.assign({}, context, { drawer })}
    expandableProps={{
      ...restExpandableProps, iconVariant: {
        ...iconVariant,
        size: minimized ? MINIMIZED_ICON_SIZE : iconVariant?.size || ICON_SIZE_VARIANT,
      }
    }}
    as={DrawerItem}
    testID={testID}
  />
}


function DrawerItems(props: IDrawerItemsProps) {
  const drawerContext = useDrawer();
  if (!drawerContext) return null;
  const { drawer } = drawerContext;
  const computedVariant = drawer.computeVariant();
  return <Nav.Items
    testID="resk-drawer-items"
    {...props}
    itemClassName={cn("resk-drawer-item", computedVariant.item(), props.itemClassName)}
    className={cn("resk-drawer-items", computedVariant.items(), props.className)}
    renderExpandableItem={renderExpandableDrawerItem}
    renderItem={renderDrawerItem}
  />
};

DrawerItems.displayName = "Drawer.Items";
DrawerItem.displayName = "Drawer.Item";

ExpandableDrawerItem.displayName = "Drawer.ExpandableItem";


function renderDrawerItem(item: IDrawerItemProps, index: number) {
  return <DrawerItem {...item} key={Nav.getItemRenderKey(item, index)} />;
}
function renderExpandableDrawerItem(item: IDrawerItemProps, index: number) {
  return <ExpandableDrawerItem {...item} key={Nav.getItemRenderKey(item, index)} />;
}
const ICON_SIZE_VARIANT: IIconVariant["size"] = "25px";

const MINIMIZED_ICON_SIZE: IIconVariant["size"] = "35px";



/**
 * Represents the state of the Drawer component.
 *
 * @interface IDrawerState
 * @property {boolean} accessibilityViewIsModal - Indicates if the drawer's accessibility view is modal (for accessibility tools).
 * @property {boolean} drawerShown - Indicates if the drawer is currently visible (open).
 * @property {boolean} [permanent] - Indicates if the drawer is in permanent mode (always visible, not dismissible).
 * @property {boolean} [minimized] - Indicates if the drawer is minimized (collapsed to a smaller width).
 * @property {Animated.Value} openValue - Animated value representing the open/close state of the drawer (0 = closed, 1 = open).
 * @property {number} [drawerWidth] - The width of the drawer in pixels.
 * @property {IDrawerCallback} [onDrawerClose] - Callback function called when the drawer is closed.
 * @property {IDrawerCallback} [onDrawerOpen] - Callback function called when the drawer is opened.
 * @property {IDrawerCallback} [onDrawerSlide] - Callback function called when the drawer is sliding.
 * @property {boolean} [fullScreen] - Indicates if the drawer is in full screen mode.
 * @property {Omit<IDrawerProps, "children"> & { children?: IReactNullableElement }} [providerOptions] - Options for the Drawer provider, excluding children.
 * @property {IReactNullableElement} [children] - The rendered children of the drawer.
 * @property {boolean} isHydrated - Indicates if the drawer has completed hydration (useful for SSR/CSR).
 *
 * @example
 * // Example of a typical drawer state object:
 * const state: IDrawerState = {
 *   accessibilityViewIsModal: false,
 *   drawerShown: true,
 *   openValue: new Animated.Value(1),
 *   minimized: false,
 *   permanent: true,
 *   drawerWidth: 320,
 *   fullScreen: false,
 *   isHydrated: true,
 * };
 */
export interface IDrawerState {
  /**
   * Indicates if the drawer's accessibility view is modal.
   * This is important for screen readers and accessibility tools.
   */
  accessibilityViewIsModal: boolean;

  /**
   * Indicates if the drawer is currently shown (open).
   */
  drawerShown: boolean;

  /**
   * Indicates if the drawer is permanent (always visible).
   * Optional.
   */
  permanent?: boolean;

  /**
   * Indicates if the drawer is minimized (collapsed).
   * Optional.
   */
  minimized?: boolean;

  /**
   * Animated value representing the open state of the drawer.
   * Use this value to animate the drawer's position.
   *
   * @example
   * // Animate the drawer open
   * Animated.spring(state.openValue, { toValue: 1, useNativeDriver: true }).start();
   */
  openValue: Animated.Value;

  /**
   * Width of the drawer in pixels.
   * Optional.
   */
  drawerWidth?: number;


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
   * Provider options for the Drawer context, excluding children.
   * Useful when using Drawer as a provider.
   */
  providerOptions?: Omit<IDrawerProps, "children"> & { children?: IReactNullableElement };

  /**
   * The rendered children of the drawer.
   */
  children?: IReactNullableElement;

  /**
   * Indicates if the drawer has completed hydration (for SSR/CSR).
   */
  isHydrated: boolean;
}

/**
 * @interface IDrawerProps
 * Props for the Drawer component.
 *
 * @remarks
 * This interface defines all configurable options for the Drawer, including appearance, behavior, session persistence, and event callbacks.
 * It is designed to be highly flexible for both permanent and temporary (modal) drawers, supporting responsive layouts and accessibility.
 *
 * @example
 * // Basic usage with default settings
 * <Drawer>
 *   <Text>Drawer Content</Text>
 * </Drawer>
 *
 * @example
 * // Permanent drawer with custom width and responsive behavior
 * <Drawer permanent={true} drawerWidth={320} responsiveResize={true} />
 *
 * @example
 * // Drawer with navigation items and custom AppBar
 * <Drawer
 *   items={[{ label: "Home", icon: "home" }, { label: "Settings", icon: "settings" }]}
 *   appBarProps={{ title: "Navigation" }}
 * />
 *
 * @example
 * // Drawer with session persistence and minimized state
 * <Drawer sessionName="mainDrawer" minimized={true} />
 *
 * @typeparam T - Additional custom props can be extended as needed.
 *
 * @see {@link IDrawerState} for the state shape.
 * @see {@link Drawer} for the main component.
 */
export interface IDrawerProps extends Omit<ViewProps, "ref" | "children"> {
  /**
   * Determines if the drawer can be minimized (collapsed to a smaller width).
   * When true, the drawer can be toggled between minimized and expanded states.
   * @default false
   *
   * @example
   * <Drawer minimizable={true} />
   */
  minimizable?: boolean;

  /**
   * Array of navigation items to render inside the drawer.
   * Each item should conform to the navigation item props.
   *
   * @example
   * <Drawer items={[{ label: "Dashboard", icon: "dashboard" }]} />
   */
  items?: IDrawerItemsProps["items"];

  /**
   * Additional props to pass to the DrawerItems component, excluding the items array.
   *
   * @example
   * <Drawer itemsProps={{ className: "custom-items" }} />
   */
  itemsProps?: Omit<IDrawerItemsProps, "items">;

  /**
   * Drawer content. Can be a React element or a render function that receives drawer callback options.
   *
   * @example
   * <Drawer>
   *   <Text>Static Content</Text>
   * </Drawer>
   *
   * @example
   * <Drawer>
   *   {({ drawer }) => <Text>{drawer.isOpen() ? "Open" : "Closed"}</Text>}
   * </Drawer>
   */
  children?: IReactNullableElement | ((options: IDrawerCallbackOptions) => IReactNullableElement);

  /**
   * Ref to access the Drawer instance.
   *
   * @example
   * const drawerRef = useRef<Drawer>(null);
   * <Drawer ref={drawerRef} />
   */
  ref?: Ref<Drawer>;

  /**
   * Indicates if the drawer is currently minimized.
   * When true, the drawer displays in its minimized (collapsed) state.
   * @default false
   *
   * @example
   * <Drawer minimized={true} />
   */
  minimized?: boolean;

  /**
   * The name of the session used to persist the drawer's state (e.g., minimized, permanent).
   * Useful for restoring drawer state across reloads or navigation.
   *
   * @example
   * <Drawer sessionName="mainDrawer" />
   */
  sessionName?: string;

  /**
   * Specifies the lock mode of the drawer.
   * - "unlocked": The drawer can be opened and closed freely.
   * - "locked-closed": The drawer is locked in the closed position.
   * - "locked-open": The drawer is locked in the open position.
   *
   * @default "unlocked"
   *
   * @example
   * <Drawer drawerLockMode="locked-open" />
   */
  drawerLockMode?: "unlocked" | "locked-closed" | "locked-open" | undefined;

  /**
   * The position of the drawer on the screen.
   * - "left": Drawer slides in from the left.
   * - "right": Drawer slides in from the right.
   *
   * @default "left"
   *
   * @example
   * <Drawer position="right" />
   */
  position?: IDrawerPosition;

  /**
   * The width of the drawer in pixels.
   * If not specified, a default width is used based on device type.
   *
   * @example
   * <Drawer drawerWidth={300} />
   */
  drawerWidth?: number;


  /**
   * Callback function triggered when the drawer is closed.
   * @param options - The state options of the drawer.
   *
   * @example
   * <Drawer onDrawerClose={({ drawer }) => console.log("Closed", drawer)} />
   */
  onDrawerClose?: IDrawerCallback;

  /**
   * Callback function triggered when the drawer is opened.
   * @param options - The state options of the drawer.
   *
   * @example
   * <Drawer onDrawerOpen={({ drawer }) => console.log("Opened", drawer)} />
   */
  onDrawerOpen?: IDrawerCallback;

  /**
   * Callback function triggered when the drawer is sliding (during drag/animation).
   * @param options - The state options of the drawer.
   *
   * @example
   * <Drawer onDrawerSlide={({ drawer }) => console.log("Sliding", drawer)} />
   */
  onDrawerSlide?: IDrawerCallback;

  /**
   * Callback function triggered when the drawer's state changes (e.g., idle, dragging, settling).
   * @param options - The state options of the drawer, including the new state string.
   *
   * @example
   * <Drawer onDrawerStateChanged={({ newState }) => console.log("State:", newState)} />
   */
  onDrawerStateChanged?: (options: IDrawerCallbackOptions<{ newState: string }>) => any;

  /**
   * Determines if gestures (swipe, drag) are enabled for the drawer.
   * @default true
   *
   * @example
   * <Drawer gesturesEnabled={false} />
   */
  gesturesEnabled?: boolean;

  /**
   * Indicates if the drawer is permanent (always visible, not dismissible).
   * When true, the drawer does not overlay content and cannot be closed.
   * @default false
   *
   * @example
   * <Drawer permanent={true} />
   */
  permanent?: boolean;

  /**
   * Enables responsive behavior for the drawer when the viewport dimensions change.
   *
   * When enabled, the drawer automatically adapts its behavior based on screen size:
   * - On desktop breakpoints: The drawer can be pinned (permanent mode) and will automatically
   *   pin itself when switching from mobile to desktop view.
   * - On mobile breakpoints: The drawer will automatically unpin itself when switching from
   *   desktop to mobile view, ensuring proper mobile UX.
   *
   * This is particularly useful for responsive designs where the drawer should behave
   * differently on different screen sizes. For example, a navigation drawer that should
   * be persistent on desktop but overlay-style on mobile.
   *
   * When disabled, the drawer will maintain its current state regardless of viewport changes,
   * giving you full manual control over the drawer behavior.
   *
   * @default true
   *
   * @example
   * // Drawer will automatically adapt to screen size changes
   * <Drawer responsiveResize={true} />
   *
   * @example
   * // Drawer will maintain its state regardless of screen size
   * <Drawer responsiveResize={false} />
   */
  responsiveResize?: boolean;

  /**
   * Props to pass to the AppBar rendered at the top of the drawer.
   *
   * @example
   * <Drawer appBarProps={{ title: "Menu" }} />
   */
  appBarProps?: IAppBarProps<IDrawerContext>;

  /**
   * Whether to render an AppBar at the top of the drawer.
   * @default true
   *
   * @example
   * <Drawer withAppBar={false} />
   */
  withAppBar?: boolean;

  /**
   * Additional class name(s) for the drawer container.
   *
   * @example
   * <Drawer containerClassName="custom-drawer-container" />
   */
  containerClassName?: IClassName;

  /**
   * Custom variant configuration for the drawer (styling, theming, etc).
   *
   * @example
   * <Drawer variant={{ color: "primary" }} />
   */
  variant?: IDrawerVariant;

  /**
   * Fallback content to render while the drawer is hydrating (SSR/CSR).
   *
   * @example
   * <Drawer hydrationFallback={<Spinner />} />
   */
  hydrationFallback?: ReactNode;
}


/**
 * Represents the options passed to Drawer callback functions.
 *
 * @template Options - Additional custom options to extend the callback options.
 * @property {Drawer} drawer - The Drawer instance associated with the callback.
 *
 * @example
 * // Using IDrawerCallbackOptions in a callback
 * const onDrawerOpen = (options: IDrawerCallbackOptions) => {
 *   console.log("Drawer opened!", options.drawer.isOpen());
 * };
 */
export type IDrawerCallbackOptions<Options extends Record<string, any> = {}> = Options & {
  drawer: Drawer;
}

/**
 * Context object provided by the DrawerContext.
 *
 * @property {Drawer} drawer - The current Drawer instance.
 *
 * @example
 * // Accessing the drawer context in a component
 * const { drawer } = useDrawer()!;
 * drawer.open();
 */
export interface IDrawerContext {
  drawer: Drawer;
}

/**
 * Callback function type for Drawer events.
 *
 * @param options - The callback options, including the Drawer instance and any additional data.
 *
 * @example
 * // Example usage in Drawer props
 * <Drawer onDrawerClose={(options) => {
 *   console.log("Drawer closed!", options.drawer.isClosed());
 * }} />
 */
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
 * Props interface for the DrawerItems component.
 * 
 * This interface extends the navigation items props with drawer-specific context.
 * It provides all the functionality of standard navigation items but within the
 * drawer context, allowing access to drawer state and methods.
 * 
 * @interface IDrawerItemsProps
 * @extends {INavItemsProps<IDrawerContext>}
 * 
 * @example
 * ```tsx
 * const drawerItemsProps: IDrawerItemsProps = {
 *   items: [
 *     { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
 *     { label: "Settings", icon: "settings", href: "/settings" }
 *   ],
 *   className: "custom-drawer-items",
 *   itemClassName: "custom-drawer-item"
 * };
 * 
 * <DrawerItems {...drawerItemsProps} />
 * ```
 * 
 * @example
 * ```tsx
 * // With custom render functions
 * <DrawerItems
 *   items={menuItems}
 *   renderItem={(item, index) => (
 *     <CustomDrawerItem key={Nav.getItemRenderKey(item, index)} {...item} />
 *   )}
 *   renderExpandableItem={(item, index) => (
 *     <CustomExpandableItem key={Nav.getItemRenderKey(item, index)} {...item} />
 *   )}
 * />
 * ```
 */
export interface IDrawerItemsProps extends INavItemsProps<IDrawerContext> { }

/**
 * Props interface for individual drawer items.
 * 
 * This interface extends the navigation item props with drawer-specific functionality,
 * including active state management and conditional rendering capabilities.
 * 
 * @interface IDrawerItemProps
 * @extends {INavItemProps<IDrawerContext>}
 * 
 * @property {boolean | ((options: IDrawerContext) => boolean)} [active] - 
 * Determines if the drawer item is in an active state. Can be a boolean value
 * or a function that receives the drawer context and returns a boolean.
 * When active, the item typically displays with different styling to indicate
 * the current selection or state.
 * 
 * @property {boolean} [isRendable] - 
 * Controls whether the drawer item should be rendered. When false, the item
 * will not appear in the drawer. Useful for conditional item display based
 * on permissions, feature flags, or other runtime conditions.
 * 
 * @example
 * ```tsx
 * // Basic drawer item with static active state
 * const basicItem: IDrawerItemProps = {
 *   label: "Home",
 *   icon: "home",
 *   active: true,
 *   onPress: (event, context) => {
 *     console.log("Home pressed", context.drawer.isOpen());
 *   }
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Drawer item with dynamic active state based on drawer context
 * const dynamicItem: IDrawerItemProps = {
 *   label: "Profile",
 *   icon: "user",
 *   active: ({ drawer }) => drawer.isPermanent(),
 *   isRendable: true,
 *   closeOnPress: false, // Don't close drawer when pressed
 *   onPress: (event, { drawer }) => {
 *     if (drawer.isMinimized()) {
 *       drawer.setMinimized(false);
 *     }
 *   }
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Conditional drawer item with permission check
 * const adminItem: IDrawerItemProps = {
 *   label: "Admin Panel",
 *   icon: "admin-panel-settings",
 *   isRendable: user.hasPermission("admin"),
 *   active: (context) => context.drawer.isOpen() && currentPath === "/admin",
 *   badge: { text: "Admin", variant: { color: "danger" } }
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Expandable drawer item with sub-items
 * const expandableItem: IDrawerItemProps = {
 *   label: "Settings",
 *   icon: "settings",
 *   expandable: true,
 *   items: [
 *     { label: "General", href: "/settings/general" },
 *     { label: "Security", href: "/settings/security" },
 *     { label: "Privacy", href: "/settings/privacy" }
 *   ],
 *   expandableProps: {
 *     defaultExpanded: false,
 *     collapsedIconProps: { name: "chevron-right" },
 *     expandedIconProps: { name: "chevron-down" }
 *   }
 * };
 * ```
 */
export interface IDrawerItemProps extends INavItemProps<IDrawerContext> {
  /**
   * Determines if the drawer item is in an active state.
   * 
   * When provided as a boolean, it directly sets the active state.
   * When provided as a function, it receives the drawer context and should
   * return a boolean indicating whether the item is active.
   * 
   * Active items typically display with highlighted styling to indicate
   * the current selection, route, or state.
   * 
   * @default undefined
   * 
   * @example
   * ```tsx
   * // Static active state
   * <DrawerItem active={true} label="Current Page" />
   * 
   * // Dynamic active state based on drawer state
   * <DrawerItem 
   *   active={({ drawer }) => drawer.isPermanent()} 
   *   label="Pinned Item" 
   * />
   * 
   * // Dynamic active state based on current route
   * <DrawerItem 
   *   active={({ drawer }) => window.location.pathname === "/dashboard"} 
   *   label="Dashboard" 
   * />
   * ```
   */
  active?: boolean | ((options: IDrawerContext) => boolean);

  /**
   * Controls whether the drawer item should be rendered.
   * 
   * When set to false, the item will not appear in the drawer at all.
   * This is useful for implementing conditional item display based on:
   * - User permissions
   * - Feature flags
   * - Runtime conditions
   * - Dynamic menu configurations
   * 
   * @default true
   * 
   * @example
   * ```tsx
   * // Conditionally render based on user role
   * <DrawerItem 
   *   label="Admin Panel" 
   *   isRendable={user.role === "admin"} 
   * />
   * 
   * // Conditionally render based on feature flag
   * <DrawerItem 
   *   label="Beta Feature" 
   *   isRendable={featureFlags.betaFeatureEnabled} 
   * />
   * 
   * // Always render (default behavior)
   * <DrawerItem label="Always Visible" isRendable={true} />
   * ```
   */
  isRendable?: boolean;
}

/**
 * Union type representing all possible events that can be emitted by the Drawer component.
 * 
 * These events provide hooks into the drawer's lifecycle and state changes,
 * allowing components to respond to user interactions and state transitions.
 * 
 * @typedef {string} IDrawerEvent
 * 
 * @property {"minimized"} minimized - 
 * Emitted when the drawer's minimized state changes. This occurs when the drawer
 * is collapsed to show only icons or expanded to show full content.
 * 
 * @property {"permanent"} permanent - 
 * Emitted when the drawer's permanent state changes. This occurs when the drawer
 * is pinned (becomes permanent and always visible) or unpinned (becomes dismissible).
 * 
 * @property {"toggle"} toggle - 
 * Emitted when the drawer is toggled between open and closed states.
 * This is a general toggle event that fires regardless of the specific action.
 * 
 * @property {"state_changed"} state_changed - 
 * Emitted when the drawer's internal state changes during animations or interactions.
 * Possible states include "Idle", "Dragging", and "Settling".
 * 
 * @property {"opened"} opened - 
 * Emitted when the drawer completes its opening animation and becomes fully visible.
 * This fires after the animation finishes, not when it starts.
 * 
 * @property {"closed"} closed - 
 * Emitted when the drawer completes its closing animation and becomes fully hidden.
 * This fires after the animation finishes, not when it starts.
 * 
 * @example
 * ```tsx
 * // Listen to drawer events using the trigger method
 * drawer.on("opened", (drawerInstance) => {
 *   console.log("Drawer opened!", drawerInstance.isOpen());
 * });
 * 
 * drawer.on("minimized", (drawerInstance) => {
 *   console.log("Minimized state:", drawerInstance.isMinimized());
 * });
 * 
 * drawer.on("permanent", (drawerInstance) => {
 *   console.log("Permanent state:", drawerInstance.isPermanent());
 * });
 * ```
 * 
 * @example
 * ```tsx
 * // Using events in component props
 * <Drawer
 *   onDrawerStateChanged={({ newState }) => {
 *     console.log("Drawer state:", newState); // "Idle", "Dragging", "Settling"
 *   }}
 *   onDrawerOpen={({ drawer }) => {
 *     console.log("Drawer opened event");
 *   }}
 *   onDrawerClose={({ drawer }) => {
 *     console.log("Drawer closed event");
 *   }}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Event handling in a custom hook
 * function useDrawerEvents(drawer: Drawer) {
 *   useEffect(() => {
 *     const handleMinimized = (drawerInstance: Drawer) => {
 *       // Update UI based on minimized state
 *       updateLayout(drawerInstance.isMinimized());
 *     };
 * 
 *     const handlePermanent = (drawerInstance: Drawer) => {
 *       // Save permanent state to user preferences
 *       saveUserPreference("drawerPinned", drawerInstance.isPermanent());
 *     };
 * 
 *     drawer.on("minimized", handleMinimized);
 *     drawer.on("permanent", handlePermanent);
 * 
 *     return () => {
 *       drawer.off("minimized", handleMinimized);
 *       drawer.off("permanent", handlePermanent);
 *     };
 *   }, [drawer]);
 * }
 * ```
 */
export type IDrawerEvent = "minimized" | "permanent" | "toggle" | "state_changed" | "opened" | "closed";