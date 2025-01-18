import { I18n, Translate } from '../index';
import "../../utils";
import { I18nEvent, II18nTranslation } from '../../types/i18n';
import { IObservableCallback } from '../../utils/observable';

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