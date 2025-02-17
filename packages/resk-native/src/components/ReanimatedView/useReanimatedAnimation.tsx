import { useCallback, useEffect } from 'react';
import {
    useSharedValue,
    withTiming,
    WithTimingConfig,
    useAnimatedStyle,
    runOnJS,
} from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

/**
 * Supported animation types for entering and exiting animations
 * @enum {string}
 */
export type AnimationType = 'none' | 'fade' | 'slide' | 'fade-slide';

/**
 * Supported slide directions for slide animations
 * @enum {string}
 */
export type SlideDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Configuration options for the animation timing
 * @interface
 */
export interface AnimationConfig extends WithTimingConfig {
    /** Duration of the animation in milliseconds */
    duration?: number;
    /** Initial value for the animation */
    initialValue?: number;
    /** Final value for the animation */
    finalValue?: number;
}

/**
 * Props for the useReanimatedAnimation hook
 * @interface
 */
export interface UseReanimatedAnimationProps {
    /** Whether the animation is visible/active */
    visible: boolean;
    /** Type of animation to use */
    animationType?: AnimationType;
    /** Direction of slide animation (only applicable for slide animations) */
    slideDirection?: SlideDirection;
    /** Configuration for the animation timing */
    animationConfig?: AnimationConfig;
    /** Callback fired when entering animation starts */
    onEnteringCallback?: () => void;
    /** Callback fired when entering animation ends */
    onEnteredCallback?: () => void;
    /** Callback fired when exiting animation starts */
    onExitingCallback?: () => void;
    /** Callback fired when exiting animation ends */
    onExitedCallback?: () => void;
}

/**
 * Default configuration for animations
 */
const DEFAULT_CONFIG: AnimationConfig = {
    duration: 300,
    initialValue: 0,
    finalValue: 1,
    easing: (x) => x,
};

/**
 * Calculate the initial translation value based on the slide direction and screen dimensions
 * @param direction - The direction of the slide animation
 * @returns The initial translation value
 */
const getInitialTranslation = (direction: SlideDirection): number => {
    switch (direction) {
        case 'up':
            return 1000;
        case 'down':
            return -1000;
        case 'left':
            return 1000;
        case 'right':
            return -1000;
    }
};

/**
 * Hook for handling complex animations using Reanimated 3
 * @param props - Configuration props for the animation
 * @returns Object containing animated style and animation controls
 */
export const useReanimatedAnimation = ({
    visible,
    animationType = 'fade',
    slideDirection = 'up',
    animationConfig = DEFAULT_CONFIG,
    onEnteringCallback,
    onEnteredCallback,
    onExitingCallback,
    onExitedCallback,
}: UseReanimatedAnimationProps) => {
    // Merge provided config with defaults
    const config: AnimationConfig = {
        ...DEFAULT_CONFIG,
        ...animationConfig,
    };

    // Animation shared values
    const opacity = useSharedValue(config.initialValue);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);

    /**
     * Handle the animation completion callback
     * @param finished - Whether the animation completed successfully
     * @param isEntering - Whether this was an entering animation
     */
    const handleAnimationComplete = useCallback(
        (finished: boolean, isEntering: boolean) => {
            if (finished) {
                if (isEntering) {
                    defaultFunc(onEnteredCallback)();
                } else {
                    defaultFunc(onExitedCallback)();
                }
            }
        },
        [onEnteredCallback, onExitedCallback]
    );

    /**
     * Start the entering animation
     */
    const animateEntering = useCallback(() => {
        'worklet';
        defaultFunc(onEnteringCallback)();

        if (animationType === 'fade' || animationType === 'fade-slide') {
            (opacity as any).value = withTiming((config as any).finalValue, config, (finished) => {
                runOnJS(handleAnimationComplete)(finished as boolean, true);
            });
        }

        if (animationType === 'slide' || animationType === 'fade-slide') {
            if (slideDirection === 'up' || slideDirection === 'down') {
                translateY.value = withTiming(0, config);
            } else {
                translateX.value = withTiming(0, config);
            }
        }
    }, [animationType, slideDirection, config, onEnteringCallback]);

    /**
     * Start the exiting animation
     */
    const animateExiting = useCallback(() => {
        'worklet';
        defaultFunc(onExitingCallback)();

        if (animationType === 'fade' || animationType === 'fade-slide') {
            (opacity as any).value = withTiming((config as any).initialValue, config, (finished) => {
                runOnJS(handleAnimationComplete)(finished as boolean, false);
            });
        }

        if (animationType === 'slide' || animationType === 'fade-slide') {
            if (slideDirection === 'up' || slideDirection === 'down') {
                translateY.value = withTiming(getInitialTranslation(slideDirection), config);
            } else {
                translateX.value = withTiming(getInitialTranslation(slideDirection), config);
            }
        }
    }, [animationType, slideDirection, config, onExitingCallback]);

    // Initialize animation values
    useEffect(() => {
        if (animationType === 'slide' || animationType === 'fade-slide') {
            if (slideDirection === 'up' || slideDirection === 'down') {
                translateY.value = getInitialTranslation(slideDirection);
            } else {
                translateX.value = getInitialTranslation(slideDirection);
            }
        }
    }, [animationType, slideDirection]);

    // Handle visibility changes
    useEffect(() => {
        if (visible) {
            animateEntering();
        } else {
            animateExiting();
        }
    }, [visible, animateEntering, animateExiting]);

    /**
     * Generate the animated style based on current animation values
     */
    const animatedStyle = useAnimatedStyle(() => {
        const style: ViewStyle = {};
        if (animationType === 'fade' || animationType === 'fade-slide') {
            style.opacity = opacity.value;
        }
        if (animationType === 'slide' || animationType === 'fade-slide') {
            style.transform = [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ];
        }
        return style;
    }, [animationType]);

    return {
        animatedStyle,
        opacity,
        translateX,
        translateY,
        isVisible: visible,
    };
};

const defaultFunc = (func: any) => typeof func == "function" ? func : () => { };