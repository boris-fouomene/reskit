"use client";
import React, { ComponentProps, useEffect, useRef } from 'react';
import { Animated, Easing, Dimensions, ViewStyle, useWindowDimensions } from 'react-native';

// Animation configuration types
interface IAnimationConfig {
    duration?: number;
    delay?: number;
    easing?: (value: number) => number;
}
const AnimatedEnterExitTypes = {
    fade: {
        in: "FadeIn",
        out: "FadeOut"
    },
    fadeDown: {
        in: "FadeInDown",
        out: "FadeOutDown"
    },
    fadeUp: {
        in: "FadeInUp",
        out: "FadeOutUp"
    },
    fadeLeft: {
        in: "FadeInLeft",
        out: "FadeOutLeft"
    },
    fadeRight: {
        in: "FadeInRight",
        out: "FadeOutRight"
    },
    slideDown: {
        in: "SlideInDown",
        out: "SlideOutDown"
    },
    slideUp: {
        in: "SlideInUp",
        out: "SlideOutUp"
    },
    slideLeft: {
        in: "SlideInLeft",
        out: "SlideOutLeft"
    },
    slideRight: {
        in: "SlideInRight",
        out: "SlideOutRight"
    },
    zoom: {
        in: "ZoomIn",
        out: "ZoomOut"
    },
    zoomRotate: {
        in: "ZoomInRotate",
        out: "ZoomOutRotate"
    },
    zoomLeft: {
        in: "ZoomInLeft",
        out: "ZoomOutLeft"
    },
    zoomRight: {
        in: "ZoomInRight",
        out: "ZoomOutRight"
    },
    zoomUp: {
        in: "ZoomInUp",
        out: "ZoomOutUp"
    },
    zoomDown: {
        in: "ZoomInDown",
        out: "ZoomOutDown"
    },
    zoomEasyUp: {
        in: "ZoomInEasyUp",
        out: "ZoomOutEasyUp"
    },
    zoomEasyDown: {
        in: "ZoomInEasyDown",
        out: "ZoomOutEasyDown"
    },
    flipXUp: {
        in: "FlipInXUp",
        out: "FlipOutXUp"
    },
    flipXDown: {
        in: "FlipInXDown",
        out: "FlipOutXDown"
    },
    flipYLeft: {
        in: "FlipInYLeft",
        out: "FlipOutYLeft"
    },
    flipYRight: {
        in: "FlipInYRight",
        out: "FlipOutYRight"
    },
    stretchX: {
        in: "StretchInX",
        out: "StretchOutX"
    },
    stretchY: {
        in: "StretchInY",
        out: "StretchOutY"
    },
    lightSpeedLeft: {
        in: "LightSpeedInLeft",
        out: "LightSpeedOutLeft"
    },
    lightSpeedRight: {
        in: "LightSpeedInRight",
        out: "LightSpeedOutRight"
    },
    pinwheel: {
        in: "PinwheelIn",
        out: "PinwheelOut"
    },
    rotateDownLeft: {
        in: "RotateInDownLeft",
        out: "RotateOutDownLeft"
    },
    rotateDownRight: {
        in: "RotateInDownRight",
        out: "RotateOutDownRight"
    },
    rotateUpLeft: {
        in: "RotateInUpLeft",
        out: "RotateOutUpLeft"
    },
    rotateUpRight: {
        in: "RotateInUpRight",
        out: "RotateOutUpRight"
    },
    rollLeft: {
        in: "RollInLeft",
        out: "RollOutLeft"
    },
    rollRight: {
        in: "RollInRight",
        out: "RollOutRight"
    },
    bounce: {
        in: "BounceIn",
        out: "BounceOut"
    },
    bounceDown: {
        in: "BounceInDown",
        out: "BounceOutDown"
    },
    bounceUp: {
        in: "BounceInUp",
        out: "BounceOutUp"
    },
    bounceLeft: {
        in: "BounceInLeft",
        out: "BounceOutLeft"
    },
    bounceRight: {
        in: "BounceInRight",
        out: "BounceOutRight"
    }
} as const;


