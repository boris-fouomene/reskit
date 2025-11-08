import {
  defaultStr,
  isEmpty,
  isNonNullString,
  isStringNumber,
  isValidEmail,
  isValidUrl,
} from "@utils/index";
import { isNumber } from "@utils/isNumber";
import { i18n } from "../../i18n";
import { InputFormatter } from "../../inputFormatter";
import { IValidatorResult, IValidatorValidateOptions } from "../types";
import { Validator } from "../validator";

export * from "./boolean";
export * from "./enum";
export * from "./numeric";
export * from "./string";

/**
 * @function compareNumer
 *
 * Compares a numeric value against a specified value using a comparison function.
 * This function returns a promise that resolves if the comparison is valid and rejects with an error message if it is not.
 *
 * ### Parameters:
 * - **compare**: `(value: any, toCompare: any) => boolean` - A comparison function that defines the comparison logic.
 * - **message**: `string` - The error message to return if the validation fails.
 * - **options**: `IValidatorValidateOptions` - An object containing the value to validate and any rule parameters.
 *
 * ### Return Value:
 * - `IValidatorResult`: A promise that resolves to `true` if the comparison is valid, or rejects with an error message if it is not.
 *
 * ### Example Usage:
 * ```typescript
 * compareNumer((value, toCompare) => value < toCompare, "Value must be less than", { value: 5, ruleParams: [10] })
 *     .then(result => console.log(result)) // Output: true
 *     .catch(error => console.error(error)); // Output: "Value must be less than 10"
 * ```
 */
function compareNumer(
  compare: (value: any, toCompare: any) => boolean,
  translateKey: string,
  { value, ruleParams, ...rest }: IValidatorValidateOptions
): IValidatorResult {
  ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
  const rParams = ruleParams ? ruleParams : [];
  translateKey = defaultStr(translateKey);
  const message = i18n.t(translateKey, { ...rest, value, ruleParams });
  value =
    typeof value === "number"
      ? value
      : isStringNumber(value)
        ? parseFloat(value)
        : NaN;
  return new Promise((resolve, reject) => {
    if (isNaN(value) || rParams[0] === undefined) {
      return resolve(message);
    }
    const toCompare =
      typeof rParams[0] === "number"
        ? rParams[0]
        : isStringNumber(rParams[0])
          ? parseFloat(rParams[0])
          : NaN;
    if (isNaN(toCompare)) {
      return reject(message);
    }
    if (compare(value, toCompare)) {
      return resolve(true);
    }
    reject(message);
  });
}

function numberLessThanOrEquals(options: IValidatorValidateOptions<[number]>) {
  return compareNumer(
    (value, toCompare) => {
      return value <= toCompare;
    },
    "validator.numberLessThanOrEquals",
    options
  );
}

Validator.registerRule("NumberLessThanOrEquals", numberLessThanOrEquals);
/**
 * @decorator IsNumberLessThanOrEquals
 *
 * Validator rule that checks if a number is less than or equal to a specified value.
 *
 * ### Example Usage:
 * ```typescript
 *  class MyClass {
 *      @IsNumberLessThanOrEquals([5])
 *      myNumber: number;
 *  }
 * ```
 */
export const IsNumberLessThanOrEquals = Validator.createRuleDecorator<
  [param: number]
>(numberLessThanOrEquals);

function numberLessThan(options: IValidatorValidateOptions) {
  return compareNumer(
    (value, toCompare) => {
      return value < toCompare;
    },
    "validator.numberLessThan",
    options
  );
}
Validator.registerRule("NumberLessThan", numberLessThan);

