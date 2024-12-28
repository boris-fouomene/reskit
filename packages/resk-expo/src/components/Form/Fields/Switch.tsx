import { getToggleableDefaultValues, ISwitchProps, IToggleableProps, Switch } from "@components/Switch";
import { IFormFieldProps } from "../types";
import { Field, FormField } from "../Field";

@FormField<"switch">("switch")
class FormFieldSwitch extends Field<"switch"> {
    isTextField(): boolean {
        return false;
    }
    getDefaultValues(props: IToggleableProps) {
        return getToggleableDefaultValues((props || this.props) as IToggleableProps);
    }
    sanitizeValue(value: any) {
        const { checkedValue, uncheckedValue } = this.getDefaultValues(this.props as IToggleableProps);
        return value === checkedValue ? checkedValue : uncheckedValue;
    }
    _render(props: IFormFieldProps<"switch">, innerRef: any) {
        return <Switch {...(props as ISwitchProps)} />;
    }
}