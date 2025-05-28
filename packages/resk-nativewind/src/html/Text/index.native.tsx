"use client";
import { Text as RNText } from "react-native";
import { IHtmlTextProps } from "../types";
import { normalizeNativeProps } from "../utils";
import { withAsChild } from "@components/Slot";
import variantText from "@variants/text";
import { cn } from "@utils/cn";

export const Text = withAsChild(function Text({ className, variant, ...props }: IHtmlTextProps) {
    return <RNText {...normalizeNativeProps(props)} className={cn(variantText(variant), className)} />;
}, "Html.Text");