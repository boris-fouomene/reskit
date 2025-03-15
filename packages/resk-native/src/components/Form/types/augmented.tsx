import { ICheckboxProps } from "@components/Checkbox/types";
import { ISwitchProps, IToggleableOnChangeOptions } from "@components/Switch/types";
import { IFormFieldOnChangeOptions } from "./index";
import { IDropdownOnChangeOptions, IDropdownProps } from "@components/Dropdown";
import { ITextInputProps } from "@components/TextInput/types";
import "@resk/core";
import { IMergeWithoutDuplicates } from "@resk/core";


declare module "@resk/core" {
    export interface IFieldMap {
        switch: Omit<IMergeWithoutDuplicates<ISwitchProps, IFieldBase>, "onChange" | "type"> & { type: "switch", onChange?: (options: IFormFieldOnChangeOptions<"switch"> & Partial<IToggleableOnChangeOptions>) => void };
        checkbox: Omit<IMergeWithoutDuplicates<ISwitchProps, IFieldBase>, "onChange" | "type"> & { type: "checkbox", onChange?: (options: IFormFieldOnChangeOptions<"checkbox"> & Partial<IToggleableOnChangeOptions>) => void };
        select: Omit<IMergeWithoutDuplicates<IDropdownProps, IFieldBase>, "onChange" | "type"> & { type: "select"; onChange?: (options: IFormFieldOnChangeOptions<"select"> & Partial<IDropdownOnChangeOptions>) => void; };
        selectCountry: Omit<IMergeWithoutDuplicates<IDropdownProps, IFieldBase>, "onChange" | "type"> & { type: "selectCountry"; onChange?: (options: IFormFieldOnChangeOptions<"select"> & Partial<IDropdownOnChangeOptions>) => void; };
        text: Omit<IMergeWithoutDuplicates<ITextInputProps, IFieldBase>, "type"> & { type: "text" };
        number: Omit<IMergeWithoutDuplicates<ITextInputProps, IFieldBase>, "type"> & { type: "number" };

        date: Omit<IMergeWithoutDuplicates<ITextInputProps, IFieldBase>, "type"> & { type: "date" };

        datetime: Omit<IMergeWithoutDuplicates<ITextInputProps, IFieldBase>, "type"> & { type: "datetime" };

        time: Omit<IMergeWithoutDuplicates<ITextInputProps, IFieldBase>, "type"> & { type: "time" };

        tel: Omit<IMergeWithoutDuplicates<ITextInputProps, IFieldBase>, "type"> & { type: "tel" };
    }
}