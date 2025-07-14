# 🔐 Authentication System - @resk/core/auth

> **Comprehensive user authentication and authorization**

## 📖 Overview

The Authentication module provides a complete user management system with support for sessions, permissions, roles, and secure data storage. It integrates seamlessly with the observable pattern for real-time authentication state management.

---

## 🚀 Quick Start

### **Basic Authentication Setup**

```typescript
import { Auth } from '@resk/core/auth';

// Configure authentication
Auth.configure({
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  rememberMeTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
  encryptionKey: 'your-secret-key',
  autoRefresh: true
});

// Define user interface
interface IUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

// Login user
const user: IUser = {
  id: '123',
  username: 'john_doe',
  email: 'john@example.com',
  roles: ['user', 'moderator'],
  permissions: ['read', 'write', 'moderate']
};

Auth.login(user);
console.log('User logged in:', Auth.getCurrentUser());

// Check authentication status
if (Auth.isAuthenticated()) {
  console.log('User is authenticated');
} else {
  console.log('User is not authenticated');
}
```

---

## 🎭 User Interface and Types

### **Core Authentication Types**

```typescript
// User interface
export interface IAuthUser {
  id: string | number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roles?: IAuthRole[];
  permissions?: IAuthPerm[];
  metadata?: { [key: string]: any };
  isActive?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
}

// Role interface
export interface IAuthRole {
  id: string | number;
  name: string;
  description?: string;
  permissions?: IAuthPerm[];
  level?: number;
}

// Permission interface
export interface IAuthPerm {
  id: string | number;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

// Session storage interface
export interface IAuthSessionStorage {
  get<T = any>(key: string): T | null;
  set<T = any>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}
```

### **Authentication Events**

```typescript
// Event types
export type IAuthEvent = 
  | 'login'
  | 'logout'
  | 'sessionExpired'
  | 'permissionChanged'
  | 'roleChanged'
  | 'userUpdated'
  | 'authError';

// Event data interfaces
interface IAuthLoginEvent {
  user: IAuthUser;
  timestamp: Date;
  rememberMe?: boolean;
}

interface IAuthLogoutEvent {
  user: IAuthUser | null;
  reason: 'manual' | 'timeout' | 'forced';
  timestamp: Date;
}

interface IAuthErrorEvent {
  error: Error;
  context: string;
  timestamp: Date;
}
```

---

## 🔧 Core Authentication Features

### **User Login and Session Management**

```typescript
class AuthenticationService {
  async loginWithCredentials(username: string, password: string, rememberMe = false) {
    try {
      // Call your authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const userData = await response.json();
      
      // Login user with Auth system
      Auth.login(userData.user, rememberMe);
      
      // Store authentication token
      if (userData.token) {
        Auth.setToken(userData.token);
      }
      
      return userData.user;
      
    } catch (error) {
      Auth.notify('authError', { 
        error, 
        context: 'login',
        timestamp: new Date()
      });
      throw error;
    }
  }
  
  async logout(reason: 'manual' | 'timeout' | 'forced' = 'manual') {
    const currentUser = Auth.getCurrentUser();
    
    try {
      // Call logout API if needed
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${Auth.getToken()}`
        }
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
    
    // Clear local session
    Auth.logout();
    
    // Notify observers
    Auth.notify('logout', {
      user: currentUser,
      reason,
      timestamp: new Date()
    });
  }
  
  async refreshSession() {
    const token = Auth.getToken();
    if (!token) {
      throw new Error('No token available for refresh');
    }
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Session refresh failed');
      }
      
      const data = await response.json();
      
      // Update user data
      if (data.user) {
        Auth.updateUser(data.user);
      }
      
      // Update token
      if (data.token) {
        Auth.setToken(data.token);
      }
      
      return data;
      
    } catch (error) {
      // Session expired, logout user
      this.logout('timeout');
      throw error;
    }
  }
}
```

### **Permission-Based Access Control**

```typescript
class PermissionManager {
  static hasPermission(permission: string, resource?: string): boolean {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    
    // Check user permissions directly
    const userPermissions = user.permissions || [];
    const hasDirectPermission = userPermissions.some(perm => {
      if (typeof perm === 'string') {
        return perm === permission;
      }
      return perm.name === permission && (!resource || perm.resource === resource);
    });
    
    if (hasDirectPermission) return true;
    
    // Check role-based permissions
    const userRoles = user.roles || [];
    return userRoles.some(role => {
      const rolePermissions = (typeof role === 'object' ? role.permissions : []) || [];
      return rolePermissions.some(perm => {
        if (typeof perm === 'string') {
          return perm === permission;
        }
        return perm.name === permission && (!resource || perm.resource === resource);
      });
    });
  }
  
