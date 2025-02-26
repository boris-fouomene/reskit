import { Field, FormField } from "../Field";
import { Dropdown } from "@components/Dropdown";

//@FormField("select")
class SelectField extends Field<"select"> {
    isTextField(): boolean {
        return false;
    }
    getType() {
        return "select";
    }
    _render(props: any, innerRef?: any) {
        return <Dropdown
            ref={innerRef}
            {...props}
        />;
    }
}