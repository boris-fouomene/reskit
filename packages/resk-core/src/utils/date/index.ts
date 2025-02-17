import { isBoolean, isNumber } from "lodash";
import isNonNullString from "../isNonNullString";
import moment from 'moment';
import { i18n } from "../../i18n";
import isDateObj from "../isDateObj";
import isEmpty from "../isEmpty";
import defaultStr from "../defaultStr";
import { IMomentFormat } from "../../types";

export { isDateObj };
/**
 * Global interface extension for the Date object.
 * 
 * This extension adds several utility methods to the Date object for formatting and manipulating dates.
 */
declare global {
    interface Date {
        /**
         * Returns the date in SQL date format (YYYY-MM-DD).
         * 
         * @returns The date in SQL date format.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.toSQLDateFormat()); // Output: YYYY-MM-DD
         * ```
         */
        toSQLDateFormat: () => string;

        /**
         * Returns the date in SQL datetime format (YYYY-MM-DD HH:MM:SS).
         * 
         * @returns The date in SQL datetime format.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.toSQLDateTimeFormat()); // Output: YYYY-MM-DD HH:MM:SS
         * ```
         */
        toSQLDateTimeFormat: () => string;

        /**
         * Returns the date in SQL time format (HH:MM:SS).
         * 
         * @returns The date in SQL time format.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.toSQLTimeFormat()); // Output: HH:MM:SS
         * ```
         */
        toSQLTimeFormat: () => string;

        /**
         * Resets the hours of the date to 0.
         * 
         * @returns The date with hours reset to 0.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.resetHours()); // Output: Date with hours reset to 0
         * ```
         */
        resetHours: () => Date;

        /**
         * Resets the minutes of the date to 0.
         * 
         * @returns The date with minutes reset to 0.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.resetMinutes()); // Output: Date with minutes reset to 0
         * ```
         */
        resetMinutes: () => Date;

        /**
         * Resets the seconds of the date to 0.
         * 
         * @returns The date with seconds reset to 0.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.resetSeconds()); // Output: Date with seconds reset to 0
         * ```
         */
        resetSeconds: () => Date;

        /**
         * Resets the hours, minutes, and seconds of the date to 0.
         * 
         * @returns The date with hours, minutes, and seconds reset to 0.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.resetHours2Minutes2Seconds()); // Output: Date with hours, minutes, and seconds reset to 0
         * ```
         */
        resetHours2Minutes2Seconds: () => Date;

        /**
         * Adds a specified number of years to the date.
         * 
         * @param years The number of years to add.
         * @returns The date with the specified number of years added.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.addYears(1)); // Output: Date with 1 year added
         * ```
         */
        addYears: (years: number) => Date;

        /**
         * Adds a specified number of months to the date.
         * 
         * @param months The number of months to add.
         * @returns The date with the specified number of months added.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.addMonths(1)); // Output: Date with 1 month added
         * ```
         */
        addMonths: (months: number) => Date;

        /**
         * Adds a specified number of minutes to the date.
         * 
         * @param minutes The number of minutes to add.
         * @returns The date with the specified number of minutes added.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.addMinutes(1)); // Output: Date with 1 minute added
         * ```
         */
        addMinutes: (minutes: number) => Date;

        /**
         * Adds a specified number of seconds to the date.
         * 
         * @param seconds The number of seconds to add.
         * @returns The date with the specified number of seconds added.
         * 
        Example:
         * ```ts
         * const date = new Date();
         * console.log(date.addSeconds(1)); // Output: Date with 1 second added
         * ```
         */
        addSeconds: (seconds: number) => Date;

        /**
         * Adds a specified number of days to the date.
         * 
         * @param days The number of days to add.
         * @returns The date with the specified number of days added.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.addDays(1)); // Output: Date with 1 day added
         * ```
         */
        addDays: (days: number) => Date;

        /**
         * Adds a specified number of weeks to the date.
         * 
         * @param weeks The number of weeks to add.
         * @returns The date with the specified number of weeks added.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.addWeeks(1)); // Output: Date with 1 week added
         * ```
         */
        addWeeks: (weeks: number) => Date;

        /**
         * Adds a specified number of hours to the date.
         * 
         * @param hours The number of hours to add.
         * @returns The date with the specified number of hours added.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.addHours(1)); // Output: Date with 1 hour added
         * ```
         */
        addHours: (hours: number) => Date;

        /**
         * Formats the date according to a specified format string.
         * 
         * @param format The format string to use.
         * @returns The formatted date string.
         * 
         * Example:
         * ```ts
         * const date = new Date();
         * console.log(date.toFormat("YYYY-MM-DD HH:mm:ss")); // Output: Formatted date string
         * ```
         */
        toFormat: (format?: IMomentFormat) => string;
    }
}


