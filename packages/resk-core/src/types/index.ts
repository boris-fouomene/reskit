import { ICurrency } from "@/currency/types";

export * from "./dictionary";
export * from "./filters";
export * from "./i18n";
export * from "./resources";
export * from "./fields";

/**
 * @typedef IPrimitive
 * @description
 * The `IPrimitive` type represents a union of the basic primitive data types in TypeScript.
 * It can be one of the following types:
 * - `string`: Represents textual data.
 * - `number`: Represents numeric values, both integers and floating-point numbers.
 * - `boolean`: Represents a logical entity that can have two values: `true` or `false`.
 *
 * This type is useful when you want to define a variable or a function parameter that can accept
 * any of these primitive types, providing flexibility in your code.
 *
 * @example
 * // Example of using IPrimitive in a function
 * function logValue(value: IPrimitive): void {
 *     console.log(`The value is: ${value}`);
 * }
 *
 * logValue("Hello, World!"); // Logs: The value is: Hello, World!
 * logValue(42);               // Logs: The value is: 42
 * logValue(true);             // Logs: The value is: true
 *
 * @example
 * // Example of using IPrimitive in a variable
 * let myValue: IPrimitive;
 * myValue = "A string"; // Valid
 * myValue = 100;        // Valid
 * myValue = false;      // Valid
 * 
 * // myValue = [];      // Error: Type 'never[]' is not assignable to type 'IPrimitive'.
 *
 */
export type IPrimitive = string | number | boolean;



/**
* @interface
  Merges two object types, excluding properties from the first type 
* that are also present in the second type.
* 
* This type will include all properties of the first type `T` 
* except those keys that are present in the second type `U`, 
* and it will include all properties from `U`.
* 
* If there are overlapping properties, the properties from `U` 
* will override those in `T`.
* 
* @typeParam T - The first object type, from which properties are 
* omitted.
* @typeParam U - The second object type, whose properties are included 
* and may override properties in `T`.
* 
* @returns A new type that is a combination of `T` and `U`, with 
* properties from `U` taking precedence over those from `T`.
*/
export type IMerge<T extends object, U = any> = Omit<T, keyof U> & U;


/**
 * A type that represents a constructor function that can be instantiated with any number of arguments.
 * This is a generic type that represents a controller class.
 * @template T - The type of the controller class.
 * @template D -  A tuple representing the types of the constructor parameters.
 * @example
 * ```typescript
 * // Example of using IClassConstructor
 * class MyController {
 *   constructor(private readonly service: MyService) { }
 * }
 * 
 * const controllerClass: IClassConstructor<MyController> = MyController;
 * ```
 * type ExampleControllerType = IClassController<ExampleController, [ExampleService]>;
 * const ExampleControllerClass: ExampleControllerType = ExampleController;
  // Simulate dependency injection
  const exampleService = new ExampleService();
  const exampleController = new ExampleControllerClass(exampleService);
 */
export interface IClassConstructor<T = any, D extends any[] = any[]> extends Function {
  new(...args: D): T;
}


/**
 * A renderer function type that renders a given value of type `InputType` into a value of type `OutputType`.
 * 
 * This type is used to define renderers for different value types (e.g., number, string)
 * within various components (e.g., `datagridCell`, `formField`). The renderer function
 * receives a value and returns an HTML string or a ReactNode or other content representing that value.
 * 
 * @template InputType - The type of the value to be rendered.
   @template OutputType - The type of the rendered value.
 * @param {InputType} value - The value to render.
 * @returns {OutputType} - The content representation of the rendered value.
 * 
 * ## Example:
 * 
 * ```typescript
 * const numberRenderer: ITypeRegistryRenderer<number,string> = (value: number) => {
 *   return `<div class="cell number">${value}</div>`;
 * };
 * console.log(numberRenderer(123)); // Output: <div class="cell number">123</div>
 * ```
 */
export type ITypeRegistryRenderer<InputType = any, OutputType = any> = (value: InputType) => OutputType;

/**
 * @interface
 * Represents a function that formats a field value according to specified options.
 *
 * The formatting can be customized based on the options provided when 
 * the `format` function of the `IField` interface is called. This type 
 * allows for greater flexibility in defining how field values should 
 * be displayed or manipulated.
 *
 * ### Parameters:
 * - `options`: 
 *   - **Type**: `IInputFormatterOptions`
 *   - An object containing options for formatting the value. The options may 
 *     include the value to be formatted, the expected type of the value, 
 *     and a custom format specification.
 *
 * ### Returns:
 * - **Type**: `string`
 *   - The formatted value as a string, based on the provided options.
 *
 * ### Example Usage:
 * ```typescript
 * const customFormatter: IInputFormatterValueFunc = (options) => {
 *     const { value, format } = options;
 *     if (format === 'money') {
 *         return `$${parseFloat(value).toFixed(2)}`; // Formats value as money
 *     }
 *     return String(value); // Default to string conversion
 * };
 *
 * const formattedValue = customFormatter({
 *     value: 1234.567,
 *     format: 'money'
 * });
 * console.log(formattedValue); // Outputs: "$1234.57"
 * ```
 */
