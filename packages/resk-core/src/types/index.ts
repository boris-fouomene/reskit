/**
 * Represents a base field with optional type, label, and name properties.
 * The type property defaults to "text" if not specified.
 * 
 * @template FieldType - The type of the field, defaults to "text"
 * 
 * @description
 * This interface serves as a base for all field types, providing common properties such as type, label, and name.
 * 
 * @example
 * ```typescript
 * const textField: IFieldBase = {
 *   type: 'text',
 *   label: 'Text Field',
 *   name: 'textField'
 * };
 * ```
 */
export interface IFieldBase<FieldType = "text"> {
  /**
   * The type of the field.
   * 
   * @description
   * This property specifies the type of the field, such as "text", "number", or "date".
   * 
   * @default "text"
   * 
   * @example
   * ```typescript
   * const textField: IFieldBase = {
   *   type: 'text'
   * };
   * ```
   */
  type?: FieldType;

  /**
   * The label of the field.
   * 
   * @description
   * This property specifies the label or display text for the field.
   * 
   * @example
   * ```typescript
   * const textField: IFieldBase = {
   *   label: 'Text Field'
   * };
   * ```
   */
  label?: string;

  /**
   * The name of the field.
   * 
   * @description
   * This property specifies the unique name or identifier for the field.
   * 
   * @example
   * ```typescript
   * const textField: IFieldBase = {
   *   name: 'textField'
   * };
   * ```
   */
  name?: string;

  /**
   * The name of the field in the database table.
   * 
   * @description
   * This property specifies the name of the field as it appears in the database table.
   * 
   * @example
   * ```typescript
   * const textField: IFieldBase = {
   *   databaseName: 'text_field'
   * };
   * ```
   */
  databaseName?: string;

  /**
   * The name of the field's table or collection in the database.
   * 
   * @description
   * This property specifies the name of the table or collection that contains the field in the database.
   * 
   * @example
   * ```typescript
   * const textField: IFieldBase = {
   *   databaseTableName: 'text_fields'
   * };
   * ```
   */
  databaseTableName?: string;
}


/**
 * Represents a map of field types to their corresponding IFieldBase instances.
 * 
 * @description
 * This interface serves as a mapping of field types to their respective IFieldBase instances, providing a way to access and manipulate fields of different types.
 * 
 * @example
 * ```typescript
 * const fieldMap: IFieldMap = {
 *   text: {
 *     type: 'text',
 *     label: 'Text Field',
 *     name: 'textField'
 *   },
 *   number: {
 *     type: 'number',
 *     label: 'Number Field',
 *     name: 'numberField'
 *   },
 *   // ...
 * };
 * ```
  @example 
  ```ts
      declare module "@resk/core" {
      interface IResourcesNamesMap {
          users?:string;
      }
      interface IFieldMap {
          select : IFieldBase<"select"> & {
              items : string[]
          }
      }
  }
  ```
 */
export interface IFieldMap {
  /**
   * A text field.
   * 
   * @description
   * This property represents a text field, with a type of "text".
   * 
   * @example
   * ```typescript
   * const textField: IFieldBase<"text"> = {
   *   type: 'text',
   *   label: 'Text Field',
   *   name: 'textField'
   * };
   * ```
   */
  text: IFieldBase<"text">;

  /**
   * A number field.
   * 
   * @description
   * This property represents a number field, with a type of "number".
   * 
   * @example
   * ```typescript
   * const numberField: IFieldBase<"number"> = {
   *   type: 'number',
   *   label: 'Number Field',
   *   name: 'numberField'
   * };
   * ```
   */
  number: IFieldBase<"number">;

  /**
   * A date field.
   * 
   * @description
   * This property represents a date field, with a type of "date".
   * 
   * @example
   * ```typescript
   * const dateField: IFieldBase<"date"> = {
   *   type: 'date',
   *   label: 'Date Field',
   *   name: 'dateField'
   * };
   * ```
   */
  date: IFieldBase<"date">;

