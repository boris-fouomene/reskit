import defaultStr from "@utils/defaultStr";
import isNonNullString from "@utils/isNonNullString";
import { isNumber } from "@utils/isNumber";
import { JsonHelper } from "@utils/json";
import { isValidUrl, setQueryParams } from "@utils/uri";
import { I18n } from "../i18n";

/**
 * The `HttpClient` class provides a robust, extensible API for making HTTP requests in TypeScript/JavaScript applications.
 *
 * It supports advanced features such as authentication, custom headers, request/response transformation, error handling,
 * timeouts, and built-in support for RESTful methods (GET, POST, PUT, PATCH, DELETE). The class is designed for easy extension,
 * allowing you to override methods for custom authentication, request options, or error handling.
 *
 * ## Key Features
 * - Automatic Bearer token support (override `getBeearToken` for dynamic tokens)
 * - Customizable request headers and options
 * - Built-in support for JSON and RESTful APIs
 * - Timeout and delay management for requests
 * - Comprehensive error handling and transformation
 * - Type-safe response transformation
 * - Extensible for custom authentication, logging, or request/response hooks
 *
 * ## Example Usage
 * ```typescript
 * const client = new HttpClient();
 * // GET request
 * const users = await client.fetchJSon<User[]>("/users");
 * // POST request
 * const result = await client.post<{ id: number }>("/users", { body: JSON.stringify({ name: "John" }) });
 * // Custom authentication
 * class MyClient extends HttpClient {
 *   async getBeearToken() { return await getTokenFromStorage(); }
 * }
 * ```
 *
 * @see IHttpClient.FetchOptions for request options
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * @see https://restfulapi.net/http-status-codes/
 */
export class HttpClient {
  /**
   * Gets the base URL for all HTTP requests.
   *
   * This method reads the `HTTP_CLIENT_BASE_URL` environment variable, sanitizes it,
   * and removes any trailing backslashes for consistency.
   *
   * @returns {string} The sanitized base URL string.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const baseUrl = client.getBaseUrl();
   * // baseUrl might be "https://api.example.com"
   * ```
   */
  getBaseUrl(): string {
    return defaultStr(process.env.HTTP_CLIENT_BASE_URL).replace(/\\+$/, "");
  }

