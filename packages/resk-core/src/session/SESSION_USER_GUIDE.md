# @resk/core Session Module - Complete User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Basic Usage](#basic-usage)
4. [Advanced Features](#advanced-features)
5. [Storage Management](#storage-management)
6. [Key Namespacing](#key-namespacing)
7. [Custom Storage Implementations](#custom-storage-implementations)
8. [Environment-Specific Behavior](#environment-specific-behavior)
9. [Error Handling](#error-handling)
10. [Performance Optimization](#performance-optimization)
11. [Security Considerations](#security-considerations)
12. [Troubleshooting](#troubleshooting)
13. [API Reference](#api-reference)
14. [Examples & Recipes](#examples--recipes)

---

## Introduction

The @resk/core Session module provides a powerful, flexible, and environment-aware session storage solution for TypeScript/JavaScript applications. It abstracts away the complexities of different storage mechanisms while providing a consistent API that works across browsers, Node.js, React Native, and custom environments.

### Key Features

- **Universal Compatibility**: Works in browsers, Node.js, React Native, and custom environments
- **Automatic Storage Detection**: Intelligently chooses the best storage mechanism available
- **Custom Storage Support**: Extensible architecture for custom storage implementations
- **Namespace Support**: Isolate storage contexts to prevent key collisions
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Asynchronous Support**: Handles both synchronous and asynchronous storage operations
- **Error Resilience**: Graceful fallbacks and error handling

### Target Audience

This guide is designed for developers of all levels:
- **Beginners**: Start with [Basic Usage](#basic-usage)
- **Intermediate**: Focus on [Advanced Features](#advanced-features) and [Storage Management](#storage-management)
- **Advanced**: Explore [Custom Storage Implementations](#custom-storage-implementations) and [Performance Optimization](#performance-optimization)

---

## Installation & Setup

### Installation

```bash
npm install @resk/core
```

### Basic Import

```typescript
import { Session } from '@resk/core/session';
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Required Dependencies

The Session module requires `reflect-metadata` for decorator support:

```bash
npm install reflect-metadata
```

Import at the top of your main application file:

```typescript
import 'reflect-metadata';
```

---

## Basic Usage

### Storing Values

```typescript
import { Session } from '@resk/core/session';

// Store a simple value
Session.set('userToken', 'abc123');

// Store complex objects
const userProfile = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    language: 'en'
  }
};

Session.set('userProfile', userProfile);

// Store arrays
const recentItems = ['item1', 'item2', 'item3'];
Session.set('recentItems', recentItems);
```

### Retrieving Values

```typescript
// Get a simple value
const token = Session.get('userToken');
console.log(token); // 'abc123'

// Get complex objects
const profile = Session.get('userProfile');
console.log(profile.name); // 'John Doe'
console.log(profile.preferences.theme); // 'dark'

// Get arrays
const items = Session.get('recentItems');
console.log(items.length); // 3

// Handle missing values
const missingValue = Session.get('nonexistent');
console.log(missingValue); // undefined
```

### Removing Values

```typescript
// Remove a specific key
const removedValue = Session.remove('userToken');
console.log(removedValue); // 'abc123' (the removed value)

// Remove all stored values
Session.removeAll();
```

### Key Validation

```typescript
// Invalid keys return undefined
Session.set('', 'value'); // Ignored
Session.set('   ', 'value'); // Ignored
Session.set(null, 'value'); // Ignored

const result = Session.get(''); // undefined
```

---

## Advanced Features

### Working with Complex Data

```typescript
// Circular reference handling
const user = { name: 'John' };
user.self = user; // Circular reference

Session.set('userWithCircular', user); // Automatically handled
const retrieved = Session.get('userWithCircular');
console.log(retrieved.name); // 'John'
```

### Data Serialization Control

```typescript
// Control JSON serialization behavior
const complexData = {
  date: new Date(),
  regex: /pattern/g,
  func: () => 'hello'
};

// With decycling (default: true)
Session.set('data1', complexData, true);

// Without decycling
Session.set('data2', complexData, false);
```

### Asynchronous Operations

```typescript
// The Session module handles both sync and async storage automatically
const asyncValue = Session.get('asyncKey'); // May return Promise or direct value

// Handle potential Promises
if (asyncValue instanceof Promise) {
  asyncValue.then(value => {
    console.log('Async value:', value);
  });
} else {
  console.log('Sync value:', asyncValue);
}

// Using async/await (recommended)
async function handleSessionData() {
  try {
    const value = await Session.get('someKey');
    console.log('Value:', value);
  } catch (error) {
    console.error('Failed to retrieve value:', error);
  }
}
```

---

## Storage Management

### Understanding Storage Priority

The Session module uses a priority-based approach to determine storage:

1. **Custom Attached Storage** (highest priority)
2. **Browser localStorage** (client-side only)
3. **In-Memory Storage** (fallback)

### Accessing the Storage Manager

```typescript
import { Session } from '@resk/core/session';

// Access the underlying storage manager
const storage = Session.Manager.storage;

// Direct storage operations
storage.set('directKey', 'directValue');
const value = storage.get('directKey');
storage.remove('directKey');
storage.removeAll();
```

### Storage Validation

```typescript
// Check if a storage implementation is valid
const customStorage = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: (key) => localStorage.removeItem(key),
  removeAll: () => localStorage.clear()
};

const isValid = Session.isValidStorage(customStorage);
console.log(isValid); // true

// Invalid storage (missing methods)
const invalidStorage = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value)
  // Missing remove and removeAll
};

const isInvalid = Session.isValidStorage(invalidStorage);
console.log(isInvalid); // false
```

---

## Key Namespacing

### Setting Up Namespaces

```typescript
import { Session } from '@resk/core/session';

// Set a global namespace
Session.Manager.keyNamespace = 'myapp';

// Now all operations use the namespace
Session.set('user', userData); // Stored as 'myapp-user'
const user = Session.get('user'); // Retrieves 'myapp-user'
```

### Environment-Based Namespacing

```typescript
// Production setup
const environment = process.env.NODE_ENV || 'development';
const version = process.env.APP_VERSION || '1.0.0';

Session.Manager.keyNamespace = `${environment}-v${version}`;

// Examples:
// Development: 'development-v1.0.0'
// Production: 'production-v2.1.0'
// Testing: 'testing-v1.2.0-beta'

Session.set('config', appConfig); // Stored as 'production-v2.1.0-config'
```

### Multi-Tenant Applications

```typescript
class TenantSessionManager {
  static setTenant(tenantId: string, userId: string) {
    Session.Manager.keyNamespace = `tenant-${tenantId}-user-${userId}`;
  }
  
  static clearTenant() {
    Session.removeAll(); // Clear current tenant data
    Session.Manager.keyNamespace = 'global';
  }
  
  static getCurrentTenant(): string {
    const namespace = Session.Manager.keyNamespace;
    const match = namespace.match(/^tenant-(.+?)-user-/);
    return match ? match[1] : '';
  }
}

// Usage
TenantSessionManager.setTenant('acme-corp', 'john123');
Session.set('preferences', userPrefs); // Stored as 'tenant-acme-corp-user-john123-preferences'

TenantSessionManager.clearTenant(); // Clean up and reset
```

### Namespace Isolation

```typescript
// Store data for different contexts
Session.Manager.keyNamespace = 'context-a';
Session.set('sharedKey', 'Value for Context A');

Session.Manager.keyNamespace = 'context-b';
Session.set('sharedKey', 'Value for Context B');

// Retrieve context-specific data
Session.Manager.keyNamespace = 'context-a';
console.log(Session.get('sharedKey')); // 'Value for Context A'

Session.Manager.keyNamespace = 'context-b';
console.log(Session.get('sharedKey')); // 'Value for Context B'
```

---

## Custom Storage Implementations

### Using the AttachSessionStorage Decorator

```typescript
import { AttachSessionStorage, ISessionStorage } from '@resk/core/session';

@AttachSessionStorage()
class CustomLocalStorage implements ISessionStorage {
  get(key: string): any {
    return localStorage.getItem(key);
  }
  
  set(key: string, value: any): any {
    localStorage.setItem(key, String(value));
    return value;
  }
  
  remove(key: string): any {
    const value = this.get(key);
    localStorage.removeItem(key);
    return value;
  }
  
  removeAll(): any {
    localStorage.clear();
  }
}

// Now Session will use your custom storage
Session.set('test', 'value'); // Uses CustomLocalStorage
```

### Encrypted Storage Implementation

```typescript
import CryptoJS from 'crypto-js';

@AttachSessionStorage()
class EncryptedStorage implements ISessionStorage {
  private secretKey = 'your-secret-key';
  
  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }
  
  private decrypt(encryptedValue: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  
  get(key: string): any {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    try {
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
  
  set(key: string, value: any): any {
    const stringValue = String(value);
    const encrypted = this.encrypt(stringValue);
    localStorage.setItem(key, encrypted);
    return value;
  }
  
  remove(key: string): any {
    const value = this.get(key);
    localStorage.removeItem(key);
    return value;
  }
  
  removeAll(): any {
    localStorage.clear();
  }
}
```

### Database-Backed Storage

```typescript
@AttachSessionStorage()
class DatabaseStorage implements ISessionStorage {
  constructor(private db: Database) {}
  
  async get(key: string): Promise<any> {
    const result = await this.db.query(
      'SELECT value FROM sessions WHERE key = ?', 
      [key]
    );
    return result.length ? JSON.parse(result[0].value) : null;
  }
  
  async set(key: string, value: any): Promise<any> {
    const serialized = JSON.stringify(value);
    await this.db.query(
      'INSERT OR REPLACE INTO sessions (key, value, updated_at) VALUES (?, ?, ?)',
      [key, serialized, new Date()]
    );
    return value;
  }
  
  async remove(key: string): Promise<any> {
    const value = await this.get(key);
    await this.db.query('DELETE FROM sessions WHERE key = ?', [key]);
    return value;
  }
  
  async removeAll(): Promise<any> {
    await this.db.query('DELETE FROM sessions');
  }
}
```

### Cache-Enhanced Storage

```typescript
@AttachSessionStorage()
class CachedStorage implements ISessionStorage {
  private cache = new Map<string, { value: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.cacheTimeout;
  }
  
  get(key: string): any {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.value;
    }
    
    // Fallback to localStorage
    const value = localStorage.getItem(key);
    if (value) {
      this.cache.set(key, { value, timestamp: Date.now() });
    }
    
    return value;
  }
  
  set(key: string, value: any): any {
    // Update cache
    this.cache.set(key, { value, timestamp: Date.now() });
    
    // Update localStorage
    localStorage.setItem(key, String(value));
    return value;
  }
  
  remove(key: string): any {
    const value = this.get(key);
    this.cache.delete(key);
    localStorage.removeItem(key);
    return value;
  }
  
  removeAll(): any {
    this.cache.clear();
    localStorage.clear();
  }
}
```

---

## Environment-Specific Behavior

### Browser Environment

```typescript
// In browsers, localStorage is used automatically
if (typeof window !== 'undefined') {
  console.log('Running in browser');
  Session.set('browserData', { timestamp: Date.now() });
  
  // Data persists across page reloads
  window.location.reload();
  const data = Session.get('browserData'); // Still available
}
```

### Node.js Environment

```typescript
// In Node.js, in-memory storage is used
if (typeof process !== 'undefined' && process.versions?.node) {
  console.log('Running in Node.js');
  Session.set('serverData', { serverId: 'server-123' });
  
  // Data only persists during application lifetime
  const data = Session.get('serverData');
}
```

### React Native Setup

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

@AttachSessionStorage()
class ReactNativeStorage implements ISessionStorage {
  async get(key: string): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('AsyncStorage get error:', error);
      return null;
    }
  }
  
  async set(key: string, value: any): Promise<any> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return value;
    } catch (error) {
      console.error('AsyncStorage set error:', error);
      return value;
    }
  }
  
  async remove(key: string): Promise<any> {
    try {
      const value = await this.get(key);
      await AsyncStorage.removeItem(key);
      return value;
    } catch (error) {
      console.error('AsyncStorage remove error:', error);
      return null;
    }
  }
  
  async removeAll(): Promise<any> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
    }
  }
}
```

---

## Error Handling

### Storage Operation Errors

```typescript
// Basic error handling
try {
  Session.set('largeData', new Array(10000000).fill('data'));
} catch (error) {
  console.error('Storage quota exceeded:', error);
  
  // Fallback strategy
  Session.set('essentialData', { id: 1 });
}

// Graceful error handling for retrieval
function safeGet(key: string, defaultValue: any = null) {
  try {
    const value = Session.get(key);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    console.error(`Failed to get key "${key}":`, error);
    return defaultValue;
  }
}

const userData = safeGet('user', { id: null, name: 'Guest' });
```

### Storage Validation Errors

```typescript
// Validate storage before operations
function validateAndExecute(operation: () => any) {
  const storage = Session.Manager.storage;
  
  if (!Session.isValidStorage(storage)) {
    throw new Error('Invalid storage configuration');
  }
  
  return operation();
}

// Usage
try {
  validateAndExecute(() => {
    Session.set('validatedData', { important: true });
  });
} catch (error) {
  console.error('Storage validation failed:', error);
}
```

### Custom Error Handling

```typescript
class SessionErrorHandler {
  static handleStorageError(error: Error, operation: string, key: string) {
    console.error(`Session ${operation} failed for key "${key}":`, error);
    
    // Log to external service
    this.logToService({
      type: 'session_error',
      operation,
      key,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    // Notify user if necessary
    if (operation === 'set' && error.message.includes('quota')) {
      this.notifyUser('Storage space is full. Please clear some data.');
    }
  }
  
  static logToService(data: any) {
    // Send to your logging service
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {
      // Silent fail for logging
    });
  }
  
  static notifyUser(message: string) {
    // Show user notification
    console.warn('User notification:', message);
  }
}

// Enhanced session operations with error handling
class SafeSession {
  static set(key: string, value: any): boolean {
    try {
      Session.set(key, value);
      return true;
    } catch (error) {
      SessionErrorHandler.handleStorageError(error, 'set', key);
      return false;
    }
  }
  
  static get(key: string, defaultValue?: any): any {
    try {
      const value = Session.get(key);
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      SessionErrorHandler.handleStorageError(error, 'get', key);
      return defaultValue;
    }
  }
}
```

---

## Performance Optimization

### Batch Operations

```typescript
class BatchSession {
  private pendingOperations: Array<() => void> = [];
  private flushTimeout: NodeJS.Timeout | null = null;
  
  batchSet(key: string, value: any) {
    this.pendingOperations.push(() => Session.set(key, value));
    this.scheduleFlush();
  }
  
  private scheduleFlush() {
    if (this.flushTimeout) return;
    
    this.flushTimeout = setTimeout(() => {
      this.flush();
    }, 100); // Batch for 100ms
  }
  
  private flush() {
    this.pendingOperations.forEach(operation => operation());
    this.pendingOperations = [];
    this.flushTimeout = null;
  }
  
  forceFlush() {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
    this.flush();
  }
}

// Usage
const batchSession = new BatchSession();
batchSession.batchSet('key1', 'value1');
batchSession.batchSet('key2', 'value2');
batchSession.batchSet('key3', 'value3');
// All operations will be executed together after 100ms
```

### Caching Strategies

```typescript
class CachedSession {
  private static cache = new Map<string, { value: any; timestamp: number }>();
  private static cacheTimeout = 60000; // 1 minute
  
  static get(key: string): any {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.value;
    }
    
    const value = Session.get(key);
    this.cache.set(key, { value, timestamp: now });
    return value;
  }
  
  static set(key: string, value: any): void {
    Session.set(key, value);
    this.cache.set(key, { value, timestamp: Date.now() });
  }
  
  static clearCache(): void {
    this.cache.clear();
  }
}
```

### Memory Management

```typescript
class ManagedSession {
  private static memoryUsage = new Map<string, number>();
  private static maxMemoryMB = 10;
  
  static set(key: string, value: any): boolean {
    const serialized = JSON.stringify(value);
    const sizeKB = new Blob([serialized]).size / 1024;
    
    // Check memory limits
    if (this.getTotalMemoryUsage() + sizeKB > this.maxMemoryMB * 1024) {
      this.cleanupOldEntries();
      
      if (this.getTotalMemoryUsage() + sizeKB > this.maxMemoryMB * 1024) {
        console.warn('Memory limit exceeded, operation cancelled');
        return false;
      }
    }
    
    Session.set(key, value);
    this.memoryUsage.set(key, sizeKB);
    return true;
  }
  
  private static getTotalMemoryUsage(): number {
    return Array.from(this.memoryUsage.values()).reduce((sum, size) => sum + size, 0);
  }
  
  private static cleanupOldEntries(): void {
    // Simple LRU cleanup - remove 25% of entries
    const entries = Array.from(this.memoryUsage.entries());
    const toRemove = Math.floor(entries.length * 0.25);
    
    for (let i = 0; i < toRemove; i++) {
      const [key] = entries[i];
      Session.remove(key);
      this.memoryUsage.delete(key);
    }
  }
}
```

---

## Security Considerations

### Data Encryption

```typescript
import CryptoJS from 'crypto-js';

class SecureSession {
  private static encryptionKey = process.env.SESSION_ENCRYPTION_KEY || 'default-key';
  
  static encrypt(data: any): string {
    const serialized = JSON.stringify(data);
    return CryptoJS.AES.encrypt(serialized, this.encryptionKey).toString();
  }
  
  static decrypt(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }
  
  static setSecure(key: string, value: any): void {
    const encrypted = this.encrypt(value);
    Session.set(key, encrypted);
  }
  
  static getSecure(key: string): any {
    const encrypted = Session.get(key);
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  }
}

// Usage
SecureSession.setSecure('sensitiveData', {
  creditCard: '1234-5678-9012-3456',
  ssn: '123-45-6789'
});

const sensitive = SecureSession.getSecure('sensitiveData');
```

### Input Sanitization

```typescript
class SanitizedSession {
  private static sanitizeKey(key: string): string {
    // Remove potentially dangerous characters
    return key.replace(/[<>'"&]/g, '');
  }
  
  private static sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      // Basic XSS prevention
      return value.replace(/[<>'"&]/g, (char) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[char];
      });
    }
    
    if (typeof value === 'object' && value !== null) {
      const sanitized = {};
      for (const [k, v] of Object.entries(value)) {
        sanitized[this.sanitizeKey(k)] = this.sanitizeValue(v);
      }
      return sanitized;
    }
    
    return value;
  }
  
  static set(key: string, value: any): void {
    const sanitizedKey = this.sanitizeKey(key);
    const sanitizedValue = this.sanitizeValue(value);
    Session.set(sanitizedKey, sanitizedValue);
  }
  
  static get(key: string): any {
    const sanitizedKey = this.sanitizeKey(key);
    return Session.get(sanitizedKey);
  }
}
```

### Access Control

```typescript
class ControlledSession {
  private static permissions = new Map<string, string[]>();
  private static currentUser: string | null = null;
  
  static setUser(userId: string, permissions: string[]): void {
    this.currentUser = userId;
    this.permissions.set(userId, permissions);
  }
  
  static canAccess(key: string, operation: 'read' | 'write'): boolean {
    if (!this.currentUser) return false;
    
    const userPermissions = this.permissions.get(this.currentUser) || [];
    const requiredPermission = `${key}:${operation}`;
    
    return userPermissions.includes(requiredPermission) || 
           userPermissions.includes(`${key}:*`) ||
           userPermissions.includes('*:*');
  }
  
  static set(key: string, value: any): void {
    if (!this.canAccess(key, 'write')) {
      throw new Error(`Access denied: Cannot write to "${key}"`);
    }
    Session.set(key, value);
  }
  
  static get(key: string): any {
    if (!this.canAccess(key, 'read')) {
      throw new Error(`Access denied: Cannot read from "${key}"`);
    }
    return Session.get(key);
  }
}

// Usage
ControlledSession.setUser('user123', [
  'profile:*',
  'settings:read',
  'cache:write'
]);

ControlledSession.set('profile', userData); // ✓ Allowed
ControlledSession.get('settings'); // ✓ Allowed
ControlledSession.set('admin', adminData); // ✗ Throws error
```

---

## Troubleshooting

### Common Issues

#### 1. Values Not Persisting

```typescript
// Check if you're in the right environment
console.log('Environment check:');
console.log('- Browser:', typeof window !== 'undefined');
console.log('- Node.js:', typeof process !== 'undefined');
console.log('- localStorage available:', 
  typeof window !== 'undefined' && window.localStorage
);

// Check storage type
const storage = Session.Manager.storage;
console.log('Storage methods:', Object.keys(storage));
```

#### 2. Namespace Issues

```typescript
// Debug namespace problems
function debugNamespace() {
  console.log('Current namespace:', Session.Manager.keyNamespace);
  
  // Test key transformation
  const testKey = 'test-key';
  const sanitized = Session.sanitizeKey(testKey);
  console.log(`Key transformation: "${testKey}" → "${sanitized}"`);
}

debugNamespace();
```

#### 3. Custom Storage Not Working

```typescript
// Validate custom storage implementation
function validateCustomStorage(storage: any) {
  const requiredMethods = ['get', 'set', 'remove', 'removeAll'];
  const missing = requiredMethods.filter(method => 
    typeof storage[method] !== 'function'
  );
  
  if (missing.length > 0) {
    console.error('Storage validation failed. Missing methods:', missing);
    return false;
  }
  
  console.log('✓ Storage validation passed');
  return true;
}

// Test your custom storage
const myStorage = new MyCustomStorage();
validateCustomStorage(myStorage);
```

### Debugging Tools

```typescript
class SessionDebugger {
  static enableDebugMode(): void {
    const originalSet = Session.set;
    const originalGet = Session.get;
    const originalRemove = Session.remove;
    
    Session.set = function(key: string, value: any, decycle?: boolean) {
      console.log(`[Session] SET: "${key}" =`, value);
      return originalSet.call(this, key, value, decycle);
    };
    
    Session.get = function(key: string) {
      const value = originalGet.call(this, key);
      console.log(`[Session] GET: "${key}" →`, value);
      return value;
    };
    
    Session.remove = function(key: string) {
      const value = originalRemove.call(this, key);
      console.log(`[Session] REMOVE: "${key}" →`, value);
      return value;
    };
    
    console.log('✓ Session debug mode enabled');
  }
  
  static inspectStorage(): void {
    console.log('=== Session Storage Inspection ===');
    console.log('Namespace:', Session.Manager.keyNamespace);
    console.log('Storage type:', Session.Manager.storage.constructor.name);
    console.log('Storage valid:', Session.isValidStorage(Session.Manager.storage));
    
    // Try to list all keys (if possible)
    if (typeof window !== 'undefined' && window.localStorage) {
      console.log('localStorage keys:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`  ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
      }
    }
  }
}

// Enable debugging
SessionDebugger.enableDebugMode();
SessionDebugger.inspectStorage();
```

---

## API Reference

### Session Object

#### Methods

##### `Session.set(key: string, value: any, decycle?: boolean): void`

Stores a value in the session storage.

- **key**: The storage key (will be sanitized)
- **value**: The value to store (will be JSON serialized)
- **decycle**: Whether to handle circular references (default: true)

##### `Session.get(key: string): any`

Retrieves a value from session storage.

- **key**: The storage key to retrieve
- **Returns**: The stored value or undefined if not found

##### `Session.remove(key: string): any`

Removes a value from session storage.

- **key**: The storage key to remove
- **Returns**: The removed value or undefined if not found

##### `Session.removeAll(): any`

Clears all values from session storage.

- **Returns**: Result from the underlying storage implementation

##### `Session.sanitizeKey(key: string): string`

Sanitizes a key for storage use.

- **key**: The raw key string
- **Returns**: Sanitized key with namespace applied

##### `Session.isValidStorage(storage: ISessionStorage): boolean`

Validates a storage implementation.

- **storage**: Storage object to validate
- **Returns**: true if valid, false otherwise

### Manager Class

#### Properties

##### `Manager.storage: ISessionStorage`

Gets or sets the active storage implementation.

##### `Manager.keyNamespace: string`

Gets or sets the global key namespace.

#### Methods

##### `Manager.sanitizeKey(key?: string): string`

Static method to sanitize storage keys.

### Decorator

##### `@AttachSessionStorage()`

Class decorator for registering custom storage implementations.

### Interface

##### `ISessionStorage`

```typescript
interface ISessionStorage {
  get(key: string): any;
  set(key: string, value: any, decycle?: boolean): any;
  remove(key: string): any;
  removeAll(): any;
}
```

---

## Examples & Recipes

### Recipe 1: User Preference Management

```typescript
class UserPreferences {
  private static readonly PREFIX = 'userPrefs';
  
  static setTheme(theme: 'light' | 'dark'): void {
    Session.set(`${this.PREFIX}-theme`, theme);
  }
  
  static getTheme(): 'light' | 'dark' {
    return Session.get(`${this.PREFIX}-theme`) || 'light';
  }
  
  static setLanguage(language: string): void {
    Session.set(`${this.PREFIX}-language`, language);
  }
  
  static getLanguage(): string {
    return Session.get(`${this.PREFIX}-language`) || 'en';
  }
  
  static setNotifications(enabled: boolean): void {
    Session.set(`${this.PREFIX}-notifications`, enabled);
  }
  
  static getNotifications(): boolean {
    return Session.get(`${this.PREFIX}-notifications`) ?? true;
  }
  
  static getAllPreferences(): {
    theme: string;
    language: string;
    notifications: boolean;
  } {
    return {
      theme: this.getTheme(),
      language: this.getLanguage(),
      notifications: this.getNotifications()
    };
  }
  
  static resetToDefaults(): void {
    Session.remove(`${this.PREFIX}-theme`);
    Session.remove(`${this.PREFIX}-language`);
    Session.remove(`${this.PREFIX}-notifications`);
  }
}

// Usage
UserPreferences.setTheme('dark');
UserPreferences.setLanguage('fr');
UserPreferences.setNotifications(false);

const prefs = UserPreferences.getAllPreferences();
console.log(prefs); // { theme: 'dark', language: 'fr', notifications: false }
```

### Recipe 2: Shopping Cart Session

```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class ShoppingCart {
  private static readonly CART_KEY = 'shopping-cart';
  
  static addItem(item: CartItem): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(existing => existing.id === item.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    
    Session.set(this.CART_KEY, cart);
  }
  
  static removeItem(itemId: string): void {
    const cart = this.getCart().filter(item => item.id !== itemId);
    Session.set(this.CART_KEY, cart);
  }
  
  static updateQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        Session.set(this.CART_KEY, cart);
      }
    }
  }
  
  static getCart(): CartItem[] {
    return Session.get(this.CART_KEY) || [];
  }
  
  static getTotal(): number {
    return this.getCart().reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
  }
  
  static getItemCount(): number {
    return this.getCart().reduce((count, item) => 
      count + item.quantity, 0
    );
  }
  
  static clearCart(): void {
    Session.remove(this.CART_KEY);
  }
}

// Usage
ShoppingCart.addItem({
  id: 'prod-1',
  name: 'Laptop',
  price: 999.99,
  quantity: 1
});

ShoppingCart.addItem({
  id: 'prod-2',
  name: 'Mouse',
  price: 29.99,
  quantity: 2
});

console.log('Cart total:', ShoppingCart.getTotal()); // 1059.97
console.log('Item count:', ShoppingCart.getItemCount()); // 3
```

### Recipe 3: Form Auto-Save

```typescript
class FormAutoSave {
  private saveTimeouts = new Map<string, NodeJS.Timeout>();
  private readonly saveDelay = 1000; // 1 second
  
  saveField(formId: string, fieldName: string, value: any): void {
    const key = `form-${formId}-${fieldName}`;
    
    // Clear existing timeout
    const existingTimeout = this.saveTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      Session.set(key, value);
      this.saveTimeouts.delete(key);
    }, this.saveDelay);
    
    this.saveTimeouts.set(key, timeout);
  }
  
  getFormData(formId: string): Record<string, any> {
    const formData: Record<string, any> = {};
    const prefix = `form-${formId}-`;
    
    // This is a simplified example - in practice, you'd need to
    // enumerate all keys with the prefix
    return formData;
  }
  
  clearFormData(formId: string): void {
    // Remove all form data - simplified example
    Session.Manager.keyNamespace = `form-${formId}`;
    Session.removeAll();
    Session.Manager.keyNamespace = ''; // Reset namespace
  }
  
  restoreForm(formId: string, formElement: HTMLFormElement): void {
    const formData = this.getFormData(formId);
    
    Object.entries(formData).forEach(([fieldName, value]) => {
      const field = formElement.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (field) {
        field.value = String(value);
      }
    });
  }
}

// Usage with React/Vue/Angular
const autoSave = new FormAutoSave();

// On input change
const handleInputChange = (formId: string, fieldName: string, value: any) => {
  autoSave.saveField(formId, fieldName, value);
};

// On form submission
const handleSubmit = (formId: string) => {
  autoSave.clearFormData(formId);
  // Submit form...
};
```

### Recipe 4: Multi-Tab Synchronization

```typescript
class TabSyncSession {
  private static listeners = new Map<string, Function[]>();
  
  static {
    // Listen for storage events (cross-tab communication)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.newValue !== event.oldValue) {
          this.notifyListeners(event.key, JSON.parse(event.newValue || 'null'));
        }
      });
    }
  }
  
  static set(key: string, value: any): void {
    Session.set(key, value);
    this.notifyListeners(key, value);
  }
  
  static get(key: string): any {
    return Session.get(key);
  }
  
  static subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    this.listeners.get(key)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key) || [];
      const index = callbacks.indexOf(callback);
      if (index >= 0) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  private static notifyListeners(key: string, value: any): void {
    const callbacks = this.listeners.get(key) || [];
    callbacks.forEach(callback => {
      try {
        callback(value);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }
}

// Usage
const unsubscribe = TabSyncSession.subscribe('user', (user) => {
  console.log('User updated in another tab:', user);
  updateUI(user);
});

TabSyncSession.set('user', { id: 1, name: 'John' });

// Later...
unsubscribe();
```

---

## Conclusion

The @resk/core Session module provides a comprehensive, flexible, and robust solution for session storage across different environments. Its intelligent storage detection, namespace support, and extensible architecture make it suitable for everything from simple web applications to complex multi-tenant systems.

### Key Takeaways

1. **Start Simple**: Begin with basic `Session.set()` and `Session.get()` operations
2. **Use Namespaces**: Implement namespacing early to avoid key conflicts
3. **Custom Storage**: Leverage the decorator pattern for custom storage needs
4. **Error Handling**: Implement proper error handling for production applications
5. **Performance**: Consider caching and batching for high-frequency operations
6. **Security**: Encrypt sensitive data and sanitize inputs

### Next Steps

- Explore the [API Reference](#api-reference) for detailed method documentation
- Check out the [Examples & Recipes](#examples--recipes) for real-world implementations
- Consider contributing custom storage implementations to the community

For additional support and updates, visit the [official documentation](https://github.com/boris-fouomene/reskit) and [community forum](https://github.com/boris-fouomene/reskit/discussions).
