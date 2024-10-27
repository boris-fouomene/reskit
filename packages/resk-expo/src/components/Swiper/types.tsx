import { IViewProps } from "@components/View";
import { ReactNode } from "react";
import { Animated } from "react-native";

/**
 * Represents the properties for the Swiper component.
 * This interface extends IViewProps, allowing for additional styling and behavior.
 * 
 * @interface ISwiperProps
 * @extends IViewProps
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
export interface ISwiperProps extends IViewProps {

    /**
     * Indicates if the swiper should scroll vertically. 
*                Defaults to false (horizontal scrolling).
*                @example 
*                ```tsx
*                <Swiper vertical={true} />
*                ```
     */
    vertical?: boolean,
    /**
     * Automatically adjusts the height of the swiper 
*                  to fit the content. Useful for ensuring the 
*                  swiper occupies the full page height.
*                  @example
*                  ```tsx
*                  <Swiper autoHeight={true} />
*                  ```
     */
    autoHeight?: boolean,

    /***
     * the swiper will auto play by default
     */
    autoplay?: boolean;
    /**
     * The currently active index of the swiper. 
    *This can be used to control the active slide programmatically.
    *@example
    *```tsx
    *<Swiper activeIndex={1} />
    *```
     */
    activeIndex?: number,

    /***
     * Enables looping of the swiper. When true, the swiper 
*            will loop back to the first slide after reaching the last slide.
*            @example
*            ```tsx
*            <Swiper loop={true} />
*            ```
     */
    loop?: boolean,

    /***
     * The duration in milliseconds for automatic slide transitions. 
*             If set, the swiper will automatically change slides at this interval.
*              @example
*              ```tsx
*            <Swiper timeout={3000} />
*              ```
     */
    timeout?: number,

    /***
     * A function that allows for enabling or disabling gestures 
    *     for the swiper. This can be used to customize gesture behavior.
    *     @example
    *     ```tsx
    *     <Swiper gesturesEnabled={() => true} />
    *     ```
     */
    gesturesEnabled?: Function,


    /**
     * A placeholder component that can be displayed when 
    *   the swiper has no content. Useful for loading states.
    *   @example
    *   ```tsx
    *   <Swiper placeholder={<LoadingIndicator />} />
    *   ```
     */
    placeholder?: ReactNode,

    /**
     * Configuration for the 
    *       spring animation used during transitions.
    *       @example
    *       ```tsx
    *       <Swiper animationConfig={{ tension: 40, friction: 5 }} />
     */
    animationConfig?: Animated.SpringAnimationConfig,

    /***
     * The minimum distance in pixels that must be 
    *         moved to capture a touch event inside a ScrollView.
    *          @example
    *         ```tsx
    *         <Swiper minDistanceToCapture={20} />
    *         ```
    */
    minDistanceToCapture?: number, // inside ScrollView

    /***
     * The minimum distance in pixels required to 
    *       trigger an action on swipe.
    *       @example
    *       ```tsx
     *       <Swiper minDistanceForAction={10} />
    *       ```
     */
    minDistanceForAction?: number,
    /***
     * 
      if a parent View wants to prevent the child from becoming responder on a touch start, it should have a onStartShouldSetResponderCapture handler which returns true.
     * @see : https://stackoverflow.com/questions/45810262/how-to-disable-panresponder-on-child-component-react-native
     */
    stopChildrenEventPropagation?: boolean,

    /***
     * Callback function that is called when the animation starts.
    *       @example
    *       ```tsx
    *       <Swiper onAnimationStart={() => console.log('Animation started')} />
    *       ```
     */
    onAnimationStart?: Function,

    /***
     * Callback function that is called when the animation ends.
    *     @example
    *     ```tsx
    *      <Swiper onAnimationEnd={() => console.log('Animation ended')} />
    *     ```
     */
    onAnimationEnd?: Function,


    /***
     * Callback function that is called when the active index changes.
    *                 Receives an object with the new index and the previous index.
     *                 @example
    *                 ```tsx
    *                 <Swiper onChange={({ index, prevIndex }) => console.log(`Changed from ${prevIndex} to ${index}`)} />
    *                 ```
     */
    onChange?: (options: { index: number, prevIndex: number }) => any,

    /***
     *  When true, fixes vertical bounces in Safari.
 *   @example
 *   ```tsx
 *   <Swiper positionFixed={true} />
 *   ```
     */
    positionFixed?: boolean, // Fix safari vertical bounces

    /***
     * Props that can be passed to the content container of the swiper.
    *            Allows for customization of the container's styling.
    *            @example *            ```tsx
    *            <Swiper contentContainerProps={{ style: { backgroundColor: 'red' } }} />
    *            ```
     */
    contentContainerProps?: IViewProps,

    /***
     * Props that can be passed to the swipe area of the swiper.
 *      Allows for customization of the swipe area's styling.
 *      @example
 *      ```tsx
 *      <Swiper swipeAreaProps={{ style: { backgroundColor: 'blue' } }} />
 *      ```
     */
    swipeAreaProps?: IViewProps,

    /**
     * Props that can be passed to the content of the swiper.
    *    Allows for customization of the content's styling.
    *    @example
    *    ```tsx
    *    <Swiper contentProps={{ style: { backgroundColor: 'green' } }} />
    *    ```
     */
    contentProps?: IViewProps,

    /***
     * If true, disables the swiper, preventing any interactions.
 *                 @example
 *                 ```tsx
 *                 <Swiper disabled={true} />
 *                 ```
     */
    disabled?: boolean;
};


