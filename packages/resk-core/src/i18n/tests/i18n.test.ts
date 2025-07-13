import { I18n, Translate } from '../index';
import "../../utils";
import { II18nTranslation } from '../../types/i18n';
import { IObservableCallback } from '../../observable';

describe('I18n', () => {
    let i18n: I18n;

    beforeEach(() => {
        i18n = I18n.getInstance();
        i18n.registerTranslations({
            en: {
                "resources": {
                    "createForbiddenError": "You are not authorized to create a %{resourceLabel} resource",
                    "readForbiddenError": "You are not authorized to read a %{resourceLabel} resource",
                    "updateForbiddenError": "You are not authorized to update a %{resourceLabel} resource",
                    "deleteForbiddenError": "You are not authorized to delete a %{resourceLabel} resource",
                    "detailsForbiddenError": "You are not authorized to view details of a %{resourceLabel} resource",
                    "invalidDataProvider": "Invalid data provider for %{resourceLabel} resource",
                    "listForbiddenError": "You are not authorized to list %{resourceLabel} resources",
                },
                "validator": {
                    "length": "This field must be exactly %{length} characters long",
                    "lengthRange": "This field must be between %{minLength} and %{maxLength} characters long",
                    "numberLessThanOrEquals": "This field must be less than or equal to %{ruleParams[0]}",
                    "numberLessThan": "This field must be less than %{ruleParams[0]}",
                    "numberGreaterThanOrEquals": "This field must be greater than or equal to %{ruleParams[0]}",
                    "numberGreaterThan": "This field must be greater than %{ruleParams[0]}",
                    "noteEquals": "This field must be different from %{ruleParams[0]}",
                    "numberIsDifferentFrom": "This field must be different from %{ruleParams[0]}",
                    "numberEquals": "This field must be equal to %{ruleParams[0]}",
                }
            },
        });
    });
    test("sould return correct translation from validator length rules", () => {
        expect(i18n.t('validator.length', { length: 10 })).toBe("This field must be exactly 10 characters long");
        expect(i18n.t('validator.lengthRange', { minLength: 5, maxLength: 10 })).toBe("This field must be between 5 and 10 characters long");
        expect(i18n.t('validator.numberLessThanOrEquals', { ruleParams: [10] })).toBe("This field must be less than or equal to 10");
        expect(i18n.t('validator.numberLessThan', { ruleParams: [10] })).toBe("This field must be less than 10");
        expect(i18n.t('validator.numberGreaterThanOrEquals', { ruleParams: [10] })).toBe("This field must be greater than or equal to 10");
        expect(i18n.t('validator.numberGreaterThan', { ruleParams: [10] })).toBe("This field must be greater than 10");
        expect(i18n.t('validator.noteEquals', { ruleParams: ['test'] })).toBe("This field must be different from test");
        expect(i18n.t('validator.numberIsDifferentFrom', { ruleParams: [10] })).toBe("This field must be different from 10");
        expect(i18n.t('validator.numberEquals', { ruleParams: [10] })).toBe("This field must be equal to 10");
    })
    test("should return the correct translation for readForbiddenError", () => {
        const translation = i18n.t('resources.readForbiddenError', { resourceLabel: 'User' });
        expect(translation).toBe("You are not authorized to read a User resource");
    });
    test('should register and retrieve translations', () => {
        const translations: II18nTranslation = {
            en: {
                greeting: 'Hello, %{name}!',
                farewell: 'Goodbye!',
            },
        };
        i18n.registerTranslations(translations);
        expect(i18n.t('greeting', { name: 'John' })).toBe('Hello, John!');
        expect(i18n.t('farewell')).toBe('Goodbye!');
    });

    test('should trigger and handle events', () => {
        const callback: IObservableCallback = jest.fn();
        i18n.on('translations-changed', callback);
        const translations: II18nTranslation = {
            en: {
                greeting: 'Hello, %{name}!',
            },
        };
        i18n.registerTranslations(translations);
        expect(callback).toHaveBeenCalledWith('en', i18n.getTranslations());
    });

    test('should load namespace and update translations', async () => {
        const namespaceResolver = jest.fn().mockResolvedValue({
            greeting: 'Hello, %{name}!',
        });
        i18n.registerNamespaceResolver('common', namespaceResolver);
        const translations = await i18n.loadNamespace('common', 'en');
        expect(translations).toEqual({ en: { greeting: 'Hello, %{name}!' } });
        expect(i18n.t('greeting', { name: 'John' })).toBe('Hello, John!');
    });

    test('should handle invalid namespace', async () => {
        await expect(i18n.loadNamespace('invalid')).rejects.toThrow('Invalid namespace or resolver for namespace "invalid".');
    });

    class MyComponent {
        @Translate('greeting')
        greeting: string = "";

        @Translate('nested.example')
        public nestedExample: string = "";

    }

    const translations: II18nTranslation = {
        en: {
            greeting: 'Hello!',
            nested: {
                example: 'Nested Example',
            },
            farewell: 'Goodbye!',
        },
    };
    test('should resolve translations using decorator', () => {
        i18n.registerTranslations(translations);
        const component = new MyComponent();
        i18n.resolveTranslations(component);
        expect(component.greeting).toBe('Hello!');
        expect(component.nestedExample).toBe('Nested Example');
    });

    it("Expect translated options of my component", () => {
        const translatedOptions = i18n.translateTarget(MyComponent);
        expect(translatedOptions).toEqual({
            greeting: 'Hello!',
            nestedExample: 'Nested Example',
        });
    });

    test('should set and get locale', async () => {
        await i18n.setLocale('fr');
        expect(i18n.getLocale()).toBe('fr');
    });

    test('should support multiple locales', () => {
        i18n.setLocales(['en', 'fr']);
        expect(i18n.getLocales()).toEqual(['en', 'fr']);
    });

    test('should check if locale is supported', () => {
        i18n.setLocales(['en', 'fr']);
        expect(i18n.isLocaleSupported('en')).toBe(true);
        expect(i18n.isLocaleSupported('de')).toBe(false);
    });

    test('should load all namespaces', async () => {
        const namespaceResolver = jest.fn().mockResolvedValue({
            greeting: 'Hello, %{name}!',
        });
        i18n.registerNamespaceResolver('common', namespaceResolver);
        const translations = await i18n.loadNamespaces('en');
        expect(translations).toEqual({ en: { greeting: 'Hello, %{name}!' } });
    });
});


