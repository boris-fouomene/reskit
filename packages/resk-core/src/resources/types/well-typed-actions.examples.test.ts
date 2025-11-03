import {
  IResource,
  IResourceAction,
  IResourceActionNames,
  IResourceGetActionNames,
} from "./index";

declare module "." {
  interface IResources {
    test: {};
  }
}
const userResource: IResource<
  "test", // Using the existing test resource name
  any,
  string,
  {
    read: IResourceAction;
    create: IResourceAction;
    update: IResourceAction;
    archive: IResourceAction; // Custom action
  }
> = {
  name: "test",
  label: "User",
  actions: {
    read: { label: "Read User", title: "View user details" },
    create: { label: "Create User", title: "Add a new user" },
    update: { label: "Update User", title: "Modify user information" },
    archive: { label: "Archive User", title: "Soft delete user account" },
  },
};

/**
 * Extract action names at compile time.
 * TypeScript infers: "read" | "create" | "update" | "archive"
 */
type UserActionNames = IResourceGetActionNames<typeof userResource>;
const u: UserActionNames = "archive";
// Equivalent to: "read" | "create" | "update" | "archive"

/**
 * The actions still satisfy Record<string, IResourceAction> for compatibility
 */
const genericActions: Record<string, IResourceAction> = userResource.actions;

// ============================================================================
// EXAMPLE 2: Using utility types for cleaner syntax
// ============================================================================

/**
 * Define actions using the utility type for cleaner syntax
 */
const postActions = {
  read: { label: "Read Post" },
  create: { label: "Create Post" },
  publish: { label: "Publish Post" },
  unpublish: { label: "Unpublish Post" },
} as const;

/**
 * Create a resource using the inferred actions type
 */
const postResource: IResource<
  "test", // Using existing resource name for compatibility
  any,
  string,
  typeof postActions
> = {
  name: "test",
  label: "Post",
  actions: postActions,
};

/**
 * Extract action names - TypeScript infers: "read" | "create" | "publish" | "unpublish"
 */
type PostActionNames = IResourceActionNames<typeof postActions>;

// ============================================================================
// EXAMPLE 3: Type-safe action handlers
// ============================================================================

/**
 * Generic action handler that is type-safe for specific resources
 */
function createActionHandler<
  R extends IResource,
  A extends IResourceGetActionNames<R>,
>(resource: R, actionName: A) {
  const action = resource.actions[actionName];
  return {
    execute: () =>
      console.log(`Executing ${action?.label} on ${resource.label}`),
    getMeta: () => action,
  };
}

/**
 * Usage with full type safety
 */
const userReadHandler = createActionHandler(userResource, "read");
// TypeScript knows actionName must be "read" | "create" | "update" | "archive"

const postPublishHandler = createActionHandler(postResource, "publish");
// TypeScript knows actionName must be "read" | "create" | "publish" | "unpublish"

// These would cause TypeScript errors:
// createActionHandler(userResource, "publish"); // Error: "publish" not in user actions
// createActionHandler(postResource, "archive"); // Error: "archive" not in post actions

// ============================================================================
// EXAMPLE 4: Runtime action iteration with type safety
// ============================================================================

/**
 * Function that iterates over all actions of a resource with full type safety
 */
function getAllActionLabels<R extends IResource>(resource: R) {
  const actionNames = Object.keys(
    resource.actions
  ) as IResourceGetActionNames<R>[];
  return actionNames.map((actionName) => ({
    name: actionName,
    label: resource.actions[actionName]?.label,
  }));
}

/**
 * Usage - returns properly typed array
 */
const userActionLabels = getAllActionLabels(userResource);
// TypeScript knows this is: Array<{ name: "read" | "create" | "update" | "archive"; label?: string }>

const postActionLabels = getAllActionLabels(postResource);
// TypeScript knows this is: Array<{ name: "read" | "create" | "publish" | "unpublish"; label?: string }>

// ============================================================================
// EXAMPLE 5: Permission system with type safety
// ============================================================================

/**
 * Permission record that maps resources to their allowed actions
 */
type IPermissions<R extends IResource> = {
  [K in IResourceGetActionNames<R>]?: boolean;
};

/**
 * Permission checker that is type-safe for specific resources
 */
class PermissionChecker<R extends IResource> {
  private permissions: IPermissions<R>;

  constructor(permissions: IPermissions<R>) {
    this.permissions = permissions;
  }

  hasPermission(action: IResourceGetActionNames<R>): boolean {
    return this.permissions[action] ?? false;
  }

  grantPermission(action: IResourceGetActionNames<R>): void {
    this.permissions[action] = true;
  }
}

