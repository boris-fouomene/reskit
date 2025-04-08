import { Platform } from "@resk/core";
import { useState } from "react";

const isSupported = Platform.isClientSide() && typeof window !== "undefined" && window && typeof window.matchMedia == 'function';

/**
 * Color scheme detection utility
 * 
 * A cross-platform TypeScript function that detects whether the user's system
 * prefers a dark or light color scheme.
 */

/**
 * Represents the possible color scheme preferences
 */
type IColorScheme = 'light' | 'dark';

/**
 * Detects the user's preferred color scheme from the browser
 * 
 * @returns The detected color scheme ('light', 'dark', or 'no-preference')
 * @throws Error if called in an environment without access to window.matchMedia
 */
function getColorScheme(): IColorScheme {
  // Check if we're in a browser environment with window.matchMedia available
  if (!isSupported) {
    return "light";
  }
  // Check if the user prefers dark mode
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}


/**
 * Detects the user's preferred color scheme and provides a React hook that can
 * be used to observe changes to the user's color scheme preference.
 * 
 * @returns The detected color scheme ('light', 'dark', or 'no-preference')
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export function useColorScheme(): IColorScheme {
  const darkModeMediaQuery = isSupported ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const lightModeMediaQuery = isSupported ? window.matchMedia('(prefers-color-scheme: light)') : null;
  const [colorScheme, setColorScheme] = useState<IColorScheme>(getColorScheme());
  const handleChange = () => {
    setColorScheme(getColorScheme());
  };
  // Modern browsers use addEventListener
  if (typeof darkModeMediaQuery?.addEventListener === 'function' && typeof lightModeMediaQuery?.addEventListener === 'function') {
    darkModeMediaQuery.addEventListener('change', handleChange);
    lightModeMediaQuery.addEventListener('change', handleChange);
  } else if (typeof darkModeMediaQuery?.addListener == 'function' && typeof lightModeMediaQuery?.addListener === 'function') {
    // Fallback for older browsers that use the deprecated addListener
    darkModeMediaQuery.addListener(handleChange);
    lightModeMediaQuery.addListener(handleChange);
  }
  return colorScheme;
}