/**
 * @decorator IsNumberLessThan
 *
 * Validator rule that checks if a given number is less than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 *
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 *
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is less than the specified comparison value,
 *   otherwise rejects with an error message indicating the validation failure.
 *
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @IsNumberLessThan([10])
 *     myNumber: number;
 * }
 * ```
 *
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input is strictly less than a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const IsNumberLessThan =
  Validator.createRuleDecorator<[param: number]>(numberLessThan);

function numberGreaterThanOrEquals(
  options: IValidatorValidateOptions<[number]>
) {
  return compareNumer(
    (value, toCompare) => {
      return value >= toCompare;
    },
    "validator.numberGreaterThanOrEquals",
    options
  );
}
Validator.registerRule("NumberGreaterThanOrEquals", numberGreaterThanOrEquals);

/**
 * @decorator IsNumberGreaterThanOrEquals
 *
 * Validator rule that checks if a given number is greater than or equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 *
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 *
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is greater than or equal to the specified comparison value,
 *   otherwise rejects with an error message indicating the validation failure.
 *
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @IsNumberGreaterThanOrEquals([5])
 *     myNumber: number;
 * }
 * ```
 *
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input meets or exceeds a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const IsNumberGreaterThanOrEquals = Validator.createRuleDecorator<
  [param: number]
>(numberGreaterThanOrEquals);

function numberGreaterThan(options: IValidatorValidateOptions) {
  return compareNumer(
    (value, toCompare) => {
      return value > toCompare;
    },
    "validator.numberGreaterThan",
    options
  );
}
Validator.registerRule("NumberGreaterThan", numberGreaterThan);

/**
 * @decorator IsNumberGreaterThan
 *
 * Validator rule that checks if a given number is greater than a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 *
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 *
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is greater than the specified comparison value,
 *   otherwise rejects with an error message indicating the validation failure.
 *
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @IsNumberGreaterThan([10])
 *     myNumber: number;
 * }
 * ```
 *
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input exceeds a specified limit.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const IsNumberGreaterThan =
  Validator.createRuleDecorator<[param: number]>(numberGreaterThan);

function numberEqualsTo(options: IValidatorValidateOptions<[number]>) {
  return compareNumer(
    (value, toCompare) => {
      return value === toCompare;
    },
    "validator.numberEquals",
    options
  );
}
Validator.registerRule("NumberEquals", numberEqualsTo);

/**
 * @decorator IsNumberEquals
 *
 * Validator rule that checks if a given number is equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 *
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The number to validate.
 *   - `ruleParams`: An array where the first element is the value to compare against.
 *
 * ### Return Value:
 * - `IValidatorResult`: Resolves to `true` if the value is equal to the specified comparison value,
 *   otherwise rejects with an error message indicating the validation failure.
 *
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @IsNumberEquals([10])
 *     myNumber: number;
 * }
 * ```
 *
 * ### Notes:
 * - This rule is useful for scenarios where you need to ensure that a numeric input matches a specified value exactly.
 * - The error message can be customized by modifying the second parameter of the `compareNumer` function.
 */
export const IsNumberEquals =
  Validator.createRuleDecorator<[param: number]>(numberEqualsTo);

function numberIsDifferentFromTo(options: IValidatorValidateOptions<[number]>) {
  return compareNumer(
    (value, toCompare) => {
      return value !== toCompare;
    },
    "validator.numberIsDifferentFrom",
    options
  );
}
Validator.registerRule("NumberIsDifferentFrom", numberIsDifferentFromTo);

/**
 * @decorator IsNumberIsDifferentFrom
 *
 * Validator rule that checks if a given number is not equal to a specified value.
 * This rule utilizes the `compareNumer` function to perform the comparison and return the result.
 *
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @IsNumberIsDifferentFrom([10])
 *     myNumber: number;
 * }
 * ```
 */
export const IsNumberIsDifferentFrom = Validator.createRuleDecorator<
  [param: number]
>(numberIsDifferentFromTo);

Validator.registerRule("Required", function Required(options) {
  const value = options?.value;
  return !isEmpty(value) || i18n.t("validator.required");
});

function numberHasLength({ value, ruleParams }: IValidatorValidateOptions) {
  ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
  value = defaultStr(value);
  const minLength = isNumber(ruleParams[0])
    ? ruleParams[0]
    : isStringNumber(ruleParams[0])
      ? parseFloat(ruleParams[0])
      : undefined;
  const maxLength = isNumber(ruleParams[1])
    ? ruleParams[1]
    : isStringNumber(ruleParams[1])
      ? parseFloat(ruleParams[1])
      : undefined;
  const i18nParams = { value, minLength, maxLength, length: minLength };
  const message =
    isNumber(minLength) && isNumber(maxLength)
      ? i18n.t("validator.lengthRange", i18nParams)
      : i18n.t("validator.length", i18nParams);
  if (isNumber(minLength) && isNumber(maxLength)) {
    return (value.length >= minLength && value.length <= maxLength) || message;
  }
  if (isNumber(minLength)) {
    ///on valide la longueur
    return String(value).trim().length == minLength || message;
  }
  return true;
}
Validator.registerRule("Length", numberHasLength);