/**
 * Usage with full type safety
 */
const userPermissions = new PermissionChecker<typeof userResource>({
  read: true,
  create: true,
  // archive: false (optional)
});

userPermissions.hasPermission("read"); // true
userPermissions.hasPermission("archive"); // false
userPermissions.grantPermission("archive"); // Type-safe

// These would cause TypeScript errors:
// userPermissions.hasPermission("publish"); // Error: "publish" not in user actions
// userPermissions.grantPermission("nonexistent"); // Error: invalid action

// ============================================================================
// EXAMPLE 6: Backward compatibility with default actions
// ============================================================================

/**
 * Resource using default actions (backward compatible)
 */
const legacyResource: IResource = {
  name: "test",
  label: "Legacy Resource",
  actions: {
    read: { label: "Read" },
    create: { label: "Create" },
    // Partial - not all default actions required
  },
};

/**
 * Still works with the new system
 */
type LegacyActionNames = IResourceGetActionNames<typeof legacyResource>;
// TypeScript infers: "read" | "create"

// ============================================================================
// EXAMPLE 7: Advanced usage - conditional actions based on resource type
// ============================================================================

/**
 * Different action sets for different resource types
 */
type ContentActions = {
  read: IResourceAction;
  create: IResourceAction;
  update: IResourceAction;
  publish: IResourceAction;
  unpublish: IResourceAction;
};

type UserActions = {
  read: IResourceAction;
  create: IResourceAction;
  update: IResourceAction;
  archive: IResourceAction;
  suspend: IResourceAction;
};

/**
 * Content resource (posts, articles, etc.)
 */
const articleResource: IResource<"test", any, string, ContentActions> = {
  name: "test",
  label: "Article",
  actions: {
    read: { label: "Read Article" },
    create: { label: "Create Article" },
    update: { label: "Update Article" },
    publish: { label: "Publish Article" },
    unpublish: { label: "Unpublish Article" },
  },
};

/**
 * User management resource
 */
const adminUserResource: IResource<"test", any, string, UserActions> = {
  name: "test",
  label: "Admin User",
  actions: {
    read: { label: "Read User" },
    create: { label: "Create User" },
    update: { label: "Update User" },
    archive: { label: "Archive User" },
    suspend: { label: "Suspend User" },
  },
};

/**
 * Generic function that works with any resource type
 */
function createResourceManager<R extends IResource>(resource: R) {
  return {
    getActionNames: (): IResourceGetActionNames<R>[] => {
      return Object.keys(resource.actions) as IResourceGetActionNames<R>[];
    },

    canPerformAction: (action: IResourceGetActionNames<R>): boolean => {
      // Implementation would check permissions
      return true;
    },

    executeAction: (action: IResourceGetActionNames<R>) => {
      const actionMeta = resource.actions[action];
      console.log(`Executing ${actionMeta?.label} on ${resource.label}`);
    },
  };
}

/**
 * Usage with different resource types
 */
const articleManager = createResourceManager(articleResource);
const userManager = createResourceManager(adminUserResource);

// Type-safe operations
articleManager.canPerformAction("publish"); // ✓ Valid for articles
//articleManager.canPerformAction("suspend"); // ✗ TypeScript error: suspend not in article actions

userManager.canPerformAction("suspend"); // ✓ Valid for users
//userManager.canPerformAction("publish"); // ✗ TypeScript error: publish not in user actions

// ============================================================================
// SUMMARY
// ============================================================================

/**
 * Key Benefits:
 *
 * 1. **Key Inference**: TypeScript infers exact action names instead of generic strings
 *    - Before: Record<string, IResourceAction> → keyof = string
 *    - After: Specific record type → keyof = "read" | "create" | "customAction"
 *
 * 2. **Type Safety**: Actions are checked at compile time
 *    - Invalid action names cause TypeScript errors
 *    - IDE autocomplete shows only valid actions
 *
 * 3. **Backward Compatibility**: Still satisfies Record<string, IResourceAction>
 *    - Can be used in generic functions expecting Record<string, IResourceAction>
 *    - Existing code continues to work
 *
 * 4. **Runtime Safety**: Action names can be extracted and iterated safely
 *    - Object.keys() returns properly typed arrays
 *    - No need for type assertions or casting
 *
 * 5. **Flexible**: Supports both default actions and custom action sets
 *    - Resources can have different action combinations
 *    - Easy to extend with new actions
 */

export {
  adminUserResource,
  articleResource,
  createActionHandler,
  createResourceManager,
  getAllActionLabels,
  PermissionChecker,
  postResource,
  userResource,
};