  /**
   * Retrieves a Bearer token for authentication.
   *
   * Override this method to provide dynamic authentication tokens for requests.
   *
   * @returns {string | Promise<string>} The Bearer token string or a promise resolving to it.
   *
   * @example
   * ```typescript
   * // Override in a subclass
   * class MyClient extends HttpClient {
   *   async getBeearToken() {
   *     return await getTokenFromStorage();
   *   }
   * }
   * ```
   */
  /**
   * Retrieves a Bearer token for authentication.
   *
   * Override this method to provide dynamic authentication tokens for requests.
   *
   * @returns {string | Promise<string>} The Bearer token string or a promise resolving to it.
   *
   * @example
   * ```typescript
   * // Override in a subclass
   * class MyClient extends HttpClient {
   *   async getBearerToken() {
   *     return await getTokenFromStorage();
   *   }
   * }
   * ```
   */
  getBearerToken(): string | Promise<string> {
    return "";
  }
  /**
   * Converts various header formats into a standardized `Headers` instance.
   *
   * @param headers - The headers to transform. Accepts an object, `Headers` instance, or undefined.
   * @returns {Headers} A standardized `Headers` instance.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const headers = client.transformRequestHeader({ Authorization: "Bearer token" });
   * // headers instanceof Headers === true
   * ```
   */
  transformRequestHeader(headers?: any): Headers {
    return headers instanceof Headers ? headers : new Headers(headers || {});
  }
  /**
   * Prepares and transforms fetch options before sending an HTTP request.
   *
   * This method is useful for customizing headers, authentication, or other options before each request.
   *
   * @param options - The original fetch options object.
   * @param path - The endpoint path being requested.
   * @returns {Promise<RequestInit>} The transformed options.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const opts = await client.transformRequestOptions({ headers: { Accept: "application/json" } }, "/users");
   * ```
   */
  async transformRequestOptions(
    options: IHttpClient.FetchOptions,
    path: string
  ): Promise<RequestInit> {
    options.headers = this.transformRequestHeader(options.headers);
    return options;
  }
  /**
   * Performs an authenticated HTTP fetch request with enhanced headers and optional filtering.
   *
   * Automatically attaches an authorization token, sets default headers, and supports advanced filtering.
   *
   * @param path - The endpoint path to request (e.g., "/users").
   * @param options - Optional fetch options (headers, query params, body, delay, etc.).
   * @returns {Promise<Response>} Resolves to the fetch Response object.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const response = await client.fetch("/users", { headers: { "X-Custom": "value" } });
   * ```
   */
  async fetch(
    path: string,
    options: IHttpClient.FetchOptions | null = null
  ): Promise<Response> {
    options = Object.assign({}, options);
    const token = await this.getBearerToken();
    const { xFilter } = options;
    const locale = await I18n.getInstance().getLocale();
    options.headers = Object.assign(
      {
        Accept: "application/json",
        "Accepted-Language": locale,
        Authorization: isNonNullString(token)
          ? "Bearer " +
            (token.includes("Bearer ") ? token.replace("Bearer ", "") : token)
          : undefined,
      },
      options.headers
    );
    if (xFilter) {
      options.headers = Object.assign(
        {},
        {
          "X-filter": JsonHelper.isJSON(xFilter)
            ? xFilter
            : JSON.stringify(xFilter),
        },
        options.headers
      );
    }
    const transformedOptions = await this.transformRequestOptions(
      options,
      path
    );
    return this.timeout(
      new Promise((resolve, reject) => {
        return fetch(
          this.buildUrl(path, options.queryParams),
          transformedOptions
        ).then(async (res) => {
          if (this.isSuccessStatus(res.status)) {
            resolve(res);
          } else {
            try {
              const r = await this.handleFetchError(res, path, options);
              reject(r);
            } catch (error) {
              reject(error);
            }
          }
        });
      }),
      options.delay
    );
  }
  /**
   * Sends an HTTP request and parses the response body as JSON.
   *
   * @typeParam T - The expected type of the parsed JSON response.
   * @param path - The URL or endpoint to request.
   * @param options - Optional fetch options.
   * @returns {Promise<T>} Resolves to the parsed JSON response.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const data = await client.fetchJSon<{ users: User[] }>("/users");
   * ```
   */
  /**
   * Sends an HTTP request and parses the response body as JSON.
   *
   * @typeParam T - The expected type of the parsed JSON response.
   * @param path - The URL or endpoint to request.
   * @param options - Optional fetch options.
   * @returns {Promise<T>} Resolves to the parsed JSON response.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const data = await client.fetchJson<{ users: User[] }>("/users");
   * ```
   */
  async fetchJson<T = Response>(
    path: string,
    options: IHttpClient.FetchOptions = {}
  ): Promise<T> {
    return this.fetch(path, options).then((res: Response) => {
      return res.json();
    });
  }
  /**
   * Handles errors that occur during a fetch operation and throws a standardized error object.
   *
   * If error handling is disabled via options, the original error is re-thrown.
   *
   * @param error - The error object thrown by the fetch operation.
   * @param path - The endpoint path associated with the error.
   * @param options - Fetch options, which may include an error handling flag.
   * @throws An object containing a formatted error message, the request path, and the original error.
   *
   * @example
   * ```typescript
   * try {
   *   await client.fetch("/bad-endpoint");
   * } catch (err) {
   *   console.error(err.message, err.path);
   * }
   * ```
   */
  async handleFetchError(
    error: any,
    path: string,
    options: IHttpClient.FetchOptions
  ) {
    if (options?.handleErrors !== false) {
      let message =
        typeof error == "object" && error
          ? defaultStr(
              error.message,
              error.ExceptionMessage,
              error.Message,
              error.MessageDetail,
              error.msg,
              error.error
            )
          : null;
      if (
        defaultStr(Object.prototype.toString.call(error?.target)).includes(
          "XMLHttpRequest"
        ) &&
        error.target.status === 0
      ) {
        message = defaultStr(
          error.message,
          error.msg,
          I18n.getInstance().t("httpClient.serverUnreachable")
        );
      }
      if (!message) {
        message = error?.toString();
      }
      throw { message, path, error };
    }
    throw error;
  }
  /**
   * Builds a complete URL by combining the provided endpoint with the base API host and query parameters.
   *
   * Throws an error if the API host is not set or invalid.
   *
   * @param url - The endpoint or base URL to build upon.
   * @param queryParams - Optional query parameters to append.
   * @returns {string} The fully constructed URL.
   * @throws Error if the API host environment variable is not set or invalid.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const fullUrl = client.buildUrl("/users", { page: 2 });
   * // fullUrl might be "https://api.example.com/users?page=2"
   * ```
   */
  buildUrl(url: string, queryParams?: Record<string, any>) {
    if (!isValidUrl(url)) {
      const apiHost = defaultStr(this.getBaseUrl()).replace(/\\+$/, "");
      if (!isValidUrl(apiHost)) {
        throw new Error(`HTTP_CLIENT_BASE_URL environment variable is not set`);
      }
      if (!isNonNullString(url)) {
        throw new Error(`Invalid URL provided: ${url}`);
      }
    }
    return setQueryParams((url as string).replace(/\\+$/, ""), queryParams);
  }

