import TextInput from "./Input";
import { ITextInputProps } from "./types";

export function TelInput({ phoneCountryCode, ...props }: ITextInputProps) {
    const editable = !props.disabled && props.editable !== false && !props.readOnly;
    return <TextInput
        {...props}
    />
}

export interface ITelInputProps extends Omit<ITextInputProps, "type"> {
    type: "tel";
}