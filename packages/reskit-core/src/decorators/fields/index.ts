import {IField } from '../../types';
export const fieldsMetaData = "fieldsResourcesMetadata";

/**
 * Decorator function to define metadata for a class property.
 *
 * This function allows specifying field options, including the type, and automatically assigns a default type if none is specified.
 *
 * @template T - The type of the field, extending IFieldType. Defaults to `any` if not specified.
 * @param {IField<T>} options - An object containing field options.
 *                              - `type` (optional): The type of the field (string, number, boolean, etc.)
 *                              - Additional options specific to the field type defined in IField.
 * @returns A decorator function that sets metadata on the target property.
 * @example
 * ```typescript
 * class MyClass {
 *   @Field({ type: 'string' }) myField: string;
 * }
 * ```
 */
export function Field<T = any>(options: IField<T>) {
  /**
   * Returns a decorator function that sets metadata on the target property.
   */
  return (target: any, propertyKey: string) => {
    /**
     * Get existing fields metadata or initialize an empty object.
     */
    const fields = Object.assign({}, Reflect.getMetadata(fieldsMetaData, target) || {});

    /**
     * Retrieve the type of the property from metadata.
     */
    const reflecType = String(Reflect.getMetadata('design:type', target, propertyKey)?.name).toLowerCase();

    /**
     * Assign a default type if none is specified and the type is primitive.
     */
    if ((options as Record<string, any>).label === undefined) {
      (options as Record<string, any>).type = ['string', 'number', 'boolean', 'date'].includes(reflecType) ? reflecType : "text";
    }

    /**
     * Store the options in the fields object using propertyKey as the key.
     */
    fields[propertyKey] = { name: propertyKey, ...options };

    /**
     * Define the updated metadata on the target constructor.
     */
    Reflect.defineMetadata(fieldsMetaData, fields, target);
  };
}
/**
 * Retrieves the fields metadata from a class target.
 *
 * This function uses reflection to access the metadata associated with the given target class.
 * It returns an object where the keys are property names, and the values are objects containing the type, name, and any additional options defined in the field metadata.
 *
 * @param {any} target - The target class or instance from which to retrieve the metadata.
 * @returns {Record<string, ({ name: string } & IField)>} An object mapping property names to their corresponding metadata, which includes the type and other options.
 * @example
 * ```typescript
 * class MyClass {
 *   @Field({ type: 'string' }) myField: string;
 * }
 * const fields = getFields(MyClass);
 * console.log(fields); // Output: { myField: { name: 'myField', type: 'string' } }
 * ```
 */
export function getFields(target: any): Record<string, ({ name: string } & IField)> {
  /**
   * Use Reflect.getMetadata to retrieve the metadata stored under the fieldsMetaData key.
   * If no metadata is found, it will return undefined.
   */
  const fields = Reflect.getMetadata(fieldsMetaData, target);

  /**
   * Merge the retrieved metadata into a new object using Object.assign.
   * This creates a new object that contains the fields metadata, effectively cloning it.
   */
  return Object.assign({}, fields);
}
