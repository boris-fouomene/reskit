# 🌐 HTTP Client - @resk/core/http-client

> **Robust HTTP client with authentication, error handling, and response transformation**

## 📖 Overview

The HttpClient module provides a comprehensive HTTP client implementation with automatic authentication, error handling, timeout management, and response transformation. It extends the native Fetch API with enterprise-grade features for reliable API communication.

---

## 🚀 Quick Start

### **Basic HTTP Operations**

```typescript
import { HttpClient } from '@resk/core/http-client';

// Create HTTP client instance
const client = new HttpClient();

// Basic GET request
const response = await client.fetch('/api/users');
const users = await response.json();

// GET with JSON response parsing
const users = await client.fetchJSon<User[]>('/api/users');

// POST request
const newUser = await client.post<User>('/api/users', {
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  }),
  headers: {
    'Content-Type': 'application/json'
  }
});

// PUT request
const updatedUser = await client.put<User>('/api/users/123', {
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com'
  })
});

// PATCH request
const patchedUser = await client.patch<User>('/api/users/123', {
  body: JSON.stringify({
    email: 'newemail@example.com'
  })
});

// DELETE request
await client.delete('/api/users/123');
```

---

## 🏗️ Core Features

### **HttpClient Class**

```typescript
class HttpClient {
  // Base URL configuration
  getBaseUrl(): string;
  
  // Authentication
  getBeearToken(): string | Promise<string>;
  
  // Request transformation
  transformRequestHeader(headers?: any): Headers;
  transformRequestOptions(options: IHttpClient.FetchOptions, path: string): IHttpClient.FetchOptions | Promise<IHttpClient.FetchOptions>;
  
  // Core HTTP methods
  fetch(path: string, options?: IHttpClient.FetchOptions): Promise<Response>;
  fetchJSon<T = Response>(path: string, options?: IHttpClient.FetchOptions): Promise<T>;
  
  // HTTP verbs
  post<T>(url: string, options?: IHttpClient.FetchOptions): Promise<T>;
  patch<T>(url: string, options?: IHttpClient.FetchOptions): Promise<T>;
  put<T>(url: string, options?: IHttpClient.FetchOptions): Promise<T>;
  delete<T>(url: string, options?: IHttpClient.FetchOptions): Promise<T>;
  
  // Response handling
  transformResponse<T = Response>(response: Response, options: IHttpClient.FetchOptions): Promise<T>;
  
  // Error handling
  handleFetchError(error: any, path: string, options: IHttpClient.FetchOptions): Promise<never>;
  
  // Utilities
  buildUrl(url: string, queryParams?: Record<string, any>): string;
  isSuccessStatus(status: string | number): boolean;
  timeout<T = Response>(promise: Promise<T>, delay?: number): Promise<T>;
}
```

### **FetchOptions Interface**

```typescript
interface FetchOptions extends RequestInit {
  delay?: number;                              // Request timeout in milliseconds
  handleErrors?: boolean;                      // Enable/disable error handling
  queryParams?: Record<string, any>;           // Query parameters to append
  xFilter?: any;                              // Advanced filtering header
  redirectToSigninPageOn401Response?: boolean; // Auto-redirect on 401
  body?: any;                                 // Request body (any type)
}
```

---

## 🔒 Authentication

### **Bearer Token Authentication**

```typescript
class AuthenticatedHttpClient extends HttpClient {
  private token: string;
  
  constructor(token: string) {
    super();
    this.token = token;
  }
  
  getBeearToken(): string {
    return this.token;
  }
}

// Usage
const client = new AuthenticatedHttpClient('your-jwt-token');
const data = await client.fetchJSon('/api/protected-endpoint');

// Token is automatically added to Authorization header
// Authorization: Bearer your-jwt-token
```

### **Async Token Retrieval**

