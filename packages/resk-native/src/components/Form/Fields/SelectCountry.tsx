import { Field, FormField } from "../Field";
import { SelectCountry } from "@components/SelectCountry";

@FormField("selectCountry")
class SelectCountryField extends Field<"selectCountry"> {
    isTextField(): boolean {
        return false;
    }
    getType() {
        return "selectCountry";
    }
    _render(props: any, innerRef?: any) {
        return <SelectCountry
            ref={innerRef}
            minWidth={300}
            anchor={undefined}
            getItemLabel={({ item }) => `[${item.code}] - ${item.name}`}
            {...props}
        />;
    }
}