import { getToggleableDefaultValues, ISwitchProps, IToggleableProps, Switch } from "@components/Switch";
import { Field, FormField } from "../Field";
import { StyleSheet } from "react-native";
import { IFieldType, IField } from "@resk/core";

@FormField<"switch">("switch")
export class FormFieldSwitch<Type extends IFieldType = "switch"> extends Field<Type> {
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
    getComponentProps(props?: IField<Type> | undefined): IField<Type> {
        const p = super.getComponentProps(props);
        p.keyboardEventHandlerProps = Object.assign({}, p.keyboardEventHandlerProps);
        p.keyboardEventHandlerProps.style = [styles.keyboardEventHandler, p.keyboardEventHandlerProps.style];
        return p;
    }
    _render({ keyboardEventHandlerProps, ...props }: IField<Type>, innerRef: any) {
        return <Switch  {...(props as ISwitchProps)} />;
    }
}
const styles = StyleSheet.create({
    keyboardEventHandler: {
        justifyContent: "center",
    },
});