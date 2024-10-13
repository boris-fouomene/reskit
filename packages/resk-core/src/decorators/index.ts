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