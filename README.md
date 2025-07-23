# ResKit Framework - Complete User Guide

> **ResKit** is a modern, cross-platform TypeScript framework that empowers developers to build scalable applications with a fully decorator-based architecture for efficient resource management, featuring universal UI components, seamless server-side integration, and enhanced code clarity and maintainability.

## 🎯 What is ResKit?

ResKit is a **comprehensive ecosystem** consisting of three powerful packages that work together to provide a complete development solution:

- **🧠 @resk/core** - Decorator-driven resource management and business logic
- **🎨 @resk/nativewind** - Cross-platform SSR-optimized UI component library provides 50+ meticulously crafted UI components designed for universal React applications. Built from the ground up with **Server-Side Rendering (SSR)**, **cross-platform compatibility**, and **performance** as core principles, these components work seamlessly across **Next.js**, **React Native**, **Expo**, **Web**, and **Node.js** environments.components
- **🚀 @resk/nest** - NestJS extension package that provides pre-built modules, controllers, services, and utilities for rapid API development. It integrates seamlessly with @resk/core and offers powerful abstractions for common backend patterns including resource management, authentication, database integration, and internationalization.NestJS integration for robust backend development

### The Vision

ResKit solves the common challenge of building applications that work **seamlessly across platforms** while maintaining **clean, maintainable code architecture**. Built on the principle of **"Write Less, Achieve More"**, ResKit embraces a resource-oriented architecture where every component is treated as a resource that can be decorated, extended, and managed efficiently, providing the tools to create consistent, high-quality solutions across mobile, web, and server applications.ResKit solves the common challenge of building applications that work **seamlessly across platforms** while maintaining **clean, maintainable code architecture**. Whether you're building a mobile app, web application, or server API, ResKit provides the tools to create consistent, high-quality solutions.

## 🌟 Why Choose ResKit?

### 🎯 **"Write Less, Achieve More" Philosophy**

ResKit revolutionizes development by dramatically reducing code complexity while maximizing functionality. Our decorator-driven approach transforms hundreds of lines of boilerplate into elegant, expressive declarations.


| Feature             | Traditional Approach             | ResKit Approach                |
| ------------------- | -------------------------------- | ------------------------------ |
| **Code Volume**     | Hundreds of lines for basic CRUD | Few decorators and you're done |
| **Type Safety**     | Manual type definitions          | Automatic type inference       |
| **Consistency**     | Varies across developers         | Enforced patterns              |
| **Maintainability** | Complex refactoring              | Decorator-based changes        |
| **Learning Curve**  | Framework-specific APIs          | Intuitive decorator syntax     |

### ✅ **Universal Architecture**

- **One codebase, multiple platforms**: Write once, deploy everywhere (web, mobile, desktop)
- **SSR-optimized**: First-class server-side rendering support for better performance and SEO
- **Type-safe**: Full TypeScript support with comprehensive type definitions

### ✅ **Developer Experience**

- **Decorator-driven**: Intuitive, clean syntax using TypeScript decorators
- **Resource-oriented**: Everything is a resource - consistent mental model

### ✅ **Production Ready**

- **433+ tests**: Comprehensive test coverage ensuring reliability
- **Framework agnostic**: Works with Next.js, Expo, React Native, and NestJS
- **Performance optimized**: Built for scale with efficient rendering and caching
- **Battle-tested**: Used in production applications across various industries

### ✅ **Ecosystem Integration**

- **NativeWind powered**: Tailwind CSS for React Native with universal styling
- **NestJS compatible**: Seamless backend integration with decorators and modules
- **Modern tooling**: Built with the latest TypeScript and build tools
- **Zero-config**: Sensible defaults that work out of the box

## 🚀 Getting Started

### Prerequisites

```bash
# Required versions
node >= 18.x
npm >= 9.x
typescript >= 5.x
```

### Quick Installation

```bash
# Install all ResKit packages
npm install @resk/core @resk/nativewind @resk/nest

# Essential peer dependencies
npm install reflect-metadata nativewind tailwindcss

# For React Native projects
npm install react-native react-native-web react-native-svg

# For Next.js projects  
npm install next react react-dom
```

### Project Setup

#### 1. TypeScript Configuration

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "jsx": "react-jsx",
    "jsxImportSource": "nativewind",
    "module": "esnext",
    "moduleResolution": "node",
    "target": "es2020",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

#### 2. Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Your custom theme
    }
  },
  plugins: [require('@resk/nativewind/theme-to-css-vars')]
};
```

## 📦 Package Deep Dive

### 🧠 @resk/core - Resource Management

The **core** package provides the foundation for building resource-oriented applications using TypeScript decorators.

#### Key Concepts

**Resources** are the fundamental building blocks - entities that represent your data and business logic:

```typescript
import { Resource, Field } from '@resk/core';

