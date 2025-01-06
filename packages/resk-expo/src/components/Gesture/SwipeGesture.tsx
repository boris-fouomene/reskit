/**
 * @module SwipeGestureHandler
 * @description A flexible React Native component that handles swipe gestures in both horizontal 
 * and vertical directions with configurable thresholds and callbacks.
 * 
 * @example
 * ```tsx
 * <SwipeGestureHandler
 *   onSwipeLeft={() => console.log('Swiped left!')}
 *   onSwipeRight={() => console.log('Swiped right!')}
 *   onSwipeTop={() => console.log('Swiped up!')}
 *   onSwipeBottom={() => console.log('Swiped down!')}
 *   onSwipe={(direction, distance) => console.log(`Swiped ${direction} with distance ${distance}`)}
 *   horizontal={false}
 *   vertical={false}
 *   minSwipeDistance={50}
 * >
 *   <YourContent />
 * </SwipeGestureHandler>
 * ```
 */

import View, { IViewProps } from '@components/View';
import React, { useCallback, useRef } from 'react';
import { PanResponder, GestureResponderEvent, PanResponderGestureState, Animated, ViewProps } from 'react-native';

/**
 * Represents the possible swipe directions
 * @enum {string}
 */
export type ISwipeGestureDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Configuration options for swipe animations
 * @interface
 */
export interface ISwipeGestureAnimationConfig {
    /** Duration of the reset animation in milliseconds */
    resetDuration?: number;
    /** Tension for the spring animation */
    springTension?: number;
    /** Friction for the spring animation */
    springFriction?: number;
    /** Scale factor during swipe */
    scaleEffect?: number;
    /** Opacity during swipe */
    opacityEffect?: number;
}

/***
 * Represents the options for the swipe gesture callback
 */
export interface ISwipeGestureCallbackOptions {
    /***
     * The horizontal distance of the swipe
     */
    dx: number,
    /**
     * The vertical distance of the swipe
     */
    dy: number,
    /***
     * The distance of the swipe
     */
    direction: ISwipeGestureDirection,
    /***
     * The distance of the swipe
     */
    distance: number
}
const DEFAULT_ANIMATION_CONFIG: Required<ISwipeGestureAnimationConfig> = {
    resetDuration: 200,
    springTension: 40,
    springFriction: 7,
    scaleEffect: 0.95,
    opacityEffect: 0.9,
};

/**
 * Props interface for the SwipeGestureHandler component
 * @interface
 */
export interface ISwipeGestureProps extends React.ComponentProps<typeof Animated.View> {
    /** Callback triggered when a swipe left gesture is detected */
    onSwipeLeft?: (options: ISwipeGestureCallbackOptions) => void;
    /** Callback triggered when a swipe right gesture is detected */
    onSwipeRight?: (options: ISwipeGestureCallbackOptions) => void;
    /** Callback triggered when a swipe up gesture is detected */
    onSwipeTop?: (options: ISwipeGestureCallbackOptions) => void;
    /** Callback triggered when a swipe down gesture is detected */
    onSwipeBottom?: (options: ISwipeGestureCallbackOptions) => void;
    /** 
     * Generic callback triggered for any swipe gesture
     * @param direction - The direction of the swipe
     * @param distance - The distance of the swipe in pixels
     */
    onSwipe?: (options: ISwipeGestureCallbackOptions) => void;
    /** Flag to disable horizontal swipe detection */
    horizontal?: boolean;
    /** Flag to disable vertical swipe detection */
    vertical?: boolean;

    /***
     * Flag to disable the gesture
     */
    disabled?: boolean;

    /** Minimum distance required to trigger a swipe gesture */
    minSwipeDistance?: number;

    /** Custom animation configuration */
    animationConfig?: ISwipeGestureAnimationConfig;
}

/**
 * @description A React Native component that handles swipe gestures with smooth animations
 * during and after swipes.
 * @component
 */