/**
 * Converts a date to SQL datetime format.
 * 
 * @param {Date} datetime The date to convert.
 * @returns {string} The date in SQL datetime format, or an empty string if the date is not valid.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(dateToSQLDateTimeFormat(date)); // Output: YYYY-MM-DD HH:MM:SS
 * console.log(dateToSQLDateTimeFormat(null)); // Output: ""
 * ```
 */
export function dateToSQLDateTimeFormat(datetime: Date): string {
    /**
     * If the date is not a valid date object, return an empty string.
     * 
     * This check ensures that the function returns a consistent result for invalid inputs.
     */
    if (!isDateObj(datetime)) {
        return "";
    }

    /**
     * Extract the year, month, day, hours, minutes, and seconds from the date object.
     * 
     * These values are used to construct the SQL datetime string.
     */
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');
    const seconds = String(datetime.getSeconds()).padStart(2, '0');

    /**
     * Format the date as a SQL datetime string.
     * 
     * The format is YYYY-MM-DD HH:MM:SS, which is a standard format for SQL datetime values.
     */
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


/**
 * Converts a date to SQL date format.
 * 
 * @param {Date} datetime The date to convert.
 * @returns {string} The date in SQL date format, or an empty string if the date is not valid.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(dateToSQLFormat(date)); // Output: YYYY-MM-DD
 * console.log(dateToSQLFormat(null)); // Output: ""
 * ```
 */
export function dateToSQLFormat(datetime: Date): string {
    /**
     * If the date is not a valid date object, return an empty string.
     * 
     * This check ensures that the function returns a consistent result for invalid inputs.
     */
    if (!isDateObj(datetime)) return "";

    /**
     * Extract the year, month, and day from the date object.
     * 
     * These values are used to construct the SQL date string.
     */
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');

    /**
     * Format the date as a SQL date string.
     * 
     * The format is YYYY-MM-DD, which is a standard format for SQL date values.
     */
    return `${year}-${month}-${day}`;
}


/**
 * Converts a date to SQL time format.
 * 
 * @param {Date} datetime The date to convert.
 * @returns {string} The date in SQL time format, or an empty string if the date is not valid.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(toSQLTimeFormat(date)); // Output: HH:MM:SS
 * console.log(toSQLTimeFormat(null)); // Output: ""
 * ```
 */
export function toSQLTimeFormat(datetime: Date): string {
    /**
     * If the date is not a valid date object, return an empty string.
     * 
     * This check ensures that the function returns a consistent result for invalid inputs.
     */
    if (!isDateObj(datetime)) return "";

    /**
     * Extract the hours, minutes, and seconds from the date object.
     * 
     * These values are used to construct the SQL time string.
     */
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');
    const seconds = String(datetime.getSeconds()).padStart(2, '0');

    /**
     * Format the date as a SQL time string.
     * 
     * The format is HH:MM:SS, which is a standard format for SQL time values.
     */
    return `${hours}:${minutes}:${seconds}`;
}


/**
 * Returns the date in SQL datetime format (YYYY-MM-DD HH:MM:SS).
 * 
 * @returns The date in SQL datetime format.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.toSQLDateTimeFormat()); // Output: YYYY-MM-DD HH:MM:SS
 * ```
 */
Date.prototype.toSQLDateTimeFormat = function (): string {
    /**
     * Use the dateToSQLDateTimeFormat function to convert the current date to a SQL datetime string.
     */
    return dateToSQLDateTimeFormat(this);
};


/**
 * Returns the date in SQL date format (YYYY-MM-DD).
 * 
 * @returns The date in SQL date format.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.toSQLDateFormat()); // Output: YYYY-MM-DD
 * ```
 */
Date.prototype.toSQLDateFormat = function (): string {
    /**
     * Use the dateToSQLFormat function to convert the current date to a SQL date string.
     */
    return dateToSQLFormat(this);
};


/**
 * Returns the date in SQL time format (HH:MM:SS).
 * 
 * @returns The date in SQL time format.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.toSQLTimeFormat()); // Output: HH:MM:SS
 * ```
 */
Date.prototype.toSQLTimeFormat = function (): string {
    /**
     * Use the toSQLTimeFormat function to convert the current date to a SQL time string.
     */
    return toSQLTimeFormat(this);
};

/**
 * Checks if a string is a valid SQL datetime string in the format YYYY-MM-DD HH:mm:ss.
 * 
 * @param {string} dateTimeString The string to test.
 * @returns {boolean} True if the string is a valid SQL datetime string, false otherwise.
 * 
 * Example:
 * ```ts
 * console.log(isSQLDateTimeString("2022-01-01 12:00:00")); // Output: true
 * console.log(isSQLDateTimeString("2022-01-32 12:00:00")); // Output: false
 * console.log(isSQLDateTimeString("")); // Output: false
 * ```
 */
export function isSQLDateTimeString(dateTimeString: string): boolean {
    /**
     * If the input string is empty, return false.
     * 
     * This check ensures that the function returns a consistent result for empty inputs.
     */
    if (!isNonNullString(dateTimeString)) return false;

    /**
     * Regular expression to match SQL datetime format: YYYY-MM-DD HH:mm:ss.
     * 
     * This regex pattern breaks down the input string into its constituent parts.
     */
    const sqlDateTimeRegex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

    /**
     * Test if the input string matches the regex.
     * 
     * If the input string does not match the regex, it is not a valid SQL datetime string.
     */
    const match = dateTimeString.match(sqlDateTimeRegex);
    if (!match) {
        return false;
    }

    /**
     * Destructure the match to get the components.
     * 
     * The match array contains the original input string, followed by the captured groups.
     */
    const [_, year, month, day, hours, minutes, seconds] = match.map(Number);

    /**
     * Check if the extracted components are valid.
     * 
     * Create a new Date object using the extracted components.
     */
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    /**
     * Verify that the date components match the original values.
     * 
     * This check ensures that the date components are valid and match the original input string.
     */
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day &&
        date.getHours() === hours &&
        date.getMinutes() === minutes &&
        date.getSeconds() === seconds
    );
}

