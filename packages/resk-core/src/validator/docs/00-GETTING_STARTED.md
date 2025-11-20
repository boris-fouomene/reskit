# Getting Started with @resk/core Validator

Welcome to the comprehensive guide for the Validator feature in the @resk/core package. This guide will help you understand how to use the validation system from the basics to advanced scenarios.

## Overview

The Validator is a powerful, type-safe validation system for TypeScript/JavaScript applications that provides:

- **Decorator-based validation** for class properties
- **Flexible rule system** with 40+ built-in validation rules
- **Async/sync support** for validation operations
- **Internationalization (i18n)** for multilingual error messages
- **Type safety** with full TypeScript support
- **Custom validation rules** for domain-specific logic
- **Multi-field validation** with error accumulation
- **Nested object validation** for complex data structures

## Installation

```bash
npm install @resk/core
```

## Quick Start

### 1. Basic Validation with Decorators

```typescript
import {
  Validator,
  IsRequired,
  IsEmail,
  MinLength,
} from "@resk/core/validator";

class UserForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @MinLength([3])
  name: string;

  @IsRequired
  @MinLength([8])
  password: string;
}

// Validate the data
const userData = {
  email: "user@example.com",
  name: "John Doe",
  password: "SecurePass123",
};

const result = await Validator.validateTarget(UserForm, { data: userData });

if (result.success) {
  console.log("Validation passed!", result.data);
} else {
  console.error("Validation failed!");
  result.errors.forEach((error) => {
    console.error(`${error.propertyName}: ${error.message}`);
  });
}
```

### 2. Single Value Validation

```typescript
const result = await Validator.validate({
  value: "user@example.com",
  rules: ["Required", "Email"],
});

if (result.success) {
  console.log("Email is valid:", result.value);
} else {
  console.error("Email is invalid:", result.error.message);
}
```

### 3. Custom Validation Rules

```typescript
// Define a custom rule
Validator.registerRule("StrongPassword", ({ value }) => {
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasSpecialChars = /[!@#$%^&*]/.test(value);

  if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars)) {
    return "Password must contain uppercase, lowercase, numbers, and special characters";
  }
  return true;
});

// Use the custom rule
class SecurePasswordForm {
  @IsRequired
  @MinLength([12])
  @Validator.buildPropertyDecorator(["StrongPassword"])
  password: string;
}
```

## Key Concepts

### Validation Rules

Validation rules are reusable functions that validate a single value. They can be:

1. **Named Rules** - Built-in rules by name: `"Email"`, `"Required"`, `"MinLength"`
2. **Parameterized Rules** - Rules with parameters: `"MinLength[5]"`, `"MaxLength[100]"`
3. **Object Rules** - Type-safe rule objects: `{ MinLength: [5] }`
4. **Function Rules** - Custom validation functions: `({ value }) => value.length > 0 || "Required"`

### Decorators

Decorators are applied to class properties to automatically validate values when the class is validated:

```typescript
class MyClass {
  @IsRequired // Simple decorator, no parameters
  @MinLength([3]) // Decorator with parameters
  @IsEmail // Another simple decorator
  email: string;
}
```

### Validation Results

The validator returns discriminated union types that indicate success or failure:

```typescript
// Single value validation result
type ValidateResult =
  | { success: true; value: any; validatedAt: Date; duration: number }
  | {
      success: false;
      error: ValidationError;
      failedAt: Date;
      duration: number;
    };

// Class validation result
type ValidateTargetResult =
  | { success: true; data: T; validatedAt: Date; duration: number }
  | {
      success: false;
      errors: ValidationError[];
      failureCount: number;
      failedAt: Date;
      duration: number;
    };
```

### Type Safety

The validator is fully typed with TypeScript:

```typescript
interface ValidationContext {
  userId: number;
  userRole: "admin" | "user";
}

// Type-safe validation with context
const result = await Validator.validate<ValidationContext>({
  value: "test@example.com",
  rules: ["Required", "Email"],
  context: {
    userId: 123,
    userRole: "admin",
  },
});
```

