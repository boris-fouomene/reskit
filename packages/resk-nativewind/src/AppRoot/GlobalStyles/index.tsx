import { TIPPY_THEME } from "@components/Tooltip/constants";
import { VariantsColorsFactory } from "@variants/colors";
import { isNextJs } from "@platform/isNext";
import { defaultStr } from "@resk/core/utils";
import { BodyClasses } from "./BodyClasses";

export function GlobalStyles() {
    if (!isNextJs() && (typeof document == "undefined" || typeof window === "undefined" || !window || !document || !document?.body)) return null;
    const { lightColor, lightForeground, darkColor, darkForeground } = Object.assign({}, VariantsColorsFactory.colors.primary);
    const { lightColor: surfaceLightColor, darkColor: surfaceDarkColor } = Object.assign({}, VariantsColorsFactory.colors.surface);
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
    return <>
        <BodyClasses />
        <style id="reskit-app-root-global-styles">
            {`
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
         
        body.desktop ${trackstyle}
        body.desktop ${scrollbarStyle}
        body.desktop ${thumbStyle}
        body.not-touch-device ${trackstyle}
        body.not-touch-device ${scrollbarStyle}
        body.not-touch-device ${thumbStyle}
    `}
        </style>
    </>
}