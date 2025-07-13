import defaultStr from "@utils/defaultStr";
import isNonNullString from "@utils/isNonNullString";
import { isNumber } from "@utils/isNumber";
import { isValidUrl, setQueryParams } from "@utils/uri";
import { I18n } from "../i18n";
import { JsonHelper } from "@utils/json";

export class HttpClient {
  /**
   * Retrieves the base URL for the HTTP client.
   *
   * This method obtains the value of the `HTTP_CLIENT_BASE_URL` environment variable,
   * ensures it is a string (using `defaultStr`), and removes any trailing backslashes.
   *
   * @returns {string} The sanitized base URL without trailing backslashes.
   */
  getBaseUrl(): string {
    return defaultStr(process.env.HTTP_CLIENT_BASE_URL).replace(/\\+$/, "");
  }

  /**
   * Retrieves a Bearer token for authentication.
   *
   * @returns The Bearer token as a string, or a Promise that resolves to a string.
   */
  getBeearToken(): string | Promise<string> {
    return "";
  }
  /**
   * Transforms the provided headers into a `Headers` instance.
   *
   * @param headers - The headers to transform. Can be an instance of `Headers`, an object, or undefined.
   * @returns A `Headers` instance containing the provided headers.
   */
  transformRequestHeader(headers?: any): Headers {
    return headers instanceof Headers ? headers : new Headers(headers || {});
  }
  /**
   * Transforms the request options before making an HTTP request.
   *
   * This method modifies the provided `options` object, typically by transforming its headers
   * using the `transformRequestHeader` method. It returns the modified options, either synchronously
   * or as a Promise.
   *
   * @param options - The original fetch options for the HTTP request.
   * @param path - The request path or endpoint being called.
   * @returns The transformed fetch options, either directly or wrapped in a Promise.
   */
  transformRequestOptions(options: IHttpClient.FetchOptions, path: string): IHttpClient.FetchOptions | Promise<IHttpClient.FetchOptions> {
    options.headers = this.transformRequestHeader(options.headers);
    return options;
  }
  /**
   * Performs an authenticated HTTP fetch request with enhanced headers and optional filtering.
   *
   * @param path - The endpoint path to request.
   * @param options - Optional fetch options, including headers, query parameters, body, and delay.
   * @returns A promise that resolves to the fetch Response object.
   *
   * @remarks
   * - Automatically attaches an authorization token if available.
   * - Sets default headers for JSON content and localization.
   * - Supports an `xFilter` option for advanced filtering, serialized as JSON if necessary.
   * - Uses a timeout wrapper to optionally delay the request.
   */
  async fetch(path: string, options: IHttpClient.FetchOptions | null = null): Promise<Response> {
    options = Object.assign({}, options);
    const token = await this.getBeearToken();
    const { xFilter } = options;
    const locale = await I18n.getInstance().getLocale();
    options.headers = Object.assign(
      {
        Accept: "application/json",
        "Accepted-Language": locale,
        Authorization: isNonNullString(token) ? "Bearer " + (token.includes("Bearer ") ? token.replace("Bearer ", "") : token) : undefined,
      },
      options.headers
    );
    if (xFilter) {
      options.headers = Object.assign({}, { "X-filter": JsonHelper.isJSON(xFilter) ? xFilter : JSON.stringify(xFilter) }, options.headers);
    }
    const transformedOptions = await this.transformRequestOptions(options, path);
    return this.timeout(
      new Promise((resolve, reject) => {
        return fetch(this.buildUrl(path, options.queryParams), transformedOptions).then(async (res) => {
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
   * Sends an HTTP request to the specified path and parses the response body as JSON.
   *
   * @typeParam T - The expected type of the parsed JSON response. Defaults to `Response`.
   * @param path - The URL or path to which the request is sent.
   * @param options - Optional fetch options to customize the request.
   * @returns A promise that resolves to the parsed JSON response of type `T`.
   */
  async fetchJSon<T = Response>(path: string, options: IHttpClient.FetchOptions = {}): Promise<T> {
    return this.fetch(path, options).then((res: Response) => {
      return res.json();
    });
  }
  /**
   * Handles errors that occur during a fetch operation, formats the error message,
   * and throws a standardized error object. If error handling is disabled via options,
   * the original error is re-thrown.
   *
   * @param error - The error object thrown by the fetch operation.
   * @param path - The request path or endpoint associated with the error.
   * @param options - Fetch options, which may include an error handling flag.
   * @throws An object containing a formatted error message, the request path, and the original error,
   *         or re-throws the original error if error handling is disabled.
   */
  async handleFetchError(error: any, path: string, options: IHttpClient.FetchOptions) {
    if (options?.handleErrors !== false) {
      let message = typeof error == "object" && error ? defaultStr(error.message, error.ExceptionMessage, error.Message, error.MessageDetail, error.msg, error.error) : null;
      if (defaultStr(Object.prototype.toString.call(error?.target)).includes("XMLHttpRequest") && error.target.status === 0) {
        message = defaultStr(error.message, error.msg, I18n.getInstance().t("httpClient.serverUnreachable"));
      }
      if (!message) {
        message = error?.toString();
      }
      throw { message, path, error };
    }
    throw error;
  }
  /**
   * Builds a complete URL by combining the provided URL with an API host and optional query parameters.
   * If the given URL is not valid, it constructs the URL using the API host from the environment variable `_HTTP_CLIENT_BASE_URL`.
   * Throws an error if the API host is not set or invalid.
   *
   * @param url - The base URL or endpoint to build upon.
   * @param queryParams - Optional query parameters to append to the URL.
   * @returns The fully constructed URL with query parameters if provided.
   * @throws Error if the API host environment variable is not set or invalid.
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
   * Determines whether the provided HTTP status code represents a successful response.
   *
   * Converts the status to a number if it is provided as a string, checks if it is a valid number,
   * and then verifies if it is included in the list of successful status codes defined by `HttpClient.SUCCESS_STATUSES`.
   *
   * @param status - The HTTP status code to check, as a string or number.
   * @returns `true` if the status code is considered successful; otherwise, `false`.
   */
  isSuccessStatus(status: string | number): boolean {
    if (typeof status == "string") {
      status = parseInt(status);
    }
    if (!isNumber(status)) return false;
    return HttpClient.SUCCESS_STATUSES.includes(status);
  }

  /**
   * Returns the delay duration (in milliseconds) to be used for fetch operations.
   *
   * @returns {number} The fetch delay in milliseconds. Default is 120000 (2 minutes).
   */
  getFetchDelay(): number {
    return 120000;
  }

  /**
   * Wraps a promise with a timeout, rejecting if the promise does not resolve within the specified delay.
   *
   * @template T - The type of the resolved value of the promise.
   * @param promise - The promise to wrap with a timeout.
   * @param delay - Optional timeout in milliseconds. If not provided or less than or equal to 1000, a default delay is used.
   * @returns A promise that resolves or rejects with the original promise, or rejects with a timeout error if the delay is exceeded.
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
   * Transforms the given HTTP response based on its content type.
   *
   * If the response has a "Content-Type" header indicating "application/json",
   * the response body is parsed as JSON and returned as type `T`.
   * Otherwise, the raw `Response` object is returned as type `T`.
   *
   * @typeParam T - The expected return type, defaults to `Response`.
   * @param response - The HTTP response to transform.
   * @param options - Additional fetch options (not used in this method, but provided for extensibility).
   * @returns A promise resolving to the transformed response as type `T`.
   */
  async transformResponse<T = Response>(response: Response, options: IHttpClient.FetchOptions): Promise<T> {
    if (response instanceof Response) {
      if (response.headers.has("Content-Type")) {
        const contentType = defaultStr(response.headers.get("Content-Type")).toLowerCase();
        if (contentType.includes("application/json")) {
          return response.json() as T;
        }
      }
    }
    return response as T;
  }

  /**
   * Sends an HTTP POST request to the specified URL with the provided options.
   *
   * @typeParam T - The expected response type after transformation.
   * @param url - The endpoint URL to which the POST request is sent.
   * @param options - Optional fetch options to customize the request. If not provided, defaults are used.
   * @returns A promise that resolves to the transformed response of type `T`.
   */
  post<T>(url: string, options: IHttpClient.FetchOptions = {}) {
    options = Object.assign({}, options);
    options.method = options.method || "POST";
    return this.fetch(url, options).then((res) => {
      return this.transformResponse<T>(res, options);
    });
  }

  /**
   * Sends an HTTP PATCH request to the specified URL with the provided options.
   *
   * @typeParam T - The expected response type after transformation.
   * @param url - The endpoint URL to send the PATCH request to.
   * @param options - Optional fetch options to customize the request.
   * @returns A promise that resolves to the transformed response of type `T`.
   */
  patch<T>(url: string, options: IHttpClient.FetchOptions = {}) {
    options = Object.assign({}, options);
    options.method = options.method || "PATCH";
    return this.fetch(url, options).then((res) => {
      return this.transformResponse<T>(res, options);
    });
  }

  /**
   * Sends an HTTP PUT request to the specified URL with the provided options.
   *
   * @template T - The expected response type after transformation.
   * @param url - The endpoint URL to send the PUT request to.
   * @param options - Optional fetch options to customize the request. Defaults to an empty object.
   * @returns A promise that resolves to the transformed response of type `T`.
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
   * @template T - The expected response type.
   * @param url - The endpoint URL to send the DELETE request to.
   * @param options - Optional fetch options to customize the request.
   * @returns A promise that resolves to the transformed response of type `T`.
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
   * @remarks
   * This object provides named constants for commonly used HTTP status codes, including success, client error, and server error responses.
   *
   * @example
   * ```typescript
   * if (response.status === HttpClient.STATUSES.SUCCESS) {
   *   // Handle successful response
   * }
   * ```
   * @see : https://www.restapitutorial.com/httpstatuscodes.html.
   * @see : https://developer.mozilla.org/fr/docs/Web/HTTP/Status#r%C3%A9ponses_derreur_c%C3%B4t%C3%A9_client
   * @see : https://restfulapi.net/http-status-codes/
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
   * This array includes standard success codes such as 200 (OK), 201 (Created),
   * 202 (Accepted), and others that indicate a successful or partially successful
   * HTTP request. Used to determine if a response should be treated as a success.
   */
  static SUCCESS_STATUSES = [HttpClient.STATUSES.SUCCESS, HttpClient.STATUSES.CREATED, HttpClient.STATUSES.ACCEPTED, HttpClient.STATUSES.NON_AUTHORITATIVE_INFORMATION, HttpClient.STATUSES.NO_CONTENT, HttpClient.STATUSES.RESET_CONTENT, HttpClient.STATUSES.PARTIAL_CONTENT, HttpClient.STATUSES.MULTI_STATUS, HttpClient.STATUSES.ALREADY_REPORTED, HttpClient.STATUSES.IM_USED];
}

export namespace IHttpClient {
  export interface FetchOptions extends RequestInit {
    delay?: number;
    handleErrors?: boolean;
    queryParams?: Record<string, any>;
    xFilter?: any;
    redirectToSigninPageOn401Response?: boolean;
    body?: any;
  }
}
