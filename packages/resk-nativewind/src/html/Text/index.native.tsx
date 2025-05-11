"use client";
import { Text as RNText } from "react-native";
import { IHtmlTextProps } from "../types";
import { normalizeNativeProps } from "../utils";

export function Text(props: IHtmlTextProps) {
    return <RNText {...normalizeNativeProps(props)} />
}