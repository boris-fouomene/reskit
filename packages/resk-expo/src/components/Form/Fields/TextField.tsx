import "./types";
import { Field, FormField } from "../Field";

@FormField("text")
class FormFieldText extends Field<"text"> {
    isTextField(): boolean {
        return true;
    }
}