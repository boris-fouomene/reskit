import { defaultStr } from "@resk/core";
import Animated, { FadeIn, FadeInRight, FadeInLeft, FadeInUp, FadeInDown, SlideInRight, SlideInLeft, SlideInUp, SlideInDown, withTiming, EntryExitAnimationFunction, EntryAnimationsValues } from "react-native-reanimated";
import { FadeOut, FadeOutRight, FadeOutLeft, FadeOutUp, FadeOutDown, SlideOutRight, SlideOutLeft, SlideOutUp, SlideOutDown } from "react-native-reanimated";

/**
 * A type representing the various entry animations available in 
 * the React Native Reanimated library. This type encompasses all 
 * the animation functions that can be used for animating components 
 * as they enter the view.
 *
 * @type IReanimatedInAnimations
 * @typedef {typeof FadeIn | typeof FadeInRight | typeof FadeInLeft | typeof FadeInUp | typeof FadeInDown | typeof SlideInRight | typeof SlideInLeft | typeof SlideInUp | typeof SlideInDown}
 *
 * @remarks
 * The `IReanimatedInAnimations` type includes all the available 
 * entry animations provided by the `react-native-reanimated` library. 
 * These animations can be applied to components to create engaging 
 * visual transitions as they appear on the screen.
 *
 * @example
 * // Example of using IReanimatedInAnimations in a component
 * import React from 'react';
 * import { View } from 'react-native';
 * import Animated, { IReanimatedInAnimations, FadeIn } from 'react-native-reanimated';
 *
 * const AnimatedComponent: React.FC = () => {
 *   const animation: IReanimatedInAnimations = FadeIn;
 *
 *   return (
 *     <Animated.View entering={animation}>
 *       <View>
 *         {}
 *       </View>
 *     </Animated.View>
 *   );
 * };
 *
 * @see react-native-reanimated for more information about the available 
 * animations and their usage.
 */
export type IReanimatedInAnimations = typeof FadeIn | typeof FadeInRight | typeof FadeInLeft | typeof FadeInUp | typeof FadeInDown | typeof SlideInRight | typeof SlideInLeft | typeof SlideInUp | typeof SlideInDown;


/**
 * A type representing the various exit animations available in 
 * the React Native Reanimated library. This type encompasses all 
 * the animation functions that can be used for animating components 
 * as they exit the view.
 *
 * @type IReanimatedOutAnimations
 * @typedef {typeof FadeOut | typeof FadeOutRight | typeof FadeOutLeft | typeof FadeOutUp | typeof FadeOutDown | typeof SlideOutRight | typeof SlideOutLeft | typeof SlideOutUp | typeof SlideOutDown}
 *
 * @remarks
 * The `IReanimatedOutAnimations` type includes all the available 
 * exit animations provided by the `react-native-reanimated` library. 
 * These animations can be applied to components to create engaging 
 * visual transitions as they disappear from the screen.
 *
 * @example
 * // Example of using IReanimatedOutAnimations in a component
 * import React from 'react';
 * import { View } from 'react-native';
 * import Animated, { IReanimatedOutAnimations, FadeOut } from 'react-native-reanimated';
 *
 * const AnimatedComponent: React.FC = () => {
 *   const animation: IReanimatedOutAnimations = FadeOut;
 *
 *   return (
 *     <Animated.View exiting={animation}>
 *       <View>
 *         {}
 *       </View>
 *     </Animated.View>
 *   );
 * };
 *
 * @see react-native-reanimated for more information about the available 
 * animations and their usage.
 */
export type IReanimatedOutAnimations = typeof FadeOut | typeof FadeOutRight | typeof FadeOutLeft | typeof FadeOutUp | typeof FadeOutDown | typeof SlideOutRight | typeof SlideOutLeft | typeof SlideOutUp | typeof SlideOutDown;


