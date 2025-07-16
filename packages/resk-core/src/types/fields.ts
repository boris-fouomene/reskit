import { IAuthPerm } from "@/auth/types";
import { IResourceActionTupleObject } from "./resources";
import { IInputFormatterOptions } from "../inputFormatter/types";

export interface IFieldBase<FieldType extends IFieldType = IFieldType> extends Partial<IResourceActionTupleObject>, Omit<IInputFormatterOptions, "value" | "type"> {
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
  type: FieldType;

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

  /***
   * weatherr the field is a primary key or not
   */
  primaryKey?: boolean;

  /**
   * weatherr the field is rendable or not
   * It is used to determine if the field should be rendered or not.
   */
  rendable?: boolean;

  /***
   * weatherr the field is readonly or not
   */
  readOnly?: boolean;

  /**
   * weatherr the field is disabled or not
   */
  disabled?: boolean;

  /***
   * weatherr the field is unique for the resource or not
   */
  unique?: boolean;

  /**
   * weatherr the field is required or not
   */
  required?: boolean;

  /***
   * the min length of the field
   */
  minLength?: number;
  /**
   * the max length of the field
   */
  maxLength?: number;

  /**
   * the length of the field
   */
  length?: number;

  /***
   * whether the field is visible or not
   */
  visible?: boolean;

  /***
   * The permission associated with the field. This permission is used to determine if the field will be rendered or not.
   */
  perm?: IAuthPerm;
}
// Mapped type that ensures all values in IFieldMap extend IFieldBase
export interface IFieldMap {}

export interface IFieldActionsMap {
  create: string;
  update: string;
  createOrUpdate: string;
  list: string;
  filter: string;
}

export type IField<T extends IFieldType = IFieldType> =
  IFieldMap[T] extends IFieldBase<T>
    ? IFieldMap[T] & {
        [key in keyof IFieldActionsMap]?: Partial<IFieldMap[IFieldType]>;
      }
    : keyof IFieldMap extends never
      ? IFieldBase<T>
      : never;

export type IFields = Record<string, IField>;

export type IFieldType = keyof IFieldMap;