  /**
   * A datetime field.
   * 
   * @description
   * This property represents a datetime field, with a type of "datetime".
   * 
   * @example
   * ```typescript
   * const datetimeField: IFieldBase<"datetime"> = {
   *   type: 'datetime',
   *   label: 'Datetime Field',
   *   name: 'datetimeField'
   * };
   * ```
   */
  datetime: IFieldBase<"datetime">;

  /**
   * A time field.
   * 
   * @description
   * This property represents a time field, with a type of "time".
   * 
   * @example
   * ```typescript
   * const timeField: IFieldBase<"time"> = {
   *   type: 'time',
   *   label: 'Time Field',
   *   name: 'timeField'
   * };
   * ```
   */
  time: IFieldBase<"time">;

  /**
   * An email field.
   * 
   * @description
   * This property represents an email field, with a type of "email".
   * 
   * @example
   * ```typescript
   * const emailField: IFieldBase<"email"> = {
   *   type: 'email',
   *   label: 'Email Field',
   *   name: 'emailField'
   * };
   * ```
   */
  email: IFieldBase<"email">;
}

/**
 * @interface 
 The `IField` type represents a field with customizable properties.
 * 
 * It uses a conditional type to define the structure based on the generic type `T`.
 * 
 * @template T - The type of the field. Defaults to `any`.
 * 
 * @description
 * This type allows for flexible field definitions by leveraging TypeScript's conditional types.
 * 
 * - If `T` is a key of `IFieldMap`, it constructs a type by omitting keys from `IFieldBase` 
 *   and merging with the mapped type from `IFieldMap`, ensuring the `type` field is included.
 * 
 * - If `T` is an object, it omits overlapping keys from `IFieldBase` and merges the object type `T`.
 * 
 * - If none of the above conditions apply, it defaults to `IFieldBase<T>`.
 * 
 * @example
 * // For a field type 'text', it uses the mapped type in `IFieldMap`:
 * const textField: IField<'text'> = { type: 'text', label: 'Name' };
 * 
 * // For custom field types, it can accept objects:
 * const customField: IField<{ label: string; required: boolean }> = { label: 'Name', required: true };
 */
export type IField<T extends IFieldMapKeys = "text"> = T extends keyof IFieldMap ? (Omit<IFieldBase, keyof IFieldMap[T] | "type"> & Omit<IFieldMap[T], 'type'> & { type: T }) : (Omit<IFieldBase, keyof T> & T);


/**
   @interface
 * Represents the keys of the `IFieldMap` or `IFieldBase`.
 * 
 * @description
 * This type is a union of all possible keys that can be used to define fields,
 * allowing for a flexible and extensible field mapping.
 */
export type IFieldMapKeys = keyof IFieldMap | object;

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
 * @interface
   Represents a generic dictionary type.
 *
 * @typedef {Object} IDict
 *
 * @template K - The type of the dictionary keys (defaults to `keyof any`).
 * @template T - The type of the dictionary values (defaults to `any`).
 *
 * @description
 * A generic dictionary type that can be used to represent a collection of key-value pairs.
 * The key type `K` defaults to `keyof any`, which means it can be any type that can be used as a key in an object.
 * The value type `T` defaults to `any`, which means it can be any type.
 *
 * @example
 * // Create a dictionary with string keys and number values
 * const dict: IDict<string, number> = {
 *   'one': 1,
 *   'two': 2,
 *   'three': 3
 * }
 *
 * @example
 * // Create a dictionary with number keys and string values
 * const dict: IDict<number, string> = {
 *   1: 'one',
 *   2: 'two',
 *   3: 'three'
 * }
 */
export type IDict<K extends keyof any = any, T = any> = Record<K, T>;


/**
 * @interface
  Represents a type for all resource names.
  The IResourcesNames type is defined as the union of all keys in the IResourcesNamesMap object. 
  This means that IResourcesNames can only take on values that are present as keys in IResourcesNamesMap.
 * Here are some examples of using this type:
 *```ts
  import "@resk/core";
  declare module "@resk/core"{
      interface IResourcesNamesMap {
        resource1: any;
        resource2: any;
        resource3: any;
      }
  }
 * let resourceName: IResourcesNames = 'resource1'; // valid
 * let anotherResourceName: IResourcesNames = 'resource2'; // valid
 * let invalidResourceName: IResourcesNames = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourcesNames'.
 ```
 */
