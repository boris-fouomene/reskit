# Advanced Usage Guide

This document covers advanced features of the Validator system including custom rules, context-aware validation, async rules, nested validation, and performance optimization.

## Table of Contents

1. [Custom Validation Rules](#custom-validation-rules)
2. [Context-Aware Validation](#context-aware-validation)
3. [Async Validation Rules](#async-validation-rules)
4. [Nested Object Validation](#nested-object-validation)
5. [Multi-Rule Composition](#multi-rule-composition)
6. [Error Handling & Customization](#error-handling--customization)
7. [Performance Optimization](#performance-optimization)
8. [TypeScript & Type Safety](#typescript--type-safety)

---

## Custom Validation Rules

### Registering a Custom Rule

Custom rules are registered once and can be used throughout your application.

```typescript
import { Validator } from "@resk/core/validator";

// Simple custom rule
Validator.registerRule("StrongPassword", ({ value, i18n }) => {
  if (typeof value !== "string") {
    return i18n.t("validator.string", { fieldName: "password" });
  }

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasSpecialChars = /[!@#$%^&*()_+=\[\]{};:'",.<>?/\\|`~]/.test(value);

  if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars)) {
    return "Password must contain uppercase, lowercase, numbers, and special characters";
  }

  return true;
});

// Use with decorator
class UserForm {
  @IsRequired
  @MinLength([12])
  @Validator.buildPropertyDecorator(["StrongPassword"])
  password: string;
}
```

### Rule with Parameters

```typescript
Validator.registerRule("MaxWords", ({ value, ruleParams }) => {
  const maxWords = ruleParams?.[0] || 100;
  const wordCount = (value || "").split(/\s+/).length;

  if (wordCount > maxWords) {
    return `Must not exceed ${maxWords} words (current: ${wordCount})`;
  }

  return true;
});

// Usage
class BlogPost {
  @Validator.buildRuleDecorator<[maxWords: number]>(({ value, ruleParams }) => {
    const maxWords = ruleParams?.[0] || 100;
    const wordCount = (value || "").split(/\s+/).length;
    return wordCount <= maxWords || `Must not exceed ${maxWords} words`;
  })
  excerpt: string;
}

// Or with decorator helper
const MaxWords = Validator.buildRuleDecorator<[maxWords: number]>(
  ({ value, ruleParams }) => {
    const maxWords = ruleParams?.[0] || 100;
    const wordCount = (value || "").split(/\s+/).length;
    return wordCount <= maxWords || `Must not exceed ${maxWords} words`;
  }
);

class Article {
  @MaxWords([50])
  summary: string;

  @MaxWords([200])
  description: string;
}
```

### Rule with Context

Create rules that use validation context for advanced scenarios.

```typescript
interface ValidationContext {
  userId: number;
  userRole: "admin" | "user" | "moderator";
  permissions: string[];
  isVerified: boolean;
}

Validator.registerRule("AdminEmail", ({ value, context }) => {
  const ctx = context as ValidationContext;

  // Only admins can use @admin.com addresses
  if (value?.endsWith("@admin.com")) {
    if (ctx?.userRole !== "admin") {
      return "Only administrators can use @admin.com addresses";
    }
  }

  return true;
});

// Usage
class User {
  @IsRequired
  @IsEmail
  @Validator.buildPropertyDecorator(["AdminEmail"])
  email: string;
}

// Validate with context
const result = await Validator.validateTarget(User, {
  data: { email: "user@admin.com" },
  context: {
    userId: 123,
    userRole: "user",
    permissions: ["read", "write"],
    isVerified: true,
  },
});
```

### Rule with Dependencies

```typescript
Validator.registerRule("MatchPassword", ({ value, data }) => {
  if (value !== data?.password) {
    return "Passwords do not match";
  }
  return true;
});

class PasswordForm {
  @IsRequired
  @MinLength([8])
  password: string;

  @IsRequired
  @Validator.buildPropertyDecorator(["MatchPassword"])
  confirmPassword: string;
}

// Both fields are validated; confirmPassword checks if it matches password
const result = await Validator.validateTarget(PasswordForm, {
  data: {
    password: "SecurePass123",
    confirmPassword: "SecurePass123",
  },
});
```

---

## Context-Aware Validation

### Type-Safe Context

Define typed contexts for complex validation scenarios.

```typescript
interface UserContext {
  userId: number;
  userRole: "admin" | "user" | "moderator";
  permissions: string[];
  subscriptionLevel: "free" | "pro" | "enterprise";
  isVerified: boolean;
}

// Custom rule using typed context
Validator.registerRule("RequiresProSubscription", ({ value, context }) => {
  const ctx = context as UserContext;

  if (
    ctx?.subscriptionLevel !== "pro" &&
    ctx?.subscriptionLevel !== "enterprise"
  ) {
    return "This feature requires a Pro subscription";
  }

  return true;
});

class Feature {
  @Validator.buildPropertyDecorator(["RequiresProSubscription"])
  premiumFeatureId: string;
}

// Type-safe validation
const result = await Validator.validateTarget<UserContext>(Feature, {
  data: { premiumFeatureId: "feature_123" },
  context: {
    userId: 456,
    userRole: "user",
    permissions: ["basic"],
    subscriptionLevel: "free", // ❌ Will fail validation
    isVerified: true,
  },
});
```

### Permission-Based Validation

```typescript
Validator.registerRule(
  "RequiresPermission",
  ({ value, context, ruleParams }) => {
    const requiredPermission = ruleParams?.[0];
    const ctx = context as UserContext;

    if (!ctx?.permissions?.includes(requiredPermission)) {
      return `Missing required permission: ${requiredPermission}`;
    }

    return true;
  }
);

const RequiresPermission = Validator.buildRuleDecorator<[permission: string]>(
  ({ value, context, ruleParams }) => {
    const requiredPermission = ruleParams?.[0];
    const ctx = context as UserContext;

    if (!ctx?.permissions?.includes(requiredPermission)) {
      return `Missing required permission: ${requiredPermission}`;
    }

    return true;
  }
);

class AdminOperation {
  @RequiresPermission(["admin:write"])
  adminSettingId: string;

  @RequiresPermission(["user:delete"])
  userIdToDelete: number;
}

// Validate with permissions
const result = await Validator.validateTarget<UserContext>(AdminOperation, {
  data: { adminSettingId: "setting_1", userIdToDelete: 123 },
  context: {
    userId: 456,
    userRole: "moderator",
    permissions: ["user:delete"], // Has user:delete but not admin:write
    subscriptionLevel: "enterprise",
    isVerified: true,
  },
});
```

### Role-Based Validation

```typescript
Validator.registerRule("AdminOnly", ({ context }) => {
  const ctx = context as UserContext;

  if (ctx?.userRole !== "admin") {
    return "This action is restricted to administrators";
  }

  return true;
});

const AdminOnly = Validator.buildPropertyDecorator(["AdminOnly"]);

class AdminOnly {
  @AdminOnly
  @IsRequired
  securitySetting: string;
}

// Admin can validate
await Validator.validateTarget<UserContext>(AdminOnly, {
  data: { securitySetting: "value" },
  context: { userRole: "admin" }, // ✅ Passes
});

// Non-admin cannot
await Validator.validateTarget<UserContext>(AdminOnly, {
  data: { securitySetting: "value" },
  context: { userRole: "user" }, // ❌ Fails
});
```

---

## Async Validation Rules

### Async Rule Examples

```typescript
// Check if username is available (API call)
Validator.registerRule("UniqueUsername", async ({ value }) => {
  try {
    const response = await fetch(`/api/check-username?username=${value}`);
    const data = await response.json();

    if (data.taken) {
      return `Username "${value}" is already taken`;
    }

    return true;
  } catch (error) {
    return "Unable to verify username availability";
  }
});

// Check if email is already registered
Validator.registerRule("UniqueEmail", async ({ value }) => {
  const userExists = await checkUserByEmail(value);

  if (userExists) {
    return `Email "${value}" is already registered`;
  }

  return true;
});

// Verify email via confirmation code (async)
Validator.registerRule("ValidConfirmationCode", async ({ value, context }) => {
  const ctx = context as { emailId: string };

  const isValid = await verifyConfirmationCode(ctx.emailId, value);

  if (!isValid) {
    return "Invalid or expired confirmation code";
  }

  return true;
});

class UserRegistration {
  @IsRequired
  @MinLength([3])
  @MaxLength([30])
  @Validator.buildPropertyDecorator(["UniqueUsername"])
  username: string;

  @IsRequired
  @IsEmail
  @Validator.buildPropertyDecorator(["UniqueEmail"])
  email: string;

  @IsRequired
  @MinLength([6])
  password: string;
}

// Async validation (handle await)
const result = await Validator.validateTarget(UserRegistration, {
  data: {
    username: "john_doe",
    email: "john@example.com",
    password: "SecurePass123",
  },
});

if (!result.success) {
  console.error("Validation errors:", result.errors);
}
```

### Performance Considerations with Async

```typescript
// Good: Quick local checks first
class FormWithAsyncValidation {
  @IsRequired // Local check
  @MinLength([3]) // Local check
  @MaxLength([30]) // Local check
  @Validator.buildPropertyDecorator(["UniqueUsername"]) // API call (async)
  username: string;

  @IsRequired // Local check
  @IsEmail // Local check (fast regex)
  @Validator.buildPropertyDecorator(["UniqueEmail"]) // API call (async)
  email: string;
}

// Better: Control async validation timing
const localValidation = await Validator.validateTarget(
  FormWithAsyncValidation,
  {
    data: userInput,
    rules: ["Required", "MinLength[3]", "MaxLength[30]"], // Only local rules
  }
);

if (!localValidation.success) {
  return; // Don't make API calls if local validation fails
}

// Only if local validation passes, do expensive async checks
const asyncValidation = await Validator.validateTarget(
  FormWithAsyncValidation,
  {
    data: userInput,
    // Includes async rules
  }
);
```

---

## Nested Object Validation

### Simple Nested Objects

```typescript
class Address {
  @IsRequired
  @IsString
  street: string;

  @IsRequired
  @IsString
  city: string;

  @IsRequired
  @IsString
  postalCode: string;

  @IsOptional
  @IsString
  country?: string;
}

class User {
  @IsRequired
  @IsString
  name: string;

  @IsRequired
  @IsEmail
  email: string;

  @ValidateNested([Address])
  address: Address;
}

// Validate nested object
const result = await Validator.validateTarget(User, {
  data: {
    name: "John Doe",
    email: "john@example.com",
    address: {
      street: "123 Main St",
      city: "Springfield",
      postalCode: "12345",
    },
  },
});

if (!result.success) {
  // Errors include nested path information
  result.errors.forEach((error) => {
    console.error(error.propertyName, error.message);
  });
}
```

### Multiple Nested Objects

```typescript
class Phone {
  @IsRequired
  @IsPhoneNumber()
  number: string;

  @IsOptional
  @IsString
  label?: string; // e.g., "home", "work"
}

class Email {
  @IsRequired
  @IsEmail
  address: string;

  @IsOptional
  @IsString
  label?: string;
}

class Contact {
  @IsRequired
  @ValidateNested([Phone])
  phone: Phone;

  @IsRequired
  @ValidateNested([Email])
  email: Email;

  @IsOptional
  @IsArray
  @ValidateNested([Phone])
  alternatePhones?: Phone[];
}

// Validate multiple nested objects
const result = await Validator.validateTarget(Contact, {
  data: {
    phone: {
      number: "+1-234-567-8900",
      label: "home",
    },
    email: {
      address: "user@example.com",
      label: "work",
    },
    alternatePhones: [
      { number: "+1-555-123-4567", label: "mobile" },
      { number: "+1-555-987-6543", label: "office" },
    ],
  },
});
```

### Deeply Nested Objects

```typescript
class Coordinates {
  @IsRequired
  @IsNumber
  latitude: number;

  @IsRequired
  @IsNumber
  longitude: number;
}

class Location {
  @IsRequired
  @IsString
  name: string;

  @IsRequired
  @ValidateNested([Coordinates])
  coordinates: Coordinates;
}

class Event {
  @IsRequired
  @IsString
  title: string;

  @IsRequired
  @IsDate
  date: Date;

  @IsRequired
  @ValidateNested([Location])
  location: Location;
}

// Multiple levels of nesting
const result = await Validator.validateTarget(Event, {
  data: {
    title: "Tech Conference",
    date: new Date("2024-06-15"),
    location: {
      name: "Convention Center",
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
  },
});
```

### Arrays of Nested Objects

```typescript
class OrderItem {
  @IsRequired
  @IsString
  productId: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  quantity: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  price: number;
}

class Order {
  @IsRequired
  @IsString
  orderId: string;

  @IsRequired
  @IsDate
  orderDate: Date;

  @IsRequired
  @IsArray
  @ArrayMinLength([1]) // At least one item
  @ArrayOf(["ValidateNested[[OrderItem]]"]) // Each item is OrderItem
  items: OrderItem[];

  @IsOptional
  @IsString
  notes?: string;
}

// Validate order with multiple items
const result = await Validator.validateTarget(Order, {
  data: {
    orderId: "ORD-12345",
    orderDate: new Date(),
    items: [
      { productId: "PROD-1", quantity: 2, price: 29.99 },
      { productId: "PROD-2", quantity: 1, price: 49.99 },
    ],
  },
});
```

---

## Multi-Rule Composition

### OneOf - Alternative Validations

```typescript
import { OneOf } from "@resk/core/validator";

// User can identify by email, phone, or username
class UserIdentifier {
  @OneOf([
    "Email",
    "PhoneNumber",
    ({ value }) => /^@?\w{3,30}$/.test(value) || "Invalid username format",
  ])
  identifier: string;
}

// Product can be identified by SKU, ISBN, or UPC
class ProductIdentifier {
  @OneOf([
    "UUID",
    ({ value }) => /^SKU-\d{6}$/.test(value) || "Invalid SKU format",
    ({ value }) => /^\d{13}$/.test(value) || "Invalid ISBN-13 format",
  ])
  productId: string;
}

// Accept JSON string, JavaScript object, or already parsed data
class FlexibleData {
  @OneOf([
    "JSON",
    ({ value }) => typeof value === "object" || "Must be JSON or object",
  ])
  data: string | object;
}
```

### AllOf - Multiple Constraints

```typescript
import { AllOf } from "@resk/core/validator";

// Password must satisfy multiple requirements
class StrictPassword {
  @AllOf([
    "MinLength[12]",
    "NonNullString",
    ({ value }) => /[A-Z]/.test(value) || "Must contain uppercase",
    ({ value }) => /[a-z]/.test(value) || "Must contain lowercase",
    ({ value }) => /\d/.test(value) || "Must contain number",
    ({ value }) => /[!@#$%^&*]/.test(value) || "Must contain special character",
    ({ value }) => !/\s/.test(value) || "Cannot contain spaces",
  ])
  password: string;
}

// URL must be valid AND be HTTPS
class SecureUrl {
  @AllOf([
    "URL",
    ({ value }) => value.startsWith("https://") || "Must use HTTPS protocol",
    ({ value }) =>
      !value.includes("localhost") || "Cannot use localhost in production",
    ({ value }) => value.length <= 2048 || "URL too long",
  ])
  secureEndpoint: string;
}

// Email must be valid AND not be from blocked domains
class RestrictedEmail {
  @AllOf([
    "Email",
    ({ value }) => {
      const blockedDomains = ["example.com", "test.com", "temp-mail.com"];
      const domain = value.split("@")[1];
      return !blockedDomains.includes(domain) || `Domain ${domain} is blocked`;
    },
  ])
  corporateEmail: string;
}
```

### ArrayOf - Collection Validation

```typescript
import { ArrayOf } from "@resk/core/validator";

// All items in array must be valid emails
class EmailList {
  @IsArray
  @ArrayMinLength([1])
  @ArrayUnique
  @ArrayOf(["Email"])
  recipients: string[];

  @IsArray
  @ArrayMaxLength([5])
  @ArrayOf(["Email"])
  ccs?: string[];
}

// All items must be positive integers
class NumberList {
  @IsArray
  @ArrayOf(["Number", "Integer", "NumberGreaterThan[0]"])
  positiveNumbers: number[];
}

// Complex: all items must match multiple rules
class StrictList {
  @IsArray
  @ArrayUnique
  @ArrayOf([
    "MinLength[3]",
    "MaxLength[50]",
    ({ value }) => !/\d/.test(value) || "Cannot contain numbers",
  ])
  tags: string[];
}
```

### Combining Multiple Strategies

```typescript
import { OneOf, AllOf, ArrayOf } from "@resk/core/validator";

class ComplexForm {
  // Flexible ID: UUID, custom format, or email-based
  @OneOf(["UUID", ({ value }) => /^ORG-\d{6}$/.test(value), "Email"])
  organizationId: string;

  // Strict passwords
  @AllOf([
    "MinLength[12]",
    ({ value }) => /[A-Z]/.test(value),
    ({ value }) => /[a-z]/.test(value),
    ({ value }) => /\d/.test(value),
    ({ value }) => /[!@#$%]/.test(value),
  ])
  password: string;

  // Array of emails with multiple constraints
  @IsArray
  @ArrayMinLength([1])
  @ArrayMaxLength([10])
  @ArrayOf(["Email"])
  recipients: string[];

  // Either phone or email (multi-rule)
  @OneOf(["PhoneNumber", "Email"])
  primaryContact: string;
}
```

---

## Error Handling & Customization

### Custom Error Message Builder

```typescript
// Customize how error messages are formatted
const result = await Validator.validateTarget(UserForm, {
  data: userData,
  errorMessageBuilder: (translatedPropertyName, errorMessage, options) => {
    // Format: "Field Name [RULE]: error message"
    return `${translatedPropertyName} [${options.ruleName}]: ${errorMessage}`;
  },
});
```

### Error Grouping

```typescript
// Group errors by field
const result = await Validator.validateTarget(UserForm, {
  data: userData,
});

if (!result.success) {
  const errorsByField = result.errors.reduce((acc, error) => {
    if (!acc[error.propertyName]) {
      acc[error.propertyName] = [];
    }
    acc[error.propertyName].push(error);
    return acc;
  }, {});

  for (const [field, errors] of Object.entries(errorsByField)) {
    console.error(`${field}:`);
    errors.forEach((error) => {
      console.error(`  - ${error.message}`);
    });
  }
}
```

### Error Filtering

```typescript
// Filter by severity or rule type
if (!result.success) {
  // Only show critical errors (type mismatches)
  const criticalErrors = result.errors.filter((e) =>
    ["Email", "URL", "Date"].includes(e.ruleName)
  );

  // Show all errors except optional field warnings
  const validationErrors = result.errors.filter(
    (e) => !e.message.includes("optional")
  );
}
```

### Try-Catch Patterns

```typescript
async function validateUserRegistration(userData) {
  try {
    const result = await Validator.validateTarget(UserForm, {
      data: userData,
    });

    if (!result.success) {
      // Handle validation errors
      return {
        success: false,
        errors: result.errors,
        statusCode: 422,
      };
    }

    // Validation passed
    return {
      success: true,
      data: result.data,
      statusCode: 200,
    };
  } catch (error) {
    // Handle unexpected errors
    console.error("Validation system error:", error);
    return {
      success: false,
      error: "Unexpected validation error",
      statusCode: 500,
    };
  }
}
```

---

## Performance Optimization

### Short-Circuit Local Validation

```typescript
// Validate only critical/local rules first
const localValidation = await Validator.validate({
  value: userData.email,
  rules: ["Required", "Email"], // Fast regex checks
});

if (!localValidation.success) {
  throw new ValidationError(localValidation.error);
}

// Only if local validation passes, check async/expensive rules
const fullValidation = await Validator.validate({
  value: userData.email,
  rules: [
    "Required",
    "Email",
    "UniqueEmail", // Async API call
  ],
});
```

### Batch Validation with Parallel Execution

```typescript
// Validate multiple objects in parallel
const users = [
  { name: "John", email: "john@example.com" },
  { name: "Jane", email: "jane@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

const results = await Promise.allSettled(
  users.map((user) => Validator.validateTarget(UserForm, { data: user }))
);

const successful = results
  .filter((r) => r.status === "fulfilled" && r.value.success)
  .map((r) => r.value.data);

const failed = results
  .filter((r) => r.status === "fulfilled" && !r.value.success)
  .map((r) => r.value);
```

### Lazy Validation

```typescript
// Validate only changed fields
class FormState {
  private validationCache = new Map();
  private changedFields = new Set();

  async validateField(fieldName, value) {
    const cacheKey = `${fieldName}:${JSON.stringify(value)}`;

    // Return cached result
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey);
    }

    // Validate and cache
    const result = await Validator.validate({
      value,
      rules: this.getFieldRules(fieldName),
    });

    this.validationCache.set(cacheKey, result);
    return result;
  }

  private getFieldRules(fieldName) {
    // Return rules based on field
    const rulesMap = {
      email: ["Required", "Email"],
      password: ["Required", "MinLength[8]"],
    };
    return rulesMap[fieldName] || [];
  }
}
```

---

## TypeScript & Type Safety

### Generic Type Parameters

```typescript
// Type-safe single value validation
interface ValidationContext {
  userId: number;
}

const result = await Validator.validate<ValidationContext>({
  value: "test@example.com",
  rules: ["Email"],
  context: {
    userId: 123, // TypeScript ensures correct context type
  },
});

// Type-safe class validation
const classResult = await Validator.validateTarget<UserForm, ValidationContext>(
  UserForm,
  {
    data: {
      /* ... */
    },
    context: { userId: 123 }, // TypeScript validates
  }
);
```

### Custom Type Helpers

```typescript
type ValidationRules<T> = {
  [K in keyof T]: IValidatorRules;
};

// Define type-safe rules for a class
const userRules: ValidationRules<User> = {
  email: ["Required", "Email"],
  name: ["Required", "MinLength[2]"],
  age: ["Optional", "Number"],
};

// Custom validation factory
async function validateUser<T extends User>(
  data: T
): Promise<IValidatorValidateResult> {
  return Validator.validateTarget(User, { data });
}
```

### Utility Types

```typescript
// Extract error type
type ValidationError = IValidatorValidationError;

// Extract result type
type ValidateResult<T> = IValidatorValidateResult<T>;

// Extract options type
type ValidateOptions<T> = IValidatorValidateOptions<T>;

// Create validation-specific types
type EmailValidator = (options: IValidatorValidateOptions) => IValidatorResult;

type CustomRule<T extends any[]> = (
  options: IValidatorValidateOptions<T>
) => IValidatorResult;
```

---

For comprehensive examples and real-world use cases, see [05-EXAMPLES.md](05-EXAMPLES.md).
