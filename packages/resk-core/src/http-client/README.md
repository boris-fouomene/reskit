# HttpClient Module User Guide

Welcome to the **HttpClient** module! This guide provides a comprehensive overview of its features, classes, interfaces, methods, and properties, with clear descriptions, parameter explanations, return value details, and practical examples for every aspect.

---

## 🚀 Features
- **TypeScript/JavaScript Support**: Fully typed, extensible API for HTTP requests
- **Authentication**: Automatic Bearer token support (customizable)
- **Custom Headers & Options**: Easily transform and extend request headers and options
- **RESTful Methods**: Built-in support for GET, POST, PUT, PATCH, DELETE
- **Timeouts & Delays**: Manage request timeouts and delays
- **Error Handling**: Standardized, customizable error transformation
- **Response Transformation**: Type-safe JSON and raw response handling
- **Extensibility**: Override methods for custom authentication, logging, or hooks

---

## 📦 Installation
```bash
npm install reskit-core
```

---

## 🏁 Quick Start
```typescript
import { HttpClient } from 'reskit-core';

const client = new HttpClient();
const users = await client.fetchJson<User[]>("/users");
const result = await client.post<{ id: number }>("/users", { body: JSON.stringify({ name: "John" }) });
```

---

## 📚 Classes & Interfaces

### HttpClient
A robust, extensible class for making HTTP requests.

#### Constructor
```typescript
const client = new HttpClient();
```

#### Methods

- **getBaseUrl()**
  - Gets the base URL for all HTTP requests.
  - **Returns**: `string` (sanitized base URL)
  - **Example**:
    ```typescript
    const baseUrl = client.getBaseUrl();
    // "https://api.example.com"
    ```

- **getBearerToken()**
  - Retrieves a Bearer token for authentication. Override for dynamic tokens.
  - **Returns**: `string | Promise<string>`
  - **Example**:
    ```typescript
    class MyClient extends HttpClient {
      async getBearerToken() { return await getTokenFromStorage(); }
    }
    ```

- **transformRequestHeader(headers?)**
  - Converts headers to a standardized `Headers` instance.
  - **Parameters**: `headers` (object, `Headers`, or undefined)
  - **Returns**: `Headers`
  - **Example**:
    ```typescript
    const headers = client.transformRequestHeader({ Authorization: "Bearer token" });
    ```

- **transformRequestOptions(options, path)**
  - Prepares and transforms fetch options before sending a request.
  - **Parameters**: `options` (`IHttpClient.FetchOptions`), `path` (string)
  - **Returns**: `IHttpClient.FetchOptions | Promise<IHttpClient.FetchOptions>`
  - **Example**:
    ```typescript
    const opts = await client.transformRequestOptions({ headers: { Accept: "application/json" } }, "/users");
    ```

- **fetch(path, options?)**
  - Performs an authenticated HTTP fetch request with enhanced headers and optional filtering.
  - **Parameters**: `path` (string), `options` (`IHttpClient.FetchOptions`)
  - **Returns**: `Promise<Response>`
  - **Example**:
    ```typescript
    const response = await client.fetch("/users", { headers: { "X-Custom": "value" } });
    ```

- **fetchJson<T>(path, options?)**
  - Sends an HTTP request and parses the response body as JSON.
  - **TypeParam**: `T` (expected JSON type)
  - **Parameters**: `path` (string), `options` (`IHttpClient.FetchOptions`)
  - **Returns**: `Promise<T>`
  - **Example**:
    ```typescript
    const data = await client.fetchJson<{ users: User[] }>("/users");
    ```

- **handleFetchError(error, path, options)**
  - Handles errors during fetch, throws a standardized error object.
  - **Parameters**: `error` (any), `path` (string), `options` (`IHttpClient.FetchOptions`)
  - **Throws**: `{ message, path, error }` or raw error
  - **Example**:
    ```typescript
    try { await client.fetch("/bad-endpoint"); } catch (err) { console.error(err.message, err.path); }
    ```

- **buildUrl(url, queryParams?)**
  - Builds a complete URL with base API host and query parameters.
  - **Parameters**: `url` (string), `queryParams` (object)
  - **Returns**: `string`
  - **Example**:
    ```typescript
    const fullUrl = client.buildUrl("/users", { page: 2 });
    ```

