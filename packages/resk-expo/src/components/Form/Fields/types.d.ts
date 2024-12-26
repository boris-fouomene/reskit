import { } from "@resk/core";
import { ITextInputProps } from "@components/TextInput/types";

declare module "@resk/core" {
    interface IFieldBase extends Omit<ITextInputProps, "value" | "onChange"> {

    }
}
