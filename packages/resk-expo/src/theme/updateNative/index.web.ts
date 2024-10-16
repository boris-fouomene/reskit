
import { uniqid, Platform, IDict, isObj } from "@resk/core";
import { TIPPY_THEME } from "./utils";
const themeDomId = uniqid("web-theme-id");

/*** met à jour le theme en environnement web
 * Cette fonction permet d'appliquer le styling en environnement web. 
 * Elle permet notement de styler le scroll bar et autres éléments dom dont nécessitant à forcer le styling
 * 
 */
export default function updateWebTheme(theme: IDict) {
    if (!Platform.isWeb() || !isObj(theme)) return null;
    let style = document.querySelector(`#${themeDomId}`);
    if (!style) {
        style = document.createElement("style");
        document.body.appendChild(style);
    }
    style.id = themeDomId;
    const primary = theme.colors.primary;
    //const isWhite = Colors.getContrast(primary) =="white"? true : false;
    const trackBG = theme.colors.surface//isWhite ? "#F5F5F5" : "#121212";
    const scrollbarColor = theme.colors.primary;
    style.textContent = `
        body,html { 
            -ms-overflow-style: none !important; 
            color:#4b4646;
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
            background-color : ${theme.colors.background};
        }
        body > div {
            background-color : transparent;
        }
        body.desktop ::-webkit-scrollbar-track
        {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            border-radius: 10px;
            background-color: ${trackBG};
        }

        body.desktop ::-webkit-scrollbar-track
        {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: ${trackBG};
        }

        body.desktop ::-webkit-scrollbar
        {
            width: 10px;
            height:10px;
            background-color: ${trackBG};
        }

        body.desktop ::-webkit-scrollbar-thumb
        {
            background-color: ${theme.colors.primary};
        }

        body.desktop.theme-primary-white ::-webkit-scrollbar-thumb
        {
            background-color: ${theme.colors.secondary};
        }

        body.not-touch-device ::-webkit-scrollbar-track
        {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            border-radius: 10px;
            background-color: ${trackBG};
            border:0px!important;
        }

        body.not-touch-device ::-webkit-scrollbar-track
        {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: ${trackBG};
            border:0px!important;
        }

        body.not-touch-device ::-webkit-scrollbar
        {
            width: 10px;
            height:10px;
            background-color: ${trackBG};
            border:0px!important;
        }

        body.not-touch-device ::-webkit-scrollbar-thumb
        {
            background-color: ${scrollbarColor};
        }

        .tippy-box[data-theme~='${TIPPY_THEME}'] {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.onPrimary};
            font-weight : 400;
            text-shadow: none;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
            font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Fira Sans",Ubuntu,Oxygen,"Oxygen Sans",Cantarell,"Droid Sans","Apple Color Emoji","Segoe UI Emoji","Segoe UI Emoji","Segoe UI Symbol","Lucida Grande",Helvetica,Arial,sans-serif;
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
        .tippy-box[data-theme~='${TIPPY_THEME}'] > .tippy-svg-arrow {
            fill: ${primary};
        }
        .tippy-box[data-theme~='${TIPPY_THEME}'] > .tippy-backdrop {
            background-color: ${primary};
        }
        body > iframe {
            z-index : 1!important;
            width : 0px!important;
            height : 0px!important;
        }
        :focus { outline: none!important; }
        ${theme.customCSS || ''}
    `;
}