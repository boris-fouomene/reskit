import { IField } from "@resk/core/types";
import { IFormFieldProps } from "../base";
import { FormField, AttachFormField } from "../base";
import { Dropdown, IDropdownProps } from "@components/Dropdown";
import { ITextInputProps } from "@components/TextInput";

@AttachFormField("select")
export class FormFieldSelect extends FormField<"select"> {
    isTextField(): boolean {
        return false;
    }

    _render(props: IField<"select">, innerRef?: any) {
        return <Dropdown
            ref={innerRef}
            {...props as any}
        />;
    }
}

interface IFormFieldSelectProps extends IFormFieldProps<"select", any, IDropdownProps["onChange"]>, Omit<IDropdownProps<any, any>, "defaultValue" | "onChange"> { }

declare module "@resk/core/resources" {
    export interface IFieldMap {
        select: IFormFieldSelectProps;
    }
}