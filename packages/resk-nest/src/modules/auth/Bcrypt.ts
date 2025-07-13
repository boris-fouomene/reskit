import { isNonNullString } from "@resk/core/utils";
import * as bcrypt from "bcryptjs";
import { BadRequestException } from "@nestjs/common";
import { i18n } from "@resk/core/i18n";
export class Bcrypt {
    /***
     * Hash the password
     * @param {string} password - The password.
     * @param {number} rounds - The number of rounds.
     * @returns {string} The hashed password.
     */
    static async hash(password: string, rounds: number = 10) {
        return await bcrypt.hash(password, rounds);
    }
    /**
     * Compare the password with the hash
     * @param password 
     * @param hash 
     * @returns 
     */
    static async compare(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    /***
     * Hash the password with the salt
     * @param {string} password, The password to hash
     * @param {string} salt, The salt to use
     * @param {number} saltRounds, The number of rounds to use, default is 10
     * @returns {Promise<string>} The hashed password
     */
    static hashWithSalt(password: string, salt: string, saltRounds: number = 10) {
        if (!isNonNullString(password)) {
            throw new BadRequestException(i18n.t("auth.specifyNonNullPassword"));
        }
        if (isNonNullString(salt)) {
            return new Promise((resolve, reject) => {
                return bcrypt.genSalt(saltRounds).then((salt2) => {
                    return bcrypt.hash(password, salt2).then(resolve);
                }).catch(reject);
            })
        }
        return bcrypt.hash(password, salt && typeof salt == 'number' ? salt : saltRounds);
    }
}