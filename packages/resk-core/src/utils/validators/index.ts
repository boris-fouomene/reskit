import isNonNullString from "../isNonNullString";
/*** vérifie si la valeur passée en paramètre est un email valide
 * @param {string} email à vérifier
 * @param {bool}, si le validateur doit retourner false lorsque l'émail n'est pas une chaine de caractère
 */
export const isValidEmail = (value: any): boolean => {
    if (!isNonNullString(value)) {
        return false;
    }
    return value.match(/^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+\/=?\^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/) ? true : false;
}

/***
 * Vérifie si la valeur passée en paramètre est la source vers une image valide
 */
export const isValidImageSrc = (src: any): boolean => {
    if (!isNonNullString(src)) return false;
    src = src.trim();
    if (src.startsWith("blob:http")) {
        src = src.ltrim("blob:");
    }
    return isDataURL(src) || isValidUrl(src) || src.startsWith("data:image/");
}


const isDataURLRegex = /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)$/i;

/***
 * Vérifie si la valeur s passée en paramètre est une chaine au format data Url valide
 */
export function isDataURL(s: string): boolean {
    return isNonNullString(s) && !s.includes("data:image/x-icon") && !!s.match(isDataURLRegex);
}

/***
 * Vérifie si la valeur passée en paramètre est une url/uri valide
 */
export const isValidUrl = (uri: any): boolean => {
    return isNonNullString(uri) && /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(uri);
};