/**
 * Checks if a string is a valid SQL date string in the format YYYY-MM-DD.
 * 
 * @param {string} dateString The string to test.
 * @returns {boolean} True if the string is a valid SQL date string, false otherwise.
 * 
 * Example:
 * ```ts
 * console.log(isSQLDateString("2022-01-01")); // Output: true
 * console.log(isSQLDateString("2022-01-32")); // Output: false
 * console.log(isSQLDateString("")); // Output: false
 * ```
 */
export function isSQLDateString(dateString: string): boolean {
    /**
     * If the input string is empty, return false.
     * 
     * This check ensures that the function returns a consistent result for empty inputs.
     */
    if (!isNonNullString(dateString)) return false;

    /**
     * Regular expression to match SQL date format: YYYY-MM-DD.
     * 
     * This regex pattern breaks down the input string into its constituent parts.
     */
    const sqlDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

    /**
     * Test if the input string matches the regex.
     * 
     * If the input string does not match the regex, it is not a valid SQL date string.
     */
    const match = dateString.match(sqlDateRegex);
    if (!match) {
        return false;
    }

    /**
     * Destructure the match to get the components.
     * 
     * The match array contains the original input string, followed by the captured groups.
     */
    const [_, year, month, day] = match.map(Number);

    /**
     * Check if the extracted components are valid.
     * 
     * Create a new Date object using the extracted components.
     */
    const date = new Date(year, month - 1, day);

    /**
     * Verify that the date components match the original values.
     * 
     * This check ensures that the date components are valid and match the original input string.
     */
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

/**
 * Provides default date and time formats for the application.
 * 
 * The formats are retrieved from translations, with fallback to predefined default values.
 * The formats are used to represent dates and times in the application.
 */
export const DEFAULT_DATE_FORMATS = {
    /**
     * Get the default datetime format, according to the Moment.js library.
     * it firstly tries to retrieve the default date time format from the translations (key: dates.defaultDateTimeFormat), and if it fails, it returns the default value.
     *
     * @description The format used to represent dates and times by default, as defined by the Moment.js library.
     * @see https://momentjs.com/docs/#/parsing/string-format/
     */
    get dateTime(): IMomentFormat {
        return defaultStr(i18n.getNestedTranslation("dates.defaultDateTimeFormat"), "DD/MM/YYYY HH:mm:ss") as unknown as IMomentFormat;
    },
    /**
     * Get the default date format.
     * It firstly tries to retrieve the default date time format from the translations (key: dates.defaultDateFormat), and if it fails, it returns the default value.
     *
     * @description The format used to represent dates by default.
     */
    get date(): IMomentFormat {
        return defaultStr(i18n.getNestedTranslation("dates.defaultDateFormat"), "DD/MM/YYYY") as unknown as IMomentFormat;
    },
    /**
     * Get the default time format, according to the Moment.js library.
     * It firstly tries to retrieve the default date time format from the translations (key: dates.defaultTimeFormat), and if it fails, it returns the default value.
     *
     * @description The format used to represent times by default, as defined by the Moment.js library.
     * @see https://momentjs.com/docs/#/parsing/string-format/
     */
    get time(): IMomentFormat {
        return defaultStr(i18n.getNestedTranslation("dates.defaultTimeFormat"), "HH:mm:ss") as unknown as IMomentFormat;
    }
}

/**
 * The SQL date format, according to the Moment.js library.
 * @description The format used to represent dates in SQL, as defined by the Moment.js library.
 * @see https://momentjs.com/docs/#/parsing/string-format/
 */
export const SQL_DATE_FORMAT: IMomentFormat = "YYYY-MM-DD";


/**
 * The SQL datetime format, according to the Moment.js library.
 *
 * @description The format used to represent dates and times in SQL, as defined by the Moment.js library.
 * @see https://momentjs.com/docs/#/parsing/
 */
export const SQL_DATE_TIME_FORMAT: IMomentFormat = "YYYY-MM-DD HH:mm:ss";




/**
 * The SQL time format, according to the Moment.js library.
 *
 * @description The format used to represent times in SQL, as defined by the Moment.js library.
 * @see https://momentjs.com/docs/#/parsing/string-format/
 */
export const SQL_TIME_FORMAT: IMomentFormat = "HH:mm:ss";

/**
 * Resets the hours of the date to 0.
 * 
 * @returns The date with hours reset to 0.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.resetHours()); // Output: Date with hours reset to 0
 * ```
 */
Date.prototype.resetHours = function () {
    this.setHours(0);
    return this;
}

/**
 * Resets the minutes of the date to 0.
 * 
 * @returns The date with minutes reset to 0.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.resetMinutes()); // Output: Date with minutes reset to 0
 * ```
 */
Date.prototype.resetMinutes = function () {
    this.setMinutes(0);
    return this;
}

/**
 * Resets the seconds of the date to 0.
 * 
 * @returns The date with seconds reset to 0.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.resetSeconds()); // Output: Date with seconds reset to 0
 * ```
 */
Date.prototype.resetSeconds = function () {
    this.setSeconds(0);
    return this;
}
/**
 * Resets the hours, minutes, and seconds of the date to 0.
 * 
 * @returns The date with hours, minutes, and seconds reset to 0.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.resetHours2Minutes2Seconds()); // Output: Date with hours, minutes, and seconds reset to 0
 * ```
 */
Date.prototype.resetHours2Minutes2Seconds = function () {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
}

/**
 * Adds days to a date.
 * 
 * @param {number} days The number of days to add to the date.
 * @param {Date|string} [date] The date to add days to. If not provided, the current date is used.
 * @param {string} [setFunction] The type of date to add (e.g. 'FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds', 'Milliseconds').
 * @returns {Date|string} The date with the added days, either as a Date object or a string in the specified format.
 * 
 * Example:
 * ```ts
 * console.log(addToDate(1)); // Output: Date object with 1 day added to the current date
 * console.log(addToDate(1, "2022-01-01")); // Output: Date object with 1 day added to the specified date
 * console.log(addToDate(1, "2022-01-01", "FullYear")); // Output: Date object with 1 year added to the specified date
 * ```
 */
export function addToDate(days: number, date?: any, setFunction?: string): Date {
    /**
     * If the number of days is not a number, default to 0.
     * 
     * This check ensures that the function returns a consistent result for invalid inputs.
     */
    if (!isNumber(days)) days = 0;

    /**
     * If no date is provided, use the current date.
     * 
     * This check ensures that the function returns a consistent result for missing inputs.
     */
    if (isEmpty(date)) {
        date = new Date();
    }

    /**
     * If the date is a string, parse it into a Date object.
     * 
     * This check allows the function to accept date strings as input.
     */
    if (isValidDate(date) && isNonNullString(date)) {
        date = new Date(date);
    }

    /**
     * If the date is not a valid Date object, try to parse it from a string or use the current date.
     * 
     * This check ensures that the function returns a consistent result for invalid date inputs.
     */
    if (!isValidDate(date)) {
        date = isNonNullString(date) ? new Date(date) : new Date();
    }

    /**
     * If a set function is provided, add the days to the corresponding date component.
     * 
     * This check allows the function to add days to specific date components (e.g. year, month, day, etc.).
     */
    if (isNonNullString(setFunction) && typeof date['set' + setFunction] === "function" && typeof date['get' + setFunction] === "function") {
        const set = 'set' + setFunction;
        const get = 'get' + setFunction;
        date = new Date(date[set](date[get]() + days));
    }
    return date;
}

/**
 * Adds the specified number of milliseconds to the date object.
 *
 * @param {number} milliseconds The number of milliseconds to add to the date.
 * @param {Date} [dateObj] The date object to add milliseconds to. If not provided, the current date is used.
 * @returns {Date} The updated date object with the added milliseconds.
 */
export function addMilliseconds(milliseconds: number, dateObj?: Date): Date {
    /**
     * If the number of milliseconds is not a number, default to 0.
     */
    if (!isNumber(milliseconds)) milliseconds = 0;

    /**
     * If no date object is provided, use the current date.
     */
    if (!isDateObj(dateObj)) {
        dateObj = new Date();
    }

    /**
     * Ensure a valid date object is used.
     */
    dateObj = dateObj || new Date();

    /**
     * Add the milliseconds to the date object.
     */
    return new Date(dateObj.getTime() + milliseconds);
}

/**
 * Adds the specified number of seconds to the date object.
 *
 * @param {number} seconds The number of seconds to add to the date.
 * @param {Date} [dateObj] The date object to add seconds to. If not provided, the current date is used.
 * @returns {Date} The updated date object with the added seconds.
 */
export function addSeconds(seconds: number, dateObj?: any): Date {
    /**
     * If the number of seconds is not a number, default to 0.
     */
    if (!isNumber(seconds)) {
        seconds = 0;
    }

    /**
     * Convert the seconds to milliseconds and add to the date object.
     */
    return addMilliseconds(seconds * 1000, dateObj);
}

/**
 * Adds the specified number of minutes to the date object.
 *
 * @param {number} minutes The number of minutes to add to the date.
 * @param {Date} [dateObj] The date object to add minutes to. If not provided, the current date is used.
 * @returns {Date|string} The updated date object with the added minutes, or a string in the specified format.
 */
export function addMinutes(minutes: number, dateObj?: any): Date {
    /**
     * If the number of minutes is not a number, default to 0.
     */
    if (!isNumber(minutes)) {
        minutes = 0;
    }

    /**
     * Convert the minutes to milliseconds and add to the date object.
     */
    return addMilliseconds(minutes * 60000, dateObj);
}

/**
 * Adds the specified number of hours to the date object.
 *
 * @param {number} hours The number of hours to add to the date.
 * @param {Date} [dateObj] The date object to add hours to. If not provided, the current date is used.
 * @returns {Date} The updated date object with the added hours.
 */
export function addHours(hours: number, dateObj?: any): Date {
    /**
     * If the number of hours is not a number, default to 0.
     */
    if (!isNumber(hours)) {
        hours = 0;
    }

    /**
     * Convert the hours to milliseconds and add to the date object.
     */
    return addMilliseconds(hours * 3600000, dateObj);
}

/**
 * Parses a date using the Moment.js library.
 *
 * @param {Date|string|number} date The date to parse.
 * @param {string} [format] The format of the date, using Moment.js format. See https://momentjs.com/docs/#/parsing/string-format/
 * @returns {Date|null} The parsed date, or null if the input is not a valid date.
 */
export function parseDate(date: any, format?: IMomentFormat): Date | null {
    /**
     * If the date is already a Date object, return it as is.
     */
    if (isDateObj(date)) return date as Date;

    /**
     * If the date is empty or null, return null.
     */
    if (isEmpty(date)) return null;

    try {
        /**
         * Attempt to parse the date using the Moment.js library.
         */
        const parsedDate = moment(date, format);
        /* Check if the parsed date is valid.
        */
        if (parsedDate?.isValid()) {
            /**
              * If the date is valid, return it as a Date object.
              */
            return parsedDate.toDate();
        }
    } catch (error) {
        console.error(error, " parsing date with moment : ", date, " format is : ", format);
    }
    return null;

}

/**
 * Checks if the provided variable is a valid date, either in SQL format or as a Date object.
 *
 * @param {string|Date} sDate The date to test.
 * @param {string} [format] The format of the date, using Moment.js format. See https://momentjs.com/docs/#/parsing/string-format/
 * @returns {boolean} True if the date is valid, false otherwise.
 */
export const isValidDate = function (sDate: any, format?: IMomentFormat): boolean {
    if (sDate === null || sDate === undefined) return false;
    /**
     * If the input is a boolean, it's not a valid date.
     */
    if (isBoolean(sDate)) return false;

    /**
     * If the input is already a Date object, it's a valid date.
     */
    if (isDateObj(sDate)) return true;

    /**
     * If the input is a non-empty string, try to parse it as a date.
     */
    if (isNonNullString(sDate)) {
        /**
         * If the date can be parsed successfully, it's a valid date.
         */
        return !!parseDate(sDate, format);
    }

    /**
     * If the input is a number that can be converted to a string, it's not a valid date.
     */
    if (sDate?.toString && sDate?.toString() == parseInt(sDate).toString()) return false;

    /**
     * Try to create a new Date object from the input.
     */
    const tryDate = new Date(sDate);

    /**
     * If the resulting Date object is valid, the input is a valid date.
     */
    return (isDateObj(tryDate));
}
/**
 * Adds the specified number of days to the date object.
 *
 * @param {number} days The number of days to add to the date.
 * @param {Date|string} [date] The date object to add days to. If not provided, the current date is used.
 * @returns {Date} The updated date.
 */
export function addDays(days: number, date?: any): Date {
    /**
     * Delegate to the addToDate function with the 'Date' set function.
     */
    return addToDate(days, date, 'Date');
}


/**
 * Adds the specified number of months to the date object.
 *
 * @param {number} months The number of months to add to the date.
 * @param {Date|string} [date] The date object to add months to. If not provided, the current date is used.
 * @returns {Date|string} The updated date, either as a Date object or a string in the specified format.
 */
export function addMonths(months: number, date?: any, format?: IMomentFormat): Date {
    /**
     * Delegate to the addToDate function with the 'Month' set function.
     */
    return addToDate(months, date, 'Month');
}

/**
 * Adds the specified number of weeks to the date object.
 *
 * @param {number} weeks The number of weeks to add to the date.
 * @param {Date|string} [date] The date object to add weeks to. If not provided, the current date is used.
 * @returns {Date|string} The updated date, either as a Date object or a string in the specified format.
 */
export function addWeeks(weeks: number, date?: any): Date {
    /**
     * If the number of weeks is not a number, default to 0.
     */
    weeks = (!isNumber(weeks) ? 0 : weeks) * 7;

    /**
     * Delegate to the addToDate function with the 'Date' set function.
     */
    return addToDate(weeks, date, 'Date');
}

/**
 * Adds the specified number of years to the date object.
 *
 * @param {number} years The number of years to add to the date.
 * @param {Date|string} [date] The date object to add years to. If not provided, the current date is used.
 * @returns {Date} The updated date.
 */
export function addYears(years: number, date?: any): Date {
    /**
     * If the number of years is not a number, default to 0.
     */
    if (!isNumber(years)) years = 0;

    /**
     * Ensure the date is a valid Date object.
     */
    date = new Date(addDays(0, date));

    /**
     * Get the current year of the date.
     */
    const year = date.getFullYear();

    /**
     * Prevent the year from going below 0.
     */
    if ((year + years) < 0) years = 0;
    else years += year;

    /**
     * Set the new year of the date.
     */
    date = date.setFullYear(years);

    return new Date(date);
}

/**
 * Adds a specified number of years to the date.
 * 
 * @param years The number of years to add.
 * @returns The date with the specified number of years added.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.addYears(-1)); // Output: Date with -1 year added
 * ```
 */
Date.prototype.addYears = function (years: number) {
    return addYears(years, this);
}

/**
 * Adds a specified number of months to the date.
 * 
 * @param months The number of months to add.
 * @returns The date with the specified number of months added.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.addMonths(1)); // Output: Date with 1 month added
 * ```
 */
Date.prototype.addMonths = function (months: number) {
    return addMonths(months, this);
}

/**
 * Adds a specified number of minutes to the date.
 * 
 * @param minutes The number of minutes to add.
 * @returns The date with the specified number of minutes added.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.addMinutes(1)); // Output: Date with 1 minute added
 * ```
 */
Date.prototype.addMinutes = function (minutes: number) {
    return addMinutes(minutes, this);
}

/**
 * Adds a specified number of seconds to the date.
 * 
 * @param seconds The number of seconds to add.
 * @returns The date with the specified number of seconds added.
 * 
Example:
 * ```ts
 * const date = new Date();
 * console.log(date.addSeconds(1)); // Output: Date with 1 second added
 * ```
 */
Date.prototype.addSeconds = function (seconds: number) {
    return addSeconds(seconds, this);
}

/**
 * Adds a specified number of days to the date.
 * 
 * @param days The number of days to add.
 * @returns The date with the specified number of days added.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.addDays(1)); // Output: Date with 1 day added
 * ```
 */
Date.prototype.addDays = function (days: number) {
    return addDays(days, this);
}

/**
 * Adds a specified number of weeks to the date.
 * 
 * @param weeks The number of weeks to add.
 * @returns The date with the specified number of weeks added.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.addWeeks(1)); // Output: Date with 1 week added
 * ```
 */
Date.prototype.addWeeks = function (weeks: number) {
    return addWeeks(weeks, this);
}

/**
 * Adds a specified number of hours to the date.
 * 
 * @param hours The number of hours to add.
 * @returns The date with the specified number of hours added.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.addHours(1)); // Output: Date with 1 hour added
 * ```
 */
Date.prototype.addHours = function (hours: number) {
    return addHours(hours, this);
}


/**
 * Returns the first and last days of the current month.
 * 
 * @param {Date} [date] The date object to use as the basis for the calculation. If not provided, the current date is used.
 * @returns {{ first: Date, last: Date }} An object containing the first and last days of the month.
 * 
 * Example:
 * ```ts
 * console.log(currentMonthDaysLimits()); // Output: { first: Date, last: Date }
 * console.log(currentMonthDaysLimits(new Date("2022-01-15"))); // Output: { first: Date, last: Date }
 * ```
 */
export const currentMonthDaysLimits = (date?: any): { first: Date, last: Date } => {
    /**
     * If no date is provided, use the current date.
     * 
     * This check ensures that the function returns a consistent result for missing inputs.
     */
    const currentDate = isValidDate(date) ? new Date(date) : new Date().resetHours2Minutes2Seconds();

    /**
     * Calculate the first day of the month.
     * 
     * The first day of the month is always the 1st day of the month, so we can simply set the day to 1.
     */
    const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    /**
     * Calculate the last day of the month.
     * 
     * The last day of the month is the same as the current date, since we're calculating the limits of the current month.
     */
    const last = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return { first, last };
}

/**
 * Returns the first and last days of the previous week.
 * 
 * @param {Date} [date] The date object to use as the basis for the calculation. If not provided, the current date is used.
 * @returns {{ first: Date, last: Date }} An object containing the first and last days of the previous week.
 * 
 * Example:
 * ```ts
 * console.log(previousWeekDaysLimits()); // Output: { first: Date, last: Date }
 * console.log(previousWeekDaysLimits(new Date("2022-01-15"))); // Output: { first: Date, last: Date }
 * ```
 */
export const previousWeekDaysLimits = (date?: any): { first: Date, last: Date } => {
    /**
     * If no date is provided, use the current date.
     * 
     * This check ensures that the function returns a consistent result for missing inputs.
     */
    const cDate = isValidDate(date) ? new Date(date) : new Date().resetHours2Minutes2Seconds();

    /**
     * Calculate the date one week ago.
     * 
     * We subtract 7 days from the current date to get the date one week ago.
     */
    const beforeOneWeek = new Date(cDate.getTime() - 60 * 60 * 24 * 7 * 1000);

    /**
     * Create a copy of the date one week ago.
     * 
     * We need a copy of the date to avoid modifying the original date.
     */
    const beforeOneWeek2 = new Date(beforeOneWeek);

    /**
     * Get the day of the week (0 = Sunday, 1 = Monday, etc.).
     * 
     * We use this value to calculate the first day of the week.
     */
    const day = beforeOneWeek.getDay();

    /**
     * Calculate the difference between the current day and Monday.
     * 
     * If the current day is Sunday, we subtract 6 to get the previous Monday. Otherwise, we subtract the current day to get the previous Monday.
     */
    const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);

    /**
     * Calculate the first day of the previous week.
     * 
     * We set the date to the previous Monday.
     */
    const first = new Date(beforeOneWeek.setDate(diffToMonday));

    /**
     * Calculate the last day of the previous week.
     * 
     * We set the date to the previous Sunday (i.e., the day after the previous Monday).
     */
    const last = new Date(beforeOneWeek2.setDate(diffToMonday + 6));

    return { first, last };
}

