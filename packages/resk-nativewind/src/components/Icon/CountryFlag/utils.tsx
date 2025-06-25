import { defaultStr, isNonNullString } from "@resk/core/utils";
import Platform from "@platform";

/**
 * Converts a two-letter country code to its corresponding flag emoji using Unicode regional indicators.
 * 
 * @param {string} countryCode - A two-letter ISO 3166-1 alpha-2 country code (e.g., "US", "FR")
 * @returns {string} The corresponding emoji flag or an empty string if invalid.
 * @example
 * const flag = createEmoji("US"); // Returns "🇺🇸"
 */
export const createEmoji = (countryCode: string): string => {
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
export const isEmojiSupported = (): boolean => {
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
 * Tests if a specific emoji can be rendered.
 * 
 * @param {string} emoji - The emoji to test
 * @returns {boolean} True if the emoji can be rendered
 */
export const canRenderEmoji = (emoji?: string): boolean => {
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