  static hasRole(roleName: string): boolean {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    
    const userRoles = user.roles || [];
    return userRoles.some(role => {
      return typeof role === 'string' ? role === roleName : role.name === roleName;
    });
  }
  
  static hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some(role => this.hasRole(role));
  }
  
  static hasAllRoles(roleNames: string[]): boolean {
    return roleNames.every(role => this.hasRole(role));
  }
  
  static getRoleLevel(roleName: string): number {
    const user = Auth.getCurrentUser();
    if (!user) return 0;
    
    const userRoles = user.roles || [];
    const role = userRoles.find(r => 
      typeof r === 'string' ? r === roleName : r.name === roleName
    );
    
    return typeof role === 'object' ? role.level || 0 : 0;
  }
  
  static hasMinimumRoleLevel(minimumLevel: number): boolean {
    const user = Auth.getCurrentUser();
    if (!user) return false;
    
    const userRoles = user.roles || [];
    return userRoles.some(role => {
      const level = typeof role === 'object' ? role.level || 0 : 0;
      return level >= minimumLevel;
    });
  }
}

// Usage examples
if (PermissionManager.hasPermission('write', 'posts')) {
  console.log('User can write posts');
}

if (PermissionManager.hasRole('admin')) {
  console.log('User is an admin');
}

if (PermissionManager.hasMinimumRoleLevel(5)) {
  console.log('User has sufficient role level');
}
```

---

## 🛡️ Security Features

### **Encrypted Session Storage**

```typescript
class SecureStorage implements IAuthSessionStorage {
  private encryptionKey: string;
  
  constructor(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
  }
  
  get<T = any>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt stored data:', error);
      return null;
    }
  }
  
  set<T = any>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = this.encrypt(serialized);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to encrypt data for storage:', error);
    }
  }
  
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  
  clear(): void {
    // Only clear auth-related keys
    const authKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('auth-') || key.startsWith('user-')
    );
    authKeys.forEach(key => localStorage.removeItem(key));
  }
  
  private encrypt(text: string): string {
    // Use CryptoJS or similar encryption library
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }
  
  private decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

// Configure Auth to use secure storage
Auth.setStorage(new SecureStorage('your-encryption-key'));
```

### **Session Timeout and Auto-refresh**

```typescript
class SessionManager {
  private refreshInterval: any;
  private warningTimeout: any;
  private expiredTimeout: any;
  
  constructor() {
    this.initializeSessionMonitoring();
  }
  
  private initializeSessionMonitoring() {
    // Monitor authentication state
    Auth.observe('login', () => {
      this.startSessionMonitoring();
    });
    
    Auth.observe('logout', () => {
      this.stopSessionMonitoring();
    });
    
    // Start monitoring if user is already logged in
    if (Auth.isAuthenticated()) {
      this.startSessionMonitoring();
    }
  }
  
  private startSessionMonitoring() {
    this.stopSessionMonitoring(); // Clear any existing timers
    
    const sessionTimeout = Auth.getSessionTimeout();
    const warningTime = sessionTimeout - (5 * 60 * 1000); // 5 minutes before expiry
    
    // Auto-refresh session periodically
    this.refreshInterval = setInterval(() => {
      this.refreshSessionIfNeeded();
    }, 5 * 60 * 1000); // Every 5 minutes
    
    // Warn user before session expires
    this.warningTimeout = setTimeout(() => {
      this.showSessionWarning();
    }, warningTime);
    
    // Logout when session expires
    this.expiredTimeout = setTimeout(() => {
      this.handleSessionExpired();
    }, sessionTimeout);
  }
  
