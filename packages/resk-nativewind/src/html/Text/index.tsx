import { withAsChild } from "@components/Slot";
import { Div } from "../Div";
import { IHtmlTextProps } from "@html/types";
import { cn } from "@utils/cn";
import { IClassName } from "@src/types";
import { isNumber } from "@resk/core/utils";
import { StyleSheet } from "react-native";
import { textVariant } from "@variants/text";

export const Text = withAsChild(function Text({ numberOfLines, selectable, variant, allowFontScaling, style: cStyle, ellipsizeMode, lineBreakMode, maxFontSizeMultiplier, minimumFontScale, ...props }: IHtmlTextProps) {
    const classes: IClassName = [];
    const style = {} as any;
    classes.push(selectable === false ? "select-none" : "select-text")
    if (isNumber(numberOfLines) && numberOfLines >= 1) {
        classes.push("max-w-full", "text-ellipsis");
        if (numberOfLines > 1) {
            Object.assign(style, {
                display: '-webkit-box',
                overflow: 'clip',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: numberOfLines,
            })
        } else {
            classes.push("overflow-hidden whitespace-nowrap");
            style.wordWrap = "normal";
        }
    }
    if (ellipsizeMode || lineBreakMode) {
        const truncationMode = ellipsizeMode || lineBreakMode;
        classes.push("overflow-hidden");
        if (truncationMode === 'clip') {
            classes.push("text-clip");
        } else if (truncationMode === 'tail') {
            classes.push("text-ellipsis", "whitespace-nowrap");
        } else if (truncationMode === 'head' || truncationMode === 'middle') {
            classes.push('truncate');
        }
    }
    if (allowFontScaling === false) {
        style.textSizeAdjust = 'none';
        style.WebkitTextSizeAdjust = 'none';
        style.MozTextSizeAdjust = 'none';
        style.msTextSizeAdjust = 'none';
    }
    return <Div asHtmlTag="span" {...props} style={StyleSheet.flatten([style, cStyle])} className={cn(classes, textVariant(variant), props.className)} />;
}, "Html.Text");