  /**
   * Checks if the provided HTTP status code is considered a successful response.
   *
   * @param status - The HTTP status code (string or number).
   * @returns {boolean} True if the status code is successful, false otherwise.
   *
   * @example
   * ```typescript
   * client.isSuccessStatus(200); // true
   * client.isSuccessStatus("404"); // false
   * ```
   */
  isSuccessStatus(status: string | number): boolean {
    if (typeof status == "string") {
      status = parseInt(status);
    }
    if (!isNumber(status)) return false;
    return HttpClient.SUCCESS_STATUSES.includes(status);
  }

  /**
   * Gets the default delay (in milliseconds) for fetch operations.
   *
   * @returns {number} The default fetch delay (120000 ms = 2 minutes).
   *
   * @example
   * ```typescript
   * const delay = client.getFetchDelay(); // 120000
   * ```
   */
  getFetchDelay(): number {
    return 120000;
  }

  /**
   * Wraps a promise with a timeout, rejecting if the promise does not resolve within the specified delay.
   *
   * @typeParam T - The type of the resolved value.
   * @param promise - The promise to wrap.
   * @param delay - Optional timeout in milliseconds. Uses default if not provided or too short.
   * @returns {Promise<T>} Resolves or rejects with the original promise, or rejects with a timeout error.
   *
   * @example
   * ```typescript
   * await client.timeout(fetch("/slow"), 5000);
   * ```
   */
  async timeout<T = Response>(promise: Promise<T>, delay?: number): Promise<T> {
    delay = isNumber(delay) && delay > 1000 ? delay : this.getFetchDelay();
    return new Promise(function (resolve, reject) {
      const tt = setTimeout(function () {
        reject({ message: I18n.getInstance().t("httpClient.runTimeoutError") });
      }, delay);
      return promise
        .then(resolve)
        .catch(reject)
        .finally(() => {
          clearTimeout(tt);
        });
    });
  }

  /**
   * Transforms the HTTP response based on its content type.
   *
   * If the response is JSON, parses and returns it as type `T`. Otherwise, returns the raw response.
   *
   * @typeParam T - The expected return type.
   * @param response - The HTTP response to transform.
   * @param options - Additional fetch options (for extensibility).
   * @returns {Promise<T>} Resolves to the transformed response.
   *
   * @example
   * ```typescript
   * const res = await client.fetch("/data");
   * const json = await client.transformResponse(res, {});
   * ```
   */
  async transformResponse<T = Response>(
    response: Response,
    options: IHttpClient.FetchOptions
  ): Promise<T> {
    if (response instanceof Response) {
      if (response.headers.has("Content-Type")) {
        const contentType = defaultStr(
          response.headers.get("Content-Type")
        ).toLowerCase();
        if (contentType.includes("application/json")) {
          return response.json() as T;
        }
      }
    }
    return response as T;
  }

  /**
   * Sends an HTTP POST request to the specified URL.
   *
   * @typeParam T - The expected response type after transformation.
   * @param url - The endpoint URL for the POST request.
   * @param options - Optional fetch options.
   * @returns {Promise<T>} Resolves to the transformed response.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const result = await client.post<{ id: number }>("/users", { body: JSON.stringify({ name: "John" }) });
   * ```
   */
  post<T>(url: string, options: IHttpClient.FetchOptions = {}) {
    options = Object.assign({}, options);
    options.method = options.method || "POST";
    return this.fetch(url, options).then((res) => {
      return this.transformResponse<T>(res, options);
    });
  }

  /**
   * Sends an HTTP PATCH request to the specified URL.
   *
   * @typeParam T - The expected response type after transformation.
   * @param url - The endpoint URL for the PATCH request.
   * @param options - Optional fetch options.
   * @returns {Promise<T>} Resolves to the transformed response.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const result = await client.patch("/users/1", { body: JSON.stringify({ name: "Jane" }) });
   * ```
   */
  patch<T>(url: string, options: IHttpClient.FetchOptions = {}) {
    options = Object.assign({}, options);
    options.method = options.method || "PATCH";
    return this.fetch(url, options).then((res) => {
      return this.transformResponse<T>(res, options);
    });
  }

