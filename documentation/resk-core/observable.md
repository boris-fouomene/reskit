# 👁️ Observable Pattern - @resk/core/observable

> **Reactive programming with event-driven architecture**

## 📖 Overview

The Observable module provides a powerful reactive programming system that enables event-driven architecture throughout your application. It implements the Observer pattern with TypeScript support, allowing objects to notify subscribers about state changes.

---

## 🏗️ Core Concepts

### **Observable Class**
The base class that provides observable capabilities to any object.

### **Event System**
Type-safe event handling with automatic subscription management.

### **Reactive State**
Automatic state synchronization and change notifications.

---

## 🚀 Basic Usage

### **Creating Observable Objects**

```typescript
import { ObservableClass, Observable } from '@resk/core/observable';

// Method 1: Extend ObservableClass
class User extends ObservableClass {
  private _name: string = '';
  
  get name(): string {
    return this._name;
  }
  
  set name(value: string) {
    const oldValue = this._name;
    this._name = value;
    
    // Notify observers of the change
    this.notify('nameChanged', { oldValue, newValue: value });
  }
}

// Method 2: Use @Observable decorator
@Observable()
class Product {
  name: string = '';
  price: number = 0;
  
  updatePrice(newPrice: number) {
    const oldPrice = this.price;
    this.price = newPrice;
    
    // Automatic notification (decorator handles this)
    this.notify('priceChanged', { oldPrice, newPrice });
  }
}
```

### **Subscribing to Events**

```typescript
const user = new User();

// Subscribe to specific events
user.observe('nameChanged', (data) => {
  console.log(`Name changed from ${data.oldValue} to ${data.newValue}`);
});

// Subscribe to all events
user.observe('*', (eventName, data) => {
  console.log(`Event ${eventName} triggered with data:`, data);
});

// Change the name (triggers observers)
user.name = 'John Doe'; // Console: "Name changed from  to John Doe"
```

---

## 🎭 Event Types and Interfaces

### **Event Callback Interface**

```typescript
export type IObservableCallback = (...args: any[]) => any;

// Specific event callback
type UserEventCallback = (data: { oldValue: string, newValue: string }) => void;

// Generic event callback
type GenericEventCallback = (eventName: string, ...data: any[]) => void;
```

### **Event Collection Interface**

```typescript
export type IObservableCallbacks<EventType extends string = string> = 
  Partial<Record<EventType, IObservableCallback[]>>;

// Example usage
interface UserEvents {
  nameChanged: (data: { oldValue: string, newValue: string }) => void;
  emailChanged: (data: { oldValue: string, newValue: string }) => void;
  profileUpdated: (user: User) => void;
}

type UserCallbacks = IObservableCallbacks<keyof UserEvents>;
```

---

## 🎯 Advanced Observable Features

### **Observable Factory**

```typescript
import { observableFactory } from '@resk/core/observable';

// Create observable with custom event types
interface ProductEvents {
  priceChanged: (oldPrice: number, newPrice: number) => void;
  stockUpdated: (newStock: number) => void;
  discontinued: () => void;
}

const product = observableFactory<ProductEvents>();

// Type-safe event subscription
product.observe('priceChanged', (oldPrice, newPrice) => {
  console.log(`Price changed from $${oldPrice} to $${newPrice}`);
});

product.observe('stockUpdated', (stock) => {
  if (stock === 0) {
    console.log('Product out of stock!');
  }
});
```

### **Event Chaining and Composition**

```typescript
class ShoppingCart extends ObservableClass {
  private items: Product[] = [];
  
  addItem(product: Product) {
    // Subscribe to product changes
    product.observe('priceChanged', (oldPrice, newPrice) => {
      this.notify('cartPriceChanged', { 
        product, 
        oldPrice, 
        newPrice,
        totalChange: newPrice - oldPrice 
      });
    });
    
    this.items.push(product);
    this.notify('itemAdded', { product, totalItems: this.items.length });
  }
  
  removeItem(product: Product) {
    const index = this.items.indexOf(product);
    if (index > -1) {
      this.items.splice(index, 1);
      
      // Unsubscribe from product events
      product.unobserve('priceChanged');
      
      this.notify('itemRemoved', { product, totalItems: this.items.length });
    }
  }
  
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}
```

