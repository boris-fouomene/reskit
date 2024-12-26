import { I18n } from "@/i18n";

I18n.RegisterTranslations({
    "en": {
        /***
         * @param {string} resourceLabel - The label of the resource.
         * @param {string} resourceName - The name of the resource.
         * @returns {string} - The translated string.
         */
        "resources": {
            "createForbiddenError": "You are not authorized to create a %{resourceLabel} resource",
            "readForbiddenError": "You are not authorized to read a %{resourceLabel} resource",
            "updateForbiddenError": "You are not authorized to update a %{resourceLabel} resource",
            "deleteForbiddenError": "You are not authorized to delete a %{resourceLabel} resource",
            "detailsForbiddenError": "You are not authorized to view details of a %{resourceLabel} resource",
            "invalidDataProvider": "Invalid data provider for %{resourceLabel} resource",
            "listForbiddenError": "You are not authorized to list %{resourceLabel} resources",

            /***
             * resources actions translations structure : 
             * Here is an example of the structure of the translations for the "user" resource:
             *          user: {
             *                 label: "User",
             *                 title: "User Information",
             *                 tooltip: "Manage user data",
             *                 create: {
             *                    label: "Create User",
             *                    title: "Create a new user",
             *                    tooltip: "Click to add a new user.",
             *                 },
             *                 read: {
             *                    label: "View User",
             *                    title: "View a specific user",
             *                    tooltip: "Click to view a specific user.",
             *                 },    
             *                 update: {
             *                    label: "Update User",
             *                    title: "Update a specific user",
             *                    tooltip: "Click to update a specific user.",
             *                    zero: "No users to update.",
             *                    one: "Updated one user.",
             *                    other: "Updated %{count} users.",
             *                },
             *                delete : {
             *                    label: "Delete User",
             *                    title: "Delete a specific user",
             *                    tooltip: "Click to delete a specific user.",
             *                    zero: "No users to delete.",
             *                    one: "Deleted one user.",
             *                    other: "Deleted %{count} users.", 
             *                },
             *                list : {
             *                    label: "List Users",
             *                    title: "List all users",
             *                    tooltip: "Click to list all users.",
             *                    zero: "No users to list.",
             *                    one: "Listed one user.",
             *                    other: "Listed %{count} users.",
             *                },
             *                details : {
             *                    label: "View User Details",
             *                    title: "View user details", 
             *                    tooltip: "Click to view user details.",
             *                    zero: "No user details to view.",
             *                    one: "Viewed one user details.",  
             *                    other: "Viewed %{count} user details.",
             *                }
            *             }
            */
        }
    }
});