# Complete Form Module User Guide

This guide covers the full form module, including the `FormField` class, `FormAction`, `AttachFormField` decorator, and related features. It is designed to help developers understand, use, and extend the module for robust form management in React Native applications.

---

## Overview

The form module provides a flexible, extensible system for building forms with advanced validation, state management, and event handling. Key components include:
- `FormField`: The core field class for managing individual form fields.
- `FormAction`: Utilities and types for form actions (submit, reset, validate, etc).
- `AttachFormField` decorator: Decorator for registering custom field components.
- Form context and field manager utilities.

---

## Main Components

### 1. FormField
See the [USER_GUIDE.md](./USER_GUIDE.md) for a detailed breakdown of `FormField` features, methods, and usage.

### 2. FormAction

`FormAction` provides types and utilities for common form actions:
- **Submit**: Triggers form submission and validation.
- **Reset**: Resets all fields to their default values.
- **Validate**: Validates all fields in the form.
- **Custom Actions**: Extendable for custom business logic.

**Example:**
```typescript
import { FormAction } from './Form/actions';

// Usage in a form
<FormAction.Submit onSubmit={handleSubmit} />
<FormAction.Reset onReset={handleReset} />
<FormAction.Validate onValidate={handleValidate} />
```

**Best Practices:**
- Use `FormAction` components to trigger form-wide events.
- Extend or customize actions for advanced workflows.

### 3. AttachFormField Decorator

The `AttachFormField` decorator registers a custom field component for a specific type, enabling automatic field rendering and management.

**Usage:**
```typescript
import { AttachFormField } from './Form/decorators';

@AttachFormField('customType')
class CustomField extends FormField<'customType', string> {
  // Custom logic here
}
```

**How It Works:**
- Associates the field type with the component.
- Enables dynamic field rendering based on type.
- Supports extensibility for new field types.

**Best Practices:**
- Use the decorator for all custom field components.
- Ensure unique field type names.

---

## Form Context & Field Manager

- **Form Context**: Provides access to form state, data, and field instances.
- **Field Manager**: Handles registration, lookup, and lifecycle of fields.

**Example:**
```typescript
const formContext = useFormContext();
const fieldInstance = formContext.getFieldInstance('email');
```

---

## Advanced Features

- **Validation**: Custom and built-in rules, async validation, error handling.
- **Keyboard Events**: Handle enter, tab, arrow keys for navigation and actions.
- **Dynamic Fields**: Add/remove fields at runtime, support for conditional rendering.
- **Event Hooks**: `onChange`, `onValid`, `onInvalid`, `onMount`, `onUnmount` for custom logic.
- **Extensibility**: Override methods, use decorators, and register new field types.

---

## Usage Example

```tsx
import { FormField, FormAction, AttachFormField } from './Form';

@AttachFormField('phone')
class PhoneField extends FormField<'phone', string> {
  sanitizeValue(value: any) {
    return value.replace(/[^\d]/g, '');
  }
}

function MyForm() {
  return (
    <Form>
      <PhoneField name="userPhone" label="Phone" required />
      <FormAction.Submit onSubmit={data => console.log('Submitted:', data)} />
      <FormAction.Reset />
    </Form>
  );
}
```

---

## Best Practices

- Use decorators for all custom field components.
- Centralize validation logic in field classes.
- Use form context for advanced workflows.
- Register new field types for custom UI/logic.
- Use FormAction for clear, maintainable form actions.

---

## Extending the Module

- **Custom Fields**: Extend `FormField`, override methods, and use `AttachFormField`.
- **Custom Actions**: Extend `FormAction` for new behaviors.
- **Dynamic Forms**: Use context and manager utilities for runtime field management.

---

## Support & Documentation

- See [USER_GUIDE.md](./USER_GUIDE.md) for detailed API reference.
- Review source code for advanced extension points.
- Contact maintainers for support or questions.

---

## License

This module is part of the Reskit project. See LICENSE for details.