## Validation Flow

### Single Value Validation Flow

```
Input Value
    ↓
Parse Rules → Sanitize Rules → Execute Rules (sequentially)
    ↓
First Rule Fails? → Return Failure Result
    ↓
All Rules Pass? → Return Success Result
```

### Class Validation Flow

```
Class Data
    ↓
Extract Decorated Properties
    ↓
For Each Property:
  - Parse Decorators
  - Execute Rules (sequentially per property)
  - Collect Errors
    ↓
Any Property Failed? → Return Failure Result with All Errors
    ↓
All Properties Passed? → Return Success Result
```

## Common Patterns

### Optional Fields

```typescript
class UserForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsOptional // Can be omitted entirely
  @IsUrl
  website?: string;

  @IsNullable // Can be null or undefined
  @IsNumber
  age?: number;
}
```

### Nullable vs Optional vs Empty

- **@IsOptional** - Skips validation if value is `undefined`
- **@IsNullable** - Skips validation if value is `null` or `undefined`
- **@IsEmpty** - Skips validation if value is an empty string `""`

### Nested Objects

```typescript
class Address {
  @IsRequired
  street: string;

  @IsRequired
  city: string;
}

class User {
  @IsRequired
  name: string;

  @ValidateNested([Address])
  address: Address;
}

// Validates nested address
const result = await Validator.validateTarget(User, {
  data: {
    name: "John",
    address: {
      street: "123 Main St",
      city: "Springfield",
    },
  },
});
```

### Multi-Rule Validation (OneOf, AllOf, ArrayOf)

```typescript
class Contact {
  // Accept either email OR phone
  @OneOf(["Email", "PhoneNumber"])
  contact: string;

  // Must match ALL rules
  @AllOf(["MinLength[8]", "StrongPassword"])
  password: string;

  // Array where each item must match rules
  @ArrayOf(["Email"])
  emails: string[];
}
```

## Error Handling

```typescript
const result = await Validator.validate({
  value: "invalid@",
  rules: ["Required", "Email"],
});

if (!result.success) {
  const error = result.error;
  console.log("Error Details:");
  console.log("  Rule:", error.ruleName); // "Email"
  console.log("  Message:", error.message); // "Invalid email format"
  console.log("  Value:", error.value); // "invalid@"
  console.log("  Property:", error.propertyName); // Optional property name
  console.log("  Duration:", result.duration); // Milliseconds
}
```

## Next Steps

- **[01-VALIDATION_RULES.md](01-VALIDATION_RULES.md)** - Comprehensive guide to all 40+ built-in validation rules
- **[02-DECORATORS.md](02-DECORATORS.md)** - Complete decorator reference with examples
- **[03-ADVANCED_USAGE.md](03-ADVANCED_USAGE.md)** - Custom rules, context, async validation
- **[04-API_REFERENCE.md](04-API_REFERENCE.md)** - Complete Validator class API documentation
- **[05-EXAMPLES.md](05-EXAMPLES.md)** - Real-world usage examples
- **[06-TROUBLESHOOTING.md](06-TROUBLESHOOTING.md)** - Common issues and solutions

## Key Features at a Glance

| Feature                | Benefit                                     |
| ---------------------- | ------------------------------------------- |
| **Type Safety**        | Compile-time error detection in TypeScript  |
| **Decorators**         | Simple, readable class property validation  |
| **40+ Rules**          | Covers most common validation scenarios     |
| **Custom Rules**       | Easy to extend with domain-specific logic   |
| **Async Support**      | Validate async operations (API calls, etc.) |
| **i18n Support**       | Multilingual error messages                 |
| **Error Accumulation** | All field errors returned together          |
| **Nested Validation**  | Support for complex object structures       |
| **Performance**        | Parallel validation where possible          |
| **Chainable API**      | Easy to compose validation rules            |

---

**Ready to dive deeper?** Continue with [01-VALIDATION_RULES.md](01-VALIDATION_RULES.md) to explore all available validation rules.
