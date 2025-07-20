# Form.Manager (FormsManager) - Comprehensive User Guide

> **🏗️ Global Form Management System**  
> Form.Manager provides centralized control over form instances, field access, action coordination, and state synchronization across your entire application.

---

## 📋 **Table of Contents**

1. [Quick Start](#-quick-start)
2. [Core Architecture](#-core-architecture)
3. [Form Lifecycle Management](#-form-lifecycle-management)
4. [Field Instance Access](#-field-instance-access)
5. [Action Management](#-action-management)
6. [State Synchronization](#-state-synchronization)
7. [Advanced Patterns](#-advanced-patterns)
8. [TypeScript Integration](#-typescript-integration)
9. [Best Practices](#-best-practices)
10. [Troubleshooting](#-troubleshooting)

---

## 🚀 **Quick Start**

### Accessing Form.Manager

```tsx
import { Form } from '@resk/nativewind';

// Form.Manager is available as a static class
const form = Form.Manager.getForm('my-form');
const fieldInstance = Form.Manager.getFieldInstance('my-form', 'email');
```

### Key Features at a Glance

- **🏗️ Global Registry**: Centralized form instance management
- **🔍 Field Access**: Cross-form field instance retrieval
- **⚡ Action Coordination**: Multi-action management per form
- **🔄 State Sync**: Automatic validation-based UI updates
- **🛡️ Type Safety**: Full TypeScript support for all operations
- **📊 Lifecycle Control**: Form mounting/unmounting management

---

## 🏗️ **Core Architecture**

### Class Structure

```
Form.Manager (FormsManager)
├── Form Registry (static forms: {})
├── Action Registry (static actions: {})
├── Form Lifecycle Methods
├── Field Access Methods
├── Action Management Methods
└── State Synchronization System
```

### API Overview

```tsx
class FormsManager {
  // Form Lifecycle
  static mountForm(formInstance?: IForm): void
  static unmountForm(formName?: string): void
  static getForm<Fields>(formName?: string): IForm<Fields> | null
  
  // Field Access
  static getFieldInstances<Fields>(formName: string): Record<string, FormField>
  static getFieldInstance<T, ValueType>(formName?: string, fieldName?: string): FormField<T, ValueType> | null
  
  // Action Management
  static mountAction<Context>(action: IFormActionContext<Context>, formName: string): void
  static unmountAction(actionId: string, formName?: string): void
  static getActions(formName: string): Record<string, IFormActionContext>
  
  // State Synchronization
  static toggleFormStatus(formName: string, callback?: (options: { isValid: boolean, form: IForm }) => void): void
  
  // Type Guards
  static isForm<Fields>(form: any): form is IForm<Fields>
  static isField<FieldType, ValueType>(field: any): field is FormField<FieldType, ValueType>
}
```

---

## 🔄 **Form Lifecycle Management**

### 1. Form Registration

```tsx
// Forms are automatically mounted when created
const MyForm = () => (
  <Form name="user-profile" fields={fields}>
    {/* Form automatically mounts with Form.Manager */}
  </Form>
);

// Manual form access
const ProfileManager = () => {
  useEffect(() => {
    const form = Form.Manager.getForm('user-profile');
    if (form) {
      console.log('Profile form is mounted');
      console.log('Form valid:', form.isValid());
      console.log('Form data:', form.getData());
    }
  }, []);
  
  return null;
};
```

### 2. Form Instance Retrieval

```tsx
const FormController = () => {
  const [formData, setFormData] = useState({});
  
  const refreshFormData = useCallback(() => {
    const form = Form.Manager.getForm('user-profile');
    if (form) {
      setFormData(form.getData());
    }
  }, []);
  
  const validateForm = useCallback(() => {
    const form = Form.Manager.getForm('user-profile');
    return form?.isValid() ?? false;
  }, []);
  
  return (
    <div className="form-controller">
      <button onClick={refreshFormData}>Refresh Data</button>
      <button onClick={() => console.log('Valid:', validateForm())}>
        Check Validation
      </button>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};
```

### 3. Cross-Component Form Access

```tsx
// Component A: Form definition
const UserForm = () => (
  <Form name="user-registration" fields={userFields}>
    <Form.Action formName="user-registration">Register</Form.Action>
  </Form>
);

// Component B: External form control
const ExternalFormController = () => {
  const handleExternalSubmit = () => {
    const form = Form.Manager.getForm('user-registration');
    if (form?.isValid()) {
      form.submit();
    } else {
      toast.error('Please complete the registration form');
    }
  };
  
  const getRegistrationProgress = () => {
    const form = Form.Manager.getForm('user-registration');
    const fieldInstances = form?.getFieldInstances() || {};
    const totalFields = Object.keys(fieldInstances).length;
    const validFields = Object.values(fieldInstances).filter(field => field.isValid()).length;
    return Math.round((validFields / totalFields) * 100);
  };
  
  return (
    <div className="external-controller">
      <div>Progress: {getRegistrationProgress()}%</div>
      <button onClick={handleExternalSubmit}>Submit Registration</button>
    </div>
  );
};
```

---

## 🔍 **Field Instance Access**

### 1. Individual Field Access

```tsx
const FieldController = () => {
  const focusEmailField = () => {
    const emailField = Form.Manager.getFieldInstance('contact-form', 'email');
    emailField?.focus?.();
  };
  
  const validatePasswordField = () => {
    const passwordField = Form.Manager.getFieldInstance('contact-form', 'password');
    if (passwordField) {
      const isValid = passwordField.isValid();
      const value = passwordField.getValue();
      console.log('Password valid:', isValid, 'Value length:', value?.length);
    }
  };
  
  const clearFormData = () => {
    const form = Form.Manager.getForm('contact-form');
    const fieldInstances = form?.getFieldInstances() || {};
    
    Object.values(fieldInstances).forEach(field => {
      field.setValue?.(''); // Clear each field
    });
  };
  
  return (
    <div className="field-controls">
      <button onClick={focusEmailField}>Focus Email</button>
      <button onClick={validatePasswordField}>Check Password</button>
      <button onClick={clearFormData}>Clear Form</button>
    </div>
  );
};
```

### 2. Bulk Field Operations

```tsx
const BulkFieldOperations = () => {
  const validateAllFields = (formName: string) => {
    const fieldInstances = Form.Manager.getFieldInstances(formName);
    const validationResults = {};
    
    Object.entries(fieldInstances).forEach(([name, field]) => {
      validationResults[name] = {
        isValid: field.isValid(),
        value: field.getValue(),
        error: field.getError?.() || null
      };
    });
    
    return validationResults;
  };
  
  const fillFormWithDefaults = (formName: string, defaults: Record<string, any>) => {
    const fieldInstances = Form.Manager.getFieldInstances(formName);
    
    Object.entries(defaults).forEach(([fieldName, value]) => {
      const field = fieldInstances[fieldName];
      if (field && typeof field.setValue === 'function') {
        field.setValue(value);
      }
    });
  };
  
  const getFormSummary = (formName: string) => {
    const form = Form.Manager.getForm(formName);
    const fieldInstances = Form.Manager.getFieldInstances(formName);
    
    return {
      formName,
      isValid: form?.isValid() ?? false,
      fieldCount: Object.keys(fieldInstances).length,
      validFieldCount: Object.values(fieldInstances).filter(f => f.isValid()).length,
      data: form?.getData() || {},
      errors: form?.getErrors() || []
    };
  };
  
  return (
    <div className="bulk-operations">
      <button onClick={() => console.log(validateAllFields('user-form'))}>
        Validate All Fields
      </button>
      <button onClick={() => fillFormWithDefaults('user-form', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      })}>
        Fill Defaults
      </button>
      <button onClick={() => console.log(getFormSummary('user-form'))}>
        Get Form Summary
      </button>
    </div>
  );
};
```

### 3. Real-time Field Monitoring

```tsx
const FieldMonitor = ({ formName }: { formName: string }) => {
  const [fieldStates, setFieldStates] = useState({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      const fieldInstances = Form.Manager.getFieldInstances(formName);
      const states = {};
      
      Object.entries(fieldInstances).forEach(([name, field]) => {
        states[name] = {
          value: field.getValue(),
          isValid: field.isValid(),
          hasValidated: field.state?.hasValidated || false,
          isDisabled: field.state?.isDisabled || false
        };
      });
      
      setFieldStates(states);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [formName]);
  
  return (
    <div className="field-monitor">
      <h3>Field Monitor: {formName}</h3>
      {Object.entries(fieldStates).map(([name, state]: [string, any]) => (
        <div key={name} className="field-status">
          <strong>{name}:</strong>
          <span className={state.isValid ? 'valid' : 'invalid'}>
            {state.isValid ? '✅' : '❌'}
          </span>
          <span>Value: {JSON.stringify(state.value)}</span>
          <span>Validated: {state.hasValidated ? 'Yes' : 'No'}</span>
        </div>
      ))}
    </div>
  );
};
```

---

## ⚡ **Action Management**

### 1. Action Registry Access

```tsx
const ActionController = () => {
  const enableAllActions = (formName: string) => {
    const actions = Form.Manager.getActions(formName);
    Object.values(actions).forEach(action => {
      if (typeof action.enable === 'function') {
        action.enable();
      }
    });
  };
  
  const disableAllActions = (formName: string) => {
    const actions = Form.Manager.getActions(formName);
    Object.values(actions).forEach(action => {
      if (typeof action.disable === 'function') {
        action.disable();
      }
    });
  };
  
  const getActionStates = (formName: string) => {
    const actions = Form.Manager.getActions(formName);
    const states = {};
    
    Object.entries(actions).forEach(([id, action]) => {
      states[id] = {
        id: action.id,
        enabled: action.isEnabled?.() ?? true,
        formName: action.formName || formName
      };
    });
    
    return states;
  };
  
  return (
    <div className="action-controller">
      <button onClick={() => enableAllActions('payment-form')}>
        Enable All Actions
      </button>
      <button onClick={() => disableAllActions('payment-form')}>
        Disable All Actions
      </button>
      <button onClick={() => console.log(getActionStates('payment-form'))}>
        Check Action States
      </button>
    </div>
  );
};
```

### 2. Multi-Form Action Coordination

```tsx
const MultiFormCoordinator = () => {
  const coordinateSubmission = async () => {
    const profileForm = Form.Manager.getForm('user-profile');
    const settingsForm = Form.Manager.getForm('user-settings');
    
    // Validate both forms
    const profileValid = profileForm?.isValid() ?? false;
    const settingsValid = settingsForm?.isValid() ?? false;
    
    if (!profileValid || !settingsValid) {
      // Disable actions on invalid forms
      if (!profileValid) {
        const profileActions = Form.Manager.getActions('user-profile');
        Object.values(profileActions).forEach(action => action.disable?.());
      }
      
      if (!settingsValid) {
        const settingsActions = Form.Manager.getActions('user-settings');
        Object.values(settingsActions).forEach(action => action.disable?.());
      }
      
      toast.error('Please complete all forms before submitting');
      return;
    }
    
    // Submit both forms
    try {
      const profileData = profileForm.getData();
      const settingsData = settingsForm.getData();
      
      await Promise.all([
        profileForm.submit(),
        settingsForm.submit()
      ]);
      
      console.log('Both forms submitted successfully', {
        profile: profileData,
        settings: settingsData
      });
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };
  
  return (
    <div className="multi-form-coordinator">
      <button onClick={coordinateSubmission}>
        Submit All Forms
      </button>
    </div>
  );
};
```

---

## 🔄 **State Synchronization**

### 1. Manual State Sync

```tsx
const ManualStateSync = () => {
  const syncFormState = (formName: string) => {
    Form.Manager.toggleFormStatus(formName, ({ isValid, form }) => {
      console.log(`Form ${formName} is ${isValid ? 'valid' : 'invalid'}`);
      
      // Custom logic based on form state
      if (isValid) {
        // Enable related UI elements
        document.getElementById('submit-indicator')?.classList.add('ready');
      } else {
        // Show validation hints
        const errors = form.getErrors();
        toast.error(`Please fix: ${errors.join(', ')}`);
      }
    });
  };
  
  const watchFormValidation = (formName: string) => {
    const interval = setInterval(() => {
      syncFormState(formName);
    }, 500);
    
    return () => clearInterval(interval);
  };
  
  useEffect(() => {
    const cleanup = watchFormValidation('checkout-form');
    return cleanup;
  }, []);
  
  return (
    <div className="state-sync-controller">
      <button onClick={() => syncFormState('checkout-form')}>
        Sync Form State
      </button>
      <div id="submit-indicator" className="state-indicator">
        Form State Indicator
      </div>
    </div>
  );
};
```

### 2. Custom State Management

```tsx
const CustomStateManager = () => {
  const [globalFormState, setGlobalFormState] = useState({});
  
  const updateGlobalState = (formName: string) => {
    const form = Form.Manager.getForm(formName);
    const fieldInstances = Form.Manager.getFieldInstances(formName);
    const actions = Form.Manager.getActions(formName);
    
    setGlobalFormState(prev => ({
      ...prev,
      [formName]: {
        isValid: form?.isValid() ?? false,
        data: form?.getData() || {},
        errors: form?.getErrors() || [],
        fieldCount: Object.keys(fieldInstances).length,
        actionCount: Object.keys(actions).length,
        submitCount: form?.getSubmitCount?.() || 0,
        lastUpdated: new Date().toISOString()
      }
    }));
  };
  
  const syncAllForms = () => {
    // Get all mounted forms (this would require extending FormsManager)
    const knownForms = ['user-profile', 'user-settings', 'payment-info'];
    knownForms.forEach(formName => {
      const form = Form.Manager.getForm(formName);
      if (form) {
        updateGlobalState(formName);
      }
    });
  };
  
  return (
    <div className="custom-state-manager">
      <button onClick={syncAllForms}>Sync All Forms</button>
      
      <div className="global-state-display">
        <h3>Global Form State</h3>
        <pre>{JSON.stringify(globalFormState, null, 2)}</pre>
      </div>
    </div>
  );
};
```

---

## 🎯 **Advanced Patterns**

### 1. Form Wizard Management

```tsx
const FormWizardManager = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['personal', 'contact', 'preferences', 'review'];
  
  const validateCurrentStep = () => {
    const currentFormName = `wizard-step-${steps[currentStep]}`;
    const form = Form.Manager.getForm(currentFormName);
    return form?.isValid() ?? false;
  };
  
  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        submitWizard();
      }
    } else {
      // Show validation errors for current step
      const formName = `wizard-step-${steps[currentStep]}`;
      Form.Manager.toggleFormStatus(formName, ({ isValid, form }) => {
        if (!isValid) {
          toast.error(`Please complete step ${currentStep + 1}: ${form.getErrors().join(', ')}`);
        }
      });
    }
  };
  
  const submitWizard = () => {
    // Collect data from all steps
    const allData = {};
    steps.forEach(step => {
      const form = Form.Manager.getForm(`wizard-step-${step}`);
      if (form) {
        Object.assign(allData, form.getData());
      }
    });
    
    console.log('Wizard completed with data:', allData);
  };
  
  const getWizardProgress = () => {
    let validSteps = 0;
    steps.forEach(step => {
      const form = Form.Manager.getForm(`wizard-step-${step}`);
      if (form?.isValid()) {
        validSteps++;
      }
    });
    return Math.round((validSteps / steps.length) * 100);
  };
  
  return (
    <div className="form-wizard-manager">
      <div className="wizard-progress">
        Progress: {getWizardProgress()}% ({currentStep + 1}/{steps.length})
      </div>
      
      <div className="wizard-navigation">
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button onClick={nextStep}>
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};
```

### 2. Form Validation Aggregator

```tsx
const FormValidationAggregator = () => {
  const [validationSummary, setValidationSummary] = useState({});
  
  const aggregateValidation = (formNames: string[]) => {
    const summary = {
      totalForms: formNames.length,
      validForms: 0,
      totalFields: 0,
      validFields: 0,
      errors: [],
      formDetails: {}
    };
    
    formNames.forEach(formName => {
      const form = Form.Manager.getForm(formName);
      const fieldInstances = Form.Manager.getFieldInstances(formName);
      
      const isFormValid = form?.isValid() ?? false;
      const fieldCount = Object.keys(fieldInstances).length;
      const validFieldCount = Object.values(fieldInstances).filter(f => f.isValid()).length;
      const formErrors = form?.getErrors() || [];
      
      if (isFormValid) summary.validForms++;
      summary.totalFields += fieldCount;
      summary.validFields += validFieldCount;
      summary.errors.push(...formErrors);
      
      summary.formDetails[formName] = {
        isValid: isFormValid,
        fieldCount,
        validFieldCount,
        errors: formErrors,
        completionPercentage: fieldCount > 0 ? Math.round((validFieldCount / fieldCount) * 100) : 0
      };
    });
    
    return summary;
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      const forms = ['user-profile', 'billing-info', 'shipping-address'];
      const summary = aggregateValidation(forms);
      setValidationSummary(summary);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="validation-aggregator">
      <h3>Multi-Form Validation Summary</h3>
      
      <div className="summary-overview">
        <div>Valid Forms: {validationSummary.validForms}/{validationSummary.totalForms}</div>
        <div>Valid Fields: {validationSummary.validFields}/{validationSummary.totalFields}</div>
        <div>Total Errors: {validationSummary.errors?.length || 0}</div>
      </div>
      
      <div className="form-details">
        {Object.entries(validationSummary.formDetails || {}).map(([formName, details]: [string, any]) => (
          <div key={formName} className="form-detail">
            <h4>{formName}</h4>
            <div>Status: {details.isValid ? '✅ Valid' : '❌ Invalid'}</div>
            <div>Completion: {details.completionPercentage}%</div>
            {details.errors.length > 0 && (
              <div className="errors">
                Errors: {details.errors.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Dynamic Form Factory

```tsx
const DynamicFormFactory = () => {
  const createForm = (config: {
    name: string;
    fields: any;
    autoValidate?: boolean;
    onStateChange?: (isValid: boolean) => void;
  }) => {
    const { name, autoValidate = true, onStateChange } = config;
    
    // Monitor form after creation
    if (autoValidate && onStateChange) {
      const interval = setInterval(() => {
        const form = Form.Manager.getForm(name);
        if (form) {
          onStateChange(form.isValid());
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
    
    return name;
  };
  
  const destroyForm = (formName: string) => {
    // Note: This would require extending FormsManager with cleanup utilities
    const actions = Form.Manager.getActions(formName);
    Object.keys(actions).forEach(actionId => {
      Form.Manager.unmountAction(actionId, formName);
    });
    
    Form.Manager.unmountForm(formName);
    console.log(`Form ${formName} destroyed`);
  };
  
  const [managedForms, setManagedForms] = useState<string[]>([]);
  
  const addDynamicForm = () => {
    const formName = `dynamic-form-${Date.now()}`;
    const formId = createForm({
      name: formName,
      fields: {
        dynamicField: { type: 'text', name: 'dynamicField', label: 'Dynamic Field' }
      },
      onStateChange: (isValid) => {
        console.log(`${formName} validation changed:`, isValid);
      }
    });
    
    setManagedForms(prev => [...prev, formId]);
  };
  
  const removeDynamicForm = (formName: string) => {
    destroyForm(formName);
    setManagedForms(prev => prev.filter(name => name !== formName));
  };
  
  return (
    <div className="dynamic-form-factory">
      <h3>Dynamic Form Factory</h3>
      
      <button onClick={addDynamicForm}>Create Dynamic Form</button>
      
      <div className="managed-forms">
        {managedForms.map(formName => (
          <div key={formName} className="managed-form">
            <span>{formName}</span>
            <button onClick={() => removeDynamicForm(formName)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 📝 **TypeScript Integration**

### Typed Form Access

```tsx
// Define form field types
type UserProfileFields = {
  firstName: { type: 'text'; name: 'firstName' };
  lastName: { type: 'text'; name: 'lastName' };
  email: { type: 'email'; name: 'email' };
  age: { type: 'number'; name: 'age' };
};

type UserProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
};

// Typed form manager usage
const TypedFormManager = () => {
  const getUserProfile = (): UserProfileData | null => {
    const form = Form.Manager.getForm<UserProfileFields>('user-profile');
    return form?.getData() as UserProfileData || null;
  };
  
  const validateUserEmail = (): boolean => {
    const emailField = Form.Manager.getFieldInstance<'email', string>('user-profile', 'email');
    return emailField?.isValid() ?? false;
  };
  
  const getTypedFieldInstances = () => {
    const fieldInstances = Form.Manager.getFieldInstances<UserProfileFields>('user-profile');
    
    // Type-safe access to field instances
    const emailField = fieldInstances.email; // FormField<'email', string>
    const ageField = fieldInstances.age;     // FormField<'number', number>
    
    return {
      emailValue: emailField?.getValue(),
      ageValue: ageField?.getValue(),
      emailValid: emailField?.isValid(),
      ageValid: ageField?.isValid()
    };
  };
  
  return (
    <div className="typed-form-manager">
      <button onClick={() => console.log(getUserProfile())}>
        Get Typed Profile Data
      </button>
      <button onClick={() => console.log(getTypedFieldInstances())}>
        Get Typed Field States
      </button>
    </div>
  );
};
```

### Custom Manager Extensions

```tsx
// Extend FormsManager with custom utilities
class ExtendedFormsManager extends Form.Manager {
  static getAllFormNames(): string[] {
    // This would require accessing the private forms registry
    // In practice, you'd maintain your own registry
    return ['user-profile', 'settings', 'payment'];
  }
  
  static getFormStates(): Record<string, { isValid: boolean; data: any }> {
    const formNames = this.getAllFormNames();
    const states = {};
    
    formNames.forEach(name => {
      const form = this.getForm(name);
      if (form) {
        states[name] = {
          isValid: form.isValid(),
          data: form.getData()
        };
      }
    });
    
    return states;
  }
  
  static validateAllForms(): { valid: string[]; invalid: string[] } {
    const formNames = this.getAllFormNames();
    const valid = [];
    const invalid = [];
    
    formNames.forEach(name => {
      const form = this.getForm(name);
      if (form) {
        if (form.isValid()) {
          valid.push(name);
        } else {
          invalid.push(name);
        }
      }
    });
    
    return { valid, invalid };
  }
}

// Usage of extended manager
const ExtendedManagerExample = () => {
  const validateEverything = () => {
    const result = ExtendedFormsManager.validateAllForms();
    console.log('Validation results:', result);
    
    if (result.invalid.length > 0) {
      toast.error(`Invalid forms: ${result.invalid.join(', ')}`);
    } else {
      toast.success('All forms are valid!');
    }
  };
  
  return (
    <button onClick={validateEverything}>
      Validate All Forms
    </button>
  );
};
```

---

## 🎯 **Best Practices**

### 1. **Form Naming Conventions**

```tsx
// ✅ Good: Descriptive, hierarchical naming
Form.Manager.getForm('user-registration-personal');
Form.Manager.getForm('user-registration-billing');
Form.Manager.getForm('checkout-payment-info');

// ❌ Bad: Generic or unclear names
Form.Manager.getForm('form1');
Form.Manager.getForm('data');
Form.Manager.getForm('temp');
```

### 2. **Defensive Programming**

```tsx
// ✅ Good: Always check for form existence
const SafeFormAccess = () => {
  const getFormData = (formName: string) => {
    const form = Form.Manager.getForm(formName);
    if (!form) {
      console.warn(`Form ${formName} not found`);
      return null;
    }
    
    return form.getData();
  };
  
  const getFieldValue = (formName: string, fieldName: string) => {
    const field = Form.Manager.getFieldInstance(formName, fieldName);
    if (!field) {
      console.warn(`Field ${fieldName} not found in form ${formName}`);
      return undefined;
    }
    
    return field.getValue();
  };
  
  return null;
};
```

### 3. **Memory Management**

```tsx
// ✅ Good: Clean up form references
const FormLifecycleManager = () => {
  useEffect(() => {
    // Component mounted - forms are auto-managed
    
    return () => {
      // Component unmounting - forms auto-cleanup
      // But clean up any manual references
      const formNames = ['temp-form-1', 'temp-form-2'];
      formNames.forEach(name => {
        Form.Manager.unmountForm(name);
      });
    };
  }, []);
  
  return null;
};
```

### 4. **Error Handling**

```tsx
// ✅ Good: Comprehensive error handling
const RobustFormManager = () => {
  const safeFormOperation = async (formName: string, operation: string) => {
    try {
      const form = Form.Manager.getForm(formName);
      
      if (!form) {
        throw new Error(`Form ${formName} not found`);
      }
      
      switch (operation) {
        case 'submit':
          if (!form.isValid()) {
            throw new Error(`Form ${formName} is invalid: ${form.getErrors().join(', ')}`);
          }
          await form.submit();
          break;
          
        case 'validate':
          const isValid = form.isValid();
          if (!isValid) {
            console.log(`Validation errors for ${formName}:`, form.getErrors());
          }
          return isValid;
          
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error) {
      console.error(`Form operation failed:`, error);
      toast.error(`Form error: ${error.message}`);
      return false;
    }
  };
  
  return (
    <button onClick={() => safeFormOperation('user-form', 'submit')}>
      Safe Submit
    </button>
  );
};
```

---

## 🔧 **Troubleshooting**

### Common Issues and Solutions

#### 1. **Form Not Found**

```tsx
// ❌ Problem: Form.Manager.getForm() returns null
const form = Form.Manager.getForm('my-form'); // null

// ✅ Solution: Ensure form is mounted and name matches exactly
const DebuggFormAccess = () => {
  useEffect(() => {
    // Wait for form to mount
    const checkForm = () => {
      const form = Form.Manager.getForm('my-form');
      if (form) {
        console.log('Form found:', form);
      } else {
        console.log('Form not yet mounted, retrying...');
        setTimeout(checkForm, 100);
      }
    };
    
    checkForm();
  }, []);
  
  return null;
};
```

#### 2. **Field Instance Not Available**

```tsx
// ❌ Problem: Field instance returns null
const field = Form.Manager.getFieldInstance('form', 'field'); // null

// ✅ Solution: Check field registration and form context
const DebugFieldAccess = () => {
  const debugFieldAccess = (formName: string, fieldName: string) => {
    // Check if form exists
    const form = Form.Manager.getForm(formName);
    if (!form) {
      console.error(`Form ${formName} not found`);
      return;
    }
    
    // Check if field exists in form
    const fieldInstances = form.getFieldInstances();
    console.log('Available fields:', Object.keys(fieldInstances));
    
    // Check specific field
    const field = fieldInstances[fieldName];
    if (!field) {
      console.error(`Field ${fieldName} not found in form ${formName}`);
      return;
    }
    
    console.log('Field found:', field);
  };
  
  return (
    <button onClick={() => debugFieldAccess('my-form', 'email')}>
      Debug Field Access
    </button>
  );
};
```

#### 3. **Action State Issues**

```tsx
// ❌ Problem: Actions not responding to form state
// ✅ Solution: Check action mounting and form validation

const DebugActionState = () => {
  const debugActionState = (formName: string) => {
    const form = Form.Manager.getForm(formName);
    const actions = Form.Manager.getActions(formName);
    
    console.log('Form details:', {
      exists: !!form,
      isValid: form?.isValid(),
      shouldValidateBeforeFirstSubmit: form?.shouldValidateBeforeFirstSubmit?.(),
      submitCount: form?.getSubmitCount?.()
    });
    
    console.log('Actions:', {
      count: Object.keys(actions).length,
      actions: Object.entries(actions).map(([id, action]) => ({
        id,
        hasEnable: typeof action.enable === 'function',
        hasDisable: typeof action.disable === 'function',
        isEnabled: action.isEnabled?.()
      }))
    });
    
    // Manually trigger state sync
    Form.Manager.toggleFormStatus(formName);
  };
  
  return (
    <button onClick={() => debugActionState('my-form')}>
      Debug Actions
    </button>
  );
};
```

### Integration Checklist

- [ ] ✅ Form names are unique and descriptive
- [ ] ✅ Form.Manager access happens after form mounting
- [ ] ✅ Field names match exactly between definition and access
- [ ] ✅ Error handling covers null/undefined returns
- [ ] ✅ Memory cleanup for dynamic forms
- [ ] ✅ TypeScript types are properly defined
- [ ] ✅ Form lifecycle is properly managed
- [ ] ✅ Action state synchronization is working

---

## 🎉 **Summary**

Form.Manager provides powerful centralized control over the entire form ecosystem:

- **🏗️ Global Registry**: Centralized form and action management
- **🔍 Granular Access**: Individual field and action control
- **🔄 State Coordination**: Automatic validation-based synchronization
- **⚡ Advanced Patterns**: Wizard management, bulk operations, dynamic forms
- **🛡️ Type Safety**: Full TypeScript support for all operations
- **🔧 Developer Experience**: Comprehensive debugging and troubleshooting tools

By leveraging Form.Manager, you can build sophisticated multi-form applications with coordinated state management, cross-form validation, and centralized control over the entire form experience.

**Next Steps**: Explore the [Form.Action Guide](./FORM_ACTION_GUIDE.md) for action management and the [Form.Field Guide](./FORM_FIELD_GUIDE.md) for custom field development.
