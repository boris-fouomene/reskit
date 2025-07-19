"use client";
import { ISwitchProps, IToggleableProps, Switch } from "@components/Switch";
import { getToggleableDefaultValues } from "@components/Switch/utils";
import { Form, IFormFieldProps, AttachFormField } from "../base";
import { IField, IFieldType } from "@resk/core/resources";

@AttachFormField<"switch">("switch")
export class FormFieldSwitch<Type extends IFieldType = "switch"> extends Form.Field<Type, any> {
    isTextField(): boolean {
        return false;
    }
    getDefaultValues(props: IField<Type>) {
        return getToggleableDefaultValues((props || this.props) as IToggleableProps);
    }
    sanitizeValue(value: any) {
        const { checkedValue, uncheckedValue } = this.getDefaultValues(this.props as any);
        return value === checkedValue ? checkedValue : uncheckedValue;
    }
    _render(props: IField<Type>, innerRef: any) {
        return <Switch  {...(props as ISwitchProps)} />;
    }
}

interface IFormFieldSwitchProps extends IFormFieldProps<"switch", any, ISwitchProps["onChange"]>, Omit<ISwitchProps, "onChange"> { }

declare module "@resk/core/resources" {
    export interface IFieldMap {
        switch: IFormFieldSwitchProps;
    }
}