# Validator - Complete User Guide

> A comprehensive, production-ready validation library for TypeScript with Either pattern support, decorator-based validation, and 75+ Laravel-compatible rules.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NPM](https://img.shields.io/badge/NPM-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start (10 Minutes)](#quick-start-10-minutes)
3. [Core Concepts](#core-concepts)
4. [Single-Value Validation](#single-value-validation)
5. [Class-Based Validation](#class-based-validation)
6. [All Available Rules](#all-available-rules)
7. [Advanced Features](#advanced-features)
8. [Real-World Examples](#real-world-examples)
9. [Error Handling Patterns](#error-handling-patterns)
10. [Testing Patterns](#testing-patterns)
11. [Best Practices](#best-practices)
12. [API Reference](#api-reference)
13. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Introduction

The **Validator** is a powerful, type-safe validation library for TypeScript that provides:

- ✅ **Either Pattern**: Discriminated unions for type-safe error handling (no exceptions thrown)
- ✅ **Decorator-Based Validation**: Property decorators for clean, declarative validation
- ✅ **75+ Built-in Rules**: Laravel-compatible validation rules (Email, URL, Numbers, Strings, etc.)
- ✅ **Async Support**: Database/API validation with async rules
- ✅ **Context-Aware**: Pass context data to validation rules
- ✅ **Internationalization**: Localized error messages
- ✅ **Type Safety**: Full TypeScript support with type narrowing
- ✅ **Performance**: Parallel field validation with timing metrics
- ✅ **Custom Rules**: Easy registration of custom validation logic
- ✅ **Custom Decorators**: Create reusable validation decorators

### Installation

```bash
npm install @resk/core
```

### Import

```typescript
import { Validator } from "@resk/core/validator";
```

### Key Features

| Feature            | Description                                          |
| ------------------ | ---------------------------------------------------- |
| **Either Pattern** | Type-safe success/failure results without exceptions |
| **Single-Value**   | Validate individual values with rules array          |
| **Class-Based**    | Decorate class properties for multi-field validation |
| **Async Rules**    | Support for database/API validation                  |
| **Context**        | Pass data to rules (user permissions, etc.)          |
| **75+ Rules**      | Email, URL, numbers, strings, enums, dates, etc.     |
| **Custom Rules**   | Register your own validation logic                   |
| **Decorators**     | Property decorators for clean syntax                 |
| **i18n**           | Localized error messages                             |
| **Performance**    | Parallel validation with metrics                     |
| **TypeScript**     | Full type safety and narrowing                       |

---

## Quick Start (10 Minutes)

### 1. Basic Email Validation

```typescript
import { Validator } from "@resk/core/validator";

// Validate a single value
const result = await Validator.validate({
  value: "user@example.com",
  rules: ["Required", "Email"],
});

if (result.success) {
  console.log("✅ Valid email:", result.value);
} else {
  console.error("❌ Invalid:", result.message);
}
```

### 2. Class-Based Validation

```typescript
import {
  Validator,
  IsRequired,
  IsEmail,
  IsMinLength,
} from "@resk/core/validator";

class UserForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([8])
  password: string;
}

// Validate the entire form
const result = await Validator.validateTarget(UserForm, {
  email: "user@example.com",
  password: "secure123",
});

if (result.success) {
  console.log("✅ Form valid:", result.data);
} else {
  console.log("❌ Validation errors:");
  result.errors.forEach((error) => {
    console.log(`  - ${error.propertyName}: ${error.message}`);
  });
}
```

### 3. Custom Async Rule

```typescript
import { Validator } from "@resk/core/validator";

// Register custom rule
Validator.registerRule("UniqueEmail", async ({ value }) => {
  const exists = await database.users.findOne({ email: value });
  return !exists || "Email already registered";
});

// Use it
const result = await Validator.validate({
  value: "newuser@example.com",
  rules: ["Required", "Email", "UniqueEmail"],
});
```

### 4. Complete Registration Form

```typescript
import {
  Validator,
  IsRequired,
  IsEmail,
  IsMinLength,
  IsMaxLength,
} from "@resk/core/validator";

class RegistrationForm {
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  email: string;

  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  username: string;

  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  password: string;
}

async function registerUser(formData: unknown) {
  const result = await Validator.validateTarget(RegistrationForm, formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.errors.map((e) => ({
        field: e.propertyName,
        message: e.message,
      })),
    };
  }

  // Save to database
  await database.users.create(result.data);
  return { success: true };
}
```

**That's it!** You're now ready to use the Validator. Continue reading for detailed explanations and advanced features.

---

## Core Concepts

### Either Pattern (Type-Safe Error Handling)

The Validator uses an **Either pattern** with discriminated unions instead of throwing exceptions. This ensures type safety and prevents unhandled errors.

#### Success Result

```typescript
{
  success: true,
  value: T,                           // Original validated value
  status: "success",
  validatedAt?: Date,                 // When validation succeeded
  duration?: number,                  // Milliseconds taken
  data?: Record<string, any>,         // Optional context data
  context?: Context,                  // User-provided context
}
```

#### Failure Result

```typescript
{
  success: false,
  message: string,                    // Error summary
  error?: IValidatorValidationError,  // Detailed error object
  status: "error",
  failedAt?: Date,                    // When validation failed
  duration?: number,                  // Milliseconds taken
  data?: Record<string, any>,         // Optional context data
  context?: Context,                  // User-provided context
}
```

#### Type Narrowing

```typescript
const result = await Validator.validate({...});

// TypeScript narrows automatically
if (result.success) {
  // result is IValidatorValidateSuccess<T>
  console.log(result.value);          // ✅ Safe
  console.log(result.validatedAt);    // ✅ Safe
} else {
  // result is IValidatorValidateFailure
  console.log(result.message);        // ✅ Safe
  console.log(result.error);          // ✅ Safe
}
```

### Validation Results Explained

#### Single-Value Results

```typescript
// Success
{
  success: true,
  value: "user@example.com",
  validatedAt: 2024-01-15T10:30:00.000Z,
  duration: 5
}

// Failure
{
  success: false,
  message: "Must be a valid email",
  error: {
    name: "ValidatorValidationError",
    status: "error",
    message: "Must be a valid email",
    ruleName: "Email",
    value: "invalid-email"
  },
  failedAt: 2024-01-15T10:30:00.000Z,
  duration: 3
}
```

#### Class Validation Results

```typescript
// Success
{
  success: true,
  data: { email: "user@example.com", password: "secure123" },
  validatedAt: 2024-01-15T10:30:00.000Z,
  duration: 8
}

// Failure (multiple fields)
{
  success: false,
  message: "2 validation errors occurred",
  errors: [
    {
      propertyName: "email",
      message: "Must be a valid email",
      ruleName: "Email",
      value: "invalid"
    },
    {
      propertyName: "password",
      message: "Must be at least 8 characters",
      ruleName: "MinLength",
      ruleParams: [8],
      value: "short"
    }
  ],
  failureCount: 2,
  failedAt: 2024-01-15T10:30:00.000Z,
  duration: 6
}
```

### Understanding Validation Flow

1. **Rules Applied Sequentially**: Each rule is checked in order
2. **First Failure Stops**: Validation stops at first failing rule (unless configured otherwise)
3. **Parallel Fields**: Class fields are validated concurrently
4. **Error Accumulation**: All field errors are collected
5. **Type Safety**: TypeScript narrows types based on `success` property

---

## Single-Value Validation

Validate individual values with an array of rules.

### Basic Validation

```typescript
const result = await Validator.validate({
  value: "test@example.com",
  rules: ["Required", "Email"],
});
```

### All Options

```typescript
const result = await Validator.validate<string, MyContext>({
  // Core options
  value: "test@example.com",
  rules: ["Required", "Email", "MaxLength[100]"],

  // Identification
  fieldName: "email_input", // HTML form field ID
  propertyName: "email", // Object/class property name
  translatedPropertyName: "Email Address", // User-friendly name

  // Customization
  message: "Invalid email address", // Override error message

  // Context
  context: {
    userId: 123,
    permissions: ["read", "write"],
  },
});
```

### Rule Types

#### Simple Rules

```typescript
await Validator.validate({
  value: email,
  rules: ["Required"], // Single rule
});
```

#### Parameterized Rules

```typescript
await Validator.validate({
  value: password,
  rules: ["MinLength[8]", "MaxLength[128]"],
});
```

#### Multiple Rules

```typescript
await Validator.validate({
  value: username,
  rules: ["Required", "MinLength[3]", "MaxLength[50]", "NonNullString"],
});
```

#### Custom Inline Rules

```typescript
await Validator.validate({
  value: age,
  rules: [
    "Required",
    "Number",

    // Sync custom rule
    ({ value }) => {
      return value >= 18 || "Must be 18 or older";
    },

    // Async custom rule
    async ({ value, context }) => {
      const isAllowed = await checkPermissions(value, context);
      return isAllowed || "Access denied";
    },
  ],
});
```

### Context-Aware Validation

```typescript
interface UserContext {
  userId: number;
  role: "admin" | "user";
}

const result = await Validator.validate<string, UserContext>({
  value: "admin-panel",
  rules: ["Required", "PermissionCheck"],
  context: {
    userId: 123,
    role: "admin",
  },
});
```

---

## Class-Based Validation

Use property decorators to validate entire classes/forms.

### Basic Class Validation

```typescript
import {
  Validator,
  IsRequired,
  IsEmail,
  IsMinLength,
} from "@resk/core/validator";

class UserForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([8])
  password: string;
}

const result = await Validator.validateTarget(UserForm, {
  email: "user@example.com",
  password: "secure123",
});
```

### With Options

```typescript
const result = await Validator.validateTarget<UserForm, MyContext>(
  UserForm,
  data,
  {
    context: { userId: 1 },
    errorMessageBuilder: (fieldName, error) => `❌ ${fieldName}: ${error}`,
    locale: "fr",
  }
);
```

### Decorator Stacking

```typescript
class ProductForm {
  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([200])
  name: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  price: number;

  @IsNullable
  @IsUrl
  imageUrl?: string;
}
```

### Optional Fields

```typescript
class ProfileForm {
  @IsRequired
  name: string;

  @IsOptional // Skip if undefined
  @IsEmail
  email?: string;

  @IsNullable // Skip if null/undefined
  @IsUrl
  website?: string;

  @IsEmpty // Skip if empty string
  @IsNumber
  age?: number;
}
```

### Conditional Validation

```typescript
class PaymentForm {
  @IsRequired
  @IsEnum(["credit_card", "paypal", "bank"])
  method: string;

  // Required only for credit card
  @IsRequired
  @IsMinLength([16])
  @IsMaxLength([16])
  cardNumber?: string;
}
```

---

## All Available Rules

The Validator includes 75+ built-in rules organized by category.

### String Rules

| Rule            | Decorator                                 | Description              | Example                                |
| --------------- | ----------------------------------------- | ------------------------ | -------------------------------------- |
| Required        | `@IsRequired`                             | Value must exist         | `@IsRequired`                          |
| Email           | `@IsEmail`                                | Must be valid email      | `@IsEmail`                             |
| MinLength       | `@IsMinLength([n])`                       | Minimum length           | `@IsMinLength([8])`                    |
| MaxLength       | `@IsMaxLength([n])`                       | Maximum length           | `@IsMaxLength([100])`                  |
| Length          | `@ Length([n])` or `@ Length([min, max])` | Exact or range length    | `@ Length([5, 20])`                    |
| Url             | `@IsUrl`                                  | Must be valid URL        | `@IsUrl`                               |
| NonNullString   | `@IsNonNullString`                        | Must be non-empty string | `@IsNonNullString`                     |
| FileName        | `@IsFileName`                             | Valid filename           | `@IsFileName`                          |
| StartsWithOneOf | `@StartsWith(['Mr.', 'Mrs.'])`            | Starts with one of       | `@StartsWith(['http://', 'https://'])` |
| EndsWithOneOf   | `@EndsWith(['.jpg', '.png'])`             | Ends with one of         | `@EndsWith(['.jpg', '.png', '.gif'])`  |

### Numeric Rules

| Rule                     | Decorator                          | Description      | Example                             |
| ------------------------ | ---------------------------------- | ---------------- | ----------------------------------- |
| Number                   | `@IsNumber`                        | Must be a number | `@IsNumber`                         |
| NumberGreaterThan        | `@IsNumberGreaterThan([n])`        | Greater than n   | `@IsNumberGreaterThan([0])`         |
| NumberGreaterThanOrEqual | `@IsNumberGreaterThanOrEqual([n])` | ≥ n              | `@IsNumberGreaterThanOrEqual([18])` |
| NumberLessThan           | `@IsNumberLessThan([n])`           | Less than n      | `@IsNumberLessThan([100])`          |
| NumberLessThanOrEqual    | `@IsNumberLessThanOrEqual([n])`    | ≤ n              | `@IsNumberLessThanOrEqual([100])`   |
| NumberEqual              | `@ IsNumberEqual([n])`             | Exactly n        | `@ IsNumberEqual([42])`             |
| NumberNotEqual           | `@IsNumberNotEqual([n])`           | Not equal to n   | `@IsNumberNotEqual([0])`            |

### Boolean Rules

| Rule    | Decorator    | Description     | Example      |
| ------- | ------------ | --------------- | ------------ |
| Boolean | `@IsBoolean` | Must be boolean | `@IsBoolean` |

### Enum Rules

| Rule   | Decorator                  | Description      | Example                           |
| ------ | -------------------------- | ---------------- | --------------------------------- |
| Enum   | `@IsEnum(['a', 'b', 'c'])` | Must be in list  | `@IsEnum(['active', 'inactive'])` |
| Equals | `@Equals(['value'])`       | Must equal value | `@Equals(['password'])`           |

### Nullable/Optional Rules

| Rule     | Decorator     | Description          | Example       |
| -------- | ------------- | -------------------- | ------------- |
| Nullable | `@IsNullable` | Allow null/undefined | `@IsNullable` |
| Empty    | `@IsEmpty`    | Allow empty string   | `@IsEmpty`    |
| Optional | `@IsOptional` | Allow undefined      | `@IsOptional` |

### Contact Rules

| Rule               | Decorator          | Description        | Example            |
| ------------------ | ------------------ | ------------------ | ------------------ |
| PhoneNumber        | `@IsPhoneNumber()` | Valid phone number | `@IsPhoneNumber()` |
| EmailOrPhoneNumber | `@IsEmailOrPhone`  | Email or phone     | `@IsEmailOrPhone`  |

### Array Rules

| Rule           | Decorator                 | Description                   | Example                     |
| -------------- | ------------------------- | ----------------------------- | --------------------------- |
| Array          | `@IsArray`                | Value must be an array        | `@IsArray`                  |
| ArrayMinLength | `@ArrayMinLength([n])`    | Array minimum length          | `@ArrayMinLength([3])`      |
| ArrayMaxLength | `@ArrayMaxLength([n])`    | Array maximum length          | `@ArrayMaxLength([10])`     |
| ArrayLength    | `@ArrayLength([n])`       | Array exact length            | `@ArrayLength([5])`         |
| ArrayContains  | `@ArrayContains([value])` | Array must contain value      | `@ArrayContains(['admin'])` |
| ArrayUnique    | `@ArrayUnique`            | Array elements must be unique | `@ArrayUnique`              |

### Date Rules

| Rule        | Decorator                         | Description                | Example                                       |
| ----------- | --------------------------------- | -------------------------- | --------------------------------------------- |
| Date        | `@IsDate`                         | Value must be valid date   | `@IsDate`                                     |
| DateAfter   | `@IsDateAfter(['date'])`          | Date after specified date  | `@IsDateAfter(['2023-01-01'])`                |
| DateBefore  | `@IsDateBefore(['date'])`         | Date before specified date | `@IsDateBefore(['2023-12-31'])`               |
| DateBetween | `@IsDateBetween(['start','end'])` | Date between range         | `@IsDateBetween(['2023-01-01','2023-12-31'])` |
| SameDate    | `@IsSameDate(['date'])`           | Date equals specified date | `@IsSameDate(['2023-06-15'])`                 |
| FutureDate  | `@IsFutureDate`                   | Date in future             | `@IsFutureDate`                               |
| PastDate    | `@IsPastDate`                     | Date in past               | `@IsPastDate`                                 |

### File Rules

| Rule          | Decorator                    | Description               | Example                       |
| ------------- | ---------------------------- | ------------------------- | ----------------------------- |
| File          | `@IsFile`                    | Value must be file object | `@IsFile`                     |
| MaxFileSize   | `@MaxFileSize([bytes])`      | File exact size           | `@MaxFileSize([1024000])`     |
| FileType      | `@IsFileType(['mime'])`      | File MIME type            | `@IsFileType(['image/jpeg'])` |
| Image         | `@IsImage`                   | File must be image        | `@IsImage`                    |
| FileExtension | `@IsFileExtension(['.ext'])` | File extension            | `@IsFileExtension(['.pdf'])`  |
| MinFileSize   | `@MinFileSize([bytes])`      | File minimum size         | `@MinFileSize([100])`         |

### Format Rules

| Rule       | Decorator             | Description               | Example                |
| ---------- | --------------------- | ------------------------- | ---------------------- |
| UUID       | `@IsUUID`             | Value must be valid UUID  | `@IsUUID`              |
| JSON       | `@IsJSON`             | Value must be valid JSON  | `@IsJSON`              |
| Base64     | `@IsBase64`           | Value must be Base64      | `@IsBase64`            |
| HexColor   | `@IsHexColor`         | Value must be hex color   | `@IsHexColor`          |
| CreditCard | `@IsCreditCard`       | Value must be credit card | `@IsCreditCard`        |
| IP         | `@IsIP`               | Value must be IP address  | `@IsIP`                |
| MACAddress | `@IsMACAddress`       | Value must be MAC address | `@IsMACAddress`        |
| Regex      | `@Regex(['pattern'])` | Value must match regex    | `@Regex(['^[A-Z]+$'])` |

### Examples of All Rules

```typescript
class ComprehensiveForm {
  // String rules
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  email: string;

  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  username: string;

  @IsRequired
  @IsUrl
  website: string;

  @IsRequired
  @IsFileName
  filename: string;

  @StartsWith(["Mr.", "Mrs.", "Ms."])
  title: string;

  @EndsWith([".jpg", ".png", ".gif"])
  imageFile: string;

  // Numeric rules
  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEqual([18])
  @IsNumberLessThanOrEqual([120])
  age: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  @IsNumberLessThan([999999.99])
  price: number;

  // Boolean rules
  @IsRequired
  @IsBoolean
  active: boolean;

  // Enum rules
  @IsRequired
  @IsEnum(["admin", "user", "moderator"])
  role: string;

  // Nullable/Optional
  @IsNullable
  @IsPhoneNumber()
  phone?: string;

  @IsOptional
  @IsUrl
  profileUrl?: string;

  @IsEmpty
  @IsNumber
  favoriteNumber?: number;

  // Array rules
  @IsRequired
  @IsArray
  @ArrayMinLength([1])
  @ArrayUnique
  tags: string[];

  // Date rules
  @IsRequired
  @IsDate
  @IsFutureDate
  eventDate: string;

  // File rules
  @IsRequired
  @IsFile
  @MaxFileSize([2097152]) // 2MB max
  @IsImage
  profilePicture: File;

  // Format rules
  @IsRequired
  @IsUUID
  productId: string;

  @IsRequired
  @IsJSON
  configuration: string;

  @IsRequired
  @IsCreditCard
  paymentCard: string;
}
```

---

## Advanced Features

### Custom Rules

Register your own validation logic.

#### Sync Custom Rule

```typescript
Validator.registerRule("StrongPassword", ({ value }) => {
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*]/.test(value);

  if (!hasUpper) return "Must contain uppercase letter";
  if (!hasLower) return "Must contain lowercase letter";
  if (!hasNumber) return "Must contain number";
  if (!hasSpecial) return "Must contain special character";

  return true;
});

// Use it
const result = await Validator.validate({
  value: "MySecurePass123!",
  rules: ["Required", "MinLength[8]", "StrongPassword"],
});
```

#### Async Custom Rule

```typescript
Validator.registerRule("UniqueUsername", async ({ value }) => {
  const exists = await database.users.findOne({ username: value });
  return !exists || "Username already taken";
});

// Use it
const result = await Validator.validate({
  value: "newuser",
  rules: ["Required", "MinLength[3]", "UniqueUsername"],
});
```

#### Parameterized Custom Rule

```typescript
const minValueRule = ({
  value,
  ruleParams,
}: IValidatorValidateOptions<[number]>) => {
  const [minValue] = ruleParams;
  return value >= minValue || `Must be at least ${minValue}`;
};

Validator.registerRule("MinValue", minValueRule);

// Create decorator
const IsMinValue = Validator.buildRuleDecorator<[number]>(minValueRule);

// Use it
class Product {
  @IsMinValue([9.99])
  price: number;
}
```

### Custom Decorators

Create reusable decorators.

#### Simple Decorator

```typescript
const IsStrongPassword = Validator.buildPropertyDecorator(["StrongPassword"]);

class User {
  @IsStrongPassword
  password: string;
}
```

#### Parameterized Decorator

```typescript
const IsMinValue = Validator.buildRuleDecorator<[number]>("MinValue");

class Product {
  @IsMinValue([9.99])
  price: number;
}
```

### Context-Aware Validation

Pass data to rules for complex validation logic.

```typescript
interface ValidationContext {
  userId: number;
  userRole: "admin" | "user";
  permissions: string[];
}

// Register context-aware rule
Validator.registerRule(
  "HasPermission",
  ({ value, context }: IValidatorValidateOptions<any, ValidationContext>) => {
    const { permissions } = context;
    return permissions.includes(value) || `Permission '${value}' not granted`;
  }
);

const HasPermission = Validator.buildPropertyDecorator(["HasPermission"]);

// Use in class
class AdminAction {
  @IsRequired
  @HasPermission
  action: string;
}

// Validate with context
const result = await Validator.validateTarget<AdminAction, ValidationContext>(
  AdminAction,
  { action: "delete_user" },
  {
    context: {
      userId: 1,
      userRole: "admin",
      permissions: ["view", "edit", "delete_user"],
    },
  }
);
```

### Internationalization (i18n)

```typescript
import { i18n } from "@resk/core/i18n";

// Set locale
await i18n.setLocale("fr");

// Error messages will be in French
const result = await Validator.validate({
  value: "invalid",
  rules: ["Email"],
});
```

### Performance Monitoring

```typescript
const result = await Validator.validateTarget(LargeForm, data);

if (result.success) {
  console.log(`✅ Validation completed in ${result.duration}ms`);
  console.log(`Validated at: ${result.validatedAt?.toISOString()}`);
} else {
  console.log(`❌ Validation failed in ${result.duration}ms`);
}
```

---

## Real-World Examples

### User Authentication

#### Login Form

```typescript
import {
  Validator,
  IsRequired,
  IsEmail,
  IsMinLength,
  IsMaxLength,
} from "@resk/core/validator";

class LoginForm {
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  email: string;

  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  password: string;
}

async function validateLogin(formData: unknown) {
  const result = await Validator.validateTarget(LoginForm, formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.errors.map((e) => ({
        field: e.propertyName,
        message: e.message,
      })),
    };
  }

  return { success: true, data: result.data };
}
```

#### Registration with Async Validation

```typescript
Validator.registerRule("UniqueEmail", async ({ value }) => {
  const exists = await database.users.findOne({ email: value });
  return !exists || "Email already registered";
});

const IsUniqueEmail = Validator.buildPropertyDecorator(["UniqueEmail"]);

class RegistrationForm {
  @IsRequired
  @IsEmail
  @IsMaxLength([255])
  @IsUniqueEmail
  email: string;

  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([50])
  username: string;

  @IsRequired
  @IsMinLength([8])
  @IsMaxLength([128])
  password: string;

  @IsRequired
  @Equals(["password"])
  confirmPassword: string;
}

async function registerUser(formData: unknown) {
  const result = await Validator.validateTarget(RegistrationForm, formData);

  if (!result.success) {
    const errorsByField = result.errors.reduce(
      (acc, err) => {
        if (!acc[err.propertyName]) acc[err.propertyName] = [];
        acc[err.propertyName].push(err.message);
        return acc;
      },
      {} as Record<string, string[]>
    );

    return { success: false, errors: errorsByField };
  }

  const user = await database.users.create(result.data);
  return { success: true, user };
}
```

### E-Commerce

#### Product Validation

```typescript
Validator.registerRule("ValidPrice", ({ value, ruleParams }) => {
  const [minPrice] = ruleParams;
  if (value < minPrice) return `Price must be at least $${minPrice}`;
  if (value > 999999.99) return "Price too high";
  return true;
});

class ProductForm {
  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([200])
  name: string;

  @IsRequired
  @IsMinLength([10])
  @IsMaxLength([5000])
  description: string;

  @IsRequired
  @IsNumber
  @ValidPrice([0.01])
  price: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEqual([0])
  stock: number;

  @IsRequired
  @IsEnum(["active", "inactive", "discontinued"])
  status: string;

  @IsNullable
  @IsUrl
  imageUrl?: string;
}

async function createProduct(formData: unknown) {
  const result = await Validator.validateTarget(ProductForm, formData);

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      errors: result.errors,
    };
  }

  const product = await database.products.create(result.data);
  return { success: true, product };
}
```

#### Shopping Cart Validation

```typescript
Validator.registerRule("ValidQuantity", ({ value }) => {
  if (!Number.isInteger(value)) return "Quantity must be whole number";
  if (value < 1) return "Quantity must be at least 1";
  if (value > 999) return "Quantity cannot exceed 999";
  return true;
});

class CartItem {
  @IsRequired
  @IsNumber
  productId: number;

  @IsRequired
  @ValidQuantity
  quantity: number;

  @IsRequired
  @IsEnum(["standard", "express", "overnight"])
  shippingMethod: string;
}

async function validateCartItems(items: unknown[]) {
  const results = await Promise.all(
    items.map((item) => Validator.validateTarget(CartItem, item))
  );

  const failures = results
    .map((r, i) => ({ index: i, result: r }))
    .filter((x) => !x.result.success);

  if (failures.length > 0) {
    return {
      success: false,
      errors: failures.map((f) => ({
        itemIndex: f.index,
        errors: f.result.errors,
      })),
    };
  }

  return { success: true, items: results.map((r) => r.data) };
}
```

### API Validation

#### Request Validation Middleware

```typescript
interface ValidationContext {
  userId?: number;
  userRole?: string;
}

async function validateRequest<T>(
  data: unknown,
  ValidationClass: new () => T,
  context?: ValidationContext
) {
  const result = await Validator.validateTarget<T, ValidationContext>(
    ValidationClass,
    data,
    { context }
  );

  return {
    isValid: result.success,
    data: result.success ? result.data : null,
    errors: !result.success ? result.errors : null,
    duration: result.duration,
  };
}

// Express middleware
async function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validation = await validateRequest(req.body, UserForm, {
    userId: req.user?.id,
    userRole: req.user?.role,
  });

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
      duration: validation.duration,
    });
  }

  req.validatedData = validation.data;
  next();
}
```

#### Pagination Validation

```typescript
class PaginationParams {
  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEqual([1])
  page: number;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThanOrEqual([1])
  @IsNumberLessThanOrEqual([100])
  limit: number;

  @IsNullable
  @IsEnum(["asc", "desc"])
  sortOrder?: string;

  @IsNullable
  @IsMaxLength([50])
  sortBy?: string;
}

async function getPaginatedResults(query: unknown) {
  const result = await Validator.validateTarget(PaginationParams, query);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  const { page, limit, sortOrder, sortBy } = result.data;

  const items = await database.items
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sortBy || "id"]: sortOrder === "desc" ? -1 : 1 })
    .find();

  return {
    success: true,
    page,
    limit,
    items,
  };
}
```

### Content Management

#### Blog Post Validation

```typescript
Validator.registerRule("ValidSlug", ({ value }) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(value) || "Slug must be lowercase with hyphens only";
});

const IsValidSlug = Validator.buildPropertyDecorator(["ValidSlug"]);

class BlogPost {
  @IsRequired
  @IsMinLength([5])
  @IsMaxLength([200])
  title: string;

  @IsRequired
  @IsValidSlug
  @IsMaxLength([200])
  slug: string;

  @IsRequired
  @IsMinLength([50])
  @IsMaxLength([5000])
  excerpt: string;

  @IsRequired
  @IsMinLength([200])
  @IsMaxLength([50000])
  content: string;

  @IsRequired
  @IsEnum(["draft", "published", "scheduled", "archived"])
  status: string;

  @IsRequired
  @IsEnum(["technology", "business", "lifestyle", "other"])
  category: string;

  @IsNullable
  @IsUrl
  coverImage?: string;
}

async function createBlogPost(formData: unknown) {
  const result = await Validator.validateTarget(BlogPost, formData);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Check slug uniqueness
  const exists = await database.posts.findOne({ slug: result.data.slug });
  if (exists) {
    return {
      success: false,
      errors: [
        {
          propertyName: "slug",
          message: "This slug is already in use",
        },
      ],
    };
  }

  const post = await database.posts.create(result.data);
  return { success: true, post };
}
```

### Data Migration

#### CSV Import Validation

```typescript
class CSVRecord {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([1])
  @IsMaxLength([100])
  name: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  age: number;

  @IsRequired
  @IsEnum(["active", "inactive"])
  status: string;
}

async function validateCSVImport(records: unknown[]) {
  const results = await Promise.all(
    records.map((record) => Validator.validateTarget(CSVRecord, record))
  );

  const summary = {
    total: records.length,
    valid: 0,
    invalid: 0,
    errors: [] as any[],
  };

  results.forEach((result, index) => {
    if (result.success) {
      summary.valid++;
    } else {
      summary.invalid++;
      summary.errors.push({
        row: index + 2, // +2 for header and 0-indexing
        errors: result.errors,
      });
    }
  });

  if (summary.invalid > 0) {
    return {
      success: false,
      summary,
      message: `${summary.invalid} rows have validation errors`,
    };
  }

  return {
    success: true,
    summary,
    data: results.map((r) => r.data),
  };
}
```

---

## Error Handling Patterns

### Pattern 1: Basic Success Check

```typescript
const result = await Validator.validate({...});

if (result.success) {
  console.log('Valid:', result.value);
} else {
  console.error('Invalid:', result.message);
}
```

### Pattern 2: Type Guard Functions

```typescript
const result = await Validator.validate({...});

if (Validator.isSuccess(result)) {
  console.log(result.value);
}

if (Validator.isFailure(result)) {
  console.error(result.message);
}
```

### Pattern 3: Switch Statement

```typescript
const result = await Validator.validate({...});

switch (result.status) {
  case 'success':
    console.log('Valid:', result.value);
    break;
  case 'error':
    console.error('Invalid:', result.message);
    break;
}
```

### Pattern 4: Error Accumulation

```typescript
const result = await Validator.validateTarget(Form, data);

if (!result.success) {
  const groupedErrors = result.errors.reduce(
    (acc, error) => {
      const field = error.propertyName || "unknown";
      if (!acc[field]) acc[field] = [];
      acc[field].push(error.message);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Output: { email: ['Invalid email'], password: ['Too short'] }
  return { success: false, errors: groupedErrors };
}
```

### Pattern 5: Multiple Validation Results

```typescript
const results = await Promise.all([
  Validator.validate({ value: email, rules: ["Email"] }),
  Validator.validate({ value: username, rules: ["Required"] }),
]);

const successValues = results
  .filter((r) => r.success)
  .map((r) => r.success && r.value);

const errors = results
  .filter((r) => !r.success)
  .map((r) => !r.success && r.message);
```

### Pattern 6: Async Error Handling

```typescript
try {
  const result = await Validator.validate({...});

  if (result.success) {
    await saveData(result.value);
  } else {
    console.error('Validation failed:', result.message);
  }
} catch (error) {
  console.error('System error:', error);
}
```

### Pattern 7: Custom Error Formatting

```typescript
const result = await Validator.validateTarget(Form, data, {
  errorMessageBuilder: (propertyName, error) => {
    return `❌ [${propertyName}]: ${error}`;
  },
});
```

### Pattern 8: Error Mapping for UI

```typescript
function mapErrorsForUI(errors: IValidatorValidationError[]) {
  return errors.map((error) => ({
    field: error.propertyName,
    message: error.message,
    type: error.ruleName?.toLowerCase(),
    value: error.value,
  }));
}

const result = await Validator.validateTarget(Form, data);
if (!result.success) {
  const uiErrors = mapErrorsForUI(result.errors);
  // Pass to frontend
}
```

---

## Testing Patterns

### Unit Test Suite

```typescript
describe("UserForm Validation", () => {
  describe("Email Field", () => {
    it("should accept valid email", async () => {
      const result = await Validator.validate({
        value: "user@example.com",
        rules: ["Email"],
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid email", async () => {
      const result = await Validator.validate({
        value: "invalid-email",
        rules: ["Email"],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Password Field", () => {
    it("should require minimum 8 characters", async () => {
      const result = await Validator.validate({
        value: "short",
        rules: ["MinLength[8]"],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Complete Form", () => {
    it("should validate complete valid form", async () => {
      const result = await Validator.validateTarget(UserForm, {
        email: "user@example.com",
        password: "SecurePass123",
      });

      expect(result.success).toBe(true);
    });

    it("should accumulate multiple errors", async () => {
      const result = await Validator.validateTarget(UserForm, {
        email: "invalid",
        password: "short",
      });

      expect(result.success).toBe(false);
      expect(result.failureCount).toBeGreaterThan(1);
    });
  });
});
```

### Mocking Async Validations

```typescript
describe("UserRegistration with Async Validation", () => {
  beforeEach(() => {
    jest.spyOn(database, "users").mockImplementation({
      findOne: jest.fn().mockResolvedValue(null),
    });
  });

  it("should allow registration with unique email", async () => {
    const result = await Validator.validateTarget(RegistrationForm, {
      email: "newuser@example.com",
      password: "SecurePass123",
      username: "newuser",
    });

    expect(result.success).toBe(true);
  });

  it("should reject duplicate email", async () => {
    database.users.findOne.mockResolvedValue({ id: 1 });

    const result = await Validator.validateTarget(RegistrationForm, {
      email: "existing@example.com",
      password: "SecurePass123",
      username: "newuser",
    });

    expect(result.success).toBe(false);
  });
});
```

### Performance Testing

```typescript
describe("Validation Performance", () => {
  it("should validate form under 100ms", async () => {
    const result = await Validator.validateTarget(LargeForm, data);

    expect(result.success).toBe(true);
    expect(result.duration).toBeLessThan(100);
  });

  it("should parallel validate all fields", async () => {
    const start = Date.now();
    const result = await Validator.validateTarget(MultiFieldForm, data);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(500);
  });
});
```

---

## Best Practices

### 1. Use Class-Based Validation for Forms

```typescript
// ✅ Good: Declarative and reusable
class UserForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([8])
  password: string;
}

// ❌ Avoid: Manual validation
function validateUser(data) {
  if (!data.email) return "Email required";
  if (!data.password) return "Password required";
  // ... more manual checks
}
```

### 2. Handle Errors Gracefully

```typescript
// ✅ Good: Type-safe error handling
const result = await Validator.validateTarget(Form, data);

if (result.success) {
  await processData(result.data);
} else {
  // Group errors by field for UI
  const errorsByField = result.errors.reduce((acc, error) => {
    const field = error.propertyName;
    if (!acc[field]) acc[field] = [];
    acc[field].push(error.message);
    return acc;
  }, {});

  return { success: false, errors: errorsByField };
}
```

### 3. Use Appropriate Field Types

```typescript
// ✅ Good: Specific decorators for each field type
class Product {
  @IsRequired
  @IsMinLength([3])
  @IsMaxLength([200])
  name: string;

  @IsRequired
  @IsNumber
  @IsNumberGreaterThan([0])
  price: number;

  @IsNullable
  @IsUrl
  imageUrl?: string;
}

// ❌ Avoid: Generic validation
class Product {
  @IsRequired
  name: string; // Missing length validation

  @IsRequired
  price: any; // Wrong type, no number validation
}
```

### 4. Create Custom Rules for Business Logic

```typescript
// ✅ Good: Business rules as reusable validators
Validator.registerRule("ValidDiscountCode", async ({ value }) => {
  const code = await database.discounts.findOne({ code: value });
  if (!code) return "Discount code not found";
  if (code.expiryDate < new Date()) return "Discount code expired";
  return true;
});

// ❌ Avoid: Business logic in controllers
async function applyDiscount(code) {
  const discount = await database.discounts.findOne({ code });
  if (!discount) {
    throw new Error("Invalid discount code");
  }
  if (discount.expiryDate < new Date()) {
    throw new Error("Discount expired");
  }
  // More validation...
}
```

### 5. Use Context for Complex Validation

```typescript
// ✅ Good: Context-aware validation
interface UserContext {
  userId: number;
  role: "admin" | "user";
}

class AdminAction {
  @IsRequired
  @HasPermission
  action: string;
}

// ❌ Avoid: Validation logic in business code
async function performAdminAction(action, user) {
  if (user.role !== "admin") {
    throw new Error("Permission denied");
  }
  // Action logic...
}
```

### 6. Validate Early, Fail Fast

```typescript
// ✅ Good: Validate before processing
async function createUser(userData) {
  const result = await Validator.validateTarget(UserForm, userData);

  if (!result.success) {
    return { success: false, errors: result.errors };
  }

  // Only proceed if validation passes
  return await database.users.create(result.data);
}

// ❌ Avoid: Validate after processing
async function createUser(userData) {
  try {
    const user = await database.users.create(userData);
    // Validation happens too late
    return { success: true, user };
  } catch (error) {
    return { success: false, message: "Validation failed" };
  }
}
```

### 7. Use TypeScript Types

```typescript
// ✅ Good: Full type safety
const result = await Validator.validateTarget<UserForm, UserContext>(
  UserForm,
  data,
  { context: { userId: 123, role: "admin" } }
);

if (result.success) {
  // result.data is fully typed as UserForm
  const user: UserForm = result.data;
}

// ❌ Avoid: Any types
const result = await Validator.validateTarget(UserForm, data);

if (result.success) {
  // result.data is any - no type safety
  const user = result.data as any;
}
```

### 8. Test Validation Logic

```typescript
// ✅ Good: Test validation rules
describe("UserForm", () => {
  it("should require email", async () => {
    const result = await Validator.validateTarget(UserForm, {
      password: "password123",
      // missing email
    });

    expect(result.success).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        propertyName: "email",
        message: expect.stringContaining("required"),
      })
    );
  });
});
```

### 9. Performance Considerations

```typescript
// ✅ Good: Parallel validation
const result = await Validator.validateTarget(LargeForm, data);
// All fields validated in parallel

// ✅ Good: Monitor performance
if (result.duration > 1000) {
  console.warn("Validation took > 1 second, consider optimizing");
}

// ❌ Avoid: Sequential validation
const emailResult = await Validator.validate({
  value: email,
  rules: ["Email"],
});
const passwordResult = await Validator.validate({
  value: password,
  rules: ["MinLength[8]"],
});
```

### 10. Error Messages

```typescript
// ✅ Good: User-friendly messages
const result = await Validator.validate({
  value: email,
  rules: ["Email"],
  message: "Please enter a valid email address (e.g., user@company.com)",
});

// ✅ Good: Localized messages
await i18n.setLocale("fr");
// Error messages automatically in French

// ❌ Avoid: Technical error messages
// "ValidationError: Email rule failed"
```

---

## API Reference

### Validator Class Methods

#### Single-Value Validation

```typescript
// Basic validation
validate(options: IValidatorValidateOptions<T, C>): Promise<IValidatorValidateResult<T, C>>

// Type guard functions
isSuccess<T, C>(result: IValidatorValidateResult<T, C>): result is IValidatorValidateSuccess<T, C>
isFailure<T, C>(result: IValidatorValidateResult<T, C>): result is IValidatorValidateFailure<C>
```

#### Class Validation

```typescript
// Basic class validation
validateTarget<T, C>(
  target: new () => T,
  data: unknown,
  options?: IValidatorValidateTargetOptions<C>
): Promise<IValidatorValidateTargetResult<T, C>>
```

#### Rule Management

```typescript
// Register custom rule
registerRule(name: string, rule: IValidatorRule): void

// Create property decorator
buildPropertyDecorator(rules: string[]): PropertyDecorator

// Create parameterized decorator
buildRuleDecorator<P extends any[]>(
  ruleName: string | IValidatorRule
): (...params: P) => PropertyDecorator
```

### Interface Definitions

#### Validation Options

```typescript
interface IValidatorValidateOptions<T = any, C = any> {
  value: T;
  rules: string[] | string;
  fieldName?: string;
  propertyName?: string;
  translatedPropertyName?: string;
  message?: string;
  context?: C;
}
```

#### Validation Results

```typescript
type IValidatorValidateResult<T, C> =
  | IValidatorValidateSuccess<T, C>
  | IValidatorValidateFailure<C>;

interface IValidatorValidateSuccess<T, C> {
  success: true;
  value: T;
  status: "success";
  validatedAt?: Date;
  duration?: number;
  data?: Record<string, any>;
  context?: C;
}

interface IValidatorValidateFailure<C> {
  success: false;
  message: string;
  error?: IValidatorValidationError;
  status: "error";
  failedAt?: Date;
  duration?: number;
  data?: Record<string, any>;
  context?: C;
}
```

#### Class Validation Results

```typescript
type IValidatorValidateTargetResult<T, C> =
  | IValidatorValidateTargetSuccess<T, C>
  | IValidatorValidateTargetFailure<C>;

interface IValidatorValidateTargetSuccess<T, C> {
  success: true;
  data: T;
  status: "success";
  validatedAt?: Date;
  duration?: number;
  context?: C;
}

interface IValidatorValidateTargetFailure<C> {
  success: false;
  message: string;
  errors: IValidatorValidationError[];
  failureCount: number;
  status: "error";
  failedAt?: Date;
  duration?: number;
  context?: C;
}
```

#### Error Object

```typescript
interface IValidatorValidationError {
  name: "ValidatorValidationError";
  status: "error";
  fieldName?: string;
  propertyName?: string;
  message: string;
  translatedPropertyName?: string;
  ruleName?: string;
  ruleParams?: any[];
  rawRuleName?: string;
  value?: any;
}
```

### Built-in Rules

All rules are registered with the Validator and can be used by name:

```typescript
// String rules
'Required', 'Email', 'MinLength[n]', 'MaxLength[n]', 'Length[n]' or 'Length[min,max]',
'Url', 'NonNullString', 'FileName', 'StartsWith[value1,value2]', 'EndsWith[value1,value2]'

// Numeric rules
'Number', 'NumberGreaterThan[n]', 'NumberGreaterThanOrEqual[n]',
'NumberLessThan[n]', 'NumberLessThanOrEqual[n]', 'NumberEqual[n]', 'NumberNotEqual[n]'

// Boolean rules
'Boolean'

// Enum rules
'Enum[value1,value2]', 'Equals[value]'

// Nullable rules
'Nullable', 'Empty', 'Optional'

// Contact rules
'PhoneNumber', 'EmailOrPhoneNumber'
```

---

## FAQ & Troubleshooting

### General Questions

**Q: How do I check if validation succeeded?**

A: Use the `success` property with type narrowing:

```typescript
if (result.success) {
  // Validation passed - result.value is available
} else {
  // Validation failed - result.message is available
}
```

**Q: Can I throw errors instead of using Either pattern?**

A: Yes, convert the result:

```typescript
const result = await Validator.validate({...});

if (!result.success) {
  throw new ValidationError(result.message);
}
return result.value;
```

**Q: How do I validate async operations (database checks)?**

A: Use async custom rules:

```typescript
await Validator.validate({
  value: username,
  rules: [
    async ({ value }) => {
      const exists = await database.checkUsername(value);
      return !exists || "Username already taken";
    },
  ],
});
```

### Class-Based Validation

**Q: How do I handle optional fields?**

A: Use `@IsOptional`, `@IsNullable`, or `@IsEmpty`:

```typescript
class Form {
  @IsRequired
  email: string;

  @IsOptional // Skip if undefined
  @IsUrl
  website?: string;

  @IsNullable // Skip if null/undefined
  @IsEmail
  backupEmail?: string;

  @IsEmpty // Skip if empty string
  @IsNumber
  age?: number;
}
```

**Q: Can I reuse validation across multiple forms?**

A: Create a base class:

```typescript
class BaseUserForm {
  @IsRequired
  @IsEmail
  email: string;
}

class LoginForm extends BaseUserForm {
  @IsRequired
  @IsMinLength([8])
  password: string;
}
```

### Custom Rules & Decorators

**Q: How do I create a custom decorator?**

A: Register a rule and create a decorator:

```typescript
// 1. Define rule
const customRule = ({ value }) => value.length > 5 || "Too short";

// 2. Register rule
Validator.registerRule("CustomRule", customRule);

// 3. Create decorator
const IsCustom = Validator.buildPropertyDecorator(["CustomRule"]);

// 4. Use decorator
class MyClass {
  @IsCustom
  field: string;
}
```

**Q: How do I create parameterized custom rules?**

A: Use rule parameters:

```typescript
const minValueRule = ({
  value,
  ruleParams,
}: IValidatorValidateOptions<[number]>) => {
  const [minValue] = ruleParams;
  return value >= minValue || `Must be at least ${minValue}`;
};

Validator.registerRule("MinValue", minValueRule);

const IsMinValue = Validator.buildRuleDecorator<[number]>(minValueRule);

class Product {
  @IsMinValue([9.99])
  price: number;
}
```

### Error Handling

**Q: How do I customize error messages?**

A: Pass `message` option:

```typescript
await Validator.validate({
  value: email,
  rules: ["Email"],
  message: "Please enter a valid email address",
});
```

**Q: How do I handle multiple field errors?**

A: Errors are accumulated automatically:

```typescript
const result = await Validator.validateTarget(Form, data);

if (!result.success) {
  result.errors.forEach((error) => {
    console.log(`${error.propertyName}: ${error.message}`);
  });
}
```

### Performance

**Q: How do I see validation performance metrics?**

A: Check the `duration` and timestamps:

```typescript
const result = await Validator.validate({...});

console.log(`Duration: ${result.duration}ms`);
console.log(`Validated at: ${result.validatedAt?.toISOString()}`);
```

**Q: Are validations run in parallel?**

A: Yes, class fields are validated concurrently. Single-value validations run sequentially through rules.

### TypeScript

**Q: How do I get full type safety?**

A: Use generic type parameters:

```typescript
const result = await Validator.validateTarget<MyForm, MyContext>(MyForm, data, {
  context: myContext,
});

if (result.success) {
  // result.data is fully typed as MyForm
  const form: MyForm = result.data;
}
```

**Q: What's the difference between `rules`, `rule`, and `ruleParams`?**

A:

- `rules`: Array of rule names to apply in sequence
- `rule`: Single rule name (alternative to `rules`)
- `ruleParams`: Parameters extracted from rule name (e.g., `[8]` in `MinLength[8]`)

### Common Issues

**Q: My validation is not working**

A: Check:

1. Import statement: `import { Validator } from '@resk/core/validator';`
2. Rule names are correct (case-sensitive)
3. Parameters are properly formatted: `MinLength[8]`, not `MinLength(8)`
4. Async rules return `Promise<boolean | string>`

**Q: TypeScript shows errors on result properties**

A: Use type narrowing:

```typescript
const result = await Validator.validate({...});

if (result.success) {
  // TypeScript knows result.value exists
  console.log(result.value);
} else {
  // TypeScript knows result.message exists
  console.error(result.message);
}
```

**Q: Custom rules aren't being called**

A: Ensure rules are registered before use:

```typescript
// Register first
Validator.registerRule("MyRule", myRuleFunction);

// Then use
await Validator.validate({ value, rules: ["MyRule"] });
```

**Q: Context is undefined in custom rules**

A: Pass context in options:

```typescript
await Validator.validate({
  value,
  rules: ["MyRule"],
  context: { userId: 123 },
});
```

---

## Conclusion

The Validator module provides a comprehensive, type-safe validation solution with:

- **Either Pattern**: Type-safe error handling without exceptions
- **Decorator-Based**: Clean, declarative validation syntax
- **75+ Rules**: Extensive built-in validation rules
- **Async Support**: Database and API validation
- **Context-Aware**: Pass data to validation rules
- **Internationalization**: Localized error messages
- **Performance**: Parallel validation with metrics
- **TypeScript**: Full type safety and narrowing

### Quick Reference

```typescript
import {
  Validator,
  IsRequired,
  IsEmail,
  IsMinLength,
} from "@resk/core/validator";

// Single value
const result = await Validator.validate({
  value: "user@example.com",
  rules: ["Required", "Email"],
});

// Class validation
class Form {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([8])
  password: string;
}

const result = await Validator.validateTarget(Form, data);

// Error handling
if (result.success) {
  // Use result.value or result.data
} else {
  // Handle result.message or result.errors
}
```

For more examples, see the real-world examples section above. Happy validating! 🎉
