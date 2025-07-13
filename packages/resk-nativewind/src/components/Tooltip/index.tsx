"use client";
import { TouchableOpacity, PressableProps } from "react-native";
import { useId, useMemo, useRef } from "react";
import { ITooltipProps } from './types';
import { defaultStr } from "@resk/core/utils";
import { useMergeRefs } from "@utils/mergeRefs";
import { cn, isValidElement } from "@utils";
import { ITouchableProps } from "@src/types";

export * from "./types";
export function Tooltip<asProps extends Partial<ITouchableProps> = PressableProps>({ children, className, as, title, disabled, testID, id, ref, ...rest }: ITooltipProps<asProps>) {
  testID = defaultStr(testID, "resk-tooltip");
  const uId = useId();
  const instanceIdRef = useRef(defaultStr(id, uId));
  const buttonRef = useRef(null);
  const innerRef = useMergeRefs(ref, buttonRef);
  const content = useMemo(() => {
    return isValidElement(title, true) ? title : null;
  }, [title]);
  const Component = useMemo(() => {
    return as || TouchableOpacity;
  }, [as])
  return (
    <Component {...rest as any} className={cn(className)} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
      {children}
    </Component>
  );
};