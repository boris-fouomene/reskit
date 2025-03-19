import { RippleColors, TouchableRipple } from "./Ripple";
export * from "./utils";
export * from "./types";

const TouchableRippleExported: typeof TouchableRipple & {
    darkRippleColor: string;
    lightRippleColor: string;
} = TouchableRipple as any;

TouchableRippleExported.darkRippleColor = RippleColors.dark;
TouchableRippleExported.lightRippleColor = RippleColors.light;

export { TouchableRippleExported as TouchableRipple };
