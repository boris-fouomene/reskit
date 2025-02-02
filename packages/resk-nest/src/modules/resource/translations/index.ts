import { I18n } from "@resk/core";

I18n.RegisterTranslations({
    en: {
        "validator": {
            "invalidFieldRule": "Invalid rule  %{rule} for field  %{fieldName} in controller  %{controllerName} with ruleName  %{ruleName} and rawRuleName  %{rawRuleName}",
            "invalidMessage": "Invalid message for rule  %{rule} for field  %{fieldName} in controller  %{controllerName} with ruleName  %{ruleName} and rawRuleName  %{rawRuleName}",
        },
        "auth": {
            "invalidStrategy": "Invalid Auth strategy  [%{strategyName}].",
            "strategyNameNotFound": "Auth Strategy name  [%{strategyName}] not found",
            "invalidStrategyName": "Invalid Auth strategy name.",
            "guards": {
                "permissions": {
                    "forbiddenError": "You do not have permission to access this resource.",
                },
            }
        },
        "typeorm": {
            "entityWithPrimaryNotFound": "Entity with primary key %{primaryKey} not found",
            "entityWithPrimaryAlreadyExists": "Entity with primary key %{primaryKey} already exists",
            "invalidWhereConditionOnUpdate": "Invalid where condition, The where condition must contain at least one field. We are unable to update the data.",
            "entityNotFound": "Entity with ID %{id} not found",
            "invalidWhereConditionOnDelete": "Invalid where condition, The where condition must contain at least one field. We are unable to delete the data.",
            "invalidDataProvider": "Invalid data provider",
        },
        "resources": {

        }
    },
})