/**
 * Returns the first and last days of the current week.
 * 
 * @param {Date} [date] The date object to use as the basis for the calculation. If not provided, the current date is used.
 * @returns {{ first: Date, last: Date }} An object containing the first and last days of the current week.
 * 
 * Example:
 * ```ts
 * console.log(currentWeekDaysLimits()); // Output: { first: Date, last: Date }
 * console.log(currentWeekDaysLimits(new Date("2022-01-15"))); // Output: { first: Date, last: Date }
 * ```
 */
export const currentWeekDaysLimits = (date?: any) => {
    /**
     * If no date is provided, use the current date.
     * 
     * This check ensures that the function returns a consistent result for missing inputs.
     */
    const currentDate = isValidDate(date) ? new Date(date) : new Date().resetHours2Minutes2Seconds();

    /**
     * Get the day of the week (0 = Sunday, 1 = Monday, etc.).
     * 
     * We use this value to calculate the first day of the week.
     */
    const day = currentDate.getDay();

    /**
     * Calculate the difference between the current day and Monday.
     * 
     * If the current day is Sunday, we subtract 6 to get the previous Monday. Otherwise, we subtract the current day to get the previous Monday.
     */
    const diff = currentDate.getDate() - day + (day == 0 ? -6 : 1);

    /**
     * Create a copy of the current date.
     * 
     * We need a copy of the date to avoid modifying the original date.
     */
    const last = new Date(currentDate);

    /**
     * Calculate the first day of the current week.
     * 
     * We set the date to the current Monday.
     */
    const first = new Date(currentDate.setDate(diff));

    /**
     * Calculate the last day of the current week.
     * 
     * We set the date to the current Sunday (i.e., the day after the current Monday).
     */
    last.setDate(last.getDate() + 6);

    return { first, last };
}

