# 🚀 **Advanced Universal Form System** - Complete User Guide

> **The ultimate cross-platform form solution for React Native and Web applications**

A comprehensive, enterprise-grade form management system that provides advanced validation, state management, accessibility, and customization capabilities. Built with TypeScript for maximum type safety and developer experience.

---

## 📋 **Table of Contents**

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [📚 Core Components](#-core-components)
- [🎨 Styling & Variants](#-styling--variants)
- [🔧 Advanced Usage](#-advanced-usage)
- [🛡️ Validation System](#️-validation-system)
- [⌨️ Keyboard Navigation](#️-keyboard-navigation)
- [♿ Accessibility](#-accessibility)
- [🔄 State Management](#-state-management)
- [🎭 Rendering Customization](#-rendering-customization)
- [📊 Performance Optimization](#-performance-optimization)
- [🧪 Testing](#-testing)
- [📖 API Reference](#-api-reference)
- [❓ FAQ](#-faq)

---

## 🎯 **Overview**

The Resk Form System is a powerful, type-safe form management solution that works seamlessly across React Native and Web platforms. It provides everything you need to build sophisticated forms with minimal boilerplate code.

### **Why Choose Resk Forms?**

- **🔥 Type-Safe**: Full TypeScript support with intelligent field type inference
- **⚡ Performance**: Smart memoization and efficient re-rendering
- **🎨 Flexible**: Complete customization control over rendering and layout
- **🛡️ Robust**: Built-in validation with extensible rule system
- **♿ Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- **🔄 Stateful**: Advanced form state management with submission tracking
- **🎭 Versatile**: Fragment support for table rows and custom layouts

---

## ✨ **Key Features**

### **🎯 Cross-Platform Compatibility**
- Works seamlessly on React Native and Web
- Consistent API across all platforms
- Platform-specific optimizations

### **🔥 Type Safety**
- Full TypeScript support with generic types
- Intelligent field type inference
- Compile-time error checking

### **⚡ Performance Optimized**
- Smart memoization with React hooks
- Efficient re-rendering strategies
- Minimal bundle size impact

### **🎨 Highly Customizable**
- Flexible rendering with `renderFields` and `renderField` props
- Customizable styling variants
- Complete layout control

### **🛡️ Robust Validation**
- Built-in validation rules
- Custom validation support
- Real-time validation feedback

### **♿ Accessibility Ready**
- WCAG 2.1 AA compliant
- Screen reader support
- Keyboard navigation

### **🔄 Advanced State Management**
- Form submission tracking
- Field-level state management
- Global form state access

---

## 🚀 **Quick Start**

### **Installation**

```bash
npm install @resk/nativewind
# or
yarn add @resk/nativewind
# or
pnpm add @resk/nativewind
```

### **Basic Usage**

```tsx
import { Form } from '@resk/nativewind';

const MyForm = () => {
  const fields = {
    email: { 
      type: 'email', 
      name: 'email', 
      label: 'Email Address', 
      required: true 
    },
    password: { 
      type: 'password', 
      name: 'password', 
      label: 'Password', 
      required: true 
    }
  } as const;

  return (
    <Form
      name="login-form"
      fields={fields}
      onSubmit={async ({ data }) => {
        console.log('Form data:', data);
        // Handle form submission
      }}
    >
      {({ form, isSubmitting }) => (
        <Form.Action
          formName="login-form"
          disabled={!form.isValid() || isSubmitting}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Form.Action>
      )}
    </Form>
  );
};
```

---

## 📚 **Core Components**

### **🎯 Form Component**

The main form component that manages all form logic, validation, and state.

```tsx
interface IFormProps<Fields extends IFields = IFields> {
  name?: string;
  fields?: Fields;
  data?: IFormData;
  onSubmit?: (options: IFormSubmitOptions<Fields>) => any;
  validateBeforeFirstSubmit?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isLoading?: boolean;
  variant?: IFormVariant;
  renderFields?: (options: IFormRenderFieldOptions<Fields>) => ReactNode;
  renderField?: (field: IField, options: IFormRenderFieldOptions<Fields>) => ReactNode;
  // ... and many more props
}
```

**Key Props:**

- **`name`**: Unique form identifier for state management
- **`fields`**: Object defining all form fields with type safety
- **`data`**: Initial form data or data for editing
- **`onSubmit`**: Function called when form is submitted
- **`validateBeforeFirstSubmit`**: Enable validation before first submission
- **`renderFields`**: Custom function to render all fields
- **`renderField`**: Custom function to render individual fields

### **🎨 FormField Component**

Base component for all form fields with intelligent behavior adaptation.

```tsx
class FormField<FieldType extends IFieldType = IFieldType, ValueType = any> {
  // Field instance methods
  isValid(): boolean;
  getValue(): ValueType;
  setValue(value: ValueType): Promise<void>;
  focus(): void;
  getLabel(): string;
  getErrorText(): string;
  // ... and many more methods
}
```

**Key Features:**

- **Adaptive Behavior**: Automatically adapts to form context
- **Validation**: Built-in validation with custom rules
- **State Management**: Manages field-level state efficiently
- **Event Handling**: Comprehensive event system

### **🎭 FormFieldRenderer Component**

Smart field renderer that automatically resolves field types and applies configurations.

```tsx
function FormFieldRenderer<FieldType extends IFieldType, ValueType = any>(
  props: Omit<IField<FieldType, ValueType>, "ref"> & { 
    type: FieldType, 
    ref?: Ref<FormField<FieldType, ValueType>> 
  }
): JSX.Element | null;
```

**Adaptive Features:**

- **Context-Aware**: Detects form vs standalone usage
- **Mode-Sensitive**: Different configs for create/update/filter modes
- **Dynamic Configuration**: Smart field preparation with conditional properties
- **Event Integration**: Seamless event propagation

### **🔧 FormsManager Class**

Global form management utility for advanced form operations.

```tsx
class FormsManager {
  static getForm<Fields>(formName: string): IForm<Fields> | null;
  static getFieldInstance<T, ValueType>(formName: string, fieldName: string): FormField<T, ValueType> | null;
  static mountAction<Context>(action: IFormActionContext<Context>, formName: string): void;
  static toggleFormStatus(formName: string, callback?: Function): void;
  // ... and more methods
}
```

**Use Cases:**

- **Cross-Component Access**: Access forms from anywhere in your app
- **Field Manipulation**: Programmatically control field instances
- **Action Management**: Manage form actions and buttons
- **Status Tracking**: Monitor form validation status

### **🎬 FormAction Component**

Smart button component that integrates with form state for actions.

```tsx
interface IFormActionProps<FormFields extends IFields = IFields, Context = unknown> {
  formName: string;
  submitFormOnPress?: boolean;
  onPress?: (event: GestureResponderEvent, context: Context & { 
    form?: IForm<FormFields>, 
    formData?: IFormData<FormFields> 
  }) => any;
  // ... extends Button.Interactive props
}
```

**Smart Features:**

- **Form Integration**: Automatically connects to form state
- **Validation-Aware**: Enables/disables based on form validity
- **Submit Handling**: Optional automatic form submission
- **Context Access**: Access to form data and instance

---

## 🎨 **Styling & Variants**

### **Form Variants**

Built-in styling variants for consistent form appearance:

```tsx
type IFormVariant = 'default' | 'compact' | 'spacious' | 'minimal';

// Usage
<Form variant="compact" fields={fields} />
```

**Available Variants:**

- **`default`**: Standard spacing and styling
- **`compact`**: Reduced spacing for dense layouts
- **`spacious`**: Increased spacing for better readability
- **`minimal`**: Clean, minimal styling

### **Custom Styling**

```tsx
<Form
  className="my-custom-form"
  fieldContainerClassName="custom-field-spacing"
  fields={fields}
/>
```

**Styling Props:**

- **`className`**: Custom CSS classes for form container
- **`style`**: Inline styles for form container
- **`fieldContainerClassName`**: CSS classes for all field containers
- **`variant`**: Pre-defined styling variant

---

## 🔧 **Advanced Usage**

### **🎨 Custom Field Rendering**

**Individual Field Customization:**

```tsx
<Form
  fields={fields}
  renderField={(field, { form, data, isUpdate }) => {
    // Add validation indicators
    const fieldInstance = form.getFieldInstances()[field.name];
    const isValid = fieldInstance?.isValid();
    
    return (
      <div className={`field-wrapper ${isValid ? 'valid' : 'pending'}`}>
        <div className="flex items-center gap-2">
          <Form.FieldRenderer {...field} />
          {isValid && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
        </div>
        {field.helpText && (
          <p className="text-sm text-gray-600 mt-1">{field.helpText}</p>
        )}
      </div>
    );
  }}
/>
```

**Complete Layout Control:**

```tsx
<Form
  fields={fields}
  renderFields={({ fields, form, isUpdate, data }) => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <Form.FieldRenderer {...fields.firstName} />
        <Form.FieldRenderer {...fields.lastName} />
        <Form.FieldRenderer {...fields.email} />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Account Details</h3>
        <Form.FieldRenderer {...fields.username} />
        {!isUpdate && <Form.FieldRenderer {...fields.password} />}
        
        {form.isValid() && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-700">✓ All information is valid</p>
          </div>
        )}
      </div>
    </div>
  )}
/>
```

### **📊 Fragment Rendering for Tables**

Perfect for inline table editing:

```tsx
const UserTableRow = ({ user, onSave }) => (
  <tr>
    <Form
      asFragment={true}
      name={`user-row-${user.id}`}
      data={user}
      isUpdate={true}
      renderFields={({ fields }) => (
        <React.Fragment>
          <td className="px-4 py-2">
            <Form.FieldRenderer {...fields.name} />
          </td>
          <td className="px-4 py-2">
            <Form.FieldRenderer {...fields.email} />
          </td>
          <td className="px-4 py-2">
            <Form.FieldRenderer {...fields.role} />
          </td>
          <td className="px-4 py-2">
            <Form.Action
              formName={`user-row-${user.id}`}
              size="sm"
              variant="primary"
            >
              Save
            </Form.Action>
          </td>
        </React.Fragment>
      )}
      onSubmit={({ data }) => onSave(user.id, data)}
    />
  </tr>
);
```

### **🔄 Dynamic Field Configuration**

**Mode-Based Field Configuration:**

```tsx
const dynamicField = {
  type: 'text' as const,
  name: 'email',
  label: 'Email Address',
  required: true,
  primaryKey: true,
  
  // Applied only when creating new records
  forCreate: {
    placeholder: 'Enter your email address',
    helpText: 'This will be your unique identifier'
  },
  
  // Applied only when updating existing records
  forUpdate: {
    helpText: 'Email cannot be changed after registration',
    readOnly: true // Automatically set for primary keys
  },
  
  // Applied in both create and update modes
  forCreateOrUpdate: {
    validation: { format: 'email' },
    autoComplete: 'email'
  },
  
  // Applied when used as filter
  forFilter: {
    placeholder: 'Search by email...',
    debounce: 300,
    clearable: true
  }
};
```

**Dynamic Field Preparation:**

```tsx
<Form
  fields={fields}
  prepareFormField={(context) => {
    const { field, isUpdate, data } = context;
    
    // Dynamic field modification based on form state
    if (field.name === 'department' && data.role === 'admin') {
      return {
        ...field,
        options: adminDepartments,
        helpText: 'Admin can access all departments'
      };
    }
    
    if (field.name === 'salary' && !data.isManager) {
      return {
        ...field,
        readOnly: true,
        helpText: 'Salary can only be set by managers'
      };
    }
    
    return field;
  }}
/>
```

### **🎭 Multi-Step Forms**

```tsx
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  
  return (
    <Form
      name="multi-step-form"
      fields={allFields}
      renderFields={({ fields, form, data }) => (
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepNum <= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {stepNum}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <Form.FieldRenderer {...fields.firstName} />
              <Form.FieldRenderer {...fields.lastName} />
              <Form.FieldRenderer {...fields.email} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Account Details</h2>
              <Form.FieldRenderer {...fields.username} />
              <Form.FieldRenderer {...fields.password} />
              <Form.FieldRenderer {...fields.confirmPassword} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <Form.FieldRenderer {...fields.notifications} />
              <Form.FieldRenderer {...fields.theme} />
              
              {/* Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Review Your Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
                  <p><strong>Email:</strong> {data.email}</p>
                  <p><strong>Username:</strong> {data.username}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="secondary"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={!form.isValid()}
              >
                Next
              </Button>
            ) : (
              <Form.Action
                formName="multi-step-form"
                variant="primary"
                disabled={!form.isValid()}
              >
                Complete Registration
              </Form.Action>
            )}
          </div>
        </div>
      )}
    />
  );
};
```

---

## 🛡️ **Validation System**

### **Built-in Validation**

```tsx
const fields = {
  email: {
    type: 'email',
    name: 'email',
    label: 'Email Address',
    required: true,
    validationRules: [
      { type: 'email', message: 'Please enter a valid email address' },
      { type: 'required', message: 'Email is required' }
    ]
  },
  password: {
    type: 'password',
    name: 'password',
    label: 'Password',
    required: true,
    validationRules: [
      { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
      { type: 'pattern', value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain uppercase, lowercase, and number' }
    ]
  }
} as const;
```

### **Custom Validation**

```tsx
const customValidationField = {
  type: 'text',
  name: 'username',
  label: 'Username',
  validationRules: [
    {
      type: 'custom',
      validate: async (value: string) => {
        const response = await checkUsernameAvailability(value);
        return response.available;
      },
      message: 'Username is already taken'
    }
  ]
};
```

### **Form-Level Validation Events**

```tsx
<Form
  fields={fields}
  onFormValid={(options) => {
    console.log('✅ Form is valid');
    // Enable submit button, remove error banners, etc.
  }}
  onFormInvalid={(options) => {
    console.log('❌ Form has errors:', options.context.getErrorText());
    // Show error summary, highlight invalid fields, etc.
  }}
  onValidateField={(options) => {
    console.log('🔁 Field became valid:', options.fieldName);
    // Individual field success feedback
  }}
  onInvalidateField={(options) => {
    console.log('⚠️ Field became invalid:', options.fieldName, options.errors);
    // Individual field error feedback
  }}
/>
```

### **Validation Timing Control**

```tsx
<Form
  fields={fields}
  validateBeforeFirstSubmit={true} // Enable validation before first submission
  onSubmit={({ data, form }) => {
    // Form data is guaranteed to be valid here
    console.log('Submitting valid data:', data);
  }}
/>
```

---

## ⌨️ **Keyboard Navigation**

### **Built-in Keyboard Support**

The form system provides comprehensive keyboard navigation:

- **Tab/Shift+Tab**: Navigate between fields
- **Enter**: Submit form (when valid) or move to next field
- **Escape**: Clear field or cancel operation
- **Arrow Keys**: Navigate within multi-option fields

### **Custom Keyboard Handlers**

```tsx
<Form
  fields={fields}
  onFormKeyEvent={({ key, form, formData }) => {
    if (key === 'ctrl+s') {
      // Save draft
      saveDraft(formData);
    }
    if (key === 'ctrl+enter') {
      // Force submit
      form.submit();
    }
  }}
  onEnterKeyPress={({ form }) => {
    // Custom enter key behavior
    if (form.isValid()) {
      // Allow default submission
      return true;
    } else {
      // Prevent submission and show errors
      showValidationSummary();
      return false;
    }
  }}
/>
```

### **Field-Level Keyboard Events**

```tsx
const fieldWithKeyboardHandling = {
  type: 'text',
  name: 'search',
  label: 'Search',
  onKeyEvent: ({ key, value, form }) => {
    if (key === 'escape') {
      // Clear search
      form.getFieldInstance('search')?.setValue('');
    }
    if (key === 'enter') {
      // Trigger search
      performSearch(value);
    }
  }
};
```

---

## ♿ **Accessibility**

### **WCAG 2.1 AA Compliance**

The form system is fully accessible with:

- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Logical focus order and visual indicators
- **Error Announcements**: Screen reader announcements for validation errors
- **High Contrast**: Support for high contrast modes

### **Accessibility Best Practices**

```tsx
const accessibleFields = {
  email: {
    type: 'email',
    name: 'email',
    label: 'Email Address',
    required: true,
    // Automatic ARIA attributes
    'aria-describedby': 'email-help',
    'aria-required': 'true',
    helpText: 'We will use this to contact you'
  },
  password: {
    type: 'password',
    name: 'password',
    label: 'Password',
    required: true,
    // Accessibility-friendly error handling
    'aria-invalid': false, // Updated automatically based on validation
    'aria-describedby': 'password-requirements'
  }
} as const;

<Form
  fields={accessibleFields}
  // Accessible form submission feedback
  onSubmit={async ({ data }) => {
    announceToScreenReader('Form submitted successfully');
    await submitData(data);
  }}
/>
```

---

## 🔄 **State Management**

### **Form State Access**

```tsx
const MyForm = () => {
  const formRef = useRef<IFormContext<typeof fields>>(null);
  
  useEffect(() => {
    // Access form state
    const form = formRef.current?.form;
    if (form) {
      console.log('Form is valid:', form.isValid());
      console.log('Form data:', form.getData());
      console.log('Submit count:', form.getSubmitCount());
      console.log('Invalid attempts:', form.getInvalidSubmitCount());
    }
  }, []);

  return (
    <Form
      ref={formRef}
      fields={fields}
      onSubmit={({ data, isUpdate, form }) => {
        console.log('Submission data:', data);
        console.log('Is update mode:', isUpdate);
        console.log('Form instance:', form);
      }}
    >
      {({ form, isSubmitting, errors, submitCount }) => (
        <div>
          <p>Submission attempts: {submitCount}</p>
          <p>Form status: {form.isValid() ? 'Valid' : 'Invalid'}</p>
          {errors.length > 0 && (
            <ul className="text-red-600">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          
          <Form.Action
            formName="my-form"
            disabled={!form.isValid() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Form.Action>
        </div>
      )}
    </Form>
  );
};
```

### **Cross-Component Form Access**

```tsx
// Access form from anywhere in your app
const SomeOtherComponent = () => {
  const handleExternalSave = () => {
    const form = FormsManager.getForm('my-form');
    if (form?.isValid()) {
      form.submit();
    } else {
      alert('Please complete all required fields');
    }
  };

  return (
    <Button onClick={handleExternalSave}>
      Save from External Component
    </Button>
  );
};
```

### **Field Instance Manipulation**

```tsx
const AdvancedFormControls = () => {
  const focusField = (fieldName: string) => {
    const field = FormsManager.getFieldInstance('my-form', fieldName);
    field?.focus();
  };

  const clearField = (fieldName: string) => {
    const field = FormsManager.getFieldInstance('my-form', fieldName);
    field?.setValue('');
  };

  const validateField = (fieldName: string) => {
    const field = FormsManager.getFieldInstance('my-form', fieldName);
    field?.validate({ value: field.getValue() });
  };

  return (
    <div className="form-controls">
      <Button onClick={() => focusField('email')}>Focus Email</Button>
      <Button onClick={() => clearField('password')}>Clear Password</Button>
      <Button onClick={() => validateField('email')}>Validate Email</Button>
    </div>
  );
};
```

---

## 🎭 **Rendering Customization**

### **Complete Layout Control with renderFields**

```tsx
const CustomLayoutForm = () => (
  <Form
    name="custom-layout"
    fields={fields}
    renderFields={({ fields, form, isUpdate, data, disabled }) => (
      <div className="custom-form-layout">
        {/* Header Section */}
        <div className="form-header bg-gray-50 p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">
            {isUpdate ? 'Edit Profile' : 'Create Profile'}
          </h2>
          <p className="text-gray-600 mt-2">
            Please fill in your information below
          </p>
        </div>

        {/* Main Content */}
        <div className="form-content p-6">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className={`step ${form.getFieldInstances().email?.isValid() ? 'completed' : 'active'}`}>
                1. Contact
              </div>
              <div className={`step ${form.getFieldInstances().name?.isValid() ? 'completed' : ''}`}>
                2. Personal
              </div>
              <div className="step">3. Preferences</div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="field-group">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ContactIcon className="mr-2" />
                  Contact Information
                </h3>
                <Form.FieldRenderer {...fields.email} />
                <Form.FieldRenderer {...fields.phone} />
              </div>

              <div className="field-group">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <LocationIcon className="mr-2" />
                  Address
                </h3>
                <Form.FieldRenderer {...fields.address} />
                <div className="grid grid-cols-2 gap-4">
                  <Form.FieldRenderer {...fields.city} />
                  <Form.FieldRenderer {...fields.zipCode} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="field-group">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PersonIcon className="mr-2" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Form.FieldRenderer {...fields.firstName} />
                  <Form.FieldRenderer {...fields.lastName} />
                </div>
                <Form.FieldRenderer {...fields.dateOfBirth} />
              </div>

              {/* Conditional Section */}
              {data.accountType === 'business' && (
                <div className="field-group">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BusinessIcon className="mr-2" />
                    Business Information
                  </h3>
                  <Form.FieldRenderer {...fields.companyName} />
                  <Form.FieldRenderer {...fields.taxId} />
                </div>
              )}

              {/* Status Panel */}
              <div className="status-panel p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Form Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Validation Status:</span>
                    <span className={form.isValid() ? 'text-green-600' : 'text-orange-600'}>
                      {form.isValid() ? '✓ Valid' : '⚠ Incomplete'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fields Completed:</span>
                    <span>{getCompletedFieldsCount(form)} / {getTotalFieldsCount(fields)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Summary */}
          {!form.isValid() && form.getInvalidSubmitCount() > 0 && (
            <div className="validation-summary mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Please fix the following issues:</h4>
              <ul className="space-y-1">
                {form.getErrors().map((error, index) => (
                  <li key={index} className="text-red-700 text-sm">• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="form-footer bg-gray-50 p-6 rounded-b-lg flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isUpdate ? 'Last updated: ' + new Date().toLocaleDateString() : 'All fields are required unless marked optional'}
          </div>
          
          <div className="flex space-x-4">
            <Button variant="secondary" disabled={disabled}>
              Save Draft
            </Button>
            <Form.Action
              formName="custom-layout"
              variant="primary"
              disabled={!form.isValid() || disabled}
            >
              {isUpdate ? 'Update Profile' : 'Create Profile'}
            </Form.Action>
          </div>
        </div>
      </div>
    )}
    onSubmit={async ({ data, isUpdate }) => {
      await (isUpdate ? updateProfile(data) : createProfile(data));
    }}
  />
);
```

### **Individual Field Enhancement with renderField**

```tsx
const EnhancedFieldForm = () => (
  <Form
    name="enhanced-fields"
    fields={fields}
    renderField={(field, { form, data, isUpdate }) => {
      const fieldInstance = form.getFieldInstances()[field.name];
      const isValid = fieldInstance?.isValid();
      const hasError = fieldInstance?.getErrorText();
      
      return (
        <div className={`enhanced-field ${field.type} ${isValid ? 'field-valid' : hasError ? 'field-error' : 'field-pending'}`}>
          {/* Field Label with Requirements */}
          <div className="field-header flex items-center justify-between mb-2">
            <label className="field-label flex items-center">
              {getFieldIcon(field.type)}
              <span className="ml-2 font-medium">{field.label}</span>
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {/* Validation Status Indicator */}
            <div className="validation-indicator">
              {isValid && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
              {hasError && <ExclamationCircleIcon className="w-5 h-5 text-red-500" />}
              {!isValid && !hasError && <ClockIcon className="w-5 h-5 text-gray-400" />}
            </div>
          </div>

          {/* Field Input */}
          <div className="field-input-wrapper relative">
            <Form.FieldRenderer {...field} />
            
            {/* Field-specific enhancements */}
            {field.type === 'password' && (
              <PasswordStrengthIndicator value={fieldInstance?.getValue()} />
            )}
            
            {field.type === 'email' && isValid && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckIcon className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>

          {/* Help Text and Error Messages */}
          <div className="field-footer mt-2">
            {field.helpText && !hasError && (
              <p className="text-sm text-gray-600 flex items-center">
                <InfoIcon className="w-4 h-4 mr-1" />
                {field.helpText}
              </p>
            )}
            
            {hasError && (
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>

          {/* Field Metadata (for debugging) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
                {JSON.stringify({
                  name: field.name,
                  type: field.type,
                  value: fieldInstance?.getValue(),
                  isValid,
                  hasValidated: fieldInstance?.hasValidated(),
                  isFormField: !!form
                }, null, 2)}
              </pre>
            </details>
          )}
        </div>
      );
    }}
  />
);
```

---

## 📊 **Performance Optimization**

### **Memoization Best Practices**

```tsx
// ✅ Good: Stable field definitions
const stableFields = useMemo(() => ({
  email: { type: 'email', name: 'email', label: 'Email', required: true },
  password: { type: 'password', name: 'password', label: 'Password', required: true }
}), []); // Empty dependency array for static fields

// ✅ Good: Memoized event handlers
const handleSubmit = useCallback(async ({ data }) => {
  await submitData(data);
}, []);

// ✅ Good: Memoized field preparation
const prepareField = useCallback((context) => {
  const { field, data } = context;
  if (field.name === 'department' && data.role === 'admin') {
    return { ...field, options: adminDepartments };
  }
  return field;
}, [adminDepartments]);

<Form
  fields={stableFields}
  onSubmit={handleSubmit}
  prepareFormField={prepareField}
/>
```

### **Field-Level Performance**

```tsx
// ✅ Good: Memoized custom field components
const CustomFieldComponent = React.memo<IFormFieldProps>(({ 
  name, 
  value, 
  onChange 
}) => {
  const expensiveValue = useMemo(() => 
    computeExpensiveValue(value), 
    [value]
  );

  return (
    <div>
      <input 
        value={value} 
        onChange={onChange}
        placeholder={expensiveValue}
      />
    </div>
  );
});

// Register the optimized component
FormField.registerComponent('custom', CustomFieldComponent);
```

### **Large Form Optimization**

```tsx
// ✅ Good: Virtualized large forms
const LargeForm = () => {
  const [visibleFields, setVisibleFields] = useState(fields.slice(0, 10));
  
  const loadMoreFields = useCallback(() => {
    setVisibleFields(prev => [
      ...prev,
      ...fields.slice(prev.length, prev.length + 10)
    ]);
  }, []);

  return (
    <Form
      fields={visibleFields}
      renderFields={({ fields }) => (
        <div>
          {Object.entries(fields).map(([name, field]) => (
            <Form.FieldRenderer key={name} {...field} />
          ))}
          
          {visibleFields.length < fields.length && (
            <Button onClick={loadMoreFields}>
              Load More Fields
            </Button>
          )}
        </div>
      )}
    />
  );
};
```

### **Bundle Size Optimization**

```tsx
// ✅ Good: Tree-shakable imports
import { Form } from '@resk/nativewind/Form';
import { FormsManager } from '@resk/nativewind/Form/FormsManager';

// ❌ Avoid: Full library imports
// import * as ReskComponents from '@resk/nativewind';
```

---

## 🧪 **Testing**

### **Unit Testing Form Components**

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Form } from '@resk/nativewind';

describe('Form Component', () => {
  const mockFields = {
    email: {
      type: 'email' as const,
      name: 'email',
      label: 'Email',
      required: true
    },
    password: {
      type: 'password' as const,
      name: 'password',
      label: 'Password',
      required: true
    }
  };

  it('should render form fields correctly', () => {
    render(
      <Form
        name="test-form"
        fields={mockFields}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });

  it('should validate required fields', async () => {
    const onSubmit = jest.fn();
    
    render(
      <Form
        name="test-form"
        fields={mockFields}
        onSubmit={onSubmit}
      >
        {({ form }) => (
          <Form.Action formName="test-form">
            Submit
          </Form.Action>
        )}
      </Form>
    );

    const submitButton = screen.getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/email.*required/i)).toBeTruthy();
    });
  });

  it('should submit valid form data', async () => {
    const onSubmit = jest.fn();
    
    render(
      <Form
        name="test-form"
        fields={mockFields}
        onSubmit={onSubmit}
      >
        {({ form }) => (
          <Form.Action formName="test-form">
            Submit
          </Form.Action>
        )}
      </Form>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'password123'
        },
        isUpdate: false,
        form: expect.any(Object)
      });
    });
  });
});
```

### **Integration Testing**

```tsx
describe('Form Integration', () => {
  it('should integrate with external form management', async () => {
    const { getByTestId } = render(
      <div>
        <Form name="integration-form" fields={mockFields} />
        
        <Button
          testID="external-submit"
          onPress={() => {
            const form = FormsManager.getForm('integration-form');
            form?.submit();
          }}
        >
          External Submit
        </Button>
      </div>
    );

    // Fill form data
    // ...

    const externalButton = getByTestId('external-submit');
    fireEvent.press(externalButton);

    // Assert form submission
    // ...
  });
});
```

### **Testing Custom Renderers**

```tsx
describe('Custom Field Rendering', () => {
  it('should render custom field layout', () => {
    const customRenderField = jest.fn((field) => (
      <div testID={`custom-${field.name}`}>
        <Form.FieldRenderer {...field} />
      </div>
    ));

    render(
      <Form
        name="custom-render-form"
        fields={mockFields}
        renderField={customRenderField}
      />
    );

    expect(customRenderField).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('custom-email')).toBeTruthy();
    expect(screen.getByTestId('custom-password')).toBeTruthy();
  });
});
```

---

## 📖 **API Reference**

### **Form Component**

```tsx
interface IFormProps<Fields extends IFields = IFields> {
  // Core Props
  name?: string;
  fields?: Fields;
  data?: IFormData<Fields>;
  onSubmit?: (options: IFormSubmitOptions<Fields>) => any;
  
  // Validation Props
  validateBeforeFirstSubmit?: boolean;
  onFormValid?: (options: IFormFieldValidateOptions<IFieldType>) => any;
  onFormInvalid?: (options: IFormFieldValidateOptions<IFieldType>) => any;
  onValidateField?: (options: IFormFieldValidateOptions<IFieldType>) => any;
  onInvalidateField?: (options: IFormFieldValidateOptions<IFieldType>) => any;
  
  // State Props
  disabled?: boolean;
  readOnly?: boolean;
  isLoading?: boolean;
  isUpdate?: boolean;
  isEditingData?: (options: {data: IFormData<Fields>, primaryKeys: IFieldName<Fields>[]}) => boolean;
  
  // Rendering Props
  renderFields?: (options: IFormRenderFieldOptions<Fields>) => ReactNode;
  renderField?: (field: IField, options: IFormRenderFieldOptions<Fields>) => ReactNode;
  renderSkeleton?: (context: IFormContext<Fields>) => ReactNode;
  header?: ReactNode | ((context: IFormContext<Fields>) => ReactNode);
  children?: ReactNode | ((context: IFormContext<Fields>) => ReactNode);
  
  // Styling Props
  variant?: IFormVariant;
  className?: IClassName;
  style?: React.CSSProperties;
  fieldContainerClassName?: IClassName;
  asHtmlTag?: string;
  asFragment?: boolean;
  
  // Event Props
  onFormKeyEvent?: (options: IFormKeyboardEventHandlerOptions) => any;
  onEnterKeyPress?: (options: IFormKeyboardEventHandlerOptions) => any;
  
  // Advanced Props
  beforeSubmit?: (options: IFormSubmitOptions<Fields>) => any;
  prepareFormField?: (formContext: IFormContext<Fields> & {field: IField}) => IField | null;
  
  // Misc Props
  testID?: string;
  ref?: React.Ref<IFormContext<Fields>>;
}
```

### **IForm Interface**

```tsx
interface IForm<Fields extends IFields = IFields> extends IObservable<IFormEvent> {
  // State Methods
  getName(): IFieldName<Fields>;
  isValid(): boolean;
  isEditing(): boolean;
  getData(): IFormData;
  getFieldInstances(): Record<IFieldName<Fields>, FormField>;
  isSubmitting(): boolean;
  isLoading(): boolean;
  
  // Validation Methods
  getErrors(): string[];
  getErrorText(): string;
  shouldValidateBeforeFirstSubmit(): boolean;
  
  // Statistics Methods
  getSubmitCount(): number;
  getInvalidSubmitCount(): number;
  getPrimaryKeys(): IFieldName<Fields>[];
  
  // Actions
  submit(): Promise<any>;
}
```

### **FormField Class**

```tsx
class FormField<FieldType extends IFieldType = IFieldType, ValueType = any> {
  // State Methods
  isValid(): boolean;
  getValue(): ValueType;
  setValue(value: ValueType): Promise<IFormFieldValidateOptions<FieldType, ValueType>>;
  hasValidated(): boolean;
  canDisplayError(): boolean;
  
  // Form Integration
  getName(): string;
  getLabel(): string;
  getErrorText(): string;
  getForm<Fields extends IFields = IFields>(): IForm<Fields> | null;
  getFormName(): string;
  
  // UI Methods
  focus(): void;
  focusNextField(): void;
  focusPrevField(): void;
  
  // Validation
  validate(options: { value: ValueType }): Promise<IFormFieldValidateOptions<FieldType, ValueType>>;
  canValidate(): boolean;
  
  // State Checks
  isFormLoading(): boolean;
  isFormSubmitting(): boolean;
  isTextField(): boolean;
  
  // Event Handling
  onKeyEvent(key: IKeyboardEventHandlerKey, event: IKeyboardEventHandlerEvent): void;
  
  // Lifecycle
  componentDidMount(): void;
  componentWillUnmount(): void;
  
  // Static Methods
  static registerComponent<FieldType extends IFieldType, ValueType = any>(
    type: FieldType, 
    component: IFormFieldComponent<FieldType, ValueType>
  ): void;
  static getRegisteredComponent<FieldType extends IFieldType, ValueType = any>(
    type: IFieldType
  ): IFormFieldComponent<FieldType, ValueType>;
  static getRegisteredComponents(): Record<IFieldType, typeof FormField>;
}
```

### **FormsManager Class**

```tsx
class FormsManager {
  // Form Management
  static mountForm(formInstance?: IForm): void;
  static unmountForm(formName?: string): void;
  static getForm<Fields extends IFields = IFields>(formName?: string): IForm<Fields> | null;
  
  // Field Management
  static getFieldInstances<Fields extends IFields = IFields>(formName: string): Record<IFieldName<Fields>, FormField>;
  static getFieldInstance<T extends IFieldType = IFieldType, ValueType = any>(
    formName?: string, 
    fieldName?: string
  ): FormField<T, ValueType> | null;
  
  // Action Management
  static mountAction<Context = unknown>(action: IFormActionContext<Context>, formName: string): void;
  static unmountAction(actionId: string, formName?: string): void;
  static getActions(formName: string): {[actionId: string]: IFormActionContext<unknown>};
  
  // Validation
  static toggleFormStatus(formName: string, callback?: (options: {isValid: boolean, form: IForm}) => void): void;
  
  // Type Guards
  static isField<FieldType extends IFieldType = IFieldType, ValueType = any>(field: any): field is FormField<FieldType, ValueType>;
  static isForm<Fields extends IFields = IFields>(form: any): form is IForm<Fields>;
}
```

---

## ❓ **FAQ**

### **Q: How do I create custom field types?**

```tsx
// 1. Create your custom field component
class ColorPickerField extends FormField<'colorPicker', string> {
  render() {
    return (
      <div className="color-picker-field">
        <input
          type="color"
          value={this.getValue() || '#000000'}
          onChange={(e) => this.setValue(e.target.value)}
        />
      </div>
    );
  }
}

// 2. Register the component
FormField.registerComponent('colorPicker', ColorPickerField);

// 3. Use in your form
const fields = {
  backgroundColor: {
    type: 'colorPicker' as const,
    name: 'backgroundColor',
    label: 'Background Color'
  }
};
```

### **Q: How do I handle file uploads?**

```tsx
const fileUploadField = {
  type: 'file',
  name: 'avatar',
  label: 'Profile Picture',
  accept: 'image/*',
  multiple: false,
  onChange: async (options) => {
    const file = options.value;
    if (file) {
      const uploadedUrl = await uploadFile(file);
      options.context.setValue(uploadedUrl);
    }
  }
};
```

### **Q: How do I implement conditional field visibility?**

```tsx
<Form
  fields={fields}
  renderField={(field, { data }) => {
    // Hide advanced options unless enabled
    if (field.name === 'advancedSettings' && !data.enableAdvanced) {
      return null;
    }
    
    // Show different fields based on user type
    if (field.name === 'companyName' && data.userType !== 'business') {
      return null;
    }
    
    return <Form.FieldRenderer {...field} />;
  }}
/>
```

### **Q: How do I persist form data across page reloads?**

```tsx
const PersistentForm = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('form-draft');
    return saved ? JSON.parse(saved) : {};
  });

  return (
    <Form
      name="persistent-form"
      fields={fields}
      data={formData}
      onFormKeyEvent={({ formData }) => {
        // Auto-save on every change
        localStorage.setItem('form-draft', JSON.stringify(formData));
      }}
      onSubmit={({ data }) => {
        // Clear draft on successful submission
        localStorage.removeItem('form-draft');
        return submitData(data);
      }}
    />
  );
};
```

### **Q: How do I handle server-side validation errors?**

```tsx
const ServerValidatedForm = () => {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  return (
    <Form
      fields={fields}
      onSubmit={async ({ data }) => {
        try {
          await submitData(data);
          setServerErrors({});
        } catch (error) {
          if (error.status === 422) {
            // Handle validation errors from server
            setServerErrors(error.fieldErrors);
          }
        }
      }}
      renderField={(field, options) => (
        <div>
          <Form.FieldRenderer {...field} />
          {serverErrors[field.name] && (
            <div className="text-red-600 text-sm mt-1">
              {serverErrors[field.name]}
            </div>
          )}
        </div>
      )}
    />
  );
};
```

### **Q: How do I implement real-time validation?**

```tsx
const realTimeValidationField = {
  type: 'text',
  name: 'username',
  label: 'Username',
  validateOnChange: true, // Enable real-time validation
  validationRules: [
    {
      type: 'custom',
      validate: async (value: string) => {
        if (value.length < 3) return false;
        
        // Debounced server check
        const available = await checkUsernameAvailability(value);
        return available;
      },
      message: 'Username is not available'
    }
  ]
};
```

### **Q: How do I create wizard/multi-step forms?**

```tsx
const WizardForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({});

  const steps = [
    { name: 'Personal', fields: personalFields },
    { name: 'Contact', fields: contactFields },
    { name: 'Preferences', fields: preferencesFields }
  ];

  return (
    <div className="wizard-form">
      {/* Step Navigation */}
      <div className="step-navigation">
        {steps.map((step, index) => (
          <div
            key={step.name}
            className={`step ${index + 1 <= currentStep ? 'active' : ''}`}
          >
            {step.name}
          </div>
        ))}
      </div>

      {/* Current Step Form */}
      <Form
        name={`wizard-step-${currentStep}`}
        fields={steps[currentStep - 1].fields}
        data={wizardData}
        onSubmit={({ data }) => {
          const newData = { ...wizardData, ...data };
          setWizardData(newData);
          
          if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
          } else {
            // Final submission
            submitWizardData(newData);
          }
        }}
      >
        {({ form }) => (
          <div className="wizard-actions">
            {currentStep > 1 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            
            <Form.Action
              formName={`wizard-step-${currentStep}`}
              disabled={!form.isValid()}
            >
              {currentStep < steps.length ? 'Next' : 'Submit'}
            </Form.Action>
          </div>
        )}
      </Form>
    </div>
  );
};
```

---

## 🎉 **Conclusion**

The Resk Form System provides everything you need to build sophisticated, accessible, and performant forms for your React Native and Web applications. With its type-safe API, extensive customization options, and comprehensive feature set, you can create forms that provide an excellent user experience while maintaining clean, maintainable code.

### **Key Takeaways:**

- **🎯 Start Simple**: Begin with basic forms and gradually add complexity
- **🔥 Leverage TypeScript**: Use the full power of type safety for better development experience
- **⚡ Optimize Performance**: Follow memoization best practices for large forms
- **🎨 Customize Wisely**: Use `renderField` for simple customizations, `renderFields` for complex layouts
- **🛡️ Validate Early**: Implement proper validation for better user experience
- **♿ Stay Accessible**: Always consider accessibility in your form implementations

### **Next Steps:**

1. **Explore Examples**: Check out the example implementations in this guide
2. **Read API Documentation**: Dive deeper into the complete API reference
3. **Build Custom Components**: Create your own field types for specific use cases
4. **Contribute**: Help improve the library by reporting issues or contributing features

---

*Happy form building! 🚀*

---

**For more information, visit:**
- [GitHub Repository](https://github.com/boris-fouomene/reskit)
- [Documentation Site](https://reskit.dev)
- [API Reference](https://reskit.dev/api)

**Need help?**
- [Issue Tracker](https://github.com/boris-fouomene/reskit/issues)
- [Discussion Forum](https://github.com/boris-fouomene/reskit/discussions)
- [Discord Community](https://discord.gg/reskit)
