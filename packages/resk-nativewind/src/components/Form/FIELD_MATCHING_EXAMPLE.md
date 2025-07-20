# 🔗 Field Matching Validation - Usage Examples

This document demonstrates how to use the new `matchField` property for field matching validation in the @resk/nativewind Form system.

## 📋 **Basic Usage - Password Confirmation**

```tsx
import { Form } from '@resk/nativewind';

const RegistrationForm = () => {
  const fields = {
    password: {
      type: 'password',
      name: 'password',
      label: 'Password',
      required: true,
      minLength: 8
    },
    confirmPassword: {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      required: true,
      matchField: 'password' // 🔗 Must match the password field
    }
  } as const;

  return (
    <Form
      name="registration"
      fields={fields}
      onSubmit={({ data }) => {
        console.log('Registration data:', data);
        // Both password and confirmPassword will have the same value
      }}
    >
      {({ form }) => (
        <Form.Action
          formName="registration"
          disabled={!form.isValid()}
        >
          Register
        </Form.Action>
      )}
    </Form>
  );
};
```

## 📧 **Email Confirmation Example**

```tsx
const EmailVerificationForm = () => {
  const fields = {
    email: {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      required: true
    },
    confirmEmail: {
      type: 'email',
      name: 'confirmEmail',
      label: 'Confirm Email Address',
      required: true,
      matchField: 'email' // 🔗 Must match the email field
    }
  } as const;

  return (
    <Form
      name="email-verification"
      fields={fields}
      validateBeforeFirstSubmit={true}
    />
  );
};
```

## 🎛️ **Advanced Usage with Custom Comparison**

```tsx
const SecurityQuestionForm = () => {
  const fields = {
    securityAnswer: {
      type: 'text',
      name: 'securityAnswer',
      label: 'Security Answer',
      required: true
    },
    confirmSecurityAnswer: {
      type: 'text',
      name: 'confirmSecurityAnswer',
      label: 'Confirm Security Answer',
      required: true,
      matchField: 'securityAnswer',
      // Custom comparison - case insensitive matching
      compareValues: (a, b) => {
        return String(a || '').toLowerCase().trim() === 
               String(b || '').toLowerCase().trim();
      }
    }
  } as const;

  return <Form name="security" fields={fields} />;
};
```

## 🔄 **Real-time Validation Behavior**

```tsx
const DynamicValidationDemo = () => {
  const fields = {
    newPin: {
      type: 'password',
      name: 'newPin',
      label: 'New PIN',
      required: true,
      maxLength: 4,
      pattern: '^[0-9]{4}$'
    },
    confirmPin: {
      type: 'password',
      name: 'confirmPin',
      label: 'Confirm PIN',
      required: true,
      matchField: 'newPin',
      // Custom validation message
      onFieldInvalid: ({ message }) => {
        console.log('PIN confirmation failed:', message);
      },
      onFieldValid: () => {
        console.log('PIN confirmation successful!');
      }
    }
  } as const;

  return (
    <Form
      name="pin-setup"
      fields={fields}
      renderField={(field, { form }) => {
        const isConfirmField = field.name === 'confirmPin';
        const mainFieldValue = form.getFieldInstances()['newPin']?.getValue();
        
        return (
          <div className="mb-4">
            <Form.FieldRenderer {...field} />
            {isConfirmField && mainFieldValue && (
              <div className="text-sm text-gray-500 mt-1">
                Must match the PIN entered above
              </div>
            )}
          </div>
        );
      }}
    />
  );
};
```

## ⚡ **Multiple Field Matching**

```tsx
const MultipleConfirmationForm = () => {
  const fields = {
    // Primary fields
    username: {
      type: 'text',
      name: 'username',
      label: 'Username',
      required: true
    },
    email: {
      type: 'email',
      name: 'email',
      label: 'Email',
      required: true
    },
    password: {
      type: 'password',
      name: 'password',
      label: 'Password',
      required: true,
      minLength: 8
    },
    
    // Confirmation fields
    confirmUsername: {
      type: 'text',
      name: 'confirmUsername',
      label: 'Confirm Username',
      required: true,
      matchField: 'username' // 🔗 Matches username
    },
    confirmEmail: {
      type: 'email',
      name: 'confirmEmail',
      label: 'Confirm Email',
      required: true,
      matchField: 'email' // 🔗 Matches email
    },
    confirmPassword: {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      required: true,
      matchField: 'password' // 🔗 Matches password
    }
  } as const;

  return (
    <Form
      name="comprehensive-registration"
      fields={fields}
      renderFields={({ fields, form }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Enter Information</h3>
            <Form.FieldRenderer {...fields.username} />
            <Form.FieldRenderer {...fields.email} />
            <Form.FieldRenderer {...fields.password} />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Confirm Information</h3>
            <Form.FieldRenderer {...fields.confirmUsername} />
            <Form.FieldRenderer {...fields.confirmEmail} />
            <Form.FieldRenderer {...fields.confirmPassword} />
            
            {form.isValid() && (
              <div className="p-3 bg-green-100 text-green-800 rounded">
                ✅ All fields match successfully!
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
};
```

## 🛠️ **Error Handling and Debugging**

```tsx
const DebuggingExample = () => {
  const fields = {
    value1: {
      type: 'text',
      name: 'value1',
      label: 'First Value'
    },
    value2: {
      type: 'text',
      name: 'value2',
      label: 'Second Value',
      matchField: 'value1',
      onFieldValid: (options) => {
        console.log('✅ Field validation passed:', options);
      },
      onFieldInvalid: (options) => {
        console.log('❌ Field validation failed:', options);
        console.log('Error message:', options.message);
      }
    }
  } as const;

  return (
    <Form
      name="debugging"
      fields={fields}
      onFormValid={() => console.log('🎉 Entire form is valid!')}
      onFormInvalid={() => console.log('⚠️ Form has validation errors')}
    />
  );
};
```

## 🔧 **Key Features**

### ✅ **Automatic Cross-Validation**
- When the target field changes, dependent fields are automatically re-validated
- No manual triggering required

### ✅ **Custom Comparison Logic**
- Use `compareValues` prop for custom matching logic
- Supports case-insensitive, trimmed, or transformed comparisons

### ✅ **Real-time Feedback**
- Validation occurs immediately when either field changes
- Visual feedback shows matching status instantly

### ✅ **Error Messages**
- Clear, descriptive error messages
- Automatically includes field labels for context

### ✅ **TypeScript Support**
- Full type safety with field name checking
- IntelliSense support for matchField values

## 🚨 **Important Notes**

1. **Target Field Must Exist**: The field specified in `matchField` must exist in the same form
2. **Validation Order**: Field matching validation runs after standard validation rules
3. **Performance**: Uses setTimeout to prevent validation loops and ensure smooth UX
4. **Error Handling**: Gracefully handles missing target fields with descriptive errors

## 📚 **Related Documentation**

- [Form Field Guide](./FORM_FIELD_GUIDE.md) - Complete field configuration reference
- [Form Validation](./FORMS_MANAGER_GUIDE.md) - Advanced validation patterns
- [Field Types Reference](../Fields/README.md) - Available field types and properties

## 🎯 **Use Cases**

- **Password Confirmation** - Most common use case
- **Email Verification** - Double-entry email validation
- **Security Questions** - Confirmation of sensitive answers
- **Account Settings** - Confirming changes to critical information
- **Payment Forms** - Confirming billing information
- **Data Entry** - Ensuring accuracy in important fields

This feature makes it incredibly easy to implement confirmation fields with robust, real-time validation!
