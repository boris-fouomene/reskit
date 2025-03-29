import { JSX } from "react/jsx-runtime";
import { FormFieldSwitch } from "./Switch";
import { Checkbox } from "@components/Checkbox";
import { AttachFormField } from "../Field";
import { IField } from "@resk/core/types";
@AttachFormField<"checkbox">("checkbox")
export class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
    _render(props: IField<"checkbox">, innerRef: any): JSX.Element {
        return <Checkbox {...(props as any)} />;
    }
}