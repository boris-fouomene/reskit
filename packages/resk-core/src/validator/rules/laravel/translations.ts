/**
 * ## Laravel Validation Rules - Translation Keys
 * 
 * This file contains all translation keys and their default English messages used
 * throughout the Laravel-compatible validation rules implementation. These translations
 * provide comprehensive error messages for all validation scenarios.
 * 
 * ### Usage
 * ```typescript
 * import { laravelValidationTranslations } from './translations';
 * 
 * // Register translations with i18n system
 * i18n.addTranslations('en', laravelValidationTranslations);
 * 
 * // Or merge with existing translations
 * i18n.mergeTranslations('en', {
 *   validator: laravelValidationTranslations.validator
 * });
 * ```
 * 
 * ### Translation Parameters
 * Most translation messages support dynamic parameters:
 * - `{field}` - The field name being validated
 * - `{value}` - The actual value being validated
 * - `{rule}` - The validation rule name
 * - `{translatedPropertyName}` - The translated/display name of the field
 * 
 * @author Resk Framework Team
 * @since 1.22.0
 * @public
 */

export interface LaravelValidationTranslations {
    validator: {
        // Boolean validation messages
        accepted: string;
        acceptedIf: string;
        boolean: string;
        declined: string;
        declinedIf: string;

        // String validation messages
        alpha: string;
        alphaDash: string;
        alphaNum: string;
        ascii: string;
        confirmed: string;
        email: string;
        endsWith: string;
        startsWith: string;
        string: string;
        url: string;
        lowercase: string;
        uppercase: string;

        // Numeric validation messages
        between: string;
        decimal: string;
        integer: string;
        max: string;
        min: string;
        multipleOf: string;
        numeric: string;
        gt: string;
        gte: string;
        lt: string;
        lte: string;

        // Array validation messages
        array: string;
        arrayKeys: string;
        filled: string;
        in: string;
        notIn: string;
        required: string;
        requiredIf: string;
        size: string;
        distinct: string;

        // Conditional validation messages
        present: string;
        prohibited: string;
        prohibitedIf: string;
        prohibitedUnless: string;
        requiredUnless: string;
        requiredWith: string;
        requiredWithAll: string;
        requiredWithout: string;
        requiredWithoutAll: string;
        missing: string;
        missingIf: string;
        missingUnless: string;
        missingWith: string;
        missingWithAll: string;
        missingWithout: string;
        missingWithoutAll: string;

        // Utility validation messages
        different: string;
        same: string;
        regex: string;
        notRegex: string;
        json: string;
        hexColor: string;
        macAddress: string;
        ip: string;
        ipv4: string;
        ipv6: string;

        // Common error messages
        invalidRuleParams: string;
        invalidType: string;
        invalidCompareField: string;
        invalidRegex: string;
    };
}

/**
 * Default English translations for Laravel validation rules.
 * 
 * These messages follow Laravel's standard error message patterns and include
 * support for dynamic field names, values, and rule-specific parameters.
 */