---

## 🔧 Observable Decorators

### **@Observable() Class Decorator**

```typescript
@Observable()
class User {
  private _name: string = '';
  private _email: string = '';
  
  // Automatically creates observable properties
  @ObservableProperty()
  get name(): string {
    return this._name;
  }
  
  set name(value: string) {
    this._name = value;
    // Automatically triggers 'nameChanged' event
  }
  
  @ObservableProperty('emailUpdated') // Custom event name
  get email(): string {
    return this._email;
  }
  
  set email(value: string) {
    this._email = value;
    // Triggers 'emailUpdated' event
  }
}
```

### **@ObservableMethod() Decorator**

```typescript
@Observable()
class DataService {
  private data: any[] = [];
  
  @ObservableMethod('dataLoaded')
  async loadData(): Promise<any[]> {
    const response = await fetch('/api/data');
    this.data = await response.json();
    
    // Automatically triggers 'dataLoaded' event with result
    return this.data;
  }
  
  @ObservableMethod('dataFiltered')
  filterData(criteria: any): any[] {
    const filtered = this.data.filter(item => 
      Object.keys(criteria).every(key => item[key] === criteria[key])
    );
    
    // Triggers 'dataFiltered' event
    return filtered;
  }
}

// Usage
const service = new DataService();
service.observe('dataLoaded', (data) => {
  console.log('Data loaded:', data.length, 'items');
});

service.observe('dataFiltered', (filteredData) => {
  console.log('Filtered results:', filteredData.length, 'items');
});
```

---

## 🎪 Event Management

### **Subscription Management**

```typescript
class EventManager {
  private subscriptions: Array<() => void> = [];
  
  addSubscription(observable: ObservableClass, event: string, callback: Function) {
    observable.observe(event, callback);
    
    // Store unsubscription function
    this.subscriptions.push(() => {
      observable.unobserve(event, callback);
    });
  }
  
  cleanup() {
    // Unsubscribe from all events
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];
  }
}

// Usage
const manager = new EventManager();
const user = new User();

manager.addSubscription(user, 'nameChanged', (data) => {
  console.log('Name changed:', data);
});

// Clean up when component unmounts or object is destroyed
manager.cleanup();
```

### **Event Namespacing**

```typescript
class User extends ObservableClass {
  updateProfile(data: any) {
    // Namespace events for better organization
    this.notify('profile.updated', data);
    this.notify('profile.validation.success', data);
  }
  
  updatePreferences(preferences: any) {
    this.notify('preferences.updated', preferences);
    this.notify('preferences.saved', preferences);
  }
}

// Subscribe to namespaced events
user.observe('profile.*', (eventName, data) => {
  console.log('Profile event:', eventName, data);
});

user.observe('preferences.updated', (preferences) => {
  console.log('Preferences updated:', preferences);
});
```

---

## 🔄 State Synchronization

### **Two-Way Data Binding**

