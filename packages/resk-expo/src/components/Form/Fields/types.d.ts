import { } from "@resk/core";
import { ITextInputProps } from "@components/TextInput/types";

declare module "@resk/core" {
    interface IFieldBase extends Omit<Partial<ITextInputProps, "type", "value" | "onChange">> {

    }
}
