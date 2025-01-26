import { I18n } from "@resk/core";

I18n.RegisterTranslations({
    en: {
        "validator": {
            "invalidFieldRule": "Invalid rule  %{rule} for field  %{fieldName} in controller  %{controllerName} with ruleName  %{ruleName} and rawRuleName  %{rawRuleName}",
            "invalidMessage": "Invalid message for rule  %{rule} for field  %{fieldName} in controller  %{controllerName} with ruleName  %{ruleName} and rawRuleName  %{rawRuleName}",
        },
        "auth": {
            "invalidStrategy": "Invalid Auth strategy  [%{strategyName}].",
            "startegyNameNotFound": "Auth Strategy name  [%{strategyName}] not found",
        }
    },
})