/**
 * An object containing various entry animations available in 
 * the React Native Reanimated library. This constant serves as a 
 * convenient reference for all the entry animations that can be 
 * applied to components as they enter the view.
 *
 * @constant
 * @type {Object}
 * @property {typeof FadeIn} FadeIn - The fade-in animation.
 * @property {typeof FadeInRight} FadeInRight - The fade-in animation from the right.
 * @property {typeof FadeInLeft} FadeInLeft - The fade-in animation from the left.
 * @property {typeof FadeInUp} FadeInUp - The fade-in animation from above.
 * @property {typeof FadeInDown} FadeInDown - The fade-in animation from below.
 * @property {typeof SlideInRight} SlideInRight - The slide-in animation from the right.
 * @property {typeof SlideInLeft} SlideInLeft - The slide-in animation from the left.
 * @property {typeof SlideInUp} SlideInUp - The slide-in animation from above.
 * @property {typeof SlideInDown} SlideInDown - The slide-in animation from below.
 *
 * @remarks
 * The `InReanimatedAnimations` constant provides a centralized 
 * collection of entry animations, making it easier to apply 
 * animations consistently throughout your application.
 *
 * @example
 * // Example of using InReanimatedAnimations in a component
 * import React from 'react';
 * import { View } from 'react-native';
 * import Animated, { InReanimatedAnimations } from 'react-native-reanimated';
 *
 * const AnimatedComponent: React.FC = () => {
 *   return (
 *     <Animated.View entering={InReanimatedAnimations.FadeIn}>
 *       <View>
 *         {}
 *       </View>
 *     </Animated.View>
 *   );
 * };
 *
 * @see react-native-reanimated for more information about the available 
 * animations and their usage.
 */
export const InReanimatedAnimations = {
    FadeIn,
    FadeInRight,
    FadeInLeft,
    FadeInUp,
    FadeInDown,
    SlideInRight,
    SlideInLeft,
    SlideInUp,
    SlideInDown
};

/**
 * A collection of exit animations available in the 
 * React Native Reanimated library. This constant serves 
 * as a convenient reference for all the exit animations 
 * that can be applied to components as they leave the view.
 *
 * @constant
 * @type {Object}
 * @property {typeof FadeOut} FadeOut - The fade-out animation.
 * @property {typeof FadeOutRight} FadeOutRight - The fade-out animation from the right.
 * @property {typeof FadeOutLeft} FadeOutLeft - The fade-out animation from the left.
 * @property {typeof FadeOutUp} FadeOutUp - The fade-out animation to the top.
 * @property {typeof FadeOutDown} FadeOutDown - The fade-out animation to the bottom.
 * @property {typeof SlideOutRight} SlideOutRight - The slide-out animation to the right.
 * @property {typeof SlideOutLeft} SlideOutLeft - The slide-out animation to the left.
 * @property {typeof SlideOutUp} SlideOutUp - The slide-out animation to the top.
 * @property {typeof SlideOutDown} SlideOutDown - The slide-out animation to the bottom.
 *
 * @remarks
 * The `OutReanimatedAnimations` constant provides a centralized 
 * collection of exit animations, making it easier to apply 
 * animations consistently throughout your application.
 *
 * @example
 * // Example of using OutReanimatedAnimations in a component
 * import React from 'react';
 * import { View } from 'react-native';
 * import Animated, { OutReanimatedAnimations } from 'react-native-reanimated';
 *
 * const AnimatedComponent: React.FC = () => {
 *   return (
 *     <Animated.View exiting={OutReanimatedAnimations.FadeOut}>
 *       <View>
 *         {}
 *       </View>
 *     </Animated.View>
 *   );
 * };
 *
 * @see react-native-reanimated for more information about the available 
 * animations and their usage.
 */
export const OutReanimatedAnimations = {
    FadeOut,
    FadeOutRight,
    FadeOutLeft,
    FadeOutUp,
    FadeOutDown,
    SlideOutRight,
    SlideOutLeft,
    SlideOutUp,
    SlideOutDown
};


