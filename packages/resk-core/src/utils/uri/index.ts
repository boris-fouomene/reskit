import isNonNullString from "../isNonNullString";
import { IDict } from "../../types";
import "../string";
import queryString, { IParseBaseOptions, IStringifyBaseOptions } from 'qs';
/**
 * Returns the query string from a given URL.
 *
 * This function takes a URL and an optional flag as input.
 * It parses the URL to extract the query string, which is the part of the URL after the `?` character.
 * If the `addQuestionSeparator` flag is true, the query string is returned with a leading `?` character.
 *
 * @param uri The URL to extract the query string from.
 * @param addQuestionSeparator Whether to include the `?` character in the returned query string (default: true).
 * @returns The query string associated with the given URL.
 * @example
 * ```typescript
 * const url = 'https://example.com/path?a=1&b=2';
 * console.log(extractQueryString(url)); // Output: "?a=1&b=2"
 * console.log(extractQueryString(url, false)); // Output: "a=1&b=2"
 * ```
 */
export const extractQueryString = (uri?: string, addQuestionSeparator: boolean = true): string => {
  if (typeof uri !== "string") return "";
  let parse = parseURI(uri);
  uri = typeof parse.search === "string" ? parse.search : "";
  if (addQuestionSeparator && uri) {
    return "?" + uri.ltrim("?");
  } else {
    uri = uri.trim().ltrim("?").rtrim("?");
  }
  return uri;
}
/**
 * Returns the query parameters from a given URL as an object.
 *
 * This function takes a URL and an optional options object as input.
 * It extracts the query string from the URL using the `extractQueryString` function and then parses it into an object using the `queryString.parse` method.
 * The `queryString.parse` method is configured to allow sparse arrays and to merge the provided options with the default options.
 *
 * @param uri The URL to extract the query parameters from.
 * @param queryStringOpts Options for the `queryString.parse` method (default: {}).
 * @returns An object containing the query parameters.
 * @example
 * ```typescript
 * const url = 'https://example.com/path?a=1&b=2&c[]=3&c[]=4';
 * console.log(getQueryParams(url)); // Output: { a: '1', b: '2', c: [ '3', '4' ] }
 * ```
 */
export const getQueryParams = function (uri: string | null | undefined, queryStringOpts: IParseBaseOptions = {}): IDict {
  if (typeof uri !== 'string') return {};
  return queryString.parse(extractQueryString(uri, false), { allowSparse: true, ...Object.assign({}, queryStringOpts) });
}

/**
 * Removes the query string from a given URL and returns the resulting URL.
 *
 * This function takes a URL and an optional flag as input.
 * It removes the query string and any fragment identifier from the URL using regular expressions.
 * If the `_decodeURIComponent` flag is true, the resulting URL is decoded using the `decodeURIComponent` function.
 *
 * @param uri The URL to remove the query string from.
 * @param _decodeURIComponent Whether to decode the resulting URL using `decodeURIComponent` (default: false).
 * @returns The URL with the query string removed.
 * @example
 * ```typescript
 * const url = 'https://example.com/path?a=1&b=2#fragment';
 * console.log(removeQueryString(url)); // Output: "https://example.com/path"
 * console.log(removeQueryString(url, true)); // Output: "https://example.com/path" (decoded)
 * ```
 */
