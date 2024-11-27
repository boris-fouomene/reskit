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
 * @param {number} [props.animationDuration] - Optional duration of the animation in 
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
 *   animationTtype="fade"
 *   animationDirection="up"
 *   animationDuration={500}
 *   enteringCallback={(e) => console.log("Entering:", e)}
 *   exitingCallback={(e) => console.log("Exiting:", e)}
 * >
 *   <Text>Hello, World!</Text>
 * </ReanimatedView>
 */
export const ReanimatedView = React.forwardRef(({ animationType, animationDirection, enteringCallback, exitingCallback, ...rest }: IReanimatedViewProp, ref: React.Ref<any>) => {
  const animationDuration = typeof rest.animationDuration === "number" ? rest.animationDuration : ANIMATION_DURATION;
  if (animationType !== "fade" && !animationDirection) {
    animationDirection = "up";
  }
  let animations: any = getReanimatedAnimations(animationType, animationDirection);
  // Default callback functions for entering and exiting animations
  enteringCallback = typeof enteringCallback == "function" ? enteringCallback : function () { };
  exitingCallback = typeof exitingCallback == "function" ? exitingCallback : function () { };

  // Configure animations with animationDuration and callbacks
  if (animations.entering && animations.exiting) {
    animations.entering.duration(animationDuration).withCallback(enteringCallback);
    animations.exiting.duration(animationDuration).withCallback(exitingCallback);
  } else {
    animations = getDefaultReanimatedAnimation({ duration: animationDuration, enteringCallback, exitingCallback });
  }

  return (
    <Animated.View
      testID={'rn-animated'}
      ref={ref}
      {...rest}
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
 * @property {number | undefined} animationDuration - Optional duration of the 
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
 * @property {IReanimatedAnimationType | undefined} animationType - Optional type of 
 *                                                         animation (e.g., 
 *                                                         "fade", "slide").
 * @property {IReanimatedAnimationDirection | undefined} animationDirection - 
 *        Optional direction for the animation (e.g., "up", "down", 
 *        "left", "right").
 * @property {number | undefined} animationDelay - Optional delay before 
 *                                                starting the animation, 
 *                                                in milliseconds.
 */
export type IReanimatedViewProp = React.ComponentProps<typeof Animated.View> & {
  animationDuration?: number;
  children?: any;
  enteringCallback?: (e: any) => void;
  exitingCallback?: (e: any) => void;
  animationType?: IReanimatedAnimationType;
  animationDirection?: IReanimatedAnimationDirection;
  animationDelay?: number;
};

export * from "./utils";