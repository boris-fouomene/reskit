# Form.Action Component - Comprehensive User Guide

> **🎯 Smart Form-Integrated Button Component**  
> Form.Action extends Button.Interactive with intelligent form integration, automatic validation-based state management, and seamless submission handling.

---

## 📋 **Table of Contents**

1. [Quick Start](#-quick-start)
2. [Core Architecture](#-core-architecture)
3. [Integration Patterns](#-integration-patterns)
4. [Advanced Features](#-advanced-features)
5. [State Management](#-state-management)
6. [Best Practices](#-best-practices)
7. [TypeScript Integration](#-typescript-integration)
8. [Troubleshooting](#-troubleshooting)

---

## 🚀 **Quick Start**

### Basic Usage

```tsx
import { Form } from '@resk/nativewind';

// Simple form submission button
<Form name="user-form" fields={fields}>
  <Form.Action formName="user-form">
    Submit
  </Form.Action>
</Form>
```

### Key Features at a Glance

- **🔗 Form Binding**: Automatically connects to form state via `formName`
- **⚡ Auto Submit**: Built-in form submission with `submitFormOnPress`
- **🔄 State Sync**: Real-time enable/disable based on form validation
- **🎛️ Button Integration**: Full Button.Interactive functionality
- **🧠 Smart Context**: Access to form data and state in callbacks

---

## 🏗️ **Core Architecture**

### Component Hierarchy

```
Form.Action (FormAction)
├── Button.Interactive (Base button component)
├── FormsManager Integration (Action registry)
├── Form State Synchronization
└── Context Enhancement (Form data access)
```

### TypeScript Interface

```tsx
interface IFormActionProps<FormFields extends IFields = IFields, Context = unknown> 
  extends Omit<IButtonInteractiveProps<Context>, "onPress"> {
  
  // Required Props
  formName: string;                    // Form to bind to
  
  // Optional Props  
  submitFormOnPress?: boolean;         // Auto-submit on press (default: true)
  onPress?: (event: GestureResponderEvent, context: Context & {
    form?: IForm<FormFields>;          // Form instance
    formData?: IFormData<FormFields>;  // Current form data
  }) => any;
  
  // Inherited from Button.Interactive
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  // ... all other button props
}
```

---

## 🔌 **Integration Patterns**

### 1. Basic Form Submission

```tsx
const LoginForm = () => {
  const fields = {
    email: { type: 'email', name: 'email', required: true },
    password: { type: 'password', name: 'password', required: true }
  } as const;

  return (
    <Form 
      name="login-form" 
      fields={fields}
      onSubmit={({ data }) => console.log('Login:', data)}
    >
      {/* Action automatically submits when form is valid */}
      <Form.Action formName="login-form" variant="primary">
        Login
      </Form.Action>
    </Form>
  );
};
```

### 2. Custom Submit Logic

```tsx
const CustomSubmitForm = () => (
  <Form name="custom-form" fields={fields}>
    <Form.Action 
      formName="custom-form"
      submitFormOnPress={false}  // Disable auto-submit
      onPress={(event, { form, formData }) => {
        if (form?.isValid()) {
          console.log('Custom submit logic:', formData);
          // Custom processing...
          form.submit(); // Manual submit when ready
        }
      }}
    >
      Custom Submit
    </Form.Action>
  </Form>
);
```

### 3. Multiple Actions per Form

```tsx
const MultiActionForm = () => (
  <Form name="multi-action-form" fields={fields}>
    {/* Primary submit action */}
    <Form.Action formName="multi-action-form" variant="primary">
      Save
    </Form.Action>
    
    {/* Secondary action with custom logic */}
    <Form.Action 
      formName="multi-action-form" 
      variant="secondary"
      submitFormOnPress={false}
      onPress={(event, { form, formData }) => {
        // Save as draft logic
        console.log('Saving draft...', formData);
      }}
    >
      Save as Draft
    </Form.Action>
    
    {/* Validation check action */}
    <Form.Action 
      formName="multi-action-form" 
      variant="outline"
      submitFormOnPress={false}
      onPress={(event, { form }) => {
        const isValid = form?.isValid();
        alert(`Form is ${isValid ? 'valid' : 'invalid'}`);
      }}
    >
      Check Validation
    </Form.Action>
  </Form>
);
```

### 4. Conditional Rendering with State

```tsx
const ConditionalActionForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <Form 
      name="conditional-form" 
      fields={fields}
      isUpdate={isEditing}
    >
      {isEditing ? (
        <div className="flex gap-2">
          <Form.Action formName="conditional-form" variant="primary">
            Update
          </Form.Action>
          <Button 
            variant="secondary" 
            onPress={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Form.Action 
          formName="conditional-form"
          submitFormOnPress={false}
          onPress={() => setIsEditing(true)}
        >
          Edit
        </Form.Action>
      )}
    </Form>
  );
};
```

---

## ⚡ **Advanced Features**

### 1. Form State Integration

```tsx
const StateAwareActions = () => (
  <Form name="state-aware-form" fields={fields}>
    <Form.Action 
      formName="state-aware-form"
      onPress={(event, { form, formData }) => {
        // Access complete form state
        console.log('Form valid:', form?.isValid());
        console.log('Submit count:', form?.getSubmitCount?.());
        console.log('Field instances:', form?.getFieldInstances?.());
        console.log('Current data:', formData);
        
        // Conditional logic based on form state
        if (form?.getSubmitCount?.() > 0) {
          console.log('This is a re-submission');
        }
      }}
    >
      Smart Submit
    </Form.Action>
  </Form>
);
```

### 2. Dynamic Button Content

```tsx
const DynamicContentAction = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <Form 
      name="dynamic-form" 
      fields={fields}
      onSubmit={async ({ data }) => {
        setIsSubmitting(true);
        try {
          await saveData(data);
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <Form.Action 
        formName="dynamic-form"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={(event, { form }) => {
          if (!form?.isValid()) {
            toast.error('Please fix form errors');
            return false; // Prevent submission
          }
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Form.Action>
    </Form>
  );
};
```

### 3. Action Validation Integration

```tsx
const ValidationIntegratedAction = () => (
  <Form 
    name="validation-form" 
    fields={fields}
    validateBeforeFirstSubmit={true}
  >
    <Form.Action 
      formName="validation-form"
      onPress={(event, { form, formData }) => {
        // Custom validation before submit
        const emailField = form?.getFieldInstances?.().email;
        const emailValue = emailField?.getValue?.();
        
        if (emailValue?.includes('test')) {
          toast.error('Test emails not allowed in production');
          return false; // Cancel submission
        }
        
        // Additional validation...
        console.log('All validations passed');
      }}
    >
      Submit with Validation
    </Form.Action>
  </Form>
);
```

### 4. Error Handling Integration

```tsx
const ErrorHandlingAction = () => (
  <Form 
    name="error-form" 
    fields={fields}
    onSubmit={async ({ data }) => {
      try {
        await submitData(data);
        toast.success('Data saved successfully');
      } catch (error) {
        toast.error('Failed to save data');
        throw error; // Re-throw to trigger form error state
      }
    }}
  >
    <Form.Action 
      formName="error-form"
      onPress={(event, { form }) => {
        // Pre-submission error check
        const errors = form?.getErrors?.();
        if (errors?.length > 0) {
          console.log('Form has errors:', errors);
          toast.error('Please fix the following errors: ' + errors.join(', '));
          return false;
        }
      }}
    >
      Submit with Error Handling
    </Form.Action>
  </Form>
);
```

---

## 🔄 **State Management**

### Automatic State Synchronization

Form.Action automatically manages its enabled/disabled state based on form validation:

```tsx
// Action automatically becomes:
// - DISABLED when form is invalid (after first submit attempt)
// - ENABLED when form becomes valid
// - Responds to real-time validation changes

<Form 
  name="auto-state-form" 
  fields={fields}
  validateBeforeFirstSubmit={true}  // Actions disabled until valid
>
  <Form.Action formName="auto-state-form">
    {/* Automatically disabled until form is valid */}
    Auto-Managed Submit
  </Form.Action>
</Form>
```

### Manual State Override

```tsx
const ManualStateAction = () => {
  const [customDisabled, setCustomDisabled] = useState(false);
  
  return (
    <Form name="manual-state-form" fields={fields}>
      <Form.Action 
        formName="manual-state-form"
        disabled={customDisabled}  // Manual override
        onPress={(event, { form }) => {
          if (someCustomCondition()) {
            setCustomDisabled(true);
            setTimeout(() => setCustomDisabled(false), 2000);
          }
        }}
      >
        Manual State Control
      </Form.Action>
    </Form>
  );
};
```

### State Monitoring

```tsx
const StateMonitoringAction = () => (
  <Form name="monitoring-form" fields={fields}>
    <Form.Action 
      formName="monitoring-form"
      onPress={(event, { form }) => {
        // Monitor action lifecycle
        console.log('Action pressed');
        console.log('Form validation state:', form?.isValid());
        console.log('Form submit count:', form?.getSubmitCount?.());
        
        // Access action's own state
        const actionElement = event.currentTarget;
        console.log('Action enabled:', !actionElement.disabled);
      }}
    >
      State Monitor
    </Form.Action>
  </Form>
);
```

---

## 🎯 **Best Practices**

### 1. **Form Binding**

```tsx
// ✅ Good: Consistent naming
<Form name="user-registration">
  <Form.Action formName="user-registration">Register</Form.Action>
</Form>

// ❌ Bad: Mismatched names
<Form name="user-registration">
  <Form.Action formName="registration">Register</Form.Action>
</Form>
```

### 2. **Action Placement**

```tsx
// ✅ Good: Actions at the bottom of form
<Form name="contact-form" fields={fields}>
  {/* Form content renders automatically */}
  
  <div className="form-actions mt-6 flex gap-3">
    <Form.Action formName="contact-form" variant="primary">
      Send Message
    </Form.Action>
    <Button variant="secondary">Cancel</Button>
  </div>
</Form>

// ✅ Good: Multiple actions with clear hierarchy
<Form name="article-form" fields={fields}>
  <div className="form-actions flex justify-between">
    <Button variant="outline">Delete Draft</Button>
    
    <div className="flex gap-2">
      <Form.Action 
        formName="article-form" 
        variant="secondary"
        submitFormOnPress={false}
        onPress={(e, { formData }) => saveDraft(formData)}
      >
        Save Draft
      </Form.Action>
      <Form.Action formName="article-form" variant="primary">
        Publish
      </Form.Action>
    </div>
  </div>
</Form>
```

### 3. **Error Prevention**

```tsx
// ✅ Good: Comprehensive error handling
<Form.Action 
  formName="payment-form"
  onPress={async (event, { form, formData }) => {
    // Validate form state
    if (!form?.isValid()) {
      toast.error('Please complete all required fields');
      return false;
    }
    
    // Custom business logic validation
    if (formData.amount > 10000) {
      toast.error('Amount exceeds daily limit');
      return false;
    }
    
    // Prevent double submission
    if (form?.isSubmitting?.()) {
      return false;
    }
    
    console.log('Processing payment...');
  }}
>
  Process Payment
</Form.Action>
```

### 4. **Performance Optimization**

```tsx
// ✅ Good: Memoized action handlers
const MemoizedForm = () => {
  const handleSubmit = useCallback((event, { form, formData }) => {
    // Expensive operation
    processComplexSubmission(formData);
  }, []);
  
  return (
    <Form name="optimized-form" fields={fields}>
      <Form.Action 
        formName="optimized-form"
        onPress={handleSubmit}
      >
        Submit
      </Form.Action>
    </Form>
  );
};

// ✅ Good: Conditional rendering for performance
const ConditionalActions = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <Form name="conditional-form" fields={fields}>
      <Form.Action formName="conditional-form">
        Basic Submit
      </Form.Action>
      
      {showAdvanced && (
        <Form.Action 
          formName="conditional-form"
          submitFormOnPress={false}
          onPress={handleAdvancedSubmit}
        >
          Advanced Submit
        </Form.Action>
      )}
    </Form>
  );
};
```

---

## 📝 **TypeScript Integration**

### Typed Form Data Access

```tsx
// Define form field types
type UserFormFields = {
  email: { type: 'email'; name: 'email' };
  password: { type: 'password'; name: 'password' };
  age: { type: 'number'; name: 'age' };
};

type UserFormData = {
  email: string;
  password: string;
  age: number;
};

// Typed Form.Action
const TypedUserForm = () => (
  <Form<UserFormFields> name="user-form" fields={userFields}>
    <Form.Action<UserFormFields>
      formName="user-form"
      onPress={(event, { form, formData }) => {
        // formData is fully typed as UserFormData
        console.log('Email:', formData?.email); // string
        console.log('Age:', formData?.age);     // number
        
        // form methods are typed
        const fieldInstances = form?.getFieldInstances();
        const emailField = fieldInstances?.email; // Typed field instance
      }}
    >
      Submit User Form
    </Form.Action>
  </Form>
);
```

### Custom Context Types

```tsx
// Define custom context type
type SubmissionContext = {
  userId: string;
  sessionId: string;
  metadata: Record<string, any>;
};

// Use typed context
const ContextualForm = () => {
  const submissionContext: SubmissionContext = {
    userId: 'user123',
    sessionId: 'session456',
    metadata: { source: 'web' }
  };
  
  return (
    <Form name="contextual-form" fields={fields}>
      <Form.Action<typeof fields, SubmissionContext>
        formName="contextual-form"
        context={submissionContext}
        onPress={(event, context) => {
          // context includes both form data and custom context
          console.log('User ID:', context.userId);     // string
          console.log('Form data:', context.formData); // typed form data
          console.log('Form instance:', context.form); // typed form instance
        }}
      >
        Submit with Context
      </Form.Action>
    </Form>
  );
};
```

### Interface Extensions

```tsx
// Extend Form.Action props for custom requirements
interface CustomFormActionProps<Fields extends IFields = IFields> 
  extends IFormActionProps<Fields> {
  analyticsEvent?: string;
  requiresConfirmation?: boolean;
}

const CustomFormAction = <Fields extends IFields = IFields>({
  analyticsEvent,
  requiresConfirmation,
  onPress,
  ...props
}: CustomFormActionProps<Fields>) => {
  const handlePress = useCallback((event, context) => {
    // Custom analytics
    if (analyticsEvent) {
      analytics.track(analyticsEvent, { formName: props.formName });
    }
    
    // Confirmation dialog
    if (requiresConfirmation) {
      const confirmed = window.confirm('Are you sure?');
      if (!confirmed) return false;
    }
    
    // Call original handler
    return onPress?.(event, context);
  }, [analyticsEvent, requiresConfirmation, onPress]);
  
  return (
    <Form.Action 
      {...props}
      onPress={handlePress}
    />
  );
};
```

---

## 🔧 **Troubleshooting**

### Common Issues and Solutions

#### 1. **Action Not Responding to Form State**

```tsx
// ❌ Problem: Action doesn't enable/disable with form validation
<Form name="my-form" fields={fields}>
  <Form.Action formName="wrong-name">Submit</Form.Action>
</Form>

// ✅ Solution: Ensure formName matches exactly
<Form name="my-form" fields={fields}>
  <Form.Action formName="my-form">Submit</Form.Action>
</Form>
```

#### 2. **Double Submission Issues**

```tsx
// ❌ Problem: Multiple submissions possible
<Form.Action 
  formName="form"
  onPress={async (event, { form }) => {
    await submitData(); // No protection against double-click
  }}
>
  Submit
</Form.Action>

// ✅ Solution: Add submission state protection
<Form.Action 
  formName="form"
  onPress={async (event, { form }) => {
    if (form?.isSubmitting?.()) {
      return false; // Prevent double submission
    }
    await submitData();
  }}
>
  Submit
</Form.Action>
```

#### 3. **Custom Validation Not Working**

```tsx
// ❌ Problem: Custom validation doesn't prevent submission
<Form.Action 
  formName="form"
  onPress={(event, { formData }) => {
    if (!customValidation(formData)) {
      console.log('Invalid!'); // Doesn't prevent submission
    }
  }}
>
  Submit
</Form.Action>

// ✅ Solution: Return false to prevent submission
<Form.Action 
  formName="form"
  onPress={(event, { formData }) => {
    if (!customValidation(formData)) {
      toast.error('Custom validation failed');
      return false; // Prevents form submission
    }
  }}
>
  Submit
</Form.Action>
```

#### 4. **Action State Debugging**

```tsx
// ✅ Debug action and form state
<Form.Action 
  formName="debug-form"
  onPress={(event, { form, formData }) => {
    console.group('Form.Action Debug');
    console.log('Form instance:', form);
    console.log('Form valid:', form?.isValid());
    console.log('Form data:', formData);
    console.log('Form errors:', form?.getErrors?.());
    console.log('Submit count:', form?.getSubmitCount?.());
    console.log('Field instances:', form?.getFieldInstances?.());
    console.groupEnd();
  }}
>
  Debug Submit
</Form.Action>
```

### Integration Checklist

- [ ] ✅ `formName` matches Form component's `name` prop exactly
- [ ] ✅ Form.Action is placed inside Form component or has access to FormContext
- [ ] ✅ Custom `onPress` handlers return `false` to prevent submission when needed
- [ ] ✅ Form validation state is properly configured with `validateBeforeFirstSubmit`
- [ ] ✅ Action state management doesn't conflict with manual `disabled` prop
- [ ] ✅ TypeScript types are properly defined for form fields and context
- [ ] ✅ Error handling covers both validation and submission failures
- [ ] ✅ Performance considerations addressed for complex forms

---

## 🎉 **Summary**

Form.Action provides intelligent form integration that goes far beyond a simple submit button:

- **🔗 Seamless Integration**: Automatic form binding and state synchronization
- **🧠 Smart Validation**: Real-time enable/disable based on form validity
- **⚡ Flexible Submission**: Built-in auto-submit with full customization options
- **🎯 Enhanced Context**: Access to complete form state and data
- **🔧 Developer Experience**: Full TypeScript support with comprehensive debugging

By leveraging Form.Action, you can create sophisticated form interactions with minimal code while maintaining full control over the submission process and user experience.

**Next Steps**: Explore the [Form.Field Guide](./FORM_FIELD_GUIDE.md) for custom field creation and the main [Form README](./README.md) for complete system overview.
