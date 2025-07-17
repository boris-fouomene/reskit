# Validator Module User Guide

Welcome to the **Validator Module**! This guide will help you get started with powerful, customizable validation for TypeScript/JavaScript applications. The module supports both function-based and decorator-based validation, internationalization, and easy extensibility for custom rules.

---

## 🚀 Features
- **Type-Safe Validation**: Full TypeScript support
- **Decorator Support**: Validate class properties with decorators
- **Async Validation**: Support for asynchronous rules
- **Internationalization (i18n)**: Localized error messages
- **Extensible**: Register custom rules and decorators
- **Rule Composition**: Combine multiple rules for complex validation

---

## 📦 Installation
```bash
npm install resk-core
```

---

## 🏁 Quick Start
### Validate a Single Value
```typescript
import { Validator } from 'resk-core';

const result = await Validator.validate({
  value: 'user@example.com',
  rules: ['Required', 'Email']
});
```

### Validate with Decorators
```typescript
import { IsRequired, IsEmail, Validator } from 'resk-core';

class User {
  @IsRequired
  @IsEmail
  email: string;
}

const userData = { email: 'user@example.com' };
const validated = await Validator.validateTarget(User, userData);
```

---

## 🛠️ Customization & Extensibility
### 1. Register a Custom Validation Rule (Function-Based)
You can register your own validation rules for any use case.

```typescript
Validator.registerRule('StartsWithA', ({ value }) => {
  return value.startsWith('A') || 'Value must start with "A"';
});

// Usage
await Validator.validate({
  value: 'Apple',
  rules: ['StartsWithA']
});
```

#### Async Custom Rule Example
```typescript
Validator.registerRule('UniqueUsername', async ({ value }) => {
  const exists = await checkUsernameExists(value);
  return !exists || 'Username already taken';
});
```

### 2. Create a Custom Property Decorator
You can create reusable decorators for your custom rules.

#### Step-by-Step Example
```typescript
// 1. Define your rule function
const isEven = ({ value }) => value % 2 === 0 || 'Value must be even';

// 2. Create a decorator factory
const IsEven = Validator.createPropertyDecorator(isEven);

// 3. Use the decorator in your class
class NumberModel {
  @IsEven
  value: number;
}

// 4. Validate
await Validator.validateTarget(NumberModel, { value: 4 }); // Passes
await Validator.validateTarget(NumberModel, { value: 5 }); // Fails
```

#### Parameterized Decorator Example
```typescript
const minValueRule = ({ value, ruleParams }) => {
  const [min] = ruleParams;
  return value >= min || `Value must be at least ${min}`;
};

const MinValue = Validator.createRuleDecorator(minValueRule);

class Product {
  @MinValue([10])
  price: number;
}
```

---

## 🧩 Advanced Usage
### Context-Aware Validation
Pass additional context to your rules for dynamic validation.

```typescript
Validator.registerRule('HasPermission', ({ value, context }) => {
  return context.permissions.includes(value) || 'Permission denied';
});

await Validator.validate({
  value: 'admin',
  rules: ['HasPermission'],
  context: { permissions: ['user', 'admin'] }
});
```

### Custom Error Message Builder
Customize how error messages are formatted.

```typescript
const options = {
  errorMessageBuilder: (translatedName, error) => `❌ ${translatedName}: ${error}`
};

await Validator.validateTarget(User, userData, options);
```

---

## 📚 API Reference
### Validator Methods
- `Validator.registerRule(ruleName, ruleHandler)` – Register a custom rule
- `Validator.validate(options)` – Validate a single value
- `Validator.validateTarget(Class, data, options?)` – Validate class-decorated objects
- `Validator.createRuleDecorator(ruleFunction)` – Create parameterized decorators
- `Validator.createPropertyDecorator(ruleFunction)` – Create simple decorators

### Built-in Decorators
- `@IsRequired` – Value must be present
- `@IsEmail` – Must be a valid email
- `@IsNumber` – Must be a number
- `@IsUrl` – Must be a valid URL
- `@IsFileName` – Must be a valid filename
- `@IsNonNullString` – Must be a non-empty string

---

## 📝 Best Practices
- Use PascalCase for all rule names and decorators
- Always provide clear error messages in custom rules
- Use context for advanced, dynamic validation scenarios
- Combine multiple rules for robust validation

---

## 💡 Tips
- All validation methods support async rules
- Decorators can be stacked for complex validation
- Internationalization is built-in for error messages

---

## 🔗 Resources
- [Full Documentation](https://docs.resk.dev/validation)
- [GitHub Repository](https://github.com/boris-fouomene/tic-tac-pay)

---

## 🏆 Get Started Now!
Start building robust, type-safe, and customizable validation logic for your applications with the Validator module. Happy coding!