```typescript
class DynamicAuthClient extends HttpClient {
  async getBeearToken(): Promise<string> {
    // Retrieve token from storage, refresh if needed
    const token = await this.refreshTokenIfNeeded();
    return token;
  }
  
  private async refreshTokenIfNeeded(): Promise<string> {
    const stored = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('token_expiry');
    
    if (!stored || !expiry || Date.now() > parseInt(expiry)) {
      return await this.refreshToken();
    }
    
    return stored;
  }
  
  private async refreshToken(): Promise<string> {
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    const { token, expiresIn } = await response.json();
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token_expiry', String(Date.now() + expiresIn * 1000));
    
    return token;
  }
}
```

---

## 🌍 Base URL Configuration

### **Environment-Based Configuration**

```typescript
// Set base URL via environment variable
process.env.HTTP_CLIENT_BASE_URL = 'https://api.example.com';

class ConfigurableHttpClient extends HttpClient {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    super();
    this.baseUrl = baseUrl || process.env.HTTP_CLIENT_BASE_URL || '';
  }
  
  getBaseUrl(): string {
    return this.baseUrl.replace(/\\+$/, ''); // Remove trailing slashes
  }
}

// Usage
const prodClient = new ConfigurableHttpClient('https://api.production.com');
const devClient = new ConfigurableHttpClient('http://localhost:3000/api');
```

### **Multi-Environment Setup**

```typescript
enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

class EnvironmentAwareHttpClient extends HttpClient {
  private static BASE_URLS = {
    [Environment.DEVELOPMENT]: 'http://localhost:3000/api',
    [Environment.STAGING]: 'https://staging-api.example.com',
    [Environment.PRODUCTION]: 'https://api.example.com'
  };
  
  constructor(private environment: Environment = Environment.PRODUCTION) {
    super();
  }
  
  getBaseUrl(): string {
    return EnvironmentAwareHttpClient.BASE_URLS[this.environment];
  }
}

// Usage
const client = new EnvironmentAwareHttpClient(Environment.DEVELOPMENT);
```

---

## 🔧 Request Transformation

### **Header Transformation**

```typescript
class CustomHeaderClient extends HttpClient {
  transformRequestHeader(headers?: any): Headers {
    const transformedHeaders = super.transformRequestHeader(headers);
    
    // Add custom headers
    transformedHeaders.set('X-Client-Version', '1.0.0');
    transformedHeaders.set('X-Request-ID', this.generateRequestId());
    
    // Add API key if available
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      transformedHeaders.set('X-API-Key', apiKey);
    }
    
    return transformedHeaders;
  }
  
  private generateRequestId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

// Usage
const client = new CustomHeaderClient();
await client.fetch('/api/data'); // Includes custom headers automatically
```

### **Request Options Transformation**

```typescript
class LoggingHttpClient extends HttpClient {
  async transformRequestOptions(
    options: IHttpClient.FetchOptions, 
    path: string
  ): Promise<IHttpClient.FetchOptions> {
    // Log request details
    console.log(`Making ${options.method || 'GET'} request to ${path}`);
    
    // Add request timestamp
    options.headers = options.headers || {};
    (options.headers as any)['X-Request-Timestamp'] = new Date().toISOString();
    
    // Apply compression if body is large
    if (options.body && JSON.stringify(options.body).length > 10000) {
      (options.headers as any)['Content-Encoding'] = 'gzip';
      // Add compression logic here
    }
    
    return super.transformRequestOptions(options, path);
  }
}
```

---

## 🔍 Query Parameters & Filtering

### **Query Parameter Handling**

```typescript
// Basic query parameters
const users = await client.fetchJSon('/api/users', {
  queryParams: {
    page: 1,
    limit: 10,
    sort: 'name',
    filter: 'active'
  }
});
// Request: GET /api/users?page=1&limit=10&sort=name&filter=active

// Complex query parameters
const searchResults = await client.fetchJSon('/api/search', {
  queryParams: {
    q: 'javascript developer',
    location: ['New York', 'San Francisco'],
    experience: { min: 2, max: 10 },
    remote: true
  }
});
// Automatically serializes complex objects and arrays
```

### **Advanced Filtering with X-Filter Header**

