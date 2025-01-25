import { I18n } from "../i18n";
I18n.RegisterTranslations({
    "en": {
        /**
         * @group Validator
         */
        "validator": {
            "separators": {
                "multiple": ", ",
                "single": ", ",
                "and": " and ",
                "or": " or "
            },
            "failedForNFields": "Validation failed for %{count} fields",
            //use for validating multi data
            "failedForNItems": "Validation failed for %{count} items",
            "invalidRule": "Invalid validation rule: %{rule}",
            "invalidMessage": "Invalid validation message for rule %{rule}; error validating value %{value}",
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
            "fileName": "This field must be a valid file name",
            "isNumber": "This field must be a valid number",
            "isNonNullString": "This field must be a non null string",
            "length": "This field must be exactly %{length} characters long",
            "lengthRange": "This field must be between %{minLength} and %{maxLength} characters long",
            "numberLessThanOrEquals": "This field must be less than or equal to %{ruleParams[0]}",
            "numberLessThan": "This field must be less than %{ruleParams[0]}",
            "numberGreaterThanOrEquals": "This field must be greater than or equal to %{ruleParams[0]}",
            "numberGreaterThan": "This field must be greater than %{ruleParams[0]}",
            "noteEquals": "This field must be different from %{ruleParams[0]}",
            "numberIsDifferentFrom": "This field must be different from %{ruleParams[0]}",
            "numberEquals": "This field must be equal to %{ruleParams[0]}",
            "tests": {
                "entity": {
                    "name": "Name",
                    "id": "Id",
                    "email": "Email",
                    "aString": "A String",
                    "url": "Url",
                    "note": "Note",
                    "createdAt": "Created At",
                    "updatedAt": "Updated At"
                }
            }
        }
    }
});