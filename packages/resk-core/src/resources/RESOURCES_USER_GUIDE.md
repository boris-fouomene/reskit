# Resource System - Comprehensive User Guide

Complete guide to using the Resource system for managing data-driven operations with permission control, i18n support, and event handling.

**Table of Contents:**

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Getting Started](#getting-started)
4. [CRUD Operations](#crud-operations)
5. [Authorization & Permissions](#authorization--permissions)
6. [Data Service Integration](#data-service-integration)
7. [Translations & i18n](#translations--i18n)
8. [Lifecycle Hooks](#lifecycle-hooks)
9. [Events System](#events-system)
10. [Metadata & Fields](#metadata--fields)
11. [Advanced Patterns](#advanced-patterns)
12. [API Reference](#api-reference)

---

## Overview

The **Resource** system is an abstract, generic class that provides a standardized way to manage data entities with:

- ✅ **CRUD Operations** - Create, Read, Update, Delete (single and batch)
- ✅ **Authorization** - Permission-based access control integrated with Auth system
- ✅ **Internationalization** - Full i18n support for labels, titles, and error messages
- ✅ **Lifecycle Hooks** - Before/after callbacks for custom logic
- ✅ **Events** - Observable event system for reactive updates
- ✅ **Metadata Management** - Flexible resource configuration
- ✅ **Data Service** - Abstract interface for pluggable data providers

### Key Characteristics

- **Generic Types**: `Resource<Name, DataType, PrimaryKeyType, EventType>`
- **Abstract**: Requires implementing `getDataService()` method
- **Automatic i18n Integration**: Listens to locale and translation changes
- **Permission-Based**: All CRUD operations check authorization first
- **Event-Driven**: Automatic event triggering on all operations

---

## Core Concepts

### 1. Resource Name

The unique identifier for a resource within your application:

```typescript
type IResourceName = "users" | "products" | "articles" | string;
```

- Used for translations, permissions, and resource lookup
- Should be lowercase and unique
- Example: `"users"`, `"products"`, `"articles"`

### 2. Data Type

The TypeScript type representing the data structure:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

class UserResource extends Resource<"users", User> {
  // ...
}
```

### 3. Primary Key Type

The type of the unique identifier:

```typescript
class UserResource extends Resource<"users", User, string> {
  // ID is string
}

class CompanyResource extends Resource<"companies", Company, number> {
  // ID is number
}
```

### 4. Data Service

An interface that handles the actual data operations:

```typescript
interface IResourceDataService<DataType, PrimaryKeyType> {
  create(record: Partial<DataType>): Promise<DataType>;
  read(id: PrimaryKeyType): Promise<DataType | null>;
  update(id: PrimaryKeyType, data: Partial<DataType>): Promise<DataType>;
  delete(id: PrimaryKeyType): Promise<boolean>;
  find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  // ... and more
}
```

---

## Getting Started

### Step 1: Define Your Data Type

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  createdAt: Date;
  updatedAt?: Date;
}
```

### Step 2: Create a Data Service

Implement the `IResourceDataService` interface:

```typescript
import { IResourceDataService, IResourceQueryOptions } from "@/resources";

class UserDataService implements IResourceDataService<User, string> {
  private users: Map<string, User> = new Map();

  find(options?: IResourceQueryOptions<User>): Promise<User[]> {
    return Promise.resolve(Array.from(this.users.values()));
  }

  findOne(id: string): Promise<User | null> {
    return Promise.resolve(this.users.get(id) || null);
  }

  findOneOrFail(id: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);
    return Promise.resolve(user);
  }

  create(record: Partial<User>): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = {
      id,
      name: record.name || "",
      email: record.email || "",
      role: record.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return Promise.resolve(user);
  }

  update(id: string, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);

    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return Promise.resolve(updated);
  }

  delete(id: string): Promise<boolean> {
    const existed = this.users.has(id);
    this.users.delete(id);
    return Promise.resolve(existed);
  }

  findAndCount(
    options?: IResourceQueryOptions<User>
  ): Promise<[User[], number]> {
    const data = Array.from(this.users.values());
    return Promise.resolve([data, data.length]);
  }

  findAndPaginate(
    options?: IResourceQueryOptions<User>
  ): Promise<IResourcePaginatedResult<User>> {
    const data = Array.from(this.users.values());
    return Promise.resolve({
      data,
      total: data.length,
      count: data.length,
    });
  }

  createMany(data: Partial<User>[]): Promise<User[]> {
    return Promise.all(data.map((item) => this.create(item)));
  }

  updateMany(criteria: any, data: Partial<User>): Promise<number> {
    let count = 0;
    this.users.forEach((user) => {
      this.users.set(user.id, { ...user, ...data });
      count++;
    });
    return Promise.resolve(count);
  }

  deleteMany(criteria: any): Promise<number> {
    const count = this.users.size;
    this.users.clear();
    return Promise.resolve(count);
  }

  count(options?: IResourceQueryOptions<User>): Promise<number> {
    return Promise.resolve(this.users.size);
  }

  exists(id: string): Promise<boolean> {
    return Promise.resolve(this.users.has(id));
  }
}
```

### Step 3: Create a Resource Class

Extend the `Resource` class:

```typescript
import { Resource, ResourceMetadata } from "@/resources";

@ResourceMetadata({
  name: "users" as IResourceName,
  label: "Users",
  title: "User Management System",
  actions: {
    create: { label: "Create User", title: "Create a new user" },
    read: { label: "View User", title: "View user details" },
    update: { label: "Update User", title: "Modify user information" },
    delete: { label: "Delete User", title: "Remove user from system" },
  },
  instanciate: false, // Don't auto-instantiate
})
class UserResource extends Resource<"users", User, string> {
  name: IResourceName = "users";
  label = "Users";
  title = "User Management System";

  private dataService = new UserDataService();

  getDataService(): IResourceDataService<User, string> {
    return this.dataService;
  }
}

// Instantiate the resource
const userResource = new UserResource();
```

---

## CRUD Operations

### CREATE - Single Record

```typescript
// Basic create
const newUser = await userResource.create({
  name: "John Doe",
  email: "john@example.com",
  role: "user",
});
console.log(newUser.id); // Auto-generated ID

// After authorization check, triggers:
// 1. beforeCreate hook
// 2. Data service create()
// 3. afterCreate hook
// 4. "create" event
```

### CREATE - Multiple Records

```typescript
const users = await userResource.createMany([
  { name: "John", email: "john@example.com", role: "user" },
  { name: "Jane", email: "jane@example.com", role: "admin" },
  { name: "Bob", email: "bob@example.com", role: "guest" },
]);

console.log(users.length); // 3

// Lifecycle:
// 1. beforeCreateMany hook
// 2. Data service createMany()
// 3. afterCreateMany hook
// 4. "createMany" event
```

### READ - Find All

```typescript
const allUsers = await userResource.find();
console.log(allUsers.length);

// With query options
const allUsers = await userResource.find({
  limit: 10,
  skip: 0,
  sort: { createdAt: -1 },
});
```

### READ - Find One

```typescript
const user = await userResource.findOne("user-123");
if (user) {
  console.log(user.name);
} else {
  console.log("User not found");
}

// Or with query options
const user = await userResource.findOne({
  filter: { email: "john@example.com" },
});
```

### READ - Find One or Fail

Throws an error if not found:

```typescript
try {
  const user = await userResource.findOneOrFail("user-123");
  console.log(user.name);
} catch (error) {
  console.error(error); // "User user-123 not found" (localized)
}
```

### UPDATE - Single Record

```typescript
const updated = await userResource.update("user-123", {
  name: "John Updated",
  role: "admin",
});

console.log(updated.updatedAt); // Current timestamp

// Lifecycle:
// 1. beforeUpdate hook
// 2. Data service update()
// 3. afterUpdate hook
// 4. "update" event
```

### UPDATE - Multiple Records

```typescript
const affectedCount = await userResource.updateMany(
  { role: "guest" }, // criteria
  { role: "user" } // new data
);

console.log(affectedCount); // Number of updated records

// Lifecycle:
// 1. beforeUpdateMany hook
// 2. Data service updateMany()
// 3. afterUpdateMany hook
// 4. "updateMany" event
```

### DELETE - Single Record

```typescript
const wasDeleted = await userResource.delete("user-123");
console.log(wasDeleted); // true if existed, false otherwise

// Lifecycle:
// 1. beforeDelete hook
// 2. Data service delete()
// 3. afterDelete hook
// 4. "delete" event
```

### DELETE - Multiple Records

```typescript
const affectedCount = await userResource.deleteMany({
  role: "guest", // criteria
});

console.log(affectedCount); // Number of deleted records
```

### COUNT & EXISTS

```typescript
// Count total records
const totalCount = await userResource.count();
console.log(totalCount);

// Count with filters
const adminCount = await userResource.count({
  filter: { role: "admin" },
});

// Check if record exists
const exists = await userResource.exists("user-123");
console.log(exists); // true or false
```

### PAGINATION

```typescript
// Find and count (returns [data, total])
const [users, total] = await userResource.findAndCount({
  limit: 10,
  skip: 0,
});

console.log(users.length); // 10
console.log(total); // Total records in database

// Find and paginate (returns paginated result)
const result = await userResource.findAndPaginate({
  limit: 10,
  skip: 0,
});

console.log(result.data); // Array of users
console.log(result.total); // Total count
console.log(result.count); // Count on current page
```

---

## Authorization & Permissions

### Permission Model

Permissions are checked based on the Auth system:

```typescript
interface IAuthUser {
  id: string;
  perms: Record<string, string[]>; // { "users": ["read", "create"] }
  roles?: Array<{
    name: string;
    perms: Record<string, string[]>;
  }>;
}
```

### Standard Actions

- `"read"` - Fetch records
- `"create"` - Create new records
- `"update"` - Modify existing records
- `"delete"` - Remove records
- `"all"` - Wildcard permission for all actions

### Permission Checking Methods

```typescript
// Check if user can perform action
const canRead = userResource.canUserRead(user);
const canCreate = userResource.canUserCreate(user);
const canUpdate = userResource.canUserUpdate(user);
const canDelete = userResource.canUserDelete(user);

// Check multiple actions
const allowed = userResource.isAllowed(["read", "create"], user);

// If user not provided, uses current signed-in user
const canRead = userResource.canUserRead(); // Uses Auth.getSignedUser()
```

### Authorize Action

```typescript
try {
  await userResource.authorizeAction("create");
  // User has permission
  console.log("Authorization passed");
} catch (error) {
  // User lacks permission
  console.error(error); // Error with translated message
}

// Automatically called by CRUD methods
const newUser = await userResource.create({
  // ... data
  // This internally calls authorizeAction("create")
});
```

### Permission Examples

```typescript
// Admin user with all permissions
const admin = {
  id: "admin-1",
  perms: {
    users: ["all"],
  },
};

// Editor with limited permissions
const editor = {
  id: "editor-1",
  perms: {
    users: ["read", "create", "update"],
  },
};

// Viewer with read-only access
const viewer = {
  id: "viewer-1",
  perms: {
    users: ["read"],
  },
};

// Permission check
console.log(userResource.canUserCreate(admin)); // true
console.log(userResource.canUserCreate(editor)); // true
console.log(userResource.canUserCreate(viewer)); // false
```

---

## Data Service Integration

### Interface Definition

```typescript
interface IResourceDataService<DataType, PrimaryKeyType> {
  // Single Record Operations
  create(record: Partial<DataType>): Promise<DataType>;
  findOne(
    options: PrimaryKeyType | IResourceQueryOptions<DataType>
  ): Promise<DataType | null>;
  findOneOrFail(
    options: PrimaryKeyType | IResourceQueryOptions<DataType>
  ): Promise<DataType>;
  update(
    primaryKey: PrimaryKeyType,
    data: Partial<DataType>
  ): Promise<DataType>;
  delete(primaryKey: PrimaryKeyType): Promise<boolean>;

  // Multiple Record Operations
  find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  findAndCount(
    options?: IResourceQueryOptions<DataType>
  ): Promise<[DataType[], number]>;
  findAndPaginate(
    options?: IResourceQueryOptions<DataType>
  ): Promise<IResourcePaginatedResult<DataType>>;
  createMany(data: Partial<DataType>[]): Promise<DataType[]>;
  updateMany(
    criteria: IResourceManyCriteria<DataType, PrimaryKeyType>,
    data: Partial<DataType>
  ): Promise<number>;
  deleteMany(
    criteria: IResourceManyCriteria<DataType, PrimaryKeyType>
  ): Promise<number>;

  // Utility Operations
  count(options?: IResourceQueryOptions<DataType>): Promise<number>;
  exists(primaryKey: PrimaryKeyType): Promise<boolean>;
}
```

### Query Options

```typescript
interface IResourceQueryOptions<DataType> {
  limit?: number; // Max records to return
  skip?: number; // Number of records to skip (offset)
  sort?: Record<string, 1 | -1>; // Sort order
  filter?: Partial<DataType>; // Filter criteria
  select?: (keyof DataType)[]; // Fields to select
  // Can include database-specific options
}
```

### Data Service Validation

```typescript
// Check if data service is properly configured
const hasService = userResource.hasDataService();
console.log(hasService); // true or false

// All CRUD operations validate this internally
if (!hasService) {
  throw new Error("resources.invalidDataProvider");
}
```

---

## Translations & i18n

### How Translations Work

The Resource system automatically integrates with i18n:

1. **Initialization**: On construction, resource listens to i18n changes
2. **Resolution**: Translations are resolved from i18n dictionary
3. **Updates**: Automatically re-resolves when locale or dictionary changes
4. **Cleanup**: Removes listeners when destroyed

### Translation Structure

Register translations using i18n:

```typescript
import { i18n } from "@/i18n";

i18n.registerTranslations({
  en: {
    resources: {
      users: {
        // Resource-level translations
        label: "Users",
        title: "User Management System",
        notFoundError: "User with ID {id} not found",
        forbiddenError: "You don't have permission to {action} users",

        // Action-level translations
        create: {
          label: "Create User",
          title: "Create a new user",
        },
        read: {
          label: "View User",
          title: "View user details",
        },
        update: {
          label: "Update User",
          title: "Modify user information",
        },
        delete: {
          label: "Delete User",
          title: "Remove user from system",
        },

        // Field-level translations
        id: {
          label: "ID",
          placeholder: "Auto-generated",
        },
        name: {
          label: "Full Name",
          placeholder: "Enter user name",
        },
        email: {
          label: "Email Address",
          placeholder: "user@example.com",
        },
        role: {
          label: "User Role",
          options: {
            admin: "Administrator",
            user: "Regular User",
            guest: "Guest",
          },
        },
      },
    },
  },
});
```

### Getting Translations

```typescript
// Get all translations for the resource
const translations = userResource.getTranslations();
console.log(translations);
// {
//   label: "Users",
//   title: "User Management System",
//   create: { ... },
//   read: { ... },
//   ...
// }

// Get translations for specific locale
const frenchTranslations = userResource.getTranslations("fr");

// Get current locale
const locale = i18n.getLocale(); // "en" or "fr"
```

### Translating Values

```typescript
// Translate a specific scope
const label = userResource.translate("label");
console.log(label); // "Users"

// With nested scope
const createLabel = userResource.translate("create.label");
console.log(createLabel); // "Create User"

// With array scope
const title = userResource.translate(["create", "title"]);
console.log(title); // "Create a new user"

// With options for formatting
const createLabel = userResource.translate("create.label", {
  count: 5,
  resourceName: "users",
});
```

### Property Translation

```typescript
// Translate a property with fallback
const label = userResource.translateProperty("label", "Fallback Label", {
  resourceName: "users",
});

// This checks translations first, then falls back to provided value
```

### Resource Labels and Titles

```typescript
// Get resource label (checks translations, then metadata)
const label = userResource.getLabel();
console.log(label); // "Users"

// Get resource title (checks translations, then metadata)
const title = userResource.getTitle();
console.log(title); // "User Management System"

// These are used in UI for display
```

### Handling Locale Changes

Resource automatically updates translations when locale changes:

```typescript
// Change locale
i18n.setLocale("fr");

// Resource automatically re-resolves translations
const label = userResource.getLabel();
console.log(label); // French label

// Trigger manual resolution (rarely needed)
userResource.resolveTranslations();
```

### Error Message Translation

Errors automatically use translations:

```typescript
// When a user lacks permission
await userResource.create({
  /* ... */
});
// Throws: i18n.t("resources.users.forbiddenError", context)
// With translation: "You don't have permission to create users"

// When record not found
await userResource.findOneOrFail("invalid-id");
// Throws: i18n.t("resources.users.notFoundError", context)
// With translation: "User with ID invalid-id not found"

// When data service missing
// Throws: i18n.t("resources.invalidDataProvider", context)
```

### IResourceTranslations Type

The structure of resource translations:

```typescript
interface IResourceTranslations {
  // Resource metadata translations
  label?: string; // Display name
  title?: string; // Description
  notFoundError?: string; // Not found message
  forbiddenError?: string; // Permission error
  invalidError?: string; // Validation error

  // Action translations
  create?: {
    label?: string;
    title?: string;
    zero?: string; // For pluralization
    one?: string;
    other?: string;
  };
  read?: {
    /* ... */
  };
  update?: {
    /* ... */
  };
  delete?: {
    /* ... */
  };

  // Custom actions
  [customAction: string]: any;

  // Field translations
  [fieldName: string]: {
    label?: string;
    placeholder?: string;
    description?: string;
    validation?: Record<string, string>;
  };
}
```

---

## Lifecycle Hooks

### Hook Execution Order

For single operations:

```
authorizeAction("create")
  ↓
beforeCreate()
  ↓
dataService.create()
  ↓
afterCreate()
  ↓
trigger("create" event)
```

### Available Hooks

#### Before Create

```typescript
class UserResource extends Resource<"users", User, string> {
  protected async beforeCreate(record: Partial<User>): Promise<void> {
    // Validate data
    if (!record.email?.includes("@")) {
      throw new Error("Invalid email");
    }

    // Set defaults
    record.role = record.role || "user";

    // Log the action
    console.log("Creating user:", record);

    // Can perform async operations
    const emailExists = await this.checkEmailExists(record.email);
    if (emailExists) {
      throw new Error("Email already registered");
    }
  }
}
```

#### After Create

```typescript
protected async afterCreate(record: User): Promise<void> {
  // Send welcome email
  await emailService.sendWelcomeEmail(record.email);

  // Update analytics
  analytics.trackUserCreation(record);

  // Log to audit trail
  audit.log("user_created", record.id);
}
```

#### Before Update

```typescript
protected async beforeUpdate(
  primaryKey: string,
  dataToUpdate: Partial<User>
): Promise<void> {
  // Fetch current record
  const current = await this.findOne(primaryKey);

  // Validate changes
  if (current.role === "admin" && dataToUpdate.role !== "admin") {
    throw new Error("Cannot change admin role");
  }

  // Log the change
  console.log(`Updating user ${primaryKey}`, {
    current,
    changes: dataToUpdate,
  });
}
```

#### After Update

```typescript
protected async afterUpdate(
  updatedData: User,
  primaryKey: string,
  dataToUpdate: Partial<User>
): Promise<void> {
  // Notify user of changes
  if (dataToUpdate.email) {
    await emailService.sendEmailChangeConfirmation(updatedData.email);
  }

  // Invalidate cache
  cache.delete(`user:${primaryKey}`);

  // Audit trail
  audit.log("user_updated", primaryKey, dataToUpdate);
}
```

#### Before Delete

```typescript
protected async beforeDelete(primaryKey: string): Promise<void> {
  // Prevent deletion of last admin
  const user = await this.findOne(primaryKey);
  if (user.role === "admin") {
    const adminCount = await this.count({
      filter: { role: "admin" },
    });
    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin user");
    }
  }
}
```

#### After Delete

```typescript
protected async afterDelete(
  result: boolean,
  primaryKey: string
): Promise<void> {
  if (result) {
    // Cleanup related data
    await ordersResource.deleteMany({ userId: primaryKey });

    // Send goodbye email
    // (need to save email before deleting)

    // Update analytics
    analytics.trackUserDeletion(primaryKey);
  }
}
```

#### Batch Operation Hooks

```typescript
protected async beforeCreateMany(records: Partial<User>[]): Promise<void> {
  console.log(`Creating ${records.length} users`);

  // Validate all records
  for (const record of records) {
    if (!record.email?.includes("@")) {
      throw new Error("Invalid email in batch");
    }
  }
}

protected async afterCreateMany(
  records: User[],
  data: Partial<User>[]
): Promise<void> {
  console.log(`Successfully created ${records.length} users`);

  // Send welcome emails for all
  for (const record of records) {
    await emailService.sendWelcomeEmail(record.email);
  }
}

protected async beforeUpdateMany(
  criteria: any,
  data: Partial<User>
): Promise<void> {
  console.log("Updating multiple users with:", data);
}

protected async afterUpdateMany(
  affectedRows: number,
  criteria: any,
  data: Partial<User>
): Promise<void> {
  console.log(`Updated ${affectedRows} users`);
  cache.clearPrefix("user:");
}

protected async beforeDeleteMany(criteria: any): Promise<void> {
  console.log("About to delete multiple users");
}

protected async afterDeleteMany(
  affectedRows: number,
  criteria: any
): Promise<void> {
  console.log(`Deleted ${affectedRows} users`);
  cache.clearPrefix("user:");
}
```

### Hook Best Practices

1. **Keep hooks fast**: Avoid heavy computations
2. **Handle errors properly**: Throw errors to prevent operation
3. **Be idempotent**: Hooks may be called multiple times
4. **Use transactions**: For related updates across resources
5. **Log appropriately**: For debugging and auditing
6. **Don't call CRUD**: Avoid circular calls within hooks

---

## Events System

### Event Types

All CRUD operations trigger events:

```typescript
type IResourceDefaultEvent<"users"> =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "findOne"
  | "findOneOrFail"
  | "find"
  | "findAndCount"
  | "findAndPaginate"
  | "createMany"
  | "updateMany"
  | "deleteMany"
  | "count"
  | "exists";
```

### Listening to Events

```typescript
import { Resource } from "@/resources";

// Listen to create events
Resource.events.on("create", (context) => {
  console.log("User created in resource:", context.resourceName);
  console.log("Resource label:", context.resourceLabel);
});

// Listen to update events
Resource.events.on("update", (context, ...args) => {
  console.log("Update event triggered");
  // args contains: result, primaryKey, dataToUpdate
});

// Listen to delete events
Resource.events.on("delete", (context, ...args) => {
  console.log("Delete event triggered");
  // args contains: result, primaryKey
});

// Listen to find events
Resource.events.on("find", (context, ...args) => {
  console.log("Find event triggered");
  // args contains: results array
});
```

### Event Context

Every event includes a context object:

```typescript
interface IResourceContext {
  resourceName: string; // "users"
  resourceLabel: string; // "Users"
  [key: string]: any; // Custom properties
}

Resource.events.on("create", (context, result) => {
  console.log(context);
  // {
  //   resourceName: "users",
  //   resourceLabel: "Users",
  //   // ... any additional params from getResourceContext()
  // }

  console.log(result); // The created user object
});
```

### Reactive Patterns

```typescript
// Track all resource changes
Resource.events.on("create", () => analytics.track("resource_created"));
Resource.events.on("update", () => analytics.track("resource_updated"));
Resource.events.on("delete", () => analytics.track("resource_deleted"));

// Real-time UI updates
Resource.events.on("create", (context, createdRecord) => {
  uiStore.addRecord(context.resourceName, createdRecord);
});

Resource.events.on("update", (context, updatedRecord) => {
  uiStore.updateRecord(context.resourceName, updatedRecord);
});

Resource.events.on("delete", (context, result, primaryKey) => {
  uiStore.removeRecord(context.resourceName, primaryKey);
});

// Audit logging
Resource.events.on("create", (context, record) => {
  auditLog.record({
    action: "create",
    resource: context.resourceName,
    recordId: record.id,
    timestamp: new Date(),
  });
});
```

### Custom Events

Trigger custom events:

```typescript
class UserResource extends Resource<"users", User, string> {
  async archiveUser(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    const updated = await this.update(userId, { archived: true });

    // Trigger custom event
    this.trigger("archive", updated);

    return updated;
  }
}

// Listen to custom event
Resource.events.on("archive", (context, user) => {
  console.log(`User ${user.id} archived`);
  emailService.sendArchiveNotification(user.email);
});
```

### Removing Event Listeners

```typescript
const handler = (context) => {
  console.log("Something changed");
};

// Subscribe
Resource.events.on("create", handler);

// Unsubscribe later
Resource.events.off("create", handler);

// Remove all listeners for an event
Resource.events.offAll(); // Careful! Removes all listeners for all events
```

---

## Metadata & Fields

### Metadata Definition

```typescript
@ResourceMetadata({
  name: "users" as IResourceName,
  label: "Users",
  title: "User Management System",
  actions: {
    create: { label: "Create", title: "Create a new user" },
    read: { label: "View", title: "View user details" },
    update: { label: "Edit", title: "Edit user" },
    delete: { label: "Delete", title: "Remove user" },
  },
  instanciate: false,
})
class UserResource extends Resource<"users", User, string> {
  // ...
}
```

### Accessing Metadata

```typescript
// Get all metadata
const metadata = userResource.getMetaData();
console.log(metadata);
// {
//   name: "users",
//   label: "Users",
//   title: "User Management System",
//   actions: { ... },
//   className: "UserResource"
// }

// Get specific metadata
const label = userResource.getLabel();
const title = userResource.getTitle();

// Get resource name
const name = userResource.getName();
console.log(name); // "users"
```

### Updating Metadata

```typescript
const updated = userResource.updateMetadata({
  name: "users",
  label: "Updated Users",
  title: "New Title",
  actions: {},
});

console.log(updated.label); // "Updated Users"
```

### Fields

Fields represent the structure of your data:

```typescript
// Get all fields
const fields = userResource.getFields();
console.log(fields);
// {
//   id: { name: "id", primaryKey: true, type: "text", ... },
//   name: { name: "name", type: "text", required: true, ... },
//   email: { name: "email", type: "email", required: true, ... },
//   ...
// }

// Get primary key fields
const primaryKeys = userResource.getPrimaryKeys();
console.log(primaryKeys);
// [ { name: "id", primaryKey: true, type: "text", ... } ]
```

### Actions

Define custom actions:

```typescript
class UserResource extends Resource<"users", User, string> {
  actions = {
    create: { label: "Create User", title: "Create a new user" },
    read: { label: "View User", title: "View user details" },
    update: { label: "Update User", title: "Edit user details" },
    delete: { label: "Delete User", title: "Remove user" },
    ban: { label: "Ban User", title: "Ban from system" },
    unban: { label: "Unban User", title: "Restore access" },
    resetPassword: {
      label: "Reset Password",
      title: "Send password reset email",
    },
  };

  // Check if action exists
  hasBanAction = this.hasAction("ban"); // true

  // Get action details
  const banAction = this.getAction("ban");
  console.log(banAction.label); // "Ban User"

  // Get formatted label
  const label = this.getActionLabel("ban", { userName: "John" });

  // Get formatted title
  const title = this.getActionTitle("ban");
}
```

---

## Advanced Patterns

### Pattern 1: Resource Manager

Manage multiple resources:

```typescript
import { ResourcesManager } from "@/resources";

// Add resources
ResourcesManager.addResource("users", userResource);
ResourcesManager.addResource("products", productResource);
ResourcesManager.addResource("orders", orderResource);

// Get resource by name
const users = ResourcesManager.getResource("users");
const products = ResourcesManager.getResource("products");

// Get all resources
const allResources = ResourcesManager.getResources();
for (const [name, resource] of Object.entries(allResources)) {
  console.log(name, resource.getLabel());
}

// Get all resource names
const names = ResourcesManager.getAllNames();
console.log(names); // ["users", "products", "orders"]

// Check if resource exists
if (ResourcesManager.hasResource("users")) {
  const users = ResourcesManager.getResource("users");
  console.log(users.getLabel());
}
```

### Pattern 2: Service Layer Integration

```typescript
class UserService {
  constructor(private userResource: UserResource) {}

  async registerUser(userData: Partial<User>): Promise<User> {
    try {
      // Check email uniqueness
      const existing = await this.userResource.findOne({
        filter: { email: userData.email },
      });

      if (existing) {
        throw new Error("Email already registered");
      }

      // Create user
      const user = await this.userResource.create({
        ...userData,
        role: "user",
      });

      // Send verification email
      await emailService.sendVerification(user.email);

      return user;
    } catch (error) {
      logger.error("Registration failed", error);
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    // Prevent role changes
    if (updates.role) {
      delete updates.role;
    }

    return this.userResource.update(userId, updates);
  }

  async deleteAccount(userId: string): Promise<void> {
    // Cleanup
    await ordersResource.deleteMany({ userId });
    await commentsResource.deleteMany({ userId });

    // Delete user
    await this.userResource.delete(userId);
  }
}
```

### Pattern 3: Event-Driven Architecture

```typescript
class NotificationService {
  constructor() {
    // Listen to resource events
    Resource.events.on("create", this.onResourceCreate.bind(this));
    Resource.events.on("update", this.onResourceUpdate.bind(this));
    Resource.events.on("delete", this.onResourceDelete.bind(this));
  }

  private onResourceCreate(context: IResourceContext, data: any) {
    // Send notifications
    if (context.resourceName === "users") {
      this.sendWelcomeEmail(data.email);
    } else if (context.resourceName === "orders") {
      this.sendOrderConfirmation(data.customerId, data.id);
    }
  }

  private onResourceUpdate(context: IResourceContext, data: any) {
    // Handle updates
    if (context.resourceName === "orders" && data.status === "shipped") {
      this.sendShippingNotification(data.customerId, data.id);
    }
  }

  private onResourceDelete(context: IResourceContext, result: boolean) {
    // Cleanup
    if (result) {
      logger.info(`Resource ${context.resourceName} deleted`);
    }
  }
}
```

### Pattern 4: Permission-Based Business Logic

```typescript
class PermissionAwareUserService {
  async updateUserRole(userId: string, newRole: string): Promise<User> {
    // Check current user permissions
    if (!userResource.canUserUpdate()) {
      throw new Error("You don't have permission to update users");
    }

    // Additional business logic
    const user = await userResource.findOne(userId);

    if (user.role === "admin" && newRole !== "admin") {
      // Prevent removing last admin
      const adminCount = await userResource.count({
        filter: { role: "admin" },
      });

      if (adminCount <= 1) {
        throw new Error("Cannot remove the last admin");
      }
    }

    return userResource.update(userId, { role: newRole });
  }

  async bulkUpdateRoles(updates: Array<{ userId: string; role: string }>) {
    // Check permission for bulk update
    if (!userResource.canUserUpdate()) {
      throw new Error("You don't have permission to update users");
    }

    // Execute updates
    const results = [];
    for (const update of updates) {
      try {
        const updated = await this.updateUserRole(update.userId, update.role);
        results.push({ success: true, data: updated });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return results;
  }
}
```

### Pattern 5: Caching with Events

```typescript
class CachedUserService {
  private cache = new Map<string, User>();

  constructor(private userResource: UserResource) {
    // Sync cache with resource events
    Resource.events.on("create", (context, user) => {
      if (context.resourceName === "users") {
        this.cache.set(user.id, user);
      }
    });

    Resource.events.on("update", (context, user) => {
      if (context.resourceName === "users") {
        this.cache.set(user.id, user);
      }
    });

    Resource.events.on("delete", (context, result, userId) => {
      if (context.resourceName === "users") {
        this.cache.delete(userId);
      }
    });
  }

  async getUser(userId: string): Promise<User> {
    // Check cache first
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    // Fetch from resource
    const user = await this.userResource.findOne(userId);

    if (user) {
      this.cache.set(userId, user);
    }

    return user;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

---

## API Reference

### Resource Class Methods

#### Query Methods

```typescript
// Find all records
find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>

// Find single record
findOne(
  options: PrimaryKeyType | IResourceQueryOptions<DataType>
): Promise<DataType | null>

// Find single or throw error
findOneOrFail(
  options: PrimaryKeyType | IResourceQueryOptions<DataType>
): Promise<DataType>

// Find and count
findAndCount(
  options?: IResourceQueryOptions<DataType>
): Promise<[DataType[], number]>

// Find and paginate
findAndPaginate(
  options?: IResourceQueryOptions<DataType>
): Promise<IResourcePaginatedResult<DataType>>

// Count total records
count(options?: IResourceQueryOptions<DataType>): Promise<number>

// Check if record exists
exists(primaryKey: PrimaryKeyType): Promise<boolean>
```

#### Mutation Methods

```typescript
// Create single record
create(record: Partial<DataType>): Promise<DataType>

// Create multiple records
createMany(data: Partial<DataType>[]): Promise<DataType[]>

// Update single record
update(
  primaryKey: PrimaryKeyType,
  dataToUpdate: Partial<DataType>
): Promise<DataType>

// Update multiple records
updateMany(
  criteria: IResourceManyCriteria<DataType, PrimaryKeyType>,
  data: Partial<DataType>
): Promise<number>

// Delete single record
delete(primaryKey: PrimaryKeyType): Promise<boolean>

// Delete multiple records
deleteMany(
  criteria: IResourceManyCriteria<DataType, PrimaryKeyType>
): Promise<number>
```

#### Permission Methods

```typescript
// Authorize action
authorizeAction(action: IResourceActionName<Name>): Promise<void>

// Check read permission
canUserRead(user?: IAuthUser): boolean

// Check create permission
canUserCreate(user?: IAuthUser): boolean

// Check update permission
canUserUpdate(user?: IAuthUser): boolean

// Check delete permission
canUserDelete(user?: IAuthUser): boolean

// Check multiple permissions
isAllowed(
  action?: IResourceActionName<Name> | IResourceActionName<Name>[],
  user?: IAuthUser
): boolean
```

#### Metadata & Translation Methods

```typescript
// Get all metadata
getMetaData(): IResource<Name, DataType>

// Update metadata
updateMetadata(
  options: IResource<Name, DataType>
): IResource<Name, DataType>

// Get resource name
getName(): Name
getResourceName(): Name

// Get resource label
getLabel(): string

// Get resource title
getTitle(): string

// Get all fields
getFields(): Record<string, IField>

// Get primary key fields
getPrimaryKeys(): IField[]

// Get all translations
getTranslations(locale?: string): Record<string, any>

// Translate a scope
translate<T = string>(
  scope: Scope,
  options?: TranslateOptions
): string | T

// Translate a property
translateProperty(
  propertyName: string,
  fallbackValue?: string,
  options?: TranslateOptions
): string

// Get actions
getActions(): Partial<IResourceActions<Name>>

// Check if action exists
hasAction(action: string): action is IResourceActionName<Name>

// Get action by name
getAction(actionName: IResourceActionName<Name>): IResourceAction

// Get action label
getActionLabel(
  actionName: IResourceActionName<Name>,
  params?: Record<string, any>
): string

// Get action title
getActionTitle(
  actionName: IResourceActionName<Name>,
  params?: Record<string, any>
): string
```

#### Utility Methods

```typescript
// Get resource context
getResourceContext(additionalParams?: Record<string, any>): IResourceContext

// Check if data service available
hasDataService(): boolean

// Get data service
abstract getDataService(): IResourceDataService<DataType>

// Trigger event
trigger(
  event: EventType | IResourceDefaultEvent<Name>,
  ...args: any[]
): void

// Format string with parameters
sprintf(text?: string, params?: Record<string, any>): string

// Cleanup
destroy(): void
```

### ResourcesManager Methods

```typescript
// Get all resource names
getAllNames(): string[]

// Get resource by name
getResource<T extends Resource = Resource>(name: IResourceName): T | null

// Check if resource exists
hasResource(name: IResourceName): boolean

// Add resource
addResource<Name extends IResourceName, DataType = unknown>(
  name: Name,
  resource: Resource<Name, DataType>
): void

// Remove resource
removeResource(name: IResourceName): Record<IResourceName, Resource>

// Get all resources
getResources(): Record<IResourceName, Resource>

// Get all metadata
getAllMetaData(): Record<IResourceName, IResource>

// Add metadata
addMetaData(resourceName: IResourceName, metaData: IResource): void

// Get metadata from name
getMetaDataFromName(resourceName: IResourceName): IResource | undefined

// Get metadata by class name
getMetaDataByClassName(className: string): IResource | undefined

// Get resource name from class name
getNameFromClassName(className: string): IResourceName | undefined
```

### Events API

```typescript
// Subscribe to event
Resource.events.on(eventName: string, handler: Function): void

// Unsubscribe from event
Resource.events.off(eventName: string, handler: Function): void

// Remove all listeners
Resource.events.offAll(): void

// Trigger event
Resource.events.trigger(eventName: string, ...args: any[]): void
```

---

## Best Practices

1. **Always implement error handling** in hooks and business logic
2. **Use authorization checks** for sensitive operations
3. **Leverage events** for loose coupling between components
4. **Keep data service logic separate** from business logic
5. **Use transactions** for multi-resource operations
6. **Cache appropriately** using events for invalidation
7. **Log important operations** for debugging and auditing
8. **Validate data** in beforeCreate/beforeUpdate hooks
9. **Clean up listeners** when destroying resources
10. **Use TypeScript generics** for type safety

---

## Troubleshooting

### "Data service not found"

```
Error: resources.invalidDataProvider
```

**Solution**: Implement getDataService() in your Resource class

### "Permission denied"

```
Error: resources.{resourceName}.forbiddenError
```

**Solution**: Ensure user has required permission, check Auth.setSignedUser()

### "Record not found"

```
Error: resources.{resourceName}.notFoundError
```

**Solution**: Use findOne() if record might not exist, or add error handling

### Translations not updating

**Solution**: Ensure translations are registered before creating resource, call i18n.setLocale()

### Events not triggering

**Solution**: Check that operation actually completes, remove conflicting listeners with offAll()

---

## Summary

The Resource system provides a comprehensive solution for:

- ✅ Managing data with consistent CRUD operations
- ✅ Enforcing permissions at every level
- ✅ Supporting multiple languages and locales
- ✅ Extending with lifecycle hooks
- ✅ Reacting to changes via events
- ✅ Organizing code through resource management

Use this guide to build scalable, maintainable, and secure data management systems.

For more information, see the source code in `src/resources/index.ts` and test examples in `src/resources/index.test.ts`.
