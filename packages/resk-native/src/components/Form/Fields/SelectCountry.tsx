import { Field, FormField } from "../Field";
import { SelectCountry } from "@components/SelectCountry";

@FormField("selectCountry")
export class SelectCountryField extends Field<"selectCountry"> {
    isTextField(): boolean {
        return false;
    }
    getType() {
        return "selectCountry";
    }
    _render(props: any, innerRef?: any) {
        return <SelectCountry
            ref={innerRef}
            displayDialCode={false}
            anchor={undefined}
            {...props}
        />;
    }
}