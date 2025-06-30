"use client";
import { addClassName, defaultStr, isDOMElement, removeClassName } from "@resk/core/utils";
import { useBreakpoints } from "@utils/breakpoints";
import { useEffect } from "react";
import Platform from "@resk/core/platform";
import { TIPPY_THEME } from "@components/Tooltip/constants";
import { VariantsColors } from "@variants/colors";

const globalStyleId = "resk-global-style-id";
export function GlobalStyles() {
    const { isMobile, isTablet, isDesktop } = useBreakpoints();
    useEffect(() => {
        if (typeof document !== 'undefined' && document && isDOMElement(document.body) && typeof window !== "undefined" && window) {
            const body = document.body;
            removeClassName(body, "mobile tablet desktop");
            const className = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
            addClassName(body, className);
            removeClassName(body, "not-touch-device");
            removeClassName(body, "is-touch-device");
            addClassName(body, Platform.isTouchDevice() ? "is-touch-device" : "not-touch-device");
        }
    }, [isMobile, isTablet, isDesktop]);

    useEffect(() => {
        if (!Platform.isWeb() || typeof document == "undefined") return;
        let elem = document.querySelector(`#${globalStyleId}`);
        if (elem) return;
        elem = document.createElement("style");
        elem.id = globalStyleId;
        document.body.appendChild(elem);
        const { lightColor, lightForeground, darkColor, darkForeground } = Object.assign({}, VariantsColors.colors.primary);
        const { lightColor: surfaceLightColor, darkColor: surfaceDarkColor } = Object.assign({}, VariantsColors.colors.surface);
        const primary = `var(--color-${defaultStr(lightColor)})`,
            darkPrimary = `var(--color-${defaultStr(darkColor)})`,
            primaryForeground = `var(--color-${defaultStr(lightForeground)})`,
            darkPrimaryForeground = `var(--color-${defaultStr(darkForeground)})`;

        const width = 8;
        const height = 8;
        const trackBG = `var(--color-${defaultStr(surfaceLightColor)})`;
        const darkTrackBG = `var(--color-${defaultStr(surfaceDarkColor)})`;

        const scrollbarStyle = `::-webkit-scrollbar
        {
            width: ${width}px;
            height:${height}px;
            border:opx;
        }
    `;
        const trackstyle = `
        ::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            border-radius: 10px;
            background-color: ${trackBG};
            border:0px;
        }
        .dark ::-webkit-scrollbar-track{
            background-color: ${darkTrackBG};
        }
    `;
        const thumbStyle = `
    ::-webkit-scrollbar-thumb{background-color: ${primary};}
    .dark ::-webkit-scrollbar-thumb{background-color: ${darkPrimary};}
    `;

        elem.textContent = `
        .tippy-box[data-theme~='${TIPPY_THEME}'] {
            background-color: ${primary};
            color: ${primaryForeground};
            font-weight: 400;
            text-shadow: none;
            box-shadow: none;
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='top']>.tippy-arrow::before {
            border-top-color: ${primary};
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='bottom']>.tippy-arrow::before {
            border-bottom-color: ${primary};
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='left']>.tippy-arrow::before {
            border-left-color: ${primary};
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='right']>.tippy-arrow::before {
            border-right-color: ${primary};
        }

        /* dark colors for theme*/
        .dark .tippy-box[data-theme~='${TIPPY_THEME}'] {
            background-color: ${darkPrimary};
            color: ${darkPrimaryForeground};
            font-weight: 400;
            text-shadow: none;
            box-shadow: none;
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='top']>.tippy-arrow::before {
            border-top-color: ${darkPrimary};
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='bottom']>.tippy-arrow::before {
            border-bottom-color: ${darkPrimary};
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='left']>.tippy-arrow::before {
            border-left-color: ${darkPrimary};
        }

        .dark .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='right']>.tippy-arrow::before {
            border-right-color: ${darkPrimary};
        }
        
        
         html,body,#root { 
            -ms-overflow-style: none; 
            -webkit-text-size-adjust: none;
            position: relative;
            z-index: 1;
            overflow: hidden;
            margin: 0px; 
            width: 100vw; 
            height: -webkit-fill-available;   
            overflow:hidden;
            margin:0;
            padding:0;
        }
        body.desktop ${trackstyle}
        body.desktop ${scrollbarStyle}
        body.desktop ${thumbStyle}


        body.not-touch-device ${trackstyle}
        body.not-touch-device ${scrollbarStyle}
        body.not-touch-device ${thumbStyle}
    `;
    }, [])
    return null; // This component does not render anything
}