- **isSuccessStatus(status)**
  - Checks if the HTTP status code is successful.
  - **Parameters**: `status` (string or number)
  - **Returns**: `boolean`
  - **Example**:
    ```typescript
    client.isSuccessStatus(200); // true
    client.isSuccessStatus("404"); // false
    ```

- **getFetchDelay()**
  - Gets the default delay for fetch operations (ms).
  - **Returns**: `number` (default: 120000)
  - **Example**:
    ```typescript
    const delay = client.getFetchDelay(); // 120000
    ```

- **timeout<T>(promise, delay?)**
  - Wraps a promise with a timeout.
  - **TypeParam**: `T`
  - **Parameters**: `promise` (`Promise<T>`), `delay` (number)
  - **Returns**: `Promise<T>`
  - **Example**:
    ```typescript
    await client.timeout(fetch("/slow"), 5000);
    ```

- **transformResponse<T>(response, options)**
  - Transforms the HTTP response based on content type.
  - **TypeParam**: `T`
  - **Parameters**: `response` (`Response`), `options` (`IHttpClient.FetchOptions`)
  - **Returns**: `Promise<T>`
  - **Example**:
    ```typescript
    const res = await client.fetch("/data");
    const json = await client.transformResponse(res, {});
    ```

- **post<T>(url, options?)**
  - Sends an HTTP POST request.
  - **TypeParam**: `T`
  - **Parameters**: `url` (string), `options` (`IHttpClient.FetchOptions`)
  - **Returns**: `Promise<T>`
  - **Example**:
    ```typescript
    const result = await client.post<{ id: number }>("/users", { body: JSON.stringify({ name: "John" }) });
    ```

- **patch<T>(url, options?)**
  - Sends an HTTP PATCH request.
  - **TypeParam**: `T`
  - **Parameters**: `url` (string), `options` (`IHttpClient.FetchOptions`)
  - **Returns**: `Promise<T>`
  - **Example**:
    ```typescript
    const result = await client.patch("/users/1", { body: JSON.stringify({ name: "Jane" }) });
    ```

- **put<T>(url, options?)**
  - Sends an HTTP PUT request.
  - **TypeParam**: `T`
  - **Parameters**: `url` (string), `options` (`IHttpClient.FetchOptions`)
  - **Returns**: `Promise<T>`
  - **Example**:
    ```typescript
    const result = await client.put("/users/1", { body: JSON.stringify({ name: "Jane" }) });
    ```

- **delete<T>(url, options?)**
  - Sends an HTTP DELETE request.
  - **TypeParam**: `T`
  - **Parameters**: `url` (string), `options` (`IHttpClient.FetchOptions`)
  - **Returns**: `Promise<T>`
  - **Example**:
    ```typescript
    const result = await client.delete("/users/1");
    ```

- **STATUSES**
  - Collection of standard HTTP status codes (success, client error, server error)
  - **Example**:
    ```typescript
    if (response.status === HttpClient.STATUSES.SUCCESS) { /* ... */ }
    ```

- **SUCCESS_STATUSES**
  - List of HTTP status codes considered successful
  - **Example**:
    ```typescript
    if (HttpClient.SUCCESS_STATUSES.includes(response.status)) { /* ... */ }
    ```

---

### IHttpClient.FetchOptions
Interface for configuring HTTP requests.

- **delay**: Optional timeout in ms before request fails
- **handleErrors**: If false, disables automatic error transformation
- **queryParams**: Object of query parameters to append to URL
- **xFilter**: Advanced filter object, serialized for `X-filter` header
- **redirectToSignInOn401**: If true, redirects to sign-in page on 401
- **body**: Request body (string, object, or FormData)

**Example:**
```typescript
const options: IHttpClient.FetchOptions = {
  method: "POST",
  body: JSON.stringify({ name: "John" }),
  queryParams: { page: 2 },
  delay: 5000,
  handleErrors: true,
  redirectToSignInOn401: true,
};
```

---

## 💡 Tips & Best Practices
- Override `getBearerToken()` for custom authentication
- Use `transformRequestOptions` for advanced request customization
- Always handle errors with try/catch for robust applications
- Use `fetchJson` for automatic JSON parsing
- Use `timeout` for requests that may hang or need strict timeouts
- All methods are async and return Promises

---

## 🔗 Resources
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTTP Status Codes](https://restfulapi.net/http-status-codes/)

---

## 🏆 Get Started Now!
Start building robust, type-safe, and customizable HTTP logic for your applications with the HttpClient module. Happy coding!
