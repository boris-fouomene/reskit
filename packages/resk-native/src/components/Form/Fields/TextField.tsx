import { isNonNullString } from "@resk/core";
import { Field, FormField } from "../Field";
import { IFormFieldOnChangeOptions } from "../types";

@FormField("text")
class FormFieldText extends Field<"text"> {
    callOnChange(options: IFormFieldOnChangeOptions<"text">): void {
        if (options.value && String(options.type) === "tel" && isNonNullString(options.dialCode)) {
            const dialCode = "+" + options.dialCode.trim().ltrim("+");
            if (!options.value.trim().startsWith(dialCode)) {
                options.value = dialCode + options.value.trim();
            }
        }
        return super.callOnChange(options);
    }
    isTextField(): boolean {
        return true;
    }
}