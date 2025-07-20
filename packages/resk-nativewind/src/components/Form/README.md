# Resk Form Component - User Guide

A comprehensive, cross-platform form management system for React Native and Web applications with TypeScript support, featuring intelligent field type inference, validation, and custom field components.

> **Documentation organized by priority level following the [Form User Guide Roadmap](./FORM_USER_GUIDE_ROADMAP.md)**

## Table of Contents

### 🔥 **High Priority - Essential for Adoption**

1. [Quick Start Guide](#1-quick-start-guide)
2. [Form Component Overview](#2-form-component-overview)
3. [Field System Fundamentals](#3-field-system-fundamentals)
4. [Form Submission & Validation](#4-form-submission--validation)
5. [Form.FieldRenderer Usage](#5-formfieldrenderer-usage)

### ⚡ **Medium Priority - Advanced Functionality**

6. [Form.Action Integration](#6-formaction-integration)
7. [Custom Field Rendering](#7-custom-field-rendering)
8. [Advanced Validation](#8-advanced-validation)
9. [Form State Management](#9-form-state-management)
10. [Keyboard Navigation & Events](#10-keyboard-navigation--events)

### 🚀 **Lower Priority - Expert & Specialized Features**

11. [Form.Manager Utilities](#11-formmanager-utilities)
12. [Custom Field Types](#12-custom-field-types)
13. [Performance Optimization](#13-performance-optimization)
14. [Fragment & Layout Support](#14-fragment--layout-support)
15. [TypeScript Integration](#15-typescript-integration)
16. [Testing Strategies](#16-testing-strategies)

---

## 🔥 **High Priority - Essential for Adoption**

---

## 1. Quick Start Guide

> **Target**: New users getting started
> **Content**: Basic form setup, field definitions, simple submission

### Installation

```tsx
// Core Form component
import { Form } from '@resk/nativewind/components/Form';
```

#### Available Field Types

**Built-in types**:

- `text`, 
- `email`, 
- `password`, 
- `number`, 
- `tel`, 
- `url`
- `date`, `datetime`, `time`
- `checkbox` - Checkbox input with label
- `switch` - Toggle switch control
- `select` - Dropdown selection
- `selectCountry` - Country picker with flags

### Form Architecture Overview

The Resk Form system consists of:

- **Form Component**: Container that manages form state and context
- **Field Definitions Object**: Defines all form fields and their properties
- **Automatic Field Rendering**: When `fields` prop is provided, Form automatically renders all fields
- **Form.FieldRenderer**: Used only for custom layouts with `renderFields` or `renderField` props
- **Form.Action**: Smart buttons that integrate with form state
- **useForm()**: Context hook to access form state from any child component

**Key Point**:

- When you pass `fields` prop, the Form automatically renders ALL those fields
- Use `Form.FieldRenderer` only for additional fields NOT included in the `fields` prop
- For complete layout control, use `renderFields` prop

### Basic Examples

#### Simple Login Form

```tsx
import React from 'react';
import { Form } from '@resk/nativewind/components/Form';

export default function LoginForm() {
  // Define all form fields in a single object
  const fields = {
    username: { 
      type: 'text', 
      name: 'username', 
      required: true, 
      placeholder: 'Username' 
    },
    password: { 
      type: 'password', 
      name: 'password', 
      required: true, 
      placeholder: 'Password' 
    }
  } as const;

  const handleSubmit = ({ data }: { data: any }) => {
    console.log('Login data:', data);
    // Process login
  };

  return (
    <Form
      name="login-form"           // Unique form identifier
      fields={fields}             // Field definitions - automatically renders all fields
      onSubmit={handleSubmit}     // Submission handler
    >
      {/* Fields are automatically rendered based on the fields prop */}
      {/* You only need children for actions, custom content, or layout */}
      <Form.Action formName="login-form" variant="primary">
        Login
      </Form.Action>
    </Form>
  );
}
```

#### Contact Form with Validation

```tsx
export default function ContactForm() {
  const fields = {
    name: { 
      type: 'text', 
      name: 'name', 
      required: true, 
      placeholder: 'Your Name',
      minLength: 2
    },
    email: { 
      type: 'email', 
      name: 'email', 
      required: true, 
      placeholder: 'Email Address',
      validateEmail: true  // Built-in email validation
    },
    message: { 
      type: 'text', 
      name: 'message', 
      required: true, 
      placeholder: 'Your Message',
      minLength: 10
    }
  } as const;

  return (
    <Form
      name="contact-form"
      fields={fields}             // All fields automatically rendered
      validateBeforeFirstSubmit={true}
      onSubmit={({ data }) => {
        console.log('Contact data:', data);
      }}
    >
      {/* Only action needed - fields render automatically */}
      <Form.Action formName="contact-form">Send Message</Form.Action>
    </Form>
  );
}
```

#### Registration Form with Custom Field Types

```tsx
export default function RegistrationForm() {
  const fields = {
    firstName: { 
      type: 'text', 
      name: 'firstName', 
      required: true, 
      placeholder: 'First Name' 
    },
    lastName: { 
      type: 'text', 
      name: 'lastName', 
      required: true, 
      placeholder: 'Last Name' 
    },
    email: { 
      type: 'email', 
      name: 'email', 
      required: true, 
      placeholder: 'Email Address' 
    },
    password: { 
      type: 'password', 
      name: 'password', 
      required: true, 
      placeholder: 'Password',
      minLength: 8
    },
    // Custom field types from Fields folder
    country: { 
      type: 'selectCountry',        // Custom country selector
      name: 'country', 
      required: true, 
      placeholder: 'Select Country' 
    },
    category: {
      type: 'select',               // Custom dropdown  
      name: 'category',
      options: ['Individual', 'Business', 'Non-profit'],
      placeholder: 'Account Type'
    },
    agreeToTerms: { 
      type: 'checkbox',             // Custom checkbox
      name: 'agreeToTerms', 
      required: true, 
      label: 'I agree to the terms and conditions' 
    },
    notifications: { 
      type: 'switch',               // Custom switch toggle
      name: 'notifications', 
      label: 'Enable email notifications' 
    }
  } as const;

  return (
    <Form
      name="registration-form"
      fields={fields}               // All fields automatically rendered in order
      onSubmit={({ data }) => {
        console.log('Registration data:', data);
        // Create user account
      }}
    >
      {/* Only action needed - all fields render automatically from fields prop */}
      <Form.Action formName="registration-form">Create Account</Form.Action>
    </Form>
  );
}
```

#### Mixed Rendering: Auto + Additional Fields

```tsx
export default function ProfileForm() {
  // Main profile fields - will auto-render
  const profileFields = {
    firstName: { type: 'text', name: 'firstName', required: true },
    lastName: { type: 'text', name: 'lastName', required: true },
    email: { type: 'email', name: 'email', required: true },
    phone: { type: 'tel', name: 'phone' }
  } as const;

  return (
    <Form
      name="profile-form"
      fields={profileFields}       // These fields auto-render first
      onSubmit={({ data }) => {
        console.log('Profile data:', data);
      }}
    >
      {/* profileFields auto-render here in definition order */}
  
      {/* Add additional fields not in the fields prop */}
      <Form.FieldRenderer 
        type="checkbox" 
        name="terms" 
        label="I agree to the terms and conditions"
        required 
      />
  
      <Form.FieldRenderer 
        type="text" 
        name="referralCode" 
        placeholder="Referral code (optional)"
      />
  
      <Form.Action formName="profile-form">Save Profile</Form.Action>
    </Form>
  );
}
---

## 2. Form Component Overview

> **Target**: Developers understanding core concepts  
> **Content**: Props overview, basic configuration, form lifecycle

### Form Architecture Deep Dive

The Resk Form system uses a unique architecture:

1. **Field Definitions Object**: All fields are defined in a single object passed to the Form
2. **Automatic Field Rendering**: Form automatically renders all fields when `fields` prop is provided
3. **Form.FieldRenderer**: Used only for custom layouts with `renderFields` or `renderField` props
4. **Form.Field Class**: Base class for extending and creating custom field types  
5. **Form.Action**: Smart buttons that automatically integrate with form validation state
6. **useForm() Hook**: Context hook that provides access to form state from any child component

### Basic Form Structure

```tsx
// 1. Define all fields in a single object
const fields = {
  fieldName: { 
    type: 'text',           // Field type (determines which component to render)
    name: 'fieldName',      // Unique field identifier
    required: true,         // Validation rules
    placeholder: 'Enter value'  // UI properties
  }
} as const;

// 2. Pass fields to Form component - fields auto-render
<Form name="my-form" fields={fields}>
  {/* Fields automatically render in definition order */}
  <Form.Action>Submit</Form.Action>
</Form>
```

### Three Ways to Render Fields

#### 1. Automatic Rendering (Recommended)

```tsx
// ✅ Form automatically renders ALL fields from fields prop
<Form name="auto-form" fields={fields}>
  {/* All fields auto-render - no Form.FieldRenderer needed */}
  <Form.Action>Submit</Form.Action>
</Form>
```

#### 2. Manual Rendering Only

```tsx
// ✅ No fields prop - manually render each field
<Form name="manual-form">
  <Form.FieldRenderer type="text" name="username" required />
  <Form.FieldRenderer type="email" name="email" required />
  <Form.Action>Submit</Form.Action>
</Form>
```

#### 3. Mixed Rendering (Auto + Additional)

```tsx
// ✅ fields prop renders main fields + Form.FieldRenderer for additional ones
<Form name="mixed-form" fields={fields}>
  {/* All fields from 'fields' prop auto-render first */}
  
  {/* Then add additional fields not in the fields prop */}
  <Form.FieldRenderer type="checkbox" name="terms" required />
  <Form.FieldRenderer type="text" name="additionalInfo" />
  
  <Form.Action>Submit</Form.Action>
</Form>
```

#### 4. Custom Layout Control

```tsx
// ✅ Use renderFields when you need complete layout control
<Form 
  name="custom-form" 
  fields={fields}
  renderFields={({ fields }) => (
    <div className="custom-grid">
      <Form.FieldRenderer {...fields.username} />
      <Form.FieldRenderer {...fields.email} />
    </div>
  )}
/>
```

> **Key Concept**:
>
> - `fields` prop → Auto-renders ALL those fields
> - `Form.FieldRenderer` → Use for additional fields NOT in the fields prop
> - `renderFields` → Use when you need complete layout control

### Auto-Rendering vs Custom Rendering

#### Auto-Rendering (Default Behavior)

```tsx
// ✅ CORRECT - Fields automatically render when fields prop is provided
<Form name="auto-form" fields={fields}>
  {/* NO manual Form.FieldRenderer needed - fields auto-render in definition order */}
  <Form.Action formName="auto-form">Submit</Form.Action>
</Form>
```

#### Manual Field Rendering (No fields prop)

```tsx
// ✅ CORRECT - Manual rendering without fields prop
<Form name="manual-form">
  <Form.FieldRenderer type="text" name="username" required />
  <Form.FieldRenderer type="email" name="email" required />
  <Form.Action>Submit</Form.Action>
</Form>
```

#### Custom Layout (When you need control)

```tsx
// ✅ CORRECT - Use renderFields for custom layout
<Form 
  name="custom-form" 
  fields={fields}
  renderFields={({ fields }) => (
    <div className="custom-layout">
      <Form.FieldRenderer {...fields.fieldName} />
      {/* Custom layout logic */}
    </div>
  )}
>
  <Form.Action formName="custom-form">Submit</Form.Action>
</Form>
```

// 2. Pass fields to Form component - fields auto-render automatically
<Form
name="my-form"           // Unique form identifier (required)
fields={fields}          // Field definitions object (required) - auto-renders all fields
onSubmit={handleSubmit}  // Submission handler

{/* Fields render automatically from the fields prop */}
{/* Only add children for actions, custom content, or additional layout */}
<Form.Action formName="my-form">Submit</Form.Action>
</Form>

```

### Complete Form Props Reference

```tsx
<Form
  // Required Props
  name="unique-form-name"          // Form identification (required)
  fields={fieldDefinitions}       // Field configuration object (required)
  
  // Data & Submission  
  onSubmit={handleSubmit}          // Form submission handler
  data={initialData}               // Initial/existing data for fields
  isUpdate={false}                 // Create vs update mode
  
  // State Management
  isLoading={false}                // Loading state (disables interactions)
  disabled={false}                 // Disable entire form
  readOnly={false}                 // Read-only mode
  
  // Validation Configuration
  validateBeforeFirstSubmit={true} // Show validation before first submit
  validateOnChange={true}          // Validate fields as user types  
  validateOnBlur={true}           // Validate when field loses focus
  
  // Styling & Layout
  variant="default"                // Form layout variant
  className="custom-form-class"    // CSS customization
  style={{ padding: 20 }}         // Inline styling
  fieldContainerClassName="field-wrapper" // CSS for field containers
  
  // Advanced Rendering
  renderFields={customRenderer}    // Custom layout for all fields
  renderField={fieldRenderer}     // Custom wrapper for individual fields
  asFragment={false}               // Render as React Fragment (no container)
  asHtmlTag="form"                 // HTML tag for web (form, div, etc.)
  
  // Event Handlers
  onFormValid={handleValid}        // Called when form becomes valid
  onFormInvalid={handleInvalid}    // Called when form becomes invalid
  onFormKeyEvent={handleKeyEvent}  // Keyboard event handler
  onEnterKeyPress={handleEnter}    // Enter key handler
  
  // Testing & Development
  testID="form-test-id"            // Test automation identifier
  
  // Dynamic Content
  header={<CustomHeader />}        // Header content (can be function)
>
  {/* Form content - fields, actions, custom components */}
</Form>
```

### Field Definition Structure

```tsx
const fieldDefinition = {
  // Required Properties
  type: 'text',                    // Field type - determines component to render
  name: 'fieldName',              // Unique field identifier
  
  // Display Properties
  label: 'Field Label',           // Field label text
  placeholder: 'Enter value...',  // Placeholder text
  helpText: 'Additional help',    // Help/description text
  
  // Validation Properties
  required: true,                 // Required field validation
  minLength: 3,                  // Minimum length for text fields
  maxLength: 50,                 // Maximum length for text fields
  min: 0,                        // Minimum value for number fields
  max: 100,                      // Maximum value for number fields
  validateEmail: true,           // Built-in email validation
  validatePhoneNumber: true,     // Built-in phone validation
  
  // State Properties
  disabled: false,               // Disable field
  readOnly: false,               // Read-only mode
  visible: true,                 // Field visibility
  defaultValue: 'initial',       // Default/initial value
  
  // Behavior Properties
  validateOnMount: false,        // Validate when field mounts
  validateOnBlur: true,          // Validate when field loses focus
  validateOnChange: true,        // Validate as user types
  
  // Mode-Specific Properties (Create vs Update)
  forCreate: { visible: true },  // Properties only for create mode
  forUpdate: { readOnly: true }, // Properties only for update mode
  forCreateOrUpdate: { required: true }, // Properties for both modes
  primaryKey: true,              // Mark as primary key (auto read-only in update)
  
  // Styling
  className: 'custom-field',     // CSS class for field
  style: { marginBottom: 16 },   // Inline styles
  fieldContainerClassName: 'container' // CSS for field container
} as const;
```

### useForm() Context Hook

The `useForm()` hook provides access to form state from any child component:

```tsx
import { useForm } from '@resk/nativewind/components/Form';

function FormStatusComponent() {
  // Access form context from any component inside a Form
  const formContext = useForm();
  
  // Check if component is inside a Form
  if (!formContext) {
    console.log('This component is not inside a Form');
    return null;
  }
  
  // Extract form data and methods
  const { 
    form,           // Form instance with methods
    data,           // Current form data
    isSubmitting,   // Submission state
    isLoading,      // Loading state
    formName,       // Form identifier
    isUpdate        // Create vs update mode
  } = formContext;
  
  return (
    <div className="form-status">
      <p>Form: {formName}</p>
      <p>Valid: {form.isValid() ? '✅' : '❌'}</p>
      <p>Mode: {isUpdate ? 'Update' : 'Create'}</p>
      <p>Data: {JSON.stringify(data)}</p>
  
      {/* Access individual field instances */}
      <button onClick={() => {
        const fieldInstances = form.getFieldInstances();
        const emailField = fieldInstances.email;
        if (emailField) {
          console.log('Email value:', emailField.getValue());
          console.log('Email valid:', emailField.isValid());
        }
      }}>
        Check Email Field
      </button>
    </div>
  );
}

// Use inside a Form with custom rendering
<Form 
  name="my-form" 
  fields={fields}
  renderFields={({ fields }) => (
    <div>
      <Form.FieldRenderer {...fields.email} />
      <FormStatusComponent />  {/* Has access to form context */}
    </div>
  )}
/>
```

### Form Lifecycle & Events

```tsx
<Form
  name="lifecycle-form"
  fields={fields}
  
  // Submission event
  onSubmit={({ data, isUpdate, form }) => {
    console.log('Form submitted:', { data, isUpdate });
    console.log('Form instance:', form);
  }}
  
  // Validation events
  onFormValid={({ form, data }) => {
    console.log('Form became valid', data);
    // Enable submit button, show success indicator, etc.
  }}
  
  onFormInvalid={({ form, data }) => {
    console.log('Form became invalid', data);
    // Disable submit button, show error indicator, etc.
  }}
  
  // Keyboard events
  onFormKeyEvent={({ key, form, field }) => {
    console.log('Key pressed:', key);
    if (key === 'escape') {
      // Cancel form, clear data, etc.
    }
  }}
  
  onEnterKeyPress={({ form }) => {
    if (form.isValid()) {
      console.log('Enter pressed on valid form');
      form.submit(); // Auto-submit on Enter
    }
  }}
>
  {/* Form content */}
</Form>
```

## 3. Field System Fundamentals

> **Target**: Users working with form fields
> **Content**: Field types, validation, field properties, custom fields

### Complete Field Types Reference

#### Built-in Field Types (No import required)


| Type       | Component      | Description                 | Common Use Cases            |
| ---------- | -------------- | --------------------------- | --------------------------- |
| `text`     | TextInput      | Basic text input            | Names, titles, descriptions |
| `email`    | TextInput      | Email input with validation | Email addresses             |
| `password` | TextInput      | Password input (masked)     | Passwords, sensitive data   |
| `number`   | TextInput      | Numeric input               | Ages, quantities, prices    |
| `tel`      | TextInput      | Phone number input          | Phone numbers               |
| `url`      | TextInput      | URL input                   | Website links               |
| `date`     | DatePicker     | Date selection              | Birth dates, deadlines      |
| `datetime` | DateTimePicker | Date and time selection     | Appointments, events        |
| `time`     | TimePicker     | Time selection              | Meeting times               |

#### Custom Field Types (Requires `/Fields` import)


| Type            | Component          | Description               | Common Use Cases                 |
| --------------- | ------------------ | ------------------------- | -------------------------------- |
| `checkbox`      | FormFieldCheckbox  | Checkbox with label       | Terms agreement, feature toggles |
| `switch`        | FormFieldSwitch    | Toggle switch             | Settings, preferences            |
| `select`        | FormFieldSelect    | Dropdown selection        | Categories, options, status      |
| `selectCountry` | SelectCountryField | Country picker with flags | Address forms, localization      |

### Built-in Field Types

The Form system includes several built-in field types that work out of the box:

#### Text Input Fields

```tsx
const textFields = {
  // Basic text input
  username: { 
    type: 'text', 
    name: 'username', 
    placeholder: 'Username',
    required: true,
    minLength: 3,
    maxLength: 20
  },
  
  // Email input with validation
  email: { 
    type: 'email', 
    name: 'email', 
    placeholder: 'Email Address',
    required: true,
    validateEmail: true  // Built-in email validation
  },
  
  // Password input
  password: { 
    type: 'password', 
    name: 'password', 
    placeholder: 'Secure Password',
    required: true,
    minLength: 8,
    maxLength: 50
  },
  
  // Number input with constraints
  age: { 
    type: 'number', 
    name: 'age', 
    placeholder: 'Age',
    min: 18,
    max: 120,
    required: true
  },
  
  // Phone input with formatting
  phone: { 
    type: 'tel', 
    name: 'phone', 
    placeholder: 'Phone Number',
    validatePhoneNumber: true  // Built-in phone validation
  },
  
  // URL input
  website: { 
    type: 'url', 
    name: 'website', 
    placeholder: 'Website URL' 
  }
} as const;
```

#### Date and Time Fields

```tsx
const dateTimeFields = {
  // Date picker
  birthDate: { 
    type: 'date', 
    name: 'birthDate', 
    placeholder: 'Birth Date',
    required: true
  },
  
  // Date and time picker
  appointment: { 
    type: 'datetime', 
    name: 'appointment', 
    placeholder: 'Appointment Date & Time' 
  },
  
  // Time picker
  meetingTime: { 
    type: 'time', 
    name: 'meetingTime', 
    placeholder: 'Meeting Time' 
  }
} as const;
```

### Custom Field Types (From Fields Folder)

The `/Fields` folder contains pre-built custom field components that extend the base Form functionality. These fields are implemented using the `@AttachFormField` decorator and must be imported to be available.

#### Installation & Import

```tsx
// Import ALL custom field types to enable them
import '@resk/nativewind/components/Form/Fields';

// Or import specific fields individually
import '@resk/nativewind/components/Form/Fields/Checkbox';
import '@resk/nativewind/components/Form/Fields/Switch';
import '@resk/nativewind/components/Form/Fields/Select';
import '@resk/nativewind/components/Form/Fields/SelectCountry';
```

#### Available Custom Field Types


| Field Type      | Component            | Description               | Use Case                         |
| --------------- | -------------------- | ------------------------- | -------------------------------- |
| `checkbox`      | `FormFieldCheckbox`  | Checkbox input with label | Terms agreement, feature toggles |
| `switch`        | `FormFieldSwitch`    | Toggle switch control     | Settings, preferences            |
| `select`        | `FormFieldSelect`    | Dropdown selection        | Categories, options              |
| `selectCountry` | `SelectCountryField` | Country picker with flags | Address forms, localization      |

#### Boolean Input Fields

```tsx
const booleanFields = {
  // Checkbox component (FormFieldCheckbox) 
  agreeToTerms: { 
    type: 'checkbox', 
    name: 'agreeToTerms', 
    label: 'I agree to the terms and conditions',
    required: true,
    helpText: 'You must agree to continue'
  },
  
  // Switch toggle component (FormFieldSwitch)
  enableNotifications: { 
    type: 'switch', 
    name: 'enableNotifications', 
    label: 'Enable push notifications',
    checkedValue: true,      // Value when toggled on
    uncheckedValue: false,   // Value when toggled off
    defaultValue: false      // Initial state
  },

  // Multiple checkboxes for features
  features: {
    type: 'checkbox',
    name: 'features',
    label: 'Newsletter subscription',
    checkedValue: 'subscribed',
    uncheckedValue: 'unsubscribed'
  }
} as const;
```

#### Selection Fields

```tsx
const selectionFields = {
  // Dropdown component (FormFieldSelect)
  category: { 
    type: 'select', 
    name: 'category', 
    placeholder: 'Choose category',
    required: true,
    options: [
      { label: 'Technology', value: 'tech' },
      { label: 'Business', value: 'business' },
      { label: 'Design', value: 'design' },
      { label: 'Marketing', value: 'marketing' }
    ],
    helpText: 'Select the most relevant category'
  },
  
  // Country selector component (SelectCountryField)
  country: { 
    type: 'selectCountry', 
    name: 'country', 
    placeholder: 'Select your country',
    required: true,
    displayDialCode: false,   // Hide dial code in display
    anchor: 'bottom',         // Dropdown anchor position
    helpText: 'Choose your country of residence'
  },

  // Select with custom data
  priority: {
    type: 'select',
    name: 'priority',
    label: 'Task Priority',
    options: [
      { label: 'Low', value: 'low', disabled: false },
      { label: 'Medium', value: 'medium', disabled: false },
      { label: 'High', value: 'high', disabled: false },
      { label: 'Critical', value: 'critical', disabled: false }
    ],
    defaultValue: 'medium'
  }
} as const;
```

#### Complete Example with Custom Fields

```tsx
export default function RegistrationForm() {
  const fields = {
    // Built-in text fields
    firstName: { type: 'text', name: 'firstName', required: true },
    lastName: { type: 'text', name: 'lastName', required: true },
    email: { type: 'email', name: 'email', required: true },
  
    // Custom Fields from /Fields folder
    country: { 
      type: 'selectCountry', 
      name: 'country', 
      required: true,
      placeholder: 'Select your country'
    },
    accountType: {
      type: 'select',
      name: 'accountType',
      required: true,
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business', value: 'business' }
      ]
    },
    newsletter: {
      type: 'checkbox',
      name: 'newsletter',
      label: 'Subscribe to newsletter'
    },
    notifications: {
      type: 'switch',
      name: 'notifications',
      label: 'Enable email notifications',
      defaultValue: true
    }
  } as const;

  return (
    <Form
      name="registration-form"
      fields={fields}  // All fields auto-render including custom ones
      onSubmit={({ data }) => {
        console.log('Registration data:', data);
        // data includes values from all field types
      }}
    >
      <Form.Action formName="registration-form">Create Account</Form.Action>
    </Form>
  );
}
```

#### Field Type Architecture

Each custom field in the `/Fields` folder:

1. **Extends `Form.Field`**: Inherits core form functionality
2. **Uses `@AttachFormField` decorator**: Registers the field type globally
3. **Implements `_render` method**: Defines how the field renders
4. **Declares TypeScript interface**: Provides type safety and IntelliSense
5. **Extends `IFieldMap`**: Makes the field type available in form definitions

```tsx
// Example: How custom fields are implemented
@AttachFormField<"checkbox">("checkbox")
export class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
    _render(props: IField<"checkbox">, innerRef: any): ReactElement {
        return <Checkbox {...(props as any)} ref={innerRef} />;
    }
}

// TypeScript declaration makes it available
declare module "@resk/core/resources" {
    export interface IFieldMap {
        checkbox: IFormFieldCheckboxProps;
    }
}
```

### Field Properties & Configuration

#### Core Field Properties

```tsx
const fieldConfiguration = {
  // Required Properties
  type: 'text',                    // Field type - determines component
  name: 'fieldName',              // Unique identifier within form
  
  // Display Properties
  label: 'Field Label',           // Label text displayed above field
  placeholder: 'Enter value...',  // Placeholder text in field
  helpText: 'Additional guidance', // Help text below field
  
  // Validation Properties
  required: true,                 // Mark field as required
  minLength: 3,                  // Minimum character length
  maxLength: 50,                 // Maximum character length
  min: 0,                        // Minimum numeric value
  max: 100,                      // Maximum numeric value
  validateEmail: true,           // Enable email format validation
  validatePhoneNumber: true,     // Enable phone format validation
  
  // State Properties
  disabled: false,               // Disable field interaction
  readOnly: false,               // Make field read-only
  visible: true,                 // Control field visibility
  defaultValue: 'initial value', // Default field value
  
  // Behavior Properties
  validateOnMount: false,        // Validate when field first loads
  validateOnBlur: true,          // Validate when field loses focus
  validateOnChange: true,        // Validate as user types
  
  // Styling Properties
  className: 'custom-field-class', // CSS class for field
  style: { marginBottom: 16 },   // Inline styles for field
  fieldContainerClassName: 'container-class' // CSS for field container
} as const;
```

#### Mode-Specific Properties

```tsx
const userFields = {
  // Primary key field - automatically read-only in update mode
  id: {
    type: 'text',
    name: 'id',
    primaryKey: true,              // Auto read-only in update mode
    forCreate: { visible: false }  // Hidden in create mode
  },
  
  // Email - read-only in update mode
  email: {
    type: 'email',
    name: 'email',
    required: true,
    forUpdate: { readOnly: true }  // Read-only only in update mode
  },
  
  // Password - only visible in create mode
  password: {
    type: 'password',
    name: 'password',
    required: true,
    forCreate: { required: true },  // Required only in create mode
    forUpdate: { visible: false }   // Hidden in update mode
  },
  
  // Name - same behavior in both modes
  name: {
    type: 'text',
    name: 'name',
    forCreateOrUpdate: { required: true } // Required in both modes
  }
} as const;
```

### Custom Validation Functions

```tsx
const fieldsWithCustomValidation = {
  email: {
    type: 'email',
    name: 'email',
    required: true,
    validateEmail: true,
    // Custom validation function
    validation: (value: string) => {
      if (!value.endsWith('@company.com')) {
        return 'Must be a company email address';
      }
      return undefined; // No error
    }
  },
  
  password: {
    type: 'password',
    name: 'password',
    required: true,
    minLength: 8,
    validation: (value: string) => {
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[!@#$%^&*]/.test(value);
  
      if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
        return 'Password must contain uppercase, lowercase, number, and special character';
      }
      return undefined;
    }
  },
  
  confirmPassword: {
    type: 'password',
    name: 'confirmPassword',
    required: true,
    // Validation that accesses other fields
    validation: (value: string, field: any, form: any) => {
      const passwordField = form.getFieldInstances().password;
      const passwordValue = passwordField?.getValue();
  
      if (value !== passwordValue) {
        return 'Passwords do not match';
      }
      return undefined;
    }
  }
} as const;
```

### Field Type Registration System

The custom field types in the `/Fields` folder use the `@AttachFormField` decorator to register themselves:

```tsx
// Example from FormFieldCheckbox
@AttachFormField<"checkbox">("checkbox")
export class FormFieldCheckbox extends FormFieldSwitch<"checkbox"> {
  _render(props: IField<"checkbox">, innerRef: any): ReactElement {
    return <Checkbox {...(props as any)} ref={innerRef} />;
  }
}

// This makes 'checkbox' available as a field type:
const fields = {
  terms: { type: 'checkbox', name: 'terms', label: 'I agree' }
};
```

Available custom field types from `/Fields` folder:

- **`checkbox`** - Checkbox component (FormFieldCheckbox)
- **`switch`** - Switch toggle component (FormFieldSwitch)
- **`select`** - Dropdown component (FormFieldSelect)
- **`selectCountry`** - Country selector component (SelectCountryField)

---

## 4. Form Submission & Validation

> **Target**: Users implementing form logic
> **Content**: onSubmit handling, validation timing, error management

### Form Submission Patterns

#### Basic Form Submission

```tsx
const handleSubmit = ({ data, isUpdate, form }: { 
  data: any;           // Form data object
  isUpdate: boolean;   // Create vs update mode
  form: any;          // Form instance
}) => {
  console.log('Form submitted with data:', data);
  console.log('Is update mode:', isUpdate);
  
  // Process the form data
  if (isUpdate) {
    updateRecord(data);
  } else {
    createRecord(data);
  }
};

<Form
  name="basic-form"
  fields={fields}
  onSubmit={handleSubmit}
>
  {/* Fields auto-render from fields prop */}
  <Form.Action formName="basic-form">Submit</Form.Action>
</Form>
```

#### Async Submission with Loading States

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);

const handleAsyncSubmit = async ({ data, isUpdate }: { data: any; isUpdate: boolean }) => {
  try {
    setIsSubmitting(true);
    setSubmitError(null);
  
    // API call
    const response = await fetch('/api/users', {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      throw new Error('Failed to save data');
    }
  
    const result = await response.json();
    console.log('Success:', result);
  
    // Show success message, redirect, etc.
    showNotification('Data saved successfully!');
  
  } catch (error) {
    console.error('Submission error:', error);
    setSubmitError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

<Form
  name="async-form"
  fields={fields}
  onSubmit={handleAsyncSubmit}
  isLoading={isSubmitting}  // Disables form during submission
>
  {/* Fields auto-render from fields prop */}
  
  {submitError && (
    <div className="error-message">{submitError}</div>
  )}
  
  <Form.Action 
    formName="async-form"
    disabled={isSubmitting}
  >
    {isSubmitting ? "Saving..." : "Save"}
  </Form.Action>
</Form>
```

### Create vs Update Modes

#### User Management Form Example

```tsx
const UserForm = ({ existingUser, isEdit }: { 
  existingUser?: any; 
  isEdit: boolean; 
}) => {
  const fields = {
    // Primary key - auto read-only in update mode
    id: { 
      type: 'text', 
      name: 'id', 
      primaryKey: true,              // Automatically read-only in update
      forCreate: { visible: false }  // Hidden in create mode
    },
  
    // Email - read-only in update to prevent conflicts
    email: { 
      type: 'email', 
      name: 'email', 
      required: true,
      forUpdate: { 
        readOnly: true,
        helpText: 'Email cannot be changed after account creation'
      }
    },
  
    // Password - only for creation
    password: { 
      type: 'password', 
      name: 'password', 
      forCreate: { required: true },  // Required only in create mode
      forUpdate: { visible: false }   // Completely hidden in update mode
    },
  
    // Name - editable in both modes
    firstName: { 
      type: 'text', 
      name: 'firstName', 
      required: true 
    },
    lastName: { 
      type: 'text', 
      name: 'lastName', 
      required: true 
    }
  } as const;

  return (
    <Form
      name="user-form"
      fields={fields}
      data={existingUser}        // Pre-populate in update mode
      isUpdate={isEdit}          // Controls field behavior
      onSubmit={({ data, isUpdate }) => {
        if (isUpdate) {
          updateUser(existingUser.id, data);
        } else {
          createUser(data);
        }
      }}
    >
      <Form.FieldRenderer {...fields.id} />
      <Form.FieldRenderer {...fields.email} />
      <Form.FieldRenderer {...fields.password} />
  
      <div className="grid grid-cols-2 gap-4">
        <Form.FieldRenderer {...fields.firstName} />
        <Form.FieldRenderer {...fields.lastName} />
      </div>
  
      <Form.Action formName="user-form">
        {isEdit ? 'Update User' : 'Create User'}
      </Form.Action>
    </Form>
  );
};
```

### Validation Configuration

#### Validation Timing Control

```tsx
<Form
  name="validation-demo"
  fields={fields}
  
  // Global validation timing
  validateBeforeFirstSubmit={true}     // Show validation before any submit attempt
  validateOnChange={true}              // Validate fields as user types
  validateOnBlur={true}               // Validate when field loses focus
  
  // Validation event handlers
  onFormValid={({ form, data }) => {
    console.log('✅ Form is now valid');
    setSubmitButtonEnabled(true);
  }}
  
  onFormInvalid={({ form, data }) => {
    console.log('❌ Form is now invalid');
    setSubmitButtonEnabled(false);
  }}
>
  {/* Form content */}
</Form>
```

#### Field-Level Validation Timing

```tsx
const fields = {
  email: {
    type: 'email',
    name: 'email',
    required: true,
    validateEmail: true,
    validateOnMount: false,    // Don't validate when field first appears
    validateOnBlur: true,      // Validate when user leaves field
    validateOnChange: false    // Don't validate while typing (override global)
  },
  
  password: {
    type: 'password',
    name: 'password',
    required: true,
    minLength: 8,
    validateOnMount: false,
    validateOnBlur: true,
    validateOnChange: true     // Validate while typing for immediate feedback
  }
} as const;
```

### Advanced Validation Patterns

#### Cross-Field Validation

```tsx
const registrationFields = {
  password: {
    type: 'password',
    name: 'password',
    required: true,
    minLength: 8,
    validation: (value: string) => {
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
  
      if (!hasUpper || !hasLower || !hasNumber) {
        return 'Password must contain uppercase, lowercase, and numbers';
      }
      return undefined;
    }
  },
  
  confirmPassword: {
    type: 'password',
    name: 'confirmPassword',
    required: true,
    validation: (value: string, field: any, form: any) => {
      // Access other field instances for cross-validation
      const passwordField = form.getFieldInstances().password;
      const passwordValue = passwordField?.getValue();
  
      if (value !== passwordValue) {
        return 'Passwords do not match';
      }
      return undefined;
    }
  },
  
  email: {
    type: 'email',
    name: 'email',
    required: true,
    validateEmail: true,
    validation: async (value: string) => {
      // Async validation - check if email exists
      try {
        const response = await fetch(`/api/check-email?email=${value}`);
        const exists = await response.json();
  
        if (exists) {
          return 'This email is already registered';
        }
        return undefined;
      } catch (error) {
        // If check fails, allow the value (don't block form)
        return undefined;
      }
    }
  }
} as const;
```

### Form State Access & Monitoring

#### Using useForm() Hook for State Access

```tsx
function FormMonitor() {
  const formContext = useForm();
  
  if (!formContext) {
    return <div>Not inside a form</div>;
  }
  
  const { form, data, isSubmitting, formName } = formContext;
  
  // Get validation state
  const isValid = form.isValid();
  const fieldInstances = form.getFieldInstances();
  
  return (
    <div className="form-monitor">
      <h4>Form Status: {formName}</h4>
      <div className="status-grid">
        <div>Valid: {isValid ? '✅' : '❌'}</div>
        <div>Submitting: {isSubmitting ? '⏳' : '✓'}</div>
        <div>Fields: {Object.keys(fieldInstances).length}</div>
      </div>
  
      <details>
        <summary>Current Data</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
  
      <details>
        <summary>Field Validation</summary>
        {Object.entries(fieldInstances).map(([name, field]) => (
          <div key={name}>
            {name}: {field.isValid() ? '✅' : '❌'}
            {!field.isValid() && field.getError && (
              <span className="error"> - {field.getError()}</span>
            )}
          </div>
        ))}
      </details>
    </div>
  );
}

// Use in form with custom rendering
<Form 
  name="monitored-form" 
  fields={fields}
  renderFields={({ fields }) => (
    <div>
      <Form.FieldRenderer {...fields.email} />
      <Form.FieldRenderer {...fields.password} />
      <FormMonitor />  {/* Shows real-time form state */}
    </div>
  )}
/>
```

#### Manual Form Operations

```tsx
function FormController() {
  const formContext = useForm();
  
  if (!formContext) return null;
  
  const { form } = formContext;
  
  return (
    <div className="form-controls">
      <button onClick={() => {
        // Manually trigger form submission
        if (form.isValid()) {
          form.submit();
        } else {
          alert('Form is not valid');
        }
      }}>
        Manual Submit
      </button>
  
      <button onClick={() => {
        // Get current form data
        const data = form.getData();
        console.log('Current form data:', data);
      }}>
        Get Data
      </button>
  
      <button onClick={() => {
        // Check individual field
        const emailField = form.getFieldInstances().email;
        if (emailField) {
          console.log('Email value:', emailField.getValue());
          console.log('Email valid:', emailField.isValid());
        }
      }}>
        Check Email Field
      </button>
    </div>
  );
}
```

---

## 5. Form.FieldRenderer Usage

> **Target**: Users needing to add individual fields
> **Content**: When and how to use Form.FieldRenderer

### Understanding Form.FieldRenderer

`Form.FieldRenderer` is used for rendering individual form fields in these scenarios:

1. **No fields prop**: When building forms manually without a fields definition object
2. **Additional fields**: When you need extra fields beyond those in the `fields` prop
3. **Custom layouts**: When using `renderFields` or `renderField` for layout control

It automatically:

- Selects the correct field component based on the `type` property
- Integrates with form state management and validation
- Handles field lifecycle events (mount, unmount, validation)
- Manages field interactions within the form context

### When NOT to Use Form.FieldRenderer

```tsx
// ❌ INCORRECT - Don't use Form.FieldRenderer for fields already in fields prop
<Form name="my-form" fields={fields}>
  <Form.FieldRenderer {...fields.username} />  {/* Already auto-rendered! */}
  <Form.FieldRenderer {...fields.email} />     {/* Already auto-rendered! */}
</Form>

// ✅ CORRECT - fields prop auto-renders all fields
<Form name="my-form" fields={fields}>
  {/* Fields auto-render - no Form.FieldRenderer needed */}
  <Form.Action>Submit</Form.Action>
</Form>
```

### When TO Use Form.FieldRenderer

#### 1. Manual Form Building (No fields prop)

#### 1. Manual Form Building (No fields prop)

```tsx
// ✅ Building form field by field
<Form name="manual-form">
  <Form.FieldRenderer 
    type="text" 
    name="username" 
    required 
    placeholder="Enter username" 
  />
  <Form.FieldRenderer 
    type="email" 
    name="email" 
    required 
    validateEmail 
  />
  <Form.FieldRenderer 
    type="selectCountry" 
    name="country" 
    placeholder="Select country" 
  />
  <Form.Action>Submit</Form.Action>
</Form>
```

#### 2. Adding Extra Fields to Auto-Rendered Form

```tsx
// ✅ Mix auto-rendered fields + additional fields
<Form name="mixed-form" fields={mainFields}>
  {/* mainFields auto-render first */}
  
  {/* Add extra fields not in mainFields */}
  <Form.FieldRenderer 
    type="checkbox" 
    name="terms" 
    label="I agree to terms"
    required 
  />
  <Form.FieldRenderer 
    type="text" 
    name="comments" 
    placeholder="Additional comments" 
  />
  <Form.Action>Submit</Form.Action>
</Form>
```

#### 3. Custom Layout Control

```tsx
// ✅ Use renderFields for complete layout control
<Form 
  name="custom-layout" 
  fields={fields}
  renderFields={({ fields }) => (
    <div className="grid grid-cols-2 gap-4">
      <Form.FieldRenderer {...fields.username} />
      <Form.FieldRenderer {...fields.email} />
    </div>
  )}
/>
```

### Field Rendering with Property Overrides

When using the `fields` prop, the Form automatically renders all fields. To override properties, modify the field definitions in your form schema:

```tsx
// Modify field properties in your schema
const overrideFields = {
  username: Field.text({
    name: "username",
    placeholder: "Your unique username",
    className: "large-text-field",
    style: { fontSize: 18 }
  }),
  email: Field.email({
    name: "email",
    validateOnBlur: false,       // Don't validate on blur
    validateOnChange: true,      // Validate while typing
    helpText: "We'll never share your email"
  }),
  country: Field.select({
    name: "country",
    disabled: !isEmailValid,    // Conditional disabling
    fieldContainerClassName: "highlighted-field"
  })
};

// Form automatically renders all fields with overrides
<Form name="override-form" fields={overrideFields} />
```

### Automatic Component Selection

The `Form.FieldRenderer` automatically chooses the right component:

```tsx
// Built-in text field types → TextInput component
<Form.FieldRenderer type="text" name="username" />      // Text input
<Form.FieldRenderer type="email" name="email" />        // Text input with email validation
<Form.FieldRenderer type="password" name="password" />  // Password input
<Form.FieldRenderer type="number" name="age" />         // Number input
<Form.FieldRenderer type="tel" name="phone" />          // Phone input
<Form.FieldRenderer type="url" name="website" />        // URL input

// Date/time types → Date/time picker components  
<Form.FieldRenderer type="date" name="birthDate" />     // Date picker
<Form.FieldRenderer type="datetime" name="appointment" /> // DateTime picker
<Form.FieldRenderer type="time" name="meetingTime" />   // Time picker

// Custom field types (requires Fields import) → Custom components
<Form.FieldRenderer type="checkbox" name="agree" />     // Checkbox component
<Form.FieldRenderer type="switch" name="notifications" /> // Switch component
<Form.FieldRenderer type="select" name="category" />    // Dropdown component
<Form.FieldRenderer type="selectCountry" name="country" /> // Country selector
```

### Custom Fields from /Fields Folder

#### Checkbox Fields (FormFieldCheckbox)

```tsx
<Form.FieldRenderer 
  type="checkbox" 
  name="agreeToTerms" 
  label="I agree to the terms and conditions"
  required 
  helpText="You must agree to continue"
/>

<Form.FieldRenderer 
  type="checkbox" 
  name="newsletter" 
  label="Subscribe to newsletter"
  checkedValue="subscribed"
  uncheckedValue="unsubscribed"
  defaultValue="unsubscribed"
/>
```

#### Switch Fields (FormFieldSwitch)

```tsx
<Form.FieldRenderer 
  type="switch" 
  name="notifications" 
  label="Enable push notifications"
  checkedValue={true}
  uncheckedValue={false}
  defaultValue={true}
/>

<Form.FieldRenderer 
  type="switch" 
  name="darkMode" 
  label="Dark mode"
  helpText="Toggle app appearance"
/>
```

#### Select Fields (FormFieldSelect)

```tsx
<Form.FieldRenderer 
  type="select" 
  name="category" 
  label="Category"
  placeholder="Choose category"
  required
  options={[
    { label: 'Technology', value: 'tech' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' }
  ]}
/>

<Form.FieldRenderer 
  type="select" 
  name="priority" 
  label="Priority Level"
  options={[
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' }
  ]}
  defaultValue="medium"
/>
```

#### Country Select (SelectCountryField)

```tsx
<Form.FieldRenderer 
  type="selectCountry" 
  name="country" 
  label="Country"
  placeholder="Select your country"
  required
  displayDialCode={false}
  helpText="Choose your country of residence"
/>

<Form.FieldRenderer 
  type="selectCountry" 
  name="birthCountry" 
  label="Country of Birth"
  anchor="bottom"
  displayDialCode={true}
/>
```

### Custom Layout with renderFields

Use the `renderFields` prop for complete control over form layout:

```tsx
function ProfileForm() {
  const fields = {
    // Personal info
    firstName: { type: 'text', name: 'firstName', required: true },
    lastName: { type: 'text', name: 'lastName', required: true },
    email: { type: 'email', name: 'email', required: true },
    phone: { type: 'tel', name: 'phone' },
  
    // Location
    country: { type: 'selectCountry', name: 'country', required: true },
  
    // Preferences
    notifications: { type: 'switch', name: 'notifications' },
    newsletter: { type: 'checkbox', name: 'newsletter' }
  } as const;

  return (
    <Form
      name="profile-form"
      fields={fields}
      renderFields={({ fields, form, data, isUpdate }) => (
        <div className="max-w-4xl mx-auto space-y-8">
    
          {/* Personal Information Section */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.FieldRenderer {...fields.firstName} />
              <Form.FieldRenderer {...fields.lastName} />
            </div>
            <div className="mt-4">
              <Form.FieldRenderer {...fields.email} />
            </div>
            <div className="mt-4">
              <Form.FieldRenderer {...fields.phone} />
            </div>
          </section>
    
          {/* Location Section */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <Form.FieldRenderer {...fields.country} />
          </section>
    
          {/* Preferences Section */}
          <section className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <div className="space-y-4">
              <Form.FieldRenderer {...fields.notifications} />
              <Form.FieldRenderer {...fields.newsletter} />
            </div>
          </section>
    
          {/* Form Status */}
          {form.isValid() && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <span className="text-green-800">Profile information is complete and valid</span>
              </div>
            </div>
          )}
    
        </div>
      )}
    />
  );
}
```

### Fragment Rendering for Tables

Use `asFragment={true}` for inline table editing:

```tsx
const UserTableRow = ({ user, onSave, onCancel }: {
  user: any;
  onSave: (id: string, data: any) => void;
  onCancel: () => void;
}) => {
  const rowFields = {
    name: { type: 'text', name: 'name', required: true },
    email: { type: 'email', name: 'email', required: true },
    role: { 
      type: 'select', 
      name: 'role',
      options: ['User', 'Admin', 'Manager']
    },
    active: { type: 'switch', name: 'active' }
  } as const;

  return (
    <tr className="border-b">
      <Form
        asFragment={true}                    // No form container
        name={`user-row-${user.id}`}
        fields={rowFields}
        data={user}                          // Pre-populate with user data
        isUpdate={true}
        renderFields={({ fields, form }) => (
          <React.Fragment>
            <td className="px-4 py-3">
              <Form.FieldRenderer 
                {...fields.name}
                className="table-input"
              />
            </td>
            <td className="px-4 py-3">
              <Form.FieldRenderer 
                {...fields.email}
                className="table-input"
              />
            </td>
            <td className="px-4 py-3">
              <Form.FieldRenderer 
                {...fields.role}
                className="table-select"
              />
            </td>
            <td className="px-4 py-3">
              <Form.FieldRenderer {...fields.active} />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Form.Action
                  formName={`user-row-${user.id}`}
                  size="sm"
                  variant="primary"
                  disabled={!form.isValid()}
                >
                  Save
                </Form.Action>
                <button 
                  onClick={onCancel}
                  className="px-3 py-1 text-sm border rounded"
                >
                  Cancel
                </button>
              </div>
            </td>
          </React.Fragment>
        )}
        onSubmit={({ data }) => onSave(user.id, data)}
      />
    </tr>
  );
};

// Usage in table
<table className="w-full">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Active</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map(user => (
      <UserTableRow 
        key={user.id}
        user={user}
        onSave={handleSaveUser}
        onCancel={handleCancelEdit}
      />
    ))}
  </tbody>
</table>
```

### Conditional Field Rendering

```tsx
function ConditionalForm() {
  const fields = {
    accountType: { 
      type: 'select', 
      name: 'accountType',
      options: ['personal', 'business'],
      required: true
    },
  
    // Personal fields
    firstName: { type: 'text', name: 'firstName' },
    lastName: { type: 'text', name: 'lastName' },
  
    // Business fields
    companyName: { type: 'text', name: 'companyName' },
    taxId: { type: 'text', name: 'taxId' },
  
    // Common fields
    email: { type: 'email', name: 'email', required: true },
    phone: { type: 'tel', name: 'phone' }
  } as const;

  return (
    <Form
      name="conditional-form"
      fields={fields}
      renderFields={({ fields, data, form }) => (
        <div className="space-y-6">
    
          {/* Account type selector */}
          <Form.FieldRenderer {...fields.accountType} />
    
          {/* Conditional sections based on account type */}
          {data.accountType === 'personal' && (
            <section className="border p-4 rounded">
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Form.FieldRenderer {...fields.firstName} />
                <Form.FieldRenderer {...fields.lastName} />
              </div>
            </section>
          )}
    
          {data.accountType === 'business' && (
            <section className="border p-4 rounded">
              <h3 className="font-semibold mb-3">Business Information</h3>
              <div className="space-y-4">
                <Form.FieldRenderer {...fields.companyName} />
                <Form.FieldRenderer {...fields.taxId} />
              </div>
            </section>
          )}
    
          {/* Common fields - always visible */}
          <section className="border p-4 rounded">
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-4">
              <Form.FieldRenderer {...fields.email} />
              <Form.FieldRenderer {...fields.phone} />
            </div>
          </section>
    
          {/* Validation status */}
          <div className="text-sm text-gray-600">
            Form Status: {form.isValid() ? '✅ Valid' : '⚠️ Please complete required fields'}
          </div>
    
        </div>
      )}
    />
  );
}
```

### Individual Field Customization with renderField

Use `renderField` to customize individual field rendering while maintaining automatic layout:

```tsx
<Form
  name="custom-field-form"
  fields={fields}
  renderField={(field, { form, data, isUpdate }) => {
    // Custom wrapper for all fields
    const fieldInstance = form.getFieldInstances()[field.name];
    const isValid = fieldInstance?.isValid();
    const hasError = fieldInstance && !isValid && fieldInstance.hasValidated();
  
    return (
      <div className={`field-wrapper ${hasError ? 'field-error' : ''} ${isValid ? 'field-valid' : ''}`}>
  
        {/* Custom label with validation indicator */}
        {field.label && (
          <label className="flex items-center gap-2 mb-2">
            <span>{field.label}</span>
            {field.required && <span className="text-red-500">*</span>}
            {isValid && <span className="text-green-500">✓</span>}
          </label>
        )}
  
        {/* Field renderer with custom styling */}
        <Form.FieldRenderer
          {...field}
          className={`custom-field ${field.className || ''}`}
        />
  
        {/* Custom help text */}
        {field.helpText && (
          <p className="text-sm text-gray-600 mt-1">{field.helpText}</p>
        )}
  
        {/* Custom error display */}
        {hasError && fieldInstance.getError && (
          <p className="text-sm text-red-600 mt-1">
            {fieldInstance.getError()}
          </p>
        )}
  
      </div>
    );
  }}
>
  {/* Fields will be rendered automatically with custom wrapper */}
</Form>
```

---

## ⚡ **Medium Priority - Advanced Functionality**