export type IAnimatedEnterExitType = keyof typeof AnimatedEnterExitTypes;
type IAnimationEnteringType = typeof AnimatedEnterExitTypes[IAnimatedEnterExitType]["in"];
type IAnimationExitingType = typeof AnimatedEnterExitTypes[IAnimatedEnterExitType]["out"];

// Animation value initialization
const getInitialValues = (animationType: IAnimationEnteringType) => {
    const opacity = new Animated.Value(0);
    const translateX = new Animated.Value(0);
    const translateY = new Animated.Value(0);
    const scale = new Animated.Value(1);
    const rotate = new Animated.Value(0);
    const rotateX = new Animated.Value(0);
    const rotateY = new Animated.Value(0);
    const scaleX = new Animated.Value(1);
    const scaleY = new Animated.Value(1);
    const skewX = new Animated.Value(0);
    const skewY = new Animated.Value(0);

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    switch (animationType) {
        case AnimatedEnterExitTypes.fade.in:
            opacity.setValue(0);
            break;
        case AnimatedEnterExitTypes.fadeDown.in:
            opacity.setValue(0);
            translateY.setValue(-50);
            break;
        case AnimatedEnterExitTypes.fadeUp.in:
            opacity.setValue(0);
            translateY.setValue(50);
            break;
        case AnimatedEnterExitTypes.fadeLeft.in:
            opacity.setValue(0);
            translateX.setValue(-50);
            break;
        case AnimatedEnterExitTypes.fadeRight.in:
            opacity.setValue(0);
            translateX.setValue(50);
            break;
        case AnimatedEnterExitTypes.slideDown.in:
            translateY.setValue(-screenHeight);
            break;
        case AnimatedEnterExitTypes.slideUp.in:
            translateY.setValue(screenHeight);
            break;
        case AnimatedEnterExitTypes.slideLeft.in:
            translateX.setValue(-screenWidth);
            break;
        case AnimatedEnterExitTypes.slideRight.in:
            translateX.setValue(screenWidth);
            break;
        case AnimatedEnterExitTypes.zoom.in:
            opacity.setValue(0);
            scale.setValue(0);
            break;
        case AnimatedEnterExitTypes.zoomRotate.in:
            opacity.setValue(0);
            scale.setValue(0);
            rotate.setValue(180);
            break;
        case AnimatedEnterExitTypes.zoomLeft.in:
            opacity.setValue(0);
            scale.setValue(0);
            translateX.setValue(-screenWidth);
            break;
        case AnimatedEnterExitTypes.zoomRight.in:
            opacity.setValue(0);
            scale.setValue(0);
            translateX.setValue(screenWidth);
            break;
        case AnimatedEnterExitTypes.zoomUp.in:
            opacity.setValue(0);
            scale.setValue(0);
            translateY.setValue(screenHeight);
            break;
        case AnimatedEnterExitTypes.zoomDown.in:
            opacity.setValue(0);
            scale.setValue(0);
            translateY.setValue(-screenHeight);
            break;
        case AnimatedEnterExitTypes.zoomEasyUp.in:
            opacity.setValue(0);
            scale.setValue(0.8);
            translateY.setValue(50);
            break;
        case AnimatedEnterExitTypes.zoomEasyDown.in:
            opacity.setValue(0);
            scale.setValue(0.8);
            translateY.setValue(-50);
            break;
        case AnimatedEnterExitTypes.flipXUp.in:
            opacity.setValue(0);
            rotateX.setValue(90);
            translateY.setValue(50);
            break;
        case AnimatedEnterExitTypes.flipXDown.in:
            opacity.setValue(0);
            rotateX.setValue(-90);
            translateY.setValue(-50);
            break;
        case AnimatedEnterExitTypes.flipYLeft.in:
            opacity.setValue(0);
            rotateY.setValue(90);
            translateX.setValue(-50);
            break;
        case AnimatedEnterExitTypes.flipYRight.in:
            opacity.setValue(0);
            rotateY.setValue(-90);
            translateX.setValue(50);
            break;
        case AnimatedEnterExitTypes.stretchX.in:
            scaleX.setValue(0);
            break;
        case AnimatedEnterExitTypes.stretchY.in:
            scaleY.setValue(0);
            break;
        case AnimatedEnterExitTypes.lightSpeedLeft.in:
            opacity.setValue(0);
            translateX.setValue(-screenWidth);
            skewX.setValue(30);
            break;
        case AnimatedEnterExitTypes.lightSpeedRight.in:
            opacity.setValue(0);
            translateX.setValue(screenWidth);
            skewX.setValue(-30);
            break;
        case AnimatedEnterExitTypes.pinwheel.in:
            opacity.setValue(0);
            scale.setValue(0);
            rotate.setValue(360);
            break;
        case AnimatedEnterExitTypes.rotateDownLeft.in:
            opacity.setValue(0);
            rotate.setValue(-45);
            translateX.setValue(-50);
            translateY.setValue(50);
            break;
        case AnimatedEnterExitTypes.rotateDownRight.in:
            opacity.setValue(0);
            rotate.setValue(45);
            translateX.setValue(50);
            translateY.setValue(50);
            break;
        case AnimatedEnterExitTypes.rotateUpLeft.in:
            opacity.setValue(0);
            rotate.setValue(45);
            translateX.setValue(-50);
            translateY.setValue(-50);
            break;
        case AnimatedEnterExitTypes.rotateUpRight.in:
            opacity.setValue(0);
            rotate.setValue(-45);
            translateX.setValue(50);
            translateY.setValue(-50);
            break;
        case AnimatedEnterExitTypes.rollLeft.in:
            opacity.setValue(0);
            translateX.setValue(-screenWidth);
            rotate.setValue(-120);
            break;
        case AnimatedEnterExitTypes.rollRight.in:
            opacity.setValue(0);
            translateX.setValue(screenWidth);
            rotate.setValue(120);
            break;
        case AnimatedEnterExitTypes.bounce.in:
            opacity.setValue(0);
            scale.setValue(0.3);
            break;
        case AnimatedEnterExitTypes.bounceDown.in:
            opacity.setValue(0);
            translateY.setValue(-screenHeight);
            break;
        case AnimatedEnterExitTypes.bounceUp.in:
            opacity.setValue(0);
            translateY.setValue(screenHeight);
            break;
        case AnimatedEnterExitTypes.bounceLeft.in:
            opacity.setValue(0);
            translateX.setValue(-screenWidth);
            break;
        case AnimatedEnterExitTypes.bounceRight.in:
            opacity.setValue(0);
            translateX.setValue(screenWidth);
            break;
    }
    return {
        opacity,
        translateX,
        translateY,
        scale,
        rotate,
        rotateX,
        rotateY,
        scaleX,
        scaleY,
        skewX,
        skewY,
    };
};

