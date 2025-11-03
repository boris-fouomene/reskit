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

### 1. Resource Name - IResourceName

**IResourceName** is NOT a string type. It's a **union of all keys defined in the augmented `IResources` interface**.

```typescript
// The IResources interface starts empty
export interface IResources {}

// You augment it by declaring module in your app:
declare module "@resk/core/resources" {
  interface IResources {
    users: IResource<"users", User, string>;
    products: IResource<"products", Product, string>;
    orders: IResource<"orders", Order, number>;
  }
}

// Now IResourceName = "users" | "products" | "orders"
type IResourceName = keyof IResources; // ✓ Type-safe union
```

**Key Points:**

- **NOT a simple string** - It's a **branded literal union** derived from `IResources` keys
- Must be **explicitly augmented** via TypeScript module declaration
- Provides **compile-time type safety** for resource names
- Each resource name maps to a specific resource metadata

```typescript
// ✓ Valid - "users" is in IResources
const resourceName: IResourceName = "users";

// ✓ Valid - "products" is in IResources
const resourceName2: IResourceName = "products";

// ✗ TypeScript Error - "invalid" is NOT in IResources
const invalid: IResourceName = "invalid";
// Type '"invalid"' is not assignable to type 'IResourceName'
```

### 2. IResource - Resource Metadata Type

Each property in `IResources` must extend the **`IResource<Name, DataType, PrimaryKeyType, Actions>`** interface:

```typescript
export interface IResource<
  Name extends IResourceName = IResourceName,
  DataType = unknown,
  PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey,
  Actions extends Record<string, IResourceAction> = Record<
    string,
    IResourceAction
  >,
> {
  name?: IResourceName;
  label?: string;
  title?: string;
  actions?: Actions; // Record of available actions
  className?: string; // Mapped class name
}
```

**Example:**

```typescript
declare module "@resk/core/resources" {
  interface IResources {
    users: {
      // Must extend IResource structure
      actions: {
        read: { label: "View User"; title: "View user details" };
        create: { label: "Create User"; title: "Create new user" };
        update: { label: "Edit User"; title: "Edit user info" };
        delete: { label: "Remove User"; title: "Delete user" };
        ban: { label: "Ban User"; title: "Ban user from system" };
        unban: { label: "Unban User"; title: "Restore access" };
      };
    };
  }
}
```

### 3. Augmenting IResources - Full Example

You must declare resources in your application's type definitions:

```typescript
// src/types/resources.ts
import "@resk/core/resources";

declare module "@resk/core/resources" {
  interface IResources {
    // Resource 1: Users
    users: {
      actions: {
        read: { label: "View"; title: "View user" };
        create: { label: "Create"; title: "Create user" };
        update: { label: "Edit"; title: "Edit user" };
        delete: { label: "Delete"; title: "Delete user" };
      };
    };

    // Resource 2: Products
    products: {
      actions: {
        read: { label: "View"; title: "View product" };
        create: { label: "Create"; title: "Create product" };
        update: { label: "Edit"; title: "Edit product" };
        delete: { label: "Delete"; title: "Delete product" };
        publish: { label: "Publish"; title: "Make product public" };
        unpublish: { label: "Unpublish"; title: "Hide product" };
      };
    };

    // Resource 3: Orders
    orders: {
      actions: {
        read: { label: "View"; title: "View order" };
        create: { label: "Create"; title: "Place order" };
        update: { label: "Edit"; title: "Edit order" };
        delete: { label: "Cancel"; title: "Cancel order" };
        ship: { label: "Ship"; title: "Ship order" };
        track: { label: "Track"; title: "Track order" };
      };
    };

    // Resource 4: Categories (minimal)
    categories: {
      actions: {
        read: { label: "View" };
        create: { label: "Create" };
        update: { label: "Edit" };
        delete: { label: "Delete" };
      };
    };
  }
}

// After this declaration:
// - IResourceName = "users" | "products" | "orders" | "categories"
// - Each resource name maps to its metadata
// - Type system enforces action names per resource
```

