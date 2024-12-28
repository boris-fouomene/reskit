import { ITextInputProps } from "@components/TextInput/types";

declare module "@resk/core" {
    interface IFieldBase extends Partial<Omit<ITextInputProps, "type" | "value" | "onChange">> {

    }
}