const SwipeGestureHandler: React.FC<ISwipeGestureProps> = ({
    onSwipeLeft,
    onSwipeRight,
    onSwipeTop,
    onSwipeBottom,
    onSwipe,
    horizontal = true,
    vertical = true,
    disabled,
    minSwipeDistance = 50,
    children,
    animationConfig = {},
    ...props
}) => {
    const config = { ...DEFAULT_ANIMATION_CONFIG, ...Object.assign({}, animationConfig) };
    horizontal = typeof horizontal === 'boolean' ? horizontal : true;
    vertical = typeof vertical === 'boolean' ? vertical : true;
    disabled = typeof disabled === 'boolean' ? disabled : false;
    if (!horizontal && !vertical) {
        disabled = true;
    }

    // Animation values
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    /**
     * Resets all animations to their initial values
     */
    const resetAnimations = useCallback(() => {
        Animated.parallel([
            Animated.timing(pan, {
                toValue: { x: 0, y: 0 },
                duration: config.resetDuration,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                tension: config.springTension,
                friction: config.springFriction,
                useNativeDriver: true,
            }),
            Animated.spring(opacity, {
                toValue: 1,
                tension: config.springTension,
                friction: config.springFriction,
                useNativeDriver: true,
            }),
        ]).start();
    }, [config, pan, scale, opacity]);
    /** References to track gesture state */
    const gestureState = useRef({
        dx: 0,
        dy: 0
    });

    /**
     * Determines if the gesture should be considered a swipe based on direction and distance
     * @param dx - Horizontal distance moved
     * @param dy - Vertical distance moved
     * @returns Whether the gesture qualifies as a swipe
     */
    const isValidSwipe = (dx: number, dy: number): boolean => {
        const horizontalSwipe = Math.abs(dx) >= minSwipeDistance;
        const verticalSwipe = Math.abs(dy) >= minSwipeDistance;
        if (disabled) return false;
        if (!horizontal) return verticalSwipe;
        if (!vertical) return horizontalSwipe;
        return horizontalSwipe || verticalSwipe;
    };

    /**
     * Determines the primary direction of the swipe
     * @param dx - Horizontal distance moved
     * @param dy - Vertical distance moved
     * @returns The primary direction of the swipe
     */
    const getISwipeGestureDirection = (dx: number, dy: number): ISwipeGestureDirection => {
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        }
        return dy > 0 ? 'down' : 'up';
    };

    /**
     * Handles the completion of a swipe gesture
     * @param dx - Horizontal distance moved
     * @param dy - Vertical distance moved
     */
    const handleSwipe = (dx: number, dy: number) => {
        if (!isValidSwipe(dx, dy)) {
            resetAnimations();
            return;
        }
        const direction = getISwipeGestureDirection(dx, dy);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const options = { dx, dy, distance, direction };
        // Trigger direction-specific callbacks
        switch (direction) {
            case 'left':
                (horizontal && typeof onSwipeLeft === 'function') && onSwipeLeft(options);
                break;
            case 'right':
                (horizontal && typeof onSwipeRight === 'function') && onSwipeRight(options);
                break;
            case 'up':
                (vertical && typeof onSwipeTop === 'function') && onSwipeTop(options);
                break;
            case 'down':
                (vertical && typeof onSwipeBottom === 'function') && onSwipeBottom(options);
                break;
        }
        // Trigger generic swipe callback
        if (typeof onSwipe === 'function') {
            onSwipe(options);
        }
        resetAnimations();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (e: GestureResponderEvent, state: PanResponderGestureState) => {
                if (disabled) return false;
                if (!horizontal) return Math.abs(state.dy) > Math.abs(state.dx);
                if (!vertical) return Math.abs(state.dx) > Math.abs(state.dy);
                return true;
            },
            onPanResponderGrant: () => {
                // Start of gesture animations
                Animated.parallel([
                    Animated.spring(scale, {
                        toValue: config.scaleEffect,
                        tension: config.springTension,
                        friction: config.springFriction,
                        useNativeDriver: true,
                    }),
                    Animated.spring(opacity, {
                        toValue: config.opacityEffect,
                        tension: config.springTension,
                        friction: config.springFriction,
                        useNativeDriver: true,
                    }),
                ]).start();
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, state) => {
                handleSwipe(state.dx, state.dy);
            },
            onPanResponderTerminate: () => {
                resetAnimations();
            },
        })
    ).current;
    const animatedStyle = {
        transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale },
        ],
        opacity,
    };
    return (
        <Animated.View testID={"resk-swipe-gesture"}
            {...props}
            {...panResponder.panHandlers}
            style={[animatedStyle, props.style]}
        >
            {children}
        </Animated.View>
    );
};

export default SwipeGestureHandler;