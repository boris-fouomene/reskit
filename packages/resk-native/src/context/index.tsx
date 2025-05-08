"use client";
import View from "./View";
import { ITheme } from '@theme/types';
import Theme from '@theme/index';
import { StyleSheet } from "react-native";
import useStateCallback from '@utils/stateCallback';
import { extendObj, isNumber, isObj } from '@resk/core/utils';
import Platform from "@resk/core/platform";
import { IReskNativeProviderProps } from './types';
import { ReskNativeContext } from './context';
import { PortalProvider } from "@components/Portal";
import Breakpoints from "@src/breakpoints";
import { Preloader, Dialog } from "@components/Dialog";
import { useI18n } from "@src/i18n/hooks";
import Default from "@auth/hooks";
import Notify from "@notify/index";
import { StatusBar } from '@components/StatusBar';
import { BottomSheet } from '@components/BottomSheet';
import { ReskNativeEvents } from "./events";
import { useColorScheme } from "@theme/useColorScheme";
import { useEffect, useMemo } from "react";
import { Drawer } from "@components/Drawer";
import { Form } from "@components/Form";

export * from "./types";

/**
 * @group ReskNativeProvider
 * `ReskNativeProvider` is a context provider that manages the application's theme state,
 * allowing dynamic theme updates and handling custom theme integration.
 *
 * It merges the default theme with any custom theme passed through props and makes it
 * available to all child components through React's Context API. The provider also handles
 * theme changes via the `useEffect` hook to ensure the theme is updated when the custom theme changes.
 *
 * @param {IReskNativeProviderProps} props - The properties passed to the provider.
 * @param {React.ReactNode} [props.children] - The components that will be wrapped by the provider.
 * @param {ITheme} [props.theme] - A custom theme to override or extend the default theme.
 * @param {any} rest - Additional properties passed to the provider for customization.
 * 
 * @example
 * ```tsx
 * import { ReskNativeProvider } from './ReskNativeProvider';
import { isNumber } from '@resk/core';
 * 
 * const customTheme = {
 *   colors: { primary: '#123456', secondary: '#654321' },
 *   fonts: { body: 'Roboto', heading: 'Lato' },
 * };
 * 
 * function App() {
 *   return (
 *     <ReskNativeProvider theme={customTheme}>
 *       <MyComponent />
 *     </ReskNativeProvider>
 *   );
 * }
 * ```
 */
export function ReskNativeProvider({ children, themes, safeAreaInsets, auth, breakpoints, i18nOptions, ...rest }: IReskNativeProviderProps) {
  i18nOptions = Object.assign({}, i18nOptions);
  const i18n = useI18n(undefined, i18nOptions);
  auth = Object.assign({}, auth);
  //drawerNavigationViewProps = Object.assign({}, drawerNavigationViewProps);
  safeAreaInsets = extendObj({}, { top: 0, left: 0, right: 0, bottom: 0 }, safeAreaInsets) as any;
  const { light, dark } = Object.assign({}, themes);
  const colorScheme = useColorScheme() || Theme.getColorSchemeFromSession() || "light";
  /**
   * Manages the current theme state using `useStateCallback`, which allows for callback functions
   * to be executed once the theme state is updated.
   *
   * @type {[ITheme, Function]} The current theme and a function to update the theme.
   */
  const [theme, setTheme] = useStateCallback<ITheme>(Theme.create(Theme.getDefaultTheme(Object.assign({}, colorScheme === "dark" ? dark : light))));

  /**
   * Updates the current theme.
   * 
   * @param {ITheme} theme - The new theme object that will replace the current theme.
   * @example
   * ```tsx
   * const { updateTheme } = useReskNativeProvider();
   * 
   * updateTheme({
   *   colors: { primary: '#FF5733', secondary: '#333' },
   *   fonts: { body: 'Arial', heading: 'Georgia' },
   * });
   * ```
   */
  const updateTheme = (theme: ITheme) => {
    setTheme(Theme.update(theme, false), (t) => {
      Theme.triggerUpdate(t as ITheme);
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
    updateTheme(Theme.update(Object.assign({}, theme, colorScheme === "dark" ? dark : light)));
  }, [themes, colorScheme]);
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
  const style = useMemo(() => {
    const { top, bottom, right, left } = Object.assign({}, safeAreaInsets);
    return [isNumber(top) && { paddingTop: top }, isNumber(bottom) && { paddingBottom: bottom }, isNumber(right) && { paddingRight: right }, isNumber(left) && { paddingLeft: left }];
  }, [safeAreaInsets]);
  const context = { theme, i18n, safeAreaInsets, updateTheme, ...rest, breakpoints };
  useEffect(() => {
    ReskNativeEvents.events.trigger("appReady", context);
    ReskNativeEvents.events.trigger("appMounted", context);
    return () => {
      ReskNativeEvents.events.trigger("appUnmounted", context);
    }
  }, []);
  /**
   * Provides the current theme and the `updateTheme` function to all child components
   * through the `ReskNativeContext`.
   * wraps the child components to ensure consistent theming across the application.
   */
  return (
    <View testID="resk-root" style={[styles.root, { backgroundColor: theme.colors.background }, style]}>
      <ReskNativeContext.Provider value={context}>
        <PortalProvider>
          <Default.AuthContext.Provider value={auth}>
            <Notify
              ref={(el: Notify) => {
                Notify.notifyRef = el;
              }}
            />
            <Preloader.Provider />
            <Dialog.Alert.Provider />
            <Dialog.Provider.Provider />
            <Drawer.Provider.Provider />
            <Form.Drawer.Provider />
            <Form.Dialog.Provider />
            <BottomSheet.Provider.Provider />
            <>
              {Platform.isClientSide() ? <StatusBar /> : null}
              {children}
            </>
          </Default.AuthContext.Provider>
        </PortalProvider>
      </ReskNativeContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
    flex: 1,
    overflow: "hidden",
    maxHeight: "100%",
    maxWidth: "100%",
  }
})