### 4. Action Names - IResourceActionName

Action names are **derived from the augmented resource definition**:

```typescript
// For users resource with these actions:
// { read, create, update, delete, ban, unban }

type UserActionNames = IResourceActionName<"users">;
// Result: "read" | "create" | "update" | "delete" | "ban" | "unban"

type ProductActionNames = IResourceActionName<"products">;
// Result: "read" | "create" | "update" | "delete" | "publish" | "unpublish"

// Compile-time type safety:
function performAction(
  resourceName: "users",
  actionName: IResourceActionName<"users">
) {
  // actionName must be one of the user resource's actions
}

performAction("users", "read"); // ✓ Valid
performAction("users", "ban"); // ✓ Valid
performAction("users", "publish"); // ✗ Error - not a user action
```

### 5. Data Type

The TypeScript interface representing the actual data:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  createdAt: Date;
}

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  published: boolean;
}
```

### 6. Primary Key Type

The type of the unique identifier:

```typescript
class UserResource extends Resource<"users", User, string> {
  // Primary key type is string
}

class OrderResource extends Resource<"orders", Order, number> {
  // Primary key type is number
}
```

### 7. Data Service

An interface that handles the actual data operations:

```typescript
interface IResourceDataService<DataType, PrimaryKeyType> {
  // Single record operations
  create(record: Partial<DataType>): Promise<DataType>;
  findOne(id: PrimaryKeyType): Promise<DataType | null>;
  findOneOrFail(id: PrimaryKeyType): Promise<DataType>;
  update(id: PrimaryKeyType, data: Partial<DataType>): Promise<DataType>;
  delete(id: PrimaryKeyType): Promise<boolean>;

  // Multiple record operations
  find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  findAndCount(
    options?: IResourceQueryOptions<DataType>
  ): Promise<[DataType[], number]>;
  findAndPaginate(
    options?: IResourceQueryOptions<DataType>
  ): Promise<IResourcePaginatedResult<DataType>>;
  createMany(data: Partial<DataType>[]): Promise<DataType[]>;
  updateMany(criteria: any, data: Partial<DataType>): Promise<number>;
  deleteMany(criteria: any): Promise<number>;

  // Utility operations
  count(options?: IResourceQueryOptions<DataType>): Promise<number>;
  exists(id: PrimaryKeyType): Promise<boolean>;
}
```

### Type Relationships Summary

````typescript
// Chain of type dependencies:

IResources (module augmentation)
  ↓
IResourceName (extracted keys)
  ↓
IResourceActionName<ResourceName> (action names per resource)
  ↓
GetResource<ResourceName> (retrieve resource metadata)
  ↓
IResourceActions<ResourceName> (all actions for resource)

---

## Getting Started

### Step 0: Augment IResources Interface

This is the **critical first step** before creating any resources. Declare your resources in a types file:

```typescript
// src/types/resources.ts
import "@resk/core/resources";

declare module "@resk/core/resources" {
  interface IResources {
    users: {
      actions: {
        read: { label: "View User"; title: "View user details" };
        create: { label: "Create User"; title: "Create new user" };
        update: { label: "Edit User"; title: "Edit user" };
        delete: { label: "Delete User"; title: "Remove user" };
      };
    };
  }
}

// Now IResourceName = "users"
// type UserActions = IResourceActionName<"users"> = "read" | "create" | "update" | "delete"
````

**Why this matters:**

1. **Type safety** - IResourceName becomes a branded type
2. **Action validation** - Only defined actions are allowed
3. **Translation structure** - Derived from augmented interface
4. **Permissions** - Checked against defined actions

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
import {
  IResourceDataService,
  IResourceQueryOptions,
} from "@resk/core/resources";

class UserDataService implements IResourceDataService<User, string> {
  private users: Map<string, User> = new Map();

  async find(options?: IResourceQueryOptions<User>): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async findOne(
    options: string | IResourceQueryOptions<User>
  ): Promise<User | null> {
    const id =
      typeof options === "string" ? options : (options.filter?.id as string);
    return this.users.get(id) || null;
  }

