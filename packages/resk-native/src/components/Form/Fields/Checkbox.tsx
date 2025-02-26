import { JSX } from "react/jsx-runtime";
import { FormFieldSwitch } from "./Switch";
import { Checkbox } from "@components/Checkbox";
import { FormField } from "../Field";
import { IField } from "@resk/core";

@FormField<"checkbox">("checkbox")
class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
    _render(props: IField<"checkbox">, innerRef: any): JSX.Element {
        console.log(props.label," is form props label1 ",props.value)
        return <Checkbox {...(props as any)} ref={innerRef}/>;
    }
}