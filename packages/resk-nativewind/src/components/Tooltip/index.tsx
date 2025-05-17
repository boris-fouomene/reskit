"use client";
import { Pressable } from "react-native";
import { useMemo, useRef } from "react";
import { ITooltipProps } from './types';
import { defaultStr, uniqid } from "@resk/core";
import { useMergeRefs } from "@utils/mergeRefs";
import { isValidElement } from "@utils";
import { withAsChild } from "@components/Slot";

export * from "./types";

export const Tooltip = withAsChild(function Tooltip({ children, title, tooltip, disabled, testID, id, ref, ...rest }: ITooltipProps) {
  testID = defaultStr(testID, "resk-tooltip");
  const instanceIdRef = useRef(id || uniqid("tippy-instance-id"));
  const buttonRef = useRef(null);
  const innerRef = useMergeRefs(ref, buttonRef);
  const content = useMemo(() => {
    return isValidElement(tooltip, true) ? tooltip : isValidElement(title, true) ? title : null;
  }, [title, tooltip]);
  return (
    <Pressable {...rest} disabled={disabled} id={instanceIdRef.current} testID={testID} ref={innerRef}>
      {children}
    </Pressable>
  );
}, "Tooltip");