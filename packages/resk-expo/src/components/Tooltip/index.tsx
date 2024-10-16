import { Animated, Dimensions, LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ITooltipProps } from "./types";

export default function Tooltip({ children, ...props }: ITooltipProps) {
  return children;
}