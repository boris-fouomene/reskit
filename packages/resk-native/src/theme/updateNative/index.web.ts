"use client";
import { uniqid, isObj, defaultNumber, isNumber, isEmpty } from "@resk/core/utils";
import Platform from "@resk/core/platform";
import { TIPPY_THEME } from "./utils";
import { ITheme } from "@theme/types";
import { Colors } from "..";
const themeDomId = uniqid("web-theme-id");

/**
 * Updates the web theme by injecting custom CSS into the DOM for styling web elements.
 * 
 * This function specifically targets the web environment. It applies a custom styling to
 * elements like the scrollbar, scroll track, and Tippy.js tooltips, ensuring a consistent 
 * appearance based on the provided theme colors. Additionally, it supports adding custom CSS 
 * properties that can be passed via the `theme.customCSS`.
 * 
 * @param {ITheme} theme - The theme object containing the color scheme and optional custom CSS.
 * @returns {void | null} Returns null if not in a web environment or if the theme is invalid.
 * 
 * @example
 * ```ts
 * const theme: ITheme = {
 *   colors: {
 *     primary: "#6200EE",
 *     onPrimary: "#FFFFFF",
 *     background: "#F5F5F5",
 *     surface: "#121212"
 *   },
 *   customCSS: `
 *     body { font-family: Arial, sans-serif; }
 *   `
 * };
 * updateWebTheme(theme);
 * ```
 * 
 * @remarks
 * The function first checks if the platform is a web environment and if the theme object is valid.
 * It creates a `<style>` element in the document body if it doesn't exist, and populates it with 
 * styles based on the theme's color palette.
 * 
 * ### Features:
 * - Sets global styles for `body` and `html` elements, like overflow behavior and background colors.
 * - Styles the scrollbar and its track based on the theme colors.
 * - Applies specific styles to Tippy.js tooltips, ensuring the tooltip's appearance matches the theme.
 * - Handles both desktop and non-touch devices for scrollbar styling.
 * - Merges any custom CSS passed in the `theme.customCSS` property.
 */
export default function updateWebTheme(theme: ITheme) {
    if (typeof window === "undefined" || !window) return null;
    if (!Platform.isWeb() || !isObj(theme)) return null; // Return early if not in a web environment or if theme is invalid
    let style = document.querySelector(`#${themeDomId}`);
    if (!style) {
        style = document.createElement("style");
        document.body.appendChild(style);
    }
    style.id = themeDomId;

    const webScrollbar = Object.assign({}, theme.webScrollbar);

    const primary = theme.colors.primary;
    const width = 8;
    const height = 8;
    const trackBG = theme.colors.surface;
    const backgroundColor = theme.colors.primary;

    const scrollbarStyle = `::-webkit-scrollbar
        {
            width: ${width}px;
            height:${height}px;
            border:opx!important;
            ${toCSSString(webScrollbar.scrollbar)}
        }
    `;
    const trackstyle = `::-webkit-scrollbar-track
        {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            border-radius: 10px;
            background-color: ${trackBG};
            border:0px!important;
            ${toCSSString(webScrollbar.track)}	
        }
    `;
    const thumbStyle = `::-webkit-scrollbar-thumb
        {
            background-color: ${backgroundColor};
            ${toCSSString(webScrollbar.thumb)}
        }
    `;
    const thumHoverStyle = `::-webkit-scrollbar-thumb:hover { ${toCSSString(webScrollbar.thumbHover)} }`
    const thumActiveStyle = `::-webkit-scrollbar-thumb:active { ${toCSSString(webScrollbar.thumbActive)} }`;;
    const cornerStyle = `::-webkit-scrollbar-corner { ${toCSSString(webScrollbar.corner)} }`;
    const resizerStyle = `::-webkit-resizer { ${toCSSString(webScrollbar.resizer)} }`;
    style.textContent = `
        body,html { 
            -ms-overflow-style: none !important; 
            -webkit-text-size-adjust: none!important;
            position: relative;
            z-index: 1;
            overflow: hidden!important;
            margin: 0px !important; 
            width: 100% !important; 
            height: 100% !important;
            overflow:hidden!important;
            margin:0!important;
            padding:0!important;
        }
        body > div {
            background-color : transparent;
        }
        body.desktop ${trackstyle}
        body.desktop ${scrollbarStyle}
        body.desktop ${thumbStyle}


        body.not-touch-device ${trackstyle}
        body.not-touch-device ${scrollbarStyle}
        body.not-touch-device ${thumbStyle}
        
        body.desktop ${thumHoverStyle}
        body.desktop ${thumActiveStyle}
        body.desktop ${cornerStyle}
        body.desktop ${resizerStyle}

        body.not-touch-device ${thumHoverStyle}
        body.not-touch-device ${thumActiveStyle}
        body.not-touch-device ${cornerStyle}
        body.not-touch-device ${resizerStyle}


        .tippy-box[data-theme~='${TIPPY_THEME}'] {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.onPrimary};
            font-weight : 400;
            text-shadow: none;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
        }
        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='top'] > .tippy-arrow::before {
            border-top-color: ${primary};
        }
        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='bottom'] > .tippy-arrow::before {
            border-bottom-color: ${primary};
        }
        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='left'] > .tippy-arrow::before {
            border-left-color: ${primary};
        }
        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='right'] > .tippy-arrow::before {
            border-right-color: ${primary};
        }
        ${theme.customCSS || ''}
    `;
}

// Helper function to convert CSSProperties to a CSS string
function toCSSString(properties?: Partial<CSSStyleDeclaration>): string {
    if (!isObj(properties)) return "";
    return Object.entries(properties)
        .map((arr) => {
            const [key, value] = arr;
            if (!isEmpty(value)) return "";
            return `${key as any}: ${value};` as string;
        })
        .join(" ");
}