import { useReskExpoProvider } from "@src/context";
import Theme from "@theme";
import { ITheme } from "@theme/types";

/**
 * @group ReskExpoProvider
 * @function useTheme
 * `useTheme` is a custom hook that provides the current theme used in the application.
 * 
 * It fetches the theme from the `ReskExpoProvider` context. If no theme is provided 
 * via the provider, it defaults to the base theme imported from `@theme`.
 * 
 * @returns {ITheme} The current theme object. If no theme is set in the context, it returns the default theme.
 * 
 * @example
 * ```tsx
 * import { useTheme } from './hooks/useTheme';
 * 
 * const MyComponent = () => {
 *   const theme = useTheme();
 *   
 *   return (
 *     <div style={{ backgroundColor: theme.colors.primary }}>
 *       This component uses the primary color from the current theme.
 *     </div>
 *   );
 * };
 * ```
 * 
 * @remarks
 * This hook is particularly useful in functional components that need access to the theme
 * without directly passing it as a prop. It ensures that if no theme is provided through 
 * the context, the default theme is always returned, making it safe to use throughout 
 * the application.
 */
export const useTheme = (): ITheme => {
    const { theme } = useReskExpoProvider();
    /**
     * Returns the current theme from `ReskExpoProvider` context.
     * If no theme is found, it returns the default `Theme` from `@theme`.
     */
    return theme || Theme;
};