  async findOneOrFail(
    options: string | IResourceQueryOptions<User>
  ): Promise<User> {
    const id =
      typeof options === "string" ? options : (options.filter?.id as string);
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);
    return user;
  }

  async create(record: Partial<User>): Promise<User> {
    const id = crypto.randomUUID();
    const user: User = {
      id,
      name: record.name || "",
      email: record.email || "",
      role: record.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const existed = this.users.has(id);
    this.users.delete(id);
    return existed;
  }

  async findAndCount(
    options?: IResourceQueryOptions<User>
  ): Promise<[User[], number]> {
    const data = Array.from(this.users.values());
    return [data, data.length];
  }

  async findAndPaginate(
    options?: IResourceQueryOptions<User>
  ): Promise<IResourcePaginatedResult<User>> {
    const data = Array.from(this.users.values());
    return { data, total: data.length, count: data.length };
  }

  async createMany(data: Partial<User>[]): Promise<User[]> {
    return Promise.all(data.map((item) => this.create(item)));
  }

  async updateMany(criteria: any, data: Partial<User>): Promise<number> {
    let count = 0;
    this.users.forEach((user) => {
      this.users.set(user.id, { ...user, ...data });
      count++;
    });
    return count;
  }

  async deleteMany(criteria: any): Promise<number> {
    const count = this.users.size;
    this.users.clear();
    return count;
  }

  async count(options?: IResourceQueryOptions<User>): Promise<number> {
    return this.users.size;
  }

  async exists(id: string): Promise<boolean> {
    return this.users.has(id);
  }
}
```

### Step 3: Create a Resource Class

Extend the `Resource` class with the resource name from your augmented `IResources`:

```typescript
// src/resources/user.resource.ts
import { Resource, ResourceMetadata } from "@resk/core/resources";
import { IResourceDataService, IResourceName } from "@resk/core/resources";

