"use client";
import { Ref, useEffect, useRef } from "react";
import { IAccessibilityEscapeHandler, IAccessibilityEscapeOptions } from "./types";
import { AccessibilityEscapeManager } from "./manager";
import { isDOMElement } from "@resk/core/utils";

export function useAccessibilityEscape<T extends HTMLElement = HTMLElement>(
  handler: IAccessibilityEscapeHandler,
  options: IAccessibilityEscapeOptions = {}
): Ref<T | null> {
  options = Object.assign({}, options);
  const elementRef = useRef<T>(null);
  useEffect(() => {
    const element = elementRef.current;
    if (isDOMElement(element)) {
      AccessibilityEscapeManager.getInstance().register(element as any, handler, options);
      return () => {
        AccessibilityEscapeManager.getInstance().unregister(element as any, handler);
      };
    }
  }, [handler, options.priority, options.enabled, options.stopPropagation, options.preventDefault]);
  return elementRef;
}