/**
 * Represents the state of the Swiper component.
 * This type is used to manage the internal state of the swiper, including 
 * the position of the swipe gesture and the dimensions of the swiper.
 * 
 * @type ISwiperState
 * 
 * @property {Animated.ValueXY} pan - An animated value representing the current 
 *            pan gesture in both the X and Y directions. 
 *            This is used to track the user's swipe movements.
 *            @example
 *            ```tsx
 *            const [state, setState] = useState<ISwiperState>({
 *                pan: new Animated.ValueXY(),
 *                x: 0,
 *                y: 0,
 *                width: 300,
 *                height: 400,
 *                activeIndex: 0
 *            });
 *            ```
 * 
 * @property {number} x - The current X position of the swiper. This value is updated 
 *                         as the user swipes left or right.
 *                         @example
 *                         ```tsx
 *                         const xPosition = state.x; // Accessing the current X position
 *                         ```
 * 
 * @property {number} y - The current Y position of the swiper. This value is updated 
 *                         as the user swipes up or down.
 *                         @example
 *                         ```tsx
 *                         const yPosition = state.y; // Accessing the current Y position
 *                         ```
 * 
 * @property {number} width - The current width of the swiper. This is useful for 
 *  determining how much space the swiper occupies.
 *  @example
 *  ```tsx
 *  const swiperWidth = state.width; // Getting the width of the swiper
 *  ```
 * 
 * @property {number} height - The current height of the swiper. This is useful for 
 *   determining how much vertical space the swiper occupies.
 *   @example
 *   ```tsx
 *   const swiperHeight = state.height; // Getting the height of the swiper
 *   ```
 * 
 * @property {number} activeIndex - The index of the currently active slide. This is 
 *         crucial for managing which slide is displayed to the user.
 *         @example
 *         ```tsx
 *         const currentIndex = state.activeIndex; // Accessing the active slide index
 *         ```
 * 
 * @property {number} [left] - Optional property that represents the left position 
 *   of the swiper. This can be used for positioning the swiper 
 *   within its parent container.
 *   @example
 *   ```tsx
 *   const leftPosition = state.left; // Accessing the left position if set
 *   ```
 * 
 * @property {number} [top] - Optional property that represents the top position 
 *  of the swiper. This can be used for positioning the swiper 
 *  within its parent container.
 *  @example
 *  ```tsx
 *  const topPosition = state.top; // Accessing the top position if set
 *  ```
 */
export type ISwiperState = {
    pan: Animated.ValueXY,
    x: number,
    y: number,
    width: number,
    height: number,
    activeIndex: number,
    left?: number,
    top?: number
}