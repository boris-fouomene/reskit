"use client";
import { IHtmlImageProps } from "../types";
import { normalizeNativeProps } from "../utils";
import { Image as RNImage } from "react-native";
export function Image(props: IHtmlImageProps) {
    return <RNImage resizeMethod="auto" {...normalizeNativeProps(props)} />;
}

Image.displayName = "Html.Image";