/**
 * A type representing the available animation types 
 * in the React Native Reanimated library.
 *
 * This type can be used to specify the kind of animations 
 * that can be applied to components, allowing for better 
 * type safety and clarity in the code.
 *
 * @type {IReanimatedAnimationType}
 * @enum {string}
 * @property {"fade"} fade - Represents a fade animation.
 * @property {"slide"} slide - Represents a slide animation.
 *
 * @example
 * // Example of using IReanimatedAnimationType in a function
 * function animateComponent(animationType: IReanimatedAnimationType) {
 *   switch (animationType) {
 *     case "fade":
 *       // Apply fade animation logic
 *       break;
 *     case "slide":
 *       // Apply slide animation logic
 *       break;
 *     default:
 *       throw new Error("Invalid animation type");
 *   }
 * }
 */
export type IReanimatedAnimationType = "fade" | "slide";


/**
 * A type representing the available directions for animations 
 * in the React Native Reanimated library.
 *
 * This type can be used to specify the direction of animations 
 * that can be applied to components, enhancing type safety 
 * and clarity in the code.
 *
 * @type {IReanimatedAnimationDirection}
 * @enum {string}
 * @property {"up"} up - Represents an upward animation direction.
 * @property {"right"} right - Represents a rightward animation direction.
 * @property {"left"} left - Represents a leftward animation direction.
 * @property {"down"} down - Represents a downward animation direction.
 *
 * @example
 * // Example of using IReanimatedAnimationDirection in a function
 * function animateInDirection(direction: IReanimatedAnimationDirection) {
 *   switch (direction) {
 *     case "up":
 *       // Apply upward animation logic
 *       break;
 *     case "right":
 *       // Apply rightward animation logic
 *       break;
 *     case "left":
 *       // Apply leftward animation logic
 *       break;
 *     case "down":
 *       // Apply downward animation logic
 *       break;
 *     default:
 *       throw new Error("Invalid animation direction");
 *   }
 * }
 */
export type IReanimatedAnimationDirection = "up" | "right" | "left" | "down";

/**
 * Retrieves the appropriate animation based on the specified 
 * direction (in or out), type, and direction.
 *
 * This function allows you to specify whether you want an 
 * entering or exiting animation, the type of animation (e.g., 
 * fade or slide), and the direction of the animation (up, down, 
 * left, or right). If the direction is not defined, only fade 
 * animations will be supported.
 *
 * @param inOrOut - Specifies whether the animation is entering or exiting.
 *                  Accepts "in" for entering animations and "out" for 
 *                  exiting animations. Defaults to "in".
 * @param type - The type of the animation. Example values include 
 *               "fade" or "slide". Defaults to "fade".
 * @param direction - The direction of the animation. Acceptable values are 
 *                   "", "up", "left", "right", or "down". If not defined, 
 *                   only fadeIn and fadeOut animations are supported.
 * 
 * @returns {IReanimatedInAnimations | IReanimatedOutAnimations} 
 *          The corresponding animation object based on the provided 
 *          parameters.
 *
 * @throws {Error} Throws an error if an invalid animation type or direction 
 *                 is provided.
 *
 * @example
 * // Example of using getReanimatedInOrOutAnimation
 * const animation = getReanimatedInOrOutAnimation("in", "slide", "up");
 * // This will return the slideInUp animation if it exists.
 */
export function getReanimatedInOrOutAnimation(inOrOut: string = "in", type: IReanimatedAnimationType = "fade", direction?: IReanimatedAnimationDirection): IReanimatedInAnimations | IReanimatedOutAnimations {
    inOrOut = defaultStr(inOrOut, 'in').toLowerCase();
    if (inOrOut !== 'in' && inOrOut !== 'out') {
        inOrOut = 'in';
    }
    const isIn = inOrOut == 'in' ? true : false;
    const typeText = defaultStr(type, 'fade').trim().toLowerCase();
    const animationName = typeText.upperFirst() + inOrOut.upperFirst();
    const directionText = defaultStr(direction).trim().toLowerCase();
    if (directionText) {
        const a = animationName + directionText.upperFirst();
        if (isIn && InReanimatedAnimations[a as keyof typeof InReanimatedAnimations]) {
            return InReanimatedAnimations[a as keyof typeof InReanimatedAnimations];
        } else if (!isIn && OutReanimatedAnimations[a as keyof typeof OutReanimatedAnimations]) {
            return OutReanimatedAnimations[a as keyof typeof OutReanimatedAnimations];
        }
    }
    return isIn ? FadeIn : FadeOut;
}