export const laravelValidationTranslations: LaravelValidationTranslations = {
    validator: {
        // Boolean validation messages
        accepted: 'The {field} field must be accepted.',
        acceptedIf: 'The {field} field must be accepted when {otherField} is {value}.',
        boolean: 'The {field} field must be true or false.',
        declined: 'The {field} field must be declined.',
        declinedIf: 'The {field} field must be declined when {otherField} is {value}.',

        // String validation messages
        alpha: 'The {field} field must only contain letters.',
        alphaDash: 'The {field} field must only contain letters, numbers, dashes, and underscores.',
        alphaNum: 'The {field} field must only contain letters and numbers.',
        ascii: 'The {field} field must only contain single-byte alphanumeric characters and symbols.',
        confirmed: 'The {field} field confirmation does not match.',
        email: 'The {field} field must be a valid email address.',
        endsWith: 'The {field} field must end with one of the following: {values}.',
        startsWith: 'The {field} field must start with one of the following: {values}.',
        string: 'The {field} field must be a string.',
        url: 'The {field} field must be a valid URL.',
        lowercase: 'The {field} field must be lowercase.',
        uppercase: 'The {field} field must be uppercase.',

        // Numeric validation messages
        between: 'The {field} field must be between {min} and {max}.',
        decimal: 'The {field} field must have {places} decimal places.',
        integer: 'The {field} field must be an integer.',
        max: 'The {field} field must not be greater than {max}.',
        min: 'The {field} field must be at least {min}.',
        multipleOf: 'The {field} field must be a multiple of {multiple}.',
        numeric: 'The {field} field must be a number.',
        gt: 'The {field} field must be greater than {compareValue}.',
        gte: 'The {field} field must be greater than or equal to {compareValue}.',
        lt: 'The {field} field must be less than {compareValue}.',
        lte: 'The {field} field must be less than or equal to {compareValue}.',

        // Array validation messages
        array: 'The {field} field must be an array.',
        arrayKeys: 'The {field} field contains invalid keys. Allowed keys: {allowedKeys}.',
        filled: 'The {field} field must have a value.',
        in: 'The selected {field} is invalid. Must be one of: {values}.',
        notIn: 'The selected {field} is invalid. Must not be one of: {values}.',
        required: 'The {field} field is required.',
        requiredIf: 'The {field} field is required when {otherField} is {value}.',
        size: 'The {field} field must have exactly {size} items.',
        distinct: 'The {field} field has duplicate values.',

        // Conditional validation messages
        present: 'The {field} field must be present.',
        prohibited: 'The {field} field is prohibited.',
        prohibitedIf: 'The {field} field is prohibited when {otherField} is {value}.',
        prohibitedUnless: 'The {field} field is prohibited unless {otherField} is {value}.',
        requiredUnless: 'The {field} field is required unless {otherField} is one of {values}.',
        requiredWith: 'The {field} field is required when {fields} is present.',
        requiredWithAll: 'The {field} field is required when {fields} are present.',
        requiredWithout: 'The {field} field is required when {fields} is not present.',
        requiredWithoutAll: 'The {field} field is required when none of {fields} are present.',
        missing: 'The {field} field must not be present.',
        missingIf: 'The {field} field must not be present when {otherField} is {checkValue}.',
        missingUnless: 'The {field} field must not be present unless {otherField} is {allowedValue}.',
        missingWith: 'The {field} field must not be present when any of {fields} are present.',
        missingWithAll: 'The {field} field must not be present when all of {fields} are present.',
        missingWithout: 'The {field} field must not be present when any of {fields} are not present.',
        missingWithoutAll: 'The {field} field must not be present when all of {fields} are not present.',

        // Utility validation messages
        different: 'The {field} and {other} fields must be different.',
        same: 'The {field} and {other} fields must match.',
        regex: 'The {field} field format is invalid.',
        notRegex: 'The {field} field format is invalid.',
        json: 'The {field} field must be a valid JSON string.',
        hexColor: 'The {field} field must be a valid hexadecimal color.',
        macAddress: 'The {field} field must be a valid MAC address.',
        ip: 'The {field} field must be a valid IP address.',
        ipv4: 'The {field} field must be a valid IPv4 address.',
        ipv6: 'The {field} field must be a valid IPv6 address.',

        // Common error messages
        invalidRuleParams: 'Invalid parameters for {rule} rule on {field} field.',
        invalidType: 'The {field} field must be of type {expectedType}.',
        invalidCompareField: 'Invalid comparison field {compareField} for {field}.',
        invalidRegex: 'Invalid regular expression pattern for {field}: {error}.'
    }
};

/**
 * French translations for Laravel validation rules.
 * 
 * Example of how to extend translations for multiple languages.
 */