export type IInputFormatterValueFunc = ((options: IInputFormatterOptions) => string);



/**
 * Represents the format types for value formatting.
 *
 * This type can be used to specify how values should be formatted in an application, such as:
 * - As a standard number
 * - As a monetary value
 * - Using a custom format defined by the user
 *
 * ### Format Options:
 * - `"number"`: For standard numerical formatting.
 * - `"money"`: For formatting values as monetary amounts, following currency rules.
 * - `"custom"`: For user-defined formatting rules.
 * - `ICurrencyFormatterKey`: Represents a specific currency format that adheres to the structure defined in the `ICurrencyFormatterKey` interface.
 *
 * ### Example Usage:
 * ```typescript
 * // Define a value with a money format
 * const moneyValue: IInputFormatterValueFormat = "money";
 *
 * // Define a custom format
 * const customValue: IInputFormatterValueFormat = "custom";
 *
 * // Define a value using ICurrencyFormatterKey
 * const currencyValue: IInputFormatterValueFormat = "formatUSD" | "formatCAD" | "formatEUR" | "formatAED" | "formatAFN" | "formatALL" | "formatAMD" | "formatARS" |;
 * ```
 */
export type IInputFormatterValueFormat = "number" | "money" | "custom" | IInputFormatterValueFunc;

/**
 * Options for formatting a value into a string representation.
 *
 * This interface is used in the `formatValue` function to specify the options 
 * for formatting a given value, allowing for flexible and customizable 
 * output based on the provided settings.
 *
 * ### Properties:
 * - `value?`: The value to be formatted. This can be of any type and is the 
 *   main input for the formatting process.
 * - `type?`: The expected type of the input value, which can help in determining 
 *   the appropriate formatting logic to apply.
 * - `format?`: A predefined or custom format to be used for formatting the parsed 
 *   value. This allows for dynamic formatting based on the specified type.
 *
 * ### Example Usage:
 * ```typescript
 * const options: IInputFormatterOptions = {
 *   value: 1234.56,
 *   type: "number",
 *   format: "money" // Example format for monetary values
 * };
 *
 * const formattedValue = formatValue(options);
 * console.log(formattedValue); // Outputs: "$1,234.56" or similar, depending on the format
 * ```
 * 
 *  * ```typescript
 * const options: IInputFormatterOptions = {
 *   value: 1234.56,
 *   type: "number",
 *   format: "formatUSD" // Example format for monetary values in $USD
 * };
 *
 * const formattedValue = formatValue(options);
 * console.log(formattedValue); // Outputs: "$1,234.56" or similar, depending on the format
 * ```
 */
export interface IInputFormatterOptions {
  value?: any; // The value to be formatted
  type?: any; // The expected type of the value
  /**
  * This function is used by default to format the parsed or custom value.
  * In an input field, that function or a string used to format the value displayed in the input field.
  * ```ts
  *   format : "moneay", //will format the value to money format
  *   format : ({value:any,type:ITextInputType,format?:"custom"}) => any; //will format the value to any format
  * ```
  */
  format?: IInputFormatterValueFormat; // The format to be applied

  /***
   * Format for date types
   */
  dateFormat?: IMomentFormat;
}

/**
 * Options for formatting a masked input value.
 *
 * This interface provides a set of properties that can be used to customize the behavior of a masked input field.
 * It includes options for specifying the input value, type, mask, and other formatting settings.
 *
 * @example
 * ```typescript
 * const maskOptions: IInputFormatterMaskOptions = {
 *   value: '12345',
 *   type: 'number',
 *   mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
 *   obfuscationCharacter: '*',
 *   focused: true,
 *   placeholderFillCharacter: '_',
 *   maskAutoComplete: true,
 * };
 * ```
 */
export interface IInputFormatterMaskOptions {
  /**
   * The input value to be formatted.
   *
   * This property can be a string representing the value to be formatted.
   *
   * @example
   * ```typescript
   * const maskOptions: IInputFormatterMaskOptions = {
   *   value: '12345',
   * };
   * ```
   */
  value?: string;

  /**
   * The type of the input value.
   *
   * This property can be a string representing the type of the input value, such as 'number', 'date', etc.
   * ```
   */
  type?: string;

  /**
   * The mask to be applied to the input value.
   *
   * This property can be an instance of `IInputFormatterMask` or an array of strings or regular expressions.
   *
   * @example
   * ```typescript
   * const maskOptions: IInputFormatterMaskOptions = {
   *   mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
   * };
   * ```
   */
  mask?: IInputFormatterMask;

