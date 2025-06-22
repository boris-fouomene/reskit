// DOM ARIA roles (commonly used subset)
type IDomRole =
    | 'button'
    | 'link'
    | 'heading'
    | 'text'
    | 'image'
    | 'list'
    | 'listitem'
    | 'checkbox'
    | 'radio'
    | 'textbox'
    | 'searchbox'
    | 'slider'
    | 'progressbar'
    | 'tab'
    | 'tablist'
    | 'tabpanel'
    | 'menu'
    | 'menuitem'
    | 'menubar'
    | 'dialog'
    | 'alert'
    | 'alertdialog'
    | 'banner'
    | 'navigation'
    | 'main'
    | 'contentinfo'
    | 'complementary'
    | 'region'
    | 'article'
    | 'section'
    | 'form'
    | 'group'
    | 'img'
    | 'presentation'
    | 'none';

// React Native accessibility roles
type IReactNativeRole =
    | 'none'
    | 'button'
    | 'link'
    | 'search'
    | 'image'
    | 'keyboardkey'
    | 'text'
    | 'adjustable'
    | 'imagebutton'
    | 'header'
    | 'summary'
    | 'alert'
    | 'checkbox'
    | 'combobox'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'scrollbar'
    | 'spinbutton'
    | 'switch'
    | 'tab'
    | 'tablist'
    | 'timer'
    | 'toolbar';

// Mapping from DOM roles to React Native roles
const domToRNRoleMap: Record<IDomRole, IReactNativeRole | null> = {
    'button': 'button',
    'link': 'link',
    'heading': 'header',
    'text': 'text',
    'image': 'image',
    'img': 'image',
    'list': null, // No direct equivalent
    'listitem': null, // No direct equivalent
    'checkbox': 'checkbox',
    'radio': 'radio',
    'textbox': null, // No direct equivalent, might use 'search' for search inputs
    'searchbox': 'search',
    'slider': 'adjustable',
    'progressbar': 'progressbar',
    'tab': 'tab',
    'tablist': 'tablist',
    'tabpanel': null, // No direct equivalent
    'menu': 'menu',
    'menuitem': 'menuitem',
    'menubar': 'menubar',
    'dialog': 'alert', // Closest equivalent
    'alert': 'alert',
    'alertdialog': 'alert',
    'banner': null, // No direct equivalent
    'navigation': null, // No direct equivalent
    'main': null, // No direct equivalent
    'contentinfo': null, // No direct equivalent
    'complementary': null, // No direct equivalent
    'region': null, // No direct equivalent
    'article': null, // No direct equivalent
    'section': null, // No direct equivalent
    'form': null, // No direct equivalent
    'group': 'radiogroup', // Closest for grouped elements
    'presentation': 'none',
    'none': 'none'
};

// Reverse mapping from React Native roles to DOM roles
const rnToDomRoleMap: Record<IReactNativeRole, IDomRole | null> = {
    'none': 'none',
    'button': 'button',
    'link': 'link',
    'search': 'searchbox',
    'image': 'image',
    'keyboardkey': null, // No direct DOM equivalent
    'text': 'text',
    'adjustable': 'slider',
    'imagebutton': 'button', // Closest equivalent
    'header': 'heading',
    'summary': null, // No direct equivalent
    'alert': 'alert',
    'checkbox': 'checkbox',
    'combobox': null, // No direct equivalent in this subset
    'menu': 'menu',
    'menubar': 'menubar',
    'menuitem': 'menuitem',
    'progressbar': 'progressbar',
    'radio': 'radio',
    'radiogroup': 'group',
    'scrollbar': null, // No direct equivalent
    'spinbutton': null, // No direct equivalent
    'switch': 'checkbox', // Closest equivalent
    'tab': 'tab',
    'tablist': 'tablist',
    'timer': null, // No direct equivalent
    'toolbar': null // No direct equivalent
};

/**
 * Converts a DOM ARIA role to React Native accessibility role
 * @param domRole - The DOM ARIA role to convert
 * @returns The corresponding React Native role or null if no mapping exists
 */
export function domToReactNativeRole(domRole: IDomRole): IReactNativeRole | null {
    return domToRNRoleMap[domRole] || null;
}

/**
 * Converts a React Native accessibility role to DOM ARIA role
 * @param rnRole - The React Native role to convert
 * @returns The corresponding DOM ARIA role or null if no mapping exists
 */
export function reactNativeToDomRole(rnRole: IReactNativeRole): IDomRole | null {
    return rnToDomRoleMap[rnRole] || null;
}

/**
 * Type guard to check if a string is a valid DOM role
 * @param role - String to check
 * @returns True if the string is a valid DOM role
 */
export function isDOMRole(role: string): role is IDomRole {
    return role in domToRNRoleMap;
}

/**
 * Type guard to check if a string is a valid React Native role
 * @param role - String to check
 * @returns True if the string is a valid React Native role
 */
export function isReactNativeRole(role: string): role is IReactNativeRole {
    return role in rnToDomRoleMap;
}

/**
 * Bidirectional role converter - automatically detects the input type and converts
 * @param role - The role to convert (either DOM or React Native)
 * @returns An object with both possible conversions
 */
export function convertRole(role: string): {
    toDom: IDomRole | null;
    toReactNative: IReactNativeRole | null;
    inputType: 'dom' | 'reactnative' | 'unknown';
} {
    if (isDOMRole(role)) {
        return {
            toDom: role,
            toReactNative: domToReactNativeRole(role),
            inputType: 'dom'
        };
    } else if (isReactNativeRole(role)) {
        return {
            toDom: reactNativeToDomRole(role),
            toReactNative: role,
            inputType: 'reactnative'
        };
    } else {
        return {
            toDom: null,
            toReactNative: null,
            inputType: 'unknown'
        };
    }
}