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
    const darkTrackStyle = `::-webkit-scrollbar-track{background-color: ${darkTrackBG};}`;
    const trackstyle = `
        ::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            border-radius: 10px;
            background-color: ${trackBG};
            border:1px solid;
        }
        .dark ${darkTrackStyle}
    `;
    const darkThumbStyle = `::-webkit-scrollbar-thumb{background-color: ${darkPrimary};}`;
    const thumbStyle = `
    ::-webkit-scrollbar-thumb{
      background-color: ${primary};
      border: 2px solid;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .dark ${darkThumbStyle}
    `;
    const darkCss = [`.tippy-box[data-theme~='${TIPPY_THEME}'] {
                background-color: ${darkPrimary};
                color: ${darkPrimaryForeground};
            }
        `, `.tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='top']>.tippy-arrow::before {
                border-top-color: ${darkPrimary};
            }
        `,
    `.tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='bottom']>.tippy-arrow::before {
                border-bottom-color: ${darkPrimary};
            }
        `,
    `.tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='left']>.tippy-arrow::before {
            border-left-color: ${darkPrimary};
        }
        .tippy-box[data-theme~='${TIPPY_THEME}'][data-placement^='right']>.tippy-arrow::before {
            border-right-color: ${darkPrimary};
        }
    `
    ];
    return <>
        <style id="reskit-app-root-global-styles">
            {`
        html, body, #root {
            box-sizing: border-box;
            position: relative;
            z-index: 1;
            margin: 0;
            padding: 0;
            min-width: 0;
            min-height: 0;
            width: 100%;
            height: 100%;
            max-width: 100vw;
            max-height: 100vh;
            /* Modern fill available */
            width: fill-available;
            height: fill-available;
            /* WebKit fallback */
            width: -webkit-fill-available;
            height: -webkit-fill-available;
            /* Mozilla fallback */
            width: -moz-available;
            height: -moz-available;
            /* Edge fallback */
            width: stretch;
            height: stretch;
            -webkit-text-size-adjust: none;
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

        body.desktop ${trackstyle}
        body.desktop ${scrollbarStyle}
        body.desktop ${thumbStyle}
        body.not-touch-device ${trackstyle}
        body.not-touch-device ${scrollbarStyle}
        body.not-touch-device ${thumbStyle}
        
        * {
          scrollbar-width: thin;
          scrollbar-color: ${primary} rgba(243, 244, 246, 0.8);
        }
        
        .dark * {
            scrollbar-color: ${darkPrimary} rgba(17, 24, 39, 0.9);
        }
        
        ::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* dark colors for theme*/
        ${darkCss.map((c) => c.split('.tippy-box').join(".dark .tippy-box")).join("\n")}
        
         
        @media (prefers-color-scheme: dark) {
            ${darkCss.join("\n")}
            body.desktop ${darkThumbStyle}
            body.not-touch-device ${darkTrackBG}
            * {
                scrollbar-color: ${darkPrimary} rgba(17, 24, 39, 0.9);
            }
        } 
    `}
        </style>
        <BodyClasses />
    </>
}