  /**
   * The character to be used for obfuscating the input value.
   *
   * This property defaults to '*' if not specified.
   *
   * @example
   * ```typescript
   * const maskOptions: IInputFormatterMaskOptions = {
   *   obfuscationCharacter: '*',
   * };
   * ```
   */
  obfuscationCharacter?: string;

  /**
   * Whether to display the obfuscated value in the input field.
   *
   * This property defaults to `false` if not specified.
   *
   * @example
   * ```typescript
   * const maskOptions: IInputFormatterMaskOptions = {
   *   showObfuscatedValue: true,
   * };
   * ```
   */
  // showObfuscatedValue?: boolean;

  /**
   * The character to be used as the fill character for the default placeholder.
   *
   * @example
   * ```typescript
   * const maskOptions: IInputFormatterMaskOptions = {
   *   placeholderFillCharacter: '_',
   * };
   * ```
   */
  placeholderFillCharacter?: string;


  /**
 * Whether to add the next mask characters to the end of the input value.
 *
 * This property defaults to `false` if not specified.
 *
 * @example
 * ```typescript
 * const maskOptions: IInputFormatterMaskOptions = {
 *   maskAutoComplete: true,
 * };
 * ```
 */
  maskAutoComplete?: boolean;
}

export interface IInputFormatterCurrencyMaskOptions {
  /** Character for thousands delimiter. Defaults to `"."` */
  delimiter?: string;
  /** Decimal precision. Defaults to `2` */
  precision?: number;
  /** Decimal separator character. Defaults to `","`  */
  separator?: string;
  /** ITextInputMask to be prefixed on the mask result */
  prefix?: IInputFormatterMaskArray;
};

/**
 * @typedef IInputFormatterMaskArray
 * A type representing an array of mask elements.
 *
 * This type can be used to define a mask for an input field, where each element in the array represents a character or a pattern to be matched.
 *
 * @example
 * ```typescript
 * const maskArray: IInputFormatterMaskArray = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 * ```
 */
export type IInputFormatterMaskArray = Array<string | RegExp | [RegExp]>;

/**
 * @typedef IInputFormatterMask
 * A type representing a mask for an input field.
 *
 * This type can be either a static array of mask elements or a function that returns a dynamic array of mask elements based on the provided options.
 *
 * @example
 * ```typescript
 * const staticMask: IInputFormatterMask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 * const dynamicMask: IInputFormatterMask = (options: IInputFormatterOptions) => {
 *   if (options.type === 'number') {
 *     return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 *   } else {
 *     return ['a', 'a', 'a', 'a', 'a'];
 *   }
 * };
 * ```
 */
export type IInputFormatterMask = IInputFormatterMaskArray | ((options: IInputFormatterOptions) => IInputFormatterMaskArray);


/**
 * @interface IInputFormatterResult
 * Represents the result of a formatted value obtained via the `formatValue` function.
 *
 * This interface extends the `IInputFormatterOptions` interface and contains 
 * properties that provide information about the formatted value, its type, 
 * and the parsed representation.
 *
 * ### Properties:
 * - `formattedValue`: 
 *   - **Type**: `string`
 *   - The formatted representation of the value, which is returned 
 *     after applying the formatting logic.
 *
 * - `isDecimalType`: 
 *   - **Type**: `boolean`
 *   - Indicates whether the type associated with the function supports 
 *     decimal values. This property helps determine how to handle the 
 *     formatted value correctly.
 *
 * - `parsedValue`: 
 *   - **Type**: `any`
 *   - The raw value that was parsed before formatting. By default, 
 *     this will be a number when the original value is a numeric type.
 *
 * - `decimalValue`: 
 *   - **Type**: `number`
 *   - The decimal representation of the formatted value. This is useful 
 *     for calculations or further processing of the value as a number.
 *
 * ### Example Usage:
 * ```typescript
 * const result: IInputFormatterResult = {
 *   formattedValue: "$1,234.56",
 *   isDecimalType: true,
 *   parsedValue: 1234.56,
 *   decimalValue: 1234.56,
 * };
 * console.log(result.formattedValue); // Outputs: "$1,234.56"
 * console.log(result.isDecimalType);   // Outputs: true
 * ```
 */
export interface IInputFormatterResult extends IInputFormatterOptions, Partial<IInputFormatterMaskResult> {
  formattedValue: string; // The value to be formatted
  isDecimalType: boolean; //if the type linked to the function supports decimal values
  parsedValue: any; //defaults to a number when it is a number
  decimalValue: number; //the decimal value of the formatted value
}

