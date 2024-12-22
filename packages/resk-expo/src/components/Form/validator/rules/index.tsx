
import { isNumber } from "lodash";
import { IValidationRuleOptions } from "../types";
import { defaultStr, isNonNullString, isEmpty } from "$utils";
import { IValidationResult } from "../types";
import { isValidEmail, isValidUrl } from "$utils/validators";


function compareNumer(compare: (value: any, toCompare: any) => boolean, message: string, { value, ruleParams }: IValidationRuleOptions) {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    message = `${message} ${ruleParams[0] || ''}`;
    value = typeof value === 'number' ? value : parseFloat(value);
    return new Promise((resolve, reject) => {
        if (isNaN(value) || ruleParams[0] === undefined) {
            return reject(message);
        }
        const toCompare = typeof ruleParams[0] === 'number' ? ruleParams[0] : parseFloat(ruleParams[0]);
        if (!isNaN(toCompare)) {
            return reject(message);
        }
        if (compare(value, toCompare)) {
            return resolve(true);
        }
        reject(message);
    })
}
/***
   vérifie si la valeur value est inférieure où égale à la valeur ruleParams[0]
 * @param {any} value, la valeur à vérie
   @param {array} ruleParams, les paramètres supplémentaires liés à la validation
   @returns {boolean} si le nombre value est supérieure à égal à ruleParams[0]
 */
export const numberLessThanOrEquals = function (options: IValidationRuleOptions): IValidationResult {
    return compareNumer((value, toCompare) => {
        return value <= toCompare;
    }, 'Entrez un nombre inférieure ou égal à ', options)
}

export const numberLessThan = function (options: IValidationRuleOptions): IValidationResult {
    return compareNumer((value, toCompare) => {
        return value < toCompare;
    }, 'Entrez un nombre inférieure ', options)
}

export const numberGreaterThanOrEquals = function (options: IValidationRuleOptions): IValidationResult {
    return compareNumer((value, toCompare) => {
        return value >= toCompare;
    }, 'Entrez un nombre supérieure ou égal à ', options)
}

export const numberGreaterThan = function (options: IValidationRuleOptions): IValidationResult {
    return compareNumer((value, toCompare) => {
        return value > toCompare;
    }, 'Entrez un nombre supérieure  à ', options)
}

export const numberEqualsTo = function (options: IValidationRuleOptions): IValidationResult {
    return compareNumer((value, toCompare) => {
        return value === toCompare;
    }, 'Entrez un nombre égal à ', options)
}
/***
 * English and digital input only
 */
export const englishOrNum = function (options: IValidationRuleOptions): IValidationResult {
    return /^[a-zA-Z0-9_]{1,}$/.test(options.value) || 'Entrez des caractères alphabétiques, numériques, ou soulignés';
}

/***
 * vérifie si un nombre passée en paramètre ou une chaine de caractère est un entier
 */
export const integer = (options: IValidationRuleOptions): IValidationResult => {
    return /^[+]?[0-9]\d*$/.test(String(options.value)) || 'Veuillez entrer un nombre entier';
}

/***
 * validateur de champ requis
 * @param {any} value, la valeur à validée
 */
export function required({ value }: IValidationRuleOptions): IValidationResult {
    return !isEmpty(value) || 'Ce champ rest requis';
}

/***
 * valide la longueur d'une chaine de caractère
 * @example
 * ```ts
 * length[0,8] : compris entre 0 et 8 caractères
 * length[8] : doit avoir 8 caractères
 * ```
 */
export const length = ({ value, ruleParams }: IValidationRuleOptions): IValidationResult => {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    value = defaultStr(value);
    let v0 = null, v1 = null;
    if (ruleParams[0]) {
        v0 = parseInt(ruleParams[0]) || null;
    }
    if (ruleParams[1]) {
        v1 = parseInt(ruleParams[1]) || null;
    }
    const message = (ruleParams[0] && ruleParams[1]) ?
        (`Ce champ doit avoir une longueur comprise entre ${ruleParams[0]} et ${ruleParams[1]} caractere(s)`) :
        ruleParams[0] ? (`ce champ doit avoir ${ruleParams[0]} caractere(s)`) : `validation longueur inconnue pour la valeur ${value}`;
    ///console.log(v0,' adn ',v1," adn ",value, ruleParams);
    if (isNumber(v0) && isNumber(v1)) {
        return (value.length >= v0 && value.length <= v1) || message;
    }
    if (isNumber(v0)) {
        ///on valide la longueur
        return value.trim().length == v0 || message;
    }
    return true;
}

/***
 * valide une addresse email
 */
export const email = ({ value }: IValidationRuleOptions): IValidationResult => {
    if (!value || typeof value !== "string") {
        return true;
    }
    return isValidEmail(value) || "Veuillez saisir une addresse email valide";
}

/***
 * valide une url
 */
export const url = ({ value }: IValidationRuleOptions): IValidationResult => {
    return !url || typeof url !== "string" ? true : isValidUrl(url) || "Entrez une adrèsse url valide SVP.";
}

/***
 * valide la longueur minimale : 
 *  @example
 * ```ts
 *     minLength[3]
 * ```	
 */
export const minLength = function ({ value, ruleParams }: IValidationRuleOptions): IValidationResult {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const mLength = parseFloat(ruleParams[0]) || 0;
    const message = `Ce champ doit avoir au minimum ${mLength} caractère(s)`;
    return isEmpty(value) || value && typeof value === "string" && String(value).length >= mLength || message;
}

/***
 * valide la longueur maximale : 
 *  @example
 * ```ts
 *     maxLength[3]
 * ```	
 */
export const maxLength = function ({ value, ruleParams }: IValidationRuleOptions): IValidationResult {
    ruleParams = Array.isArray(ruleParams) ? ruleParams : [];
    const mLength = parseFloat(ruleParams[0]) || 0;
    const message = `Ce champ doit avoir au maximum ${mLength} caractère(s)`;
    return isEmpty(value) || value && typeof value === "string" && String(value).length <= mLength || message;
}

/***
 * valide un nom de fichier valide
 */
export const fileName = function ({ value }: IValidationRuleOptions): IValidationResult {
    const message = `Veuillez entrer une nom de fichier valide`;
    if (!isNonNullString(value)) return message;
    const rg1 = /^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    const rg2 = /^\./; // cannot start with dot (.)
    const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
    return rg1.test(String(value)) && !rg2.test(value) && !rg3.test(value) || message;
}