@ResourceMetadata({
  name: "users", // Must match IResources key
  label: "Users",
  title: "User Management System",
  actions: {
    read: { label: "View User", title: "View user details" },
    create: { label: "Create User", title: "Create new user" },
    update: { label: "Edit User", title: "Edit user information" },
    delete: { label: "Delete User", title: "Remove user from system" },
  },
  instanciate: false,
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
export const userResource = new UserResource();
```

**Key Points:**

- Resource name **must match** a key in augmented `IResources`
- Type parameters ensure **full type safety**
- Actions **must be valid for the resource**
- Data service **must implement full interface**

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

### IResourceTranslations Type Structure

**IResourceTranslations** is a complex type that ensures **compile-time type safety** for translations. It's automatically derived from your augmented `IResources` interface.

```typescript
// Given this augmented resource:
declare module "@resk/core/resources" {
  interface IResources {
    users: {
      actions: {
        read: { label: "Read" };
        create: { label: "Create" };
        update: { label: "Update" };
        delete: { label: "Delete" };
      };
    };
  }
}

// IResourceTranslation<"users"> requires this structure:
type UserTranslations = IResourceTranslation<"users">;

// Must include:
// - label (required)
// - title (optional)
// - forbiddenError (required)
// - notFoundError (required)
// - Translations for EACH action: read, create, update, delete
//   (each with: label, title, zero, one, other)
```

### Translation Structure - Complete Example

```typescript
import { i18n } from "@resk/core/resources";

// Register translations matching IResourceTranslation<ResourceName>
i18n.registerTranslations({
  en: {
    resources: {
      users: {
        // Resource-level core properties
        label: "Users",
        title: "User Management System",
        description: "Manage application users",
        forbiddenError: "You don't have permission to manage users",
        notFoundError: "User not found",

        // Action translations - MUST match resource actions
        read: {
          label: "View User",
          title: "View user details",
          zero: "No users to view",
          one: "Viewing one user",
          other: "Viewing %{count} users",
        },
        create: {
          label: "Create User",
          title: "Create a new user",
          zero: "No users created",
          one: "Created one user",
          other: "Created %{count} users",
        },
        update: {
          label: "Edit User",
          title: "Edit user information",
          zero: "No users edited",
          one: "Edited one user",
          other: "Edited %{count} users",
        },
        delete: {
          label: "Delete User",
          title: "Remove user from system",
          zero: "No users deleted",
          one: "Deleted one user",
          other: "Deleted %{count} users",
        },

        // Optional: Custom field translations
        name: {
          label: "Full Name",
          placeholder: "Enter user's full name",
        },
        email: {
          label: "Email Address",
          placeholder: "user@example.com",
          validation: {
            required: "Email is required",
            format: "Please enter a valid email",
          },
        },
        role: {
          label: "User Role",
          options: {
            admin: "Administrator",
            user: "Regular User",
            guest: "Guest User",
          },
        },
      },
    },
  },
  fr: {
    resources: {
      users: {
        label: "Utilisateurs",
        title: "Système de Gestion des Utilisateurs",
        forbiddenError:
          "Vous n'avez pas la permission de gérer les utilisateurs",
        notFoundError: "Utilisateur introuvable",
        read: {
          label: "Voir l'utilisateur",
          title: "Afficher les détails de l'utilisateur",
          zero: "Aucun utilisateur à voir",
          one: "Affichage d'un utilisateur",
          other: "Affichage de %{count} utilisateurs",
        },
        // ... other actions
      },
    },
  },
});
```

### How Translations Work

The Resource system automatically integrates with i18n:

1. **Initialization**: On construction, resource listens to i18n changes
2. **Resolution**: Translations are resolved from i18n dictionary
3. **Updates**: Automatically re-resolves when locale or dictionary changes
4. **Cleanup**: Removes listeners when destroyed

### Pluralization in Translations

Translations support **ICU-style pluralization** with `zero`, `one`, and `other`:

```typescript
// In translation file:
update: {
  zero: "No users updated",      // count = 0
  one: "Updated one user",       // count = 1
  other: "Updated %{count} users" // count > 1
}

// When using:
i18n.t("resources.users.update.other", { count: 5 });
// Result: "Updated 5 users"

i18n.t("resources.users.update.one", { count: 1 });
// Result: "Updated one user"
```

        forbiddenError: "You don't have permission to {action} users",
        notFoundError: "User with ID {id} not found",
      },
    },

},
});

````

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
````

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

## Resource Augmentation - Complete Reference

### What is Resource Augmentation?

Resource Augmentation is the process of extending the TypeScript `IResources` interface to declare all resources available in your application. This is **mandatory** for type safety and enables the entire type system.

```typescript
// ❌ Without augmentation - NO type safety
type AnyResourceName = string; // Can be anything!
type AnyAction = string; // Can be anything!

// ✅ With augmentation - FULL type safety
declare module "@resk/core/resources" {
  interface IResources {
    users: { actions: { read: {...}, create: {...} } };
    products: { actions: { read: {...}, create: {...} } };
  }
}
type ResourceName = "users" | "products"; // ✓ Exact union
type UserAction = "read" | "create"; // ✓ Exact union
```

### Single Resource Augmentation

**Example 1: Simple Users Resource**

```typescript
// src/types/resources/users.ts
import "@resk/core/resources";

declare module "@resk/core/resources" {
  interface IResources {
    users: {
      actions: {
        read: {
          label: "View User";
          title: "View user details";
        };
        create: {
          label: "Create User";
          title: "Create a new user";
        };
        update: {
          label: "Edit User";
          title: "Edit user information";
        };
        delete: {
          label: "Delete User";
          title: "Remove user from system";
        };
      };
    };
  }
}

// Usage:
type UserResourceName = IResourceName; // "users"
type UserActions = IResourceActionName<"users">; // "read" | "create" | "update" | "delete"
```

**Example 2: Products Resource with Custom Actions**

```typescript
declare module "@resk/core/resources" {
  interface IResources {
    products: {
      actions: {
        read: { label: "View"; title: "View product" };
        create: { label: "Create"; title: "Create product" };
        update: { label: "Edit"; title: "Edit product" };
        delete: { label: "Delete"; title: "Delete product" };
        publish: { label: "Publish"; title: "Make public" };
        unpublish: { label: "Unpublish"; title: "Hide product" };
        archive: { label: "Archive"; title: "Archive product" };
      };
    };
  }
}

// Usage:
type ProductActions = IResourceActionName<"products">;
// Result: "read" | "create" | "update" | "delete" | "publish" | "unpublish" | "archive"
```

### Multi-Resource Augmentation

**Example 3: Complete Application Resources**

```typescript
// src/types/resources.ts
import "@resk/core/resources";

declare module "@resk/core/resources" {
  interface IResources {
    // Resource 1: Users (admin management)
    users: {
      actions: {
        read: { label: "View User" };
        create: { label: "Create User" };
        update: { label: "Edit User" };
        delete: { label: "Delete User" };
        ban: { label: "Ban User" };
        unban: { label: "Unban User" };
        resetPassword: { label: "Reset Password" };
      };
    };

    // Resource 2: Products (e-commerce)
    products: {
      actions: {
        read: { label: "View Product" };
        create: { label: "Create Product" };
        update: { label: "Edit Product" };
        delete: { label: "Delete Product" };
        publish: { label: "Publish" };
        unpublish: { label: "Unpublish" };
      };
    };

    // Resource 3: Orders (e-commerce)
    orders: {
      actions: {
        read: { label: "View Order" };
        create: { label: "Create Order" };
        update: { label: "Edit Order" };
        delete: { label: "Cancel Order" };
        ship: { label: "Ship Order" };
        track: { label: "Track Order" };
      };
    };

    // Resource 4: Categories (minimal)
    categories: {
      actions: {
        read: { label: "View Category" };
        create: { label: "Create Category" };
        update: { label: "Edit Category" };
        delete: { label: "Delete Category" };
      };
    };

    // Resource 5: Blog Posts
    posts: {
      actions: {
        read: { label: "Read Post" };
        create: { label: "Write Post" };
        update: { label: "Edit Post" };
        delete: { label: "Delete Post" };
        publish: { label: "Publish Post" };
        draft: { label: "Save Draft" };
        schedule: { label: "Schedule Post" };
      };
    };

    // Resource 6: Comments
    comments: {
      actions: {
        read: { label: "View Comment" };
        create: { label: "Post Comment" };
        update: { label: "Edit Comment" };
        delete: { label: "Delete Comment" };
        moderate: { label: "Moderate" };
        approve: { label: "Approve" };
        reject: { label: "Reject" };
      };
    };
  }
}

// Now you have:
type AllResourceNames = IResourceName;
// "users" | "products" | "orders" | "categories" | "posts" | "comments"

type UserActions = IResourceActionName<"users">;
// "read" | "create" | "update" | "delete" | "ban" | "unban" | "resetPassword"

type ProductActions = IResourceActionName<"products">;
// "read" | "create" | "update" | "delete" | "publish" | "unpublish"
```

### Advanced Augmentation Patterns

**Example 4: Conditional Actions Based on User Type**

```typescript
declare module "@resk/core/resources" {
  interface IResources {
    documents: {
      actions: {
        // Standard CRUD actions (all users)
        read: { label: "View Document" };
        create: { label: "Create Document" };
        update: { label: "Edit Document" };
        delete: { label: "Delete Document" };

        // Advanced actions (requires permissions)
        share: { label: "Share Document"; title: "Share with others" };
        collaborate: { label: "Collaborate"; title: "Real-time editing" };
        archive: { label: "Archive"; title: "Archive document" };
        restore: { label: "Restore"; title: "Restore from archive" };
        export: { label: "Export"; title: "Export as PDF/Word" };
        version: { label: "Version History"; title: "View versions" };
      };
    };
  }
}

// Type-safe usage
function getDocumentAction(action: IResourceActionName<"documents">): string {
  const actions: Record<IResourceActionName<"documents">, string> = {
    read: "user can view",
    create: "user can create",
    update: "user can edit",
    delete: "user can delete",
    share: "user can share",
    collaborate: "user can collaborate",
    archive: "user can archive",
    restore: "user can restore",
    export: "user can export",
    version: "user can see versions",
  };
  return actions[action];
}

const desc = getDocumentAction("share"); // ✓ Valid
// const invalid = getDocumentAction("invalid"); // ✗ TypeScript error
```

**Example 5: Hierarchical Resources**

```typescript
declare module "@resk/core/resources" {
  interface IResources {
    // Parent resource: Organizations
    organizations: {
      actions: {
        read: { label: "View Organization" };
        create: { label: "Create Organization" };
        update: { label: "Edit Organization" };
        delete: { label: "Delete Organization" };
        invite: { label: "Invite Member" };
      };
    };

    // Child resource: Team Members
    teamMembers: {
      actions: {
        read: { label: "View Member" };
        create: { label: "Add Member" };
        update: { label: "Edit Member" };
        delete: { label: "Remove Member" };
        promote: { label: "Promote to Admin" };
        demote: { label: "Demote from Admin" };
      };
    };

    // Child resource: Projects
    projects: {
      actions: {
        read: { label: "View Project" };
        create: { label: "Create Project" };
        update: { label: "Edit Project" };
        delete: { label: "Delete Project" };
        archive: { label: "Archive Project" };
      };
    };

    // Grandchild resource: Tasks
    tasks: {
      actions: {
        read: { label: "View Task" };
        create: { label: "Create Task" };
        update: { label: "Edit Task" };
        delete: { label: "Delete Task" };
        assign: { label: "Assign Task" };
        complete: { label: "Mark Complete" };
      };
    };
  }
}

// Hierarchical permission checks
type OrgResourceNames = "organizations" | "teamMembers" | "projects" | "tasks";
type OrgActions = IResourceActionName<OrgResourceNames>;
```

### Validation and Type Safety

**Example 6: Enforcing Augmentation**

```typescript
// Compile-time validation
const validResources: IResourceName[] = [
  "users",
  "products",
  "orders",
  // "invalid" // ✗ TypeScript error
];

// Runtime validation
function validateResourceName(name: string): name is IResourceName {
  const validNames = ["users", "products", "orders"] as const;
  return (validNames as string[]).includes(name);
}

if (validateResourceName("users")) {
  // name is typed as IResourceName
  const resource = ResourcesManager.getResource("users");
}

// Type-safe action tuple
const actionTuple: IResourceActionTuple<"users"> = [
  "users",
  "read", // ✓ Valid user action
  // "publish" // ✗ Error - not a user action
];
```

### Augmentation Best Practices

1. **Define all resources upfront** - Declare all resources in one central location
2. **Use consistent naming** - Keep resource names lowercase and plural
3. **Document actions** - Always include labels and titles for actions
4. **Group by domain** - Organize resources by domain/module
5. **Extend cautiously** - Avoid adding too many custom actions initially

```typescript
// ✓ GOOD - Organized and documented
declare module "@resk/core/resources" {
  interface IResources {
    // User Management Domain
    users: {
      actions: {
        /* ... */
      };
    };
    roles: {
      actions: {
        /* ... */
      };
    };
    permissions: {
      actions: {
        /* ... */
      };
    };

    // E-Commerce Domain
    products: {
      actions: {
        /* ... */
      };
    };
    orders: {
      actions: {
        /* ... */
      };
    };
    categories: {
      actions: {
        /* ... */
      };
    };

    // Content Domain
    posts: {
      actions: {
        /* ... */
      };
    };
    comments: {
      actions: {
        /* ... */
      };
    };
  }
}

// ✗ AVOID - Unorganized and unclear
declare module "@resk/core/resources" {
  interface IResources {
    u: { actions: { a: { label: "x" }; b: { label: "y" } } };
    p: { actions: { a: { label: "x" } } };
    // Difficult to understand and maintain
  }
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