@Resource({
  name: 'user',
  label: 'User Account',
  title: 'User Management'
})
class User {
  @Field.Text({ 
    label: 'Full Name',
    required: true,
    maxLength: 100 
  })
  name: string;

  @Field.Email({ 
    label: 'Email Address',
    unique: true 
  })
  email: string;

  @Field.DateTime({ 
    label: 'Created At',
    readOnly: true 
  })
  createdAt: Date;

  @Field.Select({
    label: 'Role',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]
  })
  role: 'admin' | 'user';
}
```

#### Core Features

**🔍 Validation System**

```typescript
import { Validator } from '@resk/core';

const userValidator = new Validator(User);

// Validate data against resource schema
const result = userValidator.validate({
  name: 'John Doe',
  email: 'invalid-email', // Will fail validation
  role: 'admin'
});

if (!result.isValid) {
  console.log(result.errors); // Detailed validation errors
}
```

**🌍 Internationalization**

```typescript
import { i18n } from '@resk/core';

// Configure multiple languages
i18n.configure({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',
  directory: './locales'
});

// Use in your code
const welcomeMessage = i18n.__('welcome.title');
```

**🔐 Authentication**

```typescript
import { Auth } from '@resk/core';

// User authentication
const authResult = await Auth.login({
  email: 'user@example.com',
  password: 'securePassword'
});

if (authResult.success) {
  const currentUser = Auth.getCurrentUser();
  console.log('Logged in as:', currentUser.name);
}
```

### 🎨 @resk/nativewind - Universal UI Components

The **nativewind** package provides 40+ pre-built components that work seamlessly across web and mobile platforms.

#### Application Setup

```tsx
import React from 'react';
import { AppRoot } from '@resk/nativewind';

export default function App() {
  return (
    <AppRoot>
      {/* Your app content */}
      <YourMainComponent />
    </AppRoot>
  );
}
```

#### Component Library

**📝 Forms & Inputs**

```tsx
import { 
  TextInput, 
  Button, 
  Dropdown, 
  Checkbox, 
  Switch 
} from '@resk/nativewind';

function ContactForm() {
  return (
    <form>
      <TextInput
        label="Full Name"
        placeholder="Enter your name"
        variant={{ colorScheme: 'primary' }}
        required
      />
  
      <TextInput
        type="email"
        label="Email"
        placeholder="Enter your email"
        variant={{ focusedBorderColor: 'success' }}
      />
  
      <Dropdown
        label="Country"
        items={[
          { label: 'United States', value: 'us' },
          { label: 'Canada', value: 'ca' },
          { label: 'United Kingdom', value: 'uk' }
        ]}
      />
  
      <Button 
        label="Submit"
        variant={{ colorScheme: 'primary' }}
        icon="send"
      />
    </form>
  );
}
```

**🎯 Layout & Navigation**

```tsx
import { 
  AppBar, 
  VStack, 
  HStack, 
  Surface, 
  Divider 
} from '@resk/nativewind';

function Layout({ children }) {
  return (
    <VStack className="flex-1">
      <AppBar
        title="My App"
        variant={{ colorScheme: 'primary' }}
        leading={<Icon name="menu" />}
        actions={[
          <Icon name="search" />,
          <Icon name="notifications" />
        ]}
      />
  
      <Surface className="flex-1 p-4">
        {children}
      </Surface>
    </VStack>
  );
}
```

**💬 Interactive Components**

```tsx
import { 
  Dialog, 
  BottomSheet, 
  Alert, 
  Menu, 
  Tooltip 
} from '@resk/nativewind';

function InteractiveDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <>
      <Button 
        label="Open Dialog"
        onPress={() => setDialogOpen(true)}
      />
  
      <Dialog
        visible={dialogOpen}
        onDismiss={() => setDialogOpen(false)}
        title="Confirmation"
        content="Are you sure you want to proceed?"
        actions={[
          { label: 'Cancel', onPress: () => setDialogOpen(false) },
          { label: 'Confirm', onPress: handleConfirm }
        ]}
      />
  
      <Alert
        type="success"
        title="Success!"
        message="Operation completed successfully"
        visible={showAlert}
      />
    </>
  );
}
```

#### SSR Optimization

**🔄 SSRScrollView** - Optimized scrolling for server-side rendering:

```tsx
import { SSRScrollView } from '@resk/nativewind';

function ProductList({ products }) {
  return (
    <SSRScrollView
      horizontal={true}
      snapScrolling={true}
      showsHorizontalScrollIndicator={false}
      className="h-64"
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SSRScrollView>
  );
}
```

#### Styling System

ResKit uses **NativeWind** (Tailwind for React Native) with additional variant system:

```tsx
import { Button } from '@resk/nativewind';