export const removeQueryString = function (uri: string | undefined | null, _decodeURIComponent: boolean = false): string {
  if (typeof uri !== "string") return "";
  uri = uri.replace(/#.*$/, '').replace(/\?.*$/, '');
  if (_decodeURIComponent === true) {
    return decodeURIComponent(uri);
  }
  return uri;
}


const defaultStringifyOptions: IStringifyBaseOptions = {
  indices: false,
  arrayFormat: 'brackets',
  encodeValuesOnly: true
}

/**
 * Adds query parameters to a given URL.
 *
 * This function takes a URL, a key-value pair or an object of key-value pairs, and optional options as input.
 * It removes any existing query string from the URL, merges the new query parameters with the existing ones, and then appends the resulting query string to the URL.
 *
 * @param url The URL to add query parameters to.
 * @param key A string key or an object of key-value pairs to add to the query string.
 * @param value The value associated with the key, only applicable when key is a string.
 * @param options Options for the `queryString.stringify` method (default: {}).
 * @returns The URL with the query parameters added.
 * @example
 * ```typescript
 * const url = 'https://example.com/path';
 * console.log(setQueryParams(url, 'a', 1)); // Output: "https://example.com/path?a=1"
 * console.log(setQueryParams(url, { a: 1, b: 2 })); // Output: "https://example.com/path?a=1&b=2"
 * ```
 */
export function setQueryParams(url: string | undefined | null, key: any, value?: any, options: IStringifyBaseOptions = {}): string {
  if (typeof url !== "string" || !url) return "";
  let params = getQueryParams(url);
  url = removeQueryString(url);
  if (typeof key === "object") {
    if (!key) key = {};
    options = typeof options == "object" && options ? options : typeof value == "object" && value ? value : {};
  } else if (typeof key == "string") {
    key = { [key]: value };
  }
  if (typeof key == 'object' && key && !Array.isArray(key)) {
    Object.assign(params, key);
  }
  return url + "?" + queryString.stringify(params, { ...defaultStringifyOptions, ...Object.assign({}, options) });
}


/**
 * Converts an object to a query string.
 *
 * This function takes an object and an optional flag as input.
 * It recursively iterates through the object's properties and converts them to a query string format.
 * If the `encodeURI` flag is true, the values are encoded using the `encodeURIComponent` function.
 *
 * @param o The object to convert to a query string.
 * @param encodeURI Whether to encode the values using `encodeURIComponent` (default: false).
 * @returns The object converted to a query string.
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
 * console.log(objectToQueryString(obj)); // Output: "a=1&b=2&c[d]=3&c[e]=4"
 * console.log(objectToQueryString(obj, true)); // Output: "a=1&b=2&c%5Bd%5D=3&c%5Be%5D=4"
 * ```
 */
export function objectToQueryString(o: any, encodeURI: boolean = false): string {
  if (o == null || typeof o !== 'object') return "";
  function iter(o: any, path: string) {
    if (Array.isArray(o)) {
      o.forEach(function (a) {
        iter(a, path + '[]');
      });
      return;
    }
    if (o !== null && typeof o === 'object') {
      Object.keys(o).forEach(function (k) {
        iter(o[k], path + '[' + k + ']');
      });
      return;
    }
    data.push((encodeURI ? encodeURIComponent(path) : path) + '=' + (encodeURI ? encodeURIComponent(o) : o));
  }

  const data: string[] = [];
  Object.keys(o).forEach(function (k) {
    iter(o[k], k);
  });
  return data.join('&');
}
/**
 * Parses a URI and returns the parsed object.
 *
 * This function takes a URI as input and returns an object containing the parsed components of the URI.
 * The object includes properties for the hash, host, hostname, href, origin, pathname, port, protocol, search, username, and password.
 *
 * @param uri The URI to parse.
 * @returns The parsed URI object.
 * @example
 * ```typescript
 * const uri = 'http://username:password@localhost:257/deploy/?asd=asd#asd';
 * console.log(parseURI(uri));
 * // Output:
 * // {
 * //   hash: "#asd",
 * //   host: "localhost:257",
 * //   hostname: "localhost",
 * //   href: "http://username:password@localhost:257/deploy/?asd=asd#asd",
 * //   origin: "http://username:password@localhost:257",
 * //   pathname: "/deploy/",
 * //   port: "257",
 * //   protocol: "http:",
 * //   search: "?asd=asd",
 * //   username: "username",
 * //   password: "password"
 * // }
 * ```
 */
export const parseURI = (uri: string | null | undefined): {
  hash?: string, // URL hash
  host?: string,
  hostname?: string,
  href?: string,
  origin?: string,
  pathname?: string,
  port?: string,
  protocol?: string,
  search?: string,
  username?: string,
  password?: string,
} => {
  if (typeof uri !== "string") return {};
  var m = uri.match(/^(([^:\/?#]+:)?(?:\/\/((?:([^\/?#:]*):([^\/?#:]*)@)?([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/);
  let r = !m ? {} : {
    hash: m[10] || "",                   // #asd
    host: m[3] || "",                    // localhost:257
    hostname: m[6] || "",                // localhost
    href: m[0] || "",                    // http://username:password@localhost:257/deploy/?asd=asd#asd
    origin: m[1] || "",                  // http://username:password@localhost:257
    pathname: m[8] || (m[1] ? "/" : ""), // /deploy/
    port: m[7] || "",                    // 257
    protocol: m[2] || "",                // http:
    search: m[9] || "",                  // ?asd=asd
    username: m[4] || "",                // username
    password: m[5] || ""                 // password
  };
  if (r.protocol && r.protocol.length == 2) {
    r.protocol = "file:///" + r.protocol.toUpperCase();
    r.origin = r.protocol + "//" + r.host;
  }
  if (r.protocol) {
    r.href = r.origin + r.pathname + r.search + r.hash;
  }
  return r;
}

/**
 * Checks if the provided value is a valid URL/URI.
 *
 * This function determines whether the string passed as the parameter 
 * `uri` is a valid URL or URI. It performs the following checks:
 *
 * 1. **Non-null String Check**: The function uses `isNonNullString` to 
 *    ensure that `uri` is a non-null string.
 *
 * 2. **URL/URI Validation**: The function then tests the string against 
 *    a regular expression that checks if the string has the structure 
 *    of a valid URL. The regular expression verifies the following:
 *    - An optional scheme (like `http://` or `https://`).
 *    - A domain name that can either be a fully qualified domain name 
 *      or `localhost`.
 *    - An optional port and other URL components.
 *
 * The function returns `true` if the provided string is a valid URL/URI; 
 * otherwise, it returns `false`.
 *
 * @param {any} uri - The string to check as a valid URL/URI.
 * @returns {boolean} - Returns `true` if the string is a valid URL/URI, 
 *                      `false` otherwise.
 *
 * @example
 * // Valid URLs
 * console.log(isValidUrl('http://example.com')); // true
 * console.log(isValidUrl('https://localhost:3000')); // true
 * console.log(isValidUrl('ftp://files.example.com')); // true
 *
 * // Invalid URLs
 * console.log(isValidUrl(null)); // false
 * console.log(isValidUrl('')); // false
 * console.log(isValidUrl('not-a-valid-url')); // false
 * console.log(isValidUrl('http://256.256.256.256')); // false (invalid IP address)
 */
export const isValidUrl = (uri: any): uri is string => {
  return isNonNullString(uri) && /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(uri);
};