import { FadeIn, FadeInRight, FadeInLeft, FadeInUp, FadeInDown, SlideInRight, SlideInLeft, SlideInUp, SlideInDown, BounceIn, BounceOut, BounceInRight, BounceOutRight, BounceInLeft, BounceOutLeft, BounceInUp, BounceOutUp, BounceInDown, BounceOutDown, FlipInEasyX, FlipOutEasyX, FlipInEasyY, FlipOutEasyY, FlipInXDown, FlipOutXDown, FlipInXUp, FlipOutXUp, FlipInYLeft, FlipOutYLeft, FlipInYRight, FlipOutYRight, LightSpeedInRight, LightSpeedOutRight, LightSpeedInLeft, LightSpeedOutLeft, PinwheelIn, PinwheelOut, RollInRight, RollOutRight, RollInLeft, RollOutLeft, RotateInDownLeft, RotateOutDownLeft, RotateInDownRight, RotateOutDownRight, RotateInUpLeft, RotateOutUpLeft, RotateInUpRight, RotateOutUpRight, StretchInX, StretchOutX, StretchInY, StretchOutY, ZoomIn, ZoomOut, ZoomInDown, ZoomOutDown, ZoomInEasyDown, ZoomOutEasyDown, ZoomInEasyUp, ZoomOutEasyUp, ZoomInLeft, ZoomOutLeft, ZoomInRight, ZoomOutRight, ZoomInRotate, ZoomOutRotate, ZoomInUp, ZoomOutUp } from "react-native-reanimated";
import { FadeOut, FadeOutRight, FadeOutLeft, FadeOutUp, FadeOutDown, SlideOutRight, SlideOutLeft, SlideOutUp, SlideOutDown } from "react-native-reanimated";
import { defaultStr, isNumber } from "@resk/core/utils";

/****
 * @see : https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations
 */
export const ENTERING_EXITING_ANIMATIONS = {
    fade: {
        in: FadeIn,
        out: FadeOut,
    },
    fadeRight: {
        in: FadeInRight,
        out: FadeOutRight,
    },
    fadeLeft: {
        in: FadeInLeft,
        out: FadeOutLeft,
    },
    fadeUp: {
        in: FadeInUp,
        out: FadeOutUp,
    },
    fadeDown: {
        in: FadeInDown,
        out: FadeOutDown,
    },
    slideRight: {
        in: SlideInRight,
        out: SlideOutRight,
    },
    slideLeft: {
        in: SlideInLeft,
        out: SlideOutLeft,
    },
    slideUp: {
        in: SlideInUp,
        out: SlideOutUp,
    },
    slideDown: {
        in: SlideInDown,
        out: SlideOutDown,
    },
    bounce: {
        in: BounceIn,
        out: BounceOut
    },
    bounceRight: {
        in: BounceInRight,
        out: BounceOutRight
    },
    bounceLeft: {
        in: BounceInLeft,
        out: BounceOutLeft
    },
    bounceUp: {
        in: BounceInUp,
        out: BounceOutUp
    },
    bounceDown: {
        in: BounceInDown,
        out: BounceOutDown
    },
    flipEasyX: {
        in: FlipInEasyX,
        out: FlipOutEasyX,
    },
    flipEasyY: {
        in: FlipInEasyY,
        out: FlipOutEasyY,
    },
    flipXDown: {
        in: FlipInXDown,
        out: FlipOutXDown,
    },
    flipXUp: {
        in: FlipInXUp,
        out: FlipOutXUp,
    },
    flipYLeft: {
        in: FlipInYLeft,
        out: FlipOutYLeft,
    },
    flipInYRight: {
        in: FlipInYRight,
        out: FlipOutYRight,
    },
    lightSpeedRight: {
        in: LightSpeedInRight,
        out: LightSpeedOutRight
    },
    lightSpeedLeft: {
        in: LightSpeedInLeft,
        out: LightSpeedOutLeft
    },
    pinwheel: {
        in: PinwheelIn,
        out: PinwheelOut
    },
    rollRight: {
        in: RollInRight,
        out: RollOutRight,
    },
    rollLeft: {
        in: RollInLeft,
        out: RollOutLeft,
    },
    rotateDownLeft: {
        in: RotateInDownLeft,
        out: RotateOutDownLeft
    },
    rotateDownRight: {
        in: RotateInDownRight,
        out: RotateOutDownRight
    },
    rotateUpLeft: {
        in: RotateInUpLeft,
        out: RotateOutUpLeft
    },
    rotateUpRight: {
        in: RotateInUpRight,
        out: RotateOutUpRight
    },
    stretchX: {
        in: StretchInX,
        out: StretchOutX
    },
    stretchY: {
        in: StretchInY,
        out: StretchOutY
    },
    zoom: {
        in: ZoomIn,
        out: ZoomOut
    },
    zoomDown: {
        in: ZoomInDown,
        out: ZoomOutDown
    },
    zoomEasyDown: {
        in: ZoomInEasyDown,
        out: ZoomOutEasyDown
    },
    zoomEasyUp: {
        in: ZoomInEasyUp,
        out: ZoomOutEasyUp
    },
    zoomLeft: {
        in: ZoomInLeft,
        out: ZoomOutLeft,
    },
    zoomRight: {
        in: ZoomInRight,
        out: ZoomOutRight,
    },
    zoomRotate: {
        in: ZoomInRotate,
        out: ZoomOutRotate,
    },
    zoomUp: {
        in: ZoomInUp,
        out: ZoomOutUp
    }
}

export type IEnteringExitingAnimations = typeof ENTERING_EXITING_ANIMATIONS;
export type IEnteringExitingAnimationsName = keyof IEnteringExitingAnimations;


export function getEnteringExitingAnimations({
    animationType = "fade",
    animationDuration,
    inAnimationDuration,
    outAnimationDuration,
    animationDelay = 0
}: {
    animationType?: IEnteringExitingAnimationsName,
    animationDuration?: number,
    inAnimationDuration?: number,
    outAnimationDuration?: number,
    animationDelay?: number,
}) {
    animationType = defaultStr(animationType, "fade") as IEnteringExitingAnimationsName;
    const animations = ENTERING_EXITING_ANIMATIONS[animationType] || ENTERING_EXITING_ANIMATIONS.fade;
    const duration = isNumber(animationDuration) && animationDuration > 0 ? animationDuration : 300;
    const inDuration = isNumber(inAnimationDuration) && inAnimationDuration > 0 ? inAnimationDuration : duration;
    const outDuration = isNumber(outAnimationDuration) && outAnimationDuration > 0 ? outAnimationDuration : duration;
    const delay = isNumber(animationDelay) && animationDelay > 0 ? animationDelay : 0;
    return {
        entering: animations.in.duration(inDuration).delay(delay),
        exiting: animations.out.duration(outDuration).delay(delay),
    }
}