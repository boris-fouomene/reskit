import { FormFieldSwitch } from "./Switch";
import { Checkbox, ICheckboxProps } from "@components/Checkbox";
import { AttachFormField } from "../index";
import { IField } from "@resk/core/types";
import { ReactElement } from "react";
import { IFormFieldProps } from "../base";
@AttachFormField<"checkbox">("checkbox")
export class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
    _render(props: IField<"checkbox">, innerRef: any): ReactElement {
        return <Checkbox {...(props as any)} ref={innerRef} />;
    }
}


interface IFormFieldCheckboxProps extends IFormFieldProps<"checkbox">, Omit<ICheckboxProps, "ref"> { }

declare module "@resk/core/resources" {
    export interface IFieldMap {
        checkbox: IFormFieldCheckboxProps;
    }
}