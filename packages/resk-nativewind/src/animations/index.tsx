"use client";
import { ReactNode } from "react";
import { IAnimatedVisibilityProps, IAnimationsKeyFrames } from "./types";
import { useAnimatedVisibility } from "./hook";
import { Div } from "@html/Div";
const AnimationsKeyFrames: IAnimationsKeyFrames = require("./key-frames");

export function AnimatedVisibility(props: IAnimatedVisibilityProps): ReactNode {
    const { shouldRender, className, style, onAnimationEnd } = useAnimatedVisibility(props);
    const { visible, enteringAnimationName, exitingAnimationName, ...rest } = props;
    if (!shouldRender) return null;
    const rProps = { ...rest, onAnimationEnd };
    return <Div style={style as any} className={className}  {...rProps} />
}
export * from "./types";

export { AnimationsKeyFrames };