import { IToggleableProps } from "@components/Switch";
import { ITextInputProps } from "@components/TextInput/types";
import { IFieldBase } from "@resk/core";

declare module "@resk/core" {
    interface IFieldBase extends Partial<Omit<ITextInputProps, "type" | "value" | "onChange">> {

    }

    interface IFieldMap {
        switch: IFieldBase<"switch"> & Omit<Partial<IToggleableProps>, "type" | "value" | "onChange">;
        checkbox: IFieldBase<"checkbox"> & Omit<Partial<IToggleableProps>, "type" | "value" | "onChange">;
    }
}