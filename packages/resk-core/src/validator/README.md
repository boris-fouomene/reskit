# Resk Validator Module - Complete User Guide

## Table of Contents

1. [Overview](#overview)
2. [Installation and Setup](#installation-and-setup)
3. [Core Concepts](#core-concepts)
4. [Quick Start](#quick-start)
5. [Validator Class](#validator-class)
6. [Laravel Validation Rules](#laravel-validation-rules)
7. [Type Definitions](#type-definitions)
8. [Internationalization](#internationalization)
9. [Decorators](#decorators)
10. [Advanced Usage](#advanced-usage)
11. [Custom Rules](#custom-rules)
12. [Error Handling](#error-handling)
13. [Best Practices](#best-practices)
14. [Examples](#examples)
15. [API Reference](#api-reference)

## Overview

The Resk Validator Module is a powerful, type-safe validation system that provides Laravel 12-compatible validation rules with full TypeScript support. It offers comprehensive validation capabilities for both client-side and server-side applications with built-in internationalization, async support, and decorator patterns.

### Key Features

- ✅ **Laravel 12 Compatibility** - All Laravel validation rules with identical syntax
- ✅ **Type Safety** - Full TypeScript support with generic types
- ✅ **Internationalization** - Built-in i18n support for 47+ validation messages
- ✅ **Async Validation** - Support for both synchronous and asynchronous rules
- ✅ **Decorator Support** - Property decorators for class-based validation
- ✅ **Custom Rules** - Easy registration of custom validation logic
- ✅ **Context Validation** - Pass additional data to validation rules
- ✅ **Error Formatting** - Detailed error messages with field context

## Installation and Setup

```typescript
import { Validator } from '@resk/core/validator';
// Or import specific components
import { 
  Validator, 
  IValidatorValidateOptions, 
  IValidatorRuleFunction 
} from '@resk/core/validator';
```

## Core Concepts

### Validation Rules

Rules can be defined in multiple formats:

1. **String Format**: `'required'`, `'minLength[5]'`, `'between[10,20]'`
2. **Object Format**: `{ required: [], minLength: [5], between: [10, 20] }`
3. **Function Format**: `({ value }) => value > 0 || 'Must be positive'`

### Rule Execution

- Rules are executed sequentially in the order they appear
- Validation stops at the first failing rule
- Supports both sync and async validation functions

### Context Data

Additional data can be passed to validation rules through the context parameter, enabling complex validations that depend on other form fields or external data.

## Quick Start

### Basic Validation

```typescript
import { Validator } from '@resk/core/validator';

// Simple validation
try {
  const result = await Validator.validate({
    value: 'user@example.com',
    rules: ['required', 'email'],
    fieldName: 'email'
  });
  console.log('Validation passed!');
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### Multiple Rules with Parameters

```typescript
// Complex validation with parameters
const passwordValidation = await Validator.validate({
  value: 'mySecurePassword123',
  rules: [
    'required',
    'string',
    'minLength[8]',
    'maxLength[50]',
    'regex[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$/]'
  ],
  fieldName: 'password',
  translatedPropertyName: 'Password'
});
```

### Object Rules Format

```typescript
const validationRules = {
  required: [],
  minLength: [8],
  maxLength: [50],
  alpha_num: []
};

const result = await Validator.validate({
  value: 'username123',
  rules: [validationRules],
  fieldName: 'username'
});
```

## Validator Class

The `Validator` class is the core of the validation system, providing static methods for rule registration, validation, and management.

### Static Methods

#### `registerRule<ParamType, Context>(ruleName, ruleHandler)`

Registers a new custom validation rule that can be used throughout the application.

**Parameters:**
- `ruleName: string` - Unique identifier for the validation rule
- `ruleHandler: IValidatorRuleFunction` - Function that performs the validation logic

**Example:**
```typescript
// Register a simple custom rule
Validator.registerRule('positiveNumber', ({ value }) => {
  return value > 0 || 'Must be a positive number';
});

// Register an async rule with database check
Validator.registerRule('uniqueEmail', async ({ value, context }) => {
  const user = await database.findUserByEmail(value);
  return !user || 'Email address is already taken';
});

// Register a rule with multiple parameters
Validator.registerRule('betweenDates', ({ value, ruleParams }) => {
  const [startDate, endDate] = ruleParams;
  const date = new Date(value);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return (date >= start && date <= end) || 
         `Date must be between ${startDate} and ${endDate}`;
});
```

#### `validate<Context>(options)`

Performs comprehensive validation of a single value against a set of validation rules.

**Parameters:**
- `options.value: any` - The value to validate
- `options.rules: IValidatorRule[]` - Array of validation rules
- `options.fieldName?: string` - Name of the field being validated
- `options.translatedPropertyName?: string` - Localized field name for error messages
- `options.context?: Context` - Additional context data passed to validation rules

**Returns:** `Promise<IValidatorValidateOptions>` - Resolves on success, rejects on failure

**Example:**
```typescript
// Basic validation
const emailValidation = await Validator.validate({
  value: 'test@example.com',
  rules: ['required', 'email'],
  fieldName: 'userEmail',
  translatedPropertyName: 'Email Address'
});

// Validation with context
interface FormContext {
  userId: number;
  currentPassword: string;
}

const passwordValidation = await Validator.validate<FormContext>({
  value: 'newPassword123',
  rules: [
    'required',
    'minLength[8]',
    ({ value, context }) => {
      return value !== context.currentPassword || 
             'New password must be different from current password';
    }
  ],
  fieldName: 'newPassword',
  context: {
    userId: 123,
    currentPassword: 'oldPassword456'
  }
});
```

#### `getRules()`

Retrieves an immutable copy of all currently registered validation rules.

**Returns:** `IValidatorRuleMap` - Object containing all registered rules

**Example:**
```typescript
const allRules = Validator.getRules();
console.log('Available rules:', Object.keys(allRules));

// Check if a specific rule exists
const hasEmailRule = 'email' in Validator.getRules();
console.log('Email rule available:', hasEmailRule);
```

#### `findRegisteredRule<ParamType, Context>(ruleName)`

Locates and returns a specific validation rule by its name.

**Parameters:**
- `ruleName: string` - The name of the rule to find

**Returns:** `IValidatorRuleFunction | undefined` - The rule function if found

**Example:**
```typescript
// Find and use a rule directly
const emailRule = Validator.findRegisteredRule('email');
if (emailRule) {
  const result = await emailRule({
    value: 'test@example.com',
    ruleParams: []
  });
}

// Type-safe rule access
const minLengthRule = Validator.findRegisteredRule<[number]>('minLength');
if (minLengthRule) {
  const result = await minLengthRule({
    value: 'hello',
    ruleParams: [5]
  });
}
```

#### `parseAndValidateRules(inputRules)`

Converts various input rule formats into a standardized, executable format.

**Parameters:**
- `inputRules: IValidatorRule[]` - Array of rules in various formats

**Returns:** `{ sanitizedRules: IValidatorSanitizedRules, invalidRules: IValidatorRule[] }`

**Example:**
```typescript
const mixedRules = [
  'required',
  'minLength[3]',
  { maxLength: [50] },
  ({ value }) => value.includes('@') || 'Must contain @'
];

const { sanitizedRules, invalidRules } = Validator.parseAndValidateRules(mixedRules);
console.log('Valid rules:', sanitizedRules.length);
console.log('Invalid rules:', invalidRules);
```

#### `getErrorMessageSeparators()`

Retrieves the configured separators used for formatting validation error messages.

**Returns:** `{ multiple: string, single: string }` - Separator configuration

**Example:**
```typescript
const separators = Validator.getErrorMessageSeparators();
const errors = ['Field is required', 'Must be an email'];
const errorMessage = errors.join(separators.multiple);
```

## Laravel Validation Rules

The module includes 69+ Laravel-compatible validation rules organized into six categories:

### Boolean Rules

#### `Accepted`
Field must be "yes", "on", 1, "1", true, or "true".

```typescript
await Validator.validate({
  value: true,
  rules: ['accepted'],
  fieldName: 'terms'
});
```

#### `AcceptedIf`
Conditionally accepted based on another field's value.

```typescript
await Validator.validate({
  value: 'yes',
  rules: ['acceptedIf[newsletter,true]'],
  fieldName: 'marketing',
  context: { newsletter: true }
});
```

#### `Boolean`
Field must be castable to boolean (true, false, 1, 0, "1", "0").

```typescript
await Validator.validate({
  value: 1,
  rules: ['boolean'],
  fieldName: 'isActive'
});
```

#### `Declined`
Field must be "no", "off", 0, "0", false, or "false".

```typescript
await Validator.validate({
  value: false,
  rules: ['declined'],
  fieldName: 'spam'
});
```

#### `DeclinedIf`
Conditionally declined based on another field's value.

```typescript
await Validator.validate({
  value: 'no',
  rules: ['declinedIf[age,under18]'],
  fieldName: 'alcohol',
  context: { age: 'under18' }
});
```

### String Rules

#### `Alpha`
Only alphabetic characters allowed.

```typescript
await Validator.validate({
  value: 'JohnDoe',
  rules: ['alpha'],
  fieldName: 'name'
});
```

#### `AlphaDash`
Alpha-numeric characters, dashes, and underscores.

```typescript
await Validator.validate({
  value: 'user_name-123',
  rules: ['alphaDash'],
  fieldName: 'username'
});
```

#### `AlphaNum`
Only alpha-numeric characters.

```typescript
await Validator.validate({
  value: 'User123',
  rules: ['alphaNum'],
  fieldName: 'identifier'
});
```

#### `Email`
Valid email address with multiple validation styles.

```typescript
// Basic email validation
await Validator.validate({
  value: 'user@example.com',
  rules: ['email'],
  fieldName: 'email'
});

// Email with specific validation (RFC, DNS, etc.)
await Validator.validate({
  value: 'user@example.com',
  rules: ['email[rfc]'],
  fieldName: 'email'
});
```

#### `Confirmed`
Must have matching confirmation field.

```typescript
await Validator.validate({
  value: 'password123',
  rules: ['confirmed'],
  fieldName: 'password',
  context: { password_confirmation: 'password123' }
});
```

#### `Json`
Valid JSON string.

```typescript
await Validator.validate({
  value: '{"name": "John", "age": 30}',
  rules: ['json'],
  fieldName: 'metadata'
});
```

#### `Regex`
Must match regular expression.

```typescript
await Validator.validate({
  value: 'ABC-123',
  rules: ['regex[/^[A-Z]{3}-\\d{3}$/]'],
  fieldName: 'code'
});
```

#### `Url`
Valid URL with protocol support.

```typescript
await Validator.validate({
  value: 'https://example.com',
  rules: ['url'],
  fieldName: 'website'
});
```

#### `Uuid`
Valid UUID (versions 1-8).

```typescript
await Validator.validate({
  value: '550e8400-e29b-41d4-a716-446655440000',
  rules: ['uuid'],
  fieldName: 'id'
});
```

### Numeric Rules

#### `Between`
Value must be between minimum and maximum.

```typescript
// Numeric between
await Validator.validate({
  value: 25,
  rules: ['between[18,65]'],
  fieldName: 'age'
});

// String length between
await Validator.validate({
  value: 'hello',
  rules: ['between[3,10]'],
  fieldName: 'message'
});
```

#### `Min` / `Max`
Minimum or maximum value/length.

```typescript
// Numeric minimum
await Validator.validate({
  value: 18,
  rules: ['min[18]'],
  fieldName: 'age'
});

// String minimum length
await Validator.validate({
  value: 'password123',
  rules: ['min[8]'],
  fieldName: 'password'
});
```

#### `Integer`
Must be an integer.

```typescript
await Validator.validate({
  value: 42,
  rules: ['integer'],
  fieldName: 'count'
});
```

#### `Decimal`
Specific number of decimal places.

```typescript
await Validator.validate({
  value: 19.99,
  rules: ['decimal[2]'],
  fieldName: 'price'
});
```

### Array Rules

#### `Array`
Value must be an array.

```typescript
await Validator.validate({
  value: [1, 2, 3],
  rules: ['array'],
  fieldName: 'items'
});
```

#### `In`
Value must be in the specified list.

```typescript
await Validator.validate({
  value: 'red',
  rules: ['in[red,green,blue]'],
  fieldName: 'color'
});
```

#### `NotIn`
Value must not be in the specified list.

```typescript
await Validator.validate({
  value: 'purple',
  rules: ['notIn[red,green,blue]'],
  fieldName: 'color'
});
```

### Conditional Rules

#### `Required`
Field must be present and not empty.

```typescript
await Validator.validate({
  value: 'John Doe',
  rules: ['required'],
  fieldName: 'name'
});
```

#### `RequiredIf`
Required if another field equals a specific value.

```typescript
await Validator.validate({
  value: 'Spouse Name',
  rules: ['requiredIf[maritalStatus,married]'],
  fieldName: 'spouseName',
  context: { maritalStatus: 'married' }
});
```

#### `RequiredUnless`
Required unless another field equals a specific value.

```typescript
await Validator.validate({
  value: 'Business Email',
  rules: ['requiredUnless[accountType,personal]'],
  fieldName: 'businessEmail',
  context: { accountType: 'business' }
});
```

#### `RequiredWith`
Required if any of the specified fields are present.

```typescript
await Validator.validate({
  value: 'Last Name',
  rules: ['requiredWith[firstName]'],
  fieldName: 'lastName',
  context: { firstName: 'John' }
});
```

#### `Nullable`
Field can be null or undefined.

```typescript
await Validator.validate({
  value: null,
  rules: ['nullable', 'string'],
  fieldName: 'middleName'
});
```

#### `Sometimes`
Only validate if field is present.

```typescript
await Validator.validate({
  value: undefined,
  rules: ['sometimes', 'email'],
  fieldName: 'optionalEmail'
});
```

### Utility Rules

#### `Present`
Field must be present (but can be empty).

```typescript
await Validator.validate({
  value: '',
  rules: ['present'],
  fieldName: 'emptyField'
});
```

#### `Filled`
Field must be present and not empty when present.

```typescript
await Validator.validate({
  value: 'content',
  rules: ['filled'],
  fieldName: 'description'
});
```

#### `Same`
Field must be the same as another field.

```typescript
await Validator.validate({
  value: 'password123',
  rules: ['same[password]'],
  fieldName: 'passwordConfirmation',
  context: { password: 'password123' }
});
```

#### `Different`
Field must be different from another field.

```typescript
await Validator.validate({
  value: 'newPassword456',
  rules: ['different[currentPassword]'],
  fieldName: 'newPassword',
  context: { currentPassword: 'oldPassword123' }
});
```

## Type Definitions

### Core Types

#### `IValidatorRule<ParamType, Context>`
Represents various formats a validation rule can take.

```typescript
type IValidatorRule<ParamType extends Array<any> = Array<any>, Context = unknown> = 
  | IValidatorRuleFunction<ParamType, Context>
  | IValidatorRuleName 
  | `${IValidatorRuleName}[${string}]` 
  | Record<IValidatorRuleName, ParamType>;
```

#### `IValidatorRuleFunction<ParamType, Context>`
Type definition for validation rule functions.

```typescript
type IValidatorRuleFunction<ParamType extends Array<any> = Array<any>, Context = unknown> = 
  (options: IValidatorValidateOptions<ParamType, Context>) => IValidatorResult;
```

#### `IValidatorValidateOptions<ParamType, Context>`
Configuration object for validation operations.

```typescript
interface IValidatorValidateOptions<ParamType extends Array<any> = Array<any>, Context = unknown> {
  rules?: IValidatorRule[];
  value: any;
  fieldName?: string;
  propertyName?: string;
  translatedPropertyName?: string;
  context?: Context;
  ruleParams?: ParamType;
  [key: string]: any;
}
```

#### `IValidatorResult`
Possible return types from validation functions.

```typescript
type IValidatorResult = boolean | string | Promise<boolean | string>;
```

### Sanitized Rule Types

#### `IValidatorSanitizedRule<ParamType, Context>`
Standardized format for processed validation rules.

```typescript
type IValidatorSanitizedRule<ParamType extends Array<any> = Array<any>, Context = unknown> =
  | IValidatorRuleFunction<ParamType, Context>
  | {
      ruleName: IValidatorRuleName;
      params: ParamType;
      ruleFunction: IValidatorRuleFunction<ParamType, Context>;
      rawRuleName: string;
    };
```

## Internationalization

The validator module includes comprehensive internationalization support with 47+ predefined validation messages.

### Translation Keys

The validation system supports translations for all Laravel validation rules:

```typescript
// Example translation structure
const laravelValidationTranslations = {
  accepted: "The {propertyName} must be accepted.",
  acceptedIf: "The {propertyName} must be accepted when {other} is {value}.",
  alpha: "The {propertyName} may only contain letters.",
  alphaDash: "The {propertyName} may only contain letters, numbers, dashes and underscores.",
  alphaNum: "The {propertyName} may only contain letters and numbers.",
  email: "The {propertyName} must be a valid email address.",
  required: "The {propertyName} field is required.",
  minLength: "The {propertyName} must be at least {min} characters.",
  maxLength: "The {propertyName} may not be greater than {max} characters.",
  between: "The {propertyName} must be between {min} and {max}.",
  // ... and 40+ more translations
};
```

### Using Translations

```typescript
// Field name will be automatically translated
await Validator.validate({
  value: '',
  rules: ['required'],
  fieldName: 'email',
  translatedPropertyName: 'Email Address' // Custom translated name
});

// Error message will be: "The Email Address field is required."
```

### Custom Translation Messages

```typescript
// Register custom validation with translation support
Validator.registerRule('customRule', ({ value, translatedPropertyName }) => {
  if (!isValid(value)) {
    return i18n.t('validation.customRule', { 
      propertyName: translatedPropertyName || 'field' 
    });
  }
  return true;
});
```

## Decorators

The validation system provides property decorators for class-based validation.

### Using Validation Decorators

```typescript
import { validate, required, email, minLength } from '@resk/core/validator';

class UserRegistration {
  @required()
  @minLength(2)
  firstName: string;

  @required()
  @minLength(2)
  lastName: string;

  @required()
  @email()
  email: string;

  @required()
  @minLength(8)
  password: string;

  constructor(data: Partial<UserRegistration>) {
    Object.assign(this, data);
  }
}

// Validate instance
const user = new UserRegistration({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'securePassword123'
});

try {
  await Validator.validateTarget(user);
  console.log('User validation passed!');
} catch (error) {
  console.error('Validation errors:', error);
}
```

### Available Decorators

All Laravel validation rules are available as decorators:

```typescript
class ProductModel {
  @required()
  @string()
  @minLength(3)
  @maxLength(100)
  name: string;

  @required()
  @numeric()
  @min(0)
  @decimal(2)
  price: number;

  @required()
  @array()
  @minSize(1)
  categories: string[];

  @nullable()
  @string()
  @maxLength(500)
  description?: string;

  @boolean()
  isActive: boolean = true;

  @url()
  @nullable()
  website?: string;
}
```

## Advanced Usage

### Async Validation

The validator fully supports asynchronous validation rules:

```typescript
// Async database validation
Validator.registerRule('uniqueUsername', async ({ value, context }) => {
  const existingUser = await database.users.findOne({ username: value });
  if (existingUser && existingUser.id !== context?.currentUserId) {
    return 'Username is already taken';
  }
  return true;
});

// Usage
await Validator.validate({
  value: 'newuser123',
  rules: ['required', 'alphaNum', 'uniqueUsername'],
  fieldName: 'username',
  context: { currentUserId: 456 }
});
```

### Complex Context Validation

```typescript
interface FormValidationContext {
  user: {
    id: number;
    role: string;
    permissions: string[];
  };
  formData: Record<string, any>;
  settings: {
    minAge: number;
    maxAge: number;
  };
}

// Permission-based validation
Validator.registerRule('requiresPermission', ({ value, ruleParams, context }) => {
  const [requiredPermission] = ruleParams;
  const userPermissions = context?.user?.permissions || [];
  
  if (!userPermissions.includes(requiredPermission)) {
    return `Access denied: requires ${requiredPermission} permission`;
  }
  return true;
});

// Age range validation with context
Validator.registerRule('ageInRange', ({ value, context }) => {
  const age = parseInt(value);
  const { minAge, maxAge } = context?.settings || { minAge: 18, maxAge: 100 };
  
  if (age < minAge || age > maxAge) {
    return `Age must be between ${minAge} and ${maxAge}`;
  }
  return true;
});

// Usage with complex context
const validationContext: FormValidationContext = {
  user: {
    id: 123,
    role: 'admin',
    permissions: ['user.create', 'user.edit']
  },
  formData: { /* other form fields */ },
  settings: {
    minAge: 21,
    maxAge: 65
  }
};

await Validator.validate<FormValidationContext>({
  value: 'user.create',
  rules: ['required', 'requiresPermission[user.create]'],
  fieldName: 'action',
  context: validationContext
});
```

### Conditional Validation Chains

```typescript
// Complex conditional validation
const validateUserProfile = async (userData: any) => {
  const rules = ['required', 'string'];
  
  // Add email validation if email is provided
  if (userData.email) {
    rules.push('email');
  }
  
  // Add phone validation for premium users
  if (userData.accountType === 'premium') {
    rules.push('requiredWith[email]');
  }
  
  return await Validator.validate({
    value: userData.contactInfo,
    rules,
    fieldName: 'contactInfo',
    context: userData
  });
};
```

### Batch Validation

```typescript
const validateUserForm = async (formData: Record<string, any>) => {
  const validationTasks = [
    Validator.validate({
      value: formData.firstName,
      rules: ['required', 'string', 'minLength[2]'],
      fieldName: 'firstName'
    }),
    Validator.validate({
      value: formData.email,
      rules: ['required', 'email'],
      fieldName: 'email'
    }),
    Validator.validate({
      value: formData.age,
      rules: ['required', 'integer', 'min[18]'],
      fieldName: 'age'
    })
  ];

  try {
    await Promise.all(validationTasks);
    return { valid: true, errors: [] };
  } catch (errors) {
    return { valid: false, errors };
  }
};
```

## Custom Rules

Creating custom validation rules is straightforward and powerful:

### Simple Custom Rules

```typescript
// Basic custom rule
Validator.registerRule('positiveNumber', ({ value }) => {
  return (typeof value === 'number' && value > 0) || 
         'Value must be a positive number';
});

// Rule with parameters
Validator.registerRule('divisibleBy', ({ value, ruleParams }) => {
  const [divisor] = ruleParams;
  const num = parseFloat(value);
  const div = parseFloat(divisor);
  
  if (isNaN(num) || isNaN(div) || div === 0) {
    return 'Invalid number format';
  }
  
  return (num % div === 0) || `Value must be divisible by ${divisor}`;
});

// Usage
await Validator.validate({
  value: 15,
  rules: ['positiveNumber', 'divisibleBy[5]'],
  fieldName: 'quantity'
});
```

### Advanced Custom Rules

```typescript
// File validation rule
Validator.registerRule('fileSize', ({ value, ruleParams }) => {
  const [maxSizeInMB] = ruleParams;
  
  if (!(value instanceof File)) {
    return 'Value must be a file';
  }
  
  const maxSizeInBytes = parseFloat(maxSizeInMB) * 1024 * 1024;
  
  return (value.size <= maxSizeInBytes) || 
         `File size must not exceed ${maxSizeInMB}MB`;
});

// Credit card validation
Validator.registerRule('creditCard', ({ value, ruleParams }) => {
  const cardType = ruleParams?.[0];
  
  // Remove spaces and dashes
  const cleanNumber = value.replace(/[\s-]/g, '');
  
  // Basic length and digit check
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return 'Invalid credit card number format';
  }
  
  // Luhn algorithm
  const luhnCheck = (num: string) => {
    let sum = 0;
    let isEven = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };
  
  if (!luhnCheck(cleanNumber)) {
    return 'Invalid credit card number';
  }
  
  // Card type specific validation
  if (cardType) {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/
    };
    
    const pattern = patterns[cardType.toLowerCase()];
    if (pattern && !pattern.test(cleanNumber)) {
      return `Invalid ${cardType} card number`;
    }
  }
  
  return true;
});
```

### Async Custom Rules

```typescript
// Domain validation with DNS lookup
Validator.registerRule('validDomain', async ({ value }) => {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${value}&type=A`);
    const data = await response.json();
    
    return (data.Status === 0 && data.Answer?.length > 0) || 
           'Domain does not exist or is not reachable';
  } catch (error) {
    return 'Unable to verify domain';
  }
});

// Password strength with external service
Validator.registerRule('passwordStrength', async ({ value, ruleParams }) => {
  const [minimumScore] = ruleParams || [3];
  
  try {
    const response = await fetch('/api/password-strength', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: value })
    });
    
    const { score } = await response.json();
    
    return (score >= minimumScore) || 
           `Password strength must be at least ${minimumScore}/5`;
  } catch (error) {
    return 'Unable to verify password strength';
  }
});
```

## Error Handling

The validator provides detailed error information for effective debugging and user feedback:

### Error Types

```typescript
// Validation failure error
try {
  await Validator.validate({
    value: '',
    rules: ['required'],
    fieldName: 'email'
  });
} catch (error) {
  console.log(error.message);        // "The email field is required."
  console.log(error.ruleName);       // "required"
  console.log(error.fieldName);      // "email"
  console.log(error.value);          // ""
  console.log(error.ruleParams);     // []
}

// Invalid rule error
try {
  await Validator.validate({
    value: 'test',
    rules: ['nonExistentRule'],
    fieldName: 'field'
  });
} catch (error) {
  console.log(error.invalidRules);   // ["nonExistentRule"]
  console.log(error.message);        // "Invalid validation rules: nonExistentRule"
}
```

### Custom Error Messages

```typescript
// Rule with custom error message
Validator.registerRule('businessHours', ({ value, translatedPropertyName }) => {
  const hour = new Date(value).getHours();
  
  if (hour < 9 || hour > 17) {
    return `${translatedPropertyName || 'Time'} must be during business hours (9 AM - 5 PM)`;
  }
  
  return true;
});

// Context-aware error messages
Validator.registerRule('ageRequirement', ({ value, ruleParams, context, translatedPropertyName }) => {
  const [minimumAge] = ruleParams;
  const userType = context?.userType || 'user';
  
  if (value < minimumAge) {
    const messages = {
      student: `Students must be at least ${minimumAge} years old`,
      employee: `Employees must be at least ${minimumAge} years old`,
      customer: `Customers must be at least ${minimumAge} years old`
    };
    
    return messages[userType] || `${translatedPropertyName} must be at least ${minimumAge}`;
  }
  
  return true;
});
```

### Error Recovery

```typescript
const validateWithFallback = async (value: any, primaryRules: string[], fallbackRules: string[]) => {
  try {
    return await Validator.validate({
      value,
      rules: primaryRules,
      fieldName: 'input'
    });
  } catch (primaryError) {
    console.warn('Primary validation failed, trying fallback:', primaryError.message);
    
    try {
      return await Validator.validate({
        value,
        rules: fallbackRules,
        fieldName: 'input'
      });
    } catch (fallbackError) {
      throw new Error(`Both primary and fallback validation failed: ${fallbackError.message}`);
    }
  }
};

// Usage
try {
  await validateWithFallback(
    'user@domain',
    ['email'],           // Primary: strict email validation
    ['string', 'min[3]'] // Fallback: basic string validation
  );
} catch (error) {
  console.error('All validation attempts failed:', error.message);
}
```

## Best Practices

### 1. Rule Organization

```typescript
// Group related rules logically
const userValidationRules = {
  name: ['required', 'string', 'minLength[2]', 'maxLength[50]'],
  email: ['required', 'email'],
  age: ['required', 'integer', 'min[18]', 'max[120]'],
  phone: ['nullable', 'regex[/^\\+?[1-9]\\d{1,14}$/]']
};

// Use rule constants for reusability
const PASSWORD_RULES = ['required', 'string', 'minLength[8]', 'maxLength[100]'];
const EMAIL_RULES = ['required', 'email'];
const NAME_RULES = ['required', 'string', 'minLength[2]', 'maxLength[50]'];
```

### 2. Context Design

```typescript
// Design clear context interfaces
interface UserValidationContext {
  currentUser?: {
    id: number;
    role: string;
    permissions: string[];
  };
  formMode: 'create' | 'update';
  settings: {
    minPasswordLength: number;
    requireStrongPassword: boolean;
  };
}

// Use context consistently
const validateUser = async (userData: any, context: UserValidationContext) => {
  const passwordRules = ['required', 'string'];
  
  if (context.settings.requireStrongPassword) {
    passwordRules.push(`minLength[${context.settings.minPasswordLength}]`);
    passwordRules.push('regex[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$/]');
  }
  
  return await Validator.validate({
    value: userData.password,
    rules: passwordRules,
    fieldName: 'password',
    context
  });
};
```

### 3. Error Message Consistency

```typescript
// Use consistent field naming
const fieldTranslations = {
  firstName: 'First Name',
  lastName: 'Last Name',
  emailAddress: 'Email Address',
  phoneNumber: 'Phone Number'
};

const validateField = async (fieldName: string, value: any, rules: string[]) => {
  return await Validator.validate({
    value,
    rules,
    fieldName,
    translatedPropertyName: fieldTranslations[fieldName] || fieldName
  });
};
```

### 4. Performance Optimization

```typescript
// Cache commonly used rule combinations
const ruleCache = new Map<string, string[]>();

const getCachedRules = (ruleKey: string, ruleFactory: () => string[]) => {
  if (!ruleCache.has(ruleKey)) {
    ruleCache.set(ruleKey, ruleFactory());
  }
  return ruleCache.get(ruleKey)!;
};

// Use for frequently validated fields
const emailRules = getCachedRules('email', () => ['required', 'email']);
const passwordRules = getCachedRules('password', () => ['required', 'string', 'minLength[8]']);
```

### 5. Testing Custom Rules

```typescript
// Comprehensive testing for custom rules
describe('Custom Validation Rules', () => {
  beforeAll(() => {
    Validator.registerRule('positiveNumber', ({ value }) => {
      return (typeof value === 'number' && value > 0) || 
             'Value must be a positive number';
    });
  });

  test('positiveNumber rule validation', async () => {
    // Test valid cases
    await expect(Validator.validate({
      value: 5,
      rules: ['positiveNumber'],
      fieldName: 'test'
    })).resolves.toBeTruthy();

    // Test invalid cases
    await expect(Validator.validate({
      value: -5,
      rules: ['positiveNumber'],
      fieldName: 'test'
    })).rejects.toThrow('Value must be a positive number');

    await expect(Validator.validate({
      value: 'not a number',
      rules: ['positiveNumber'],
      fieldName: 'test'
    })).rejects.toThrow('Value must be a positive number');
  });
});
```

## Examples

### Complete Form Validation

```typescript
interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  terms: boolean;
  newsletter?: boolean;
}

const validateRegistrationForm = async (formData: RegistrationForm) => {
  const validationTasks = [
    // Name validation
    Validator.validate({
      value: formData.firstName,
      rules: ['required', 'string', 'minLength[2]', 'maxLength[50]', 'alpha'],
      fieldName: 'firstName',
      translatedPropertyName: 'First Name'
    }),

    Validator.validate({
      value: formData.lastName,
      rules: ['required', 'string', 'minLength[2]', 'maxLength[50]', 'alpha'],
      fieldName: 'lastName',
      translatedPropertyName: 'Last Name'
    }),

    // Email validation
    Validator.validate({
      value: formData.email,
      rules: ['required', 'email'],
      fieldName: 'email',
      translatedPropertyName: 'Email Address'
    }),

    // Password validation
    Validator.validate({
      value: formData.password,
      rules: [
        'required',
        'string',
        'minLength[8]',
        'regex[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/]'
      ],
      fieldName: 'password',
      translatedPropertyName: 'Password'
    }),

    // Password confirmation
    Validator.validate({
      value: formData.confirmPassword,
      rules: ['required', 'same[password]'],
      fieldName: 'confirmPassword',
      translatedPropertyName: 'Password Confirmation',
      context: { password: formData.password }
    }),

    // Age validation
    Validator.validate({
      value: formData.age,
      rules: ['required', 'integer', 'min[18]', 'max[120]'],
      fieldName: 'age',
      translatedPropertyName: 'Age'
    }),

    // Terms acceptance
    Validator.validate({
      value: formData.terms,
      rules: ['accepted'],
      fieldName: 'terms',
      translatedPropertyName: 'Terms and Conditions'
    }),

    // Optional newsletter subscription
    Validator.validate({
      value: formData.newsletter,
      rules: ['nullable', 'boolean'],
      fieldName: 'newsletter',
      translatedPropertyName: 'Newsletter Subscription'
    })
  ];

  try {
    await Promise.all(validationTasks);
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [error.message],
      fieldName: error.fieldName
    };
  }
};
```

### E-commerce Product Validation

```typescript
interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: File[];
  inStock: boolean;
  sku: string;
}

const validateProduct = async (product: Product) => {
  const validationRules = {
    name: {
      value: product.name,
      rules: ['required', 'string', 'minLength[3]', 'maxLength[100]'],
      translatedPropertyName: 'Product Name'
    },
    
    description: {
      value: product.description,
      rules: ['required', 'string', 'minLength[10]', 'maxLength[1000]'],
      translatedPropertyName: 'Description'
    },
    
    price: {
      value: product.price,
      rules: ['required', 'numeric', 'min[0.01]', 'decimal[2]'],
      translatedPropertyName: 'Price'
    },
    
    category: {
      value: product.category,
      rules: ['required', 'in[electronics,clothing,books,home,sports]'],
      translatedPropertyName: 'Category'
    },
    
    tags: {
      value: product.tags,
      rules: ['required', 'array', 'minSize[1]', 'maxSize[10]'],
      translatedPropertyName: 'Tags'
    },
    
    sku: {
      value: product.sku,
      rules: ['required', 'string', 'regex[/^[A-Z]{2}-\\d{4}$/]'],
      translatedPropertyName: 'SKU'
    }
  };

  const results = await Promise.allSettled(
    Object.entries(validationRules).map(([fieldName, config]) =>
      Validator.validate({
        ...config,
        fieldName
      })
    )
  );

  const errors = results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map(result => result.reason.message);

  return {
    valid: errors.length === 0,
    errors
  };
};
```

### User Profile Update with Context

```typescript
interface UserProfile {
  username: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  bio: string;
  website?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface ProfileUpdateContext {
  currentUser: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  isPasswordChange: boolean;
  allowedDomains: string[];
}

const validateProfileUpdate = async (profile: UserProfile, context: ProfileUpdateContext) => {
  const validations: Promise<any>[] = [];

  // Username validation (only if changed)
  if (profile.username !== context.currentUser.username) {
    validations.push(
      Validator.validate({
        value: profile.username,
        rules: [
          'required',
          'string',
          'minLength[3]',
          'maxLength[30]',
          'alphaDash',
          'uniqueUsername'
        ],
        fieldName: 'username',
        context
      })
    );
  }

  // Email validation (only if changed)
  if (profile.email !== context.currentUser.email) {
    const emailRules = ['required', 'email'];
    
    // Add domain restriction for certain roles
    if (context.currentUser.role === 'employee') {
      emailRules.push(`emailDomain[${context.allowedDomains.join(',')}]`);
    }
    
    validations.push(
      Validator.validate({
        value: profile.email,
        rules: emailRules,
        fieldName: 'email',
        context
      })
    );
  }

  // Password change validation
  if (context.isPasswordChange) {
    validations.push(
      Validator.validate({
        value: profile.currentPassword,
        rules: ['required', 'currentPassword'],
        fieldName: 'currentPassword',
        context
      }),
      
      Validator.validate({
        value: profile.newPassword,
        rules: [
          'required',
          'string',
          'minLength[8]',
          'different[currentPassword]',
          'strongPassword'
        ],
        fieldName: 'newPassword',
        context: { ...context, currentPassword: profile.currentPassword }
      })
    );
  }

  // Bio validation
  validations.push(
    Validator.validate({
      value: profile.bio,
      rules: ['nullable', 'string', 'maxLength[500]'],
      fieldName: 'bio'
    })
  );

  // Website validation
  if (profile.website) {
    validations.push(
      Validator.validate({
        value: profile.website,
        rules: ['url'],
        fieldName: 'website'
      })
    );
  }

  // Social links validation
  Object.entries(profile.socialLinks).forEach(([platform, url]) => {
    if (url) {
      validations.push(
        Validator.validate({
          value: url,
          rules: ['url', `${platform}Url`],
          fieldName: `socialLinks.${platform}`
        })
      );
    }
  });

  try {
    await Promise.all(validations);
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [error.message],
      field: error.fieldName
    };
  }
};
```

## API Reference

### Validator Class Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `registerRule` | `ruleName: string, ruleHandler: Function` | `void` | Register a custom validation rule |
| `validate` | `options: IValidatorValidateOptions` | `Promise<IValidatorValidateOptions>` | Validate a value against rules |
| `getRules` | None | `IValidatorRuleMap` | Get all registered rules |
| `findRegisteredRule` | `ruleName: string` | `IValidatorRuleFunction \| undefined` | Find a specific rule |
| `parseAndValidateRules` | `inputRules: IValidatorRule[]` | `Object` | Parse and validate rule definitions |
| `getErrorMessageSeparators` | None | `Object` | Get error message formatting separators |
| `validateTarget` | `target: Object, options?: Object` | `Promise<Object>` | Validate a class instance using decorators |

### Laravel Validation Rules

#### Boolean Rules
- `accepted` - Must be accepted (yes, on, 1, true)
- `acceptedIf` - Conditionally accepted
- `boolean` - Must be boolean
- `declined` - Must be declined (no, off, 0, false)
- `declinedIf` - Conditionally declined

#### String Rules
- `alpha` - Only letters
- `alphaDash` - Letters, numbers, dashes, underscores
- `alphaNum` - Letters and numbers only
- `ascii` - 7-bit ASCII characters
- `confirmed` - Must have matching confirmation field
- `email` - Valid email address
- `endsWidth` - Must end with specified values
- `hexColor` - Valid hex color
- `json` - Valid JSON string
- `lowercase` - Must be lowercase
- `regex` - Must match regex pattern
- `startsWith` - Must start with specified values
- `string` - Must be a string
- `uppercase` - Must be uppercase
- `url` - Valid URL
- `uuid` - Valid UUID
- `ulid` - Valid ULID

#### Numeric Rules
- `between` - Value between min and max
- `decimal` - Specific decimal places
- `digits` - Exact number of digits
- `digitsBetween` - Digits count within range
- `integer` - Must be integer
- `max` - Maximum value
- `min` - Minimum value
- `multipleOf` - Must be multiple of value
- `numeric` - Must be numeric

#### Array Rules
- `array` - Must be array
- `distinct` - Array values must be unique
- `in` - Must be in specified list
- `inArray` - Must exist in another array
- `maxSize` - Maximum array size
- `minSize` - Minimum array size
- `notIn` - Must not be in specified list
- `size` - Exact array size

#### Conditional Rules
- `filled` - Must be present and not empty
- `nullable` - Can be null
- `present` - Must be present
- `prohibited` - Must not be present
- `prohibitedIf` - Conditionally prohibited
- `prohibitedUnless` - Prohibited unless condition
- `required` - Must be present and not empty
- `requiredIf` - Required if condition
- `requiredUnless` - Required unless condition
- `requiredWith` - Required with other fields
- `requiredWithAll` - Required with all other fields
- `requiredWithout` - Required without other fields
- `requiredWithoutAll` - Required without all other fields
- `sometimes` - Only validate if present

#### Utility Rules
- `different` - Must be different from another field
- `same` - Must be same as another field

### Type Definitions Summary

```typescript
// Core types
type IValidatorRule = IValidatorRuleFunction | string | Record<string, any>;
type IValidatorRuleFunction = (options: IValidatorValidateOptions) => IValidatorResult;
type IValidatorResult = boolean | string | Promise<boolean | string>;

// Configuration types
interface IValidatorValidateOptions {
  value: any;
  rules?: IValidatorRule[];
  fieldName?: string;
  translatedPropertyName?: string;
  context?: any;
  ruleParams?: any[];
}

// Result types
interface IValidatorSanitizedRule {
  ruleName: string;
  params: any[];
  ruleFunction: IValidatorRuleFunction;
  rawRuleName: string;
}
```

---

This comprehensive user guide covers all aspects of the Resk Validator Module. For additional support or custom implementations, refer to the TypeScript definitions and source code documentation.
