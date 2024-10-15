import defaultConfig from '@tamagui/config/v3';
import { useMemo } from 'react';
import { extendObj, isObj } from '@resk/core';
import { TamaguiProvider, TamaguiProviderProps, createTamagui } from '@tamagui/core';


/**
 * A wrapper component that extends the `TamaguiProvider` from the Tamagui library., and which allows for the customization
 * of the configuration by merging the default Tamagui configuration with a user-provided custom configuration passed in via props.
 * This component uses `useMemo` to optimize performance by memoizing the configuration.
 * 
 * The `config` prop is passed explicitly and overrides the default configuration.
 * Other props from `TamaguiProviderProps` can also be passed, excluding the `config` prop which is replaced with a new type.
 * 
 * @param {Omit<TamaguiProviderProps, 'config'> & { config: typeof defaultConfig }} props - The properties to configure the provider, including custom config.
 * @param {typeof defaultConfig} props.config - The custom configuration object that will be merged with the default Tamagui configuration.
 * 
 * @example
 * ```tsx
 * import ReskTamaguiProvider from './ReskTamaguiProvider';
 * import { View, Text } from 'tamagui';
 * 
 * const customConfig = {
 *   theme: 'light',
 *   spacing: { small: 8, large: 16 }
 * };
 * 
 * function App() {
 *   return (
 *     <ReskTamaguiProvider config={customConfig}>
 *       <View>
 *         <Text>Welcome to the App</Text>
 *       </View>
 *     </ReskTamaguiProvider>
 *   );
 * }
 * ```
 * 
 * @returns {JSX.Element} A `TamaguiProvider` component with the extended or merged configuration.
 */
export function ReskTamaguiProvider({ config: customConfig, ...rest }: IReskTamaguiProviderProps) {
    /**
     * Memoizes the merged configuration between the default Tamagui configuration
     * and the custom configuration provided by the user. If no custom configuration is provided,
     * the default configuration will be used instead.
     *
     * @type {typeof defaultConfig}
     */
    const config = useMemo(() => {
        if (isObj(customConfig)) return extendObj({}, defaultConfig, customConfig) as typeof defaultConfig;
        return defaultConfig;
    }, [customConfig, defaultConfig]);

    /**
     * Renders the `TamaguiProvider` with the calculated configuration.
     * 
     * @returns {JSX.Element} The rendered `TamaguiProvider` component.
     */
    return <TamaguiProvider config={createTamagui(config)} {...rest} />;
}

/**
 * Properties for the `ReskTamaguiProvider` component.
 * 
 * This type extends `TamaguiProviderProps`, omitting the `config` property and
 * replacing it with a custom `config` that should match the type of the default configuration from Tamagui.
 * 
 * The custom configuration allows you to modify the default settings of the Tamagui provider
 * while passing the remaining props from `TamaguiProviderProps`.
 * 
 * @typeParam T - The type of the Tamagui configuration. It defaults to the type of `defaultConfig`.
 * 
 * @example
 * ```tsx
 * const customConfig = {
 *   theme: 'dark',
 *   animations: { duration: 200 }
 * };
 * 
 * const props: IReskTamaguiProviderProps = {
 *   config: customConfig,
 *   disableRootThemeClass: true
 * };
 * ```
 */
export type IReskTamaguiProviderProps = Omit<TamaguiProviderProps, 'config'> & {
    /** The configuration to override the default Tamagui configuration */
    config?: typeof defaultConfig;
};
