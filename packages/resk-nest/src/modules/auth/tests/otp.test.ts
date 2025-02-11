import { OTPGenerator, IOTPOptions } from '../OTPGenerator';

describe('OTPGenerator', () => {
    describe('Default Options', () => {
        it('should use default values when no options are provided', () => {
            const otp = OTPGenerator.generate({});
            expect(otp).toHaveLength(6); // Default length
            expect(otp).toMatch(/^[0-9A-Z]+$/); // Only digits and uppercase by default
        });

        it('should use default values when undefined options are provided', () => {
            const otp = OTPGenerator.generate({
                digits: undefined,
                upperCase: undefined,
                lowerCase: undefined,
                specialChars: undefined,
                length: undefined,
            });
            expect(otp).toHaveLength(6);
            expect(otp).toMatch(/^[0-9A-Z]+$/);
        });
    });

    describe('Length Validation', () => {
        it('should handle custom length', () => {
            const otp = OTPGenerator.generate({ length: 8 });
            expect(otp).toHaveLength(8);
        });

        it('should use default length when invalid length is provided', () => {
            const invalidLengths = [0, -1, NaN];

            invalidLengths.forEach(length => {
                const otp = OTPGenerator.generate({ length });
                expect(otp).toHaveLength(6);
            });
        });
    });

    describe('Character Types', () => {
        it('should generate only digits when only digits are allowed', () => {
            const options: IOTPOptions = {
                digits: true,
                upperCase: false,
                lowerCase: false,
                specialChars: false,
            };
            const otp = OTPGenerator.generate(options);
            expect(otp).toMatch(/^[0-9]+$/);
        });

        it('should generate only uppercase when only uppercase is allowed', () => {
            const options: IOTPOptions = {
                digits: false,
                upperCase: true,
                lowerCase: false,
                specialChars: false,
            };
            const otp = OTPGenerator.generate(options);
            expect(otp).toMatch(/^[A-Z]+$/);
        });

        it('should generate only lowercase when only lowercase is allowed', () => {
            const options: IOTPOptions = {
                digits: false,
                upperCase: false,
                lowerCase: true,
                specialChars: false,
            };
            const otp = OTPGenerator.generate(options);
            expect(otp).toMatch(/^[a-z]+$/);
        });

        it('should generate only special chars when only special chars are allowed', () => {
            const options: IOTPOptions = {
                digits: false,
                upperCase: false,
                lowerCase: false,
                specialChars: true,
            };
            const otp = OTPGenerator.generate(options);
            expect(otp).toMatch(/^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
        });
    });

    describe('Mixed Character Types', () => {
        it('should include at least one character of each allowed type', () => {
            const options: IOTPOptions = {
                length: 8,
                digits: true,
                upperCase: true,
                lowerCase: true,
                specialChars: true,
            };
            const otp = OTPGenerator.generate(options);

            expect(otp).toMatch(/[0-9]/); // Contains at least one digit
            expect(otp).toMatch(/[A-Z]/); // Contains at least one uppercase
            expect(otp).toMatch(/[a-z]/); // Contains at least one lowercase
            expect(otp).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // Contains at least one special char
        });
    });

    describe('Uniqueness', () => {
        it('should generate different OTPs in quick succession', () => {
            const options: IOTPOptions = { length: 6 };
            const otp1 = OTPGenerator.generate(options);
            const otp2 = OTPGenerator.generate(options);
            const otp3 = OTPGenerator.generate(options);

            expect(otp1).not.toBe(otp2);
            expect(otp2).not.toBe(otp3);
            expect(otp1).not.toBe(otp3);
        });

        it('should generate unique OTPs even with same timestamp', async () => {
            const options: IOTPOptions = { length: 6 };
            const otps = new Set();

            // Generate multiple OTPs quickly
            for (let i = 0; i < 10; i++) {
                otps.add(OTPGenerator.generate(options));
            }

            // All OTPs should be unique
            expect(otps.size).toBe(10);
        });
    });

    describe('Error Handling', () => {
        it('should throw error when no character types are allowed', () => {
            const options: IOTPOptions = {
                digits: false,
                upperCase: false,
                lowerCase: false,
                specialChars: false,
            };

            expect(() => OTPGenerator.generate(options)).toThrow('At least one character type must be allowed');
        });
    });

    describe('Distribution', () => {
        it('should generate OTPs with relatively even distribution', () => {
            const options: IOTPOptions = {
                length: 1000, // Large length for statistical significance
                digits: true,
                upperCase: false,
                lowerCase: false,
                specialChars: false,
            };

            const otp = OTPGenerator.generate(options);
            const counts: { [key: string]: number } = {};

            // Count occurrences of each digit
            for (const char of otp) {
                counts[char] = (counts[char] || 0) + 1;
            }

            // Check if each digit appears roughly the same number of times (within 20% of expected)
            const expectedCount = 1000 / 10; // 10 possible digits
            for (const digit of '0123456789') {
                expect(counts[digit]).toBeGreaterThan(expectedCount * 0.8);
                expect(counts[digit]).toBeLessThan(expectedCount * 1.2);
            }
        });
    });
});