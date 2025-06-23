import { I18nClass } from "@/i18n";

I18nClass.RegisterTranslations({
  en: {
    /***
     * @param {string} resourceLabel - The label of the resource.
     * @param {string} resourceName - The name of the resource.
     * @returns {string} - The translated string.
     */
    httpClient: {
      runTimeoutError: "response time expired!! server where requested resource may not be available",
      serverUnreachable: "Impossible de se connecter au serveur/ le client ne peut pas recevoir la réponse dans le délai imparti.",
    },
  },
});
