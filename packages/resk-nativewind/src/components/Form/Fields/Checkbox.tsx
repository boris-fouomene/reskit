"use client";
import { FormFieldSwitch } from "./Switch";
import { Checkbox, ICheckboxProps } from "@components/Checkbox";
import { IField } from "@resk/core/resources";
import { ReactElement } from "react";
import { IFormFieldProps, AttachFormField } from "../base";
@AttachFormField<"checkbox">("checkbox")
export class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
    _render(props: IField<"checkbox">, innerRef: any): ReactElement {
        return <Checkbox {...(props as any)} ref={innerRef} />;
    }
}


interface IFormFieldCheckboxProps extends IFormFieldProps<"checkbox", any, ICheckboxProps["onChange"]>, Omit<ICheckboxProps, "ref" | "onChange"> { }

declare module "@resk/core/resources" {
    export interface IFieldMap {
        checkbox: IFormFieldCheckboxProps;
    }
}