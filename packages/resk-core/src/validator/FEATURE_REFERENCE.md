# Validator - Complete Feature Reference

Comprehensive reference guide covering all Validator features, patterns, and use cases.

## Table of Contents

1. [Result Types & Either Pattern](#result-types--either-pattern)
2. [Single-Value Validation Methods](#single-value-validation-methods)
3. [Class-Based Validation](#class-based-validation)
4. [All Available Rules](#all-available-rules)
5. [Decorator Reference](#decorator-reference)
6. [Error Handling Patterns](#error-handling-patterns)
7. [Advanced Patterns](#advanced-patterns)
8. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Result Types & Either Pattern

The Validator uses an **Either pattern** (discriminated union) to ensure type-safe error handling without throwing exceptions.

### Single-Value Validation Result

**Success Case:**

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

**Failure Case:**

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

### Class Validation Result

**Success Case:**

```typescript
{
  success: true,
  data: T,                            // Validated class instance
  status: "success",
  validatedAt?: Date,
  duration?: number,
  context?: Context,
}
```

**Failure Case:**

```typescript
{
  success: false,
  message: string,                    // Summary of failures
  errors: IValidatorValidationError[],  // Array of field errors
  failureCount: number,               // Number of failed fields
  status: "error",
  failedAt?: Date,
  duration?: number,
  context?: Context,
}
```

### Error Object Structure

```typescript
interface IValidatorValidationError {
  name: "ValidatorValidationError";
  status: "error";
  fieldName?: string; // Form field identifier
  propertyName?: string; // Class property name
  message: string; // Error message
  translatedPropertyName?: string; // Localized property name
  ruleName?: string; // Which rule failed
  ruleParams?: any[]; // Rule parameters
  rawRuleName?: string; // Original rule specification
  value?: any; // Value that failed
}
```

### Type Narrowing

**Method 1: Check `success` property**

```typescript
const result = await Validator.validate({...});

if (result.success) {
  // TypeScript narrows to success type
  console.log(result.value);          // ✅ Safe
  console.log(result.validatedAt);    // ✅ Safe
  // console.log(result.message);     // ❌ Property doesn't exist on this type
} else {
  // TypeScript narrows to failure type
  console.log(result.message);        // ✅ Safe
  console.log(result.error);          // ✅ Safe
  // console.log(result.value);       // ❌ Property doesn't exist on this type
}
```

**Method 2: Type guards**

```typescript
if (Validator.isSuccess(result)) {
  // TypeScript knows it's success
  console.log(result.value);
}

if (Validator.isFailure(result)) {
  // TypeScript knows it's failure
  console.log(result.message);
}
```

**Method 3: Switch on status**

```typescript
switch (result.status) {
  case "success":
    // result is success type
    await handleSuccess(result.value);
    break;
  case "error":
    // result is failure type
    await handleError(result.message);
    break;
}
```

---

## Single-Value Validation Methods

### Basic Validation

```typescript
await Validator.validate({
  value: "test@example.com",
  rules: ["Required", "Email"],
});
```

### With All Options

```typescript
const result = await Validator.validate<any, MyContext>({
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
    // Any data your rules need
  },
});
```

### Single Rule Validation

```typescript
await Validator.validate({
  value: "test",
  rules: ["Email"], // Just one rule
});
```

### Multiple Rules

```typescript
await Validator.validate({
  value: "password123",
  rules: ["Required", "MinLength[8]", "MaxLength[50]", "NonNullString"],
});
```

### Parameterized Rules

```typescript
await Validator.validate({
  value: "test",
  rules: [
    "MinLength[5]", // Parameter in rule name
    "MaxLength[20]",
    "NumberGreaterThan[0]",
    "Enum[active,inactive,pending]",
  ],
});
```

### Custom Inline Rules

```typescript
await Validator.validate({
  value: "test",
  rules: [
    "Required",

    // Sync custom rule
    ({ value }) => {
      return value.length >= 5 || "Minimum 5 characters";
    },

    // Async custom rule
    async ({ value, context }) => {
      const isUnique = await checkUniqueness(value);
      return isUnique || "Value already exists";
    },
  ],
});
```

---

## Class-Based Validation

### Basic Class Validation

```typescript
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
  password: "SecurePass123",
});
```

### With Options

```typescript
const result = await Validator.validateTarget<UserForm, MyContext>(
  UserForm,
  data,
  {
    // Options object
    context: {
      /* validation context */
    },
    errorMessageBuilder: (fieldName, error) => `❌ ${fieldName}: ${error}`,
    locale: "fr", // Language for error messages
  }
);
```

### Result Handling

```typescript
if (result.success) {
  // All fields valid
  console.log(result.data); // Fully typed as UserForm
  console.log(result.duration); // Time taken

  // Safe to use the validated data
  await saveUser(result.data);
} else {
  // Some fields invalid
  console.log(result.failureCount); // Number of failed fields

  result.errors.forEach((error) => {
    console.error(`${error.propertyName}: ${error.message}`);
    // Output:
    // email: Must be a valid email
    // password: Must be at least 8 characters
  });
}
```

### Error Details

```typescript
result.errors.forEach((error) => {
  console.log({
    field: error.propertyName, // 'email'
    message: error.message, // 'Must be valid email'
    value: error.value, // 'invalid-email'
    ruleName: error.ruleName, // 'Email'
    fieldName: error.fieldName, // 'email_input'
  });
});
```

---

## All Available Rules

### String Rules

#### Required

```typescript
// Rejects: null, undefined, ""
// Accepts: "text", 0, false, [], {}

@IsRequired
email: string;
```

#### Email

```typescript
@IsEmail
email: string;

// Accepts: valid@email.com, user+tag@domain.co.uk
// Rejects: invalid, @, user@
```

#### MinLength

```typescript
@IsMinLength([5])
username: string;

// Rejects strings with < 5 characters
```

#### MaxLength

```typescript
@IsMaxLength([50])
bio: string;

// Rejects strings with > 50 characters
```

#### Length (Exact or Range)

```typescript
@HasLength([5])        // Exactly 5
name: string;

@HasLength([3, 10])    // Between 3-10
code: string;
```

#### Url

```typescript
@IsUrl
website: string;

// Accepts: http://example.com, https://example.com/path
// Rejects: not-a-url, example.com (without protocol)
```

#### NonNullString

```typescript
@IsNonNullString
value: string;

// Accepts: "text"
// Rejects: "", null, undefined, non-strings
```

#### FileName

```typescript
@IsFileName
filename: string;

// Validates: no forbidden characters (\ / : * ? " < > |)
// Cannot start with dot or be reserved (CON, PRN, LPT0, etc.)
```

#### StartsWithOneOf

```typescript
@StartsWith(['Mr.', 'Mrs.', 'Ms.'])
title: string;

// Accepts: "Mr. Smith", "Mrs. Johnson"
// Rejects: "Smith", "Mr Smith"
```

#### EndsWithOneOf

```typescript
@EndsWith(['.jpg', '.png', '.gif'])
imageFile: string;

// Accepts: "photo.jpg", "image.png"
// Rejects: "photo.txt", "photo"
```

### Numeric Rules

#### Number

```typescript
@IsNumber
age: number;

// Accepts: 25, -10, 3.14, 0
// Rejects: "25", NaN, undefined
```

#### NumberGreaterThan

```typescript
@IsNumberGreaterThan([0])
count: number;

// Accepts: 1, 100, 999.99
// Rejects: 0, -1
```

#### NumberGreaterThanOrEquals

```typescript
@IsNumberGreaterThanOrEquals([18])
age: number;

// Accepts: 18, 25, 100
// Rejects: 17, -1
```

#### NumberLessThan

```typescript
@IsNumberLessThan([100])
percentage: number;

// Accepts: 0, 50, 99.99
// Rejects: 100, 101
```

#### NumberLessThanOrEquals

```typescript
@IsNumberLessThanOrEquals([100])
percentage: number;

// Accepts: 0, 50, 100
// Rejects: 101, 102
```

#### NumberEquals

```typescript
@IsNumberEquals([42])
value: number;

// Only accepts: 42
// Rejects: 41, 43, "42"
```

#### NumberIsDifferentFrom

```typescript
@IsNumberNotEqual([0])
value: number;

// Rejects: 0
// Accepts: 1, -1, 0.1
```

### Boolean Rules

#### Boolean

```typescript
@IsBoolean
active: boolean;

// Accepts: true, false
// Rejects: 1, 0, "true", null
```

### Enum Rules

#### Enum

```typescript
@IsEnum(['active', 'inactive', 'pending'])
status: string;

// Only accepts values in the provided array
```

#### Equals

```typescript
@Equals(['password'])
confirmPassword: string;

// Value must equal the specified value
```

### Nullable/Optional Rules

#### Nullable

```typescript
@IsNullable
@IsEmail
emailOptional?: string;

// Skips validation if value is null or undefined
// Validates if value is provided
```

#### Empty

```typescript
@IsEmpty
@IsNumber
numbersOptional?: string;

// Skips validation if value is empty string ""
// Validates if value is provided
```

#### Sometimes

```typescript
@IsSometimes
@IsUrl
website?: string;

// Skips validation if value is undefined
// Validates if value is provided (even if empty string)
```

### Contact Rules

#### PhoneNumber

```typescript
@IsPhoneNumber
phone: string;

// Validates phone number format
// Uses international format by default
```

#### EmailOrPhoneNumber

```typescript
@IsEmailOrPhoneNumber
contact: string;

// Accepts valid email OR valid phone number
```

### Array Rules

#### Array

```typescript
@IsArray
items: any[];

// Value must be an array
```

#### ArrayMinLength

```typescript
@ArrayMinLength([3])
items: any[];

// Array must have at least 3 elements
```

#### ArrayMaxLength

```typescript
@ArrayMaxLength([10])
items: any[];

// Array must have at most 10 elements
```

#### ArrayLength

```typescript
@ArrayLength([5])
coordinates: number[];

// Array must have exactly 5 elements
```

#### ArrayContains

```typescript
@ArrayContains(['admin'])
roles: string[];

// Array must contain 'admin'
```

#### ArrayUnique

```typescript
@ArrayUnique
tags: string[];

// All array elements must be unique
```

### Date Rules

#### Date

```typescript
@IsDate
birthDate: string;

// Value must be a valid date
```

#### DateAfter

```typescript
@DateAfter(['2023-01-01'])
eventDate: string;

// Date must be after January 1, 2023
```

#### DateBefore

```typescript
@DateBefore(['2023-12-31'])
deadline: string;

// Date must be before December 31, 2023
```

#### DateBetween

```typescript
@DateBetween(['2023-01-01', '2023-12-31'])
vacationDate: string;

// Date must be between Jan 1 and Dec 31, 2023
```

#### DateEquals

```typescript
@DateEquals(['2023-06-15'])
meetingDate: string;

// Date must equal June 15, 2023
```

#### FutureDate

```typescript
@FutureDate
appointmentDate: string;

// Date must be in the future
```

#### PastDate

```typescript
@PastDate
birthDate: string;

// Date must be in the past
```

### File Rules

#### File

```typescript
@IsFile
document: File;

// Value must be a valid file object
```

#### FileSize

```typescript
@FileSize([1024000])
image: File;

// File size must be exactly 1MB
```

#### FileType

```typescript
@FileType(['image/jpeg'])
photo: File;

// File must be JPEG image
```

#### Image

```typescript
@IsImage
picture: File;

// File must be a valid image
```

#### FileExtension

```typescript
@FileExtension(['.pdf'])
document: File;

// File must have .pdf extension
```

#### MinFileSize

```typescript
@MinFileSize([100])
thumbnail: File;

// File size must be at least 100 bytes
```

### Format Rules

#### UUID

```typescript
@IsUUID
id: string;

// Value must be a valid UUID
```

#### JSON

```typescript
@IsJSON
config: string;

// Value must be valid JSON
```

#### Base64

```typescript
@IsBase64
encodedData: string;

// Value must be valid Base64
```

#### HexColor

```typescript
@IsHexColor
color: string;

// Value must be valid hex color (#FFF, #FFFFFF)
```

#### CreditCard

```typescript
@IsCreditCard
cardNumber: string;

// Value must be valid credit card number
```

#### IP

```typescript
@IsIP
address: string;

// Value must be valid IP address
```

#### MACAddress

```typescript
@IsMACAddress
mac: string;

// Value must be valid MAC address
```

#### Regex

```typescript
@Regex(['^[A-Z]+$'])
code: string;

// Value must match regex pattern
```

---

## Decorator Reference

### Property Decorators (No Parameters)

```typescript
@IsRequired              // Value must exist
@IsEmail                 // Must be valid email
@IsUrl                   // Must be valid URL
@IsPhoneNumber          // Must be valid phone
@IsEmailOrPhoneNumber   // Must be email or phone
@IsNumber               // Must be a number
@IsNonNullString        // Must be non-empty string
@IsBoolean              // Must be boolean
@IsFileName             // Must be valid filename
@IsNullable             // Allow null/undefined
@IsEmpty                // Allow empty string
@IsSometimes            // Allow undefined
@IsArray                // Must be an array
@IsDate                 // Must be valid date
@IsFile                 // Must be valid file
@IsImage                // Must be valid image
@IsUUID                 // Must be valid UUID
@IsJSON                 // Must be valid JSON
@IsBase64               // Must be valid Base64
@IsHexColor             // Must be valid hex color
@IsCreditCard           // Must be valid credit card
@IsIP                   // Must be valid IP address
@IsMACAddress           // Must be valid MAC address
@ArrayUnique            // Array elements must be unique
@FutureDate             // Date must be in future
@PastDate               // Date must be in past
```

### Rule Decorators (With Parameters)

```typescript
@IsMinLength([5])
@IsMaxLength([50])
@HasLength([3, 10])
@IsNumberGreaterThan([0])
@IsNumberGreaterThanOrEquals([18])
@IsNumberLessThan([100])
@IsNumberLessThanOrEquals([100])
@IsNumberEquals([42])
@IsNumberNotEqual([0])
@StartsWith(['Mr.', 'Mrs.'])
@EndsWith(['.jpg', '.png'])
@IsEnum(['active', 'inactive'])
@Equals(['password'])
@ArrayMinLength([3])
@ArrayMaxLength([10])
@ArrayLength([5])
@ArrayContains(['item'])
@DateAfter(['2023-01-01'])
@DateBefore(['2023-12-31'])
@DateBetween(['2023-01-01', '2023-12-31'])
@DateEquals(['2023-06-15'])
@FileSize([1024000])
@FileType(['image/jpeg'])
@FileExtension(['.jpg'])
@MinFileSize([100])
@Regex(['^[A-Z]+$'])
```

### Decorator Stacking

```typescript
class User {
  @IsRequired // Must exist
  @IsEmail // Must be email format
  @IsMaxLength([100]) // Max 100 chars
  email: string;

  @IsSometimes // Optional
  @IsUrl // If provided, must be URL
  website?: string;
}
```

---

## Error Handling Patterns

### Pattern 1: Check Success Property

```typescript
const result = await Validator.validate({...});

if (result.success) {
  // Success - work with result.value
  const validated = result.value;
  console.log(validated);
} else {
  // Failure - work with result.message
  console.error(result.message);
}
```

### Pattern 2: Exhaustive Type Guard

```typescript
const result = await Validator.validate({...});

// TypeScript ensures you handle both cases
if (result.success === true) {
  // Success case
  console.log(result.value);
} else if (result.success === false) {
  // Failure case
  console.error(result.message);
}
```

### Pattern 3: Type Guard Functions

```typescript
const result = await Validator.validate({...});

if (Validator.isSuccess(result)) {
  // TypeScript knows: result is IValidatorValidateSuccess
  console.log(result.value);
}

if (Validator.isFailure(result)) {
  // TypeScript knows: result is IValidatorValidateFailure
  console.error(result.message);
}
```

### Pattern 4: Switch Statement

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

### Pattern 5: Extract and Reuse

```typescript
const result = await Validator.validate({...});

// Extract success case
if (result.success) {
  const { value, duration, validatedAt } = result;
  console.log(`Validated in ${duration}ms at ${validatedAt}`);
  return value;
}

// Handle error case
const { message, error, failedAt } = result;
console.error(`Failed at ${failedAt}: ${message}`);
```

### Pattern 6: Multiple Fields

```typescript
const emailResult = await Validator.validate({...});
const passwordResult = await Validator.validate({...});

if (emailResult.success && passwordResult.success) {
  // Both valid
  await login(emailResult.value, passwordResult.value);
} else {
  const errors = [];
  if (!emailResult.success) errors.push(emailResult.message);
  if (!passwordResult.success) errors.push(passwordResult.message);
  console.error(errors);
}
```

### Pattern 7: Async/Await with Try/Catch

```typescript
// Even with Either pattern, async operations can throw
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

### Pattern 8: Map Results

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

---

## Advanced Patterns

### 1. Context-Aware Validation

**Define Context Interface:**

```typescript
interface ValidationContext {
  userId: number;
  userRole: "user" | "admin";
  permissions: string[];
}
```

**Register Custom Rule:**

```typescript
Validator.registerRule(
  "HasPermission",
  ({ value, context }: IValidatorValidateOptions<any, ValidationContext>) => {
    const { permissions } = context;
    return permissions.includes(value) || `Permission '${value}' not granted`;
  }
);

const HasPermission = Validator.createPropertyDecorator(["HasPermission"]);
```

**Use in Class:**

```typescript
class AdminAction {
  @IsRequired
  @HasPermission
  action: string;
}

// Usage
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

### 2. Conditional Decorators

```typescript
class OptionalField {
  @IsRequired
  email: string;

  @IsSometimes // Validate only if present
  @IsUrl
  website?: string;

  @IsNullable // Validate if not null/undefined
  @IsMinLength([10])
  bio?: string;

  @IsEmpty // Validate if not empty string
  @IsNumber
  favoriteNumber?: string;
}
```

### 3. Custom Async Rules

```typescript
// Async database check
Validator.registerRule(
  "UniqueEmail",
  async ({ value }: IValidatorValidateOptions) => {
    const exists = await User.findOne({ email: value });
    return !exists || "Email already registered";
  }
);

const IsUniqueEmail = Validator.createPropertyDecorator(["UniqueEmail"]);

// Use it
class RegistrationForm {
  @IsRequired
  @IsEmail
  @IsUniqueEmail // This will check database
  email: string;
}
```

### 4. Parameterized Custom Rules

```typescript
// Rule with parameters
const minValueRule = ({
  value,
  ruleParams,
}: IValidatorValidateOptions<[number]>) => {
  const [minValue] = ruleParams;
  return value >= minValue || `Must be at least ${minValue}`;
};

Validator.registerRule("MinValue", minValueRule);

// Create parameterized decorator
const IsMinValue = Validator.createRuleDecorator<[number]>(minValueRule);

// Use it
class PriceForm {
  @IsMinValue([9.99])
  price: number;
}
```

### 5. Error Aggregation

```typescript
const result = await Validator.validateTarget(ComplexForm, data);

if (!result.success) {
  // Group errors by field
  const groupedErrors = result.errors.reduce(
    (acc, error) => {
      const field = error.propertyName || "unknown";
      if (!acc[field]) acc[field] = [];
      acc[field].push(error.message);
      return acc;
    },
    {} as Record<string, string[]>
  );

  // Output:
  // {
  //   email: ['Must be valid email'],
  //   password: ['Must be at least 8 chars', 'Must contain number'],
  //   confirmPassword: ['Passwords do not match']
  // }

  return { success: false, errors: groupedErrors };
}
```

### 6. Performance Monitoring

```typescript
const result = await Validator.validateTarget(LargeForm, data);

if (result.success) {
  console.log(`✓ Validation completed in ${result.duration}ms`);
  console.log(`  Started: ${result.validatedAt}`);

  if (result.duration > 1000) {
    console.warn("⚠ Validation took > 1 second, consider optimizing rules");
  }
}
```

### 7. Locale-Specific Validation

```typescript
import { i18n } from "resk-core/i18n";

// Switch locale
await i18n.setLocale("fr");

const result = await Validator.validate({
  value: "invalid",
  rules: ["Email"],
  // Error message will be in French
});

// Switch back
await i18n.setLocale("en");
```

### 8. Custom Error Formatting

```typescript
const result = await Validator.validateTarget(UserForm, data, {
  errorMessageBuilder: (propertyName, error) => {
    return `❌ [${propertyName}]: ${error}`;
  },
});
```

### 9. Parallel Validation

```typescript
// All fields validated in parallel automatically
const result = await Validator.validateTarget(LargeForm, data);

// Duration is not sum of individual field times
console.log(`All fields validated in ${result.duration}ms`);
```

### 10. Selective Field Validation

```typescript
// Validate only specific fields by creating a subset class
class PartialForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @IsMinLength([8])
  password: string;
}

// Then use only this subset
const result = await Validator.validateTarget(PartialForm, data);
```

---

## FAQ & Troubleshooting

### Q: How do I check if validation succeeded?

**A:** Use the `success` property with type narrowing:

```typescript
if (result.success) {
  // Validation passed
}
```

### Q: Can I throw errors instead of using Either pattern?

**A:** The Validator returns Either patterns instead of throwing. To convert to throws:

```typescript
const result = await Validator.validate({...});

if (!result.success) {
  throw new ValidationError(result.message);
}
return result.value;
```

### Q: How do I validate async operations (database checks)?

**A:** Use async custom rules:

```typescript
await Validator.validate({
  value: username,
  rules: [
    async ({ value }) => {
      const exists = await database.users.exists(value);
      return !exists || "Username already taken";
    },
  ],
});
```

### Q: Can I reuse validation across multiple forms?

**A:** Create a base class with common fields:

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

### Q: How do I handle optional fields?

**A:** Use `@IsSometimes`, `@IsNullable`, or `@IsEmpty`:

```typescript
class Form {
  @IsRequired // Required
  email: string;

  @IsSometimes // Skip if undefined
  @IsUrl
  website?: string;

  @IsNullable // Skip if null/undefined
  @IsMinLength([10])
  bio?: string;

  @IsEmpty // Skip if empty string
  @IsNumber
  age?: number;
}
```

### Q: How do I customize error messages?

**A:** Pass `message` option:

```typescript
await Validator.validate({
  value: email,
  rules: ["Email"],
  message: "Please enter a valid email (e.g., user@company.com)",
});
```

### Q: Can I validate without decorators?

**A:** Yes, use single-value validation:

```typescript
await Validator.validate({
  value: email,
  rules: ["Required", "Email", "MaxLength[100]"],
});
```

### Q: How do I create a custom decorator?

**A:** Register a rule and create a decorator:

```typescript
// 1. Define rule
const customRule = ({ value }) => value.length > 5 || "Too short";

// 2. Register rule
Validator.registerRule("CustomRule", customRule);

// 3. Create decorator
const IsCustom = Validator.createPropertyDecorator(["CustomRule"]);

// 4. Use decorator
class MyClass {
  @IsCustom
  field: string;
}
```

### Q: What's the difference between rules, rule, and ruleParams?

**A:**

- `rules` - Array of rules to apply in sequence
- `rule` - Single rule to apply (alternative to `rules`)
- `ruleParams` - Parameters for the current rule (extracted from rule name)

### Q: How do I see validation performance metrics?

**A:** Check the `duration` and timestamps:

```typescript
const result = await Validator.validate({...});

if (result.success) {
  console.log(`Duration: ${result.duration}ms`);
  console.log(`Validated at: ${result.validatedAt.toISOString()}`);
}
```

### Q: Can I run validation multiple times?

**A:** Yes, validation results are never cached:

```typescript
const result1 = await Validator.validate({...});
const result2 = await Validator.validate({...}); // Fresh validation
```

### Q: How do I handle form submission with validation?

**A:** Validate then save:

```typescript
async function handleSubmit(formData) {
  const result = await Validator.validateTarget(MyForm, formData);

  if (!result.success) {
    return { errors: result.errors }; // Return errors to UI
  }

  // All valid, save data
  await saveToDatabase(result.data);
  return { success: true };
}
```

---

## Performance Considerations

### Parallel Field Validation

- All fields are validated concurrently in `validateTarget`
- Duration is NOT the sum of individual field times
- More efficient than sequential validation

### Async Rules

- Use async rules sparingly (database/API calls)
- Consider caching results if checking same values
- Each async rule runs in parallel with others

### Rule Optimization

- Simple sync rules run faster than complex custom rules
- Combine simple rules rather than creating complex ones
- Order rules by likelihood of failure (fast failing first)

---

## Type Safety Examples

```typescript
// ✅ Correct - Full type safety
const result = await Validator.validate({...});

if (result.success) {
  const value: string = result.value;        // ✅ Safe
  // result.message;                         // ❌ Property doesn't exist
}

// ✅ Correct - With type parameter
interface MyContext {
  userId: number;
}

const result = await Validator.validate<string, MyContext>({
  value: 'test',
  context: { userId: 1 }
});

// ✅ Correct - Generic type narrowing
const result = await Validator.validateTarget<MyClass, MyContext>(
  MyClass,
  data,
  { context: { userId: 1 } }
);

if (result.success) {
  const instance: MyClass = result.data;     // ✅ Properly typed
}
```

---

This reference provides comprehensive coverage of all Validator features and patterns. For additional help, check the main README_COMPREHENSIVE.md or the test files in `/tests/`.
