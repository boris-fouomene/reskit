import { FormField, IFormFieldProps } from "../base";
import { AttachFormField } from "../attachFormField";
import { CountrySelector, ICountrySelectorProps } from "@components/CountrySelector";

@AttachFormField("selectCountry")
export class SelectCountryField extends FormField<"selectCountry"> {
    isTextField(): boolean {
        return false;
    }
    getType() {
        return "selectCountry" as 'selectCountry';
    }
    _render(props: any, innerRef?: any) {
        return <CountrySelector
            ref={innerRef}
            displayDialCode={false}
            anchor={undefined}
            {...props}
        />;
    }
}

interface IFormFieldSelectCountryProps extends IFormFieldProps<"selectCountry", ICountrySelectorProps["defaultValue"], ICountrySelectorProps["onChange"]>, Omit<ICountrySelectorProps, "onChange"> { }

declare module "@resk/core/resources" {
    export interface IFieldMap {
        selectCountry: IFormFieldSelectCountryProps;
    }
}