/**
 * Formats a date to the specified moment format.
 * 
 * @param {Date|string} [date] The date to format. If not provided, the current date is used.
 * @param {string} [format] The moment format to use. If not provided, the default format is used.
 * @returns {string} The formatted date string. If the input date is invalid, an empty string is returned.
 * 
 * Example:
 * ```ts
 * console.log(formatDate()); // Output: Formatted current date
 * console.log(formatDate(new Date("2022-01-15"))); // Output: Formatted date
 * console.log(formatDate("2022-01-15", "YYYY-MM-DD")); // Output: Formatted date in YYYY-MM-DD format
 * ```
 */
export const formatDate = (date?: any, format?: IMomentFormat): string => {
    /**
     * Parse the input date using moment.
     * 
     * This allows us to handle various date formats and invalid dates.
     */
    const parsedDate = moment(date);

    /**
     * Check if the parsed date is valid.
     * 
     * If the date is invalid, we return an empty string.
     */
    if (parsedDate.isValid()) {
        /**
         * Format the date using the specified format.
         * 
         * This returns the formatted date string.
         */
        return parsedDate.format((defaultStr(format, DEFAULT_DATE_FORMATS.dateTime) as unknown) as IMomentFormat);
    } else {
        /**
         * Return the original date string if it's a valid date, otherwise return an empty string.
         * 
         * This ensures that the function returns a consistent result for invalid dates.
         */
        return defaultStr(isValidDate(date) ? date?.toString() : "");
    }
}

/**
 * Formats the date according to a specified format string.
 * 
 * @param format The format string to use.
 * @returns The formatted date string.
 * 
 * Example:
 * ```ts
 * const date = new Date();
 * console.log(date.toFormat("YYYY-MM-DD HH:mm:ss")); // Output: Formatted date string
 * ```
 */
Date.prototype.toFormat = function (format?: IMomentFormat) {
    return formatDate(this, format);
}