```typescript
class FormField extends ObservableClass {
  private _value: any = '';
  private _validation: { isValid: boolean, errors: string[] } = { 
    isValid: true, 
    errors: [] 
  };
  
  get value(): any {
    return this._value;
  }
  
  set value(newValue: any) {
    const oldValue = this._value;
    this._value = newValue;
    
    // Validate on change
    this.validate();
    
    // Notify subscribers
    this.notify('valueChanged', { oldValue, newValue, field: this });
  }
  
  get validation() {
    return this._validation;
  }
  
  private validate() {
    // Custom validation logic
    const errors: string[] = [];
    
    if (!this._value) {
      errors.push('Field is required');
    }
    
    this._validation = {
      isValid: errors.length === 0,
      errors
    };
    
    this.notify('validationChanged', this._validation);
  }
}

// Form controller
class Form extends ObservableClass {
  private fields: FormField[] = [];
  
  addField(field: FormField) {
    // Subscribe to field changes
    field.observe('valueChanged', () => {
      this.notify('formChanged', this.getFormData());
    });
    
    field.observe('validationChanged', () => {
      this.notify('validationChanged', this.getValidationState());
    });
    
    this.fields.push(field);
  }
  
  getFormData() {
    return this.fields.reduce((data, field, index) => {
      data[`field${index}`] = field.value;
      return data;
    }, {} as any);
  }
  
  getValidationState() {
    return {
      isValid: this.fields.every(field => field.validation.isValid),
      errors: this.fields.flatMap(field => field.validation.errors)
    };
  }
}
```

---

## 🎯 Real-World Examples

### **Model-View-Controller with Observables**

```typescript
// Model
@Observable()
class UserModel extends ObservableClass {
  private _users: User[] = [];
  
  get users(): User[] {
    return this._users;
  }
  
  async loadUsers() {
    const users = await fetch('/api/users').then(r => r.json());
    this._users = users;
    this.notify('usersLoaded', users);
  }
  
  addUser(user: User) {
    this._users.push(user);
    this.notify('userAdded', user);
    this.notify('usersChanged', this._users);
  }
  
  removeUser(userId: string) {
    const index = this._users.findIndex(u => u.id === userId);
    if (index > -1) {
      const removed = this._users.splice(index, 1)[0];
      this.notify('userRemoved', removed);
      this.notify('usersChanged', this._users);
    }
  }
}

// Controller
class UserController {
  constructor(
    private model: UserModel,
    private view: UserView
  ) {
    this.bindEvents();
  }
  
  private bindEvents() {
    // Model to View
    this.model.observe('usersLoaded', (users) => {
      this.view.displayUsers(users);
    });
    
    this.model.observe('userAdded', (user) => {
      this.view.addUserToList(user);
    });
    
    this.model.observe('userRemoved', (user) => {
      this.view.removeUserFromList(user);
    });
    
    // View to Model
    this.view.observe('createUserRequested', (userData) => {
      const user = new User(userData);
      this.model.addUser(user);
    });
    
    this.view.observe('deleteUserRequested', (userId) => {
      this.model.removeUser(userId);
    });
  }
}

// View
@Observable()
class UserView extends ObservableClass {
  displayUsers(users: User[]) {
    // Update UI with users
    console.log('Displaying users:', users);
  }
  
  addUserToList(user: User) {
    // Add user to UI
    console.log('Adding user to UI:', user);
  }
  
  removeUserFromList(user: User) {
    // Remove user from UI
    console.log('Removing user from UI:', user);
  }
  
  onCreateUserClick(userData: any) {
    this.notify('createUserRequested', userData);
  }
  
  onDeleteUserClick(userId: string) {
    this.notify('deleteUserRequested', userId);
  }
}
```

### **Real-time Data Synchronization**

