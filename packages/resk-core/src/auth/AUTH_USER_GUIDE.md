# Auth System User Guide

Complete reference guide for the `@resk/core` Auth class - a comprehensive authentication and authorization system with role-based access control (RBAC), encrypted session storage, and event-driven architecture.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Installation & Setup](#installation--setup)
4. [User Session Management](#user-session-management)
5. [Authentication (Sign In / Sign Out)](#authentication-sign-in--sign-out)
6. [Permission System](#permission-system)
7. [Advanced Features](#advanced-features)
8. [Events System](#events-system)
9. [Type Reference](#type-reference)
10. [Best Practices & Security](#best-practices--security)
11. [API Reference](#api-reference)
12. [Common Patterns](#common-patterns)

---

## Overview

The Auth class is a static, stateless authentication module that provides:

- **Secure Session Management**: Encrypted AES storage of user data
- **Role-Based Access Control (RBAC)**: Direct permissions + role-based permissions
- **Event Broadcasting**: Observable event system for authentication state changes
- **Token Management**: Built-in support for authentication tokens
- **Memory Caching**: Performance-optimized user caching
- **Flexible Permissions**: Support for resource-action tuples, objects, arrays, and functions
- **Master Admin Support**: Custom admin authorization logic

### Key Characteristics

- **Static API**: All methods are static; no instantiation required
- **Async-Compatible**: Supports async/await for session operations
- **Type-Safe**: Full TypeScript support with generic types
- **Error-Resilient**: Graceful error handling without throwing exceptions
- **Encrypted Storage**: AES encryption for sensitive user data
- **Performance**: Two-tier caching (memory + encrypted session storage)

---

## Core Concepts

### User Object (`IAuthUser`)

Represents an authenticated user with identity, permissions, and roles.

```typescript
interface IAuthUser {
  id: string | number; // Unique user identifier
  authSessionCreatedAt?: number; // Session creation timestamp (milliseconds)
  token?: string; // Authentication token (JWT, etc.)
  perms?: IAuthPerms; // Direct user permissions
  roles?: IAuthRole[]; // User roles with embedded permissions
  [key: string]: any; // Additional custom properties
}
```

**Example User Object:**

```typescript
const user: IAuthUser = {
  id: "user-12345",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  authSessionCreatedAt: 1699000000000,
  perms: {
    documents: ["read", "create"],
    profile: ["read", "update"],
  },
  roles: [
    {
      name: "editor",
      perms: {
        articles: ["read", "create", "update", "publish"],
        comments: ["read", "delete"],
      },
    },
  ],
};
```

### Permission Structure (`IAuthPerms`)

Maps resources to arrays of allowed actions.

```typescript
interface IAuthPerms {
  [resource: IResourceName]: IResourceActionName[];
}

// Example:
const permissions: IAuthPerms = {
  documents: ["read", "create", "update", "delete"],
  users: ["read", "update"],
  reports: ["read"],
  system: ["all"], // Special "all" permission grants universal access
};
```

### Role Structure (`IAuthRole`)

Groups related permissions with a name.

```typescript
interface IAuthRole {
  name: string; // Role identifier
  perms: IAuthPerms; // Permissions granted by this role
}

// Example:
const editorRole: IAuthRole = {
  name: "editor",
  perms: {
    documents: ["read", "create", "update"],
    comments: ["read", "delete"],
  },
};
```

### Resource & Action Names

Resource names and action names are validated strings representing different entities and operations:

```typescript
// Common resource names
type IResourceName = "documents" | "users" | "reports" | "system" | ...;

// Common action names
type IResourceActionName = "read" | "create" | "update" | "delete" | "publish" | "all" | ...;

// Special "all" action grants universal access to a resource
```

---

## Installation & Setup

### Basic Import

```typescript
import { Auth, IAuthUser, IAuthPerms } from "@resk/core";
```

### Setting Up Master Admin Check

Define custom logic to determine if a user is a master admin:

```typescript
// Option 1: Check user ID
Auth.isMasterAdmin = (user) => {
  return user?.id === "admin-super-user";
};

// Option 2: Check user property
Auth.isMasterAdmin = (user) => {
  return user?.role === "superadmin";
};

// Option 3: Check against database/service
Auth.isMasterAdmin = async (user) => {
  return await adminService.isAdmin(user?.id);
};
```

---

## User Session Management

### Retrieving Current User

Get the currently authenticated user:

```typescript
// Retrieve current user from secure session
const user = Auth.getSignedUser();

if (user) {
  console.log(`Welcome, ${user.id}!`);
  console.log(`Session created at: ${new Date(user.authSessionCreatedAt)}`);
} else {
  console.log("No user is currently signed in");
}
```

**How it Works:**

1. Checks memory cache first (`localUserRef`)
2. If not cached, retrieves from encrypted session storage
3. Decrypts and parses user data
4. Returns `null` if no user or decryption fails
5. Logs errors without throwing exceptions

**Performance Notes:**

- First call after page load: Requires decryption (slower)
- Subsequent calls: Returns cached data (faster)
- Cache is cleared when user signs out

### Storing User Session

Store user data in encrypted session:

```typescript
// Store user with event triggering
const user: IAuthUser = {
  id: "user-123",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  perms: { documents: ["read", "create"] },
  roles: [{ name: "editor", perms: { articles: ["publish"] } }],
};

// With event triggering (triggers SIGN_IN if successful)
await Auth.setSignedUser(user, true);

// Silent update (no event triggering)
await Auth.setSignedUser(user, false);

// Clear user session (triggers SIGN_OUT if true)
await Auth.setSignedUser(null, true);
```

**What Happens:**

1. User data is automatically timestamped with `authSessionCreatedAt`
2. User object is encrypted using AES encryption
3. Encrypted data is stored in session storage
4. Local memory cache is updated
5. Authentication events are triggered if `triggerEvent=true`
6. Returns promise that resolves when storage operation completes

### Token Management

```typescript
// Get current user's token
const token = Auth.Session.getToken();
console.log(`Token: ${token}`);

// Set/Update token for current user
Auth.Session.setToken("new-jwt-token-value");

// Remove token
Auth.Session.setToken(null);
```

### Session Data (Namespaced Storage)

The Auth class provides a local Session class for storing namespaced session data:

```typescript
// Get namespaced session storage
const sessionStorage = Auth.Session.getStorage("userPreferences");

// Set values
sessionStorage.set("theme", "dark");
sessionStorage.set("language", "en");
sessionStorage.set({ notifications: true, autoSave: false });

// Get values
const theme = sessionStorage.get("theme");

// Get all data
const allData = sessionStorage.getData();

// Get session key
const key = sessionStorage.getKey();
```

---

## Authentication (Sign In / Sign Out)

### Sign In

Authenticate a user:

```typescript
// Authenticate a user
async function handleLogin(credentials: LoginCredentials) {
  try {
    const user: IAuthUser = await authenticateWithBackend(credentials);

    // Sign in and trigger events
    await Auth.signIn(user, true);

    console.log("User signed in successfully");
    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("Sign in failed:", error);
    showErrorMessage("Authentication failed");
  }
}

// Sign in without triggering events (silent)
async function silentSignIn(user: IAuthUser) {
  await Auth.signIn(user, false);
}
```

**Requirements:**

- User object must be a valid object (not null/undefined)
- User object must have at least an `id` property
- Will throw error if user is invalid

**Return Value:** The stored user object

### Sign Out

Logout the current user:

```typescript
// Standard sign out with event triggering
async function handleLogout() {
  await Auth.signOut(true);

  console.log("User signed out");
  // Clear state
  clearUserData();
  // Redirect to login
  router.push("/login");
}

// Silent sign out (no events)
async function silentLogout() {
  await Auth.signOut(false);
}
```

**What Happens:**

1. Clears user from session storage
2. Clears memory cache
3. Triggers SIGN_OUT event if `triggerEvent=true`
4. Resolves with `null`

**Safe to Call:** Yes, safe to call even if no user is signed in

---

## Permission System

### Understanding Permission Hierarchy

Permissions work on three levels (checked in order):

1. **Direct User Permissions** (`user.perms`)
2. **Role-Based Permissions** (`user.roles[].perms`)
3. **Master Admin Override** (custom `isMasterAdmin` function)

**Priority Rules:**

- Direct user permissions don't restrict role permissions
- Both direct and role permissions are combined (OR logic)
- Master admin bypasses all permission checks
- "all" permission grants universal access

### Checking Permissions

#### 1. Check User Permissions (High-Level)

Check if a user has permission to perform an action:

```typescript
const user = Auth.getSignedUser();

// Check if user can read documents
if (Auth.checkUserPermission(user, "documents", "read")) {
  showDocuments();
}

// Default action is "read" if not specified
if (Auth.checkUserPermission(user, "documents")) {
  showDocuments();
}

// Check multiple permissions
const canEdit = Auth.checkUserPermission(user, "documents", "update");
const canDelete = Auth.checkUserPermission(user, "documents", "delete");
const canPublish = Auth.checkUserPermission(user, "articles", "publish");

if (canEdit && canDelete) {
  showAdvancedTools();
}
```

**How it Works:**

1. Checks invalid user → returns `false`
2. Checks direct user permissions
3. If not found, checks all roles
4. Returns `true` if permission found, `false` otherwise

#### 2. Check Permission Objects (Low-Level)

Check permissions directly against a permission object:

```typescript
const perms: IAuthPerms = {
  documents: ["read", "create", "update"],
  users: ["read"],
  system: ["all"],
};

// Check specific permission
const canRead = Auth.checkPermission(perms, "documents", "read"); // true
const canDelete = Auth.checkPermission(perms, "documents", "delete"); // false

// Default action is "read"
const canReadUsers = Auth.checkPermission(perms, "users"); // true

// "all" permission grants access to anything
const canConfigSystem = Auth.checkPermission(perms, "system", "anything"); // true
```

**Case-Insensitive:**

```typescript
const perms: IAuthPerms = {
  documents: ["read", "create"],
};

Auth.checkPermission(perms, "documents", "read"); // true
Auth.checkPermission(perms, "DOCUMENTS", "READ"); // true
Auth.checkPermission(perms, "Documents", "Read"); // true
```

#### 3. Check Action Matching (Utility)

Compare permission actions:

```typescript
// Exact case-insensitive matching
Auth.isAllowedForAction("read", "read"); // true
Auth.isAllowedForAction("READ", "read"); // true
Auth.isAllowedForAction("Read", "READ"); // true
Auth.isAllowedForAction("  read  ", "READ"); // true (whitespace trimmed)
Auth.isAllowedForAction("read", "write"); // false
Auth.isAllowedForAction("", "read"); // false
```

### Permission Validation Examples

#### Example 1: Simple Permission Check

```typescript
function editDocument(docId: string) {
  const user = Auth.getSignedUser();

  if (!user || !Auth.checkUserPermission(user, "documents", "update")) {
    throw new Error("Permission denied: cannot edit documents");
  }

  // Proceed with edit
}
```

#### Example 2: Feature Flag Based on Permissions

```typescript
function DocumentToolbar() {
  const user = Auth.getSignedUser();
  if (!user) return null;

  return (
    <div className="toolbar">
      {Auth.checkUserPermission(user, "documents", "create") && (
        <button onClick={createDocument}>Create</button>
      )}
      {Auth.checkUserPermission(user, "documents", "update") && (
        <button onClick={editDocument}>Edit</button>
      )}
      {Auth.checkUserPermission(user, "documents", "delete") && (
        <button onClick={deleteDocument}>Delete</button>
      )}
    </div>
  );
}
```

#### Example 3: Complex Role-Based Permissions

```typescript
const adminUser: IAuthUser = {
  id: "admin-001",
  perms: { profile: ["read", "update"] },
  roles: [
    {
      name: "super_admin",
      perms: {
        users: ["all"],
        system: ["all"],
        reports: ["all"],
      },
    },
    {
      name: "content_manager",
      perms: {
        documents: ["read", "create", "update", "delete"],
        media: ["upload", "delete"],
      },
    },
  ],
};

// Check various permissions
Auth.checkUserPermission(adminUser, "users", "delete"); // true (super_admin role)
Auth.checkUserPermission(adminUser, "documents", "create"); // true (content_manager role)
Auth.checkUserPermission(adminUser, "profile", "update"); // true (direct permission)
Auth.checkUserPermission(adminUser, "billing", "read"); // false (no permission)
```

---

## Advanced Features

### Master Admin Override

Master admins bypass all permission checks:

```typescript
// Define master admin logic
Auth.isMasterAdmin = (user) => {
  return user?.id === "superadmin" || user?.role === "administrator";
};

// Now master admins have access to everything
const canDoAnything = Auth.isAllowed(["documents", "delete"], masterAdminUser); // true
```

### Flexible Permission Checking with `isAllowed`

The `isAllowed` method supports multiple permission formats:

```typescript
const user = Auth.getSignedUser();

// Format 1: Boolean (always returns that value)
Auth.isAllowed(true, user); // true
Auth.isAllowed(false, user); // false

// Format 2: Function (custom logic)
Auth.isAllowed((u) => u.id === "user-123", user);

// Format 3: Tuple array [resource, action]
Auth.isAllowed(["documents", "read"], user);
Auth.isAllowed(["documents", "update"], user);

// Format 4: Tuple object {resourceName, action}
Auth.isAllowed({ resourceName: "documents", action: "read" }, user);

// Format 5: Array of tuples (OR logic - any permission passes)
Auth.isAllowed(
  [
    ["documents", "read"],
    { resourceName: "articles", action: "publish" },
    ["reports", "export"],
  ],
  user
);
```

### Using Currently Signed User

When no user is provided, uses current signed user:

```typescript
// Set up permissions
Auth.setSignedUser({ id: "user-1", perms: { documents: ["read"] } }, false);

// These are equivalent:
const can1 = Auth.isAllowed(["documents", "read"], Auth.getSignedUser());
const can2 = Auth.isAllowed(["documents", "read"]); // Uses current user automatically
```

---

## Events System

The Auth class provides an Observable event system for authentication state changes.

### Event Types

```typescript
type IAuthEvent = "SIGN_IN" | "SIGN_OUT" | "SIGN_UP";
```

### Listening to Events

```typescript
// Listen to SIGN_IN event
Auth.events.on("SIGN_IN", (user: IAuthUser) => {
  console.log(`User signed in: ${user.id}`);
  updateUI(user);
  trackLogin(user.id);
});

// Listen to SIGN_OUT event
Auth.events.on("SIGN_OUT", (user: IAuthUser | null) => {
  console.log("User signed out");
  clearUIState();
  redirectToLogin();
});

// Listen to SIGN_UP event
Auth.events.on("SIGN_UP", (user: IAuthUser) => {
  console.log(`New user registered: ${user.id}`);
  sendWelcomeEmail(user);
});
```

### Multiple Listeners

```typescript
// Add multiple listeners
const loginHandler1 = (user) => {
  /* ... */
};
const loginHandler2 = (user) => {
  /* ... */
};

Auth.events.on("SIGN_IN", loginHandler1);
Auth.events.on("SIGN_IN", loginHandler2);

// Both will be called
await Auth.signIn(user);
```

### Event Triggering

Events are triggered only when you explicitly set `triggerEvent=true`:

```typescript
// Triggers event
await Auth.setSignedUser(user, true); // Triggers SIGN_IN
await Auth.setSignedUser(null, true); // Triggers SIGN_OUT

// Silent updates (no events)
await Auth.setSignedUser(user, false); // No event
```

### Practical Event Usage

```typescript
// Setup event listeners on app initialization
export function setupAuthListeners() {
  Auth.events.on("SIGN_IN", (user) => {
    // Update UI
    updateUserMenu(user);

    // Initialize user data
    loadUserPreferences(user.id);

    // Analytics
    trackEvent("user_login", { userId: user.id });
  });

  Auth.events.on("SIGN_OUT", () => {
    // Clear UI
    clearUserMenu();
    clearNotifications();

    // Clear user data
    resetAppState();

    // Analytics
    trackEvent("user_logout");
  });
}

// Call during app initialization
setupAuthListeners();
```

---

## Type Reference

### IAuthUser

```typescript
interface IAuthUser extends Record<string, any> {
  id: string | number; // Unique identifier
  authSessionCreatedAt?: number; // Session timestamp
  token?: string; // Auth token (JWT, etc.)
  perms?: IAuthPerms; // Direct permissions
  roles?: IAuthRole[]; // User roles
}
```

### IAuthPerms

```typescript
interface IAuthPerms {
  [resource: string]: string[]; // Maps resource to allowed actions
}
```

### IAuthRole

```typescript
interface IAuthRole {
  name: string; // Role name
  perms: IAuthPerms; // Role permissions
}
```

### IAuthSessionStorage

```typescript
interface IAuthSessionStorage {
  sessionName?: string;
  get(key?: string): any;
  set(key?: string | IDict, value?: any): any;
  getData(): IDict;
  getKey(): string;
}
```

---

## Best Practices & Security

### Security Guidelines

#### 1. Always Validate User Input

```typescript
// ❌ Don't do this
const user = JSON.parse(userInput);
await Auth.signIn(user);

// ✅ Do this
const user = validateUserObject(userInput);
if (!user) {
  throw new Error("Invalid user object");
}
await Auth.signIn(user);
```

#### 2. Use HTTPS for Token Transmission

```typescript
// ❌ Don't send tokens over HTTP
fetch("http://api.example.com/data", {
  headers: { Authorization: `Bearer ${token}` },
});

// ✅ Use HTTPS
fetch("https://api.example.com/data", {
  headers: { Authorization: `Bearer ${token}` },
});
```

#### 3. Validate on Backend

```typescript
// ❌ Don't rely on client-side checks alone
if (Auth.checkUserPermission(user, "delete", "users")) {
  deleteUser(); // UNSAFE: No server-side validation
}

// ✅ Validate on backend too
if (Auth.checkUserPermission(user, "users", "delete")) {
  const response = await api.deleteUser(userId); // Server validates again
  if (response.ok) {
    updateUI();
  }
}
```

#### 4. Set Reasonable Session Timeouts

```typescript
// Track session creation time
const user = Auth.getSignedUser();
const sessionAge = Date.now() - (user?.authSessionCreatedAt || 0);
const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours

if (sessionAge > MAX_SESSION_AGE) {
  await Auth.signOut(true);
  showSessionExpiredMessage();
}
```

#### 5. Don't Store Sensitive Data in Perms

```typescript
// ❌ Don't store sensitive data
const user: IAuthUser = {
  id: "user-1",
  perms: { documents: ["read"] },
  ssn: "123-45-6789", // BAD
  password: "hashed-password", // BAD
};

// ✅ Store only necessary auth data
const user: IAuthUser = {
  id: "user-1",
  perms: { documents: ["read"] },
  token: "jwt-token", // OK
};
```

### Performance Tips

#### 1. Cache Permission Checks

```typescript
// ❌ Check on every render
function Header() {
  const canCreateDocs = Auth.checkUserPermission(Auth.getSignedUser(), "documents", "create");
  return <button disabled={!canCreateDocs}>Create</button>;
}

// ✅ Memoize permissions
const userCapabilities = useMemo(() => ({
  canCreateDocs: Auth.checkUserPermission(Auth.getSignedUser(), "documents", "create"),
  canEditDocs: Auth.checkUserPermission(Auth.getSignedUser(), "documents", "update"),
  canDeleteDocs: Auth.checkUserPermission(Auth.getSignedUser(), "documents", "delete")
}), [userId]);
```

#### 2. Use Direct Permissions for Frequent Checks

```typescript
// Less efficient for frequent checks
for (let i = 0; i < 10000; i++) {
  Auth.checkUserPermission(user, "documents", "read");
}

// More efficient
const hasReadPermission = Auth.checkPermission(user.perms, "documents", "read");
for (let i = 0; i < 10000; i++) {
  if (hasReadPermission) {
    /* ... */
  }
}
```

#### 3. Flatten Role Permissions When Possible

```typescript
// Precompute combined permissions
function getFlattenedPermissions(user: IAuthUser): IAuthPerms {
  const combined: IAuthPerms = { ...user.perms };

  for (const role of user.roles || []) {
    for (const [resource, actions] of Object.entries(role.perms)) {
      if (!combined[resource]) combined[resource] = [];
      combined[resource].push(...actions);
    }
  }

  return combined;
}

// Use flattened permissions for checking
const permissions = getFlattenedPermissions(user);
const canRead = Auth.checkPermission(permissions, "documents", "read");
```

---

## API Reference

### Session Management

#### `Auth.getSignedUser(): IAuthUser | null`

Retrieves the currently authenticated user.

**Returns:** User object or null

**Throws:** None (graceful error handling)

```typescript
const user = Auth.getSignedUser();
```

---

#### `Auth.setSignedUser(u: IAuthUser | null, triggerEvent?: boolean): Promise<void>`

Stores a user in encrypted session storage.

**Parameters:**

- `u`: User object to store, or null to clear
- `triggerEvent`: Whether to trigger SIGN_IN/SIGN_OUT events (default: true)

**Returns:** Promise

```typescript
await Auth.setSignedUser(user, true);
```

---

### Authentication

#### `Auth.signIn(user: IAuthUser, triggerEvent?: boolean): Promise<IAuthUser>`

Authenticate a user and store in session.

**Parameters:**

- `user`: User object to authenticate
- `triggerEvent`: Whether to trigger SIGN_IN event (default: true)

**Returns:** Promise resolving to user object

**Throws:** Error if user is invalid

```typescript
const user = await Auth.signIn(authenticatedUser);
```

---

#### `Auth.signOut(triggerEvent?: boolean): Promise<IAuthUser | null>`

Sign out the current user.

**Parameters:**

- `triggerEvent`: Whether to trigger SIGN_OUT event (default: true)

**Returns:** Promise resolving to null

```typescript
await Auth.signOut(true);
```

---

### Permission Checking

#### `Auth.checkUserPermission<ResourceName extends IResourceName>(user: IAuthUser, resource: ResourceName, action?: IResourceActionName): boolean`

Check if user has permission for resource/action.

**Parameters:**

- `user`: User object to check
- `resource`: Resource name
- `action`: Action name (default: "read")

**Returns:** boolean

```typescript
const canRead = Auth.checkUserPermission(user, "documents", "read");
```

---

#### `Auth.checkPermission<ResourceName extends IResourceName>(perms: IAuthPerms, resource: ResourceName, action?: IResourceActionName): boolean`

Check if permission object allows resource/action.

**Parameters:**

- `perms`: Permission object
- `resource`: Resource name
- `action`: Action name (default: "read")

**Returns:** boolean

```typescript
const allowed = Auth.checkPermission(perms, "documents", "read");
```

---

#### `Auth.isAllowed<ResourceName extends IResourceName>(perm: IAuthPermissionCheck | IAuthPermissionCheck[], user?: IAuthUser): boolean`

Comprehensive permission checking with multiple formats.

**Parameters:**

- `perm`: Permission check (boolean, function, tuple, object, or array)
- `user`: User to check (optional, defaults to current user)

**Returns:** boolean

```typescript
const allowed = Auth.isAllowed(["documents", "read"], user);
```

---

#### `Auth.isAllowedForAction<ResourceName extends IResourceName>(permAction: IResourceActionName, action: IResourceActionName): boolean`

Compare two action strings for equality.

**Parameters:**

- `permAction`: Permission action
- `action`: Requested action

**Returns:** boolean

```typescript
const matches = Auth.isAllowedForAction("read", "read");
```

---

### Token Management

#### `Auth.Session.getToken(): string | undefined | null`

Get current user's authentication token.

**Returns:** Token string or null

```typescript
const token = Auth.Session.getToken();
```

---

#### `Auth.Session.setToken(token: string | null): void`

Set authentication token for current user.

**Parameters:**

- `token`: Token value or null to remove

```typescript
Auth.Session.setToken(newToken);
```

---

### Session Storage

#### `Auth.Session.getStorage(sessionName?: string): IAuthSessionStorage`

Get namespaced session storage interface.

**Parameters:**

- `sessionName`: Optional session namespace

**Returns:** Session storage object

```typescript
const storage = Auth.Session.getStorage("userPrefs");
```

---

### Events

#### `Auth.events.on(event: IAuthEvent, callback: (user: IAuthUser | null) => void): void`

Listen to authentication events.

**Parameters:**

- `event`: Event type ("SIGN_IN", "SIGN_OUT", "SIGN_UP")
- `callback`: Event handler function

```typescript
Auth.events.on("SIGN_IN", (user) => {
  console.log(`Welcome, ${user.id}!`);
});
```

---

#### `Auth.events.offAll(): void`

Remove all event listeners.

```typescript
Auth.events.offAll();
```

---

### Custom Logic

#### `Auth.isMasterAdmin?: (user?: IAuthUser) => boolean`

Custom function to determine if user is master admin.

**Parameters:**

- `user`: User to check (optional)

**Returns:** boolean

```typescript
Auth.isMasterAdmin = (user) => user?.id === "admin";
```

---

## Common Patterns

### Pattern 1: Authentication Flow

```typescript
async function handleLogin(email: string, password: string) {
  try {
    // Authenticate with backend
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const { user } = await response.json();

    // Store in session with events
    await Auth.signIn(user);

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    showError("Login failed");
  }
}

async function handleLogout() {
  await Auth.signOut();
  router.push("/login");
}
```

### Pattern 2: Protected Routes

```typescript
function ProtectedRoute({ component: Component, requiredPermission }) {
  const user = Auth.getSignedUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission &&
      !Auth.checkUserPermission(user, requiredPermission[0], requiredPermission[1])) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
}

// Usage
<ProtectedRoute
  component={DocumentsPage}
  requiredPermission={["documents", "read"]}
/>
```

### Pattern 3: Conditional UI Rendering

```typescript
function DocumentActions() {
  const user = Auth.getSignedUser();
  if (!user) return null;

  return (
    <div>
      {Auth.checkUserPermission(user, "documents", "read") && (
        <button onClick={viewDocuments}>View</button>
      )}
      {Auth.checkUserPermission(user, "documents", "create") && (
        <button onClick={createDocument}>Create</button>
      )}
      {Auth.checkUserPermission(user, "documents", "update") && (
        <button onClick={editDocument}>Edit</button>
      )}
      {Auth.checkUserPermission(user, "documents", "delete") && (
        <button onClick={deleteDocument}>Delete</button>
      )}
    </div>
  );
}
```

### Pattern 4: Backend Permission Guard

```typescript
// Express middleware
function requirePermission(resource: string, action: string) {
  return (req, res, next) => {
    const user = Auth.getSignedUser();

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!Auth.checkUserPermission(user, resource as any, action as any)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}

// Usage
app.get("/api/documents", requirePermission("documents", "read"), getDocuments);
app.post(
  "/api/documents",
  requirePermission("documents", "create"),
  createDocument
);
app.put(
  "/api/documents/:id",
  requirePermission("documents", "update"),
  updateDocument
);
app.delete(
  "/api/documents/:id",
  requirePermission("documents", "delete"),
  deleteDocument
);
```

### Pattern 5: Permission Batching

```typescript
function getUserCapabilities(user: IAuthUser) {
  return {
    // Document permissions
    canReadDocs: Auth.checkUserPermission(user, "documents", "read"),
    canCreateDocs: Auth.checkUserPermission(user, "documents", "create"),
    canEditDocs: Auth.checkUserPermission(user, "documents", "update"),
    canDeleteDocs: Auth.checkUserPermission(user, "documents", "delete"),

    // User permissions
    canManageUsers: Auth.checkUserPermission(user, "users", "all"),
    canEditUsers: Auth.checkUserPermission(user, "users", "update"),

    // Admin permissions
    canAccessSettings: Auth.checkUserPermission(user, "system", "configure"),
    isAdmin: Auth._isMasterAdmin(user)
  };
}

// Usage in component
function Dashboard() {
  const user = Auth.getSignedUser();
  const capabilities = useMemo(() => getUserCapabilities(user), [user?.id]);

  return (
    <div>
      {capabilities.canReadDocs && <DocumentsSection />}
      {capabilities.canManageUsers && <UsersSection />}
      {capabilities.isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Pattern 6: Updating User Permissions

```typescript
async function updateUserRole(user: IAuthUser, newRole: IAuthRole) {
  // Update user object
  const updatedUser = {
    ...user,
    roles: [...(user.roles || []), newRole],
  };

  // Store silently (don't trigger events)
  await Auth.setSignedUser(updatedUser, false);

  // Or with notification
  await Auth.setSignedUser(updatedUser, true); // Triggers SIGN_IN event
}
```

### Pattern 7: Session Recovery

```typescript
async function recoverSession() {
  const user = Auth.getSignedUser();

  if (user) {
    return user; // Session exists
  }

  // Try to recover from backend
  try {
    const response = await fetch("/api/me");
    if (response.ok) {
      const user = await response.json();
      await Auth.setSignedUser(user, false);
      return user;
    }
  } catch (error) {
    console.error("Session recovery failed:", error);
  }

  return null;
}
```

### Pattern 8: Event-Driven State Management

```typescript
class AuthStore {
  private user: IAuthUser | null = null;
  private listeners: Set<Function> = new Set();

  constructor() {
    this.setupAuthListeners();
  }

  private setupAuthListeners() {
    Auth.events.on("SIGN_IN", (user) => {
      this.user = user;
      this.notifyListeners();
    });

    Auth.events.on("SIGN_OUT", () => {
      this.user = null;
      this.notifyListeners();
    });
  }

  getUser() {
    return this.user;
  }

  subscribe(callback: Function) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.user));
  }
}

// Usage
const authStore = new AuthStore();
authStore.subscribe((user) => {
  console.log("User changed:", user);
});
```

---

## Troubleshooting

### Issue: User not persisting after page reload

**Cause:** Session storage not enabled or cleared

**Solution:**

```typescript
// Check if user can be retrieved after reload
const user = Auth.getSignedUser();
if (!user) {
  console.warn("Session not persisted");
  // Recover from backend
  const recoveredUser = await fetchCurrentUser();
  if (recoveredUser) {
    await Auth.setSignedUser(recoveredUser, false);
  }
}
```

### Issue: Permissions not working correctly

**Cause:** Permission structure incorrect or case mismatch

**Solution:**

```typescript
// Verify permission structure
const user = Auth.getSignedUser();
console.log("User perms:", user?.perms);
console.log("User roles:", user?.roles);

// Check case-insensitive matching
Auth.checkUserPermission(user, "documents", "read"); // Should work
Auth.checkUserPermission(user, "DOCUMENTS", "READ"); // Should also work
```

### Issue: Events not triggering

**Cause:** `triggerEvent` parameter set to false

**Solution:**

```typescript
// Make sure to pass true
await Auth.setSignedUser(user, true); // Correct: triggers SIGN_IN
await Auth.signIn(user); // Correct: triggers SIGN_IN by default
```

### Issue: Master admin always getting access denied

**Cause:** `isMasterAdmin` function not set or returning false

**Solution:**

```typescript
// Define master admin logic before checking
Auth.isMasterAdmin = (user) => user?.id === "admin";

// Now master admin checks should work
const allowed = Auth.isAllowed(["documents", "delete"], adminUser); // Should be true
```

---

## Migration Guide

### From Custom Auth System

```typescript
// Old code
if (currentUser && currentUser.permissions.includes("read:documents")) {
  showDocuments();
}

// New code
if (Auth.checkUserPermission(Auth.getSignedUser(), "documents", "read")) {
  showDocuments();
}
```

### Adding Roles to Existing System

```typescript
// Old: Only direct permissions
const user: IAuthUser = {
  id: "user-1",
  perms: { documents: ["read", "create"] },
};

// New: Add roles
const user: IAuthUser = {
  id: "user-1",
  perms: { profile: ["read", "update"] },
  roles: [
    {
      name: "editor",
      perms: { documents: ["read", "create", "update", "delete"] },
    },
  ],
};
```

---

## Contributing & Feedback

For issues, improvements, or feedback regarding the Auth system, please refer to the project's contribution guidelines.

---

## Version

**Auth System Version:** 1.0.0+

**Last Updated:** November 2024

---

## License

This documentation is part of the @resk/core package.
