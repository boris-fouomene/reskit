import { IFieldType } from "@resk/core/types";
import { FormField, IFormFieldComponent, IFormFieldState } from "./base";

export function AttachFormField<FieldType extends IFieldType = IFieldType, ValueType = any, TState extends IFormFieldState<FieldType, any> = IFormFieldState<FieldType, any>>(type: FieldType) {
    return (target: IFormFieldComponent<FieldType, ValueType, TState>) => {
        FormField.registerComponent<FieldType, ValueType, TState>(type, target as typeof FormField);
    };
}