export type IResourcesNames = keyof IResourcesNamesMap;

/**
 * A global declaration for all resource names. This is the exported name of the IResourcesNames type.
 * Represents a type for all resource names.
 * This type is a union of all possible resource names.
 * 
 * @description
 * This interface serves as a map for all resource names.
 * 
 * @example
 * ```typescript
  import "@resk/core";
 * declare module "@resk/core" {
 *   interface IResourcesNamesMap {
 *     users?: string;
       roles?:any;
       sales?:any;
 *   }
 * }
 * ```
 * This means that any variable or property with type `IResourcesNames` can only hold 
 * one of the values 'users', 'roles', or 'sales'.
 * 
 * @example
 * ```typescript
 * let resourceName: IResourcesNames = 'users'; // valid
 * let anotherResourceName: IResourcesNames = 'roles'; // valid
 * let invalidResourceName: IResourcesNames = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourcesNames'.
 * ```
 */
export interface IResourcesNamesMap { }

/**
   @interface The IResource interface represents the base structure for a resource in the application. 
    A resource is a fundamental concept often used to describe an entity or object that can be managed, manipulated, or stored within 
    the system. It typically refers to data objects like database tables, API endpoints, or any entities (like users, posts, or products) that the application deals with. 
    Each resource usually has attributes such as a name, label, or title.
 * A **resource** can also be seen as an entity that contains data and can be referenced, displayed or manipulated
 * by the system.\n
 * this is a base interface for defining a resource in the application.
 * Common examples of resources are users, products, or database tables.
 * This interface provides the basic structure for a resource by defining key properties
 * such as `name`, `label`, and `title`, which are used for internal reference and UI display.
 *
 * @typeParam Datatype - An optional type representing the data that this resource holds. Defaults to `any`.
 */
export interface IResource<Datatype = any> {
  /**
   * The internal name of the resource.
   *
   * This name is used within the system for referencing the resource programmatically.
   * It is often a short, unique identifier for the resource.
   * 
   * @example
   * ```typescript
   * const userResource: IResource = { name: "user" };
   * ```
   */
  name?: IResourcesNames;

  /**
   * A user-friendly label for the resource.
   *
   * This is typically a shorter name intended for display in UI elements, such as dropdowns or buttons.
   * It helps users identify the resource within the user interface.
   *
   * @example
   * ```typescript
   * const productResource: IResource = { label: "Product" };
   * ```
   */
  label?: string;

  /**
   * A descriptive title for the resource.
   *
   * The title provides a more detailed or contextual label for the resource, which is often displayed
   * in prominent places like headings or page titles. It helps users understand the purpose of the resource.
   *
   * @example
   * ```typescript
   * const orderResource: IResource = { title: "Order Management" };
   * ```
   */
  title?: string;


  /**
   * A short text that appears when the user hovers over the resource.
   * The tooltip provides additional context or information about the resource.
   * 
   * Typically used in user interfaces to clarify what a particular resource represents or to give instructions.
   *
   * @example
   * ```typescript
   * const userResource: IResource = { tooltip: "This resource manages user information." };
   * ```
   */
  tooltip?: string;
}

/**
 * A type representing an instance of a class that extends `IResource`.\n
 * This allows us to dynamically handle resource instances with generic types.
 *
 * @typedef {Object} IResourceInstance
 *
 * @template DataType - The specific data's type of `IResource` being instantiated (defaults to `IResource`).
 * @example
 * const userResourceInstance: IResourceInstance<UserDataType> = new UserResource({name:"users",label:"List of users"});
 *
 * @description
 * A type that represents a resource instance, which is a constructor function that returns an object.
 * The constructor function take  an options object as an argument, which is used to configure the resource instance.
 * If `DataType` is not specified, it defaults to `any`.
 *
 * @example
 * // Create a resource instance type that extends a custom resource base
 * class CustomIResource implement IResourceInstance<CustomIResource<CustomerDataType>> {
 *   // ...
 * }
 */
