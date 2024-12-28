import { JSX } from "react/jsx-runtime";
import { IFormFieldProps } from "../types";
import { FormFieldSwitch } from "./Switch";
import { Checkbox } from "@components/Checkbox";
import { FormField } from "../Field";

@FormField<"checkbox">("checkbox")
class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
    _render(props: IFormFieldProps<"checkbox">, innerRef: any): JSX.Element {
        return <Checkbox {...(props as any)} />;
    }
}