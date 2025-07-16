import { JSX } from "react/jsx-runtime";
import { FormFieldSwitch } from "./Switch";
import { Checkbox } from "@components/Checkbox";
import { AttachFormField } from "../Field";
import { IField } from "@resk/core/types";
import { ReactElement } from "react";
@AttachFormField<"checkbox">("checkbox")
export class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
    _render(props: IField<"checkbox">, innerRef: any): ReactElement {
        return <Checkbox {...(props as any)} />;
    }
}