describe("i18n translateObject", () => {
    const i18n = I18n.getInstance();
    beforeAll(async () => {
        i18n.registerTranslations({
            en: {
                "user": {
                    "name": "Name",
                    "email": "Email Address",
                    "phone": "Phone Number",
                },
                actions: {
                    "save": "Save",
                    "cancel": "Cancel"
                },
                "nested": {
                    deep: {
                        value: "Deep nested value",
                    }
                },
                validation: {
                    "required": "This field is required",
                    "email": {
                        "invalid": "Please enter a valid email",
                    },
                    "minLength": "Minimum length required",
                    "maxLength": "Maximum length exceeded",
                }
            },
            fr: {
                user: {
                    "name": "Nom",
                    "email": "Adresse Email",
                    "phone": "Numéro de Téléphone",
                },
                action: {
                    "actions.save": "Enregistrer",
                    "actions.cancel": "Annuler",
                },
                validation: {
                    "required": "Ce champ est requis",
                    "email": {
                        "invalid": "Veuillez saisir un email valide"
                    },
                    "minLength": "Longueur minimale requise",
                    "maxLength": "Longueur maximale dépassée"
                }
            }
        });
        i18n.setLocales(["env", "fr"]);
        await i18n.setLocale("en");
    });

    it("should translate an object with translation keys as values", () => {
        const formLabels = {
            name: "user.name",
            email: "user.email",
            phone: "user.phone"
        };
        const result = i18n.translateObject(formLabels);
        expect(result).toEqual({
            name: "Name",
            email: "Email Address",
            phone: "Phone Number"
        });
    });

    it("should translate button configuration object", () => {
        const buttonConfig = {
            saveButton: "actions.save",
            cancelButton: "actions.cancel"
        };

        const result = i18n.translateObject(buttonConfig);

        expect(result).toEqual({
            saveButton: "Save",
            cancelButton: "Cancel"
        });
    });

    it("should translate validation messages object", () => {
        const validationMessages = {
            required: "validation.required",
            email: "validation.email.invalid",
            minLength: "validation.minLength",
            maxLength: "validation.maxLength"
        };

        const result = i18n.translateObject(validationMessages);

        expect(result).toEqual({
            required: "This field is required",
            email: "Please enter a valid email",
            minLength: "Minimum length required",
            maxLength: "Maximum length exceeded"
        });
    });

    it("should work with different locales", async () => {
        await i18n.setLocale("fr");
        const formLabels = {
            name: "user.name",
            email: "user.email"
        };

        const result = i18n.translateObject(formLabels);

        expect(result).toEqual({
            name: "Nom",
            email: "Adresse Email"
        });

        await i18n.setLocale("en");
    });

    it("should return empty object when input is not a valid object", () => {
        expect(i18n.translateObject(null as any)).toEqual({});
        expect(i18n.translateObject(undefined as any)).toEqual({});
        expect(i18n.translateObject("string" as any)).toEqual({});
        expect(i18n.translateObject(123 as any)).toEqual({});
        expect(i18n.translateObject([] as any)).toEqual({});
    });

    it("should skip non-string values", () => {
        const mixedObject = {
            validKey: "user.name",
            nullValue: null,
            undefinedValue: undefined,
            numberValue: 123,
            emptyString: ""
        };

        const result = i18n.translateObject(mixedObject as any);

        expect(result).toEqual({
            validKey: "Name"
        });
    });

    it("should handle missing translation keys gracefully", async () => {
        const objectWithMissingKeys = {
            existing: "user.name",
            missing: "non.existent.key"
        };
        await i18n.setLocale("en");
        const result = i18n.translateObject(objectWithMissingKeys);

        expect(result.existing).toBe("Name");
        expect(result.missing).toBeDefined();
    });

    it("should pass through translate options", () => {
        i18n.registerTranslations({
            en: {
                "greeting": "Hello, %{name}!"
            }
        });

        const objectWithParams = {
            greeting: "greeting"
        };

        const result = i18n.translateObject(objectWithParams, { name: "John" });

        expect(result).toEqual({
            greeting: "Hello, John!"
        });
    });

    it("should handle nested translation keys", () => {
        const nestedObject = {
            deepValue: "nested.deep.value"
        };

        const result = i18n.translateObject(nestedObject);

        expect(result).toEqual({
            deepValue: "Deep nested value"
        });
    });

    it("should preserve object structure with complex keys", () => {
        const complexObject = {
            "user-name": "user.name",
            "user_email": "user.email",
            "123key": "user.phone"
        };

        const result = i18n.translateObject(complexObject);

        expect(result).toEqual({
            "user-name": "Name",
            "user_email": "Email Address",
            "123key": "Phone Number"
        });
    });

    it("should handle empty object", () => {
        const result = i18n.translateObject({});
        expect(result).toEqual({});
    });
});