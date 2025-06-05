"use client";
import { Div } from "@html/Div";
import { ComponentProps } from "react";
import Animated from "react-native-reanimated";
import { getEnteringExitingAnimations, IEnteringExitingAnimationsName } from "./utils";
export function EnteringExitingAnimation({ animationType = "fade", enteringCallback, exitingCallback, animationDuration, animationMutator, inAnimationDuration, outAnimationDuration, ...props }: IEnteringExitingAnimationProps) {
    const opts = getEnteringExitingAnimations({ animationType, animationDuration, inAnimationDuration, outAnimationDuration });
    if (typeof animationMutator == "function") {
        animationMutator(opts);
    }
    return <AnimatedDiv
        {...opts}
        entering={typeof enteringCallback == "function" ? opts.entering.withCallback(enteringCallback) : opts.entering}
        exiting={typeof exitingCallback == "function" ? opts.exiting.withCallback(exitingCallback) : opts.exiting}
        {...props}
    />
}

const AnimatedDiv = Animated.createAnimatedComponent(Div);
export interface IEnteringExitingAnimationProps extends ComponentProps<typeof AnimatedDiv> {
    animationType?: IEnteringExitingAnimationsName,
    animationDuration?: number,
    inAnimationDuration?: number,
    outAnimationDuration?: number,
    enteringCallback?: (finished: boolean) => void,
    exitingCallback?: (finished: boolean) => void,
    animationMutator?: (options: ReturnType<typeof getEnteringExitingAnimations>) => void,
}