```typescript
@Observable()
class RealTimeDataStore extends ObservableClass {
  private connection: WebSocket;
  private data: Map<string, any> = new Map();
  
  constructor(wsUrl: string) {
    super();
    this.initializeConnection(wsUrl);
  }
  
  private initializeConnection(wsUrl: string) {
    this.connection = new WebSocket(wsUrl);
    
    this.connection.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleServerMessage(message);
    };
    
    this.connection.onopen = () => {
      this.notify('connected');
    };
    
    this.connection.onclose = () => {
      this.notify('disconnected');
    };
  }
  
  private handleServerMessage(message: any) {
    switch (message.type) {
      case 'dataUpdate':
        this.updateData(message.key, message.value);
        break;
      case 'dataDeleted':
        this.deleteData(message.key);
        break;
    }
  }
  
  private updateData(key: string, value: any) {
    const oldValue = this.data.get(key);
    this.data.set(key, value);
    
    this.notify('dataChanged', { key, value, oldValue });
    this.notify(`dataChanged:${key}`, { value, oldValue });
  }
  
  private deleteData(key: string) {
    const deletedValue = this.data.get(key);
    this.data.delete(key);
    
    this.notify('dataDeleted', { key, deletedValue });
    this.notify(`dataDeleted:${key}`, { deletedValue });
  }
  
  subscribe(key: string, callback: (data: any) => void) {
    this.observe(`dataChanged:${key}`, ({ value }) => callback(value));
  }
  
  getData(key: string): any {
    return this.data.get(key);
  }
}

// Usage
const dataStore = new RealTimeDataStore('ws://localhost:8080');

// Subscribe to specific data changes
dataStore.subscribe('user:123', (userData) => {
  console.log('User 123 updated:', userData);
});

// Subscribe to connection events
dataStore.observe('connected', () => {
  console.log('Connected to real-time server');
});

dataStore.observe('disconnected', () => {
  console.log('Disconnected from server');
});
```

---

## ⚡ Performance Considerations

### **Memory Management**

```typescript
class MemoryEfficientObservable extends ObservableClass {
  private activeSubscriptions = new Set<string>();
  
  observe(event: string, callback: Function): void {
    super.observe(event, callback);
    this.activeSubscriptions.add(event);
  }
  
  unobserve(event: string, callback?: Function): void {
    super.unobserve(event, callback);
    
    // Clean up if no more listeners
    if (!this.hasObservers(event)) {
      this.activeSubscriptions.delete(event);
    }
  }
  
  destroy() {
    // Clean up all subscriptions
    this.activeSubscriptions.forEach(event => {
      this.unobserve(event);
    });
    this.activeSubscriptions.clear();
  }
}
```

### **Event Batching**

```typescript
class BatchedObservable extends ObservableClass {
  private batchedEvents: Map<string, any[]> = new Map();
  private batchTimeout: any;
  
  notify(event: string, data: any): void {
    // Batch events instead of immediate notification
    if (!this.batchedEvents.has(event)) {
      this.batchedEvents.set(event, []);
    }
    
    this.batchedEvents.get(event)!.push(data);
    
    // Schedule batch processing
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => {
        this.processBatch();
      }, 0);
    }
  }
  
  private processBatch() {
    this.batchedEvents.forEach((dataArray, event) => {
      super.notify(event, dataArray);
    });
    
    this.batchedEvents.clear();
    this.batchTimeout = null;
  }
}
```

---

## 🎯 Best Practices

### **1. Type Safety**
```typescript
// ✅ Good: Define event interfaces
interface UserEvents {
  nameChanged: (data: { oldValue: string, newValue: string }) => void;
  emailChanged: (data: { oldValue: string, newValue: string }) => void;
}

class TypedUser extends ObservableClass<UserEvents> {
  // Type-safe event notifications
}

// ❌ Avoid: Untyped events
class UntypedUser extends ObservableClass {
  // Events are not type-checked
}
```

### **2. Event Naming**
```typescript
// ✅ Good: Descriptive, consistent naming
this.notify('userProfileUpdated', data);
this.notify('validation.emailFailed', errors);
this.notify('api.dataLoaded', response);

// ❌ Avoid: Generic or unclear names
this.notify('change', data);
this.notify('event', data);
this.notify('update', data);
```

### **3. Memory Management**
```typescript
// ✅ Good: Always clean up subscriptions
class Component {
  private subscriptions: Array<() => void> = [];
  
  componentDidMount() {
    const unsubscribe = user.observe('nameChanged', this.handleNameChange);
    this.subscriptions.push(unsubscribe);
  }
  
  componentWillUnmount() {
    this.subscriptions.forEach(unsub => unsub());
  }
}
```

---

The Observable pattern in @resk/core provides a powerful foundation for building reactive, event-driven applications with full TypeScript support and excellent performance characteristics.