/**
 * @decorator HasLength
 *
 * Validator rule that validates the length of a string. This rule checks if the length of the input string
 * falls within a specified range or matches a specific length.
 *
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where:
 *     - The first element specifies the minimum length (optional).
 *     - The second element specifies the maximum length (optional).
 *
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the string length is valid according to the specified rules;
 *   otherwise, returns an error message indicating the validation failure.
 *
 * ### Example Usage:
 * ```typescript
 *
 * class MyClass {
 *     @HasLength([3, 10]) //"This field must be between 3 and 10 characters long"
 *     myString: string;
 * }
 *
 * class MyClass {
 *     @HasLength([4]) //"This field must be exactly 4 characters long"
 *     myString: string;
 * }
 * ```
 *
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input meets specific length requirements.
 * - The error messages can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `defaultStr` utility function is used to ensure that the value is treated as a string, even if it is `null` or `undefined`.
 */
export const HasLength =
  Validator.createRuleDecorator<[minOrLength: number, maxLength?: number]>(
    numberHasLength
  );

Validator.registerRule("Email", function Email(options) {
  const value = options?.value;
  if (!value || typeof value !== "string") {
    return true;
  }
  return isValidEmail(value) || i18n.t("validator.email", options);
});

Validator.registerRule("Url", function Url(options) {
  const value = options?.value;
  return !value || typeof value !== "string"
    ? true
    : isValidUrl(value) || i18n.t("validator.url", options);
});

function minLength(options: IValidatorValidateOptions) {
  let { value, ruleParams } = options;
  ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
  const mLength = parseFloat(ruleParams[0]) || 0;
  const message = i18n.t("validator.minLength", {
    ...options,
    minLength: mLength,
  });
  return (
    isEmpty(value) ||
    (value && typeof value === "string" && String(value).length >= mLength) ||
    message
  );
}
Validator.registerRule("MinLength", minLength);

/**
 * @decorator HasMinLength
 *
 * Validator rule that checks if a given string meets a minimum length requirement.
 * This rule ensures that the input string has at least the specified number of characters.
 *
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where the first element specifies the minimum length required.
 *
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is empty or meets the minimum length requirement;
 *   otherwise, returns an error message indicating that the minimum length is not met.
 *
 * ### Example Usage:
 * ```typescript
 * class MyClass {
 *     @HasMinLength([3]) //"This field must have a minimum of 3 characters"
 *     myString: string;
 * }
 * ```
 *
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input meets a minimum length requirement.
 * - The error message can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `isEmpty` utility function is used to check for empty values, which may include `null`, `undefined`, or empty strings.
 */
export const HasMinLength =
  Validator.createRuleDecorator<[minLength: string]>(minLength);

function maxLength(options: IValidatorValidateOptions) {
  let { value, ruleParams } = options;
  ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
  const mLength = parseFloat(ruleParams[0]) || 0;
  const message = i18n.t("validator.maxLength", {
    ...options,
    maxLength: mLength,
  });
  return (
    isEmpty(value) ||
    (value && typeof value === "string" && String(value).length <= mLength) ||
    message
  );
}
Validator.registerRule("MaxLength", maxLength);

/**
 * @decorator HasMaxLength
 * 
 * Validator rule that checks if a given string does not exceed a maximum length.
 * This rule ensures that the input string has at most the specified number of characters.
 * 
 * ### Parameters:
 * - **options**: `IValidatorValidateOptions` - An object containing:
 *   - `value`: The string value to validate.
 *   - `ruleParams`: An array where the first element specifies the maximum length allowed.
 * 
 * ### Return Value:
 * - `boolean | string`: Returns `true` if the value is empty or meets the maximum length requirement; 
 *   otherwise, returns an error message indicating that the maximum length is exceeded.
 * 
 * ### Example Usage:
 * ```typescript
    import { HasMaxLength } from '@resk/core';
    class MyClass {
        @HasMaxLength([10])
        myProperty: string;
    }
 * ```
 * 
 * ### Notes:
 * - This rule is useful for validating user input in forms, ensuring that the input does not exceed a specified length.
 * - The error message can be customized based on the parameters provided, allowing for clear feedback to users.
 * - The `isEmpty` utility function is used to check for empty values, which may include `null`, `undefined`, or empty strings.
 */
export const HasMaxLength =
  Validator.createRuleDecorator<[maxLength: number]>(maxLength);

