import { I18n } from "@resk/core";
I18n.RegisterTranslations({
    "en": {
        "form": {
            /**
             * @group form
             * @interface IFormValidationRule
             * Represents a validation rule for form fields.
             */
            "validation": {
                "invalidValidationRule": "Invalid validation rule: %{rule}",
                "invalidValidationMessage": "Invalid validation message for rule %{rule}; error validating value %{value}",
                "required": "This field is required",
                "minLength": "This field must be at least %{minLength} characters long",
                "maxLength": "This field must be at most %{maxLength} characters long",
                "minValue": "This field must be at least %{minValue}",
                "maxValue": "This field must be at most %{maxValue}",
                "pattern": "This field must match the pattern %{pattern}",
                "email": "This field must be a valid email address",
                "url": "This field must be a valid URL",
                "date": "This field must be a valid date",
                "time": "This field must be a valid time",
                "datetime": "This field must be a valid date and time",
                "datetime-local": "This field must be a valid date and time",
                "month": "This field must be a valid month",
                "week": "This field must be a valid week",
                "number": "This field must be a valid number",
                "integer": "This field must be a valid integer",
                "float": "This field must be a valid float",
            }
        }
    }
});