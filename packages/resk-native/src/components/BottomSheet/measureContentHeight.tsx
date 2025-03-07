import { measureInWindow } from "@utils/measureInWindow";
import React from "react";
import { Dimensions, View } from "react-native";

/**
 * 
 * Measures the content height of a component to display in the Bottom sheet, based on it's anchor element.
 * 
 * @param {React.RefObject<View>} anchorRef - The reference the anchor element.
 * @param {number} [screenIndent=20] - The screen indentation.
 * @returns {Promise<{ x: number, y: number, width: number, height: number, contentHeight: number }>} A promise that resolves with the layout coordinates and content height.
 */
export function measureContentHeight(anchorRef: React.RefObject<View>, minContentHeight: number = 400) {
    return measureInWindow(anchorRef).then((result) => {
        const { height, y } = result;
        const winHeight = Dimensions.get("window").height;
        minContentHeight = typeof minContentHeight == "number" && minContentHeight > 0 ? minContentHeight : 400;
        const rHeight = winHeight - y - height;
        const contentHeight = Math.max(Math.min(rHeight, winHeight - 100), y - height - 10, minContentHeight);
        return {
            ...result,
            contentHeight: Math.min(contentHeight, winHeight)
        };
    })
}   