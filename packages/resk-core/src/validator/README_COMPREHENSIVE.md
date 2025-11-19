# 🔍 Validator Module - Complete User Guide

A powerful, type-safe validation library for TypeScript/JavaScript with support for single-value validation, decorator-based class validation, custom rules, internationalization, and async validation.

**Table of Contents**

- [🌟 Features](#-features)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [📋 Validation Results & Error Handling](#-validation-results--error-handling)
- [🎯 Single-Value Validation](#-single-value-validation)
- [🏛️ Class-Based Validation with Decorators](#-class-based-validation-with-decorators)
- [📚 Complete Rules Reference](#-complete-rules-reference)
- [✨ Advanced Features](#-advanced-features)
- [🛠️ Custom Rules & Decorators](#-custom-rules--decorators)
- [🌍 Internationalization (i18n)](#-internationalization-i18n)
- [💡 Best Practices](#-best-practices)
- [🔗 Complete Examples](#-complete-examples)

---

## 🌟 Features

✅ **Type-Safe** - Full TypeScript support with discriminated unions for type narrowing  
✅ **Flexible** - Single-value and class-based validation  
✅ **Decorators** - Use property decorators for elegant class validation  
✅ **Async Support** - Built-in async rule support for database queries, API calls, etc.  
✅ **Internationalization** - Localized error messages (i18n)  
✅ **Extensible** - Register custom rules and create custom decorators  
✅ **Context-Aware** - Pass context to rules for dynamic validation  
✅ **Error Accumulation** - Multi-field validation accumulates all errors  
✅ **Performance** - Parallel field validation with timing information

---

## 📦 Installation

```bash
npm install resk-core
```

Or with yarn:

```bash
yarn add resk-core
```

---

## 🚀 Quick Start

### Validate a Single Value

```typescript
import { Validator } from "resk-core";

// Simple validation
const result = await Validator.validate({
  value: "user@example.com",
  rules: ["Required", "Email"],
});

if (result.success) {
  console.log("Valid email:", result.value);
} else {
  console.error("Error:", result.message);
}
```

### Validate a Class with Decorators

```typescript
import { Validator, IsRequired, IsEmail, IsMinLength } from "resk-core";

class UserForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([8])
  password: string;
}

const userData = {
  email: "user@example.com",
  password: "SecurePass123",
};

const result = await Validator.validateTarget(UserForm, userData);

if (result.success) {
  console.log("All fields valid!", result.data);
} else {
  console.error("Validation errors:", result.errors);
}
```

### Advanced Validation Examples

```typescript
import { Validator, IsArray, ArrayMinLength, IsDate, FutureDate, IsFile, MaxFileSize, IsUUID } from "resk-core";

// Array validation
const arrayResult = await Validator.validate({
  value: [1, 2, 3, 4, 5],
  rules: ["Array", "ArrayMinLength[3]"],
});

// Date validation
const dateResult = await Validator.validate({
  value: "2024-12-25",
  rules: ["Date", "FutureDate"],
});

// File validation (with file object)
const fileResult = await Validator.validate({
  value: fileObject,
  rules: ["File", "MaxFileSize[1024000]"], // Max 1MB
});

// Format validation
const uuidResult = await Validator.validate({
  value: "550e8400-e29b-41d4-a716-446655440000",
  rules: ["UUID"],
});

// Class with new validation rules
class ProductForm {
  @IsRequired
  @IsArray
  @ArrayMinLength([1])
  tags: string[];

  @IsDate
  @IsFutureDate
  releaseDate: string;

  @IsFile
  @MaxFileSize([2097152]) // 2MB max
  image: File;

  @IsUUID
  productId: string;
}
```

---

## 📋 Validation Results & Error Handling

### Understanding the Result Object

The Validator uses an **Either pattern** (discriminated union) for type-safe error handling. Every validation returns one of two types:

#### ✅ Success Result

```typescript
{
  success: true,
  value: T,                    // Original value (single validation)
  data: T,                     // Class instance (target validation)
  validatedAt: Date,           // Timestamp
  duration: number,            // Milliseconds
  context?: Context,           // Optional context
  status: "success"
}
```

#### ❌ Failure Result

```typescript
{
  success: false,
  message: string,             // Summary message
  error?: ValidationError,     // Single value error
  errors?: ValidationError[],  // Multiple errors (target validation)
  failureCount?: number,       // Number of failed fields
  failedAt: Date,              // Timestamp
  duration: number,            // Milliseconds
  context?: Context,           // Optional context
  status: "error"
}
```

### Type Narrowing Patterns

**Pattern 1: Check `success` property**

```typescript
const result = await Validator.validate({
  value: "test@example.com",
  rules: ["Email"],
});

if (result.success) {
  // result is IValidatorValidateSuccess
  console.log(result.value); // Safe to access
  console.log(result.validatedAt);
} else {
  // result is IValidatorValidateFailure
  console.log(result.message); // Safe to access
  console.log(result.error);
}
```

**Pattern 2: Use switch on `status`**

```typescript
switch (result.status) {
  case "success":
    await saveToDatabase(result.data);
    break;
  case "error":
    logValidationError(result.message);
    break;
}
```

**Pattern 3: Use type guard helpers**

```typescript
if (Validator.isSuccess(result)) {
  // TypeScript knows it's success
  return result.value;
}
// TypeScript knows it's failure
throw new Error(result.message);
```

---

## 🎯 Single-Value Validation

Validate individual values with one or more rules.

### Basic Validation

```typescript
const result = await Validator.validate({
  value: "hello",
  rules: ["Required", "MinLength[3]"],
});
```

### With Field Identification

```typescript
const result = await Validator.validate({
  value: "user@example.com",
  rules: ["Email"],
  fieldName: "email_input", // HTML field ID
  propertyName: "email", // Object property
  message: "Invalid email address", // Custom error message
});
```

### With Context

```typescript
interface AdminContext {
  userId: number;
  permissions: string[];
}

const result = await Validator.validate<any, AdminContext>({
  value: "admin",
  rules: ["HasPermission"],
  context: {
    userId: 1,
    permissions: ["user", "admin"],
  },
});
```

### Using Custom Rule Functions

```typescript
const result = await Validator.validate({
  value: "test",
  rules: [
    "Required",
    ({ value }) => value.length > 3 || "Must be longer than 3 characters",
    async ({ value }) => {
      const exists = await checkUsernameExists(value);
      return !exists || "Username already taken";
    },
  ],
});
```

---

## 🏛️ Class-Based Validation with Decorators

Validate entire objects with multiple decorated fields in a single call.

### Basic Class Validation

```typescript
import { IsRequired, IsEmail, IsMinLength } from "resk-core";

class LoginForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([8])
  password: string;
}

const data = {
  email: "user@example.com",
  password: "SecurePass123",
};

const result = await Validator.validateTarget(LoginForm, data);

if (result.success) {
  console.log("Login form valid:", result.data);
} else {
  result.errors.forEach((error) => {
    console.error(`${error.propertyName}: ${error.message}`);
  });
}
```

### Handling Multiple Errors

```typescript
const result = await Validator.validateTarget(LoginForm, {
  email: "invalid-email", // Will fail Email rule
  password: "short", // Will fail MinLength rule
});

if (!result.success) {
  // result.failureCount === 2
  // result.errors.length === 2

  result.errors.forEach((error) => {
    console.error(`[${error.propertyName}]: ${error.message}`);
    // Output:
    // [email]: Must be a valid email address
    // [password]: Must be at least 8 characters
  });
}
```

### Stacking Decorators

```typescript
class UserProfile {
  @IsRequired
  @IsEmail
  @MaxLength([255])
  email: string;

  @IsRequired
  @IsMinLength([3])
  @MaxLength([50])
  username: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  age: number;

  @IsNullable // Optional field
  @IsUrl
  website?: string;
}
```

---

## 📚 Complete Rules Reference

### String Rules

| Rule                | Parameters                | Description                                        | Example                       |
| ------------------- | ------------------------- | -------------------------------------------------- | ----------------------------- |
| **Required**        | None                      | Value must not be null, undefined, or empty string | `@IsRequired`                 |
| **Email**           | None                      | Must be a valid email address                      | `@IsEmail`                    |
| **MinLength**       | `[number]`                | Minimum character length                           | `@IsMinLength([8])`           |
| **MaxLength**       | `[number]`                | Maximum character length                           | `@IsMaxLength([50])`          |
| **Length**          | `[min, max]` or `[exact]` | Exact or range length                              | `@ Length([3, 10])`           |
| **Url**             | None                      | Must be a valid URL                                | `@IsUrl`                      |
| **NonNullString**   | None                      | Must be a non-empty string                         | `@IsNonNullString`            |
| **FileName**        | None                      | Valid filename (no forbidden chars)                | `@IsFileName`                 |
| **StartsWithOneOf** | `[strings...]`            | Value starts with one of the values                | `@StartsWith(['Mr.', 'Ms.'])` |
| **EndsWithOneOf**   | `[strings...]`            | Value ends with one of the values                  | `@EndsWith(['.jpg', '.png'])` |

### Numeric Rules

| Rule                         | Parameters | Description            | Example                             |
| ---------------------------- | ---------- | ---------------------- | ----------------------------------- |
| **Number**                   | None       | Value must be a number | `@IsNumber`                         |
| **NumberGreaterThan**        | `[number]` | Value > N              | `@IsNumberGreaterThan([0])`         |
| **NumberGreaterThanOrEqual** | `[number]` | Value >= N             | `@IsNumberGreaterThanOrEqual([18])` |
| **NumberLessThan**           | `[number]` | Value < N              | `@IsNumberLessThan([100])`          |
| **NumberLessThanOrEqual**    | `[number]` | Value <= N             | `@IsNumberLessThanOrEqual([100])`   |
| **NumberEqual**              | `[number]` | Value === N            | `@ IsNumberEqual([42])`             |
| **NumberIsDifferentFrom**    | `[number]` | Value !== N            | `@IsNumberNotEqual([0])`            |

### Boolean Rules

| Rule        | Parameters | Description             | Example      |
| ----------- | ---------- | ----------------------- | ------------ |
| **Boolean** | None       | Value must be a boolean | `@IsBoolean` |

### Enum Rules

| Rule       | Parameters    | Description                               | Example                           |
| ---------- | ------------- | ----------------------------------------- | --------------------------------- |
| **Enum**   | `[values...]` | Value must be one of the specified values | `@IsEnum(['active', 'inactive'])` |
| **Equals** | `[value]`     | Value must equal the specified value      | `@Equals(['password'])`           |

### Special Rules (Nullable)

| Rule         | Parameters | Description                       | Example       |
| ------------ | ---------- | --------------------------------- | ------------- |
| **Nullable** | None       | Skip validation if null/undefined | `@IsNullable` |
| **Empty**    | None       | Skip validation if empty string   | `@IsEmpty`    |
| **Optional** | None       | Skip validation if undefined      | `@IsOptional` |

### Contact Rules

| Rule                   | Parameters | Description                            | Example            |
| ---------------------- | ---------- | -------------------------------------- | ------------------ |
| **PhoneNumber**        | None       | Valid phone number (uses country code) | `@IsPhoneNumber()` |
| **EmailOrPhoneNumber** | None       | Valid email OR phone number            | `@IsEmailOrPhone`  |

### Array Rules

| Rule               | Parameters | Description                            | Example                    |
| ------------------ | ---------- | -------------------------------------- | -------------------------- |
| **Array**          | None       | Value must be an array                 | `@IsArray`                 |
| **ArrayMinLength** | `[number]` | Array must have at least N elements    | `@ArrayMinLength([3])`     |
| **ArrayMaxLength** | `[number]` | Array must have at most N elements     | `@ArrayMaxLength([10])`    |
| **ArrayLength**    | `[number]` | Array must have exactly N elements     | `@ArrayLength([5])`        |
| **ArrayContains**  | `[value]`  | Array must contain the specified value | `@ArrayContains(['item'])` |
| **ArrayUnique**    | None       | Array elements must be unique          | `@ArrayUnique`             |

### Date Rules

| Rule            | Parameters     | Description                              | Example                                        |
| --------------- | -------------- | ---------------------------------------- | ---------------------------------------------- |
| **Date**        | None           | Value must be a valid date               | `@IsDate`                                      |
| **DateAfter**   | `[date]`       | Date must be after the specified date    | `@IsDateAfter(['2023-01-01'])`                 |
| **DateBefore**  | `[date]`       | Date must be before the specified date   | `@IsDateBefore(['2023-12-31'])`                |
| **DateBetween** | `[start, end]` | Date must be between start and end dates | `@IsDateBetween(['2023-01-01', '2023-12-31'])` |
| **SameDate**    | `[date]`       | Date must equal the specified date       | `@IsSameDate(['2023-06-15'])`                  |
| **FutureDate**  | None           | Date must be in the future               | `@IsFutureDate`                                |
| **PastDate**    | None           | Date must be in the past                 | `@IsPastDate`                                  |

### File Rules

| Rule              | Parameters    | Description                            | Example                       |
| ----------------- | ------------- | -------------------------------------- | ----------------------------- |
| **File**          | None          | Value must be a valid file object      | `@IsFile`                     |
| **MaxFileSize**   | `[bytes]`     | File size must be exactly N bytes      | `@MaxFileSize([1024])`        |
| **FileType**      | `[mimeType]`  | File must have the specified MIME type | `@IsFileType(['image/jpeg'])` |
| **Image**         | None          | File must be a valid image             | `@IsImage`                    |
| **FileExtension** | `[extension]` | File must have the specified extension | `@IsFileExtension(['.jpg'])`  |
| **MinFileSize**   | `[bytes]`     | File size must be at least N bytes     | `@MinFileSize([100])`         |

### Format Rules

| Rule           | Parameters  | Description                                  | Example                |
| -------------- | ----------- | -------------------------------------------- | ---------------------- |
| **UUID**       | None        | Value must be a valid UUID                   | `@IsUUID`              |
| **JSON**       | None        | Value must be valid JSON                     | `@IsJSON`              |
| **Base64**     | None        | Value must be valid Base64 encoded           | `@IsBase64`            |
| **HexColor**   | None        | Value must be a valid hex color code         | `@IsHexColor`          |
| **CreditCard** | None        | Value must be a valid credit card number     | `@IsCreditCard`        |
| **IP**         | None        | Value must be a valid IP address             | `@IsIP`                |
| **MACAddress** | None        | Value must be a valid MAC address            | `@IsMACAddress`        |
| **Regex**      | `[pattern]` | Value must match the specified regex pattern | `@Regex(['^[A-Z]+$'])` |

---

## ✨ Advanced Features

### 1. Parallel Multi-Field Validation

When using `validateTarget`, all fields are validated in **parallel** for better performance:

```typescript
class User {
  @IsRequired
  @IsEmail // Validated in parallel
  email: string;

  @IsRequired
  @IsMinLength // Validated in parallel
  password: string;
}

// All fields validated simultaneously
const result = await Validator.validateTarget(User, userData);
console.log(result.duration); // Total time (not sum of individual times)
```

### 2. Context-Aware Validation

Pass contextual information to rules for dynamic validation:

```typescript
interface UserContext {
  userId: number;
  userRole: "user" | "admin" | "moderator";
  locale: string;
}

class AdminForm {
  @IsRequired
  @IsEmail
  email: string;
}

const result = await Validator.validateTarget<AdminForm, UserContext>(AdminForm, data, {
  context: {
    userId: 123,
    userRole: "admin",
    locale: "en",
  },
});
```

### 3. Custom Error Messages

Override default error messages:

```typescript
const result = await Validator.validate({
  value: "invalid-email",
  rules: ["Email"],
  message: "Please enter a valid email address (example: user@company.com)",
  propertyName: "email_address",
});
```

### 4. Timing Information

Every validation result includes performance timing:

```typescript
const result = await Validator.validateTarget(ComplexForm, data);

if (result.success) {
  console.log(`Validation completed in ${result.duration}ms`);
  console.log(`Validated at: ${result.validatedAt.toISOString()}`);
}
```

### 5. Chaining Multiple Rules

```typescript
const result = await Validator.validate({
  value: "test@example.com",
  rules: [
    "Required",
    "Email",
    async ({ value }) => {
      // Check if email is already registered
      const exists = await checkEmailExists(value);
      return !exists || "Email already registered";
    },
    ({ value }) => {
      // Custom business logic
      return !value.endsWith("@spam.com") || "Spam domain not allowed";
    },
  ],
});
```

---

## 🛠️ Custom Rules & Decorators

### Creating a Custom Rule Function

```typescript
// Define the rule logic
const isEvenNumber = ({ value }: IValidatorValidateOptions) => {
  if (typeof value !== "number") return false;
  return value % 2 === 0 || "Value must be an even number";
};

// Register the rule
Validator.registerRule("IsEven", isEvenNumber);

// Use in validation
const result = await Validator.validate({
  value: 4,
  rules: ["IsEven"],
});
```

### Creating a Property Decorator

```typescript
const isEvenNumber = ({ value }: IValidatorValidateOptions) => {
  return value % 2 === 0 || "Value must be an even number";
};

// Create decorator
const IsEven = Validator.createPropertyDecorator(["IsEven"]);

// Use in class
class NumberModel {
  @IsEven
  value: number;
}
```

### Creating a Parameterized Decorator

```typescript
// Rule function with parameters
const divisibleByRule = ({ value, ruleParams }: IValidatorValidateOptions<[number]>) => {
  const [divisor] = ruleParams;
  return value % divisor === 0 || `Value must be divisible by ${divisor}`;
};

// Register rule
Validator.registerRule("DivisibleBy", divisibleByRule);

// Create parameterized decorator
const IsDivisibleBy = Validator.createRuleDecorator<[number]>(divisibleByRule);

// Use in class
class NumberModel {
  @IsDivisibleBy([3])
  value: number;
}
```

### Creating an Async Custom Rule

```typescript
const uniqueUsernameRule = async ({ value }: IValidatorValidateOptions) => {
  const exists = await checkUsernameInDatabase(value);
  return !exists || "Username already taken";
};

// Register
Validator.registerRule("UniqueUsername", uniqueUsernameRule);

// Create decorator
const IsUniqueUsername = Validator.createPropertyDecorator(["UniqueUsername"]);

// Use it
class UserForm {
  @IsRequired
  @IsUniqueUsername
  username: string;
}
```

### Complex Custom Rule with Context

```typescript
interface ValidationContext {
  minAge: number;
  maxAge: number;
}

const ageInRangeRule = ({ value, context }: IValidatorValidateOptions<any, ValidationContext>) => {
  if (typeof value !== "number") return false;

  const { minAge, maxAge } = context;
  const isValid = value >= minAge && value <= maxAge;

  return isValid || `Age must be between ${minAge} and ${maxAge}`;
};

Validator.registerRule("AgeInRange", ageInRangeRule);

// Usage
const result = await Validator.validate<number, ValidationContext>({
  value: 25,
  rules: ["AgeInRange"],
  context: {
    minAge: 18,
    maxAge: 65,
  },
});
```

---

## 🌍 Internationalization (i18n)

The Validator supports multi-language error messages out of the box.

### Switching Locales

```typescript
import { i18n } from "resk-core/i18n";

// Set locale
await i18n.setLocale("fr"); // French
// or
await i18n.setLocale("es"); // Spanish

const result = await Validator.validate({
  value: "invalid",
  rules: ["Email"],
  // Error will be in the selected language
});
```

### Supported Locales

- `en` - English
- `fr` - French
- `es` - Spanish
- `de` - German
- And more...

### Custom Error Messages with i18n

```typescript
const result = await Validator.validate({
  value: "test@example.com",
  rules: ["Email"],
  message: i18n.t("customDomain.emailInvalid", {
    field: "email",
    value: "test@example.com",
  }),
});
```

---

## 💡 Best Practices

### 1. Use Discriminated Unions for Type Safety

```typescript
const result = await Validator.validate({...});

// ✅ Good - TypeScript narrows the type
if (result.success) {
  console.log(result.value); // Safe!
} else {
  console.log(result.message); // Safe!
}

// ❌ Avoid - Unsafe without type narrowing
console.log(result.value); // Might not exist!
```

### 2. Always Await Async Validation

```typescript
// ✅ Good
const result = await Validator.validate({...});

// ❌ Wrong - returns a Promise
Validator.validate({...}).then(result => {
  // Handle result
});
```

### 3. Stack Decorators for Comprehensive Validation

```typescript
class StrictForm {
  @IsRequired // First check: must exist
  @IsEmail // Then: must be email format
  @IsMaxLength([100]) // Finally: must not exceed length
  email: string;
}
```

### 4. Use Context for Dynamic Rules

```typescript
// Instead of inline logic:
// ❌ Hard to test and reuse
async ({ value }) => {
  const userRole = getUserRole(); // Implicit dependency
  return userRole === "admin" || "Admin only";
};

// ✅ Better - pass as context
async ({ value, context }) => {
  const { userRole } = context;
  return userRole === "admin" || "Admin only";
};
```

### 5. Handle Errors Meaningfully

```typescript
const result = await Validator.validateTarget(UserForm, data);

if (!result.success) {
  // Group errors by field for UI rendering
  const errorsByField = result.errors.reduce(
    (acc, err) => {
      if (!acc[err.propertyName]) {
        acc[err.propertyName] = [];
      }
      acc[err.propertyName].push(err.message);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Display to user
  Object.entries(errorsByField).forEach(([field, messages]) => {
    console.error(`${field}: ${messages.join(", ")}`);
  });
}
```

### 6. Reuse Validation Decorators

```typescript
// Define once
@IsRequired
@IsEmail
@IsMaxLength([255])
class EmailField {
  email: string;
}

// Use in multiple forms
class LoginForm {
  @IsRequired
  @IsEmail
  email: string;
}

class RegistrationForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsEmail
  confirmEmail: string;
}
```

---

## 🔗 Complete Examples

### Example 1: User Registration Form

```typescript
import { Validator, IsRequired, IsEmail, IsMinLength, IsMaxLength, IsNumberGreaterThanOrEqual } from "resk-core";

class RegistrationForm {
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  email: string;

  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  password: string;

  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  username: string;

  @IsRequired
  @IsNumberGreaterThanOrEqual([18])
  age: number;

  @IsNullable
  @IsUrl
  website?: string;
}

async function registerUser(formData: unknown) {
  const result = await Validator.validateTarget(RegistrationForm, formData);

  if (result.success) {
    console.log("Registration valid, creating account...");
    // result.data is properly typed as RegistrationForm
    await createUserAccount(result.data);
  } else {
    console.error(`Validation failed with ${result.failureCount} errors:`);
    result.errors.forEach((error) => {
      console.error(`  • ${error.propertyName}: ${error.message}`);
    });
  }
}
```

### Example 2: Custom Product Validation

```typescript
import { Validator, IsRequired, IsNumber, IsEnum } from "resk-core";

// Custom rule for inventory validation
Validator.registerRule("StockAvailable", async ({ value, context }) => {
  const minStock = context?.minStock || 0;
  return value > minStock || `Stock must be greater than ${minStock}`;
});

const IsStockAvailable = Validator.createRuleDecorator(["StockAvailable"]);

class Product {
  @IsRequired
  @IsMaxLength([100])
  name: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  price: number;

  @IsRequired
  @IsNumber
  @IsStockAvailable
  stock: number;

  @IsRequired
  @IsEnum(["active", "discontinued", "draft"])
  status: string;
}

async function createProduct(productData: unknown) {
  const result = await Validator.validateTarget(Product, productData, {
    context: { minStock: 1 },
  });

  if (result.success) {
    console.log("Product created:", result.data);
  } else {
    console.error("Product validation failed:", result.message);
  }
}
```

### Example 3: Context-Aware Permission Validation

```typescript
interface AdminContext {
  userId: number;
  userPermissions: string[];
  organizationId: number;
}

Validator.registerRule("AllowedAction", ({ value, context }: IValidatorValidateOptions<any, AdminContext>) => {
  const { userPermissions } = context;
  return userPermissions.includes(value) || `Permission '${value}' not granted`;
});

const IsAllowedAction = Validator.createPropertyDecorator(["AllowedAction"]);

class AdminAction {
  @IsRequired
  @IsAllowedAction
  action: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  resourceId: number;
}

async function performAdminAction(actionData: unknown, adminContext: AdminContext) {
  const result = await Validator.validateTarget<AdminAction, AdminContext>(AdminAction, actionData, { context: adminContext });

  if (result.success) {
    console.log(`Admin action '${result.data.action}' authorized`);
    // Perform the action
  } else {
    console.error(`Action denied: ${result.message}`);
  }
}
```

### Example 4: Conditional Validation with Nullable

```typescript
class OptionalProfileForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([3])
  username: string;

  // Optional fields - validation only if provided
  @IsOptional // Skip if undefined
  @IsUrl
  website?: string;

  @IsNullable // Skip if null/undefined
  @IsMinLength([10])
  bio?: string;

  @IsEmpty // Allow empty strings, validate otherwise
  @IsNumber
  favoriteNumber?: number;
}

async function updateProfile(formData: unknown) {
  const result = await Validator.validateTarget(OptionalProfileForm, formData);

  if (result.success) {
    console.log("Profile updated:", result.data);
  } else {
    result.errors.forEach((error) => {
      console.error(`${error.propertyName}: ${error.message}`);
    });
  }
}
```

### Example 5: Chained Async Validation

```typescript
async function registerUsername(username: string) {
  const result = await Validator.validate({
    value: username,
    rules: [
      "Required",
      "NonNullString",
      "MinLength[3]",
      "MaxLength[20]",

      // Custom async rule - check uniqueness
      async ({ value }) => {
        const exists = await checkUsernameInDatabase(value);
        return !exists || "Username already taken";
      },

      // Custom async rule - check blacklist
      async ({ value }) => {
        const isBlacklisted = await isUsernameBlacklisted(value);
        return !isBlacklisted || "This username is not allowed";
      },

      // Sync custom rule - check format
      ({ value }) => {
        const validFormat = /^[a-zA-Z0-9_-]+$/.test(value);
        return validFormat || "Only letters, numbers, dashes, and underscores allowed";
      },
    ],
    propertyName: "username",
  });

  return result;
}
```

### Example 6: Handling Form Submission

```typescript
import { Validator } from "resk-core";

class ContactForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([5])
  @IsMaxLength([1000])
  message: string;

  @IsRequired
  @IsPhoneNumber()
  phone: string;

  @IsNullable
  @IsUrl
  website?: string;
}

async function handleFormSubmit(formData: FormData) {
  // Convert FormData to object
  const data = Object.fromEntries(formData);

  // Validate
  const result = await Validator.validateTarget(ContactForm, data);

  if (!result.success) {
    // Send errors back to frontend for display
    return {
      success: false,
      errors: result.errors.map((err) => ({
        field: err.propertyName,
        message: err.message,
      })),
    };
  }

  // All validation passed, save contact
  try {
    await saveContact(result.data);
    return { success: true, message: "Contact saved successfully" };
  } catch (error) {
    return { success: false, message: "Failed to save contact" };
  }
}
```

---

## 📖 API Reference

### Validator Static Methods

| Method                                  | Description                               | Returns                                   |
| --------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| `validate(options)`                     | Validate a single value                   | `Promise<IValidatorValidateResult>`       |
| `validateTarget(Class, data, options?)` | Validate a class instance with decorators | `Promise<IValidatorValidateTargetResult>` |
| `registerRule(name, fn)`                | Register a custom validation rule         | `void`                                    |
| `createRuleDecorator(fn)`               | Create a parameterized decorator          | `PropertyDecorator`                       |
| `createPropertyDecorator(ruleNames)`    | Create a simple decorator                 | `PropertyDecorator`                       |
| `isSuccess(result)`                     | Type guard for success                    | `boolean`                                 |
| `isFailure(result)`                     | Type guard for failure                    | `boolean`                                 |

### Validation Options

```typescript
interface IValidatorValidateOptions<ParamType = any, Context = unknown> {
  value?: any; // Value to validate
  rules?: string[] | IValidatorRule[]; // Rules to apply
  context?: Context; // Validation context
  message?: string; // Custom error message
  fieldName?: string; // Form field identifier
  propertyName?: string; // Object property name
  translatedPropertyName?: string; // Localized property name
}
```

---

## 🎓 Testing Examples

### Testing Single-Value Validation

```typescript
describe("Email Validation", () => {
  it("should pass valid email", async () => {
    const result = await Validator.validate({
      value: "user@example.com",
      rules: ["Email"],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBe("user@example.com");
    }
  });

  it("should fail invalid email", async () => {
    const result = await Validator.validate({
      value: "invalid-email",
      rules: ["Email"],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain("email");
    }
  });
});
```

### Testing Class Validation

```typescript
describe("UserForm Validation", () => {
  it("should validate complete form", async () => {
    const result = await Validator.validateTarget(UserForm, {
      email: "user@example.com",
      password: "SecurePass123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("should accumulate errors from multiple fields", async () => {
    const result = await Validator.validateTarget(UserForm, {
      email: "invalid-email",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.failureCount).toBe(2);
      expect(result.errors.length).toBe(2);
    }
  });
});
```

---

## 🚀 Performance Tips

1. **Parallel Validation** - Multiple fields are validated in parallel automatically
2. **Async Rules** - Only use async rules when necessary (DB queries, API calls)
3. **Rule Composition** - Combine simple rules rather than complex custom rules
4. **Caching** - Cache validation results if validating the same data repeatedly

---

## 🔗 Resources

- **Full TypeDoc Documentation** - See `types.ts` for comprehensive JSDoc
- **Test Suite** - Check `tests/` directory for usage examples
- **GitHub Repository** - [boris-fouomene/resk](https://github.com/boris-fouomene/resk)

---

## ✨ Summary

The Validator module provides a comprehensive, type-safe, and extensible validation solution for TypeScript/JavaScript applications. With support for:

- ✅ Single-value and class-based validation
- ✅ Decorators for elegant property validation
- ✅ Custom rules and decorators
- ✅ Async validation with full support
- ✅ Context-aware validation
- ✅ Internationalization (i18n)
- ✅ Comprehensive error handling with type narrowing
- ✅ Parallel multi-field validation
- ✅ Timing and performance metrics

**Start building robust, type-safe validation logic today!** 🎉