export interface IResourceInstance<DataType = any> extends IResource<DataType> {
  /**
  * A type that represents a map of field names to their corresponding IField instances.
    @description this is the list of fields that are part of the resource.  Fields are created using the @Field decorator when resources are defined.
  */
  fields?: Record<string, IField>;

  /**
  * Returns the list of fields for the resource.
  *
  * @returns {Record<string, IField>} An object mapping property names to their corresponding field declaration
  * @example
  * ```typescript
  * class MyClass extends ResourceBase<DataType> {
  *   @Field({ type: 'string' }) myField: string;
  * }
  * const fields = new MyClass().getFields();
  * console.log(fields); // Output: { myField: { name: 'myField', type: 'string' } }
  * ```
  */
  getFields: () => Record<string, IField>;

  /**
   * Returns the field label for the resource.
     @returns  {string} The label of the resource.
  */
  getLabel: () => string;

  /**
   * Returns the field title for the resource;
   * @returns {string} The title of the resource
   */
  getTitle: () => string;

  /***
    Returns the field tooltip for the resource;
    @returns {string} The tooltip of the resource
  */
  getTooltip: () => string;
};

/**
 * A type that represents a constructor function that can be instantiated with any number of arguments.
 */
export type IConstructor = new (...args: any[]) => {};


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
 *   - **Type**: `IFieldFormatValueOptions`
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
 * const customFormatter: IFormatValueFunc = (options) => {
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
export type IFormatValueFunc = ((options: IFieldFormatValueOptions) => string);



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
 * const moneyValue: IFormatValueFormat = "money";
 *
 * // Define a custom format
 * const customValue: IFormatValueFormat = "custom";
 *
 * // Define a value using ICurrencyFormatterKey
 * const currencyValue: IFormatValueFormat = "formatUSD" | "formatCAD" | "formatEUR" | "formatAED" | "formatAFN" | "formatALL" | "formatAMD" | "formatARS" |;
 * ```
 */
export type IFormatValueFormat = "number" | "money" | "custom" | IFormatValueFunc;

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
 * const options: IFieldFormatValueOptions = {
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
 * const options: IFieldFormatValueOptions = {
 *   value: 1234.56,
 *   type: "number",
 *   format: "formatUSD" // Example format for monetary values in $USD
 * };
 *
 * const formattedValue = formatValue(options);
 * console.log(formattedValue); // Outputs: "$1,234.56" or similar, depending on the format
 * ```
 */
export interface IFieldFormatValueOptions {
  value?: any; // The value to be formatted
  type?: any; // The expected type of the value
  /**
   * This function is used by default to format the parsed or custom value.
   */
  format?: IFormatValueFormat; // The format to be applied

  dateFormat?: IMomentFormat;
}

/**
 * Represents the result of a formatted value obtained via the `formatValue` function.
 *
 * This interface extends the `IFieldFormatValueOptions` interface and contains 
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
 * const result: IFieldFormatValueResult = {
 *   formattedValue: "$1,234.56",
 *   isDecimalType: true,
 *   parsedValue: 1234.56,
 *   decimalValue: 1234.56,
 * };
 * console.log(result.formattedValue); // Outputs: "$1,234.56"
 * console.log(result.isDecimalType);   // Outputs: true
 * ```
 */
export interface IFieldFormatValueResult extends IFieldFormatValueOptions {
  formattedValue: string; // The value to be formatted
  isDecimalType: boolean; //if the type linked to the function supports decimal values
  parsedValue: any; //defaults to a number when it is a number
  decimalValue: number; //the decimal value of the formatted value
}



/**
* @type IMomentYearToken
* @description
* A union type representing the various formats for year tokens in Moment.js.
* These tokens can be used to format or parse years in different representations.
* 
* ### Supported Tokens:
* - **`'YYYY'`**: 4-digit year (e.g., `2024`).
* - **`'YY'`**: 2-digit year (e.g., `24` for `2024`).
*/
export type IMomentYearToken = 'YYYY' | 'YY';

/**
 * @type IMomentMonthToken
 * @description
 * A union type representing the various formats for month tokens in Moment.js.
 * These tokens allow for formatting or parsing months in various styles.
 * 
 * ### Supported Tokens:
 * - **`'MM'`**: 2-digit month (e.g., `10` for October).
 * - **`'MMM'`**: Abbreviated month name (e.g., `Oct` for October).
 * - **`'MMMM'`**: Full month name (e.g., `October`).
 */
export type IMomentMonthToken = 'MM' | 'MMM' | 'MMMM';

/**
 * @type IMomentDayToken
 * @description
 * A union type representing the various formats for day tokens in Moment.js.
 * These tokens can be used to format or parse days in different representations.
 * 
 * ### Supported Tokens:
 * - **`'DD'`**: 2-digit day of the month (e.g., `07`).
 * - **`'D'`**: Day of the month (1-31).
 */
export type IMomentDayToken = 'DD' | 'D';

/**
 * @type IMomentDayOfWeekToken
 * @description
 * A union type representing the various formats for day of the week tokens in Moment.js.
 * These tokens are useful for formatting or parsing days based on their position in the week.
 * 
 * ### Supported Tokens:
 * - **`'dd'`**: Abbreviated day of the week (e.g., `Mo` for Monday).
 * - **`'ddd'`**: 3-letter abbreviation for the day (e.g., `Mon`).
 * - **`'dddd'`**: Full name of the day (e.g., `Monday`).
 */
export type IMomentDayOfWeekToken = 'dd' | 'ddd' | 'dddd';

/**
 * @type IMomentHourToken
 * @description
 * A union type representing the various formats for hour tokens in Moment.js.
 * These tokens can be used to format or parse hours in both 12-hour and 24-hour formats.
 * 
 * ### Supported Tokens:
 * - **`'HH'`**: 24-hour format (e.g., `14`).
 * - **`'H'`**: 24-hour format (1-23).
 * - **`'hh'`**: 12-hour format (e.g., `02`).
 * - **`'h'`**: 12-hour format (1-12).
 */
export type IMomentHourToken = 'HH' | 'H' | 'hh' | 'h';

/**
 * @type IMomentMinuteToken
 * @description
 * A union type representing the various formats for minute tokens in Moment.js.
 * These tokens can be used to format or parse minutes in both 2-digit and 1-digit formats.
 * 
 * ### Supported Tokens:
 * - **`'mm'`**: 2-digit minutes (e.g., `30`).
 * - **`'m'`**: Minute (0-59).
 */
export type IMomentMinuteToken = 'mm' | 'm';

/**
 * @type IMomentSecondToken
 * @description
 * A union type representing the various formats for second tokens in Moment.js.
 * These tokens can be used to format or parse seconds in both 2-digit and 1-digit formats.
 * 
 * ### Supported Tokens:
 * - **`'ss'`**: 2-digit seconds (e.g., `45`).
 * - **`'s'`**: Second (0-59).
 */
export type IMomentSecondToken = 'ss' | 's';

/**
 * @type IMomentFractionToken
 * @description
 * A union type representing the various formats for fractional second tokens in Moment.js.
 * These tokens can be used to format or parse milliseconds and fractions of seconds.
 * 
 * ### Supported Tokens:
 * - **`'SSS'`**: 3-digit milliseconds (e.g., `500`).
 * - **`'SS'`**: 2-digit fractional seconds.
 * - **`'S'`**: 1-digit fractional seconds.
 */
export type IMomentFractionToken = 'SSS' | 'SS' | 'S';

/**
 * @type IMomentMeridiemToken
 * @description
 * A union type representing the formats for meridiem tokens in Moment.js.
 * These tokens are used to indicate AM or PM in time formatting.
 * 
 * ### Supported Tokens:
 * - **`'A'`**: Uppercase meridiem (e.g., `PM`).
 * - **`'a'`**: Lowercase meridiem (e.g., `pm`).
 */
export type IMomentMeridiemToken = 'A' | 'a';

/**
 * @type IMomentTimezoneToken
 * @description
 * A union type representing the formats for timezone tokens in Moment.js.
 * These tokens are used to represent timezone offsets in date/time formatting.
 * 
 * ### Supported Tokens:
 * - **`'Z'`**: Timezone offset (e.g., `-07:00`).
 * - **`'ZZ'`**: Compact timezone offset (e.g., `-0700`).
 */
export type IMomentTimezoneToken = 'Z' | 'ZZ';

/**
 * @type IMomentDateSeparator
 * @description
 * A union type representing the valid separators for date components in Moment.js.
 * These separators are used to format dates in various styles.
 */
export type IMomentDateSeparator = '/' | '-' | '.';

/**
 * @type IMomentTimeSeparator
 * @description
 * A union type representing the valid separators for time components in Moment.js.
 * This separator is used to format time in various styles.
 */
export type IMomentTimeSeparator = ':';

/**
 * @type IMomentDateFormat
 * @description
 * A union type representing the various combinations of date components in Moment.js.
 * This type allows for flexibility in formatting dates according to different structures.
 */
export type IMomentDateFormat =
  `${IMomentYearToken}${IMomentDateSeparator}${IMomentMonthToken}${IMomentDateSeparator}${IMomentDayToken}` |
  `${IMomentMonthToken}${IMomentDateSeparator}${IMomentDayToken}${IMomentDateSeparator}${IMomentYearToken}` |
  `${IMomentDayToken}${IMomentDateSeparator}${IMomentMonthToken}${IMomentDateSeparator}${IMomentYearToken}`;

/**
 * @type IMomentTimeFormat
 * @description
 * A union type representing the various combinations of time components in Moment.js.
 * This type allows for flexibility in formatting times according to different structures.
 */
export type IMomentTimeFormat =
  `${IMomentHourToken}${IMomentTimeSeparator}${IMomentMinuteToken}` |
  `${IMomentHourToken}${IMomentTimeSeparator}${IMomentMinuteToken}${IMomentTimeSeparator}${IMomentSecondToken}` |
  `${IMomentHourToken}${IMomentTimeSeparator}${IMomentMinuteToken}${IMomentTimeSeparator}${IMomentSecondToken}.${IMomentFractionToken}`;

/**
 * @type IMomentDateTimeFormat
 * @description
 * A union type representing the various combinations of date and time components in Moment.js.
 * This type allows for flexible formatting of date/time strings according to different structures.
 */
export type IMomentDateTimeFormat =
  `${IMomentDateFormat} ${IMomentTimeFormat}` |
  `${IMomentDateFormat}T${IMomentTimeFormat}`;

/**
 * @type IMomentFullFormatFormat
 * @description
 * A union type representing the various combinations of date/time components with meridiem
 * and timezone tokens in Moment.js. This type allows for comprehensive formatting of
 * date/time strings that include all relevant components.
 */
export type IMomentFullFormatFormat =
  `${IMomentDateTimeFormat}${IMomentMeridiemToken}` |
  `${IMomentDateTimeFormat} ${IMomentMeridiemToken}` |
  `${IMomentDateTimeFormat}${IMomentTimezoneToken}` |
  `${IMomentDateTimeFormat} ${IMomentTimezoneToken}`


/**
 * @type IMomentDayOfWeekFormat
 * @description
 * A union type representing the various combinations of day of the week components
 * in Moment.js. This type allows for flexible formatting of date/time strings
 * that include the day of the week.
 */
export type IMomentDayOfWeekFormat = `${IMomentDayOfWeekToken}, ` | `${IMomentDayOfWeekToken} `;

/**
 * @type IMomentFormat
 * @description
 * A comprehensive union type representing all valid Moment.js format strings.
 * This type serves as a unified reference for various date/time formatting options,
 * accommodating various combinations of date, time, and day of the week components.
 */
export type IMomentFormat = IMomentDateFormat | IMomentTimeFormat | IMomentDateTimeFormat | IMomentFullFormatFormat |
  `${IMomentDayOfWeekFormat}${IMomentDateFormat}` | `${IMomentDayOfWeekFormat}${IMomentTimeFormat}`