// Tailwind classes work directly
<Button className="bg-blue-500 text-white rounded-lg px-4 py-2" />

// Variant system for consistent theming
<Button 
  variant={{ 
    colorScheme: 'primary',
    size: 'lg',
    rounded: 'md',
    outline: true
  }}
/>

// Combined approach
<Button 
  variant={{ colorScheme: 'success' }}
  className="shadow-lg m-4"
/>
```

### 🚀 @resk/nest - Server Integration

The **nest** package provides seamless integration with NestJS for building robust backend APIs.

#### Quick Server Setup

```typescript
import { createApp } from '@resk/nest';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await createApp(AppModule, {
    globalPrefix: 'api',
    versioningOptions: {
      enabled: true,
      defaultVersion: '1'
    },
    swaggerOptions: {
      enabled: true,
      path: 'docs',
      title: 'My API',
      description: 'API documentation'
    }
  });
  
  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}

bootstrap();
```

#### Resource-Based API

```typescript
import { ResourceController, ResourceService } from '@resk/nest';
import { User } from './user.resource';

@ResourceController('users')
export class UserController extends ResourceController<User> {
  constructor(private userService: ResourceService<User>) {
    super(userService);
  }
  
  // Automatically provides:
  // GET /api/v1/users - List users with pagination
  // GET /api/v1/users/:id - Get user by ID
  // POST /api/v1/users - Create user
  // PUT /api/v1/users/:id - Update user
  // DELETE /api/v1/users/:id - Delete user
}
```

#### Authentication & Guards

```typescript
import { AuthGuard, RolesGuard } from '@resk/nest';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles('admin')
  getDashboard() {
    return { message: 'Admin dashboard data' };
  }
}
```

## 🛠️ Complete Example: Building a Todo App

Let's build a complete todo application using all three ResKit packages:

### 1. Define the Resource (@resk/core)

```typescript
// todo.resource.ts
import { Resource, Field } from '@resk/core';

@Resource({
  name: 'todo',
  label: 'Todo Item',
  title: 'Todo Management'
})
export class Todo {
  @Field.Text({
    label: 'ID',
    readOnly: true
  })
  id: string;

  @Field.Text({
    label: 'Title',
    required: true,
    maxLength: 100
  })
  title: string;

  @Field.LongText({
    label: 'Description',
    maxLength: 500
  })
  description: string;

  @Field.Boolean({
    label: 'Completed',
    defaultValue: false
  })
  completed: boolean;

  @Field.Select({
    label: 'Priority',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' }
    ],
    defaultValue: 'medium'
  })
  priority: 'low' | 'medium' | 'high';

  @Field.DateTime({
    label: 'Due Date'
  })
  dueDate: Date;

  @Field.DateTime({
    label: 'Created At',
    readOnly: true
  })
  createdAt: Date;
}
```

### 2. Create the UI (@resk/nativewind)

```tsx
// TodoApp.tsx
import React, { useState } from 'react';
import {
  AppRoot,
  VStack,
  HStack,
  Surface,
  TextInput,
  Button,
  Dropdown,
  Checkbox,
  Text,
  Divider,
  AppBar,
  SSRScrollView
} from '@resk/nativewind';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const
  });

  const addTodo = () => {
    const todo: Todo = {
      id: Date.now().toString(),
      ...newTodo,
      completed: false,
      createdAt: new Date(),
      dueDate: new Date()
    };
  
    setTodos([...todos, todo]);
    setNewTodo({ title: '', description: '', priority: 'medium' });
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  return (
    <AppRoot>
      <VStack className="flex-1">
        <AppBar
          title="Todo App"
          variant={{ colorScheme: 'primary' }}
        />
  
        <Surface className="p-4">
          <VStack className="gap-4">
            <Text className="text-xl font-bold">Add New Todo</Text>
  
            <TextInput
              label="Title"
              value={newTodo.title}
              onChangeText={(title) => setNewTodo({ ...newTodo, title })}
              placeholder="Enter todo title"
              variant={{ colorScheme: 'primary' }}
            />
  
            <TextInput
              label="Description"
              value={newTodo.description}
              onChangeText={(description) => setNewTodo({ ...newTodo, description })}
              placeholder="Enter description"
              multiline
              numberOfLines={3}
            />
  
            <Dropdown
              label="Priority"
              value={newTodo.priority}
              onValueChange={(priority) => setNewTodo({ ...newTodo, priority })}
              items={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' }
              ]}
            />
  
            <Button
              label="Add Todo"
              onPress={addTodo}
              variant={{ colorScheme: 'primary' }}
              disabled={!newTodo.title.trim()}
            />
          </VStack>
        </Surface>
  
        <Divider />
  
        <SSRScrollView className="flex-1">
          <VStack className="p-4 gap-2">
            <Text className="text-xl font-bold mb-4">
              Todo List ({todos.length} items)
            </Text>
  
            {todos.map((todo) => (
              <Surface
                key={todo.id}
                className="p-4 rounded-lg border"
                variant={{ elevation: 1 }}
              >
                <HStack className="items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
  
                  <VStack className="flex-1">
                    <Text
                      className={`font-semibold ${
                        todo.completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {todo.title}
                    </Text>
  
                    {todo.description && (
                      <Text className="text-sm text-gray-600">
                        {todo.description}
                      </Text>
                    )}
  
                    <HStack className="gap-2 mt-2">
                      <Text
                        className={`text-xs px-2 py-1 rounded ${
                          todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                          todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {todo.priority.toUpperCase()}
                      </Text>
  
                      <Text className="text-xs text-gray-500">
                        Created: {todo.createdAt.toLocaleDateString()}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Surface>
            ))}
  
            {todos.length === 0 && (
              <Surface className="p-8 text-center">
                <Text className="text-gray-500">
                  No todos yet. Add one above!
                </Text>
              </Surface>
            )}
          </VStack>
        </SSRScrollView>
      </VStack>
    </AppRoot>
  );
}
```

### 3. Backend API (@resk/nest)

```typescript
// todo.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ResourceController, ResourceService } from '@resk/nest';
import { Todo } from './todo.resource';

@Controller('api/v1/todos')
export class TodoController extends ResourceController<Todo> {
  constructor(private todoService: ResourceService<Todo>) {
    super(todoService);
  }

  @Get('stats')
  async getStats() {
    const todos = await this.todoService.findAll();
  
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      pending: todos.filter(t => !t.completed).length,
      byPriority: {
        high: todos.filter(t => t.priority === 'high').length,
        medium: todos.filter(t => t.priority === 'medium').length,
        low: todos.filter(t => t.priority === 'low').length
      }
    };
  }
}

