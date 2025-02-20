import moment from 'moment';
import isDateObj from "../isDateObj";
import { IMomentFormat } from '@/types';
import isEmpty from '@utils/isEmpty';
import isNonNullString from '@utils/isNonNullString';
import { isBoolean } from 'lodash';


/**
 * Result object returned by the date parser
 */
export interface IDateParserResult {
  /** The parsed Date object if successful */
  date: Date | null;
  /** The format that successfully parsed the date string, if any */
  matchedFormat: string | null;
  /** Whether the parsing was successful */
  isValid: boolean;
  /** Any error message if parsing failed */
  error?: string;
}



export class DateParser {
    /**
     * Comprehensive collection of date formats supported by Moment.js
     */
    static DATE_FORMATS: Array<string> = [
        /** ISO 8601 formats */
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mm:ss',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DDTHH:mm:ss.SSSZ',
        "YYYY-MM-DDTHH:mm:ss[Z]",
        'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
        /** US formats */
        'MM/DD/YYYY',
        'MM-DD-YYYY',
        'MM.DD.YYYY',
        'MM/DD/YY',
        'MMMM DD, YYYY',
        'MMM DD, YYYY',
        /** European formats */
        'DD/MM/YYYY',
        'DD-MM-YYYY',
        'DD.MM.YYYY',
        'DD/MM/YY',
        'DD MMMM YYYY',
        'DD MMM YYYY',
        /** Time formats */
        'HH:mm:ss',
        'HH:mm',
        'hh:mm A',
        'h:mm A',
        'HH:mm:ss.SSS',
        /** Relative formats */
        'YYYY-DDD',
        'YYYY-Www',
        'YYYY-Www-D',
        
         // Common Date Formats
        "YYYY/MM/DD",                       // "2024/02/20"
        "YYYY.MM.DD",                       // "2024.02.20"
        "MMM D, YYYY",                      // "Feb 20, 2024"
        "MMMM D, YYYY",                     // "February 20, 2024"
        "D MMM YYYY",                       // "20 Feb 2024"
        "D MMMM YYYY",                      // "20 February 2024"
        "MMM D YYYY",                       // "Feb 20 2024"
        
        
         // RFC 2822 Formats
        "ddd, DD MMM YYYY HH:mm:ss ZZ",    // "Tue, 20 Feb 2024 15:30:00 +0000"
        "ddd, DD MMM YYYY HH:mm:ss",       // "Tue, 20 Feb 2024 15:30:00"
        "dddd, MMMM D, YYYY",               // "Tuesday, February 20, 2024"
        "dddd, D MMMM YYYY",                // "Tuesday, 20 February 2024"
    
        // Time Formats
        "hh:mm:ss A",                       // "03:30:45 PM"
        "H:mm:ss",                          // "15:30:45"
    
        // Week-based Date Formats
        "YYYY-[W]WW",                       // "2024-W08"
        "YYYY-[W]WW-E",                     // "2024-W08-2"
        
        // Custom Date Formats
        "YYYY-MM-DDTHH:mm:ss.SSS",          // "2024-02-20T15:30:00.000"
        "DD-MM-YYYY HH:mm:ss",              // "20-02-2024 15:30:00"
        "YYYY/MM/DD HH:mm:ss",              // "2024/02/20 15:30:00"
        "YYYY.MM.DD HH:mm:ss",              // "2024.02.20 15:30:00"
        "DD/MM/YYYY HH:mm:ss",              // "20/02/2024 15:30:00"
    
        // Natural language and loose formats
        "MMM D YYYY, h:mm a",               // "Feb 20 2024, 3:30 pm"
        "MMMM D YYYY, h:mm a",              // "February 20 2024, 3:30 pm"
        "h:mm A MMM D, YYYY",               // "3:30 PM Feb 20, 2024"
        "MMMM D, YYYY",                     // "February 20, 2024"
        
        // Short Year Formats
        "YY-MM-DD",                         // "24-02-20"
        "DD-MM-YY",                         // "20-02-24"
        "MM/DD/YY",                         // "02/20/24"
    
        // Additional variations
        "MMM DD, YY",                       // "Feb 20, 24"
        "D MMM YY",                         // "20 Feb 24"
        "D MMMM YY",                        // "20 February 24"
        "YYYY MMM D",                       // "2024 Feb 20"
        "YYYY-MM-DD HH:mm",                  // "2024-02-20 15:30"
        "YYYY-MM-DD HH:mm:ss.SSS"            // "2024-02-20 15:30:00.000"
    ]
    /**
     * Parses a date string using an exhaustive list of commonly used date formats.
     * The function attempts to parse the input string using multiple format patterns
     * and returns the first successful match along with additional parsing information.
     * 
     * @param dateString - The date string to parse
     * @param preferredFormats - Optional array of preferred formats to try first
     * @returns A {@link IDateParserResult} object containing the parsing results
     * 
     * @example
     * ```typescript
     * // Parse an ISO date string
     * const result = parseDateString('2024-02-20');
     * if (result.isValid) {
     *   console.log(result.date); // 2024-02-20T00:00:00.000Z
     *   console.log(result.matchedFormat); // 'YYYY-MM-DD'
     * }
     * 
     * // Parse with preferred formats
     * const customResult = parseDateString('02/20/2024', ['MM/DD/YYYY']);
     * ```
     * 
     * @throws Will not throw errors, but returns error information in the result object
     * 
     * @remarks
     * The function tries formats in the following order:
     * 1. Preferred formats (if provided)
     * 2. ISO 8601 formats
     * 3. US formats
     * 4. European formats
     * 5. Time formats
     * 6. Relative formats
     */
  static parseString(dateString: string,preferredFormats?: string[]| string): IDateParserResult {
    if(isNonNullString(dateString) && isNonNullString(preferredFormats)){
        try {
          const date = moment(dateString, preferredFormats, true);
          if (date.isValid()) {
            return {
              date: date.toDate(),
              matchedFormat: preferredFormats,
              isValid: true,
            };
          }
      } catch (error) { }
    }
    try {
      // First try preferred formats if provided
      if (Array.isArray(preferredFormats) && preferredFormats?.length) {
        for (const format of preferredFormats) {
          const parsed = moment(dateString, format, true);
          if (parsed.isValid() && (parsed.format(format)=== dateString)) {
            return {
              date: parsed.toDate(),
              matchedFormat: format,
              isValid: true,
            };
          }
        }
      }
  
      // Try all format categories
      for (const format of DateParser.DATE_FORMATS) {
        const parsed = moment(dateString, format, true);
        if (parsed.isValid()) {
          if((parsed.format(format)=== dateString)){
            return {
              date: parsed.toDate(),
              matchedFormat: format,
              isValid: true,
            };
          }
        }
      }
      return {
        date: null,
        matchedFormat: null,
        isValid: false,
        error: 'Unable to parse date string with any known format',
      };
  
    } catch (error) {
      return {
        date: null,
        matchedFormat: null,
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred while parsing date',
      };
    }
  }
  /**
 * [Previous interfaces remain the same]
 */

  
  /**
   * Parses a date using the Moment.js library.
   *
   * @param {Date|string|number} date The date to parse.
   * @param {string} [format] The format of the date, using Moment.js format. See https://momentjs.com/docs/#/parsing/string-format/
   * @returns {Date|null} The parsed date, or null if the input is not a valid date.
   */
  static parseDate(date: any, format?: IMomentFormat): Date | null {
      /**
       * If the date is already a Date object, return it as is.
       */
      if (isDateObj(date)) return date as Date;
      if(!isNonNullString(format)){
        const fromKnowing = DateParser.parseString(date);
        if(fromKnowing?.isValid){
          return fromKnowing.date;
        }
        return null;
      }
      /**
       * If the date is empty or null, return null.
       */
      if (isEmpty(date)) return null;
  
      try {
          /**
           * Attempt to parse the date using the Moment.js library.
           */
          const parsedDate = moment(date, format,true);
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
  static isValidDate(sDate: any, format?: IMomentFormat): boolean {
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
          return !!DateParser.parseDate(sDate, format);
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
}