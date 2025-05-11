import { isNonNullString, isValidEmail, isValidUrl } from "@resk/core/utils";
import InputFormatter from "@resk/core/inputFormatter";
/**
 * Sanitizes and formats a given href string.
 *
 * This function checks if the provided href is a non-null string and trims it.
 * It supports hrefs that start with "mailto:", "tel:", or "/", returning them as is.
 * If the href is a valid email, it prefixes it with "mailto:". If it's a valid phone number,
 * it prefixes it with "tel:". Otherwise, returns the trimmed href.
 *
 * @param {string} [href] - The href string to sanitize.
 * @returns {string} - The sanitized and potentially prefixed href.
 */
export const sanitizeHref = (href?: string) => {
    if (!isNonNullString(href) || !href.trim()) {
        href = "";
    }
    href = href.trim();
    const hrefSplit = href.split('?');
    const url = hrefSplit[0].trim();
    if (url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('/')) {
        return href;
    }
    if (isValidEmail(url)) {
        return `mailto:${href}`;
    }
    if (InputFormatter.isValidPhoneNumber(url)) {
        return `tel:${url}`;
    }
    return href;
};