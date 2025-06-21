"use client";
import { Pressable, PressableProps } from "react-native";
import { useId, useMemo, useRef } from "react";
import { ITooltipProps } from './types';
import { defaultStr, uniqid } from "@resk/core";
import { useMergeRefs } from "@utils/mergeRefs";
import { cn, isValidElement } from "@utils";
import { ITouchableProps } from "@src/types";
import { classes } from "@variants/classes";

export * from "./types";
export function Tooltip<asProps extends Partial<ITouchableProps> = PressableProps>({ children, className, as, title, tooltip, disabled, testID, id, ref, ...rest }: ITooltipProps<asProps>) {
  testID = defaultStr(testID, "resk-tooltip");
  const uId = useId();
  const instanceIdRef = useRef(defaultStr(id, uId));
  const buttonRef = useRef(null);
  const innerRef = useMergeRefs(ref, buttonRef);
  const content = useMemo(() => {
    return isValidElement(tooltip, true) ? tooltip : isValidElement(title, true) ? title : null;
  }, [title, tooltip]);
  const Component = useMemo(() => {
    return as || Pressable;
  }, [as])
  return (
    <Component {...rest as any} className={cn(!disabled && classes.active2hoverState, className)} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
      {children}
    </Component>
  );
};