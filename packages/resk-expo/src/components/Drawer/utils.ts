import { Dimensions } from "react-native";
import Breakpoints from "@breakpoints";
import { Colors, ITheme } from "@theme";

const DRAWER_WIDTH = 320;
const DESKTOP_DRAWER_WIDTH = 280;
const PROVIDER_DRAWER_WIDTH = 400;


/**
 * Calculates the width of the drawer based on the device type and whether the user is a provider.
 *
 * @param {boolean} [isProvider=false] - Indicates if the user is a provider.
 * @returns {number} - The calculated width of the drawer.
 */
export const getDrawerWidth = (isProvider: boolean = false): number => {
    const isDesk = Breakpoints.isDesktopMedia();
    if (isDesk) {
        return isProvider ? PROVIDER_DRAWER_WIDTH : DESKTOP_DRAWER_WIDTH;
    };
    const { width } = Dimensions.get("window");
    const W = isProvider ? PROVIDER_DRAWER_WIDTH : DRAWER_WIDTH;
    if (width > W + 100) return W;
    return Math.floor((isDesk ? 82 : 80) * width / 100);
}

export type IDrawerWidthSize = "medium" | "large" | "auto";

export const MINIMIZED_WIDTH = 85;

export const TRANSITION_TIMEOUT = 150;

export const MINIMIZED_ICON_SIZE = 32;

export const ICON_SIZE = 24;

/**
 * Determines if the drawer can be minimized or set to permanent mode.
 *
 * This function checks if the current media matches the desktop breakpoint.
 *
 * @returns {boolean} True if the current media is desktop, otherwise false.
 */
export const canDrawerBeMinimizedOrPermanent = () => Breakpoints.isDesktopMedia();

export const getBackgroundColor = ({ active, theme }: { active?: boolean, theme: ITheme }): string => {
    return active ? Colors.setAlpha(theme.colors.primary, 0.12) as string : 'transparent';
}


