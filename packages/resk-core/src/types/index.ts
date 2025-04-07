import { ICountryCode } from "@countries/index";
import { IInputFormatterOptions } from "./fields";
import { IMomentFormat } from "./date";

export * from "./date";
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

export * from "./merge";


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
 *   obfuscationCharacter: '*', // The character to be used for obfuscating the input value.
 *   focused: true,
 *   placeholder: '_',
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
   * This property defaults to '*' if not specified. It must have a length of 1 not more than 1.
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
   * The character to be used as the fill character for the default placeholder.
     The length of the character must be 1 not more than 1.
     Default value is '_'
   *
   * @example
   * ```typescript
   * const maskOptions: IInputFormatterMaskOptions = {
   *   placeholderCharacter: '_',
   * };
   * ```
   */
  placeholderCharacter?: string;

  /***
   * A function to validate the input value.
   *
   * This function is called with the input value as an argument and should return `true` if the value is valid, and `false` otherwise.
   * It's called only if the input value matches the specified mask.
   * When this function is provided, the `isValid` property of the returned `IInputFormatterMaskResult` object will be the result of that function.
   */
  validate?: (value: string) => boolean;


  /**
  * Whether to add the next mask characters to the end of the input value.
  *
  * This property defaults to `false` if not specified.
  */
  maskAutoComplete?: boolean;
}

/**
 * @interface IInputFormatterNumberMaskOptions
 * Options for formatting a number mask.
 *
 * This interface provides a set of properties that can be used to customize the behavior of a number mask.
 * It includes options for specifying the thousands delimiter, decimal precision, decimal separator, and prefix.
 *
 * @example
 * ```typescript
 * const numberMaskOptions: IInputFormatterNumberMaskOptions = {
 *   delimiter: '.',
 *   precision: 2,
 *   separator: ',',
 *   prefix: ['$', ' '],
 * };
 * ```
 */
export interface IInputFormatterNumberMaskOptions {
  /**
   * The character to be used as the thousands delimiter.
   *
   * This property defaults to `"."` if not specified.
   *
   * @example
   * ```typescript
   * const numberMaskOptions: IInputFormatterNumberMaskOptions = {
   *   delimiter: '.',
   * };
   * ```
   */
  delimiter?: string;

  /**
   * The decimal precision.
   *
   * This property defaults to `2` if not specified.
   *
   * @example
   * ```typescript
   * const numberMaskOptions: IInputFormatterNumberMaskOptions = {
   *   precision: 2,
   * };
   * ```
   */
  precision?: number;

  /**
   * The decimal separator character.
   *
   * This property defaults to `","` if not specified.
   *
   * @example
   * ```typescript
   * const numberMaskOptions: IInputFormatterNumberMaskOptions = {
   *   separator: ',',
   * };
   * ```
   */
  separator?: string;

  /**
   * The prefix to be added to the mask result.
   *
   * This property can be an array of strings or regular expressions that will be added to the beginning of the mask result.
   *
   * @example
   * ```typescript
   * const numberMaskOptions: IInputFormatterNumberMaskOptions = {
   *   prefix: ['$', ' '],
   * };
   * ```
   */
  prefix?: IInputFormatterMaskArray;
}

/***
 * @typedef IInputFormatterMaskWithValidation
 * A type representing a mask and a validation function.
 *
 * This type is used to define a mask and a validation function for an input field.
 *
 * @example
 * ```typescript
 * const maskAndValidate: IInputFormatterMaskWithValidation = {
 *   mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
 *   validate: (value: string) => value.length === 10,
 * };
 * ```
 */
export interface IInputFormatterMaskWithValidation extends Record<string, any> { mask: IInputFormatterMaskArray, validate: (value: string) => boolean; countryCode?: ICountryCode }

/**
 * @typedef IInputFormatterMaskArray
 * A type representing an array of mask elements.
 *
 * This type can be used to define a mask for an input field, where each element in the array represents a character or a pattern to be matched.
 * When the placeholderCharacter is provided, the obfuscationCharacter is considered only if it is provided or the obfuscationCharacter is provided when calling the formatWithMask method.
 *
 * @example
 * ```typescript
 * const maskArray: IInputFormatterMaskArray = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 * ```
 */
export type IInputFormatterMaskArray = Array<string | RegExp | [mask: RegExp | string, placeholderCharacter?: string, obfuscationCharacter?: string | false]>;

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
  /***
    The date object corresponding to the input value, when the provided type is date, time or datetime
  */
  dateValue?: Date;
  /****
    there dateFormat used to format the value
  */
  dateFormat?: IMomentFormat;
  /***
   * The dial code of the phone number in case of formatting a phone number
   */
  dialCode?: string;

  /***
    The international value of the phone number of the input value in case of formatting a phone number
  */
  phoneNumber?: string;
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

  /***
    The auto completed mask value.
    
    This property contains the value of the input field with all characters replaced with an obfuscation character (e.g. '*').
    
    @example
    ```typescript
    const maskResult: IInputFormatterMaskResult = {
      maskedAutoCompleted: '*****',
    };
  */
  maskedAutoCompleted?: string;

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
   * Obfuscation
   * To mark a character as obfuscated, use the RegExp within an array and the second element of the array is not false, like this:
   * ```typescript
   *  const creditCardMask = [/\d/, /\d/, /\d/, /\d/, " " [/\d/], [/\d/], [/\d/], [/\d/], " ", [/\d/], [/\d/], [/\d/], [/\d/], " ", /\d/, /\d/, /\d/, /\d/];
   * ```
   */
  maskArray: IInputFormatterMaskArray;

  /***
    whether the mask has obfuscation
  */
  maskHasObfuscation: boolean;

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
  //showObfuscatedValue : boolean;

  /***
    The character to be used as the fill character for the default placeholder of the input field.
  */
  placeholder: string;

  /***
   * The masked placeholder
   */
  maskedPlaceholder: string;

  /***
   * Whether the input value matches the specified mask.
   */
  isValid: boolean;

  /***
   * Represent an array of replaced non regex mask char from the input value.
   * index : the index of the replaced char in the value
   * maskIndex : the index of the replaced char in the mask
   * from : the char that was replaced. It represents the original char at index index in the value
   * to : the char that was replaced with. It represents the original char at index maskIndex in the mask
   */
  nonRegexReplacedChars: {
    index: number;
    maskIndex: number;
    from: string;
    to: string;
    valueChar: string;
    maskChar: string;
  }[]
}