  /**
   * Sends an HTTP PUT request to the specified URL.
   *
   * @typeParam T - The expected response type after transformation.
   * @param url - The endpoint URL for the PUT request.
   * @param options - Optional fetch options.
   * @returns {Promise<T>} Resolves to the transformed response.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const result = await client.put("/users/1", { body: JSON.stringify({ name: "Jane" }) });
   * ```
   */
  put<T>(url: string, options: IHttpClient.FetchOptions = {}) {
    options = Object.assign({}, options);
    options.method = options.method || "PUT";
    return this.fetch(url, options).then((res) => {
      return this.transformResponse<T>(res, options);
    });
  }

  /**
   * Sends an HTTP DELETE request to the specified URL.
   *
   * @typeParam T - The expected response type.
   * @param url - The endpoint URL for the DELETE request.
   * @param options - Optional fetch options.
   * @returns {Promise<T>} Resolves to the transformed response.
   *
   * @example
   * ```typescript
   * const client = new HttpClient();
   * const result = await client.delete("/users/1");
   * ```
   */
  delete<T>(url: string, options: IHttpClient.FetchOptions = {}) {
    options = Object.assign({}, options);
    options.method = "DELETE";
    return this.fetch(url, options).then((res) => {
      return this.transformResponse<T>(res, options);
    });
  }