  private stopSessionMonitoring() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
      this.warningTimeout = null;
    }
    
    if (this.expiredTimeout) {
      clearTimeout(this.expiredTimeout);
      this.expiredTimeout = null;
    }
  }
  
  private async refreshSessionIfNeeded() {
    try {
      await new AuthenticationService().refreshSession();
      console.log('Session refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  }
  
  private showSessionWarning() {
    Auth.notify('sessionWarning', {
      message: 'Your session will expire in 5 minutes',
      timeLeft: 5 * 60 * 1000
    });
  }
  
  private handleSessionExpired() {
    Auth.notify('sessionExpired', {
      timestamp: new Date()
    });
    
    // Logout user
    new AuthenticationService().logout('timeout');
  }
  
  extendSession() {
    // Reset timers when user is active
    if (Auth.isAuthenticated()) {
      this.startSessionMonitoring();
    }
  }
}

// Activity monitoring
class UserActivityMonitor {
  private sessionManager: SessionManager;
  private lastActivity: Date = new Date();
  
  constructor(sessionManager: SessionManager) {
    this.sessionManager = sessionManager;
    this.bindActivityEvents();
  }
  
  private bindActivityEvents() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.recordActivity();
      }, { passive: true });
    });
  }
  
  private recordActivity() {
    const now = new Date();
    const timeSinceLastActivity = now.getTime() - this.lastActivity.getTime();
    
    // Extend session if significant activity (more than 1 minute since last)
    if (timeSinceLastActivity > 60 * 1000) {
      this.sessionManager.extendSession();
    }
    
    this.lastActivity = now;
  }
}
```

---

## 🎯 Advanced Authentication Patterns

### **Role-Based Component Protection**

```typescript
// Decorator for method-level authorization
function RequiresPermission(permission: string, resource?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      if (!PermissionManager.hasPermission(permission, resource)) {
        throw new Error(`Access denied: Missing permission '${permission}'`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

function RequiresRole(role: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      if (!PermissionManager.hasRole(role)) {
        throw new Error(`Access denied: Missing role '${role}'`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// Usage in service classes
class PostService {
  @RequiresPermission('read', 'posts')
  getPosts(): Post[] {
    // Implementation
    return [];
  }
  
  @RequiresPermission('write', 'posts')
  createPost(post: Partial<Post>): Post {
    // Implementation
    return {} as Post;
  }
  
  @RequiresRole('admin')
  deleteAllPosts(): void {
    // Implementation
  }
  
  @RequiresPermission('moderate', 'posts')
  moderatePost(postId: string, action: string): void {
    // Implementation
  }
}
```

### **Authentication Guards**

```typescript
interface IRoute {
  path: string;
  component: any;
  requiresAuth?: boolean;
  permissions?: string[];
  roles?: string[];
}

class AuthGuard {
  static canAccess(route: IRoute): boolean {
    // Check if route requires authentication
    if (route.requiresAuth && !Auth.isAuthenticated()) {
      return false;
    }
    
    // Check required permissions
    if (route.permissions) {
      const hasAllPermissions = route.permissions.every(permission => 
        PermissionManager.hasPermission(permission)
      );
      if (!hasAllPermissions) {
        return false;
      }
    }
    
    // Check required roles
    if (route.roles) {
      const hasAnyRole = PermissionManager.hasAnyRole(route.roles);
      if (!hasAnyRole) {
        return false;
      }
    }
    
    return true;
  }
  
  static getRedirectPath(route: IRoute): string {
    if (!Auth.isAuthenticated()) {
      return '/login';
    }
    
    if (route.permissions || route.roles) {
      return '/unauthorized';
    }
    
    return '/';
  }
}

// Router integration
class Router {
  navigate(path: string) {
    const route = this.findRoute(path);
    
    if (!AuthGuard.canAccess(route)) {
      const redirectPath = AuthGuard.getRedirectPath(route);
      this.navigate(redirectPath);
      return;
    }
    
    // Proceed with navigation
    this.loadComponent(route.component);
  }
  
  private findRoute(path: string): IRoute {
    // Route finding logic
    return { path, component: null };
  }
  
  private loadComponent(component: any) {
    // Component loading logic
  }
}
```

---

## 📱 Multi-Device Session Management

### **Device Registration and Management**

```typescript
interface IAuthDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  lastActive: Date;
  isCurrentDevice: boolean;
}

class DeviceManager {
  private static getCurrentDeviceInfo(): Partial<IAuthDevice> {
    const userAgent = navigator.userAgent;
    
    return {
      type: this.detectDeviceType(userAgent),
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent),
      name: this.generateDeviceName()
    };
  }
  
  private static detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/mobile|android|iphone/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }
  
  private static detectBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
  
  private static detectOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }
  
  private static generateDeviceName(): string {
    const info = this.getCurrentDeviceInfo();
    return `${info.browser} on ${info.os}`;
  }
  
  static async registerDevice(): Promise<IAuthDevice> {
    const deviceInfo = this.getCurrentDeviceInfo();
    
    const response = await fetch('/api/auth/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify(deviceInfo)
    });
    
    return response.json();
  }
  
  static async getActiveDevices(): Promise<IAuthDevice[]> {
    const response = await fetch('/api/auth/devices', {
      headers: {
        'Authorization': `Bearer ${Auth.getToken()}`
      }
    });
    
    return response.json();
  }
  
  static async revokeDevice(deviceId: string): Promise<void> {
    await fetch(`/api/auth/devices/${deviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Auth.getToken()}`
      }
    });
  }
}
```

---

## 🎯 Real-World Integration Examples

### **React Component Integration**

```typescript
// Higher-order component for authentication
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    requiresAuth?: boolean;
    permissions?: string[];
    roles?: string[];
    fallback?: React.ComponentType;
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const [isAuthorized, setIsAuthorized] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
      const checkAuthorization = () => {
        if (options.requiresAuth && !Auth.isAuthenticated()) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }
        
        if (options.permissions) {
          const hasPermissions = options.permissions.every(p => 
            PermissionManager.hasPermission(p)
          );
          if (!hasPermissions) {
            setIsAuthorized(false);
            setIsLoading(false);
            return;
          }
        }
        
        if (options.roles) {
          const hasRoles = PermissionManager.hasAnyRole(options.roles);
          if (!hasRoles) {
            setIsAuthorized(false);
            setIsLoading(false);
            return;
          }
        }
        
        setIsAuthorized(true);
        setIsLoading(false);
      };
      
      checkAuthorization();
      
      // Listen for auth changes
      const unsubscribe = Auth.observe('*', checkAuthorization);
      return unsubscribe;
    }, []);
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthorized) {
      const FallbackComponent = options.fallback || (() => <div>Unauthorized</div>);
      return <FallbackComponent />;
    }
    
    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedAdminPanel = withAuth(AdminPanel, {
  requiresAuth: true,
  roles: ['admin'],
  fallback: UnauthorizedPage
});

