"use client";
import { Text as RNText } from "react-native";
import { IHtmlTextProps } from "../types";
import { normalizeNativeProps } from "../utils";
import { withAsChild } from "@components/Slot";

export const Text = withAsChild(function Text(props: IHtmlTextProps) {
    return <RNText {...normalizeNativeProps(props)} />
}, "Html.Text");