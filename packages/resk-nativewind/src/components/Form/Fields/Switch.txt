
import { ISwitchProps, IToggleableProps, Switch } from "@components/Switch";
import { getToggleableDefaultValues } from "@components/Switch/utils";
import { FormField, AttachFormField, IFormFieldProps } from "../base";
import { IField, IFieldType } from "@resk/core/resources";

@AttachFormField<"switch">("switch")
export class FormFieldSwitch<Type extends IFieldType = "switch"> extends FormField<Type, any> {
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
    _render({ containerProps, ...props }: IField<Type>, innerRef: any) {
        return <Switch  {...(props as ISwitchProps)} />;
    }
}

interface IFormFieldSwitchProps extends IFormFieldProps<"switch", any, ISwitchProps> { }

declare module "@resk/core/resources" {
    export interface IFieldMap {
        switch: IFormFieldSwitchProps;
    }
}