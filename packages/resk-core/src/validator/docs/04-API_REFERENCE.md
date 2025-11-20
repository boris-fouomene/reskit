# API Reference

Complete reference documentation for the Validator class and related types.

## Table of Contents

1. [Validator Static Methods](#validator-static-methods)
2. [Decorator Methods](#decorator-methods)
3. [Rule Registration](#rule-registration)
4. [Type Definitions](#type-definitions)
5. [Result Types](#result-types)

---

## Validator Static Methods

### validate()

Validates a single value against one or more validation rules.

**Signature:**

```typescript
static validate<Context = unknown>(
  options: IValidatorValidateOptions<any, Context>
): Promise<IValidatorValidateResult<Context>>
```

**Parameters:**

- `options.value` - The value to validate
- `options.rules` - Array of validation rules to apply
- `options.context` - Optional validation context
- `options.data` - Optional contextual data
- `options.fieldName` - Optional field identifier
- `options.propertyName` - Optional property name
- `options.message` - Optional custom error message

**Returns:** Promise resolving to either success or failure result

**Example:**

```typescript
const result = await Validator.validate({
  value: "user@example.com",
  rules: ["Required", "Email"],
  fieldName: "email_input",
  propertyName: "email",
});

if (result.success) {
  console.log("Valid:", result.value);
} else {
  console.error("Invalid:", result.error.message);
}
```

---

### validateTarget()

Validates all decorated properties of a class instance.

**Signature:**

```typescript
static validateTarget<
  Target extends IClassConstructor = IClassConstructor,
  Context = unknown
>(
  target: Target,
  options: IValidatorValidateTargetOptions<Target, Context>
): Promise<IValidatorValidateTargetResult<Target, Context>>
```

**Parameters:**

- `target` - The class constructor to validate against
- `options.data` - The data object to validate
- `options.context` - Optional validation context
- `options.errorMessageBuilder` - Optional custom error formatter

**Returns:** Promise resolving to either success or failure result with all errors

**Example:**

```typescript
class UserForm {
  @IsRequired
  @IsEmail
  email: string;

  @IsRequired
  @MinLength([3])
  name: string;
}

const result = await Validator.validateTarget(UserForm, {
  data: {
    email: "user@example.com",
    name: "John",
  },
});

if (result.success) {
  console.log("All fields valid:", result.data);
} else {
  console.error("Field errors:", result.errors);
}
```

---

### isSuccess()

Type guard to check if a validation result is successful.

**Signature:**

```typescript
static isSuccess<Context = unknown>(
  result: IValidatorValidateResult<Context>
): result is IValidatorValidateSuccess<Context>
```

**Parameters:**

- `result` - The validation result to check

**Returns:** true if result is success, false otherwise

**Example:**

```typescript
const result = await Validator.validate({ value: "test", rules: ["Required"] });

if (Validator.isSuccess(result)) {
  // result is IValidatorValidateSuccess
  console.log("Value:", result.value);
  console.log("Validated at:", result.validatedAt);
} else {
  // result is IValidatorValidateFailure
  console.log("Error:", result.error.message);
}
```

---

### isFailure()

Type guard to check if a validation result is a failure.

**Signature:**

```typescript
static isFailure<Context = unknown>(
  result: any
): result is IValidatorValidateFailure<Context>
```

**Parameters:**

- `result` - The validation result to check

**Returns:** true if result is failure, false otherwise

**Example:**

```typescript
const result = await Validator.validate({ value: "", rules: ["Required"] });

if (Validator.isFailure(result)) {
  // result is IValidatorValidateFailure
  console.log("Failed rule:", result.error.ruleName);
  console.log("Error message:", result.error.message);
}
```

---

### registerRule()

Registers a custom validation rule.

**Signature:**

```typescript
static registerRule(
  ruleName: string,
  ruleFunction: IValidatorRuleFunction
): void
```

**Parameters:**

- `ruleName` - The name to register the rule under
- `ruleFunction` - The validation function

**Example:**

```typescript
Validator.registerRule("IsEven", ({ value }) => {
  return value % 2 === 0 || "Must be an even number";
});

// Now use the rule
const result = await Validator.validate({
  value: 4,
  rules: ["IsEven"],
});
```

---

### getRules()

Gets all registered validation rules.

**Signature:**

```typescript
static getRules(): IValidatorRegisteredRules
```

**Returns:** Object containing all registered rules

**Example:**

```typescript
const rules = Validator.getRules();
console.log(Object.keys(rules)); // ['Required', 'Email', 'IsEven', ...]
```

---

### getRule()

Gets a specific registered validation rule by name.

**Signature:**

```typescript
static getRule(
  ruleName: string
): IValidatorRuleFunction | undefined
```

**Parameters:**

- `ruleName` - The name of the rule to retrieve

**Returns:** The rule function, or undefined if not found

**Example:**

```typescript
const emailRule = Validator.getRule("Email");
if (emailRule) {
  const result = await emailRule({
    value: "test@example.com",
    i18n: defaultI18n,
  });
}
```

---

## Decorator Methods

### buildPropertyDecorator()

Creates a decorator for applying one or more rules to a class property.

**Signature:**

```typescript
static buildPropertyDecorator(
  rules: IValidatorRuleName[]
): PropertyDecorator
```

**Parameters:**

- `rules` - Array of rule names to apply

**Returns:** A property decorator function

**Example:**

```typescript
// Built-in decorators are created this way
const IsEmail = Validator.buildPropertyDecorator(["Email"]);
const IsRequired = Validator.buildPropertyDecorator(["Required"]);

// Use in class
class User {
  @IsRequired
  @IsEmail
  email: string;
}
```

---

### buildRuleDecorator()

Creates a decorator from a custom validation function.

**Signature:**

```typescript
static buildRuleDecorator<ParamType extends Array<any> = any[]>(
  ruleFunction: IValidatorRuleFunction<ParamType>
): (params?: ParamType) => PropertyDecorator
```

**Parameters:**

- `ruleFunction` - The validation function

**Returns:** A decorator factory that accepts optional parameters

**Example:**

```typescript
const MyCustomRule = Validator.buildRuleDecorator<[maxItems: number]>(
  ({ value, ruleParams }) => {
    const maxItems = ruleParams?.[0] || 10;
    return value.length <= maxItems || `Maximum ${maxItems} items allowed`;
  }
);

class MyClass {
  @MyCustomRule([5])
  items: any[];
}
```

---

### buildRuleDecoratorOptional()

Creates a decorator for optional rule parameters.

**Signature:**

```typescript
static buildRuleDecoratorOptional<ParamType extends Array<any> = any[]>(
  ruleFunction: IValidatorRuleFunction<ParamType>
): (params?: ParamType) => PropertyDecorator
```

**Parameters:**

- `ruleFunction` - The validation function

**Returns:** A decorator factory with optional parameters

**Example:**

```typescript
const PhoneNumber =
  Validator.buildRuleDecoratorOptional<[countryCode?: string]>(
    phoneNumberValidator
  );

class Contact {
  @PhoneNumber() // No country specified
  general: string;

  @PhoneNumber(["US"]) // US phones only
  usPhone: string;
}
```

---

### buildMultiRuleDecorator()

Creates a decorator for multi-rule validators (OneOf, AllOf, ArrayOf).

**Signature:**

```typescript
static buildMultiRuleDecorator(
  ruleFunction: IValidatorMultiRuleFunction
): (rules: IValidatorRules) => PropertyDecorator
```

**Parameters:**

- `ruleFunction` - The multi-rule validation function

**Returns:** A decorator factory that accepts an array of rules

**Example:**

```typescript
// Built-in multi-rule decorators
const OneOf = Validator.buildMultiRuleDecorator((options) => {
  // OneOf validation logic
});

const AllOf = Validator.buildMultiRuleDecorator((options) => {
  // AllOf validation logic
});

// Use in class
class MyForm {
  @OneOf(["Email", "PhoneNumber"])
  contact: string;

  @AllOf(["MinLength[8]", "StrongPassword"])
  password: string;
}
```

---

### buildTargetRuleDecorator()

Creates a decorator for nested class validation (ValidateNested).

**Signature:**

```typescript
static buildTargetRuleDecorator(
  ruleFunction: (options: IValidatorTargetRuleFunctionOptions) =>
    Promise<boolean | string>
): (target: [IClassConstructor]) => PropertyDecorator
```

**Parameters:**

- `ruleFunction` - The nested validation function

**Returns:** A decorator factory that accepts a target class

**Example:**

```typescript
// ValidateNested uses this
class Address {
  @IsRequired
  street: string;
}

class User {
  @IsRequired
  name: string;

  @ValidateNested([Address])
  address: Address;
}
```

---

## Rule Registration

### Basic Rule Registration

```typescript
Validator.registerRule("PositiveNumber", ({ value }) => {
  if (typeof value !== "number") return false;
  return value > 0 || "Must be positive";
});

// Usage
const result = await Validator.validate({
  value: 5,
  rules: ["PositiveNumber"],
});
```

### Rule with Parameters

```typescript
Validator.registerRule("DivisibleBy", ({ value, ruleParams }) => {
  const divisor = ruleParams?.[0] || 1;
  if (typeof value !== "number") return false;
  return value % divisor === 0 || `Must be divisible by ${divisor}`;
});

// Usage
const result = await Validator.validate({
  value: 10,
  rules: ["DivisibleBy[5]"],
});
```

### Async Rule Registration

```typescript
Validator.registerRule("UniqueEmail", async ({ value }) => {
  const exists = await checkEmailExists(value);
  return !exists || "Email already registered";
});

// Usage - remember to await
const result = await Validator.validate({
  value: "new@example.com",
  rules: ["Email", "UniqueEmail"],
});
```

### Context-Aware Rule

```typescript
interface ValidationContext {
  userId: number;
}

Validator.registerRule("NotSelfReference", ({ value, context }) => {
  const ctx = context as ValidationContext;
  return value !== ctx?.userId || "Cannot reference yourself";
});

// Usage
const result = await Validator.validate({
  value: 123,
  rules: ["NotSelfReference"],
  context: { userId: 456 },
});
```

---

## Type Definitions

### IValidatorRules

Array of validation rules.

```typescript
type IValidatorRules<Context = unknown> = Array<
  IValidatorRule<Array<any>, Context>
>;

// Usage
const rules: IValidatorRules = [
  "Required",
  "Email",
  ({ value }) => value.length > 5,
];
```

### IValidatorRule

Single validation rule (union of different formats).

```typescript
type IValidatorRule<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> =
  | IValidatorRuleFunction<ParamType, Context> // Function rule
  | IValidatorRuleName // Named rule
  | IValidatorRuleObject<Context>; // Object rule

// Examples
const rules: IValidatorRule[] = [
  "Required", // Named
  "MinLength[5]", // Parameterized
  { MinLength: [5] }, // Object
  ({ value }) => value.length > 0, // Function
];
```

### IValidatorRuleFunction

Function that performs validation.

```typescript
type IValidatorRuleFunction<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> = (
  options: IValidatorValidateOptions<ParamType, Context>
) => IValidatorResult;

// Example
const MyRule: IValidatorRuleFunction = ({ value, i18n }) => {
  if (!value) {
    return i18n.t("validator.required", { fieldName: "field" });
  }
  return true;
};
```

### IValidatorResult

Result of a single validation rule.

```typescript
type IValidatorResult = boolean | string | Promise<boolean | string>;

// true  - validation passed
// false - validation failed with generic message
// string - validation failed with custom message
// Promise - async validation
```

### IValidatorRuleName

Name of a built-in validation rule.

```typescript
type IValidatorRuleName = keyof IValidatorRulesMap & string;

// Examples: 'Required', 'Email', 'MinLength', 'Pattern', etc.
```

---

## Result Types

### IValidatorValidateSuccess

Successful validation result for single value.

```typescript
interface IValidatorValidateSuccess<Context = unknown> {
  success: true;
  value: any; // The validated value
  validatedAt?: Date; // When validation completed
  duration?: number; // Milliseconds elapsed
  data?: Record<string, any>; // Optional context data
  context?: Context; // Optional validation context
}

// Example
const result: IValidatorValidateSuccess = {
  success: true,
  value: "user@example.com",
  validatedAt: new Date(),
  duration: 5,
};
```

---

### IValidatorValidateFailure

Failed validation result for single value.

```typescript
interface IValidatorValidateFailure<Context = unknown> {
  success: false;
  error: IValidatorValidationError; // Error details
  failedAt?: Date; // When validation failed
  duration?: number; // Milliseconds elapsed
  value: any; // The value that failed
  data?: Record<string, any>; // Optional context data
  context?: Context; // Optional validation context
}

// Example
const result: IValidatorValidateFailure = {
  success: false,
  error: {
    name: "ValidatorValidationError",
    status: "error",
    message: "Invalid email format",
    ruleName: "Email",
    value: "invalid@",
  },
  failedAt: new Date(),
  duration: 2,
};
```

---

### IValidatorValidateTargetSuccess

Successful class validation result.

```typescript
interface IValidatorValidateTargetSuccess<Target, Context = unknown> {
  success: true;
  data: Partial<InstanceType<Target>>; // Validated data
  validatedAt?: Date; // When validation completed
  duration?: number; // Milliseconds elapsed
  context?: Context; // Optional validation context
}

// Example
const result: IValidatorValidateTargetSuccess<typeof UserForm> = {
  success: true,
  data: {
    email: "user@example.com",
    name: "John",
    age: 30,
  },
  validatedAt: new Date(),
  duration: 12,
};
```

---

### IValidatorValidateTargetFailure

Failed class validation result.

```typescript
interface IValidatorValidateTargetFailure<Context = unknown> {
  success: false;
  errors: IValidatorValidationError[]; // All field errors
  failureCount: number; // Number of failed fields
  message: string; // Summary message
  status: "error"; // Status indicator
  failedAt?: Date; // When validation failed
  duration?: number; // Milliseconds elapsed
  context?: Context; // Optional validation context
}

// Example
const result: IValidatorValidateTargetFailure = {
  success: false,
  errors: [
    {
      name: "ValidatorValidationError",
      status: "error",
      propertyName: "email",
      message: "Invalid email format",
      ruleName: "Email",
      value: "invalid@",
    },
    {
      name: "ValidatorValidationError",
      status: "error",
      propertyName: "age",
      message: "Must be a number",
      ruleName: "Number",
      value: "thirty",
    },
  ],
  failureCount: 2,
  message: "Validation failed for 2 fields",
  failedAt: new Date(),
  duration: 8,
};
```

---

### IValidatorValidationError

Details about a validation error.

```typescript
interface IValidatorValidationError {
  status: "error";
  name: "ValidatorValidationError";
  fieldName?: string; // Form field identifier
  propertyName?: string; // Class property name
  message: string; // Error message
  translatedPropertyName?: string; // Localized property name
  ruleName?: IValidatorRuleName; // Failing rule name
  ruleParams: any[]; // Rule parameters
  value: any; // Failed value
  rawRuleName?: string; // Original rule spec
  code?: string; // Error code
  severity?: "error" | "warning" | "info";
  timestamp?: Date; // When error occurred
  metadata?: Record<string, any>; // Additional data
}

// Example
const error: IValidatorValidationError = {
  status: "error",
  name: "ValidatorValidationError",
  propertyName: "email",
  translatedPropertyName: "Email Address",
  message: "Email Address must be a valid email format",
  ruleName: "Email",
  ruleParams: [],
  value: "invalid@",
  rawRuleName: "Email",
  timestamp: new Date(),
};
```

---

### IValidatorValidateOptions

Options for single value validation.

```typescript
interface IValidatorValidateOptions<
  ParamType extends Array<any> = Array<any>,
  Context = unknown,
> {
  value: any; // Value to validate (required)
  rules?: IValidatorRules<Context>; // Validation rules
  rule?: IValidatorRule<ParamType, Context>; // Single rule override
  ruleParams?: ParamType; // Parameters for rule
  ruleName?: IValidatorRuleName; // Current rule name
  rawRuleName?: string; // Original rule spec
  message?: string; // Custom error message
  fieldName?: string; // Form field identifier
  propertyName?: string; // Property name
  translatedPropertyName?: string; // Localized property name
  data?: Record<string, any>; // Context data
  context?: Context; // Validation context
  i18n: I18n; // i18n instance
}
```

---

### IValidatorValidateTargetOptions

Options for class validation.

```typescript
interface IValidatorValidateTargetOptions<
  Target extends IClassConstructor = IClassConstructor,
  Context = unknown,
  ParamsTypes extends Array<any> = Array<any>,
> {
  data: Partial<Record<keyof InstanceType<Target>, any>>; // Data to validate
  context?: Context; // Validation context
  i18n?: I18n; // i18n instance
  errorMessageBuilder?: (
    // Custom error formatter
    translatedPropertyName: string,
    error: string,
    options: IValidatorValidationError & {
      propertyName: string;
      translatedPropertyName: string;
    }
  ) => string;
  startTime?: number; // Validation start time
}
```

---

For more information and examples, see the complete documentation in the [docs](.) folder.
