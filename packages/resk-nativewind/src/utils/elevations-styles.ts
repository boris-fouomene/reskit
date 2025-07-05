/***@see : https://github.com/Naeemur/react-native-elevation */
import { IDict } from "@resk/core/types"
import { isNumber } from "@resk/core/utils"
import { ImageStyle, Platform, TextStyle, ViewStyle } from "react-native"

const webDepth: IDict = {
    umbra: [
        "0px 0px 0px 0px",
        "0px 2px 1px -1px",
        "0px 3px 1px -2px",
        "0px 3px 3px -2px",
        "0px 2px 4px -1px",
        "0px 3px 5px -1px",
        "0px 3px 5px -1px",
        "0px 4px 5px -2px",
        "0px 5px 5px -3px",
        "0px 5px 6px -3px",
        "0px 6px 6px -3px",
        "0px 6px 7px -4px",
        "0px 7px 8px -4px",
        "0px 7px 8px -4px",
        "0px 7px 9px -4px",
        "0px 8px 9px -5px",
        "0px 8px 10px -5px",
        "0px 8px 11px -5px",
        "0px 9px 11px -5px",
        "0px 9px 12px -6px",
        "0px 10px 13px -6px",
        "0px 10px 13px -6px",
        "0px 10px 14px -6px",
        "0px 11px 14px -7px",
        "0px 11px 15px -7px"
    ],
    penumbra: [
        "0px 0px 0px 0px",
        "0px 1px 1px 0px",
        "0px 2px 2px 0px",
        "0px 3px 4px 0px",
        "0px 4px 5px 0px",
        "0px 5px 8px 0px",
        "0px 6px 10px 0px",
        "0px 7px 10px 1px",
        "0px 8px 10px 1px",
        "0px 9px 12px 1px",
        "0px 10px 14px 1px",
        "0px 11px 15px 1px",
        "0px 12px 17px 2px",
        "0px 13px 19px 2px",
        "0px 14px 21px 2px",
        "0px 15px 22px 2px",
        "0px 16px 24px 2px",
        "0px 17px 26px 2px",
        "0px 18px 28px 2px",
        "0px 19px 29px 2px",
        "0px 20px 31px 3px",
        "0px 21px 33px 3px",
        "0px 22px 35px 3px",
        "0px 23px 36px 3px",
        "0px 24px 38px 3px"
    ],
    ambient: [
        "0px 0px 0px 0px",
        "0px 1px 3px 0px",
        "0px 1px 5px 0px",
        "0px 1px 8px 0px",
        "0px 1px 10px 0px",
        "0px 1px 14px 0px",
        "0px 1px 18px 0px",
        "0px 2px 16px 1px",
        "0px 3px 14px 2px",
        "0px 3px 16px 2px",
        "0px 4px 18px 3px",
        "0px 4px 20px 3px",
        "0px 5px 22px 4px",
        "0px 5px 24px 4px",
        "0px 5px 26px 4px",
        "0px 6px 28px 5px",
        "0px 6px 30px 5px",
        "0px 6px 32px 5px",
        "0px 7px 34px 6px",
        "0px 7px 36px 6px",
        "0px 8px 38px 7px",
        "0px 8px 40px 7px",
        "0px 8px 42px 7px",
        "0px 9px 44px 8px",
        "0px 9px 46px 8px"
    ]
}


const derive = (i: number, a: number, b: number, a2: number, b2: number): number => {
    return ((i - a) * (b2 - a2)) / (b - a) + a2
}

const parseShadow = (raw: string) => {
    const values = raw.split(" ").map(val => +val.replace("px", ""))
    return {
        x: values[0],
        y: values[1],
        blur: values[2],
        spread: values[3]
    }
}
const maxElevation = 24;
export function generateElevationStyle(depth: number = 0): ViewStyle {
    if (!isNumber(depth) || depth < 0) {
        depth = 0;
    }
    depth = Math.min(depth, maxElevation);
    if (Platform.OS === "android") {
        return {
            elevation: depth
        };
    } else if (Platform.OS === "ios") {
        const s = parseShadow(webDepth.penumbra[depth])
        const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5)
        return {
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: y
            },
            shadowOpacity: depth <= 0 ? 0 : Number(derive(depth - 1, 1, 24, 0.2, 0.6).toFixed(2)),
            shadowRadius: Number(derive(s.blur, 1, 38, 1, 16).toFixed(2))
        };
    }
    //web 
    const webColor = {
        umbra: "rgba(0,0,0,0.2)",
        penumbra: "rgba(0,0,0,0.14)",
        ambient: "rgba(0,0,0,0.12)"
    }
    return {
        elevation: depth,
        zIndex: depth,
        boxShadow: `
             ${webDepth.umbra[depth]} ${webColor.umbra},
             ${webDepth.penumbra[depth]} ${webColor.penumbra},
             ${webDepth.ambient[Math.max(0, depth - 1)]} ${webColor.ambient}
         `
    };
}


/**
 * Computes a style object from the given elevation and style props.
 * If the elevation prop is a number greater than 0, it will be used to generate a style object with the appropriate elevation.
 * The style prop will then be merged with the generated style object using StyleSheet.flatten.
 * If the elevation prop is not a number greater than 0, the style prop will be returned as is.
 * @param {{ elevation?: number, style?: ViewStyle | TextStyle | ImageStyle }} props
 * @returns {ViewStyle | TextStyle | ImageStyle}
 */
export function computeElevationStyle(props: { elevation?: number, style?: ViewStyle | TextStyle | ImageStyle }) {
    const { elevation, style } = props;
    const flattenStyle = isNumber(elevation) && elevation > 0 ? StyleSheet.flatten([generateElevationStyle(elevation), style]) : style;
    return flattenStyle;
}