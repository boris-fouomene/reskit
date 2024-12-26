import { Field, FormField } from "../Field";

@FormField("text")
class TextField extends Field {
    isTextField(): boolean {
        return true;
    }
}