Validator.registerRule("FileName", function FileName(options) {
  const { value } = options;
  const message = i18n.t("validator.fileName", options);
  if (!isNonNullString(value)) return message;
  const rg1 = /^[^\\/:*?"<>|]+$/; // forbidden characters \ / : * ? " < > |
  const rg2 = /^\./; // cannot start with dot (.)
  const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
  return (
    (rg1.test(String(value)) && !rg2.test(value) && !rg3.test(value)) || message
  );
});

Validator.registerRule("Number", function Number(options) {
  const { value } = options;
  return typeof value === "number" || i18n.t("validator.isNumber", options);
});

Validator.registerRule("NonNullString", function NonNullString(options) {
  const { value } = options;
  return isNonNullString(value) || i18n.t("validator.isNonNullString", options);
});

function phoneNumber(options: IValidatorValidateOptions) {
  const { value, phoneCountryCode } = options;
  return (
    InputFormatter.isValidPhoneNumber(value, phoneCountryCode) ||
    i18n.t("validator.phoneNumber", options)
  );
}
Validator.registerRule("PhoneNumber", phoneNumber);

/**
 * A validator decorator to check if a phone number is valid.
 *
 * @param phoneNumber The phone number to validate.
 * @returns A validator decorator that checks if the phone number is valid.
 * @example
 * ```typescript
 * class User {
 *   @IsPhoneNumber
 *   phoneNumber: string;
 * }
 * ```
 */
export const IsPhoneNumber = Validator.createPropertyDecorator(["PhoneNumber"]);

function emailOrPhoneNumber(options: IValidatorValidateOptions) {
  const { value, phoneCountryCode } = options;
  return (
    isValidEmail(value) ||
    InputFormatter.isValidPhoneNumber(value, phoneCountryCode) ||
    i18n.t("validator.emailOrPhoneNumber", options)
  );
}
Validator.registerRule("EmailOrPhoneNumber", emailOrPhoneNumber);

/**
 * A validator decorator to check if value is a valid email or phone number.
 *
 * @param value The email or phone number to validate.
 * @returns A validator decorator that checks if the email or phone number is valid.
 * @example
 * ```typescript
 * class User {
 *   @IsEmailOrPhoneNumber
 *   emailOrPhoneNumber : string;
 * }
 * ```
 */
export const IsEmailOrPhoneNumber = Validator.createPropertyDecorator([
  "EmailOrPhoneNumber",
]);

// Nullable validation rules - allow skipping validation under specific conditions

Validator.registerRule("Empty", function Empty() {
  // This rule always passes - its presence indicates that empty string values should skip validation
  return true;
});

/**
 * ### Empty Decorator
 *
 * Marks a field as allowing empty strings, meaning validation will be skipped if the value is an empty string ("").
 * If the value is not an empty string, other validation rules will still be applied.
 *
 * @example
 * ```typescript
 * class User {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsEmpty
 *   @IsString  // Only skipped if bio is an empty string
 *   bio: string;
 * }
 * ```
 *
 * @decorator
 * @since 1.23.0
 * @public
 */
export const IsEmpty = Validator.createPropertyDecorator(["Empty"]);

Validator.registerRule("Nullable", function Nullable() {
  // This rule always passes - its presence indicates that null/undefined values should skip validation
  return true;
});

/**
 * ### Nullable Decorator
 *
 * Marks a field as nullable, meaning validation will be skipped if the value is null or undefined.
 * If the value is not null or undefined, other validation rules will still be applied.
 *
 * @example
 * ```typescript
 * class User {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsNullable
 *   @IsString  // Only skipped if bio is null or undefined
 *   bio?: string;
 * }
 * ```
 *
 * @decorator
 * @since 1.23.0
 * @public
 */
export const IsNullable = Validator.createPropertyDecorator(["Nullable"]);

Validator.registerRule("Sometimes", function Sometimes() {
  // This rule always passes - its presence indicates that undefined values should skip validation
  return true;
});

/**
 * ### Sometimes Decorator
 *
 * Marks a field as sometimes validated, meaning validation will be skipped if the value is undefined.
 * If the field is not present in the data object, validation is also skipped.
 * This is useful for optional fields that should only be validated when explicitly provided.
 *
 * @example
 * ```typescript
 * class User {
 *   @IsRequired
 *   @IsEmail
 *   email: string;
 *
 *   @IsSometimes
 *   @IsUrl  // Only validated if website is present in data and not undefined
 *   website?: string;
 * }
 * ```
 *
 * @decorator
 * @since 1.23.0
 * @public
 */
export const IsSometimes = Validator.createPropertyDecorator(["Sometimes"]);

/**
 * Ensures that all validation rules are registered.
 * This function is called to guarantee that rule registration side effects have occurred.
 */
export function ensureRulesRegistered() {
  // Rules are registered as side effects when this module is imported
  return Validator.getRules();
}
