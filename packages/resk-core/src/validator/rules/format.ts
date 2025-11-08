import { i18n } from "../../i18n";
import { IValidatorResult, IValidatorValidateOptions } from "../types";
import { Validator } from "../validator";

function _UUID({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.uuid", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(value)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.uuid", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("UUID", _UUID);

/**
 * ### UUID Rule
 *
 * Validates that the field under validation is a valid UUID (v1-v5).
 *
 * @example
 * ```typescript
 * // Class validation
 * class Entity {
 *   @IsRequired
 *   @IsUUID
 *   id: string;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsUUID = Validator.createPropertyDecorator(["UUID"]);

function _JSON({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.json", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    try {
      JSON.parse(value);
      resolve(true);
    } catch (error) {
      const message = i18n.t("validator.json", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("JSON", _JSON);

/**
 * ### JSON Rule
 *
 * Validates that the field under validation is valid JSON.
 *
 * @example
 * ```typescript
 * // Class validation
 * class Config {
 *   @IsRequired
 *   @IsJSON
 *   settings: string;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsJSON = Validator.createPropertyDecorator(["JSON"]);

function _Base64({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.base64", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const base64Regex =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (base64Regex.test(value)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.base64", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("Base64", _Base64);

/**
 * ### Base64 Rule
 *
 * Validates that the field under validation is valid Base64 encoded string.
 *
 * @example
 * ```typescript
 * // Class validation
 * class ImageData {
 *   @IsRequired
 *   @IsBase64
 *   data: string;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsBase64 = Validator.createPropertyDecorator(["Base64"]);

function _HexColor({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.hexColor", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    // Supports #RGB, #RRGGBB, #RRGGBBAA formats
    const hexColorRegex =
      /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    if (hexColorRegex.test(value)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.hexColor", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("HexColor", _HexColor);

/**
 * ### HexColor Rule
 *
 * Validates that the field under validation is a valid hexadecimal color code.
 *
 * @example
 * ```typescript
 * // Class validation
 * class Theme {
 *   @IsRequired
 *   @IsHexColor
 *   primaryColor: string;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsHexColor = Validator.createPropertyDecorator(["HexColor"]);

function _CreditCard({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.creditCard", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    // Remove spaces and dashes
    const cleanValue = value.replace(/[\s-]/g, "");

    // Check if it's all digits and length is between 13-19
    if (!/^\d{13,19}$/.test(cleanValue)) {
      const message = i18n.t("validator.creditCard", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleanValue.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanValue.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    if (sum % 10 === 0) {
      resolve(true);
    } else {
      const message = i18n.t("validator.creditCard", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("CreditCard", _CreditCard);

/**
 * ### CreditCard Rule
 *
 * Validates that the field under validation is a valid credit card number using Luhn algorithm.
 *
 * @example
 * ```typescript
 * // Class validation
 * class Payment {
 *   @IsRequired
 *   @IsCreditCard
 *   cardNumber: string;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsCreditCard = Validator.createPropertyDecorator(["CreditCard"]);

function _IP({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.ip", {
        field: translatedPropertyName || fieldName,
        value,
        version: ruleParams?.[0] || "4/6",
        ...rest,
      });
      return reject(message);
    }

    const version = ruleParams?.[0] || "4/6";
    let ipRegex: RegExp;

    switch (version) {
      case "4":
        ipRegex =
          /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        break;
      case "6":
        ipRegex =
          /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        break;
      default: // 4/6
        const ipv4Regex =
          /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex =
          /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        ipRegex = new RegExp(`(?:${ipv4Regex.source})|(?:${ipv6Regex.source})`);
        break;
    }

    if (ipRegex.test(value)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.ip", {
        field: translatedPropertyName || fieldName,
        value,
        version,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("IP", _IP);

/**
 * ### IP Rule
 *
 * Validates that the field under validation is a valid IP address.
 *
 * #### Parameters
 * - IP version: "4", "6", or "4/6" (default: "4/6")
 *
 * @example
 * ```typescript
 * // Class validation
 * class Server {
 *   @IP(['4']) // IPv4 only
 *   ipv4Address: string;
 *
 *   @IP(['6']) // IPv6 only
 *   ipv6Address: string;
 *
 *   @IP() // IPv4 or IPv6
 *   ipAddress: string;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing IP version ("4", "6", or "4/6")
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IP = Validator.createRuleDecorator<string[]>(_IP);

function _MACAddress({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.macAddress", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    // Supports formats: XX:XX:XX:XX:XX:XX, XX-XX-XX-XX-XX-XX, XXXXXXXXXXXX
    const macRegex =
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9A-Fa-f]{12})$/;
    if (macRegex.test(value)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.macAddress", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("MACAddress", _MACAddress);

/**
 * ### MACAddress Rule
 *
 * Validates that the field under validation is a valid MAC address.
 *
 * @example
 * ```typescript
 * // Class validation
 * class NetworkDevice {
 *   @IsRequired
 *   @IsMACAddress
 *   macAddress: string;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsMACAddress = Validator.createPropertyDecorator(["MACAddress"]);

function _Regex({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (typeof value !== "string") {
      const message = i18n.t("validator.regex", {
        field: translatedPropertyName || fieldName,
        value,
        pattern: ruleParams?.[0] || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0 || !ruleParams[0]) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "Regex",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    try {
      const regex = new RegExp(ruleParams[0]);
      if (regex.test(value)) {
        resolve(true);
      } else {
        const message = i18n.t("validator.regex", {
          field: translatedPropertyName || fieldName,
          value,
          pattern: ruleParams[0],
          ...rest,
        });
        reject(message);
      }
    } catch (error) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "Regex",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("Regex", _Regex);

/**
 * ### Regex Rule
 *
 * Validates that the field under validation matches the specified regular expression.
 *
 * #### Parameters
 * - Regular expression pattern (string)
 *
 * @example
 * ```typescript
 * // Class validation
 * class CustomFormat {
 *   @Regex(['^[A-Z]{2}\\d{4}$']) // Two letters followed by 4 digits
 *   customCode: string;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing regex pattern
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const Regex = Validator.createRuleDecorator<string[]>(_Regex);

declare module "../types" {
  export interface IValidatorRules<
    ParamType extends Array<any> = Array<any>,
    Context = unknown,
  > {
    /**
     * ### UUID Rule
     *
     * Validates that the field under validation is a valid UUID (v1-v5).
     *
     * @example
     * ```typescript
     * // Valid UUIDs
     * await Validator.validate({
     *   value: '550e8400-e29b-41d4-a716-446655440000',
     *   rules: ['UUID']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
     *   rules: ['UUID']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 'not-a-uuid',
     *   rules: ['UUID']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '550e8400-e29b-41d4-a716', // Too short
     *   rules: ['UUID']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 123,
     *   rules: ['UUID']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Entity {
     *   @Required
     *   @UUID
     *   id: string;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    UUID: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### JSON Rule
     *
     * Validates that the field under validation is valid JSON.
     *
     * @example
     * ```typescript
     * // Valid JSON strings
     * await Validator.validate({
     *   value: '{"name": "John", "age": 30}',
     *   rules: ['JSON']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '[1, 2, 3]',
     *   rules: ['JSON']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: '{"name": "John", "age": }', // Invalid JSON
     *   rules: ['JSON']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 123,
     *   rules: ['JSON']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Config {
     *   @Required
     *   @JSON
     *   settings: string;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    JSON: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### Base64 Rule
     *
     * Validates that the field under validation is valid Base64 encoded string.
     *
     * @example
     * ```typescript
     * // Valid Base64 strings
     * await Validator.validate({
     *   value: 'SGVsbG8gV29ybGQ=', // "Hello World"
     *   rules: ['Base64']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: 'dGVzdA==', // "test"
     *   rules: ['Base64']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 'not-base64!',
     *   rules: ['Base64']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 123,
     *   rules: ['Base64']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class ImageData {
     *   @Required
     *   @Base64
     *   data: string;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    Base64: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### HexColor Rule
     *
     * Validates that the field under validation is a valid hexadecimal color code.
     *
     * @example
     * ```typescript
     * // Valid hex colors
     * await Validator.validate({
     *   value: '#FF0000',
     *   rules: ['HexColor']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '#3366cc',
     *   rules: ['HexColor']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '#abc', // Short format
     *   rules: ['HexColor']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '#FF000080', // With alpha
     *   rules: ['HexColor']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: '#GGG', // Invalid characters
     *   rules: ['HexColor']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '#12', // Too short
     *   rules: ['HexColor']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 123,
     *   rules: ['HexColor']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Theme {
     *   @Required
     *   @HexColor
     *   primaryColor: string;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    HexColor: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### CreditCard Rule
     *
     * Validates that the field under validation is a valid credit card number using Luhn algorithm.
     *
     * @example
     * ```typescript
     * // Valid credit card numbers
     * await Validator.validate({
     *   value: '4532015112830366', // Visa test number
     *   rules: ['CreditCard']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '4532-0151-1283-0366', // With dashes
     *   rules: ['CreditCard']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: '4532015112830367', // Invalid checksum
     *   rules: ['CreditCard']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '123',
     *   rules: ['CreditCard']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 4532015112830366,
     *   rules: ['CreditCard']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Payment {
     *   @Required
     *   @CreditCard
     *   cardNumber: string;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    CreditCard: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### IP Rule
     *
     * Validates that the field under validation is a valid IP address.
     *
     * #### Parameters
     * - IP version: "4", "6", or "4/6" (default: "4/6")
     *
     * @example
     * ```typescript
     * // Valid IP addresses
     * await Validator.validate({
     *   value: '192.168.1.1',
     *   rules: ['IP[4]']
     * }); // ✓ Valid IPv4
     *
     * await Validator.validate({
     *   value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
     *   rules: ['IP[6]']
     * }); // ✓ Valid IPv6
     *
     * await Validator.validate({
     *   value: '192.168.1.1',
     *   rules: ['IP'] // Default allows both
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: '256.1.1.1', // Invalid IPv4
     *   rules: ['IP[4]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '192.168.1.1',
     *   rules: ['IP[6]'] // IPv4 not valid for IPv6 only
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 123,
     *   rules: ['IP']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Server {
     *   @IP(['4']) // IPv4 only
     *   ipv4Address: string;
     *
     *   @IP(['6']) // IPv6 only
     *   ipv6Address: string;
     *
     *   @IP() // IPv4 or IPv6
     *   ipAddress: string;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing IP version ("4", "6", or "4/6")
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    IP: IValidatorRuleFunction<string[], Context>;

    /**
     * ### MACAddress Rule
     *
     * Validates that the field under validation is a valid MAC address.
     *
     * @example
     * ```typescript
     * // Valid MAC addresses
     * await Validator.validate({
     *   value: '00:1B:44:11:3A:B7',
     *   rules: ['MACAddress']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '00-1B-44-11-3A-B7',
     *   rules: ['MACAddress']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '001B44113AB7',
     *   rules: ['MACAddress']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: '00:1B:44:11:3A', // Too short
     *   rules: ['MACAddress']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 'GG:1B:44:11:3A:B7', // Invalid characters
     *   rules: ['MACAddress']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 123,
     *   rules: ['MACAddress']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class NetworkDevice {
     *   @Required
     *   @MACAddress
     *   macAddress: string;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    MACAddress: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### Regex Rule
     *
     * Validates that the field under validation matches the specified regular expression.
     *
     * #### Parameters
     * - Regular expression pattern (string)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: 'ABC1234',
     *   rules: ['Regex[^[A-Z]{3}\\d{4}$]']
     * }); // ✓ Valid (3 letters + 4 digits)
     *
     * await Validator.validate({
     *   value: 'user@example.com',
     *   rules: ['Regex[^\\S+@\\S+\\.\\S+$]']
     * }); // ✓ Valid email pattern
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 'abc123',
     *   rules: ['Regex[^[A-Z]{3}\\d{4}$]']
     * }); // ✗ Invalid (lowercase letters)
     *
     * await Validator.validate({
     *   value: 'invalid-pattern(',
     *   rules: ['Regex[(]'] // Invalid regex
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 123,
     *   rules: ['Regex[\\d+]']
     * }); // ✗ Invalid (not a string)
     *
     * // Class validation
     * class CustomFormat {
     *   @Regex(['^[A-Z]{2}\\d{4}$']) // Two letters followed by 4 digits
     *   customCode: string;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing regex pattern
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    Regex: IValidatorRuleFunction<string[], Context>;
  }
}
