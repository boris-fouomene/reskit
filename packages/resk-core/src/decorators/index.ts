import { ITypeRegistryRenderer } from '../types';
import 'reflect-metadata';
/**
 * Creates a decorator that can be applied to class properties or methods.
 *
 * This function takes a key of type KeyType (defaulting to any) and returns a function that takes a value of type ValueType (defaulting to any).
 * The returned function is a decorator that can be applied to class properties or methods.
 *
 * @template KeyType - The type of the key used to store metadata.
 * @template ValueType - The type of the value associated with the key.
 * @param {KeyType} key - The key under which the metadata will be stored.
 * @returns {(value: ValueType) => (target: Object, propertyKey: string) => void} A function that takes a value and returns the decorator function.
 * @example
 * ```typescript
 * const myDecorator = createDecorator('myKey')('myValue');
 * class MyClass {
 *   @myDecorator
 *   myProperty: string;
 * }
 * ```
 */
export function createDecorator<ValueType = any,KeyType = any>(key: KeyType) {
  /**
   * The function that takes a value to associate with the specified key.
   *
   * @param {ValueType} value - The value to be stored as metadata.
   * @returns {(target: Object, propertyKey: string) => void} The actual decorator function.
   */
  return (value: ValueType) => {
    /**
     * The decorator function that will be called when the decorator is applied.
     *
     * @param {Object} target - The target object (class) containing the property being decorated.
     * @param {string} propertyKey - The name of the property being decorated.
     */
    return (target: Object, propertyKey: string|symbol) => {
      /**
       * Define the metadata on the target object for the specified property key.
       */
      Reflect.defineMetadata(key, value, target, propertyKey);
    }
  }
}

/**
 * Creates a property decorator that can be applied to class properties.
 *
 * This function takes a key and an optional default value, and returns a decorator function that defines the metadata for the specified property.
 *
 * @template KeyType - The type of the key used to store metadata.
 * @template ValueType - The type of the default value associated with the key.
 * @param {KeyType} key - The key under which the metadata will be stored.
 * @param {ValueType} [defaultValue] - The default value to be associated with the key (optional).
 * @returns {(target: Object, propertyKey: string) => void} A function that defines the metadata for the specified property.
 * @example
 * ```typescript
 * const myDecorator = createDecoratorProperty('myKey', 'myDefaultValue');
 * class MyClass {
 *   @myDecorator
 *   myProperty: string;
 * }
 * ```
 */
export function createDecoratorProperty<ValueType = any,KeyType = any>(key: KeyType, defaultValue?: ValueType) {
  /**
   * The property decorator function that will be called when the decorator is applied.
   *
   * @param {Object} target - The target object (class) containing the property being decorated.
   * @param {string} propertyKey - The name of the property being decorated.
   */
  return (target: Object, propertyKey: string | symbol) => {
    /**
     * Define the metadata on the target object for the specified property key with the given default value.
     */
    Reflect.defineMetadata(key, defaultValue, target, propertyKey);
  }
}


/**
 * Creates a property decorator that associates a value with a specified key.
 *
 * This function returns a decorator function that can be used to set metadata on a target.
 * The metadata is stored in a dictionary with the specified name.
 *
 * @template ValueType The type of the value to be stored as metadata.
 * @param {string | symbol | number} dictionaryName The name of the dictionary to store the metadata in.
 * @returns {(value: ValueType, itemKey?: any) => PropertyDecorator} A decorator function that takes a key and a value, and returns a property decorator.
 *
 * @example
 * ```typescript
 * const MyDecorator = createDecoratorDict('myDictionary');
 *
   @MyDecorator("key","value")
   @MyDecorator("key2","value2")
   @MyDecorator("key3","value3")
 * class MyClass { }
 * ```
 */
export function createDecoratorDict<ValueType = any>(dictionaryName: string | symbol | number) {
  /**
   * The function that takes a value to associate with the specified key.
   *
   * This function returns a decorator function that sets metadata on the target property.
   *
   * @param {any} [itemKey] The name of the property to save in the dictionary
   * @param {ValueType} itemValue The value to be stored as metadata.
   * @returns {(target: Function) => void} The actual decorator function.
   */
  return (itemKey: any,itemValue: ValueType) => {
    /**
     * Returns a decorator function that sets metadata on the target property.
     *
     * This function is called when the decorator is applied to a property.
     * It retrieves the existing metadata dictionary or initializes a new one,
     * stores the itemValue in the dictionary using the property key, and defines the updated metadata on the target constructor.
     *
     * @param {Object} target The target object (class) that the decorator is applied to.
     * @param {string | symbol} propertyKey The name of the property that the decorator is applied to.
     */
    return function (target: Function) {
      if (typeof dictionaryName !== "number" && !dictionaryName) return;
      if (!itemKey && typeof itemKey !== "number") return;
      /**
       * Get existing fields metadata or initialize an empty object.
       *
       * This function retrieves the existing metadata dictionary from the target object,
       * or initializes a new empty dictionary if none exists.
       *
       * @see getDecoratorDict
       */
      const dict: Record<any, ValueType> = getDecoratorDict(target, dictionaryName);

      /**
       * Store the options in the fields object using propertyKey as the key.
       *
       * This line stores the itemValue in the metadata dictionary using the property key.
       */
      dict[itemKey] = itemValue;

      /**
       * Define the updated metadata on the target constructor.
       *
       * This line defines the updated metadata dictionary on the target constructor using the Reflect API.
       */
      Reflect.defineMetadata(dictionaryName, dict, target);
    };
  }
}

