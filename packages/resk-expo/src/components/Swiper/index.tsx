
import React, { ReactNode } from 'react';
import { Animated, I18nManager, Dimensions, PanResponder, StyleSheet, View, PanResponderInstance, GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { ActivityIndicator } from '@components/ActivityIndicator';
import { IViewProps } from '@components/View';
import { IFlatStyle, IStyle } from '../../types';
import Theme from "@theme";
import { ISwiperProps, ISwiperState } from './types';
import { isRTL } from '@utils/i18nManager';
import platform from '@platform/index';
const WIDTH_HEIGHT = 250;

const useNativeDriver = platform.isMobileNative(); // because of RN #13377

export * from "./types";
/**
 * Swiper component that renders a view with swipeable children.
 * The elements are displayed in a stack, and the child at the activeIndex is visible 
 * while the others are hidden.
 * 
 * @class Swiper
 * @extends React.Component<ISwiperProps, ISwiperState>
 * 
 * @example
 * ```tsx
 * <Swiper activeIndex={0} timeout={5} loop={true}>
 *   <View><Text>Slide 1</Text></View>
 *   <View><Text>Slide 2</Text></View>
 *   <View><Text>Slide 3</Text></View>
 * </Swiper>
 * ```
 * Here is the list of it's properties
 * 
 * @property {boolean} [vertical] - Indicates if the swiper should scroll vertically. 
 *                Defaults to false (horizontal scrolling).
 *                @example 
 *                ```tsx
 *                <Swiper vertical={true} />
 *                ```
 * 
 * @property {boolean} [autoHeight] - Automatically adjusts the height of the swiper 
 *                  to fit the content. Useful for ensuring the 
 *                  swiper occupies the full page height.
 *                  @example
 *                  ```tsx
 *                  <Swiper autoHeight={true} />
 *                  ```
 * 
 * @property {number} [activeIndex] - The currently active index of the swiper. 
 *This can be used to control the active slide programmatically.
 *@example
 *```tsx
 *<Swiper activeIndex={1} />
 *```
 * 
 * @property {boolean} [loop] - Enables looping of the swiper. When true, the swiper 
 *            will loop back to the first slide after reaching the last slide.
 *            @example
 *            ```tsx
 *            <Swiper loop={true} />
 *            ```
 * 
 * @property {number} [timeout] - The duration in milliseconds for automatic slide transitions. 
 *              If set, the swiper will automatically change slides at this interval.
 *              @example
 *              ```tsx
 *              <Swiper timeout={3000} />
 *              ```
 * 
 * @property {Function} [gesturesEnabled] - A function that allows for enabling or disabling gestures 
 *     for the swiper. This can be used to customize gesture behavior.
 *     @example
 *     ```tsx
 *     <Swiper gesturesEnabled={() => true} />
 *     ```
 * 
 * @property {ReactNode} [placeholder] - A placeholder component that can be displayed when 
 *   the swiper has no content. Useful for loading states.
 *   @example
 *   ```tsx
 *   <Swiper placeholder={<LoadingIndicator />} />
 *   ```
 * 
 * @property {Animated.SpringAnimationConfig} [animationConfig] - Configuration for the 
 *       spring animation used during transitions.
 *       @example
 *       ```tsx
 *       <Swiper animationConfig={{ tension: 40, friction: 5 }} />
 *       ```
 * 
 * @property {number} [minDistanceToCapture] - The minimum distance in pixels that must be 
 *         moved to capture a touch event inside a ScrollView.
 *         @example
 *         ```tsx
 *         <Swiper minDistanceToCapture={20} />
 *         ```
 * 
 * @property {number} [minDistanceForAction] - The minimum distance in pixels required to 
 *       trigger an action on swipe.
 *       @example
 *       ```tsx
 *       <Swiper minDistanceForAction={10} />
 *       ```
 * 
 * @property {boolean} [stopChildrenEventPropagation] - If true, prevents touch events from 
 *                propagating to child components. This is useful 
 *                when you want to disable interaction with child 
 *                components while swiping.
 *                @example
 *                ```tsx
 *                <Swiper stopChildrenEventPropagation={true} />
 *                ```
 * 
 * @property {Function} [onAnimationStart] - Callback function that is called when the animation starts.
 *       @example
 *       ```tsx
 *       <Swiper onAnimationStart={() => console.log('Animation started')} />
 *       ```
 * 
 * @property {Function} [onAnimationEnd] - Callback function that is called when the animation ends.
 *     @example
 *     ```tsx
 *     <Swiper onAnimationEnd={() => console.log('Animation ended')} />
 *     ```
 * 
 * @property {Function} [onChange] - Callback function that is called when the active index changes.
 *                 Receives an object with the new index and the previous index.
 *                 @example
 *                 ```tsx
 *                 <Swiper onChange={({ index, prevIndex }) => console.log(`Changed from ${prevIndex} to ${index}`)} />
 *                 ```
 * 
 * @property {boolean} [positionFixed] - When true, fixes vertical bounces in Safari.
 *   @example
 *   ```tsx
 *   <Swiper positionFixed={true} />
 *   ```
 * 
 * @property {IViewProps} [contentContainerProps] - Props that can be passed to the content container of the swiper.
 *            Allows for customization of the container's styling.
 *            @example *            ```tsx
 *            <Swiper contentContainerProps={{ style: { backgroundColor: 'red' } }} />
 *            ```
 * 
 * @property {IViewProps} [swipeAreaProps] - Props that can be passed to the swipe area of the swiper.
 *      Allows for customization of the swipe area's styling.
 *      @example
 *      ```tsx
 *      <Swiper swipeAreaProps={{ style: { backgroundColor: 'blue' } }} />
 *      ```
 * 
 * @property {IViewProps} [contentProps] - Props that can be passed to the content of the swiper.
 *    Allows for customization of the content's styling.
 *    @example
 *    ```tsx
 *    <Swiper contentProps={{ style: { backgroundColor: 'green' } }} />
 *    ```
 * 
 * 
 * @property {boolean} [disabled] - If true, disables the swiper, preventing any interactions.
 *                 @example
 *                 ```tsx
 *                 <Swiper disabled={true} />
 *                 ```
 */
export class Swiper extends React.Component<ISwiperProps, ISwiperState> {
  /**
   * Default properties for the Swiper component.
   * 
   * @static
   * @type {ISwiperProps}
   */
  static defaultProps: ISwiperProps = {
    vertical: false,
    activeIndex: 0,
    loop: false,
    timeout: 0,
    //withScrollView : true,
    gesturesEnabled: () => true,
    minDistanceToCapture: 5,
    minDistanceForAction: 0.2,
    positionFixed: false,
  }
  autoplay: any;// Autoplay timer reference
  children = (() => React.Children.toArray(this.props.children))()// Array of children passed to the swiper;
  count = (() => this.children.length)();
  _panResponder?: PanResponderInstance; // PanResponder instance for handling gestures
  _animatedValueX: number = 0; // Current animated value for X axis
  _animatedValueY: number = 0; // Current animated value for Y axis

  /**
   * State of the Swiper component.
   * 
   * @type {ISwiperState}
   */
  state: ISwiperState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    activeIndex: 0,
    pan: new Animated.ValueXY(),
  }
  /**
   * Starts the autoplay feature of the swiper.
   * It sets a timeout to automatically transition to the next slide.
   * 
   * @method startAutoplay
   */
  startAutoplay() {
    const { timeout, autoplay } = this.props;
    if (autoplay === false) return;
    this.stopAutoplay();
    if (timeout) {
      this.autoplay = setTimeout(
        this._autoplayTimeout,
        Math.abs(timeout) * 1000
      );
    }
  }
  /**
   * Stops the autoplay feature of the swiper.
   * 
   * @method stopAutoplay
   */
  stopAutoplay() {
    this.autoplay && clearTimeout(this.autoplay);
  }

  /**
   * Navigates to the next slide in the swiper.
   * 
   * @method goToNext
   */
  goToNext() {
    this._goToNeighboring();
  }
  /**
   * Navigates to the previous slide in the swiper.
   * 
   * @method goToPrev
   */
  goToPrev() {
    this._goToNeighboring(true);
  }
  /**
   * Navigates to a specific slide based on the provided index.
   * 
   * @method goTo
   * @param {number} [index=0] - The index of the slide to navigate to.
   */
  goTo(index = 0) {
    const delta = index - this.getActiveIndex();
    if (delta) {
      this._fixAndGo(delta);
    }
  }
  /**
  * Retrieves the current active index of the swiper.
  * 
  * @method getActiveIndex
  * @returns {number} The index of the currently active slide.
  */
  getActiveIndex() {
    return this.state.activeIndex;
  }

  // Private methods

  /**
   * Handles the timeout for the autoplay feature.
   * 
   * @method _autoplayTimeout
   */
  private _autoplayTimeout() {
    const { timeout } = this.props;
    this._goToNeighboring(typeof timeout == 'number' && timeout < 0);
  }
  /**
   * Navigates to the neighboring slide based on the provided direction.
   * 
   * @method _goToNeighboring
   * @param {boolean} [toPrev=false] - Whether to navigate to the previous slide.
   */
  private _goToNeighboring(toPrev = false) {
    this._fixAndGo(toPrev ? -1 : 1);
  }
  /**
   * Initializes the swiper component.
   * 
   * @method constructor
   * @param {ISwiperProps} props - The props passed to the swiper component.
   */
  constructor(props: ISwiperProps) {
    super(props);
    Object.assign(this.state, {
      activeIndex: props.activeIndex || 0,
    });
    this._autoplayTimeout = this._autoplayTimeout.bind(this);
    this._onLayout = this._onLayout.bind(this);
    this._fixState = this._fixState.bind(this);

    this.goToPrev = this.goToPrev.bind(this);
    this.goToNext = this.goToNext.bind(this);
    this.goTo = this.goTo.bind(this);
    this._animatedValueX = 0;
    this._animatedValueY = 0;
    this._panResponder = PanResponder.create(this._getPanResponderCallbacks());
  }

  componentDidMount() {
    this.state.pan.x.addListener(({ value }) => (this._animatedValueX = value));
    this.state.pan.y.addListener(({ value }) => (this._animatedValueY = value));
    this.startAutoplay();
  }

  componentWillUnmount() {
    this.stopAutoplay();
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
  }
  /**
   * Handles the component update lifecycle event.
   * 
   * @method UNSAFE_componentWillReceiveProps
   * @param {Readonly<ISwiperProps>} nextProps - The next props passed to the swiper component.
   * @param {any} nextContext - The next context passed to the swiper component.
   */
  UNSAFE_componentWillReceiveProps(nextProps: Readonly<ISwiperProps>, nextContext: any): void {
    this.children = (() => React.Children.toArray(nextProps.children))();
    this.count = (() => this.children.length)();
    if (typeof nextProps.activeIndex == 'number' && nextProps.activeIndex !== this.state.activeIndex) {
      this.setState({ activeIndex: nextProps.activeIndex }, () => {
        this._fixState();
      })
    }
  }
  /**
   * Retrieves the pan responder callbacks for handling gestures.
   * 
   * @method _getPanResponderCallbacks
   * @returns {{ onPanResponderTerminationRequest: () => boolean, onMoveShouldSetResponderCapture: () => boolean, onMoveShouldSetPanResponderCapture: (e: GestureResponderEvent, gestureState: any) => boolean, onPanResponderGrant: () => void, onPanResponderMove: (e: GestureResponderEvent, gestureState: any) => void, onPanResponderRelease: (e: GestureResponderEvent, gestureState: any) => void }}
   */
  _getPanResponderCallbacks() {
    return {
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetResponderCapture: () => true,
      /***
       * Disable panResponder on chidld of vie
       * @see : https://stackoverflow.com/questions/45810262/how-to-disable-panresponder-on-child-component-react-native 
       * 
      */
      onMoveShouldSetPanResponderCapture: (e: GestureResponderEvent, gestureState: any) => {
        const { gesturesEnabled, vertical, minDistanceToCapture } = this.props;

        if (gesturesEnabled && !gesturesEnabled()) {
          return false;
        }

        this.props.onAnimationStart &&
          this.props.onAnimationStart(this.getActiveIndex());
        const min: number = (minDistanceToCapture !== undefined ? minDistanceToCapture : Swiper.defaultProps.minDistanceForAction) as number;
        const allow =
          Math.abs(vertical ? gestureState.dy : gestureState.dx) > min;

        if (allow) {
          this.stopAutoplay();
        }

        return allow;
      },
      onPanResponderGrant: () => this._fixState(),
      onPanResponderMove: Animated.event([
        null,
        this.props.vertical
          ? { dy: this.state.pan.y }
          : { dx: this.state.pan.x },
      ], { useNativeDriver }),
      onPanResponderRelease: (e: GestureResponderEvent, gesture: any) => {
        const { vertical, minDistanceForAction } = this.props;
        const { width, height } = this.state;

        this.startAutoplay();

        const correction = vertical
          ? gesture.moveY - gesture.y0
          : gesture.moveX - gesture.x0;
        const distance = (vertical ? height : width) * (typeof minDistanceForAction == "number" ? minDistanceForAction : 0.2);
        const incrementIndex = correction > 0 ? (!vertical && isRTL ? 1 : -1) : (!vertical && isRTL ? -1 : 1);
        if (Math.abs(Math.abs(correction) - distance) < 50) {
          this._spring({ x: 0, y: 0 });
        } else {
          this._changeIndex(incrementIndex);
        }
      },
    };
  }

  _spring(toValue: { x: number, y: number }) {
    const { animationConfig, onAnimationEnd } = this.props;
    const { activeIndex } = this.state;
    Animated.spring(this.state.pan, {
      ...Object.assign({}, animationConfig),
      toValue,
      useNativeDriver, // false, see top of file
    }).start(() => onAnimationEnd && onAnimationEnd(activeIndex));
  }

  _fixState() {
    const { vertical } = this.props;
    const { width, height, activeIndex } = this.state;
    this._animatedValueX = vertical ? 0 : width * activeIndex * (I18nManager.isRTL ? 1 : -1);
    this._animatedValueY = vertical ? height * activeIndex * -1 : 0;
    this.state.pan.setOffset({
      x: this._animatedValueX,
      y: this._animatedValueY,
    });
    this.state.pan.setValue({ x: 0, y: 0 });
  }

  /**
     * Fixes the state of the swiper and navigates to the specified slide.
     * 
     * @method _fixAndGo
     * @param {number} delta - The delta value to navigate to the next or previous slide.
     */
  _fixAndGo(delta: number) {
    this._fixState();
    this.props.onAnimationStart &&
      this.props.onAnimationStart(this.getActiveIndex());
    this._changeIndex(delta);
  }

  _changeIndex(delta: number = 1, callOnChange?: boolean) {
    const { loop, vertical } = this.props;
    const { width, height, activeIndex } = this.state;

    let toValue = { x: 0, y: 0 };
    let skipChanges = !delta;
    let calcDelta = delta;

    if (activeIndex <= 0 && delta < 0) {
      skipChanges = !loop;
      calcDelta = this.count + delta;
    } else if (activeIndex + 1 >= this.count && delta > 0) {
      skipChanges = !loop;
      calcDelta = -1 * activeIndex + delta - 1;
    }

    if (skipChanges) {
      return this._spring(toValue);
    }

    this.stopAutoplay();

    let index = activeIndex + calcDelta;
    this.setState({ activeIndex: index });

    if (vertical) {
      toValue.y = height * -1 * calcDelta;
    } else {
      toValue.x = width * (I18nManager.isRTL ? 1 : -1) * calcDelta;
    }
    this._spring(toValue);

    this.startAutoplay();
    if (callOnChange !== false && this.props.onChange) {
      this.props.onChange({ index, prevIndex: activeIndex });
    }
  }
  evaluateHeight() {

  }
  _onLayout(options: LayoutChangeEvent) {
    const {
      nativeEvent: {
        layout: { x, y, width: layoutWidth, height: layoutHeight },
      },
    } = options;
    const { width: winWidth, height: winHeight } = Dimensions.get("window");
    const left = x;
    const top = y;
    let width = winWidth - left
    if (layoutWidth >= WIDTH_HEIGHT) {
      width = layoutWidth
    } else {
      width = Math.max(WIDTH_HEIGHT, width)
    }
    const height = Math.max(winHeight - top, WIDTH_HEIGHT, layoutHeight);
    this.setState({ x, y, width, left, top, height }, () => this._fixState());
    if (this.props.onLayout) this.props.onLayout(options);
  }

  render() {
    let {
      loop,
      vertical,
      positionFixed,
      contentContainerProps,
      swipeAreaProps,
      contentProps,
      testID,
      placeholder,
      disabled,
      ...props
    } = this.props;
    const { pan, x, y, width, height: customHeight } = this.state;
    contentContainerProps = Object.assign({}, contentContainerProps);
    swipeAreaProps = Object.assign({}, swipeAreaProps);
    contentProps = Object.assign({}, contentProps);
    testID = testID || 'rn-swiper';
    const isReady = customHeight > 40 ? true : false;
    const autoHeight = !!this.props.autoHeight;
    const height = autoHeight ? this.state.height : !isReady ? WIDTH_HEIGHT : customHeight;
    contentContainerProps = Object.assign({}, contentContainerProps);
    const disabledStyle = disabled && Theme.styles.disabled;
    return (
      <View
        testID={testID}
        {...props}
        style={StyleSheet.flatten([styles.root, props?.style, disabledStyle])}
        onLayout={this._onLayout}
      >
        {!isReady ? (
          React.isValidElement(placeholder) ? placeholder :
            <View testID={testID + '-preloader-container'} style={styles.preloaderContainer as IStyle}>
              {<ActivityIndicator testID={testID + "-preloader"} size={'large'} />}
            </View>
        ) : null}
        <View
          testID={testID + "-content-container"}
          {...contentContainerProps}
          style={[styles.container(positionFixed, x, y, width, height, autoHeight), contentContainerProps.style, disabledStyle]}
        >
          <Animated.View
            testID={testID + "-animated-content-container"}
            style={[
              styles.swipeArea(vertical, this.count, width, height, autoHeight),
              swipeAreaProps.style,
              {
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
              },
            ]}
            {...Object.assign({}, this._panResponder).panHandlers}
          >
            {this.children.map((el, i) => {
              return (
                <View
                  key={i}
                  {...contentProps}
                  testID={testID + "-content-container-" + i}
                  style={[
                    { width },
                    autoHeight && { height, maxHeight: height },
                    contentProps?.style,
                  ]}
                >
                  {el}
                </View>
              );
            })}
          </Animated.View>
        </View>
      </View>
    );
  }
}

