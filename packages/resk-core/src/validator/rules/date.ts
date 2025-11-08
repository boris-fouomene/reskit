import { i18n } from "../../i18n";
import { IValidatorResult, IValidatorValidateOptions } from "../types";
import { Validator } from "../validator";

function _Date({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      resolve(true);
    } else if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        resolve(true);
      } else {
        const message = i18n.t("validator.date", {
          field: translatedPropertyName || fieldName,
          value,
          ...rest,
        });
        reject(message);
      }
    } else {
      const message = i18n.t("validator.date", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("Date", _Date);

/**
 * ### Date Rule
 *
 * Validates that the field under validation is a valid date.
 *
 * @example
 * ```typescript
 * // Class validation
 * class Event {
 *   @IsRequired
 *   @IsDate
 *   eventDate: Date;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsDate = Validator.createPropertyDecorator(["Date"]);

function _DateAfter({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<string[] | Date[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (
      !value ||
      (!(value instanceof Date) &&
        typeof value !== "string" &&
        typeof value !== "number")
    ) {
      const message = i18n.t("validator.dateAfter", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams?.[0] || "",
        ...rest,
      });
      return reject(message);
    }

    const valueDate = value instanceof Date ? value : new Date(value);
    if (isNaN(valueDate.getTime())) {
      const message = i18n.t("validator.dateAfter", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams?.[0] || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateAfter",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const compareDate =
      ruleParams[0] instanceof Date ? ruleParams[0] : new Date(ruleParams[0]);
    if (isNaN(compareDate.getTime())) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateAfter",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    if (valueDate > compareDate) {
      resolve(true);
    } else {
      const message = i18n.t("validator.dateAfter", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams[0],
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("DateAfter", _DateAfter);

/**
 * ### DateAfter Rule
 *
 * Validates that the date is after the specified date.
 *
 * #### Parameters
 * - Date to compare against (Date object, ISO string, or timestamp)
 *
 * @example
 * ```typescript
 * // Class validation
 * class Event {
 *   @DateAfter(new Date('2024-01-01'))
 *   eventDate: Date;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing the date to compare against
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const DateAfter = Validator.createRuleDecorator<string[] | Date[]>(
  _DateAfter
);

function _DateBefore({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<string[] | Date[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (
      !value ||
      (!(value instanceof Date) &&
        typeof value !== "string" &&
        typeof value !== "number")
    ) {
      const message = i18n.t("validator.dateBefore", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams?.[0] || "",
        ...rest,
      });
      return reject(message);
    }

    const valueDate = value instanceof Date ? value : new Date(value);
    if (isNaN(valueDate.getTime())) {
      const message = i18n.t("validator.dateBefore", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams?.[0] || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateBefore",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const compareDate =
      ruleParams[0] instanceof Date ? ruleParams[0] : new Date(ruleParams[0]);
    if (isNaN(compareDate.getTime())) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateBefore",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    if (valueDate < compareDate) {
      resolve(true);
    } else {
      const message = i18n.t("validator.dateBefore", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams[0],
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("DateBefore", _DateBefore);

/**
 * ### DateBefore Rule
 *
 * Validates that the date is before the specified date.
 *
 * #### Parameters
 * - Date to compare against (Date object, ISO string, or timestamp)
 *
 * @example
 * ```typescript
 * // Class validation
 * class Deadline {
 *   @DateBefore(new Date('2024-12-31'))
 *   submissionDate: Date;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing the date to compare against
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const DateBefore = Validator.createRuleDecorator<string[] | Date[]>(
  _DateBefore
);

function _DateBetween({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<(string | Date)[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (
      !value ||
      (!(value instanceof Date) &&
        typeof value !== "string" &&
        typeof value !== "number")
    ) {
      const message = i18n.t("validator.dateBetween", {
        field: translatedPropertyName || fieldName,
        value,
        startDate: ruleParams?.[0] || "",
        endDate: ruleParams?.[1] || "",
        ...rest,
      });
      return reject(message);
    }

    const valueDate = value instanceof Date ? value : new Date(value);
    if (isNaN(valueDate.getTime())) {
      const message = i18n.t("validator.dateBetween", {
        field: translatedPropertyName || fieldName,
        value,
        startDate: ruleParams?.[0] || "",
        endDate: ruleParams?.[1] || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length < 2) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateBetween",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const startDate =
      ruleParams[0] instanceof Date ? ruleParams[0] : new Date(ruleParams[0]);
    const endDate =
      ruleParams[1] instanceof Date ? ruleParams[1] : new Date(ruleParams[1]);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateBetween",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    if (valueDate >= startDate && valueDate <= endDate) {
      resolve(true);
    } else {
      const message = i18n.t("validator.dateBetween", {
        field: translatedPropertyName || fieldName,
        value,
        startDate: ruleParams[0],
        endDate: ruleParams[1],
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("DateBetween", _DateBetween);

/**
 * ### DateBetween Rule
 *
 * Validates that the date is between the specified start and end dates (inclusive).
 *
 * #### Parameters
 * - Start date (Date object, ISO string, or timestamp)
 * - End date (Date object, ISO string, or timestamp)
 *
 * @example
 * ```typescript
 * // Class validation
 * class Vacation {
 *   @DateBetween(new Date('2024-01-01'), new Date('2024-12-31'))
 *   vacationDate: Date;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing start date and end date
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const DateBetween =
  Validator.createRuleDecorator<(string | Date)[]>(_DateBetween);

function _DateEquals({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<string[] | Date[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (
      !value ||
      (!(value instanceof Date) &&
        typeof value !== "string" &&
        typeof value !== "number")
    ) {
      const message = i18n.t("validator.dateEquals", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams?.[0] || "",
        ...rest,
      });
      return reject(message);
    }

    const valueDate = value instanceof Date ? value : new Date(value);
    if (isNaN(valueDate.getTime())) {
      const message = i18n.t("validator.dateEquals", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams?.[0] || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateEquals",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const compareDate =
      ruleParams[0] instanceof Date ? ruleParams[0] : new Date(ruleParams[0]);
    if (isNaN(compareDate.getTime())) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "DateEquals",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    // Compare dates by setting time to start of day for date-only comparison
    const valueStartOfDay = new Date(
      valueDate.getFullYear(),
      valueDate.getMonth(),
      valueDate.getDate()
    );
    const compareStartOfDay = new Date(
      compareDate.getFullYear(),
      compareDate.getMonth(),
      compareDate.getDate()
    );

    if (valueStartOfDay.getTime() === compareStartOfDay.getTime()) {
      resolve(true);
    } else {
      const message = i18n.t("validator.dateEquals", {
        field: translatedPropertyName || fieldName,
        value,
        date: ruleParams[0],
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("DateEquals", _DateEquals);

/**
 * ### DateEquals Rule
 *
 * Validates that the date equals the specified date (compares date part only, ignores time).
 *
 * #### Parameters
 * - Date to compare against (Date object, ISO string, or timestamp)
 *
 * @example
 * ```typescript
 * // Class validation
 * class Birthday {
 *   @DateEquals(new Date('1990-01-01'))
 *   birthDate: Date;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing the date to compare against
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const DateEquals = Validator.createRuleDecorator<string[] | Date[]>(
  _DateEquals
);

function _FutureDate({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (
      !value ||
      (!(value instanceof Date) &&
        typeof value !== "string" &&
        typeof value !== "number")
    ) {
      const message = i18n.t("validator.futureDate", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const valueDate = value instanceof Date ? value : new Date(value);
    if (isNaN(valueDate.getTime())) {
      const message = i18n.t("validator.futureDate", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const now = new Date();
    if (valueDate > now) {
      resolve(true);
    } else {
      const message = i18n.t("validator.futureDate", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("FutureDate", _FutureDate);

/**
 * ### FutureDate Rule
 *
 * Validates that the date is in the future.
 *
 * @example
 * ```typescript
 * // Class validation
 * class Appointment {
 *   @FutureDate
 *   appointmentDate: Date;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const FutureDate = Validator.createPropertyDecorator(["FutureDate"]);

function _PastDate({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (
      !value ||
      (!(value instanceof Date) &&
        typeof value !== "string" &&
        typeof value !== "number")
    ) {
      const message = i18n.t("validator.pastDate", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const valueDate = value instanceof Date ? value : new Date(value);
    if (isNaN(valueDate.getTime())) {
      const message = i18n.t("validator.pastDate", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const now = new Date();
    if (valueDate < now) {
      resolve(true);
    } else {
      const message = i18n.t("validator.pastDate", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("PastDate", _PastDate);

/**
 * ### PastDate Rule
 *
 * Validates that the date is in the past.
 *
 * @example
 * ```typescript
 * // Class validation
 * class HistoricalEvent {
 *   @PastDate
 *   eventDate: Date;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const PastDate = Validator.createPropertyDecorator(["PastDate"]);

declare module "../types" {
  export interface IValidatorRules<
    ParamType extends Array<any> = Array<any>,
    Context = unknown,
  > {
    /**
     * ### Date Rule
     *
     * Validates that the field under validation is a valid date.
     *
     * @example
     * ```typescript
     * // Valid dates
     * await Validator.validate({
     *   value: new Date(),
     *   rules: ['Date']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '2024-01-01',
     *   rules: ['Date']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: 1640995200000,
     *   rules: ['Date']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 'invalid-date',
     *   rules: ['Date']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: null,
     *   rules: ['Date']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Event {
     *   @Required
     *   @Date
     *   eventDate: Date;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    Date: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### DateAfter Rule
     *
     * Validates that the date is after the specified date.
     *
     * #### Parameters
     * - Date to compare against (Date object, ISO string, or timestamp)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: new Date('2024-01-02'),
     *   rules: ['DateAfter[2024-01-01]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '2024-06-15',
     *   rules: ['DateAfter[2024-01-01]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: new Date('2023-12-31'),
     *   rules: ['DateAfter[2024-01-01]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '2024-01-01',
     *   rules: ['DateAfter[2024-01-01]']
     * }); // ✗ Invalid (not strictly after)
     *
     * // Class validation
     * class Event {
     *   @DateAfter(new Date('2024-01-01'))
     *   eventDate: Date;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing the date to compare against
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    DateAfter: IValidatorRuleFunction<string[] | Date[], Context>;

    /**
     * ### DateBefore Rule
     *
     * Validates that the date is before the specified date.
     *
     * #### Parameters
     * - Date to compare against (Date object, ISO string, or timestamp)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: new Date('2023-12-31'),
     *   rules: ['DateBefore[2024-01-01]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '2023-06-15',
     *   rules: ['DateBefore[2024-01-01]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: new Date('2024-01-02'),
     *   rules: ['DateBefore[2024-01-01]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '2024-01-01',
     *   rules: ['DateBefore[2024-01-01]']
     * }); // ✗ Invalid (not strictly before)
     *
     * // Class validation
     * class Deadline {
     *   @DateBefore(new Date('2024-12-31'))
     *   submissionDate: Date;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing the date to compare against
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    DateBefore: IValidatorRuleFunction<string[] | Date[], Context>;

    /**
     * ### DateBetween Rule
     *
     * Validates that the date is between the specified start and end dates (inclusive).
     *
     * #### Parameters
     * - Start date (Date object, ISO string, or timestamp)
     * - End date (Date object, ISO string, or timestamp)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: new Date('2024-06-15'),
     *   rules: ['DateBetween[2024-01-01,2024-12-31]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '2024-01-01',
     *   rules: ['DateBetween[2024-01-01,2024-12-31]']
     * }); // ✓ Valid (inclusive)
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: new Date('2023-12-31'),
     *   rules: ['DateBetween[2024-01-01,2024-12-31]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '2025-01-01',
     *   rules: ['DateBetween[2024-01-01,2024-12-31]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Vacation {
     *   @DateBetween(new Date('2024-01-01'), new Date('2024-12-31'))
     *   vacationDate: Date;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing start date and end date
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    DateBetween: IValidatorRuleFunction<(string | Date)[], Context>;

    /**
     * ### DateEquals Rule
     *
     * Validates that the date equals the specified date (compares date part only, ignores time).
     *
     * #### Parameters
     * - Date to compare against (Date object, ISO string, or timestamp)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: new Date('2024-01-01T10:30:00'),
     *   rules: ['DateEquals[2024-01-01]']
     * }); // ✓ Valid (time ignored)
     *
     * await Validator.validate({
     *   value: '2024-01-01',
     *   rules: ['DateEquals[2024-01-01]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: new Date('2024-01-02'),
     *   rules: ['DateEquals[2024-01-01]']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: '2024-01-01T10:30:00',
     *   rules: ['DateEquals[2024-01-02]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Birthday {
     *   @DateEquals(new Date('1990-01-01'))
     *   birthDate: Date;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing the date to compare against
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    DateEquals: IValidatorRuleFunction<string[] | Date[], Context>;

    /**
     * ### FutureDate Rule
     *
     * Validates that the date is in the future.
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: new Date(Date.now() + 86400000), // Tomorrow
     *   rules: ['FutureDate']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '2025-01-01',
     *   rules: ['FutureDate']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: new Date(Date.now() - 86400000), // Yesterday
     *   rules: ['FutureDate']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: new Date(), // Now
     *   rules: ['FutureDate']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class Appointment {
     *   @FutureDate
     *   appointmentDate: Date;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    FutureDate: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### PastDate Rule
     *
     * Validates that the date is in the past.
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: new Date(Date.now() - 86400000), // Yesterday
     *   rules: ['PastDate']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: '2020-01-01',
     *   rules: ['PastDate']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: new Date(Date.now() + 86400000), // Tomorrow
     *   rules: ['PastDate']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: new Date(), // Now
     *   rules: ['PastDate']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class HistoricalEvent {
     *   @PastDate
     *   eventDate: Date;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    PastDate: IValidatorRuleFunction<ParamType, Context>;
  }
}
