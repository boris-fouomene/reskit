import React from "react";

/**
 * Checks if the provided font icon name is valid.
 *
 * @param name - The name of the font icon to validate.
 * @returns `true` if the font icon name is valid, otherwise `false`.
 */
export const isValidFontIconName = (name: string): boolean => {
    return false;
}

export default function FontIcon(props: any) {
    return null;
}


FontIcon.isValidName = isValidFontIconName;
FontIcon.getIconSet = () => ({ iconSetName: "", iconSetPrefix: "", iconName: "", iconSet: React.Fragment });
export const DEFAULT_FONT_ICON_SIZE = 20;