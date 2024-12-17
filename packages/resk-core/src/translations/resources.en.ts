import { I18n } from "@/i18n";

I18n.RegisterDictionary({
    "en": {
        /***
         * @param {string} resourceLabel - The label of the resource.
         * @param {string} resourceName - The name of the resource.
         * @returns {string} - The translated string.
         */
        "resources": {
            "createForbiddenError": "You are not authorized to create a {resourceLabel} resource",
            "readForbiddenError": "You are not authorized to read a {resourceLabel} resource",
            "updateForbiddenError": "You are not authorized to update a {resourceLabel} resource",
            "deleteForbiddenError": "You are not authorized to delete a {resourceLabel} resource",
            "detailsForbiddenError": "You are not authorized to view details of a {resourceLabel} resource",
            "invalidDataProvider": "Invalid data provider for {resourceLabel} resource",
        }
    }
});