```typescript
// X-Filter header for complex server-side filtering
const filteredData = await client.fetchJSon('/api/products', {
  xFilter: {
    $and: [
      { category: { $in: ['electronics', 'computers'] } },
      { price: { $gte: 100, $lte: 1000 } },
      { inStock: true }
    ]
  }
});

// JSON filter as string
const stringFilter = await client.fetchJSon('/api/orders', {
  xFilter: JSON.stringify({
    status: 'completed',
    createdAt: { $gte: '2024-01-01' }
  })
});

// The xFilter is automatically added as X-filter header
// X-filter: {"$and":[{"category":{"$in":["electronics","computers"]}},{"price":{"$gte":100,"$lte":1000}},{"inStock":true}]}
```

---

## ⚡ Response Transformation

### **Automatic Content-Type Detection**

```typescript
class SmartResponseClient extends HttpClient {
  async transformResponse<T = Response>(
    response: Response, 
    options: IHttpClient.FetchOptions
  ): Promise<T> {
    const contentType = response.headers.get('Content-Type')?.toLowerCase();
    
    if (contentType?.includes('application/json')) {
      return response.json() as T;
    } else if (contentType?.includes('text/')) {
      return response.text() as T;
    } else if (contentType?.includes('application/xml')) {
      const text = await response.text();
      // Parse XML and return as T
      return this.parseXML(text) as T;
    } else if (contentType?.includes('multipart/form-data')) {
      return response.formData() as T;
    }
    
    // Default to raw response
    return response as T;
  }
  
  private parseXML(xmlString: string): any {
    // XML parsing logic
    return { parsed: true, xml: xmlString };
  }
}
```

### **Response Interceptors**

```typescript
class InterceptorHttpClient extends HttpClient {
  private responseInterceptors: Array<(response: any) => any> = [];
  
  addResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor);
  }
  
  async transformResponse<T = Response>(
    response: Response, 
    options: IHttpClient.FetchOptions
  ): Promise<T> {
    let result = await super.transformResponse<T>(response, options);
    
    // Apply all interceptors
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    
    return result;
  }
}

// Usage
const client = new InterceptorHttpClient();

// Add logging interceptor
client.addResponseInterceptor((response) => {
  console.log('Response received:', response);
  return response;
});

// Add data transformation interceptor
client.addResponseInterceptor((response) => {
  if (response && response.data) {
    return response.data; // Unwrap data property
  }
  return response;
});
```

---

## 🚨 Error Handling

### **Built-in Error Handling**

```typescript
// Error handling is enabled by default
try {
  const data = await client.fetchJSon('/api/endpoint');
} catch (error) {
  console.log(error.message); // Formatted error message
  console.log(error.path);    // Request path
  console.log(error.error);   // Original error object
}

// Disable error handling for custom error processing
const response = await client.fetch('/api/endpoint', {
  handleErrors: false
});

if (!response.ok) {
  // Handle error manually
  const errorData = await response.json();
  throw new CustomError(errorData);
}
```

### **Custom Error Handler**

```typescript
class CustomErrorHttpClient extends HttpClient {
  async handleFetchError(
    error: any, 
    path: string, 
    options: IHttpClient.FetchOptions
  ): Promise<never> {
    // Extract error information
    const message = this.extractErrorMessage(error);
    
    // Log error details
    console.error('HTTP Error:', {
      message,
      path,
      status: error.status,
      timestamp: new Date().toISOString()
    });
    
    // Send error to monitoring service
    this.sendToMonitoring(error, path);
    
    // Create structured error
    const structuredError = {
      type: 'HTTP_ERROR',
      message,
      path,
      status: error.status,
      timestamp: Date.now(),
      requestId: this.getRequestId(options)
    };
    
    throw structuredError;
  }
  
  private extractErrorMessage(error: any): string {
    return error.message || 
           error.ExceptionMessage || 
           error.Message || 
           error.MessageDetail || 
           error.msg || 
           error.error || 
           'Unknown error occurred';
  }
  
  private sendToMonitoring(error: any, path: string): void {
    // Send to error monitoring service
    // Example: Sentry, LogRocket, etc.
  }
  
  private getRequestId(options: IHttpClient.FetchOptions): string {
    return (options.headers as any)?.['X-Request-ID'] || 'unknown';
  }
}
```

---

## ⏱️ Timeout Management