/**
 * Represents the result of a masked input value.
 *
 * This interface provides a set of properties that contain the masked, unmasked, and obfuscated values of the input field, as well as the original mask array.
 *
 * @example
 * ```typescript
 * const maskResult: IInputFormatterMaskResult = {
 *   masked: '12345',
 *   unmasked: '12345',
 *   obfuscated: '*****',
 *   maskArray: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
 * };
 * ```
 */
export interface IInputFormatterMaskResult {
  /**
   * The masked value of the input field.
   *
   * This property contains the value of the input field with the mask applied.
   *
   * @example
   * ```typescript
   * const maskResult: IInputFormatterMaskResult = {
   *   masked: '12345',
   * };
   * ```
   */
  masked: string;

  /**
   * The unmasked value of the input field.
   *
   * This property contains the original value of the input field without the mask applied.
   *
   * @example
   * ```typescript
   * const maskResult: IInputFormatterMaskResult = {
   *   unmasked: '12345',
   * };
   * ```
   */
  unmasked: string;

  /**
   * The obfuscated value of the input field.
   *
   * This property contains the value of the input field with all characters replaced with an obfuscation character (e.g. '*').
   *
   * @example
   * ```typescript
   * const maskResult: IInputFormatterMaskResult = {
   *   obfuscated: '*****',
   * };
   * ```
   */
  obfuscated: string;

  /**
   * The original mask array used to mask the input value.
   *
   * This property contains the array of mask elements that was used to mask the input value.
   *
   * @example
   * ```typescript
   * const maskResult: IInputFormatterMaskResult = {
   *   maskArray: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
   * };
   * ```
   */
  maskArray: IInputFormatterMaskArray;
}
/**
 * @type IMomentFormat
 * @description
 * A comprehensive type representing all valid Moment.js format strings.
 * This type serves as a unified reference for various date/time formatting options,
 * accommodating various combinations of date, time, and day of the week components.
 * ### Supported Tokens:
 *  monts : 
 *   M : Month number, without leading zeros (1-12).
 * - **`'MM'`**: 2-digit month (e.g., `10` for October).
 * - **`'MMM'`**: Abbreviated month name (e.g., `Oct` for October).
 * - **`'MMMM'`**: Full month name (e.g., `October`).
 * - **`'D'`**: Day of the month (e.g., `1` for the first day of the month... 2 ... 30 31).
 * - **``Do'`**: Ordinal day of the month (e.g., `1st` for the first day of the month,1st 2nd ... 30th 31st).
 * - **`'DD'`**: 2-digit day of the month (e.g., `01` for the first day of the month).
 * - **`'DDD'`**: 3-digit day of the year (e.g., `001` for the first day of the year).
 * - **`'DDDD'`**: 4-digit day of the year (e.g., `0001` for the first day of the year).
 * - **``d'`**: Day of the week (e.g., `1` for Monday : 0 1 ... 5 6).
 * - **``do'`**: Ordinal day of the week (e.g., `1st` for Monday).
 * - **``dd'`**: Abbreviated day of the week (e.g., `Mon` for Monday).
 * - **``ddd'`**: Full day of the week (e.g., `Monday`).
 * - **``dddd'`**: Full day of the week (e.g., `Monday`).
 * - **`'YY'`**: 2-digit year (e.g., `19` for the year 2019).
 * - **`'YYYY'`**: 4-digit year (e.g., `2019`).
 * - **`'YYYYY'`**: 5-digit year (e.g., `1999`).
 * - **`'a'`**: Lowercase am/pm marker (e.g., `am` or `pm`).
 * - **`'A'`**: Uppercase AM/PM marker (e.g., `AM` or `PM`).
 * - **`'H'`**: 24-hour hour (e.g., `0` to `23`).
 * - **`'HH'`**: 2-digit 24-hour hour (e.g., `00` to `23`).
 * - **`'h'`**: 12-hour hour (e.g., `1` to `12`).
 * - **`'hh'`**: 2-digit 12-hour hour (e.g., `01` to `12`).
 * - **`'m'`**: Minutes (e.g., `0` to `59`).
 * - **`'mm'`**: 2-digit minutes (e.g., `00` to `59`).
 * - **`'s'`**: Seconds (e.g., `0` to `59`).
 * - **`'ss'`**: 2-digit seconds (e.g., `00` to `59`).
 * - **`'S'`**: Milliseconds (e.g., `0` to `999`).
 * - **`'SS'`**: 3-digit milliseconds (e.g., `00` to `999`).
 * - **`'SSS'`**: 4-digit milliseconds (e.g., `000` to `9999`). 
 * - Q : Quarter of the year (1-4) : 1 2 3 4.
 * - Qo : Quarter of the year (1-4) : 1st 2nd 3rd 4th.
 * 
   * @see https://momentjs.com/docs/#/displaying/format for more information about the supported tokens.
 */
export type IMomentFormat = string;