/***
 * la liste des propriétés du composant Swipper
 */

const styles = {
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Fix web vertical scaling (like expo v33-34)
  container: (positionFixed?: boolean, x?: number, y?: number, width?: number, height?: number, autoHeight?: boolean) => addAutoHeight(({
    backgroundColor: "transparent",
    // Fix safari vertical bounces
    position: positionFixed ? 'absolute' : 'relative',
    overflow: 'hidden',
    flexGrow: 1,
    //flex : 1,
    top: positionFixed ? y : 0,
    left: positionFixed ? x : 0,
    width,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }), height, autoHeight),
  swipeArea: (vertical?: boolean, count?: number, width?: number, height?: number, autoHeight?: boolean) => addAutoHeight(({
    position: 'relative',
    top: 0,
    left: 0,
    width: vertical ? width : (width as number) * (count || 0),
    flexDirection: vertical ? 'column' : 'row',
  })
    , typeof height === 'number' ? (vertical ? (height as number) * (count || 0) : height) : undefined
    , autoHeight
  ),
  scrollViewContentContainer: {
    paddingBottom: 0,
    flex: 1,
  },
  preloaderContainer: {
    flex: 1,
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
};

const addAutoHeight = (style: IFlatStyle, height?: number | string, autoHeight?: boolean): IFlatStyle => {
  if (height !== undefined && (typeof height == "number") && autoHeight) {
    style.height = height;
  }
  return style;
}