// todo.module.ts
import { Module } from '@nestjs/common';
import { ResourceModule } from '@resk/nest';
import { TodoController } from './todo.controller';
import { Todo } from './todo.resource';

@Module({
  imports: [ResourceModule.forFeature([Todo])],
  controllers: [TodoController]
})
export class TodoModule {}
```

### 4. App Integration

```typescript
// main.ts (Backend)
import { createApp } from '@resk/nest';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await createApp(AppModule, {
    globalPrefix: 'api',
    versioningOptions: { enabled: true },
    swaggerOptions: {
      enabled: true,
      title: 'Todo API',
      description: 'A simple todo API built with ResKit'
    }
  });
  
  await app.listen(3000);
}

bootstrap();
```

```tsx
// App.tsx (Frontend - Next.js)
import { TodoApp } from './components/TodoApp';

export default function Home() {
  return <TodoApp />;
}
```

## 📱 Platform Deployment

### Next.js (Web)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### Expo (Mobile)

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "build": "expo build"
  }
}
```

### NestJS (Backend)

```json
{
  "scripts": {
    "start:dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

script

### Component Variants

```tsx
import { Button } from '@resk/nativewind';

// Custom variant combinations
<Button 
  variant={{
    colorScheme: 'brand',
    size: 'lg',
    rounded: 'full',
    shadow: 'lg'
  }}
  className="px-8"
/>
```

## 📚 Learning Path

### 1. **Beginner** (Start Here)

- Set up a basic project with @resk/core
- Create your first resource with decorators
- Build simple UI with @resk/nativewind components

### 2. **Intermediate**

- Implement validation and forms
- Add internationalization
- Create custom components and variants

### 3. **Advanced**

- Build full-stack applications with @resk/nest
- Implement authentication and authorization
- Deploy to production with SSR optimization

## 🔧 Best Practices

### ✅ Resource Design

- Keep resources focused and cohesive
- Use descriptive field labels and validation
- Leverage TypeScript types for type safety

### ✅ Component Usage

- Use variant system for consistent theming
- Combine with Tailwind classes for fine-tuning
- Optimize for SSR with SSRScrollView

### ✅ Performance

- Use lazy loading for large lists
- Implement proper caching strategies
- Optimize bundle size with tree shaking

## 🤝 Community & Support

- **Documentation**: [ResKit Docs](https://github.com/boris-fouomene/reskit)
- **Examples**: Comprehensive examples in `/examples`
- **Issues**: GitHub Issues for bug reports
- **Discussions**: Community discussions and questions

---

**ResKit empowers you to build modern, scalable applications with a unified architecture across all platforms. Start building today!** 🚀
