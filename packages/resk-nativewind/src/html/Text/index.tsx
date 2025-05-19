import { withAsChild } from "@components/Slot";
import { Div } from "../Div";
import { IHtmlTextProps } from "@html/types";
import { cn } from "@utils/cn";
import { IClassName } from "@src/types";
import { isNumber } from "@resk/core/utils";
import { StyleSheet } from "react-native";

export const Text = withAsChild(function Text({ numberOfLines, allowFontScaling, style: cStyle, ellipsizeMode, lineBreakMode, maxFontSizeMultiplier, minimumFontScale, ...props }: IHtmlTextProps) {
    const classes: IClassName = [];
    const style = {} as any;
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
    if (isNumber(numberOfLines) && numberOfLines > 0) {
        style.display = '-webkit-box';
        style.WebkitBoxOrient = 'vertical';
        style.WebkitLineClamp = numberOfLines;
        classes.push("overflow-hidden", "text-ellipsis",);
    }
    if (allowFontScaling === false) {
        style.textSizeAdjust = 'none';
        style.WebkitTextSizeAdjust = 'none';
        style.MozTextSizeAdjust = 'none';
        style.msTextSizeAdjust = 'none';
    }
    return <Div {...props} style={StyleSheet.flatten([style, cStyle])} className={cn(classes, props.className)} />;
}, "Html.Text");