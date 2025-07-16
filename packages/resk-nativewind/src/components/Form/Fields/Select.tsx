import { Field, AttachFormField } from "../Field";
import { Dropdown } from "@components/Dropdown";

@AttachFormField("select")
export class FormFieldSelect extends Field<"select"> {
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