/**
 * Retrieves the appropriate entering animation based on the specified 
 * type and direction.
 *
 * This function acts as a convenience wrapper around 
 * `getReanimatedInOrOutAnimation`, specifically for entering 
 * animations. You can specify the type of animation (e.g., 
 * fade or slide) and the direction of the animation (up, down, 
 * left, or right).
 *
 * @param type - The type of the animation. Example values include 
 *               "fade" or "slide". If not provided, defaults to 
 *               undefined, which will use the default type in 
 *               `getReanimatedInOrOutAnimation`.
 * @param direction - The direction of the animation. Acceptable values are 
 *                   "", "up", "left", "right", or "down". If not 
 *                   provided, defaults to undefined, which will use 
 *                   the default direction in 
 *                   `getReanimatedInOrOutAnimation`.
 *
 * @returns {IReanimatedInAnimations} 
 *          The corresponding entering animation object based on the 
 *          provided parameters.
 *
 * @example
 * // Example of using getReanimatedInAnimation
 * const animation = getReanimatedInAnimation("slide", "up");
 * // This will return the slideInUp animation if it exists.
 */
export const getReanimatedInAnimation = (type?: IReanimatedAnimationType, direction?: IReanimatedAnimationDirection): IReanimatedInAnimations => {
    return getReanimatedInOrOutAnimation('in', type, direction);
}

/**
 * Retrieves the appropriate exiting animation based on the specified 
 * type and direction.
 *
 * This function acts as a convenience wrapper around 
 * `getInOrOutReanimatedAnimation`, specifically for exiting 
 * animations. You can specify the type of animation (e.g., 
 * fade or slide) and the direction of the animation (up, down, 
 * left, or right).
 *
 * @param type - The type of the animation. Example values include 
 *               "fade" or "slide". If not provided, defaults to 
 *               undefined, which will use the default type in 
 *               `getInOrOutReanimatedAnimation`.
 * @param direction - The direction of the animation. Acceptable values are 
 *                   "", "up", "left", "right", or "down". If not 
 *                   provided, defaults to undefined, which will use 
 *                   the default direction in 
 *                   `getInOrOutReanimatedAnimation`.
 *
 * @returns {IReanimatedOutAnimations} 
 *          The corresponding exiting animation object based on the 
 *          provided parameters.
 *
 * @example
 * // Example of using getReanimatedOutAnimation
 * const animation = getReanimatedOutAnimation("slide", "down");
 * // This will return the slideOutDown animation if it exists.
 */
export const getReanimatedOutAnimation = (type?: IReanimatedAnimationType, direction?: IReanimatedAnimationDirection): IReanimatedOutAnimations => {
    return getReanimatedInOrOutAnimation('out', type, direction);
}

/**
 * Retrieves both the entering and exiting animations based on the specified 
 * type and direction.
 *
 * This function combines the results of `getReanimatedInAnimation` and 
 * `getReanimatedOutAnimation` to provide a complete set of animations 
 * for entering and exiting elements. You can specify the type of 
 * animation (e.g., fade or slide) and the direction of the animation 
 * (up, down, left, or right).
 *
 * @param type - The type of the animation. Example values include 
 *               "fade" or "slide". If not provided, defaults to 
 *               undefined, which will use the default type in 
 *               the respective animation functions.
 * @param direction - The direction of the animation. Acceptable values are 
 *                   "", "up", "left", "right", or "down". If not 
 *                   provided, defaults to undefined, which will use 
 *                   the default direction in the respective animation 
 *                   functions.
 *
 * @returns {{ entering: IReanimatedInAnimations, exiting: IReanimatedOutAnimations }} 
 *          An object containing the corresponding entering and exiting 
 *          animation objects based on the provided parameters.
 *
 * @example
 * // Example of using getReanimatedAnimations
 * const animations = getReanimatedAnimations("slide", "up");
 * // This will return an object with the slideInUp and slideOutUp animations.
 */
