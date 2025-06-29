"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantsColors = void 0;
const isNonNullString = (x) => typeof x === "string" && x;
class VariantsColors {
    static registerColor(colors) {
        Object.entries(Object.assign({}, colors)).map(([color, value]) => {
            if (!value || typeof value !== "object" || !isNonNullString(value === null || value === void 0 ? void 0 : value.lightColor) || !isNonNullString(value === null || value === void 0 ? void 0 : value.lightForeground) || !isNonNullString(value === null || value === void 0 ? void 0 : value.darkColor) || !isNonNullString(value === null || value === void 0 ? void 0 : value.darkForeground))
                return;
            this._colors[color] = value;
        });
    }
    static get colors() {
        return this._colors;
    }
    static buildColors(tailwindClassPrefix, withImportantAttribute, colorClassNameBuilder, colorSuffix) {
        const r = Object.create({});
        const importantPrefix = withImportantAttribute ? "!" : "";
        const suffix = colorSuffix && typeof colorSuffix == "string" ? colorSuffix : "";
        const colorBuilder = typeof colorClassNameBuilder == "function" ? colorClassNameBuilder : ({ lightColorWithPrefix, darkColorWithPrefix }) => `${lightColorWithPrefix} ${darkColorWithPrefix}`;
        const isForeground = String(colorSuffix).toLowerCase().split("-")[1] === "foreground";
        Object.entries(VariantsColors.colors).map(([color, value]) => {
            const _a = Object.assign({}, value), { lightColor: light, lightForeground: _lightForeground, darkColor: dark, darkForeground: _darkForeground } = _a, rest = __rest(_a, ["lightColor", "lightForeground", "darkColor", "darkForeground"]);
            const lightColor = isForeground ? _lightForeground : light;
            const darkColor = isForeground ? _darkForeground : dark;
            const lightForeground = isForeground ? light : _lightForeground;
            const darkForeground = isForeground ? dark : _darkForeground;
            r[color] = colorBuilder(Object.assign(Object.assign({}, rest), { lightColor,
                darkColor, lightColorWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightColor}${suffix}`, darkColorWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkColor}${suffix}`, darkForeground,
                lightForeground, lightForegroundWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightForeground}${suffix}`, darkForegroundWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkForeground}${suffix}` }));
        });
        return r;
    }
    static buildTextColors(withImportantAttribute, colorClassNameBuilder) {
        return VariantsColors.buildColors("text", withImportantAttribute, colorClassNameBuilder);
    }
    static buildBackgroundColors(withImportantAttribute, colorClassNameBuilder) {
        return VariantsColors.buildColors("bg", withImportantAttribute, colorClassNameBuilder);
    }
    static buildBorderColors(withImportantAttribute, colorClassNameBuilder) {
        return VariantsColors.buildColors("border", withImportantAttribute, colorClassNameBuilder);
    }
    static generateColorsMapTypes() {
        const generateText = [
            "import { IVariantsColorsMapBase } from './types';",
            "export interface IVariantsColorsMap extends IVariantsColorsMapBase {",
        ];
        Object.entries(VariantsColors.colors).forEach(([color, value]) => {
            if (["primary", "secondary", "surface", "background", "text", "neutral", "error", "info", "warning", "success"].includes(color))
                return;
            generateText.push(`\t${color}: IVariantColor;`);
        });
        generateText.push("}");
        return generateText.join("\n");
    }
}
exports.VariantsColors = VariantsColors;
VariantsColors._colors = {};
