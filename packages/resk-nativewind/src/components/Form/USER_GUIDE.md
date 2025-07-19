# FormField Module User Guide

This guide provides a comprehensive overview of the `FormField` module, including its features, classes, interfaces, methods, and properties. It is designed to help developers understand, use, and extend the module effectively in React Native applications.

---

## Overview

The `FormField` class is a generic, extensible component for building form fields with validation, state management, and event handling. It supports custom field types, advanced validation logic, and seamless integration with form context.

---

## Features

- **Generic Field Support**: Easily create fields for text, email, phone, number, and custom types.
- **Validation**: Built-in and custom validation rules, including required, min/max length, email, phone, and URL.
- **State Management**: Tracks value, error, validation status, editability, and disabled state.
- **Event Handling**: Supports change, blur, keyboard, and custom events.
- **Integration**: Works with form context and field manager for advanced form logic.
- **Extensibility**: Override methods for custom business logic and UI.

---

## Main Class: `FormField`

### Constructor
```typescript
constructor(props: IField<FieldType, ValueType>)
```
Initializes the field with default value and triggers initial validation.

### Key Properties
- `_fieldRef`: Reference to the field component (for direct manipulation).
- `state`: Contains error, value, validation status, editability, and disabled state.

### Core Methods

#### `compareValues(a: any, b: any): boolean`
Compares two values for equality (deep and empty checks).

**Example:**
```typescript
this.compareValues(5, 5); // true
this.compareValues(undefined, null); // true
```

#### `hasValidated(): boolean`
Returns true if the field has been validated.

#### `canDisplayError(): boolean`
Determines if the error message should be shown (after validation and failed submission).

#### `setFieldValue(value: any): Promise<IFormFieldValidatorOptions>`
Sets the field value and triggers validation.

**Example:**
```typescript
await this.setFieldValue("new value");
```

#### `getFieldInstance(fieldName: string): FormField | null`
Retrieves the instance of a specific field in the current form.

**Example:**
```typescript
const emailField = form.getFieldInstance("email");
emailField?.focus();
```

#### `isEmail(): boolean`
Checks if the field type is "email".

#### `isPhone(): boolean`
Checks if the field type is "phone" or "tel".

#### `validate(options, force?): Promise<IFormFieldValidatorOptions>`
Validates the field value according to its rules and updates state.

**Example:**
```typescript
await field.validate({ value: "user@example.com" });
```

#### `shouldValidateOnBlur(): boolean`
Returns true if validation should occur on blur.

#### `shouldValidateOnMount(): boolean`
Returns true if validation should occur on mount.

#### `getValidationRules(): IValidatorRule[]`
Returns the array of validation rules for the field.

#### `getType(): FieldType | IFieldType`
Returns the type of the field (e.g., "text", "email").

#### `sanitizeValue(value: any): any`
Sanitizes the input value based on field type (number, phone, etc).

**Example:**
```typescript
this.sanitizeValue("42.5"); // 42.5
this.sanitizeValue("(555) 123-4567"); // "5551234567"
```

#### `beforeValidate(options): IFormFieldValidatorOptions`
Hook called before validation for custom logic.

#### `callOnChange(options): void`
Triggers the `onChange` event if the value has changed.

#### `onValid(options): boolean`
Called when the field is validated. Returns true or throws error.

#### `onInvalid(options): boolean`
Called when the field is not validated. Returns false.

#### `getLabel(): string`
Returns the label for the field.

#### `onRegister(): void`
Called when the field is registered by its form.

#### `onUnregister(): void`
Called when the field is unregistered from its form.

#### `isValid(): boolean`
Returns true if the field is valid.

#### `getName(): string`
Returns the name of the field.

#### `getValidValue(formData): any`
Returns the valid value of the field based on form data.

#### `getValue(): any`
Returns the current value of the field.

#### `isRaw(): boolean`
Returns true if the field is a raw input type.

#### `getErrorText(): string`
Returns the error message for the field.

#### `isFilter(): boolean`
Returns true if the field is a filter.

#### `isEditable(): boolean`
Returns true if the field is editable.

#### `isDisabled(): boolean`
Returns true if the field is disabled.

#### `disable(): void`
Disables the field.

#### `enable(): void`
Enables the field.

#### `isTextField(): boolean`
Returns true if the field is a text field.

#### `validateOnChange(options): Promise<IFormFieldValidatorOptions>`
Validates the field on change.

#### `canValueBeDecimal(): boolean`
Returns true if the field can accept decimal values.

#### `setRef(el: any): void`
Sets a reference to the field component.

#### `getKeyboardEvents(options?): string[]`
Returns the list of keyboard events handled by the field.

#### `getForm(): IFormContext | null`
Returns the form context for the field.

#### `canValidate(): boolean`
Returns true if the field can be validated.

#### `focus(): void`
Focuses the field.

#### `focusNextField(): void`
Focuses the next field in the form.

#### `getFormName(): string`
Returns the name of the form associated with the field.

#### `focusPrevField(): void`
Focuses the previous field in the form.

#### `onKeyEvent(key, event): void`
Handles keyboard events for the field.

#### `componentDidMount(): void`
Lifecycle method called when the component mounts.

#### `componentWillUnmount(): void`
Lifecycle method called when the component unmounts.

#### `isFormLoading(): boolean`
Returns true if the form is loading.

#### `isFormSubmitting(): boolean`
Returns true if the form is submitting.

#### `renderSkeleton(): ReactNode`
Renders a skeleton/loading state for the field.

#### `overrideProps(props): IField`
Allows overriding field props before rendering.

#### `render(): ReactNode`
Renders the field component.

---

## Static Methods

#### `registerComponent(type, component): void`
Registers a field component for a given type.

#### `getRegisteredComponents(): Record<IFieldType, typeof FormField>`
Returns all registered field components.

#### `getRegisteredComponent(type): FormField | null`
Returns the registered field component for a given type.

---

## Usage Example

```tsx
import { FormField } from './Form/base';

// Create a custom text field
class MyTextField extends FormField<'text', string> {
  // Custom logic here
}

// Use in a form
<MyTextField
  name="username"
  label="Username"
  required
  defaultValue=""
  validateOnBlur
  validationRules={["Required", "minLength[3]"]}
  onChange={({ value }) => console.log('Changed:', value)}
/>
```

---

## Notes & Best Practices

- Always provide a `name` and `label` for each field.
- Use `validationRules` to enforce business logic.
- Use `onChange`, `onFieldValid`, and `onFieldInvalid` for custom event handling.
- Extend `FormField` for custom field types and override methods for advanced behavior.
- Use `getFieldInstance` and form context for advanced form workflows.

---

## Interfaces & Types

- `IField<FieldType, ValueType>`: Props for a field.
- `IFormFieldState<FieldType, ValueType>`: State for a field.
- `IFormFieldValidatorOptions<FieldType, ValueType>`: Options for validation.
- `IFormFieldOnChangeOptions<FieldType, ValueType>`: Options for change events.
- `IValidatorRule`: Validation rule type.
- `IFormContext<Fields>`: Form context type.

---

## Extending the Module

To create custom fields, extend `FormField` and override methods such as `validate`, `sanitizeValue`, `onValid`, or `render`.

**Example:**
```typescript
class CustomPhoneField extends FormField<'phone', string> {
  sanitizeValue(value: any) {
    // Custom phone formatting
    return value.replace(/[^\d]/g, '');
  }
}
```

---

## License

This module is part of the Reskit project. See LICENSE for details.

---

## Support

For questions or support, see the project documentation or contact the maintainers.