export const laravelValidationTranslationsFr: LaravelValidationTranslations = {
    validator: {
        // Boolean validation messages
        accepted: 'Le champ {field} doit être accepté.',
        acceptedIf: 'Le champ {field} doit être accepté quand {otherField} vaut {value}.',
        boolean: 'Le champ {field} doit être vrai ou faux.',
        declined: 'Le champ {field} doit être refusé.',
        declinedIf: 'Le champ {field} doit être refusé quand {otherField} vaut {value}.',

        // String validation messages
        alpha: 'Le champ {field} ne doit contenir que des lettres.',
        alphaDash: 'Le champ {field} ne doit contenir que des lettres, chiffres, tirets et underscores.',
        alphaNum: 'Le champ {field} ne doit contenir que des lettres et des chiffres.',
        ascii: 'Le champ {field} ne doit contenir que des caractères ASCII.',
        confirmed: 'La confirmation du champ {field} ne correspond pas.',
        email: 'Le champ {field} doit être une adresse email valide.',
        endsWith: 'Le champ {field} doit se terminer par une des valeurs suivantes : {values}.',
        startsWith: 'Le champ {field} doit commencer par une des valeurs suivantes : {values}.',
        string: 'Le champ {field} doit être une chaîne de caractères.',
        url: 'Le champ {field} doit être une URL valide.',
        lowercase: 'Le champ {field} doit être en minuscules.',
        uppercase: 'Le champ {field} doit être en majuscules.',

        // Numeric validation messages
        between: 'Le champ {field} doit être compris entre {min} et {max}.',
        decimal: 'Le champ {field} doit avoir {places} décimales.',
        integer: 'Le champ {field} doit être un entier.',
        max: 'Le champ {field} ne doit pas être supérieur à {max}.',
        min: 'Le champ {field} doit être au moins {min}.',
        multipleOf: 'Le champ {field} doit être un multiple de {multiple}.',
        numeric: 'Le champ {field} doit être un nombre.',
        gt: 'Le champ {field} doit être supérieur à {compareValue}.',
        gte: 'Le champ {field} doit être supérieur ou égal à {compareValue}.',
        lt: 'Le champ {field} doit être inférieur à {compareValue}.',
        lte: 'Le champ {field} doit être inférieur ou égal à {compareValue}.',

        // Array validation messages
        array: 'Le champ {field} doit être un tableau.',
        arrayKeys: 'Le champ {field} contient des clés invalides. Clés autorisées : {allowedKeys}.',
        filled: 'Le champ {field} doit avoir une valeur.',
        in: 'Le {field} sélectionné est invalide. Doit être parmi : {values}.',
        notIn: 'Le {field} sélectionné est invalide. Ne doit pas être parmi : {values}.',
        required: 'Le champ {field} est requis.',
        requiredIf: 'Le champ {field} est requis quand {otherField} vaut {value}.',
        size: 'Le champ {field} doit avoir exactement {size} éléments.',
        distinct: 'Le champ {field} a des valeurs dupliquées.',

        // Conditional validation messages
        present: 'Le champ {field} doit être présent.',
        prohibited: 'Le champ {field} est interdit.',
        prohibitedIf: 'Le champ {field} est interdit quand {otherField} vaut {value}.',
        prohibitedUnless: 'Le champ {field} est interdit sauf si {otherField} vaut {value}.',
        requiredUnless: 'Le champ {field} est requis sauf si {otherField} vaut une des valeurs {values}.',
        requiredWith: 'Le champ {field} est requis quand {fields} est présent.',
        requiredWithAll: 'Le champ {field} est requis quand {fields} sont présents.',
        requiredWithout: 'Le champ {field} est requis quand {fields} n\'est pas présent.',
        requiredWithoutAll: 'Le champ {field} est requis quand aucun de {fields} n\'est présent.',
        missing: 'Le champ {field} ne doit pas être présent.',
        missingIf: 'Le champ {field} ne doit pas être présent quand {otherField} vaut {checkValue}.',
        missingUnless: 'Le champ {field} ne doit pas être présent sauf si {otherField} vaut {allowedValue}.',
        missingWith: 'Le champ {field} ne doit pas être présent quand {fields} sont présents.',
        missingWithAll: 'Le champ {field} ne doit pas être présent quand tous {fields} sont présents.',
        missingWithout: 'Le champ {field} ne doit pas être présent quand {fields} ne sont pas présents.',
        missingWithoutAll: 'Le champ {field} ne doit pas être présent quand tous {fields} ne sont pas présents.',

        // Utility validation messages
        different: 'Les champs {field} et {other} doivent être différents.',
        same: 'Les champs {field} et {other} doivent correspondre.',
        regex: 'Le format du champ {field} est invalide.',
        notRegex: 'Le format du champ {field} est invalide.',
        json: 'Le champ {field} doit être une chaîne JSON valide.',
        hexColor: 'Le champ {field} doit être une couleur hexadécimale valide.',
        macAddress: 'Le champ {field} doit être une adresse MAC valide.',
        ip: 'Le champ {field} doit être une adresse IP valide.',
        ipv4: 'Le champ {field} doit être une adresse IPv4 valide.',
        ipv6: 'Le champ {field} doit être une adresse IPv6 valide.',

        // Common error messages
        invalidRuleParams: 'Paramètres invalides pour la règle {rule} sur le champ {field}.',
        invalidType: 'Le champ {field} doit être de type {expectedType}.',
        invalidCompareField: 'Champ de comparaison invalide {compareField} pour {field}.',
        invalidRegex: 'Expression régulière invalide pour {field} : {error}.'
    }
};

/**
 * Helper function to register Laravel validation translations with the i18n system.
 * 
 * @param language - The language code (e.g., 'en', 'fr', 'es')
 * @param translations - The translation object
 * 
 * @example
 * ```typescript
 * // Register English translations
 * registerLaravelTranslations('en', laravelValidationTranslations);
 * 
 * // Register French translations
 * registerLaravelTranslations('fr', laravelValidationTranslationsFr);
 * 
 * // Register custom translations
 * registerLaravelTranslations('es', {
 *   validator: {
 *     required: 'El campo {field} es obligatorio.',
 *     email: 'El campo {field} debe ser un email válido.',
 *     // ... other Spanish translations
 *   }
 * });
 * ```
 */
export function registerLaravelTranslations(
    language: string,
    translations: LaravelValidationTranslations
): void {
    // This would typically integrate with your i18n system
    // Example implementation:
    if (typeof window !== 'undefined' && (window as any).i18n) {
        (window as any).i18n.addTranslations(language, translations);
    }
}

/**
 * Get all available translation keys for Laravel validation rules.
 * Useful for translation management and ensuring completeness.
 */
export function getLaravelValidationKeys(): string[] {
    const keys: string[] = [];
    const traverse = (obj: any, prefix = ''): void => {
        Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                traverse(obj[key], fullKey);
            } else {
                keys.push(fullKey);
            }
        });
    };

    traverse(laravelValidationTranslations);
    return keys;
}

/**
 * Validate that a translation object has all required keys.
 * 
 * @param translations - The translation object to validate
 * @returns Array of missing keys, empty if complete
 */
export function validateTranslationCompleteness(
    translations: Partial<LaravelValidationTranslations>
): string[] {
    const requiredKeys = getLaravelValidationKeys();
    const providedKeys: string[] = [];

    const traverse = (obj: any, prefix = ''): void => {
        Object.keys(obj).forEach(key => {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                traverse(obj[key], fullKey);
            } else {
                providedKeys.push(fullKey);
            }
        });
    };

    traverse(translations);

    return requiredKeys.filter(key => !providedKeys.includes(key));
}
