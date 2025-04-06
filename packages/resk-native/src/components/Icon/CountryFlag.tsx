/**
 * @module CountryFlag
 * @description A cross-platform React Native component that displays country flags using Unicode emoji or image source retrieve from country object of @resk/core CountriesManager.
 * Compatible with both web and native platforms, with built-in platform compatibility checking.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <CountryFlag countryCode="US" />
 * 
 * // Custom size
 * <CountryFlag countryCode="FR" size={32} />
 * 
 * // With custom styles
 * <CountryFlag countryCode="JP" style={{ marginLeft: 10 }} />
 * 
 * // With fallback
 * <CountryFlag 
 *   countryCode="GB" 
 *   fallback={<Text>🏳️</Text>}
 *   onError={(error) => console.warn(error)} 
 * />
 * ```
 */

import * as React from "react";
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import Platform from "@platform";
import { CountriesManager, defaultStr, ICountryCode, isNonNullString, Logger } from '@resk/core';
import { ITextStyle } from '@src/types';
import { isImageSource } from './utils';
import Icon from './Icon';
import Label from "@components/Label";
import { hasTouchHandler } from '@utils/hasTouchHandler';
import isValidElement from '@utils/isValidElement';
/**
 * Converts a two-letter country code to its corresponding flag emoji using Unicode regional indicators.
 * 
 * @param {string} countryCode - A two-letter ISO 3166-1 alpha-2 country code (e.g., "US", "FR")
 * @returns {string} The corresponding emoji flag or an empty string if invalid.
 * @example
 * const flag = createEmoji("US"); // Returns "🇺🇸"
 */
const createEmoji = (countryCode: string): string => {
    if (!isNonNullString(countryCode)) return "";
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

/**
 * Checks if the current platform supports emoji flag display.
 * Uses modern APIs to detect Windows OS, which has limited emoji flag support.
 * 
 * @returns {boolean} True if the platform supports emoji flags
 */
const isEmojiSupported = (): boolean => {
    if (!Platform.isClientSide()) return false;
    if (Platform.isNative()) return true;
    if (typeof navigator === 'undefined' || !navigator) return false;
    // Use modern navigator.userAgentData if available
    if ('userAgentData' in navigator) {
        return !defaultStr((navigator.userAgentData as any)?.platform).toLowerCase().includes('windows');
    }
    // Fallback to user agent string parsing
    return !defaultStr(navigator.userAgent).toLowerCase().includes('windows');
};



/**
 * Props interface for the CountryFlag component.
 * 
 * @interface ICountryFlagProps
 * @property {string} countryCode - Two-letter country code (ISO 3166-1 alpha-2)
 * @property {number} [size=24] - Size of the flag emoji in pixels
 * @property {any} [style] - Additional styles for the container
 * @property {React.ReactNode} [fallback] - Fallback component when flag cannot be displayed
 * @property {(error: string) => void} [onError] - Error callback function
 */
export interface ICountryFlagProps extends TouchableOpacityProps {
    /***
     * The country code for the flag emoji.
     * This is a two-letter country code (ISO 3166-1 alpha-2) that represents the country.
     */
    countryCode: ICountryCode;
    /***
     * The size of the flag emoji in pixels.
     * This is a number that represents the desired size of the flag emoji in pixels.
     * The default value is 24.
     */
    size?: number;

    /***
     * The font size of the text when the Label is rendered.
     * This is a number that represents the font size of the text when the Label is rendered.
     * The default value is 50% of the size of the flag emoji.
     */
    textFontSize?: number;
    /***
     * The style object for the flag emoji.
     * This is an object that defines the styling properties for the flag emoji.
     */
    style?: ITextStyle;
    /***
     * The fallback content to display when the flag emoji fails to load.
     * This is a React node that represents the fallback content to display when the flag emoji fails to load.
     */
    fallback?: React.ReactNode;

    /***
     * The color of the emoji icon
     * This is a string that represents the color of the emoji icon.
     */
    textColor?: string;
}

/**
 * CountryFlag component that displays a country flag emoji.
 * 
 * @component
 * @param {ICountryFlagProps} props - Component props
 * @returns {React.ReactNode} The rendered flag or fallback component
 */
const CountryFlag = function CountryFlag({
    countryCode,
    size,
    textFontSize,
    style,
    testID,
    textColor,
    fallback,
    ...props
}: ICountryFlagProps) {
    const hasTouchable = hasTouchHandler(props);
    const Component = useMemo(() => {
        return hasTouchable ? TouchableOpacity : View;
    }, [hasTouchHandler])
    const { flagEmoji, canRender, country, imageSource } = useMemo(() => {
        const flagEmoji = canRenderEmoji('US') ? createEmoji(countryCode) : null;
        const country = CountriesManager.getCountry(countryCode);
        const imageSource = isImageSource(country?.flag) ? country?.flag : undefined;
        return { flagEmoji, canRender: !!flagEmoji, country, imageSource };
    }, [countryCode]);
    testID = defaultStr(testID, "resk-country-flag-emoji");
    size = typeof size === "number" ? size : 20;
    textFontSize = typeof textFontSize === "number" ? textFontSize : size * 0.5;
    const isValidFallback = isValidElement(fallback);
    const accessibleLabel = country?.name || countryCode;
    return (
        <Component testID={testID} {...props} style={[styles.container, style]}>
            {imageSource ?
                <Icon accessibilityLabelledBy={accessibleLabel} accessibilityLabel={accessibleLabel} size={size} testID={testID + "-image"} source={{ uri: imageSource }} /> :
                canRender || !isValidFallback ? <Label accessibilityRole={canRender ? 'image' : "text"} accessibilityLabelledBy={accessibleLabel} role={canRender ? "img" : undefined} testID={testID + "-text"} accessibilityLabel={accessibleLabel} color={textColor} style={[{ fontSize: canRender ? size : textFontSize }]}>
                    {canRender ? flagEmoji : `[${countryCode}]`}
                </Label> : fallback
            }
        </Component>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    }
});

/**
 * Tests if a specific emoji can be rendered.
 * 
 * @param {string} emoji - The emoji to test
 * @returns {boolean} True if the emoji can be rendered
 */
const canRenderEmoji = (emoji?: string): boolean => {
    if (Platform.isNative()) return true;
    if (!Platform.isWeb() || !isNonNullString(emoji) || !Platform.isTouchDevice()) return false;
    //const flag = "🇨🇲"; // Example: Cameroon
    //if (flag == "🇨🇲") return true;
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';
        ctx.font = '50px sans-serif';
        ctx.fillText(emoji, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        return pixels.some(pixel => pixel !== 0);
    } catch (e) {
        return false;
    }
};

CountryFlag.isEmojiSupported = isEmojiSupported;
CountryFlag.createEmoji = createEmoji;
CountryFlag.canRenderEmoji = canRenderEmoji;

export default CountryFlag;

CountryFlag.displayName = "Country.CountryFlag";