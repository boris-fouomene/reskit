//import "@expo/metro-runtime";
import "@session";
import { useEffect, useMemo } from 'react';
import { ITheme } from '@theme/types';
import { getDefaultTheme, updateTheme as uTheme, triggerThemeUpdate } from '@theme/index';
import useStateCallback from '@utils/stateCallback';
import { isObj } from '@resk/core';
import stableHash from "stable-hash";
import usePrevious from '@utils/usePrevious';
import { ReskExpoProviderProps } from './types';
import { ReskExpoContext } from './context';
import { useColorScheme } from "@theme/useColorScheme";
import { PortalProvider } from "@components/Portal";
import Breakpoints from "@src/breakpoints";

export * from "./types";
export * from "./context";

/**
 * @group ReskExpoProvider
 * `ReskExpoProvider` is a context provider that manages the application's theme state,
 * allowing dynamic theme updates and handling custom theme integration.
 *
 * It merges the default theme with any custom theme passed through props and makes it
 * available to all child components through React's Context API. The provider also handles
 * theme changes via the `useEffect` hook to ensure the theme is updated when the custom theme changes.
 *
 * @param {ReskExpoProviderProps} props - The properties passed to the provider.
 * @param {React.ReactNode} [props.children] - The components that will be wrapped by the provider.
 * @param {ITheme} [props.theme] - A custom theme to override or extend the default theme.
 * @param {any} rest - Additional properties passed to the provider for customization.
 * 
 * @example
 * ```tsx
 * import { ReskExpoProvider } from './ReskExpoProvider';
 * 
 * const customTheme = {
 *   colors: { primary: '#123456', secondary: '#654321' },
 *   fonts: { body: 'Roboto', heading: 'Lato' },
 * };
 * 
 * function App() {
 *   return (
 *     <ReskExpoProvider theme={customTheme}>
 *       <MyComponent />
 *     </ReskExpoProvider>
 *   );
 * }
 * ```
 */
export function ReskExpoProvider({ children, theme: customTheme, breakpoints, ...rest }: ReskExpoProviderProps) {
  const isDark = useColorScheme() === 'dark';
  /**
   * Manages the current theme state using `useStateCallback`, which allows for callback functions
   * to be executed once the theme state is updated.
   *
   * @type {[ITheme, Function]} The current theme and a function to update the theme.
   */
  const [theme, setTheme] = useStateCallback<ITheme>(Object.assign({}, getDefaultTheme(isDark), customTheme));

  /**
   * Stores the previous custom theme to detect changes and avoid unnecessary theme updates.
   * 
   * @type {ITheme | undefined} The previous theme state.
   */
  const prevCustomTheme = usePrevious(customTheme);

  /**
   * Updates the current theme.
   * 
   * @param {ITheme} theme - The new theme object that will replace the current theme.
   * @example
   * ```tsx
   * const { updateTheme } = useReskExpoProvider();
   * 
   * updateTheme({
   *   colors: { primary: '#FF5733', secondary: '#333' },
   *   fonts: { body: 'Arial', heading: 'Georgia' },
   * });
   * ```
   */
  const updateTheme = (theme: ITheme) => {
    setTheme(uTheme(theme, false), (t) => {
      triggerThemeUpdate(t as ITheme);
    });
  }

  /**
   * `useEffect` is used to detect changes in the custom theme prop and apply updates accordingly.
   * It compares the current custom theme with the previous one and updates the theme if necessary.
   *
   * @remarks
   * This hook relies on `stableHash` to memoize and detect theme changes, avoiding redundant re-renders.
   * 
   * @param {string} stableHash(customTheme) - Memoized hash value of the custom theme.
   */
  useEffect(() => {
    if (!isObj(customTheme) || prevCustomTheme == customTheme) return;
    updateTheme(uTheme(Object.assign({}, theme, customTheme)));
  }, [stableHash(customTheme)]);
  useMemo(() => {
    if (isObj(breakpoints)) {
      return Breakpoints.init(breakpoints);
    }
  }, [breakpoints]);
  useEffect(() => {
    if (isObj(breakpoints)) {
      Breakpoints.update();
    }
  }, [breakpoints]);
  /**
   * Provides the current theme and the `updateTheme` function to all child components
   * through the `ReskExpoContext`.
   * wraps the child components to ensure consistent theming across the application.
   */
  return (
    <ReskExpoContext.Provider value={{ theme, updateTheme, ...rest, breakpoints }}>
      <PortalProvider>{children}</PortalProvider>
    </ReskExpoContext.Provider>
  );
}
