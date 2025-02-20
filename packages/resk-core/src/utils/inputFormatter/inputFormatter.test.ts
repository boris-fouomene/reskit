import { InputFormatter } from './index';
describe('InputFormatter', () => {
    describe('formatValueToObject', () => {
        it('should format a decimal value', () => {
            const options = {
                value: '123.45',
                type: 'decimal',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('123.45');
            expect(result.isDecimalType).toBe(true);
            expect(result.value).toBe('123.45');
            expect(result.parsedValue).toBe(123.45);
            expect(result.decimalValue).toBe(123.45);
        });

        it('should format a numeric value', () => {
            const options = {
                value: '123',
                type: 'numeric',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('123');
            expect(result.isDecimalType).toBe(true);
            expect(result.value).toBe('123');
            expect(result.parsedValue).toBe(123);
            expect(result.decimalValue).toBe(123);
        });

        it('should format a number value', () => {
            const options = {
                value: '123',
                type: 'number',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('123');
            expect(result.isDecimalType).toBe(true);
            expect(result.value).toBe('123');
            expect(result.parsedValue).toBe(123);
            expect(result.decimalValue).toBe(123);
        });

        it('should format a date value', () => {
            const options = {
                value: new Date('2022-01-01'),
                type: 'date',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('01/01/2022');
            expect(result.isDecimalType).toBe(false);
            expect(result.value).toBeInstanceOf(Date);
            expect(result.parsedValue).toBeInstanceOf(Date);
            expect(result.decimalValue).toBe(0);
        });

        it('should format a time value', () => {
            const options = {
                value: new Date('2022-01-01T12:00:00'),
                type: 'time',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('12:00:00');
            expect(result.isDecimalType).toBe(false);
            expect(result.value).toBeInstanceOf(Date);
            expect(result.parsedValue).toBeInstanceOf(Date);
            expect(result.decimalValue).toBe(0);
        });

        it('should format a datetime value', () => {
            const options = {
                value: new Date('2022-01-01T12:00:00'),
                type: 'datetime',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('01/01/2022 12:00:00');
            expect(result.isDecimalType).toBe(false);
            expect(result.value).toBeInstanceOf(Date);
            expect(result.parsedValue).toBeInstanceOf(Date);
            expect(result.decimalValue).toBe(0);
        });

        it('should format a value with a custom format function', () => {
            const options = {
                value: '123',
                type: 'custom',
                format: (opts: { value: string }) => `${opts.value} formatted`,
            };
            const result = InputFormatter.formatValueToObject(options as any);
            expect(result.formattedValue).toBe('123 formatted');
            expect(result.isDecimalType).toBe(false);
            expect(result.value).toBe('123');
            expect(result.parsedValue).toBe('123');
            expect(result.decimalValue).toBe(0);
        });

        it('should format an empty value', () => {
            const options = {
                value: '',
                type: 'decimal',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('0');
            expect(result.isDecimalType).toBe(true);
            expect(result.value).toBe("");
            expect(result.parsedValue).toBe(0);
            expect(result.decimalValue).toBe(0);
        });

        it('should format a null value', () => {
            const options = {
                value: null,
                type: 'decimal',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('0');
            expect(result.isDecimalType).toBe(true);
            expect(result.value).toBe("");
            expect(result.parsedValue).toBe(0);
            expect(result.decimalValue).toBe(0);
        });

        it('should format an undefined value', () => {
            const options = {
                value: undefined,
                type: 'decimal',
            };
            const result = InputFormatter.formatValueToObject(options);
            expect(result.formattedValue).toBe('0');
            expect(result.isDecimalType).toBe(true);
            expect(result.value).toBe("");
            expect(result.parsedValue).toBe(0);
            expect(result.decimalValue).toBe(0);
        });
    });

    describe('formatValue', () => {
        it('should format a decimal value', () => {
            const options = {
                value: '123.45',
                type: 'decimal',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('123.45');
        });

        it('should format a numeric value', () => {
            const options = {
                value: '123',
                type: 'numeric',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('123');
        });

        it('should format a number value', () => {
            const options = {
                value: '123',
                type: 'number',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('123');
        });

        it('should format a date value', () => {
            const options = {
                value: new Date('2022-01-01'),
                type: 'date',
            };
            const result = InputFormatter.formatValue(options);

            expect(result).toBe('01/01/2022');
        });

        it('should format a time value', () => {
            const options = {
                value: new Date('2022-01-01T12:00:00'),
                type: 'time',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('12:00:00');
        });

        it('should format a datetime value', () => {
            const options = {
                value: new Date('2022-01-01T12:00:00'),
                type: 'datetime',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('01/01/2022 12:00:00');
        });

        it('should format a value with a custom format function', () => {
            const options = {
                value: '123',
                type: 'custom',
                format: (opts: { value: string }) => `${opts.value} formatted`,
            };
            const result = InputFormatter.formatValue(options as any);
            expect(result).toBe('123 formatted');
        });

        it('should format an empty value', () => {
            const options = {
                value: '',
                type: 'decimal',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('0');
        });

        it('should format a null value', () => {
            const options = {
                value: null,
                type: 'decimal',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('0');
        });

        it('should format an undefined value', () => {
            const options = {
                value: undefined,
                type: 'decimal',
            };
            const result = InputFormatter.formatValue(options);
            expect(result).toBe('0');
        });
    });

    describe('isValidMask', () => {
        it('should return true for an array mask', () => {
            const mask = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
            expect(InputFormatter.isValidMask(mask)).toBe(true);
        });

        it('should return true for a function mask', () => {
            const mask = () => ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
            expect(InputFormatter.isValidMask(mask)).toBe(true);
        });

        it('should return false for a string mask', () => {
            const mask = '12345';
            expect(InputFormatter.isValidMask(mask as any)).toBe(false);
        });

        it('should return false for a number mask', () => {
            const mask = 12345;
            expect(InputFormatter.isValidMask(mask as any)).toBe(false);
        });

        it('should return false for a null mask', () => {
            const mask = null;
            expect(InputFormatter.isValidMask(mask as any)).toBe(false);
        });

        it('should return false for an undefined mask', () => {
            const mask = undefined;
            expect(InputFormatter.isValidMask(mask)).toBe(false);
        });
    });

    describe('parseDecimal', () => {
        it('should parse a decimal string', () => {
            const value = '123.45';
            expect(InputFormatter.parseDecimal(value)).toBe(123.45);
        });

        it('should parse a numeric string', () => {
            const value = '123';
            expect(InputFormatter.parseDecimal(value)).toBe(123);
        });

        it('should parse a number value', () => {
            const value = 123.45;
            expect(InputFormatter.parseDecimal(value)).toBe(123.45);
        });

        it('should return 0 for an empty string', () => {
            const value = '';
            expect(InputFormatter.parseDecimal(value)).toBe(0);
        });

        it('should return 0 for a null value', () => {
            const value = null;
            expect(InputFormatter.parseDecimal(value)).toBe(0);
        });

        it('should return 0 for an undefined value', () => {
            const value = undefined;
            expect(InputFormatter.parseDecimal(value)).toBe(0);
        });

        it('should return 0 for a non-numeric string', () => {
            const value = 'abc';
            expect(InputFormatter.parseDecimal(value)).toBe(0);
        });
    });

    describe('formatWithMask', () => {
        it('should format a value with a mask', () => {
            const options = {
                value: '12345',
                mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                obfuscationCharacter: '*',
            };
            const result = InputFormatter.formatWithMask(options);
            expect(result.masked).toBe('(23) ');
            expect(result.unmasked).toBe('12345');
            expect(result.obfuscated).toBe('(23) ');
            expect(result.maskHasObfuscation).toBe(false);
            expect(result.placeholder).toBe('(__) _____-____');
            expect(result.isValid).toBe(false);
        });

        it('should format a value with a mask and obfuscation', () => {
            const options = {
                value: '12345',
                mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                obfuscationCharacter: '*',
                validate: (value: string) => value.length === 10,
            };
            const result = InputFormatter.formatWithMask(options);
            expect(result.masked).toBe('(23) ');
            expect(result.unmasked).toBe('12345');
            expect(result.obfuscated).toBe('(23) ');
            expect(result.maskHasObfuscation).toBe(false);
            expect(result.placeholder).toBe('(__) _____-____');
            expect(result.isValid).toBe(false);
        });

        it('should format a value with a mask and validation', () => {
            const options = {
                value: '1234567890',
                mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                obfuscationCharacter: '*',
                validate: (value: string) => value.length === 10,
            };
            const result = InputFormatter.formatWithMask(options);
            expect(result.masked).toBe('(23) 67890');
            expect(result.unmasked).toBe('1234567890');
            expect(result.obfuscated).toBe('(23) 67890');
            expect(result.maskHasObfuscation).toBe(false);
            expect(result.placeholder).toBe('(__) _____-____');
            expect(result.isValid).toBe(false);
        });

        it('should return an empty result for an empty value', () => {
            const options = {
                value: '',
                mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                obfuscationCharacter: '*',
            };
            const result = InputFormatter.formatWithMask(options);
            expect(result.masked).toBe('');
            expect(result.unmasked).toBe('');
            expect(result.obfuscated).toBe('');
            expect(result.maskHasObfuscation).toBe(false);
            expect(result.placeholder).toBe('(__) _____-____');
            expect(result.isValid).toBe(true);
        });

        it('should return an empty result for a null value', () => {
            const options = {
                value: null,
                mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                obfuscationCharacter: '*',
            };
            const result = InputFormatter.formatWithMask(options as any);
            expect(result.masked).toBe('');
            expect(result.unmasked).toBe('');
            expect(result.obfuscated).toBe('');
            expect(result.maskHasObfuscation).toBe(false);
            expect(result.placeholder).toBe('(__) _____-____');
            expect(result.isValid).toBe(true);
        });

        it('should return an empty result for an undefined value', () => {
            const options = {
                value: undefined,
                mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
                obfuscationCharacter: '*',
            };
            const result = InputFormatter.formatWithMask(options);
            expect(result.masked).toBe('');
            expect(result.unmasked).toBe('');
            expect(result.obfuscated).toBe('');
            expect(result.maskHasObfuscation).toBe(false);
            expect(result.placeholder).toBe('(__) _____-____');
            expect(result.isValid).toBe(true);
        });
    });

    describe.skip('createNumberMask', () => {
        it('should create a number mask with default options', () => {
            const mask = InputFormatter.createNumberMask();
            console.log(mask, " is created number mask");
            //expect(mask({ value: '12345' })).toEqual(['$', ' ', '1', ',', '2', '3', '4', '5']);
        });

        it('should create a number mask with custom options', () => {
            const mask = InputFormatter.createNumberMask({
                delimiter: '.',
                precision: 2,
                prefix: ['€', ' '],
                separator: ',',
            });
            console.log(mask, " is created number custom options mask");
            //expect(mask({ value: '12345.67' })).toEqual(['€', ' ', '1', '2', '3', ',', '4', '5', '.', '6', '7']);
        });

        it('should create a number mask with a custom prefix', () => {
            const mask = InputFormatter.createNumberMask({
                prefix: ['$', ' '],
            });
            console.log(mask, " is created number custom prefix mask");
            //expect(mask({ value: '12345' })).toEqual(['$', ' ', '1', ',', '2', '3', '4', '5']);
        });

        it('should create a number mask with a custom separator', () => {
            const mask = InputFormatter.createNumberMask({
                separator: '.',
            });
            console.log(mask, " is created number custom separator mask");
            //expect(mask({ value: '12345' })).toEqual(['$', ' ', '1', '.', '2', '3', '4', '5']);
        });

        it('should create a number mask with a custom delimiter', () => {
            const mask = InputFormatter.createNumberMask({
                delimiter: ',',
            });
            console.log(mask, " is created number custom delimiter mask");
            //expect(mask({ value: '12345.67' })).toEqual(['$', ' ', '1', '2', '3', ',', '4', '5', ',', '6', '7']);
        });

        it('should create a number mask with a custom precision', () => {
            const mask = InputFormatter.createNumberMask({
                precision: 2,
            });
            console.log(mask, " is created number custom precision mask");
            //expect(mask({ value: '12345.67' })).toEqual(['$', ' ', '1', ',', '2', '3', '4', '5', '.', '6', '7']);
        });
    });

    describe('createDateMask', () => {
        it('should create a date mask with a moment format', () => {
            const mask = InputFormatter.createDateMask('YYYY/MM/DD');
            expect(mask.mask).toEqual([
                [/\d/, "Y"],
                [/\d/, "Y"],
                [/\d/, "Y"],
                [/\d/, "Y"],
                '/',
                [/\d/, "M"],
                [/\d/, "M"],
                '/',
                [/\d/, "D"],
                [/\d/, "D"],
            ]);
        });

        it('should create a date mask with a moment format and validation', () => {
            const mask = InputFormatter.createDateMask('YYYY-MM-DD');
            expect(InputFormatter.formatWithMask({ value: '2022-01-01', ...mask })).toMatchObject({ masked: '2022-01-01', unmasked: '2022-01-01', obfuscated: '2022-01-01', maskHasObfuscation: false, placeholder: 'YYYY-MM-DD', isValid: true });
            expect(InputFormatter.formatWithMask({ value: '2022-02-30', ...mask })).toMatchObject({ masked: '2022-02-30', unmasked: '2022-02-30', obfuscated: '2022-02-30', maskHasObfuscation: false, placeholder: 'YYYY-MM-DD', isValid: false });
        });
    });
    describe("create cameroon phone number mask", () => {
        it("should create a phone number mask with a country code", () => {
            const mask = InputFormatter.createPhoneNumberMaskFromExample("(237)69965076");
            console.log(mask, " is camerron phonne number");
        });
    })
    describe('createPhoneNumberMask', () => {
        it('should create a phone number mask with a country code', () => {
            const mask = InputFormatter.createPhoneNumberMask('US');
            expect(mask.mask).toEqual([
                '(',
                /\d/,
                /\d/,
                /\d/,
                ')',
                InputFormatter.SINGLE_SPACE_MASK,
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
            ]);
        });
        it("Should sanitize phone number", () => {
            expect(InputFormatter.sanitizePhoneNumber('(212) 456-7890')).toBe('(212) 456-7890');
            expect(InputFormatter.sanitizePhoneNumber('(212) 456-7890)')).toBe('(212) 456-7890)');
            expect(InputFormatter.sanitizePhoneNumber('(212)456-7890)')).toBe('(212) 456-7890)');
            expect(InputFormatter.sanitizePhoneNumber('(212)456-7890')).toBe('(212) 456-7890');
            expect(InputFormatter.sanitizePhoneNumber('(212) 456-7890')).toBe('(212) 456-7890');
        });

        it('should create a phone number mask with a country code and validation', () => {
            const mask = InputFormatter.createPhoneNumberMask('US');
            expect(InputFormatter.formatWithMask({ value: '(212) 456-7890', ...mask })).toMatchObject({ masked: '(212) 456-7890', maskHasObfuscation: false, placeholder: '(___) ___-____', isValid: true });
            expect(InputFormatter.formatWithMask({ value: '(212) 456-7891', ...mask })).toMatchObject({ masked: '(212) 456-7891', obfuscated: '(212) 456-7891', maskHasObfuscation: false, placeholder: '(___) ___-____', isValid: true });
            expect(InputFormatter.formatWithMask({ value: InputFormatter.sanitizePhoneNumber('(212)246-7890'), ...mask })).toMatchObject({ masked: '(212) 246-7890', maskHasObfuscation: false, placeholder: '(___) ___-____', isValid: true });
        });
    });

    describe('MASKS_WITH_VALIDATIONS', () => {
        it('should have a date mask', () => {
            expect(InputFormatter.MASKS_WITH_VALIDATIONS.DATE.mask).toEqual([
                [/\d/, "D"],
                [/\d/, "D"],
                "/",
                [/\d/, "M"],
                [/\d/, "M"],
                '/',
                [/\d/, "Y"],
                [/\d/, "Y"],
                [/\d/, "Y"],
                [/\d/, "Y"],
            ]);
        });

        it('should have a time mask', () => {
            expect(InputFormatter.MASKS_WITH_VALIDATIONS.TIME.mask).toEqual([
                [/\d/, "H"],
                [/\d/, "H"],
                ':',
                [/\d/, "m"],
                [/\d/, "m"],
                ':',
                [/\d/, "s"],
                [/\d/, "s"],
            ]);
        });

        it('should have a datetime mask', () => {
            expect(InputFormatter.MASKS_WITH_VALIDATIONS.DATE_TIME.mask).toEqual([
                [/\d/, "D"],
                [/\d/, "D"],
                "/",
                [/\d/, "M"],
                [/\d/, "M"],
                '/',
                [/\d/, "Y"],
                [/\d/, "Y"],
                [/\d/, "Y"],
                [/\d/, "Y"],
                ' ',
                [/\d/, "H"],
                [/\d/, "H"],
                ":",
                [/\d/, "m"],
                [/\d/, "m"],
                ':',
                [/\d/, "s"],
                [/\d/, "s"],
            ]);
        });

        it('should have a credit card mask', () => {

        });
    });
});