const createEnteringAnimation = (
    values: ReturnType<typeof getInitialValues>,
    enteringAnimationType: IAnimationEnteringType,
    config: IAnimationConfig = {}
) => {
    const { duration = 300, delay = 0, easing = Easing.out(Easing.ease) } = config;

    const animations: Animated.CompositeAnimation[] = [];

    // Create bounce easing for bounce animations
    const bounceEasing = Easing.bezier(0.68, -0.55, 0.265, 1.55);
    enteringAnimationType = enteringAnimationType || AnimatedEnterExitTypes.fade.in;

    // Determine if this is a bounce animation
    const isBounceAnimation = enteringAnimationType.includes('Bounce');
    const finalEasing = isBounceAnimation ? bounceEasing : easing;

    switch (enteringAnimationType) {
        case AnimatedEnterExitTypes.fade.in:
            animations.push(Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.fadeDown.in:
        case AnimatedEnterExitTypes.fadeUp.in:
        case AnimatedEnterExitTypes.fadeLeft.in:
        case AnimatedEnterExitTypes.fadeRight.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.slideDown.in:
        case AnimatedEnterExitTypes.slideUp.in:
        case AnimatedEnterExitTypes.slideLeft.in:
        case AnimatedEnterExitTypes.slideRight.in:
            animations.push(
                Animated.timing(values.translateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoom.in:
        case AnimatedEnterExitTypes.zoomRotate.in:
        case AnimatedEnterExitTypes.zoomLeft.in:
        case AnimatedEnterExitTypes.zoomRight.in:
        case AnimatedEnterExitTypes.zoomUp.in:
        case AnimatedEnterExitTypes.zoomDown.in:
        case AnimatedEnterExitTypes.zoomEasyUp.in:
        case AnimatedEnterExitTypes.zoomEasyDown.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.flipXUp.in:
        case AnimatedEnterExitTypes.flipXDown.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.flipYLeft.in:
        case AnimatedEnterExitTypes.flipYRight.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotateY, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.stretchX.in:
            animations.push(Animated.timing(values.scaleX, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.stretchY.in:
            animations.push(Animated.timing(values.scaleY, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.lightSpeedLeft.in:
        case AnimatedEnterExitTypes.lightSpeedRight.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.skewX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.pinwheel.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rotateDownLeft.in:
        case AnimatedEnterExitTypes.rotateDownRight.in:
        case AnimatedEnterExitTypes.rotateUpLeft.in:
        case AnimatedEnterExitTypes.rotateUpRight.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rollLeft.in:
        case AnimatedEnterExitTypes.rollRight.in:
            animations.push(
                Animated.timing(values.opacity, { toValue: 1, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
    }

    return Animated.parallel(animations, { stopTogether: false });
};

// Create exiting animation (similar pattern, reversed values)
const createExitingAnimation = (
    values: ReturnType<typeof getInitialValues>,
    exitingAnimationType: IAnimationExitingType,
    config: IAnimationConfig = {}
) => {
    const { duration = 300, delay = 0, easing = Easing.in(Easing.ease) } = config;
    const animations: Animated.CompositeAnimation[] = [];
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    // Create bounce easing for bounce animations
    const bounceEasing = Easing.bezier(0.68, -0.55, 0.265, 1.55);
    exitingAnimationType = exitingAnimationType || AnimatedEnterExitTypes.fade.out;
    // Determine if this is a bounce animation
    const isBounceAnimation = exitingAnimationType.includes('Bounce');
    const finalEasing = isBounceAnimation ? bounceEasing : easing;

    // Similar implementation but with reversed target values
    switch (exitingAnimationType) {
        case AnimatedEnterExitTypes.fade.out:
            animations.push(Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.fadeDown.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.fadeUp.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.fadeLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.fadeRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.slideDown.out:
            animations.push(Animated.timing(values.translateY, { toValue: screenHeight, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.slideUp.out:
            animations.push(Animated.timing(values.translateY, { toValue: -screenHeight, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.slideLeft.out:
            animations.push(Animated.timing(values.translateX, { toValue: -screenWidth, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.slideRight.out:
            animations.push(Animated.timing(values.translateX, { toValue: screenWidth, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.zoom.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoomRotate.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 180, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoomLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -screenWidth, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoomRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: screenWidth, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoomUp.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: -screenHeight, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoomDown.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: screenHeight, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoomEasyUp.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0.8, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.zoomEasyDown.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0.8, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.bounce.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.bounceDown.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: screenHeight, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.bounceUp.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: -screenHeight, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.bounceLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -screenWidth, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.bounceRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: screenWidth, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.flipXUp.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotateX, { toValue: -90, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.flipXDown.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotateX, { toValue: 90, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.flipYLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotateY, { toValue: -90, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.flipYRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotateY, { toValue: 90, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.stretchX.out:
            animations.push(Animated.timing(values.scaleX, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.stretchY.out:
            animations.push(Animated.timing(values.scaleY, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }));
            break;
        case AnimatedEnterExitTypes.lightSpeedLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -screenWidth, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.skewX, { toValue: -30, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.lightSpeedRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: screenWidth, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.skewX, { toValue: 30, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.pinwheel.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.scale, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: -360, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rotateDownLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 45, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rotateDownRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: -45, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rotateUpLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: -45, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rotateUpRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 45, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: 50, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateY, { toValue: -50, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rollLeft.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: -screenWidth, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: -120, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
        case AnimatedEnterExitTypes.rollRight.out:
            animations.push(
                Animated.timing(values.opacity, { toValue: 0, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.translateX, { toValue: screenWidth, duration, easing: finalEasing, useNativeDriver: true }),
                Animated.timing(values.rotate, { toValue: 120, duration, easing: finalEasing, useNativeDriver: true })
            );
            break;
    }

    return Animated.parallel(animations, { stopTogether: false });
};

// Main animated component
export interface IAnimatedEnterExitProps extends ComponentProps<typeof Animated.View> {
    children: React.ReactNode;
    animationType?: IAnimatedEnterExitType;
    visible?: boolean;
    duration?: number;
    delay?: number;
    easing?: (value: number) => number;
    style?: ViewStyle;
    onEnterComplete?: () => void;
    onExitComplete?: () => void;
}

export function AnimatedEnterExit({
    children,
    animationType = "fade",
    visible = true,
    duration = 300,
    delay = 0,
    easing,
    style,
    onEnterComplete,
    onExitComplete,
}: IAnimatedEnterExitProps) {
    animationType = animationType || "fade";
    if (typeof animationType !== "string" || !AnimatedEnterExitTypes[animationType]) {
        animationType = "fade";
    }
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const entering = AnimatedEnterExitTypes[animationType].in;
    const exiting = AnimatedEnterExitTypes[animationType].out;
    const animationValues = useRef(getInitialValues(entering)).current;
    const wasVisible = useRef(visible);
    useEffect(() => {
        if (visible && !wasVisible.current) {
            const config = { duration, delay, easing };
            const animation = createEnteringAnimation(animationValues, entering, config);
            animation.start(() => {
                if (typeof onEnterComplete === "function") onEnterComplete();
            });
        } else if (!visible && wasVisible.current) {
            // Exiting animation
            const config = { duration, delay, easing };
            const animation = createExitingAnimation(animationValues, exiting, config);
            animation.start(() => {
                if (typeof onExitComplete === "function") onExitComplete();
            });
        }
        wasVisible.current = visible;
    }, [visible, screenWidth, screenHeight, entering, exiting, duration, delay, easing, onEnterComplete, onExitComplete]);

    const animatedStyle = {
        opacity: animationValues.opacity,
        transform: [
            { translateX: animationValues.translateX },
            { translateY: animationValues.translateY },
            { scale: animationValues.scale },
            { scaleX: animationValues.scaleX },
            { scaleY: animationValues.scaleY },
            {
                rotate: animationValues.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                })
            },
            {
                rotateX: animationValues.rotateX.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                })
            },
            {
                rotateY: animationValues.rotateY.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                })
            },
            {
                skewX: animationValues.skewX.interpolate({
                    inputRange: [0, 45],
                    outputRange: ['0deg', '45deg'],
                })
            },
            {
                skewY: animationValues.skewY.interpolate({
                    inputRange: [0, 45],
                    outputRange: ['0deg', '45deg'],
                })
            },
        ],
    };

    if (!visible && wasVisible.current === false) {
        return null;
    }

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

AnimatedEnterExit.enterExitTypes = AnimatedEnterExitTypes;