export const getReanimatedAnimations = (type?: IReanimatedAnimationType, direction?: IReanimatedAnimationDirection): { entering: IReanimatedInAnimations, exiting: IReanimatedOutAnimations } => {
    return {
        entering: getReanimatedInAnimation(type, direction),
        exiting: getReanimatedOutAnimation(type, direction),
    }
}

/**
 * Creates default entering and exiting animations with customizable 
 * callbacks and duration.
 *
 * This function returns an object containing two animation functions: 
 * `entering` and `exiting`. The entering animation can be customized 
 * with a callback that is invoked upon completion, and you can specify 
 * the duration of the animations. The animations use a combination of 
 * transformations, including translation and rotation.
 *
 * @param {Object} params - The parameters for the animation.
 * @param {((finished: boolean) => void) | undefined} params.enteringCallback - 
 *        Optional callback function that is called when the entering 
 *        animation finishes. Receives a boolean indicating if the 
 *        animation finished successfully.
 * @param {((finished: boolean) => void) | undefined} params.exitingCallback - 
 *        Optional callback function that is called when the exiting 
 *        animation finishes. Receives a boolean indicating if the 
 *        animation finished successfully.
 * @param {number | undefined} params.duration - Optional duration for 
 *        the animations in milliseconds.
 *
 * @returns {{ entering: EntryExitAnimationFunction, exiting: EntryExitAnimationFunction }} 
 *          An object containing two functions:
 *          - `entering`: Function to define the entering animation.
 *          - `exiting`: Function to define the exiting animation.
 *
 * @example
 * // Example of using getDefaultReanimatedAnimation
 * const animations = getDefaultReanimatedAnimation({
 *     enteringCallback: (finished) => console.log('Entering finished:', finished),
 *     exitingCallback: (finished) => console.log('Exiting finished:', finished),
 *     duration: 300,
 * });
 *
 * // Use animations.entering and animations.exiting in your component.
 */
export const getDefaultReanimatedAnimation = ({ enteringCallback, exitingCallback, duration }: { enteringCallback?: (finished: boolean) => void, exitingCallback?: (finished: boolean) => void, duration?: number }): { entering: EntryExitAnimationFunction, exiting: EntryExitAnimationFunction } => {
    return {
        entering: (targetValues: EntryAnimationsValues) => {
            'worklet';
            return {
                callback: enteringCallback,
                duration,
                initialValues: {
                    transform: [
                        { translateY: targetValues.targetHeight / 2 },
                        { perspective: 500 },
                        { rotateX: '90deg' },
                        { translateY: -targetValues.targetHeight / 2 },
                        { translateY: 300 },
                    ],
                },
                animations: {
                    transform: [
                        { translateY: withTiming(targetValues.targetHeight / 2) },
                        { perspective: withTiming(500) },
                        { rotateX: withTiming('0deg') },
                        { translateY: withTiming(-targetValues.targetHeight / 2) },
                        { translateY: withTiming(0) },
                    ],
                },
            };
        },
        exiting: (targetValues: EntryAnimationsValues) => {
            'worklet';
            return {
                callback: exitingCallback,
                duration,
                initialValues: {},
                animations: {
                    transform: [
                        { translateY: withTiming(targetValues.windowHeight / 2) },
                        { perspective: withTiming(500) },
                        { rotateX: withTiming('90deg') },
                        { translateY: withTiming(-targetValues.windowHeight / 2) },
                        { translateY: withTiming(300) },
                    ],
                },
            };
        }
    }
}