const ProtectedPostEditor = withAuth(PostEditor, {
  requiresAuth: true,
  permissions: ['write:posts'],
  fallback: () => <div>You don't have permission to edit posts</div>
});
```

### **API Integration with Automatic Token Management**

```typescript
class AuthenticatedApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor - add auth token
    this.addRequestInterceptor(async (config) => {
      const token = Auth.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }
      return config;
    });
    
    // Response interceptor - handle auth errors
    this.addResponseInterceptor(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          try {
            await new AuthenticationService().refreshSession();
            // Retry original request
            return this.retry(error.config);
          } catch (refreshError) {
            // Refresh failed, logout user
            Auth.logout();
            Auth.notify('sessionExpired', { timestamp: new Date() });
            throw refreshError;
          }
        }
        throw error;
      }
    );
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse<T>(response);
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<T>(response);
  }
  
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    const token = Auth.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      Auth.logout();
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
}
```

---

## 🎯 Best Practices

### **1. Security**
```typescript
// ✅ Good: Encrypt sensitive data
Auth.setStorage(new SecureStorage(encryptionKey));

// ✅ Good: Use HTTPS only
// ✅ Good: Implement session timeouts
// ✅ Good: Validate permissions on both client and server

// ❌ Avoid: Storing sensitive data in plain text
// ❌ Avoid: Client-side only authorization
```

### **2. Error Handling**
```typescript
// ✅ Good: Comprehensive error handling
try {
  await authService.login(username, password);
} catch (error) {
  if (error.code === 'INVALID_CREDENTIALS') {
    showError('Invalid username or password');
  } else if (error.code === 'ACCOUNT_LOCKED') {
    showError('Account is temporarily locked');
  } else {
    showError('Login failed. Please try again.');
  }
}
```

### **3. User Experience**
```typescript
// ✅ Good: Provide clear feedback
Auth.observe('sessionWarning', ({ timeLeft }) => {
  showSessionWarningDialog(timeLeft);
});

Auth.observe('sessionExpired', () => {
  showMessage('Your session has expired. Please log in again.');
  redirectToLogin();
});
```

---

The Authentication system in @resk/core provides enterprise-grade security features while maintaining developer-friendly APIs and seamless integration with the rest of the framework.
