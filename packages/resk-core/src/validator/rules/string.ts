import isNonNullString from "@utils/isNonNullString";
import { i18n } from "../../i18n";
import { IValidatorValidateOptions, IValidatorResult } from "../types";
import { Validator } from "../validator";

function _EndsWith({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.endsWithOneOf", {
        field: translatedPropertyName || fieldName,
        value,
        endings: ruleParams?.join(", ") || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "EndsWithOneOf",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }
    const endsWithAny = ruleParams.some((ending) => isNonNullString(ending) && value.endsWith(ending));
    if (endsWithAny) {
      resolve(true);
    } else {
      const message = i18n.t("validator.endsWithOneOf", {
        field: translatedPropertyName || fieldName,
        value,
        endings: ruleParams.join(", "),
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("EndsWithOneOf", _EndsWith);

/**
 * ### EndsWithOneOf Rule
 *
 * Validates that the field under validation ends with one of the given values.
 *
 * #### Parameters
 * - List of values that the field must end with
 *
 * @example
 * ```typescript
 * // Class validation
 * class FileUpload {
 *   @EndsWithOneOf(['jpg', 'png', 'gif', 'webp'])
 *   imageFile: string;
 *
 *   @EndsWithOneOf(['.com', '.org', '.net'])
 *   websiteUrl: string;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of valid ending values
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const EndsWithOneOf = Validator.createRuleDecorator<string[]>(_EndsWith);

function _StartsWith({ value, ruleParams, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.startsWithOneOf", {
        field: translatedPropertyName || fieldName,
        value,
        prefixes: ruleParams?.join(", ") || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "StartsWithOneOf",
        field: translatedPropertyName || fieldName,
        ...rest,
        ruleParams,
      });
      return reject(message);
    }

    const startsWithAny = ruleParams.some((prefix) => isNonNullString(value) && value.startsWith(prefix));

    if (startsWithAny) {
      resolve(true);
    } else {
      const message = i18n.t("validator.startsWithOneOf", {
        field: translatedPropertyName || fieldName,
        value,
        prefixes: ruleParams.join(", "),
        ...rest,
      });
      reject(message);
    }
  });
}

function _String({ value, fieldName, translatedPropertyName, ...rest }: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value === "string") {
      resolve(true);
    } else {
      const message = i18n.t("validator.string", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("String", _String);

/**
 * ### String Rule
 *
 * Validates that the field under validation is a string. If you would like to
 * allow the field to also be null, you should assign the nullable rule to the field.
 *
 * @example
 * ```typescript
 * // Class validation
 * class TextContent {
 *   @IsRequired
 *   @IsString
 *   title: String;
 *
 *   @IsString
 *   description?: String | null;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsString = Validator.createPropertyDecorator(["String"]);

declare module "../types" {
  export interface IValidatorRules {
    /**
     * ### String Rule
     *
     * Validates that the field under validation is a string. If you would like to
     * allow the field to also be null, you should assign the nullable rule to the field.
     *
     * @example
     * ```typescript
     * // Valid String values
     * await Validator.validate({
     *   value: 'Hello World',
     *   rules: ['String']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '',
     *   rules: ['String']
     * }); // ✓ Valid (empty String)
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 123,
     *   rules: ['String']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: null,
     *   rules: ['String']
     * }); // ✗ Invalid (use nullable for null support)
     *
     * // With nullable support
     * await Validator.validate({
     *   value: null,
     *   rules: ['nullable', 'String']
     * }); // ✓ Valid
     *
     * // Class validation
     * class TextContent {
     *   @Required
     *   @String
     *   title: String;
     *
     *   @String
     *   description?: String | null;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    String: IValidatorRuleFunction;

    /**
     * ### StartsWithOneOf Rule
     *
     * Validates that the field under validation starts with one of the given values.
     *
     * #### Parameters
     * - List of values that the field must start with
     *
     * @example
     * ```typescript
     * // Valid beginnings
     * await Validator.validate({
     *   value: 'https://example.com',
     *   rules: ['StartsWithOneOf[http://,https://]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: 'USER_12345',
     *   rules: ['StartsWithOneOf[USER_,ADMIN_]']
     * }); // ✓ Valid
     *
     * // Invalid example
     * await Validator.validate({
     *   value: 'ftp://example.com',
     *   rules: ['StartsWithOneOf[http://,https://]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Configuration {
     *   @StartsWithOneOf(['http://', 'https://'])
     *   apiUrl: string;
     *
     *   @StartsWithOneOf(['prod_', 'dev_', 'test_'])
     *   environment: string;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array of valid starting values
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    StartsWithOneOf: IValidatorRuleFunction;

    /**
     * ### Ends With Rule
     *
     * Validates that the field under validation ends with one of the given values.
     *
     * #### Parameters
     * - List of values that the field must end with
     *
     * @example
     * ```typescript
     * // Valid endings
     * await Validator.validate({
     *   value: 'profile.jpg',
     *   rules: ['EndsWithOneOf[jpg,png,gif]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: 'document.pdf',
     *   rules: ['EndsWithOneOf[pdf,doc,docx]']
     * }); // ✓ Valid
     *
     * // Invalid example
     * await Validator.validate({
     *   value: 'image.txt',
     *   rules: ['EndsWithOneOf[jpg,png,gif]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class FileUpload {
     *   @EndsWithOneOf(['jpg', 'png', 'gif', 'webp'])
     *   imageFile: string;
     *
     *   @EndsWithOneOf(['.com', '.org', '.net'])
     *   websiteUrl: string;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array of valid ending values
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    EndsWithOneOf: IValidatorRuleFunction;
  }
}