  /**
   * Collection of standard HTTP status codes used to indicate the result of an HTTP request.
   *
   * This object provides named constants for commonly used HTTP status codes, including success, client error, and server error responses.
   *
   * @example
   * ```typescript
   * if (response.status === HttpClient.STATUSES.SUCCESS) {
   *   // Handle successful response
   * }
   * ```
   *
   * @see https://www.restapitutorial.com/httpstatuscodes.html
   * @see https://developer.mozilla.org/fr/docs/Web/HTTP/Status#r%C3%A9ponses_derreur_c%C3%B4t%C3%A9_client
   * @see https://restfulapi.net/http-status-codes/
   *
   * @property SUCCESS - 200: Indicates that the request has succeeded.
   * @property CREATED - 201: Indicates that the request has succeeded and a new resource has been created as a result.
   * @property ACCEPTED - 202: Indicates that the request has been received but not completed yet, typically used in long-running requests and batch processing.
   * @property NON_AUTHORITATIVE_INFORMATION - 203: Indicates that the returned metainformation is not definitive and may be from a local or third-party copy.
   * @property NO_CONTENT - 204: The server has fulfilled the request but does not need to return a response body.
   * @property RESET_CONTENT - 205: Indicates the client should reset the document which sent this request.
   * @property PARTIAL_CONTENT - 206: Used when the Range header is sent from the client to request only part of a resource.
   * @property MULTI_STATUS - 207: Indicates multiple operations happened; status for each can be found in the response body.
   * @property ALREADY_REPORTED - 208: Indicates the same resource was mentioned earlier; appears only in response bodies.
   * @property IM_USED - 226: The response is a representation of the result of one or more instance-manipulations applied to the current instance.
   * @property INTERNAL_SERVER_ERROR - 500: Indicates an internal server error.
   * @property SERVICE_UNAVAILABLE - 503: Indicates the service is unavailable.
   * @property BAD_REQUEST - 400: The server could not understand the request due to invalid syntax.
   * @property UNAUTHORIZED - 401: The client must authenticate itself to get the requested response.
   * @property PAYMENT_REQUIRED - 402: Reserved for future use; not currently used.
   * @property FORBIDEN - 403: The client does not have access rights to the content.
   * @property NOT_FOUND - 404: The server cannot find the requested resource.
   * @property METHOD_NOT_ALLOWED - 405: The request method is known but not supported by the target resource.
   * @property NOT_ACCEPTABLE - 406: The server cannot produce a response matching the list of acceptable values defined in the request's headers.
   */
  static STATUSES = {
    /***
            Indicates that the request has succeeded.
        */
    SUCCESS: 200,
    /***
            Indicates that the request has succeeded and a new resource has been created as a result.
        */
    CREATED: 201,
    /***
            Indicates that the request has been received but not completed yet. It is typically used in log running requests and batch processing.
        */
    ACCEPTED: 202,

    /***
            Indicates that the returned metainformation in the entity-header is not the definitive set as available from the origin server, but is gathered from a local or a third-party copy. The set presented MAY be a subset or superset of the original version.
        */
    NON_AUTHORITATIVE_INFORMATION: 203,
    /**
     * The server has fulfilled the request but does not need to return a response body. The server may return the updated meta information.
     */
    NO_CONTENT: 204,

    /***
            Indicates the client to reset the document which sent this request.
        */
    RESET_CONTENT: 205,

    /***
            It is used when the Range header is sent from the client to request only part of a resource.
        */
    PARTIAL_CONTENT: 206,

    /***
            An indicator to a client that multiple operations happened, and that the status for each operation can be found in the body of the response.
        */
    MULTI_STATUS: 207,

    /***
            Allows a client to tell the server that the same resource (with the same binding) was mentioned earlier. It never appears as a true HTTP response code in the status line, and only appears in bodies.
        */
    ALREADY_REPORTED: 208,

    /**
     * The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
     */
    IM_USED: 226,

    /***
     * status internal server error
     */
    INTERNAL_SERVER_ERROR: 500,

    /***
     * status service unavailable
     */
    SERVICE_UNAVAILABLE: 503,

    ////400 errors, client side
    ///Cette réponse indique que le serveur n'a pas pu comprendre la requête à cause d'une syntaxe invalide.
    BAD_REQUEST: 400,

    ///Bien que le standard HTTP indique « non-autorisé », la sémantique de cette réponse correspond à « non-authentifié » : le client doit s'authentifier afin d'obtenir la réponse demandée.
    UNAUTHORIZED: 401,

    ///Ce code de réponse est réservé à une utilisation future. Le but initial justifiant la création de ce code était l'utilisation de systèmes de paiement numérique. Cependant, il n'est pas utilisé actuellement et aucune convention standard n'existe à ce sujet.
    PAYMENT_REQUIRED: 402,

    ///Le client n'a pas les droits d'accès au contenu, donc le serveur refuse de donner la véritable réponse.
    FORBIDEN: 403,
    //Le serveur n'a pas trouvé la ressource demandée. Ce code de réponse est principalement connu pour son apparition fréquente sur le web.
    NOT_FOUND: 404,

    ///La méthode de la requête est connue du serveur mais n'est pas prise en charge pour la ressource cible. Par exemple, une API peut ne pas autoriser l'utilisation du verbe DELETE pour supprimer une ressource.
    METHOD_NOT_ALLOWED: 405,

    ///Cette réponse est envoyée quand le serveur web, après une négociation de contenu géré par le serveur, ne trouve rien qui satisfasse les critères donnés par l'agent utilisateur.
    NOT_ACCEPTABLE: 406,
  };
  /**
   * List of HTTP status codes considered as successful responses.
   *
   * Includes standard success codes such as 200 (OK), 201 (Created), 202 (Accepted), and more.
   * Used to determine if a response should be treated as a success.
   *
   * @example
   * ```typescript
   * if (HttpClient.SUCCESS_STATUSES.includes(response.status)) {
   *   // Success!
   * }
   * ```
   */
  static SUCCESS_STATUSES = [
    HttpClient.STATUSES.SUCCESS,
    HttpClient.STATUSES.CREATED,
    HttpClient.STATUSES.ACCEPTED,
    HttpClient.STATUSES.NON_AUTHORITATIVE_INFORMATION,
    HttpClient.STATUSES.NO_CONTENT,
    HttpClient.STATUSES.RESET_CONTENT,
    HttpClient.STATUSES.PARTIAL_CONTENT,
    HttpClient.STATUSES.MULTI_STATUS,
    HttpClient.STATUSES.ALREADY_REPORTED,
    HttpClient.STATUSES.IM_USED,
  ];
}

export namespace IHttpClient {
  /**
   * Options for configuring HTTP requests made by `HttpClient`.
   *
   * Extends the standard `RequestInit` options from the Fetch API, adding support for delays, error handling,
   * query parameters, advanced filtering, and custom behaviors.
   *
   * @property delay - Optional timeout in milliseconds before the request is considered failed.
   * @property handleErrors - If false, disables automatic error transformation and throws raw errors.
   * @property queryParams - Object containing query parameters to append to the request URL.
   * @property xFilter - Advanced filter object, serialized as JSON for the `X-filter` header.
   * @property redirectToSigninPageOn401Response - If true, automatically redirects to sign-in page on 401 responses.
   * @property body - The request body (string, object, or FormData).
   *
   * @example
   * ```typescript
   * const options: IHttpClient.FetchOptions = {
   *   method: "POST",
   *   body: JSON.stringify({ name: "John" }),
   *   queryParams: { page: 2 },
   *   delay: 5000,
   *   handleErrors: true,
   * };
   * ```
   */
  export interface FetchOptions extends RequestInit {
    delay?: number;
    handleErrors?: boolean;
    queryParams?: Record<string, any>;
    xFilter?: any;
    redirectToSignInOn401?: boolean;
    body?: any;
  }
}
