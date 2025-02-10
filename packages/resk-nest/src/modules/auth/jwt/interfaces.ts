/**
 * @typedef IJwtAlgorithm
 * Enumerates the supported JSON Web Token (JWT) algorithms.
 * 
 * @see https://tools.ietf.org/html/rfc7518#section-3.1
 */
export type IJwtAlgorithm =
    /**
     * HMAC using SHA-256.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.2
     */
    'HS256'  // HMAC using SHA-256
    /**
     * HMAC using SHA-384.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.2
     */
    | 'HS384'  // HMAC using SHA-384
    /**
     * HMAC using SHA-512.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.2
     */
    | 'HS512'  // HMAC using SHA-512
    /**
     * RSA Signature using SHA-256.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.3
     */
    | 'RS256'  // RSA Signature using SHA-256
    /**
     * RSA Signature using SHA-384.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.3
     */
    | 'RS384'  // RSA Signature using SHA-384
    /**
     * RSA Signature using SHA-512.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.3
     */
    | 'RS512'  // RSA Signature using SHA-512
    /**
     * ECDSA using P-256 curve and SHA-256.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.4
     */
    | 'ES256'  // ECDSA using P-256 curve and SHA-256
    /**
     * ECDSA using P-384 curve and SHA-384.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.4
     */
    | 'ES384'  // ECDSA using P-384 curve and SHA-384
    /**
     * ECDSA using P-521 curve and SHA-512.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.4
     */
    | 'ES512'  // ECDSA using P-521 curve and SHA-512
    /**
     * RSA PSS Signature using SHA-256.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.5
     */
    | 'PS256'  // RSA PSS Signature using SHA-256
    /**
     * RSA PSS Signature using SHA-384.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.5
     */
    | 'PS384'  // RSA PSS Signature using SHA-384
    /**
     * RSA PSS Signature using SHA-512.
     * 
     * @see https://tools.ietf.org/html/rfc7518#section-3.5
     */
    | 'PS512'  // RSA PSS Signature using SHA-512
    /**
     * Edwards-curve Digital Signature Algorithm.
     * 
     * @see https://tools.ietf.org/html/rfc8037
     */
    | 'EdDSA'; // Edwards-curve Digital Signature Algorithm



/**
 @typedef IJwtExpirationTime
* Represents a time duration for JWT expiration.
* 
* The format is a number followed by a unit of time, where the unit can be:
* 
* - `s`: seconds
* - `m`: minutes
* - `h`: hours
* - `d`: days
* - `w`: weeks
* - `M`: months (approximated to 30 days)
* - `y`: years (approximated to 365 days)
* 
* @example
* ```typescript
* const expirationTime: IJwtExpirationTime = '1h'; // expires in 1 hour
* const expirationTime: IJwtExpirationTime = '30d'; // expires in 30 days
* const expirationTime: IJwtExpirationTime = '1y'; // expires in 1 year
* ```
*/
export type IJwtExpirationTime = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'M' | 'y'}` & string;