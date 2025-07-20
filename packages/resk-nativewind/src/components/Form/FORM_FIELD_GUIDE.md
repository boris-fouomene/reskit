# Form.Field & Form.FieldRenderer - Complete Developer Guide

A comprehensive guide to understanding and extending the Resk Form system's field architecture. This document covers the core `Form.Field` base class used for creating custom field types and the `Form.FieldRenderer` component for rendering field instances.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Form.Field - Base Field Class](#formfield---base-field-class)
3. [Form.FieldRenderer - Field Rendering Component](#formfieldrenderer---field-rendering-component)
4. [AttachFormField Decorator](#attachformfield-decorator)
5. [Creating Custom Field Types](#creating-custom-field-types)
6. [Field Registration System](#field-registration-system)
7. [Advanced Field Customization](#advanced-field-customization)
8. [TypeScript Integration](#typescript-integration)
9. [Real-World Examples](#real-world-examples)
10. [Best Practices](#best-practices)

---

## Architecture Overview

The Resk Form system is built on a plugin-based architecture that allows unlimited extensibility through custom field types. The system consists of:

### Core Components

```mermaid
graph TD
    A[Form Component] --> B[Form.FieldRenderer]
    B --> C[Form.Field Base Class]
    C --> D[Built-in Field Types]
    C --> E[Custom Field Types]
    F[@AttachFormField Decorator] --> G[Field Registration System]
    E --> F
    D --> F
```

### Key Concepts

1. **Form.Field**: Abstract base class that all field types extend
2. **Form.FieldRenderer**: Component responsible for rendering field instances
3. **@AttachFormField**: Decorator that registers custom field types globally
4. **Field Registration System**: Global registry for all available field types
5. **TypeScript Integration**: Full type safety and IntelliSense support

---

## Form.Field - Base Field Class

The `Form.Field` class is the foundation of all field types in the Resk Form system. It provides core functionality for validation, state management, lifecycle events, and rendering.

### Class Definition

```tsx
class FormField<FieldType extends IFieldType = IFieldType, ValueType = any> 
  extends Component<IField<FieldType, ValueType>, IFormFieldState<FieldType, ValueType>> {
  
  // Core field functionality
  // Validation system
  // State management  
  // Lifecycle hooks
  // Rendering logic
}
```

### Core Properties and State

```tsx
interface IFormFieldState<FieldType, ValueType> {
  error: boolean;              // Validation error state
  hasValidated: boolean;       // Whether field has been validated
  isEditable: boolean;         // Editable state
  value: ValueType;           // Current field value
  prevValue: ValueType;       // Previous field value
  isDisabled: boolean;        // Disabled state
  errorText?: string;         // Error message text
}
```

### Essential Methods

#### Core Field Information

```tsx
class FormField {
  getName(): string                    // Get field name
  getType(): FieldType                // Get field type  
  getValue(): ValueType               // Get current value
  getLabel(): string                  // Get field label
  isValid(): boolean                  // Check if field is valid
  hasValidated(): boolean             // Check if field has been validated
  getErrorText(): string              // Get error message
}
```

#### Validation System

```tsx
class FormField {
  // Validation methods
  validate(options: IValidateOptions, force?: boolean): Promise<IValidateOptions>
  shouldValidateOnBlur(): boolean
  shouldValidateOnMount(): boolean  
  getValidationRules(): IValidatorRule[]
  canValidate(): boolean
  
  // Validation hooks
  beforeValidate(options: IValidateOptions): void
  onValid(options: IValidateOptions): boolean
  onInvalid(options: IValidateOptions): boolean
}
```

#### State Management

```tsx
class FormField {
  // State methods
  isDisabled(): boolean
  enable(): void
  disable(): void
  isEditable(): boolean
  focus(): void
  
  // Value handling
  sanitizeValue(value: any): any
  getValidValue(formData: IFormData): any
  compareValues(a: ValueType, b: ValueType): boolean
}
```

#### Lifecycle Hooks

```tsx
class FormField {
  // Lifecycle methods
  componentDidMount(): void
  componentWillUnmount(): void
  onRegister(): void
  onUnregister(): void
  
  // Event handlers
  callOnChange(options: IOnChangeOptions): void
  onKeyEvent(key: IKeyboardEventHandlerKey, event: IKeyboardEventHandlerEvent): void
}
```

#### Rendering System

```tsx
class FormField {
  // Core rendering method - MUST be implemented by subclasses
  abstract _render(props: IField<FieldType, ValueType>, innerRef?: any): ReactNode
  
  // Utility rendering methods
  isTextField(): boolean              // Whether field accepts text input
  canValueBeDecimal(): boolean       // Whether field accepts decimal values
  renderSkeleton(): ReactNode        // Render loading skeleton
  overrideProps(props: IField): IField // Override field props before rendering
}
```

---

## Form.FieldRenderer - Field Rendering Component

`Form.FieldRenderer` is the component responsible for instantiating and rendering field instances. It acts as a bridge between field definitions and their rendered components.

### Component Signature

```tsx
function FormFieldRenderer<FieldType extends IFieldType = IFieldType, ValueType = any>(
  props: Omit<IField<FieldType, ValueType>, "ref" | "name"> & { 
    name: string; 
    type: FieldType;
    ref?: Ref<FormField<FieldType, ValueType>> 
  }
): JSX.Element
```

### How It Works

1. **Field Resolution**: Looks up the registered field component by type
2. **Context Integration**: Integrates with form context for state management  
3. **Props Preparation**: Processes field props based on form mode (create/update)
4. **Component Instantiation**: Creates the appropriate field component instance
5. **Event Binding**: Binds validation and lifecycle events

### Usage Patterns

#### Basic Field Rendering

```tsx
// Simple field rendering
<Form.FieldRenderer 
  type="text" 
  name="username" 
  required 
  placeholder="Enter username"
/>

// With validation
<Form.FieldRenderer 
  type="email" 
  name="email" 
  required 
  validateEmail 
  placeholder="user@example.com"
/>
```

#### Advanced Field Rendering

```tsx
// Custom field with validation and styling
<Form.FieldRenderer 
  type="password" 
  name="password" 
  required 
  minLength={8}
  placeholder="Secure password"
  helpText="Must be at least 8 characters"
  fieldContainerClassName="password-field"
  onFieldValid={(options) => {
    console.log('Password is valid:', options.value);
  }}
  onFieldInvalid={(options) => {
    console.log('Password error:', options.error);
  }}
/>
```

#### Custom Field Types

```tsx
// Using custom field types from /Fields folder
<Form.FieldRenderer 
  type="switch" 
  name="notifications" 
  label="Enable notifications"
  checkedValue={true}
  uncheckedValue={false}
  defaultValue={true}
/>

<Form.FieldRenderer 
  type="selectCountry" 
  name="country" 
  required 
  placeholder="Select your country"
  displayDialCode={false}
/>
```

### Form Context Integration

When used within a Form component, `Form.FieldRenderer` automatically:

- Registers the field instance with the form
- Applies form-level disabled/readonly states
- Handles form submission and validation events
- Manages field lifecycle (mount/unmount)
- Provides access to form context through `useForm()` hook

---

## AttachFormField Decorator

The `@AttachFormField` decorator is the mechanism for registering custom field types with the form system. It enables global availability of custom field components.

### Decorator Signature

```tsx
function AttachFormField<FieldType extends IFieldType = IFieldType, ValueType = any>(
  type: FieldType
): (target: IFormFieldComponent<FieldType, ValueType>) => void
```

### How It Works

```tsx
export function AttachFormField<FieldType extends IFieldType = IFieldType, ValueType = any>(type: FieldType) {
    return (target: IFormFieldComponent<FieldType, ValueType>) => {
        FormField.registerComponent<FieldType, ValueType>(type, target as typeof FormField);
    };
}
```

### Registration Process

1. **Decorator Application**: `@AttachFormField("fieldType")` is applied to a field class
2. **Type Registration**: The field type is registered in the global component registry
3. **Global Availability**: The field becomes available throughout the application
4. **TypeScript Integration**: Type definitions are extended for IntelliSense support

### Usage Example

```tsx
@AttachFormField<"customInput">("customInput")
export class FormFieldCustomInput extends Form.Field<"customInput", string> {
    _render(props: IField<"customInput", string>, innerRef?: any): ReactNode {
        return <CustomInputComponent {...props} ref={innerRef} />;
    }
}
```

---

## Creating Custom Field Types

Creating custom field types involves extending the `Form.Field` base class and implementing the required methods. Here's a comprehensive guide:

### Step 1: Define the Field Class

```tsx
// Import required modules
import { Form, IFormFieldProps, AttachFormField } from "../base";
import { IField } from "@resk/core/resources";
import { CustomComponent, ICustomComponentProps } from "@components/CustomComponent";

// Apply the decorator to register the field type
@AttachFormField<"customField">("customField")
export class FormFieldCustom extends Form.Field<"customField", string> {
    
    // Override core methods as needed
    isTextField(): boolean {
        return true; // or false for non-text fields
    }
    
    // Implement the core rendering method
    _render(props: IField<"customField", string>, innerRef?: any): ReactNode {
        return <CustomComponent {...(props as ICustomComponentProps)} ref={innerRef} />;
    }
    
    // Optional: Custom value sanitization
    sanitizeValue(value: any): string {
        // Custom logic for value transformation
        return String(value || '').trim();
    }
    
    // Optional: Custom validation logic
    getValidationRules(): IValidatorRule[] {
        const rules = super.getValidationRules();
        
        // Add custom validation rules
        if (this.props.customValidation) {
            rules.push('CustomRule');
        }
        
        return rules;
    }
}
```

### Step 2: Define TypeScript Interface

```tsx
// Define the props interface for your custom field
interface IFormFieldCustomProps extends 
  IFormFieldProps<"customField", string, ICustomComponentProps["onChange"]>, 
  Omit<ICustomComponentProps, "onChange" | "ref"> {
  
  // Add custom properties specific to your field
  customValidation?: boolean;
  customProperty?: string;
}

// Extend the global IFieldMap to include your field type
declare module "@resk/core/resources" {
    export interface IFieldMap {
        customField: IFormFieldCustomProps;
    }
}
```

### Step 3: Export and Use

```tsx
// Export the field class
export { FormFieldCustom };

// Usage in forms
const fields = {
  customInput: {
    type: 'customField' as const,
    name: 'customInput',
    required: true,
    customProperty: 'value',
    customValidation: true
  }
} as const;
```

---

## Field Registration System

The field registration system manages all available field types globally using a metadata-based registry.

### Registry Implementation

```tsx
class FormField {
    private static readonly FIELDS_COMPONENTS_METADATA_KEY = Symbol("formFieldsComponent");

    // Register a field component
    static registerComponent<FieldType extends IFieldType = IFieldType, ValueType = any>(
        type: IFieldType, 
        component: IFormFieldComponent<FieldType, ValueType>
    ): void {
        if (!isNonNullString(type) || typeof (component) !== "function") return;
        const components = FormField.getRegisteredComponents();
        (components as any)[type] = component;
        Reflect.defineMetadata(FormField.FIELDS_COMPONENTS_METADATA_KEY, components, FormField);
    }

    // Get all registered components
    static getRegisteredComponents(): Record<IFieldType, typeof FormField> {
        const components = Reflect.getMetadata(FormField.FIELDS_COMPONENTS_METADATA_KEY, FormField);
        return isObj(components) ? components : {} as any;
    }

    // Get a specific registered component
    static getRegisteredComponent<FieldType extends IFieldType = IFieldType, ValueType = any>(
        type: IFieldType
    ): IFormFieldComponent<FieldType, ValueType> {
        if (!isNonNullString(type)) return FormField<FieldType, ValueType>;
        const components = FormField.getRegisteredComponents();
        if (!components || !components[type]) return FormField<FieldType, ValueType>;
        return components[type];
    }
}
```

### Registry Usage

```tsx
// Check available field types
const registeredComponents = FormField.getRegisteredComponents();
console.log('Available field types:', Object.keys(registeredComponents));

// Get a specific field component
const TextFieldComponent = FormField.getRegisteredComponent('text');
const CustomFieldComponent = FormField.getRegisteredComponent('customField');

// Verify if a field type is registered
const isRegistered = 'customField' in FormField.getRegisteredComponents();
```

---

## Advanced Field Customization

### Complex Field Example: Rating Field

```tsx
import { Rating, IRatingProps } from "@components/Rating";

@AttachFormField<"rating">("rating")
export class FormFieldRating extends Form.Field<"rating", number> {
    
    isTextField(): boolean {
        return false; // Not a text input field
    }
    
    sanitizeValue(value: any): number {
        const numValue = Number(value);
        return isNaN(numValue) ? 0 : Math.max(0, Math.min(5, numValue));
    }
    
    getValidationRules(): IValidatorRule[] {
        const rules = super.getValidationRules();
        
        // Add rating-specific validation
        if (this.props.minRating) {
            rules.push(`min[${this.props.minRating}]` as IValidatorRule);
        }
        
        if (this.props.maxRating) {
            rules.push(`max[${this.props.maxRating}]` as IValidatorRule);
        }
        
        return rules;
    }
    
    _render(props: IField<"rating", number>, innerRef?: any): ReactNode {
        const { minRating = 1, maxRating = 5, allowHalf = false, ...ratingProps } = props as any;
        
        return (
            <Rating
                ref={innerRef}
                min={minRating}
                max={maxRating}
                allowHalf={allowHalf}
                {...ratingProps}
            />
        );
    }
    
    // Custom focus behavior
    focus(): void {
        if (this._fieldRef && typeof this._fieldRef.focus === 'function') {
            this._fieldRef.focus();
        }
    }
}

// TypeScript interface
interface IFormFieldRatingProps extends 
  IFormFieldProps<"rating", number, IRatingProps["onChange"]>, 
  Omit<IRatingProps, "onChange" | "ref"> {
  minRating?: number;
  maxRating?: number;
  allowHalf?: boolean;
}

declare module "@resk/core/resources" {
    export interface IFieldMap {
        rating: IFormFieldRatingProps;
    }
}
```

### Multi-Value Field Example: Tag Input

```tsx
import { TagInput, ITagInputProps } from "@components/TagInput";

@AttachFormField<"tags">("tags")
export class FormFieldTags extends Form.Field<"tags", string[]> {
    
    isTextField(): boolean {
        return false;
    }
    
    sanitizeValue(value: any): string[] {
        if (Array.isArray(value)) {
            return value.filter(v => typeof v === 'string' && v.trim().length > 0);
        }
        if (typeof value === 'string') {
            return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
        return [];
    }
    
    getValidationRules(): IValidatorRule[] {
        const rules = super.getValidationRules();
        
        if (this.props.minTags) {
            rules.push(`minLength[${this.props.minTags}]` as IValidatorRule);
        }
        
        if (this.props.maxTags) {
            rules.push(`maxLength[${this.props.maxTags}]` as IValidatorRule);
        }
        
        return rules;
    }
    
    _render(props: IField<"tags", string[]>, innerRef?: any): ReactNode {
        return (
            <TagInput
                ref={innerRef}
                {...(props as ITagInputProps)}
                onTagsChange={(tags) => {
                    const event = { target: { value: tags } };
                    props.onChange?.(event as any);
                }}
            />
        );
    }
}
```

---

## TypeScript Integration

The Resk Form system provides comprehensive TypeScript support through declaration merging and generic type parameters.

### Field Type Declaration

```tsx
// Extend the global IFieldMap interface
declare module "@resk/core/resources" {
    export interface IFieldMap {
        // Built-in types
        text: IFormFieldTextProps<"text">;
        email: IFormFieldTextProps<"email"> & { validateEmail?: boolean };
        password: IFormFieldTextProps<"password">;
        number: IFormFieldProps<"number", number>;
        
        // Custom types
        rating: IFormFieldRatingProps;
        tags: IFormFieldTagsProps;
        customField: IFormFieldCustomProps;
    }
}
```

### Type-Safe Field Definitions

```tsx
// Define fields with full type safety
const userFormFields = {
    username: {
        type: 'text' as const,           // Type is inferred correctly
        name: 'username',
        required: true,
        minLength: 3,
        placeholder: 'Enter username'
    },
    rating: {
        type: 'rating' as const,         // Custom field type
        name: 'rating',
        required: true,
        minRating: 1,
        maxRating: 5,
        allowHalf: true
    },
    tags: {
        type: 'tags' as const,          // Multi-value field type
        name: 'tags',
        minTags: 1,
        maxTags: 10,
        placeholder: 'Add tags...'
    }
} as const;

// TypeScript automatically infers the correct field types
type UserFormFields = typeof userFormFields;
// Result: { username: IFormFieldTextProps<"text">, rating: IFormFieldRatingProps, tags: IFormFieldTagsProps }
```

### Generic Field Component

```tsx
// Create a generic custom field component
interface IGenericFieldProps<T = any> {
    value?: T;
    onChange?: (value: T) => void;
    placeholder?: string;
}

@AttachFormField<"generic">("generic")
export class FormFieldGeneric<T = any> extends Form.Field<"generic", T> {
    _render(props: IField<"generic", T>, innerRef?: any): ReactNode {
        return <GenericComponent<T> {...(props as any)} ref={innerRef} />;
    }
}
```

---

## Real-World Examples

### Example 1: Address Field Component

```tsx
// Complex address field with multiple sub-components
import { AddressInput, IAddressInputProps, IAddress } from "@components/AddressInput";

@AttachFormField<"address">("address")
export class FormFieldAddress extends Form.Field<"address", IAddress> {
    
    isTextField(): boolean {
        return false;
    }
    
    sanitizeValue(value: any): IAddress {
        if (!value || typeof value !== 'object') {
            return {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            };
        }
        
        return {
            street: String(value.street || ''),
            city: String(value.city || ''),
            state: String(value.state || ''),
            zipCode: String(value.zipCode || ''),
            country: String(value.country || '')
        };
    }
    
    getValidationRules(): IValidatorRule[] {
        const rules = super.getValidationRules();
        
        if (this.props.required) {
            rules.push('RequiredAddress'); // Custom validator for address completeness
        }
        
        return rules;
    }
    
    _render(props: IField<"address", IAddress>, innerRef?: any): ReactNode {
        return (
            <AddressInput
                ref={innerRef}
                {...(props as IAddressInputProps)}
                onAddressChange={(address) => {
                    const event = { target: { value: address } };
                    props.onChange?.(event as any);
                }}
                onValidateAddress={async (address) => {
                    // Custom address validation logic
                    return await validateAddressAPI(address);
                }}
            />
        );
    }
    
    // Custom focus behavior for complex component
    focus(): void {
        if (this._fieldRef && typeof this._fieldRef.focusFirstField === 'function') {
            this._fieldRef.focusFirstField();
        }
    }
}

interface IFormFieldAddressProps extends 
  IFormFieldProps<"address", IAddress, IAddressInputProps["onAddressChange"]>, 
  Omit<IAddressInputProps, "onAddressChange" | "ref"> {
  validateOnInput?: boolean;
  allowIncompleteAddress?: boolean;
}

declare module "@resk/core/resources" {
    export interface IFieldMap {
        address: IFormFieldAddressProps;
    }
}
```

### Example 2: File Upload Field

```tsx
import { FileUpload, IFileUploadProps, IFileData } from "@components/FileUpload";

@AttachFormField<"fileUpload">("fileUpload")
export class FormFieldFileUpload extends Form.Field<"fileUpload", IFileData[]> {
    
    isTextField(): boolean {
        return false;
    }
    
    sanitizeValue(value: any): IFileData[] {
        if (Array.isArray(value)) {
            return value.filter(file => file && typeof file === 'object' && file.id);
        }
        return [];
    }
    
    getValidationRules(): IValidatorRule[] {
        const rules = super.getValidationRules();
        
        if (this.props.maxFiles) {
            rules.push(`maxLength[${this.props.maxFiles}]` as IValidatorRule);
        }
        
        if (this.props.minFiles) {
            rules.push(`minLength[${this.props.minFiles}]` as IValidatorRule);
        }
        
        return rules;
    }
    
    _render(props: IField<"fileUpload", IFileData[]>, innerRef?: any): ReactNode {
        const { 
            maxFiles = 1, 
            acceptedFileTypes = ['image/*'], 
            maxFileSize = 5 * 1024 * 1024,
            uploadEndpoint = '/api/upload',
            ...uploadProps 
        } = props as any;
        
        return (
            <FileUpload
                ref={innerRef}
                maxFiles={maxFiles}
                acceptedFileTypes={acceptedFileTypes}
                maxFileSize={maxFileSize}
                uploadEndpoint={uploadEndpoint}
                {...uploadProps}
                onFilesChange={(files) => {
                    const event = { target: { value: files } };
                    props.onChange?.(event as any);
                }}
                onUploadError={(error) => {
                    console.error('File upload error:', error);
                }}
            />
        );
    }
}
```

### Example 3: Rich Text Editor Field

```tsx
import { RichTextEditor, IRichTextEditorProps } from "@components/RichTextEditor";

@AttachFormField<"richText">("richText")
export class FormFieldRichText extends Form.Field<"richText", string> {
    
    isTextField(): boolean {
        return true; // Contains text content
    }
    
    sanitizeValue(value: any): string {
        if (typeof value === 'string') {
            // Remove potentially harmful scripts while preserving formatting
            return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        return '';
    }
    
    getValidationRules(): IValidatorRule[] {
        const rules = super.getValidationRules();
        
        // Custom validation for rich text content
        if (this.props.minWords) {
            rules.push(`minWords[${this.props.minWords}]` as IValidatorRule);
        }
        
        if (this.props.maxWords) {
            rules.push(`maxWords[${this.props.maxWords}]` as IValidatorRule);
        }
        
        return rules;
    }
    
    _render(props: IField<"richText", string>, innerRef?: any): ReactNode {
        return (
            <RichTextEditor
                ref={innerRef}
                {...(props as IRichTextEditorProps)}
                onContentChange={(content) => {
                    const event = { target: { value: content } };
                    props.onChange?.(event as any);
                }}
                toolbar={this.props.toolbar || ['bold', 'italic', 'underline', 'link', 'list']}
                placeholder={props.placeholder}
            />
        );
    }
    
    // Custom keyboard event handling for rich text
    onKeyEvent(key: IKeyboardEventHandlerKey, event: IKeyboardEventHandlerEvent): void {
        if (key === 'ctrl+s') {
            // Save draft functionality
            this.saveDraft();
            return;
        }
        
        super.onKeyEvent(key, event);
    }
    
    private saveDraft(): void {
        const content = this.getValue();
        if (content && this.props.autoSave) {
            localStorage.setItem(`draft_${this.getName()}`, content);
        }
    }
}
```

---

## Best Practices

### 1. Field Design Principles

```tsx
// ✅ DO: Keep field components focused and single-purpose
@AttachFormField<"phoneNumber">("phoneNumber")
export class FormFieldPhoneNumber extends Form.Field<"phoneNumber", string> {
    // Focused on phone number input only
    _render(props: IField<"phoneNumber", string>, innerRef?: any): ReactNode {
        return <PhoneNumberInput {...props} ref={innerRef} />;
    }
}

// ❌ DON'T: Create overly complex multi-purpose fields
@AttachFormField<"complexField">("complexField")
export class FormFieldComplex extends Form.Field<"complexField", any> {
    // Trying to handle multiple different input types
    _render(props: IField<"complexField", any>, innerRef?: any): ReactNode {
        // Complex conditional rendering based on type
        if (props.subType === 'phone') return <PhoneInput {...props} />;
        if (props.subType === 'email') return <EmailInput {...props} />;
        if (props.subType === 'address') return <AddressInput {...props} />;
        // This should be separate field types instead
    }
}
```

### 2. Type Safety

```tsx
// ✅ DO: Provide comprehensive TypeScript interfaces
interface IFormFieldDateRangeProps extends 
  IFormFieldProps<"dateRange", IDateRange, IDateRangePickerProps["onChange"]>, 
  Omit<IDateRangePickerProps, "onChange" | "ref"> {
  
  minDate?: Date;
  maxDate?: Date;
  allowSameDay?: boolean;
  format?: string;
}

// ✅ DO: Use type guards for value validation
sanitizeValue(value: any): IDateRange {
    if (this.isValidDateRange(value)) {
        return value;
    }
    return { startDate: null, endDate: null };
}

private isValidDateRange(value: any): value is IDateRange {
    return value && 
           typeof value === 'object' && 
           (value.startDate instanceof Date || value.startDate === null) &&
           (value.endDate instanceof Date || value.endDate === null);
}
```

### 3. Performance Optimization

```tsx
// ✅ DO: Implement shouldComponentUpdate for expensive fields
export class FormFieldExpensive extends Form.Field<"expensive", any> {
    shouldComponentUpdate(nextProps: IField<"expensive", any>, nextState: any): boolean {
        // Only re-render if relevant props have changed
        return !this.compareValues(this.props.value, nextProps.value) ||
               this.props.disabled !== nextProps.disabled ||
               this.state.error !== nextState.error;
    }
    
    // Use React.memo for the underlying component
    _render(props: IField<"expensive", any>, innerRef?: any): ReactNode {
        return <MemoizedExpensiveComponent {...props} ref={innerRef} />;
    }
}
```

### 4. Error Handling

```tsx
// ✅ DO: Implement robust error handling
export class FormFieldRobust extends Form.Field<"robust", any> {
    _render(props: IField<"robust", any>, innerRef?: any): ReactNode {
        try {
            return <ComponentThatMightFail {...props} ref={innerRef} />;
        } catch (error) {
            console.error('Field rendering error:', error);
            return (
                <div className="field-error">
                    <Text>Field could not be rendered</Text>
                    {__DEV__ && <Text>{String(error)}</Text>}
                </div>
            );
        }
    }
    
    validate(options: IValidateOptions, force?: boolean): Promise<IValidateOptions> {
        try {
            return super.validate(options, force);
        } catch (error) {
            console.error('Validation error:', error);
            return Promise.reject(new Error('Validation failed'));
        }
    }
}
```

### 5. Accessibility

```tsx
// ✅ DO: Implement proper accessibility features
export class FormFieldAccessible extends Form.Field<"accessible", string> {
    _render(props: IField<"accessible", string>, innerRef?: any): ReactNode {
        const fieldId = `field-${this.getName()}`;
        const errorId = `error-${this.getName()}`;
        const helpId = `help-${this.getName()}`;
        
        return (
            <div>
                <label 
                    htmlFor={fieldId}
                    className="field-label"
                >
                    {props.label}
                    {props.required && <span aria-label="required">*</span>}
                </label>
                
                <AccessibleInput
                    id={fieldId}
                    ref={innerRef}
                    {...props}
                    aria-describedby={`${props.helpText ? helpId : ''} ${this.hasValidated() && !this.isValid() ? errorId : ''}`.trim()}
                    aria-invalid={this.hasValidated() && !this.isValid()}
                />
                
                {props.helpText && (
                    <div id={helpId} className="field-help">
                        {props.helpText}
                    </div>
                )}
                
                {this.canDisplayError() && (
                    <div 
                        id={errorId} 
                        className="field-error"
                        role="alert"
                        aria-live="polite"
                    >
                        {this.getErrorText()}
                    </div>
                )}
            </div>
        );
    }
}
```

### 6. Testing

```tsx
// ✅ DO: Create testable field components
export class FormFieldTestable extends Form.Field<"testable", string> {
    // Expose internal methods for testing
    public validateForTesting(value: string): Promise<boolean> {
        return this.validate({ value }).then(() => true).catch(() => false);
    }
    
    public getInternalStateForTesting() {
        return {
            value: this.getValue(),
            isValid: this.isValid(),
            hasValidated: this.hasValidated(),
            errorText: this.getErrorText()
        };
    }
    
    _render(props: IField<"testable", string>, innerRef?: any): ReactNode {
        return (
            <TestableInput
                {...props}
                ref={innerRef}
                data-testid={`field-${this.getName()}`}
                data-field-type="testable"
                data-field-valid={this.isValid()}
            />
        );
    }
}

// Testing example
describe('FormFieldTestable', () => {
    it('should validate correctly', async () => {
        const field = new FormFieldTestable({ 
            name: 'test', 
            type: 'testable',
            required: true 
        });
        
        const isValid = await field.validateForTesting('test value');
        expect(isValid).toBe(true);
        
        const state = field.getInternalStateForTesting();
        expect(state.isValid).toBe(true);
    });
});
```

---

## Summary

The Resk Form system's `Form.Field` and `Form.FieldRenderer` architecture provides a powerful, extensible foundation for creating sophisticated form interfaces. Key takeaways:

### Core Concepts

1. **Form.Field**: Abstract base class for all field types, providing validation, state management, and rendering capabilities
2. **Form.FieldRenderer**: Component bridge that instantiates and renders field instances within forms
3. **@AttachFormField**: Decorator for registering custom field types globally
4. **Registration System**: Global registry enabling dynamic field type resolution

### Development Workflow

1. **Extend Form.Field**: Create custom field classes inheriting core functionality
2. **Implement _render()**: Define how your field renders its UI component
3. **Apply @AttachFormField**: Register your field type globally
4. **Define TypeScript Interface**: Extend IFieldMap for type safety
5. **Export and Use**: Make your field available throughout the application

### Best Practices

- Keep field components focused and single-purpose
- Implement comprehensive TypeScript interfaces
- Add proper error handling and accessibility features
- Optimize performance for complex field types
- Create testable components with exposed internal methods

This architecture enables unlimited extensibility while maintaining type safety, performance, and developer experience across the entire form system.