/**
 * Retrieves a metadata dictionary from a target object.
 *
 * This function returns a metadata dictionary associated with the specified name from the target object.
 * If no dictionary exists, it returns an empty object.
 *
 * @template ValueType The type of the values stored in the dictionary.
 * @param {Object} target The target object to retrieve the metadata dictionary from.
 * @param {string | symbol | number} dictionaryName The name of the metadata dictionary to retrieve.
 * @returns {Record<any, ValueType>} The metadata dictionary associated with the specified name.
 *
 * @example
 * ```typescript
   const MyDecorator = createDecoratorDict('myDictionary');
   @MyDecorator("key","value")
   @MyDecorator("key2","value2")
   @MyDecorator("key3","value3")
 * class MyClass { }
 *
 * console.log(getDecoratorDict(MyClass, 'myDictionary')); // output { key3: 'value3', key2: 'value2', key: 'value' }
 * ```
 */
export function getDecoratorDict<ValueType = any>(target: any, dictionaryName: string | symbol | number): Record<any, ValueType> {
  /**
   * Retrieves the existing metadata dictionary from the target object,
   * or initializes a new empty dictionary if none exists.
   *
   * This function uses the Reflect API to retrieve the metadata dictionary.
   */
  return Object.assign({}, Reflect.getMetadata(dictionaryName, target) || {});
}


import 'reflect-metadata';

/**
 * A key used for storing the component registry in the metadata.
 */
const COMPONENT_REGISTRY_KEY = 'componentRegistry';



/**
 * @class TypeRegistry
 * 
 * A utility class responsible for registering and managing custom renderers for various types of components.
 * 
 * This class supports extensibility by allowing external users to register their own renderers
 * for different components, such as `datagridCell` or `formField`. It uses a centralized registry
 * to map types (e.g., 'number', 'string', 'date') to rendering functions.
 * 
 * The `TypeRegistry` is primarily designed to help render components dynamically based on the value's type
 * and the component type. It makes use of internal registries to store and retrieve these renderers
 * based on the context.

 * It's allows external users to register custom renderers for specific value types
 * (e.g., 'number', 'string') and component types (e.g., 'datagridCell', 'formField'). These renderers
 * can then be retrieved and used to render dynamic content in components.
 * 
 * The class makes use of a centralized registry to store and retrieve renderers for various contexts,
 * ensuring that each component type has its own set of renderers.
  This implementation uses Reflect Metadata to store and retrieve renderers efficiently.
 * 
 * ## Example Usage:
 * 
 * ```typescript
 * // Register a number renderer for datagrid cells
 * TypeRegistry.register('number', 'datagridCell', (value: number) => {
 *   return `<div class="cell number">${value}</div>`;
 * });
 * 
 * // Render a number cell
 * const numberCell = TypeRegistry.getRenderer('number', 'datagridCell');
 * console.log(numberCell?.(123)); // Output: <div class="cell number">123</div>
 * 
 * // Register a text renderer for form fields
 * TypeRegistry.register('text', 'formField', (value: string) => {
 *   return `<input type="text" value="${value}" />`;
 * });
 * 
 * // Render a form text field
 * const textField = TypeRegistry.getRenderer('text', 'formField');
 * console.log(textField?.('Hello World')); // Output: <input type="text" value="Hello World" />
 * ```
 */
export class TypeRegistry {

  private static getMetadataKey(type: string, componentType: string) : string{
    return `${COMPONENT_REGISTRY_KEY}-${componentType}:${type}`;
  }

  /**
   * Registers a new renderer for a specific value type and component type.
   * 
   * This method allows users to extend the system by adding their own custom renderers for various types.
   * For example, you can register a renderer for numbers in a datagrid or a custom input field for forms.
   * 
    @template InputType - The type of the value to be rendered.
    @template OutputType - The type of output that the rendering function will produce.
   * @param {string} type - The value type (e.g., 'number', 'string', 'date').
   * @param {string} componentType - The component type (e.g., 'datagridCell', 'formField').
   * @param {ITypeRegistryRenderer<InputType,OutputType>} renderer - The function that renders the value as an HTML string.
   * 
   * ## Example:
   * 
   * ```typescript
   * TypeRegistry.register('number', 'datagridCell', (value: number) => {
   *   return `<div class="cell number">${value}</div>`;
   * });
   * ```
   */
  static register<InputType=any,OutputType = any>(type: string, componentType: string, renderer: ITypeRegistryRenderer<InputType,OutputType>): void {
    if(!type || typeof type !== "string" || !componentType || typeof componentType !== "string") return;
    // Use Reflect Metadata to set the renderer for the specific value and component type
    Reflect.defineMetadata(this.getMetadataKey(type,componentType), renderer, TypeRegistry);
  }

