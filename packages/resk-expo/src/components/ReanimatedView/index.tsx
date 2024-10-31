import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { getDefaultReanimatedAnimation, getReanimatedAnimations, IReanimatedAnimationDirection, IReanimatedAnimationType } from "./utils";

const ANIMATION_DURATION = 300;

/**
 * ReanimatedView component that renders an animation between two states 
 * using the Animated.View component from react-native-reanimated.
 *
 * This component allows for customizable entering and exiting animations 
 * based on the specified type and direction. It also provides default 
 * callbacks for logging when animations start and finish, but these can 
 * be overridden by the user.
 *
 * @param {IReanimatedViewProp} props - The props for the component.
 * @param {IReanimatedAnimationType} [props.type] - Optional type of animation 
 *                                                   (e.g., "fade", "slide").
 * @param {IReanimatedAnimationDirection} [props.direction] - Optional direction 
 *                                                           for the animation 
 *                                                           (e.g., "up", "down", 
 *                                                           "left", "right").
 * @param {number} [props.duration] - Optional duration of the animation in 
 *                                     milliseconds. Defaults to 300ms.
 * @param {function} [props.enteringCallback] - Optional callback that is 
 *                                               invoked when the entering 
 *                                               animation completes. Receives 
 *                                               an event object.
 * @param {function} [props.exitingCallback] - Optional callback that is 
 *                                              invoked when the exiting 
 *                                              animation completes. Receives 
 *                                              an event object.
 * @param {React.Ref<any>} ref - Ref to the Animated.View component.
 *
 * @returns {JSX.Element} The Animated.View component with the applied animations.
 *
 * @example
 * <ReanimatedView
 *   type="fade"
 *   direction="up"
 *   duration={500}
 *   enteringCallback={(e) => console.log("Entering:", e)}
 *   exitingCallback={(e) => console.log("Exiting:", e)}
 * >
 *   <Text>Hello, World!</Text>
 * </ReanimatedView>
 */
export const ReanimatedView = React.forwardRef(({ type, direction, enteringCallback, exitingCallback, ...rest }: IReanimatedViewProp, ref: React.Ref<any>) => {
  const duration = typeof rest.duration === "number" ? rest.duration : ANIMATION_DURATION;
  let animations: any = getReanimatedAnimations(type, direction);
  const style = useAnimatedStyle(() => {
    return {};
  });

  // Default callback functions for entering and exiting animations
  enteringCallback = enteringCallback || function () { console.log(" is entering"); };
  exitingCallback = exitingCallback || function () { console.log(" is animation exiting"); };

  // Configure animations with duration and callbacks
  if (animations.entering && animations.exiting) {
    animations.entering.duration(duration).withCallback(enteringCallback);
    animations.exiting.duration(duration).withCallback(exitingCallback);
  } else {
    animations = getDefaultReanimatedAnimation({ duration, enteringCallback, exitingCallback });
  }

  return (
    <Animated.View
      testID={'RN_AnimationComponent'}
      ref={ref}
      {...rest}
      style={[rest.style, style]}
      {...animations}
    />
  );
});
ReanimatedView.displayName = "ReanimatedView";


export default ReanimatedView;


/**
 * Type representing the props for a reanimated animation component.
 *
 * This type extends the props of the `Animated.View` component from 
 * React Native reanimated, adding additional properties specific to react-native-reanimated 
 * animations. It allows for customization of animation duration, 
 * callbacks for entering and exiting animations, and other animation 
 * related properties.
 *
 * @property {number | undefined} duration - Optional duration of the 
 *                                            animation in milliseconds. Default to 300ms.
 * @property {React.ReactNode | undefined} children - Optional children 
 *                                                    elements to be rendered 
 *                                                    inside the animated view.
 * @property {((e: any) => void) | undefined} enteringCallback - 
 *        Optional callback function that is invoked when the entering 
 *        animation completes. Receives an event object.
 * @property {((e: any) => void) | undefined} exitingCallback - 
 *        Optional callback function that is invoked when the exiting 
 *        animation completes. Receives an event object.
 * @property {IReanimatedAnimationType | undefined} type - Optional type of 
 *                                                         animation (e.g., 
 *                                                         "fade", "slide").
 * @property {IReanimatedAnimationDirection | undefined} direction - 
 *        Optional direction for the animation (e.g., "up", "down", 
 *        "left", "right").
 * @property {number | undefined} animationDelay - Optional delay before 
 *                                                starting the animation, 
 *                                                in milliseconds.
 */
export type IReanimatedViewProp = React.ComponentProps<typeof Animated.View> & {
  duration?: number;
  children?: any;
  enteringCallback?: (e: any) => void;
  exitingCallback?: (e: any) => void;
  type?: IReanimatedAnimationType;
  direction?: IReanimatedAnimationDirection;
  animationDelay?: number;
};

export * from "./utils";