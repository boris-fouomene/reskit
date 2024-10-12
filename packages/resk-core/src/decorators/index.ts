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
export function createDecorator<KeyType = any, ValueType = any>(key: KeyType) {
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
export function createDecoratorProperty<KeyType = any, ValueType = any>(key: KeyType, defaultValue?: ValueType) {
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