  /**
   * Retrieves a registered renderer for a specific value type and component type.
   * 
   * This method allows users to fetch a renderer for a particular type (e.g., 'number', 'string')
   * and component type (e.g., `datagridCell`, `formField`), which can then be used to render values dynamically.
   * 
   * @template InputType - The type of the value that the renderer handles.
     @template OutputType - The type of output that the rendering function will produce.
   * @param {string} type - The value type (e.g., 'number', 'string', 'date').
   * @param {string} componentType - The component type (e.g., 'datagridCell', 'formField').
   * @returns {ITypeRegistryRenderer<InputType,OuputType> | undefined} - The renderer function if found, or `undefined` if no renderer is registered.
   * 
   * ## Example:
   * 
   * ```typescript
   * const renderer = TypeRegistry.getRenderer('number', 'datagridCell');
   * if (renderer) {
   *   const html = renderer(123);
   *   console.log(html);  // Output: <div class="cell number">123</div>
   * }
   * ```
   */
  static getRenderer<InputType = any,OutputType = any>(type: string, componentType: string): ITypeRegistryRenderer<InputType,OutputType> | undefined {
    // Use Reflect Metadata to get the renderer for the specific value and component type
    return Reflect.getMetadata(this.getMetadataKey(type,componentType), TypeRegistry);
  }
  
  /**
   * Checks if a renderer exists for a specific value type and component type.
   * 
   * This method can be used to verify whether a renderer is registered for a given type
   * and component before attempting to render content dynamically.
   * 
   * @param {string} type - The value type (e.g., 'number', 'string').
   * @param {string} componentType - The component type (e.g., 'datagridCell', 'formField').
   * @returns {boolean} - Returns `true` if a renderer is found, otherwise `false`.
   * 
   * ## Example:
   * 
   * ```typescript
   * const hasRenderer = TypeRegistry.hasRenderer('number', 'datagridCell');
   * console.log(hasRenderer); // Output: true or false depending on if a renderer exists
   * ```
   */
  static hasRenderer(type: string, componentType: string): boolean {
    return !!this.getRenderer(type, componentType);
  } 
  /**
 * Renders a component based on its registered type and value.
 *   
   @template InputType - The type of the value that the renderer handles.
   @template OutputType - The type of output that the rendering function will produce.
 * @param type - The type of the value (e.g., 'number', 'string').
 * @param value - The value to be rendered.
 * @param componentType - The type of component being rendered (e.g., 'datagridCell', 'formField').
   @param fallbackValue - The value to be rendered if no renderer is found.
 * @returns {OutputType}.The rendered content
 */
 static render<InputType = any,OutputType=any>(type: string, value: InputType, componentType: string,fallbackValue?:OutputType): OutputType {
    const renderer = TypeRegistry.getRenderer<InputType,OutputType>(type, componentType);
    if (renderer) {
      return renderer(value) as OutputType;
    } 
    return fallbackValue as OutputType;
  }
}


/**
 * A decorator factory that registers a rendering function for a specific type and component.
 *
 * This function creates a decorator that can be applied to a rendering function,
 * allowing the user to register that function with the `TypeRegistry` under a specific
 * type and component type. This makes it easy to extend rendering capabilities for 
 * different components dynamically.
 *
 * @template InputType - The type of input that the rendering function will accept.
 * @template OutputType - The type of output that the rendering function will produce.
 *
 * @param {string} componentType - The type of component being registered (e.g., 'datagridCell', 'formField').
 * @returns {function(type: string): function(target: ITypeRegistryRenderer<InputType, OutputType>): void} - 
 * A decorator function that accepts the type and registers the rendering function.
 *
 * ## Example:
 *
 * ```typescript
 * // Create a number renderer for datagrid cells
 * const numberRenderer: ITypeRegistryRenderer<number, string> = (value) => {
 *   return `<div class="cell number">${value}</div>`;
 * };
 *
 * // Use the decorator to register the renderer
 * @createTypeRegistryDecorator<number, string>('datagridCell')('number')
 * class NumberCellRenderer {
 *   render(value: number): string {
 *     return numberRenderer(value);
 *   }
 * }
 *
 * // The number renderer can now be used in a datagrid
 * const renderer = TypeRegistry.getRenderer('number', 'datagridCell');
 * console.log(renderer(123)); // Output: <div class="cell number">123</div>
 * ```
 */
export function createTypeRegistryDecorator<InputType = any, OutputType = any>(componentType: string) {
  return (type: string) => {
    return function (target: ITypeRegistryRenderer<InputType, OutputType>): void {
      // Register the rendering function with the TypeRegistry
      TypeRegistry.register(type, componentType, target);
    };
  };
}
