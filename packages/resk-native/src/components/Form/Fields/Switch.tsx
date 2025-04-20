
import { getToggleableDefaultValues, ISwitchProps, IToggleableProps, Switch } from "@components/Switch";
import { Field, AttachFormField } from "../Field";
import { StyleSheet } from "react-native";
import { IFieldType, IField } from "@resk/core/types";
import { IViewStyle } from "@src/types";

@AttachFormField<"switch">("switch")
export class FormFieldSwitch<Type extends IFieldType = "switch"> extends Field<Type> {
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
    /**
     * Retrieves and modifies the component properties for the form field switch.
     * 
     * @param {IField<Type> | undefined} [props] - Optional properties for the field.
     * If not provided, default properties from the superclass are used.
     * 
     * @returns {IField<Type>} The updated field properties with an additional
     * style for keyboard event handling added to the container's style.
     */
    getComponentProps(props?: IField<Type> | undefined): IField<Type> {
        const p = super.getComponentProps(props);
        p.containerProps = Object.assign({}, p.containerProps);
        p.containerProps.style = [styles.keyboardEventHandler, p.containerProps?.style as IViewStyle];
        return p;
    }
    _render({ containerProps, ...props }: IField<Type>, innerRef: any) {
        return <Switch  {...(props as ISwitchProps)} />;
    }
}
const styles = StyleSheet.create({
    keyboardEventHandler: {
        justifyContent: "center",
    },
});