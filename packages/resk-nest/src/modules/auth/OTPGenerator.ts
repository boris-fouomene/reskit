import { defaultBool } from "@resk/core/utils";

/**
 * Represents options for customizing OTP generation.
 *
 * @interface IOTPOptions
 */
export interface IOTPOptions {
    /**
     * The length of the OTP to generate.
     *
     * @default 6
     * @example
     * const options: IOTPOptions = { length: 10 };
     */
    length?: number;

    /**
     * Whether to include digits in the OTP.
     *
     * @default true
     * @example
     * const options: IOTPOptions = { digits: true };
     */
    digits?: boolean;

    /**
     * Whether to include uppercase letters in the OTP.
     *
     * @default true
     * @example
     * const options: IOTPOptions = { upperCase: true };
     */
    upperCase?: boolean;

    /**
     * Whether to include special characters in the OTP.
     *
     * @default true
     * @example
     * const options: IOTPOptions = { specialChars: true };
     */
    specialChars?: boolean;

    /**
     * Whether to include lowercase letters in the OTP.
     *
     * @default true
     * @example
     * const options: IOTPOptions = { lowerCase: true };
     */
    lowerCase?: boolean;
}

/**
 * Represents a class for generating One-Time Passwords (OTPs).
 *
 * @class OTPGenerator
 */
export class OTPGenerator {
    private static readonly digits = '0123456789';
    private static readonly upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private static readonly lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    private static readonly specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    private static lastGeneratedTime: number = 0;
    private static lastGeneratedOTP: string = '';

    /**
     * Generates a One-Time Password (OTP) based on the provided options.
     *
     * @static
     * @param {IOTPOptions} options - The options for generating the OTP.
     * @returns {string} The generated OTP.
     *
     * @example
     * import { OTPGenerator } from '@resk/nest';
     * const options: IOTPOptions = { length: 10, digits: true, upperCase: true, lowerCase: true, specialChars: true };
     * const otp = OTPGenerator.generate(options);
     * console.log(otp);
     */
    static generate(options: IOTPOptions): string {
        // Validate configuration
        options = this.prepareOptions(options);
        const length: number = options.length as number;
        // Build character pool based on configuration
        let charPool = '';
        if (options.digits) charPool += this.digits;
        if (options.upperCase) charPool += this.upperCase;
        if (options.lowerCase) charPool += this.lowerCase;
        if (options.specialChars) charPool += this.specialChars;

        if (!charPool) {
            options.upperCase = true;
            charPool = this.upperCase;
        }

        // Get current timestamp
        const currentTime = Date.now();

        // Generate OTP
        let otp = '';
        const timestamp = currentTime.toString();
        // Use timestamp to seed the generation
        for (let i = 0; i < length; i++) {
            const randomIndex = this.getRandomIndex(
                charPool.length,
                timestamp,
                i.toString()
            );
            otp += charPool[randomIndex];
        }
        // Ensure we meet minimum requirements if specified
        otp = this.ensureRequirements(otp, options, charPool);
        // Check if this OTP was generated in the same millisecond
        if (currentTime === this.lastGeneratedTime && otp === this.lastGeneratedOTP) {
            // Add a small delay and try again
            return this.generate(options);
        }

        // Store the current generation details
        this.lastGeneratedTime = currentTime;
        this.lastGeneratedOTP = otp;

        return otp;
    }

    private static prepareOptions(options: IOTPOptions): Required<IOTPOptions> {
        options = Object.assign({}, options);
        options.digits = defaultBool(options.digits, true)
        options.lowerCase = defaultBool(options.lowerCase, false)
        options.upperCase = defaultBool(options.upperCase, true)
        options.specialChars = defaultBool(options.specialChars, false);
        options.length = typeof options.length === "number" && options.length > 0 ? options.length : 6;
        return options as Required<IOTPOptions>;
    }

    private static getRandomIndex(max: number, timestamp: string, salt: string): number {
        // Create a unique seed using timestamp and salt
        const seed = parseInt(timestamp + salt, 10);
        const random = Math.sin(seed) * 10000;
        return Math.floor((random - Math.floor(random)) * max);
    }

    private static ensureRequirements(
        otp: string,
        options: IOTPOptions,
        charPool: string
    ): string {
        let result = otp.split('');
        // Ensure at least one character of each required type
        if (options.digits && !/\d/.test(otp)) {
            result[0] = this.digits[Math.floor(Math.random() * this.digits.length)];
        }
        if (options.upperCase && !/[A-Z]/.test(otp)) {
            result[1] = this.upperCase[Math.floor(Math.random() * this.upperCase.length)];
        }
        if (options.lowerCase && !/[a-z]/.test(otp)) {
            result[2] = this.lowerCase[Math.floor(Math.random() * this.lowerCase.length)];
        }
        if (options.specialChars && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(otp)) {
            result[3] = this.specialChars[Math.floor(Math.random() * this.specialChars.length)];
        }
        return result.join('');
    }
}
