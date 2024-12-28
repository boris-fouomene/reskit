import "./types";
import { Field, FormField } from "../Field";

@FormField("text")
class FormFieldText extends Field {
    isTextField(): boolean {
        return true;
    }
}