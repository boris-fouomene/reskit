
import { getToggleableDefaultValues, ISwitchProps, IToggleableProps, Switch } from "@components/Switch";
import { Field, FormField } from "../Field";
import { StyleSheet } from "react-native";
import { IFieldType } from "@resk/core";
import { IFormFieldProps } from "../types";

@FormField<"switch">("switch")
export class FormFieldSwitch<Type extends IFieldType = "switch"> extends Field<Type> {
    isTextField(): boolean {
        return false;
    }
    getDefaultValues(props: IFormFieldProps<Type>) {
        return getToggleableDefaultValues((props || this.props) as IToggleableProps);
    }
    sanitizeValue(value: any) {
        const { checkedValue, uncheckedValue } = this.getDefaultValues(this.props as any);
        return value === checkedValue ? checkedValue : uncheckedValue;
    }
    getComponentProps(props?: IFormFieldProps<Type> | undefined): IFormFieldProps<Type> {
        const p = super.getComponentProps(props);
        p.keyboardEventHandlerProps = Object.assign({}, p.keyboardEventHandlerProps);
        p.keyboardEventHandlerProps.style = [styles.keyboardEventHandler, p.keyboardEventHandlerProps.style];
        return p;
    }
    _render({ keyboardEventHandlerProps, ...props }: IFormFieldProps<Type>, innerRef: any) {
        return <Switch  {...(props as ISwitchProps)} />;
    }
}
const styles = StyleSheet.create({
    keyboardEventHandler: {
        justifyContent: "center",
    },
});