### **Request Timeouts**

```typescript
// Default timeout (2 minutes)
const data = await client.fetchJSon('/api/data');

// Custom timeout (30 seconds)
const quickData = await client.fetchJSon('/api/quick-data', {
  delay: 30000
});

// Long-running request (10 minutes)
const heavyData = await client.fetchJSon('/api/heavy-processing', {
  delay: 600000
});

// Configure default timeout
class ConfigurableTimeoutClient extends HttpClient {
  constructor(private defaultTimeout: number = 120000) {
    super();
  }
  
  getFetchDelay(): number {
    return this.defaultTimeout;
  }
}

const quickClient = new ConfigurableTimeoutClient(30000); // 30 second default
```

### **Timeout with Retry Logic**

```typescript
class RetryHttpClient extends HttpClient {
  async fetchWithRetry<T>(
    path: string, 
    options: IHttpClient.FetchOptions = {},
    maxRetries: number = 3
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchJSon<T>(path, options);
      } catch (error: any) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Check if error is retryable
        if (this.isRetryableError(error)) {
          const delay = this.calculateBackoffDelay(attempt);
          await this.sleep(delay);
          continue;
        } else {
          throw error; // Non-retryable error
        }
      }
    }
    
    throw new Error('Max retries exceeded');
  }
  
  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx status codes
    return error.message?.includes('timeout') ||
           error.message?.includes('network') ||
           (error.status >= 500 && error.status < 600);
  }
  
  private calculateBackoffDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s...
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const retryClient = new RetryHttpClient();
const data = await retryClient.fetchWithRetry('/api/unreliable-endpoint', {}, 5);
```

---

## 📊 HTTP Status Codes

### **Status Code Constants**

```typescript
// Success status codes
HttpClient.STATUSES.SUCCESS                    // 200
HttpClient.STATUSES.CREATED                    // 201
HttpClient.STATUSES.ACCEPTED                   // 202
HttpClient.STATUSES.NO_CONTENT                 // 204

// Client error status codes
HttpClient.STATUSES.BAD_REQUEST                // 400
HttpClient.STATUSES.UNAUTHORIZED               // 401
HttpClient.STATUSES.FORBIDEN                   // 403
HttpClient.STATUSES.NOT_FOUND                  // 404
HttpClient.STATUSES.METHOD_NOT_ALLOWED         // 405

// Server error status codes
HttpClient.STATUSES.INTERNAL_SERVER_ERROR      // 500
HttpClient.STATUSES.SERVICE_UNAVAILABLE        // 503

// Check if status is successful
const isSuccess = client.isSuccessStatus(200); // true
const isError = client.isSuccessStatus(404);   // false

// All success statuses
HttpClient.SUCCESS_STATUSES; // [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
```

### **Status-Based Response Handling**

```typescript
class StatusAwareHttpClient extends HttpClient {
  async fetch(path: string, options: IHttpClient.FetchOptions = {}): Promise<Response> {
    const response = await super.fetch(path, options);
    
    // Handle specific status codes
    switch (response.status) {
      case HttpClient.STATUSES.UNAUTHORIZED:
        await this.handleUnauthorized();
        break;
        
      case HttpClient.STATUSES.FORBIDEN:
        this.handleForbidden();
        break;
        
      case HttpClient.STATUSES.NOT_FOUND:
        this.handleNotFound(path);
        break;
        
      case HttpClient.STATUSES.INTERNAL_SERVER_ERROR:
        this.handleServerError();
        break;
    }
    
    return response;
  }
  
  private async handleUnauthorized(): Promise<void> {
    // Clear authentication and redirect to login
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
  
  private handleForbidden(): void {
    // Show access denied message
    console.warn('Access denied to resource');
  }
  
  private handleNotFound(path: string): void {
    console.warn(`Resource not found: ${path}`);
  }
  
  private handleServerError(): void {
    // Show user-friendly error message
    console.error('Server error occurred');
  }
}
```

---

## 🎯 Advanced Patterns

### **Paginated Data Fetching**

