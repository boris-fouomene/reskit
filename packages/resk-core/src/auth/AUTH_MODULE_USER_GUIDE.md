# @resk/core Auth Module - Complete User Guide

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Type System & Interface Augmentation](#type-system--interface-augmentation)
5. [Authentication Management](#authentication-management)
6. [Permission System](#permission-system)
7. [Session Management](#session-management)
8. [Event System](#event-system)
9. [Security Features](#security-features)
10. [Advanced Usage Patterns](#advanced-usage-patterns)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)
13. [API Reference](#api-reference)

---

## Overview

The @resk/core Auth module provides a comprehensive, type-safe authentication and authorization system for modern web applications. It features encrypted session storage, role-based access control (RBAC), real-time event broadcasting, and flexible permission management.

### Key Features

- 🔐 **Secure Authentication**: Encrypted session storage with AES encryption
- 🎯 **Permission System**: Fine-grained, role-based access control
- 🔄 **Event System**: Real-time authentication state notifications
- 📱 **Cross-Tab Sync**: Automatic session synchronization across browser tabs
- 🎨 **Type Safety**: Full TypeScript support with augmentable interfaces
- ⚡ **Performance**: Memory caching and optimized session management
- 🛡️ **Security**: Fail-safe defaults and comprehensive input validation

### Target Audience

This guide is designed for:
- **Beginners**: New to authentication systems (start with Getting Started)
- **Intermediate**: Familiar with auth concepts (focus on Permission System)
- **Advanced**: Building complex applications (see Advanced Usage Patterns)

---

## Getting Started

### Installation

```bash
npm install @resk/core
```

### Imports

The Auth module can be imported from the auth submodule:

```typescript
import { Auth } from '@resk/core/auth';
// or for specific types
import { IAuthUser, IAuthPerms } from '@resk/core/auth/types';
```

### Basic Setup

```typescript
import { Auth } from '@resk/core/auth';

// Basic user sign-in
const user = {
  id: "user123",
  username: "john_doe",
  email: "john@example.com",
  token: "your-auth-token",
  perms: {
    documents: ["read", "create"],
    users: ["read"]
  }
};

// Sign in the user
await Auth.signIn(user);

// Check if user is signed in
const currentUser = Auth.getSignedUser();
console.log('Current user:', currentUser);

// Sign out
await Auth.signOut();
```

### Quick Start Example

```typescript
// Complete authentication workflow
import { Auth } from '@resk/core/auth';

class AuthService {
  async login(credentials: { username: string; password: string }) {
    try {
      // Call your API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const userData = await response.json();
      
      // Sign in with Auth module
      await Auth.signIn(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async logout() {
    await Auth.signOut();
    window.location.href = '/login';
  }
  
  getCurrentUser() {
    return Auth.getSignedUser();
  }
}
```

---

## Core Concepts

### Authentication vs Authorization

- **Authentication**: Verifying user identity (who you are)
- **Authorization**: Determining user permissions (what you can do)

The Auth module handles both through a unified API.

### User Object Structure

```typescript
interface IAuthUser {
  id: string | number;                    // Unique user identifier
  authSessionCreatedAt?: number;          // Session timestamp
  token?: string;                         // Authentication token
  perms?: IAuthPerms;                     // Direct permissions
  roles?: IAuthRole[];                    // User roles
  // ... any additional properties
}
```

### Permission Hierarchy

1. **Direct Permissions**: Assigned directly to the user
2. **Role Permissions**: Inherited from user roles
3. **Master Admin**: Overrides all permissions

---

## Type System & Interface Augmentation

### Understanding Augmentable Interfaces

The Auth module uses TypeScript's declaration merging to allow external augmentation of core interfaces. This enables you to extend the type system to match your application's specific needs.

The key interfaces you can augment are:
- **IResources**: Define your application's resources and their available actions
- **IAuthUser**: Add custom properties to the user object
- **IAuthEventMap**: Add custom authentication events
- **IAuthRole**: Define role structure properties

### Resource Structure

Resources in @resk/core follow a specific structure where each resource has a set of actions:

```typescript
interface IResources {
  [resourceName: string]: {
    actions: {
      [actionName: string]: IResourceAction;
    };
  };
}
```

The framework automatically generates the `IResourceName` and `IResourceActionName` types from your `IResources` definition.

### Augmenting Resources and Actions

To define custom resources and actions in your application, you need to augment the `IResources` interface. This interface defines both resources and their available actions:

```typescript
import "IResourceAction" from "@resk/core/resources";
// In your project's type definitions file (e.g., types/auth.d.ts)
declare module '@resk/core/resources' {
  interface IResources {
    documents: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
        publish: IResourceAction;
        export: IResourceAction;
      };
    };
    users: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
        suspend: IResourceAction;
      };
    };
    reports: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        export: IResourceAction;
        share: IResourceAction;
      };
    };
    billing: {
      actions: {
        read: IResourceAction;
        update: IResourceAction;
        all: IResourceAction;
      };
    };
    settings: {
      actions: {
        read: IResourceAction;
        update: IResourceAction;
        all: IResourceAction;
      };
    };
  }
}
```

### Augmenting IAuthUser

To add custom user properties:

```typescript
declare module '@resk/core' {
  interface IAuthUser {
    // Custom user properties
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    department?: string;
    lastLoginAt?: number;
    preferences?: {
      theme: 'light' | 'dark';
      language: string;
      timezone: string;
    };
  }
}
```

### Complete Type Augmentation Example

```typescript
// types/auth.d.ts
declare module '@resk/core' {
  // Define your application's resources and their actions
  interface IResources {
    documents: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
        publish: IResourceAction;
        export: IResourceAction;
        share: IResourceAction;
      };
    };
    users: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
        suspend: IResourceAction;
        activate: IResourceAction;
      };
    };
    projects: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
        archive: IResourceAction;
        clone: IResourceAction;
      };
    };
    reports: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        export: IResourceAction;
        share: IResourceAction;
        schedule: IResourceAction;
      };
    };
    billing: {
      actions: {
        read: IResourceAction;
        update: IResourceAction;
        all: IResourceAction;
      };
    };
    admin: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
        all: IResourceAction;
      };
    };
  }
  
  // Extend the user interface with custom properties
  interface IAuthUser {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    department?: string;
    isActive: boolean;
    lastLoginAt?: number;
    preferences?: UserPreferences;
  }
  
  // Extend auth events for custom event handling
  interface IAuthEventMap {
    USER_PROFILE_UPDATED: IAuthUser;
    PERMISSION_DENIED: { resource: string; action: string };
    SESSION_EXPIRED: null;
  }
  
  // Define role structure
  interface IAuthRole {
    id: string;
    name: string;
    description?: string;
    level: number;
    isSystem: boolean;
  }
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}
```

---

## Authentication Management

### User Sign-In

```typescript
// Basic sign-in
const user = {
  id: "user123",
  username: "john_doe",
  email: "john@example.com",
  token: "jwt-token-here",
  perms: {
    documents: ["read", "create"],
    users: ["read"]
  }
};

await Auth.signIn(user);
```

### Silent Sign-In (No Events)

```typescript
// Sign in without triggering events
await Auth.signIn(user, false);
```

### User Sign-Out

```typescript
// Standard sign-out with events
await Auth.signOut();

// Silent sign-out without events
await Auth.signOut(false);
```

### Getting Current User

```typescript
const currentUser = Auth.getSignedUser();
if (currentUser) {
  console.log(`Welcome ${currentUser.username}!`);
} else {
  console.log('No user signed in');
}
```

### Token Management

```typescript
// Get current user's token
const token = Auth.Session.getToken();

// Update user's token
Auth.Session.setToken('new-jwt-token');

// Remove token
Auth.Session.setToken(null);
```

### Advanced Authentication Patterns

#### OAuth Integration

```typescript
class OAuthService {
  async handleOAuthCallback(authCode: string) {
    try {
      // Exchange code for token
      const tokenResponse = await this.exchangeCodeForToken(authCode);
      
      // Get user profile
      const userProfile = await this.fetchUserProfile(tokenResponse.access_token);
      
      // Create user object
      const user: IAuthUser = {
        id: userProfile.id,
        username: userProfile.login,
        email: userProfile.email,
        token: tokenResponse.access_token,
        perms: await this.fetchUserPermissions(userProfile.id),
        roles: await this.fetchUserRoles(userProfile.id)
      };
      
      // Sign in
      await Auth.signIn(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

#### Session Persistence

```typescript
class SessionManager {
  async persistSession(user: IAuthUser, rememberMe: boolean = false) {
    // Add persistence flag
    const sessionUser = {
      ...user,
      rememberMe,
      sessionId: crypto.randomUUID()
    };
    
    await Auth.signIn(sessionUser);
    
    // Store additional session metadata
    const sessionStorage = Auth.Session.getStorage('metadata');
    sessionStorage.set('lastActivity', Date.now());
    sessionStorage.set('deviceInfo', this.getDeviceInfo());
  }
  
  validateSession(): boolean {
    const user = Auth.getSignedUser();
    if (!user) return false;
    
    const sessionStorage = Auth.Session.getStorage('metadata');
    const lastActivity = sessionStorage.get('lastActivity');
    
    // Check if session expired (30 minutes)
    const maxInactivity = 30 * 60 * 1000;
    const isExpired = Date.now() - lastActivity > maxInactivity;
    
    if (isExpired) {
      Auth.signOut();
      return false;
    }
    
    // Update last activity
    sessionStorage.set('lastActivity', Date.now());
    return true;
  }
}
```

---

## Permission System

### Permission Structure

```typescript
interface IAuthPerms {
  [resourceName: string]: IResourceActionName[];
}

// Example permission object
const userPermissions: IAuthPerms = {
  documents: ["read", "create", "update"],
  users: ["read"],
  reports: ["read", "export"],
  settings: ["all"] // Universal permission
};
```

### Direct Permission Checking

```typescript
// Check if user has specific permission
const user = Auth.getSignedUser();
const canEditDocs = Auth.checkUserPermission(user, "documents", "update");

if (canEditDocs) {
  // Show edit interface
  showEditButton();
} else {
  // Show read-only interface
  showReadOnlyView();
}
```

### Role-Based Permissions

```typescript
// User with roles
const userWithRoles: IAuthUser = {
  id: "user456",
  username: "jane_smith",
  perms: {
    profile: ["read", "update"]
  },
  roles: [
    {
      name: "editor",
      perms: {
        documents: ["read", "create", "update"],
        images: ["upload", "edit"]
      }
    },
    {
      name: "moderator",
      perms: {
        comments: ["read", "update", "delete"],
        users: ["read", "suspend"]
      }
    }
  ]
};

// Permission checking considers both direct and role permissions
const canDeleteComments = Auth.checkUserPermission(userWithRoles, "comments", "delete");
// Returns true (from moderator role)
```

### Universal Permissions

```typescript
// "all" permission grants access to any action
const adminPermissions: IAuthPerms = {
  system: ["all"],
  users: ["all"],
  documents: ["read", "create"] // Specific permissions
};

// These all return true due to "all" permission
console.log(Auth.checkPermission(adminPermissions, "system", "configure")); // true
console.log(Auth.checkPermission(adminPermissions, "system", "delete")); // true
console.log(Auth.checkPermission(adminPermissions, "system", "custom_action")); // true
```

### Master Admin Override

```typescript
// Set master admin checker
Auth.isMasterAdmin = (user) => {
  return user?.roles?.some(role => role.name === 'super_admin') || 
         user?.id === 'system_admin';
};

// Master admin bypasses all permission checks
const adminUser = { id: "system_admin", roles: [] };
const canDoAnything = Auth.isAllowed(
  { resourceName: "secret", action: "delete" },
  adminUser
); // Returns true (master admin bypass)
```

### Advanced Permission Patterns

#### Permission Utilities

```typescript
class PermissionHelper {
  // Check multiple permissions (OR logic)
  static hasAnyPermission(
    user: IAuthUser,
    checks: Array<[string, string]>
  ): boolean {
    return checks.some(([resource, action]) =>
      Auth.checkUserPermission(user, resource, action)
    );
  }
  
  // Check multiple permissions (AND logic)
  static hasAllPermissions(
    user: IAuthUser,
    checks: Array<[string, string]>
  ): boolean {
    return checks.every(([resource, action]) =>
      Auth.checkUserPermission(user, resource, action)
    );
  }
  
  // Get user capabilities
  static getUserCapabilities(user: IAuthUser) {
    return {
      canReadDocs: Auth.checkUserPermission(user, "documents", "read"),
      canCreateDocs: Auth.checkUserPermission(user, "documents", "create"),
      canUpdateDocs: Auth.checkUserPermission(user, "documents", "update"),
      canDeleteDocs: Auth.checkUserPermission(user, "documents", "delete"),
      canManageUsers: Auth.checkUserPermission(user, "users", "update"),
      canViewReports: Auth.checkUserPermission(user, "reports", "read")
    };
  }
}
```

#### React Integration

```typescript
// Custom hook for permissions
function usePermissions() {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [capabilities, setCapabilities] = useState({});
  
  useEffect(() => {
    const currentUser = Auth.getSignedUser();
    setUser(currentUser);
    
    if (currentUser) {
      setCapabilities(PermissionHelper.getUserCapabilities(currentUser));
    }
    
    // Listen for auth changes
    const unsubscribe = Auth.events.on('SIGN_IN', (user) => {
      setUser(user);
      setCapabilities(PermissionHelper.getUserCapabilities(user));
    });
    
    Auth.events.on('SIGN_OUT', () => {
      setUser(null);
      setCapabilities({});
    });
    
    return unsubscribe;
  }, []);
  
  return { user, capabilities };
}

// Component using permissions
function DocumentToolbar() {
  const { capabilities } = usePermissions();
  
  return (
    <div className="toolbar">
      {capabilities.canCreateDocs && <CreateButton />}
      {capabilities.canUpdateDocs && <EditButton />}
      {capabilities.canDeleteDocs && <DeleteButton />}
    </div>
  );
}
```

#### Middleware Integration

```typescript
// Express.js middleware
class PermissionGuard {
  static requirePermission(resource: string, action: string = "read") {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = Auth.getSignedUser();
      
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      if (!Auth.checkUserPermission(user, resource, action)) {
        return res.status(403).json({ 
          error: `Permission denied: ${action} on ${resource}` 
        });
      }
      
      req.user = user; // Attach user to request
      next();
    };
  }
}

// Usage in routes
app.get('/documents', 
  PermissionGuard.requirePermission('documents', 'read'), 
  getDocuments
);

app.post('/documents', 
  PermissionGuard.requirePermission('documents', 'create'), 
  createDocument
);

app.delete('/documents/:id', 
  PermissionGuard.requirePermission('documents', 'delete'), 
  deleteDocument
);
```

---

## Session Management

### Basic Session Operations

```typescript
// Get session storage for a specific namespace
const userSession = Auth.Session.getStorage('user_preferences');

// Store data
userSession.set('theme', 'dark');
userSession.set('language', 'en');

// Retrieve data
const theme = userSession.get('theme'); // 'dark'
const language = userSession.get('language'); // 'en'

// Get all session data
const allData = userSession.getData();
console.log(allData); // { theme: 'dark', language: 'en' }
```

### Token Management

```typescript
// Get current user's token
const token = Auth.Session.getToken();

// Update token (useful for token refresh)
Auth.Session.setToken('new-refreshed-token');

// Using token in API calls
async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  const token = Auth.Session.getToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
```

### Session Storage Patterns

#### Caching System

```typescript
class SessionCache {
  private static session = Auth.Session;
  
  static async cacheApiResponse<T>(
    key: string, 
    data: T, 
    ttl: number = 300000
  ): Promise<void> {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    const cacheSession = this.session.getStorage('cache');
    cacheSession.set(key, cacheEntry);
  }
  
  static getCachedData<T>(key: string): T | null {
    const cacheSession = this.session.getStorage('cache');
    const cacheEntry = cacheSession.get(key);
    
    if (!cacheEntry) return null;
    
    const { data, timestamp, ttl } = cacheEntry;
    const isExpired = Date.now() - timestamp > ttl;
    
    if (isExpired) {
      cacheSession.set(key, null); // Clear expired cache
      return null;
    }
    
    return data;
  }
  
  static clearCache(): void {
    const cacheSession = this.session.getStorage('cache');
    const allData = cacheSession.getData();
    
    // Clear all cache entries
    Object.keys(allData).forEach(key => {
      cacheSession.set(key, null);
    });
  }
}

// Usage
await SessionCache.cacheApiResponse('user_profile', userData, 600000); // 10 minutes
const cachedProfile = SessionCache.getCachedData('user_profile');
```

#### User Preferences

```typescript
class UserPreferences {
  private static session = Auth.Session.getStorage('preferences');
  
  static setTheme(theme: 'light' | 'dark'): void {
    this.session.set('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }
  
  static getTheme(): 'light' | 'dark' {
    return this.session.get('theme') || 'light';
  }
  
  static setLanguage(language: string): void {
    this.session.set('language', language);
    // Update i18n language
  }
  
  static getLanguage(): string {
    return this.session.get('language') || 'en';
  }
  
  static setNotificationSettings(settings: NotificationSettings): void {
    this.session.set('notifications', settings);
  }
  
  static getNotificationSettings(): NotificationSettings {
    return this.session.get('notifications') || {
      email: true,
      push: true,
      desktop: false
    };
  }
  
  static resetToDefaults(): void {
    const allData = this.session.getData();
    Object.keys(allData).forEach(key => {
      this.session.set(key, null);
    });
  }
}
```

---

## Event System

### Authentication Events

The Auth module provides a powerful event system for real-time authentication state management.

```typescript
// Available events
interface IAuthEvent {
  SIGN_IN: IAuthUser;
  SIGN_OUT: null;
  // Add custom events by augmenting this interface
}
```

### Basic Event Handling

```typescript
// Listen for sign-in events
Auth.events.on('SIGN_IN', (user) => {
  console.log(`User signed in: ${user.username}`);
  
  // Initialize user-specific features
  initializeUserDashboard(user);
  loadUserPreferences(user.id);
  trackAnalyticsEvent('user_signin', { userId: user.id });
});

// Listen for sign-out events
Auth.events.on('SIGN_OUT', () => {
  console.log('User signed out');
  
  // Cleanup user-specific data
  clearUserDashboard();
  clearUserPreferences();
  redirectToLogin();
});
```

### Advanced Event Patterns

#### Application Initialization

```typescript
class AppInitializer {
  static initialize() {
    // Set up authentication event handlers
    Auth.events.on('SIGN_IN', this.handleSignIn.bind(this));
    Auth.events.on('SIGN_OUT', this.handleSignOut.bind(this));
    
    // Check for existing session
    const existingUser = Auth.getSignedUser();
    if (existingUser) {
      this.handleSignIn(existingUser);
    }
  }
  
  static handleSignIn(user: IAuthUser) {
    // Initialize user-specific features
    this.initializeNavigation(user);
    this.loadUserSettings(user);
    this.setupNotifications(user);
    this.trackUserSession(user);
  }
  
  static handleSignOut() {
    // Cleanup application state
    this.resetNavigation();
    this.clearUserSettings();
    this.disableNotifications();
    this.redirectToLogin();
  }
  
  static initializeNavigation(user: IAuthUser) {
    const capabilities = PermissionHelper.getUserCapabilities(user);
    
    // Show/hide navigation items based on permissions
    const navItems = document.querySelectorAll('[data-permission]');
    navItems.forEach(item => {
      const requiredPermission = item.getAttribute('data-permission');
      const [resource, action] = requiredPermission.split(':');
      
      const hasPermission = Auth.checkUserPermission(user, resource, action);
      item.style.display = hasPermission ? 'block' : 'none';
    });
  }
}

// Initialize the application
AppInitializer.initialize();
```

#### Cross-Tab Synchronization

```typescript
class CrossTabSync {
  static initialize() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listen for auth events in current tab
    Auth.events.on('SIGN_IN', this.broadcastSignIn.bind(this));
    Auth.events.on('SIGN_OUT', this.broadcastSignOut.bind(this));
  }
  
  static handleStorageChange(event: StorageEvent) {
    // Check if auth session changed in another tab
    if (event.key === 'user-session') {
      const currentUser = Auth.getSignedUser();
      
      if (event.newValue === null && currentUser) {
        // User signed out in another tab
        console.log('User signed out in another tab');
        Auth.signOut(false); // Silent sign-out to avoid loops
        this.updateUIForSignOut();
      } else if (event.newValue && !currentUser) {
        // User signed in another tab
        console.log('User signed in another tab');
        this.updateUIForSignIn();
      }
    }
  }
  
  static broadcastSignIn(user: IAuthUser) {
    // Broadcast sign-in to other tabs
    localStorage.setItem('auth_event', JSON.stringify({
      type: 'SIGN_IN',
      timestamp: Date.now(),
      user: user
    }));
  }
  
  static broadcastSignOut() {
    // Broadcast sign-out to other tabs
    localStorage.setItem('auth_event', JSON.stringify({
      type: 'SIGN_OUT',
      timestamp: Date.now()
    }));
  }
}

CrossTabSync.initialize();
```

#### Event-Driven Analytics

```typescript
class AnalyticsIntegration {
  static initialize() {
    Auth.events.on('SIGN_IN', this.trackSignIn.bind(this));
    Auth.events.on('SIGN_OUT', this.trackSignOut.bind(this));
  }
  
  static trackSignIn(user: IAuthUser) {
    // Track sign-in event
    analytics.track('User Signed In', {
      userId: user.id,
      username: user.username,
      roles: user.roles?.map(r => r.name) || [],
      timestamp: Date.now(),
      sessionId: crypto.randomUUID()
    });
    
    // Set user context for future events
    analytics.identify(user.id, {
      username: user.username,
      email: user.email,
      signedInAt: Date.now()
    });
  }
  
  static trackSignOut() {
    analytics.track('User Signed Out', {
      timestamp: Date.now()
    });
    
    // Clear user context
    analytics.reset();
  }
}

AnalyticsIntegration.initialize();
```

---

## Security Features

### Encrypted Session Storage

The Auth module automatically encrypts sensitive user data before storing it in session storage.

```typescript
// All user data is automatically encrypted
const user = {
  id: "user123",
  token: "sensitive-jwt-token",
  perms: { admin: ["all"] }
};

// This data is encrypted before storage
await Auth.signIn(user);

// Decrypted automatically when retrieved
const retrievedUser = Auth.getSignedUser();
```

### Input Validation

```typescript
// The Auth module validates all inputs
try {
  await Auth.signIn(null); // Throws error
} catch (error) {
  console.error(error.message); // "Invalid sign-in user"
}

// Permission checking validates inputs
const isValid = Auth.checkUserPermission(null, "documents", "read"); // false
const isValid2 = Auth.checkPermission({}, "", "read"); // false
```

### Fail-Safe Defaults

```typescript
// All permission checks default to denying access
const user = null;
const canAccess = Auth.checkUserPermission(user, "documents", "read"); // false

// Invalid permissions default to false
const permissions = null;
const canEdit = Auth.checkPermission(permissions, "documents", "update"); // false
```

### Security Best Practices

#### Token Management

```typescript
class SecureTokenManager {
  static async refreshToken(): Promise<boolean> {
    try {
      const currentToken = Auth.Session.getToken();
      if (!currentToken) return false;
      
      // Call refresh endpoint
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Token refresh failed');
      
      const { token: newToken } = await response.json();
      
      // Update token in session
      Auth.Session.setToken(newToken);
      
      return true;
    } catch (error) {
      // Sign out on refresh failure
      await Auth.signOut();
      return false;
    }
  }
  
  static startTokenRefreshTimer(intervalMs: number = 15 * 60 * 1000) {
    return setInterval(async () => {
      const user = Auth.getSignedUser();
      if (user) {
        await this.refreshToken();
      }
    }, intervalMs);
  }
}
```

#### Session Timeout

```typescript
class SessionTimeoutManager {
  private static timeoutId: NodeJS.Timeout | null = null;
  private static warningTimeoutId: NodeJS.Timeout | null = null;
  
  static startSessionTimer(durationMs: number = 30 * 60 * 1000) {
    this.clearSessionTimer();
    
    // Warning 5 minutes before timeout
    this.warningTimeoutId = setTimeout(() => {
      this.showTimeoutWarning();
    }, durationMs - 5 * 60 * 1000);
    
    // Actual timeout
    this.timeoutId = setTimeout(async () => {
      console.log('Session expired - signing out user');
      await Auth.signOut();
      this.showSessionExpiredMessage();
    }, durationMs);
  }
  
  static resetSessionTimer() {
    const user = Auth.getSignedUser();
    if (user) {
      this.startSessionTimer();
    }
  }
  
  static clearSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }
  
  static showTimeoutWarning() {
    // Show warning modal
    const extendSession = confirm('Your session will expire in 5 minutes. Extend session?');
    if (extendSession) {
      this.resetSessionTimer();
    }
  }
  
  static showSessionExpiredMessage() {
    alert('Your session has expired. Please sign in again.');
    window.location.href = '/login';
  }
}

// Initialize session timeout on sign-in
Auth.events.on('SIGN_IN', () => {
  SessionTimeoutManager.startSessionTimer();
});

Auth.events.on('SIGN_OUT', () => {
  SessionTimeoutManager.clearSessionTimer();
});

// Reset timer on user activity
document.addEventListener('click', () => SessionTimeoutManager.resetSessionTimer());
document.addEventListener('keypress', () => SessionTimeoutManager.resetSessionTimer());
```

---

## Advanced Usage Patterns

### Multi-Tenant Applications

```typescript
class MultiTenantAuth {
  static async signInWithTenant(user: IAuthUser, tenantId: string) {
    // Add tenant information to user
    const tenantUser = {
      ...user,
      tenantId,
      perms: await this.getTenantPermissions(user.id, tenantId)
    };
    
    await Auth.signIn(tenantUser);
    
    // Store tenant-specific session data
    const tenantSession = Auth.Session.getStorage(`tenant_${tenantId}`);
    tenantSession.set('selectedTenant', tenantId);
    tenantSession.set('tenantInfo', await this.getTenantInfo(tenantId));
  }
  
  static getCurrentTenant(): string | null {
    const user = Auth.getSignedUser();
    return user?.tenantId || null;
  }
  
  static async switchTenant(tenantId: string) {
    const user = Auth.getSignedUser();
    if (!user) throw new Error('No user signed in');
    
    // Get permissions for new tenant
    const tenantPermissions = await this.getTenantPermissions(user.id, tenantId);
    
    // Update user with new tenant data
    const updatedUser = {
      ...user,
      tenantId,
      perms: tenantPermissions
    };
    
    await Auth.signIn(updatedUser, false); // Silent update
    
    // Update tenant session
    const tenantSession = Auth.Session.getStorage(`tenant_${tenantId}`);
    tenantSession.set('selectedTenant', tenantId);
  }
}
```

### Permission Caching

```typescript
class PermissionCache {
  private static cache = new Map<string, { result: boolean; timestamp: number }>();
  private static cacheTTL = 5 * 60 * 1000; // 5 minutes
  
  static checkUserPermissionCached(
    user: IAuthUser, 
    resource: string, 
    action: string
  ): boolean {
    const cacheKey = `${user.id}-${resource}-${action}`;
    const cached = this.cache.get(cacheKey);
    
    // Check if cache is valid
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.result;
    }
    
    // Compute permission and cache result
    const result = Auth.checkUserPermission(user, resource, action);
    this.cache.set(cacheKey, { result, timestamp: Date.now() });
    
    return result;
  }
  
  static clearUserCache(userId: string) {
    for (const [key] of this.cache) {
      if (key.startsWith(`${userId}-`)) {
        this.cache.delete(key);
      }
    }
  }
  
  static clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache) {
      if (now - value.timestamp >= this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }
}

// Clear cache on sign-out
Auth.events.on('SIGN_OUT', () => {
  PermissionCache.clearExpiredCache();
});
```

### Audit Logging

```typescript
class AuthAuditLogger {
  static initialize() {
    Auth.events.on('SIGN_IN', this.logSignIn.bind(this));
    Auth.events.on('SIGN_OUT', this.logSignOut.bind(this));
    
    // Log permission checks (for security-sensitive applications)
    this.interceptPermissionChecks();
  }
  
  static logSignIn(user: IAuthUser) {
    this.logEvent('SIGN_IN', {
      userId: user.id,
      username: user.username,
      timestamp: Date.now(),
      sessionId: user.authSessionCreatedAt,
      userAgent: navigator.userAgent,
      ipAddress: this.getClientIP()
    });
  }
  
  static logSignOut() {
    const user = Auth.getSignedUser();
    this.logEvent('SIGN_OUT', {
      userId: user?.id,
      timestamp: Date.now(),
      sessionDuration: user?.authSessionCreatedAt ? 
        Date.now() - user.authSessionCreatedAt : 0
    });
  }
  
  static interceptPermissionChecks() {
    const originalCheckUserPermission = Auth.checkUserPermission;
    
    Auth.checkUserPermission = function(user, resource, action) {
      const result = originalCheckUserPermission.call(this, user, resource, action);
      
      // Log sensitive permission checks
      if (['admin', 'system', 'billing'].includes(resource)) {
        AuthAuditLogger.logEvent('PERMISSION_CHECK', {
          userId: user?.id,
          resource,
          action,
          result,
          timestamp: Date.now()
        });
      }
      
      return result;
    };
  }
  
  static async logEvent(event: string, data: any) {
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.Session.getToken()}`
        },
        body: JSON.stringify({ event, data })
      });
    } catch (error) {
      console.warn('Failed to log audit event:', error);
    }
  }
}

AuthAuditLogger.initialize();
```

### Custom Permission Validators

```typescript
// Define custom permission types
type CustomPermission = 
  | { type: 'time-based'; startTime: string; endTime: string }
  | { type: 'ip-based'; allowedIPs: string[] }
  | { type: 'device-based'; allowedDevices: string[] }
  | { type: 'conditional'; condition: (user: IAuthUser) => boolean };

class CustomPermissionValidator {
  static validateCustomPermission(
    user: IAuthUser, 
    customPerm: CustomPermission
  ): boolean {
    switch (customPerm.type) {
      case 'time-based':
        return this.validateTimeBasedPermission(customPerm);
      
      case 'ip-based':
        return this.validateIPBasedPermission(customPerm);
      
      case 'device-based':
        return this.validateDeviceBasedPermission(customPerm);
      
      case 'conditional':
        return customPerm.condition(user);
      
      default:
        return false;
    }
  }
  
  static validateTimeBasedPermission(perm: { startTime: string; endTime: string }): boolean {
    const now = new Date();
    const start = new Date(`${now.toDateString()} ${perm.startTime}`);
    const end = new Date(`${now.toDateString()} ${perm.endTime}`);
    
    return now >= start && now <= end;
  }
  
  static validateIPBasedPermission(perm: { allowedIPs: string[] }): boolean {
    const clientIP = this.getClientIP();
    return perm.allowedIPs.includes(clientIP);
  }
  
  static validateDeviceBasedPermission(perm: { allowedDevices: string[] }): boolean {
    const deviceId = this.getDeviceId();
    return perm.allowedDevices.includes(deviceId);
  }
}
```

---

## Best Practices

### 1. Type Safety

```typescript
// Always use proper type definitions
declare module '@resk/core' {
  interface IResources {
    documents: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
      };
    };
    users: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
        delete: IResourceAction;
      };
    };
  }
  
  interface IAuthUser {
    // Add all required properties
    username: string;
    email: string;
  }
}

// Use type guards for user validation
function isValidUser(user: any): user is IAuthUser {
  return user && 
         typeof user.id === 'string' && 
         typeof user.username === 'string' &&
         typeof user.email === 'string';
}
```

### 2. Error Handling

```typescript
// Always handle authentication errors gracefully
class AuthErrorHandler {
  static async signInWithErrorHandling(userData: any) {
    try {
      if (!isValidUser(userData)) {
        throw new Error('Invalid user data');
      }
      
      await Auth.signIn(userData);
      return { success: true };
    } catch (error) {
      console.error('Sign-in error:', error);
      
      // Show user-friendly error message
      this.showErrorMessage('Failed to sign in. Please try again.');
      
      return { success: false, error: error.message };
    }
  }
  
  static showErrorMessage(message: string) {
    // Implement your error display logic
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
  }
}
```

### 3. Performance Optimization

```typescript
// Use permission caching for frequent checks
const userCapabilities = useMemo(() => {
  const user = Auth.getSignedUser();
  return user ? PermissionHelper.getUserCapabilities(user) : {};
}, [Auth.getSignedUser()]);

// Debounce session updates
const debouncedSessionUpdate = debounce((data) => {
  const sessionStorage = Auth.Session.getStorage('activity');
  sessionStorage.set('lastActivity', data);
}, 1000);
```

### 4. Security Guidelines

```typescript
// Always validate permissions on the server side
class SecureAPIClient {
  static async makeRequest(url: string, options: RequestInit = {}) {
    const token = Auth.Session.getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      // Token expired, sign out user
      await Auth.signOut();
      throw new Error('Session expired');
    }
    
    if (response.status === 403) {
      throw new Error('Insufficient permissions');
    }
    
    return response;
  }
}
```

### 5. Testing Strategies

```typescript
// Mock Auth module for testing
class MockAuth {
  private static mockUser: IAuthUser | null = null;
  
  static setMockUser(user: IAuthUser | null) {
    this.mockUser = user;
  }
  
  static getSignedUser(): IAuthUser | null {
    return this.mockUser;
  }
  
  static checkUserPermission(user: IAuthUser, resource: string, action: string): boolean {
    // Simplified mock logic
    return user?.perms?.[resource]?.includes(action) || false;
  }
}

// Test example
describe('User Permissions', () => {
  beforeEach(() => {
    MockAuth.setMockUser({
      id: 'test-user',
      username: 'testuser',
      perms: {
        documents: ['read', 'create'],
        users: ['read']
      }
    });
  });
  
  it('should allow document creation', () => {
    const user = MockAuth.getSignedUser();
    const canCreate = MockAuth.checkUserPermission(user, 'documents', 'create');
    expect(canCreate).toBe(true);
  });
  
  it('should deny user deletion', () => {
    const user = MockAuth.getSignedUser();
    const canDelete = MockAuth.checkUserPermission(user, 'users', 'delete');
    expect(canDelete).toBe(false);
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. Permission Checks Always Return False

**Problem**: User permissions are not working as expected.

**Solutions**:
```typescript
// Check if user is properly signed in
const user = Auth.getSignedUser();
console.log('Current user:', user);

// Verify permission structure
console.log('User permissions:', user?.perms);

// Check resource name matching (case-sensitive)
const hasPermission = Auth.checkUserPermission(user, 'documents', 'read');
console.log('Has permission:', hasPermission);

// Ensure interface augmentation is correct
declare module '@resk/core' {
  interface IResourceName {
    documents: 'documents'; // Must match exactly
  }
}
```

#### 2. Session Data Not Persisting

**Problem**: User session is lost on page refresh.

**Solutions**:
```typescript
// Check if session storage is available
if (typeof Storage !== 'undefined') {
  console.log('Session storage is available');
} else {
  console.error('Session storage is not supported');
}

// Verify session key generation
const sessionKey = Auth.Session.getKey('test');
console.log('Session key:', sessionKey);

// Check session data directly
const sessionData = sessionStorage.getItem('user-session');
console.log('Raw session data:', sessionData);
```

#### 3. Events Not Firing

**Problem**: Authentication events are not being triggered.

**Solutions**:
```typescript
// Verify event subscription
const unsubscribe = Auth.events.on('SIGN_IN', (user) => {
  console.log('SIGN_IN event fired:', user);
});

// Check if events are being triggered
await Auth.signIn(user, true); // Ensure triggerEvent is true

// Test event system
Auth.events.trigger('SIGN_IN', testUser);
```

#### 4. Type Errors

**Problem**: TypeScript compilation errors with interfaces.

**Solutions**:
```typescript
// Ensure proper module declaration
declare module '@resk/core' {
  interface IResources {
    documents: {
      actions: {
        read: IResourceAction;
        create: IResourceAction;
        update: IResourceAction;
      };
    };
  }
  
  interface IAuthUser {
    username: string;
    email: string;
  }
}

// Use type assertions when necessary
const user = userData as IAuthUser;

// Validate at runtime
function isIAuthUser(obj: any): obj is IAuthUser {
  return obj && typeof obj.id !== 'undefined';
}
```

### Debugging Tools

```typescript
class AuthDebugger {
  static logCurrentState() {
    console.group('Auth Debug Info');
    
    const user = Auth.getSignedUser();
    console.log('Current User:', user);
    
    if (user) {
      console.log('User ID:', user.id);
      console.log('User Permissions:', user.perms);
      console.log('User Roles:', user.roles);
      console.log('Session Created:', new Date(user.authSessionCreatedAt || 0));
    }
    
    const token = Auth.Session.getToken();
    console.log('Current Token:', token ? `${token.substring(0, 10)}...` : 'None');
    
    console.groupEnd();
  }
  
  static testPermission(resource: string, action: string) {
    const user = Auth.getSignedUser();
    if (!user) {
      console.error('No user signed in');
      return false;
    }
    
    console.group(`Permission Test: ${resource}:${action}`);
    
    // Check direct permissions
    const directPerm = user.perms?.[resource]?.includes(action);
    console.log('Direct Permission:', directPerm);
    
    // Check role permissions
    let rolePerm = false;
    if (user.roles) {
      for (const role of user.roles) {
        if (role.perms?.[resource]?.includes(action)) {
          console.log(`Role Permission (${role.name}):`, true);
          rolePerm = true;
          break;
        }
      }
    }
    
    const finalResult = Auth.checkUserPermission(user, resource, action);
    console.log('Final Result:', finalResult);
    
    console.groupEnd();
    
    return finalResult;
  }
}

// Usage
AuthDebugger.logCurrentState();
AuthDebugger.testPermission('documents', 'create');
```

---

## API Reference

### Auth Class Methods

#### Static Methods

##### `getSignedUser(): IAuthUser | null`
Retrieves the currently authenticated user from secure session storage.

**Returns**: The authenticated user object or `null` if no user is signed in.

##### `signIn(user: IAuthUser, triggerEvent?: boolean): Promise<IAuthUser>`
Authenticates a user and establishes a secure session.

**Parameters**:
- `user` - The user object to authenticate
- `triggerEvent` - Whether to broadcast authentication events (default: `true`)

**Returns**: Promise resolving to the authenticated user object.

##### `signOut(triggerEvent?: boolean): Promise<void>`
Signs out the current user and clears the session.

**Parameters**:
- `triggerEvent` - Whether to broadcast sign-out events (default: `true`)

**Returns**: Promise resolving when sign-out is complete.

##### `checkUserPermission(user: IAuthUser, resource: IResourceName, action?: IResourceActionName): boolean`
Validates whether a user has permission to perform an action on a resource.

**Parameters**:
- `user` - The user object to check
- `resource` - The resource name
- `action` - The action to check (default: "read")

**Returns**: `true` if permission is granted, `false` otherwise.

##### `checkPermission(perms: IAuthPerms, resource: IResourceName, action?: IResourceActionName): boolean`
Evaluates whether a permission object grants access to perform an action.

**Parameters**:
- `perms` - The permission object
- `resource` - The resource name
- `action` - The action to check (default: "read")

**Returns**: `true` if permission is granted, `false` otherwise.

##### `isAllowed<T>(perm: IAuthPerm<T>, user?: IAuthUser): boolean`
Determines whether a user has permission based on various permission configurations.

**Parameters**:
- `perm` - The permission configuration to evaluate
- `user` - Optional user object (uses current user if not provided)

**Returns**: `true` if permission is granted, `false` otherwise.

##### `isAllowedForAction<T>(permission: IResourceActionName<T>, action: IResourceActionName<T>): boolean`
Determines whether a specific permission action matches a requested action.

**Parameters**:
- `permission` - The permission action to check against
- `action` - The requested action to validate

**Returns**: `true` if actions match, `false` otherwise.

#### Static Properties

##### `events: IObservable<IAuthEvent>`
Observable event handler for authentication-related events.

##### `isMasterAdmin?: (user?: IAuthUser) => boolean`
Optional function to determine if a user is a master admin.

##### `Session: Session`
Provides access to the Session utility class for session management.

### Session Class Methods

##### `get(sessionName?: string, key?: string): any`
Retrieves a specific value from session data.

##### `set(sessionName?: string, key?: string | IDict, value?: any): any`
Stores data in session storage.

##### `getData(sessionName?: string): IDict`
Retrieves all session data for a specific session name.

##### `getKey(sessionName?: string): string`
Generates a unique session key.

##### `getToken(): string | undefined | null`
Retrieves the authentication token from session.

##### `setToken(token: string | null): void`
Sets the authentication token in session.

##### `getStorage(sessionName?: string): IAuthSessionStorage`
Returns a session storage object for managing session data.

### Interfaces

#### `IAuthUser`
```typescript
interface IAuthUser extends Record<string, any> {
  id: string | number;
  authSessionCreatedAt?: number;
  perms?: IAuthPerms;
  token?: string;
  roles?: IAuthRole[];
}
```

#### `IAuthRole`
```typescript
interface IAuthRole extends Record<string, any> {
  name: string;
  perms?: IAuthPerms;
}
```

#### `IAuthPerms`
```typescript
interface IAuthPerms {
  [resourceName: string]: IResourceActionName[];
}
```

#### `IAuthEvent`
```typescript
interface IAuthEvent {
  SIGN_IN: IAuthUser;
  SIGN_OUT: null;
}
```

#### `IAuthSessionStorage`
```typescript
interface IAuthSessionStorage {
  sessionName?: string;
  get(key?: string): any;
  set(key?: string | IDict, value?: any): void;
  getData(): IDict;
  getKey(): string;
}
```

---

This comprehensive guide covers all aspects of the @resk/core Auth module. For additional support or questions, please refer to the module's documentation or contact the development team.