```typescript
class PaginatedHttpClient extends HttpClient {
  async fetchPaginated<T>(
    path: string,
    options: {
      page?: number;
      limit?: number;
      sort?: string;
      filter?: any;
    } = {}
  ): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    return this.fetchJSon(path, {
      queryParams: {
        page: options.page || 1,
        limit: options.limit || 20,
        sort: options.sort,
        ...options.filter
      }
    });
  }
  
  async fetchAllPages<T>(
    path: string,
    options: { limit?: number; filter?: any } = {}
  ): Promise<T[]> {
    let allData: T[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await this.fetchPaginated<T>(path, {
        ...options,
        page
      });
      
      allData = allData.concat(response.data);
      hasMore = response.pagination.hasNext;
      page++;
    }
    
    return allData;
  }
}

// Usage
const paginatedClient = new PaginatedHttpClient();

// Fetch single page
const page1 = await paginatedClient.fetchPaginated('/api/users', {
  page: 1,
  limit: 50,
  sort: 'name',
  filter: { active: true }
});

// Fetch all pages
const allUsers = await paginatedClient.fetchAllPages('/api/users', {
  limit: 100,
  filter: { department: 'engineering' }
});
```

### **Upload/Download with Progress**

```typescript
class FileHttpClient extends HttpClient {
  async uploadFile(
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });
      
      const url = this.buildUrl(path);
      xhr.open('POST', url);
      
      // Add authentication header
      const token = this.getBeearToken();
      if (typeof token === 'string' && token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }
  
  async downloadFile(
    path: string,
    filename?: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const response = await this.fetch(path);
    
    if (!response.body) {
      throw new Error('No response body');
    }
    
    const contentLength = response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total > 0) {
        onProgress((loaded / total) * 100);
      }
    }
    
    const blob = new Blob(chunks);
    
    // Auto-download if filename provided
    if (filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    return blob;
  }
}

// Usage
const fileClient = new FileHttpClient();

// Upload with progress
await fileClient.uploadFile('/api/upload', file, (progress) => {
  console.log(`Upload progress: ${progress.toFixed(2)}%`);
});

// Download with progress
const blob = await fileClient.downloadFile('/api/download/report.pdf', 'report.pdf', (progress) => {
  console.log(`Download progress: ${progress.toFixed(2)}%`);
});
```

---

## 🎯 Best Practices

### **1. Error Handling**
```typescript
// ✅ Good: Handle errors appropriately
try {
  const data = await client.fetchJSon('/api/data');
  // Process data
} catch (error: any) {
  if (error.status === 401) {
    // Handle authentication error
    redirectToLogin();
  } else if (error.status >= 500) {
    // Handle server error
    showErrorMessage('Server error, please try again');
  } else {
    // Handle other errors
    showErrorMessage(error.message);
  }
}

// ✅ Good: Use typed responses
interface User {
  id: number;
  name: string;
  email: string;
}

const users = await client.fetchJSon<User[]>('/api/users');
```

### **2. Performance Optimization**
```typescript
// ✅ Good: Use appropriate timeouts
const quickData = await client.fetch('/api/quick', { delay: 5000 });
const heavyData = await client.fetch('/api/heavy', { delay: 300000 });

// ✅ Good: Implement request cancellation
const controller = new AbortController();
const data = await client.fetch('/api/data', {
  signal: controller.signal
});

// Cancel if needed
// controller.abort();
```

### **3. Security Best Practices**
```typescript
// ✅ Good: Secure token management
class SecureHttpClient extends HttpClient {
  async getBeearToken(): Promise<string> {
    // Retrieve from secure storage
    const token = await this.secureStorage.get('auth_token');
    
    // Validate token expiry
    if (this.isTokenExpired(token)) {
      return await this.refreshToken();
    }
    
    return token;
  }
  
  // ✅ Good: Sanitize sensitive data in logs
  private sanitizeLogData(data: any): any {
    const sanitized = { ...data };
    delete sanitized.password;
    delete sanitized.token;
    delete sanitized.secret;
    return sanitized;
  }
}
```

---

The HttpClient provides a robust, feature-rich foundation for all HTTP communication needs with built-in security, error handling, and performance optimizations.
