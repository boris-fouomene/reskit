# AppBar Component - Complete User Guide

A powerful, responsive application bar component for React Native and React applications. The AppBar provides a consistent header interface with intelligent action management, responsive behavior, and extensive customization options.

## Table of Contents

- [What is AppBar?](#what-is-appbar)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [AppBar Actions System](#appbar-actions-system)
- [Responsive Behavior](#responsive-behavior)
- [Visibility Priority System](#visibility-priority-system)
- [Layout and Navigation](#layout-and-navigation)
- [Styling and Theming](#styling-and-theming)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)
- [Examples](#examples)

## What is AppBar?

The AppBar is a top-level navigation component that serves as the primary header for your application screens. It provides a consistent interface for displaying titles, navigation controls, and contextual actions across your entire application.

### When to Use AppBar

- **Screen headers** - Every major screen in your app should have an AppBar
- **Navigation bars** - For apps with complex navigation hierarchies
- **Action toolbars** - When you need quick access to screen-specific actions
- **Modal headers** - For dialogs and modal screens that need structured headers
- **Drawer headers** - In navigation drawers and side panels

### Core Concepts

The AppBar is built around three main concepts:

1. **Content Area** - Displays titles, subtitles, and branding
2. **Navigation Area** - Back buttons and navigation controls
3. **Actions Area** - Contextual actions with intelligent overflow management

## Key Features

### 🎯 Intelligent Action Management

- **Responsive overflow** - Actions automatically move to overflow menu based on screen size
- **Priority-based visibility** - Higher priority actions stay visible longer
- **Smart menu button** - Only appears when needed (accounts for its own space)
- **Single action optimization** - No menu for single actions

### 📱 Responsive Design

- **Viewport-aware** - Adapts to any container size (window, drawer, modal)
- **18 breakpoints** - Covers all device sizes from mobile to 8K displays
- **Progressive disclosure** - Graceful degradation as space decreases
- **Container-agnostic** - Works in constrained spaces

### 🎨 Flexible Styling

- **Design system integration** - Works with your existing design tokens
- **Multiple variants** - Primary, secondary, surface, ghost themes
- **Custom styling** - Full CSS class customization support
- **Platform adaptation** - Automatic iOS/Android height adjustments

### ♿ Accessibility First

- **Screen reader support** - Comprehensive ARIA labels and hints
- **Keyboard navigation** - Full keyboard accessibility
- **Focus management** - Proper focus handling for overflow menus
- **Color contrast** - High contrast mode support
  onPress: handleShare,
  visibilityPriority: 75

---

## Core Concepts

### 1. **Responsive Actions System**
The AppBar automatically manages action visibility based on available screen space:
- **Direct Actions**: Visible buttons in the AppBar
- **Overflow Menu**: Hidden actions accessible via "⋯" menu
- **Smart Allocation**: Accounts for menu button taking one action slot

### 2. **Visibility Priority System**
Actions use numeric priorities to determine visibility order:
- **90-100**: Critical actions (always visible)
- **70-89**: High priority actions
- **40-69**: Normal priority actions (default: 50)
- **20-39**: Low priority actions
- **1-19**: Optional actions

### 3. **Context-Aware Behavior**
The AppBar adapts to different container contexts:
- **Full Window**: Uses full viewport width
- **Constrained Containers**: Adjusts for drawers, modals, sidebars
- **Dynamic Sizing**: Responds to container width changes

---

## Basic Usage

### Simple Title Bar

```tsx
<AppBar title="Settings" />
```

### With Back Navigation

```tsx
<AppBar
  title="User Profile"
  onBackActionPress={() => router.back()}
  backActionPosition="left" // default
/>
```

### Title with Subtitle

```tsx
<AppBar
  title="Dashboard"
  subtitle="Last updated: 2 minutes ago"
  titleVariant="heading-lg"
  subtitleVariant="body-sm"
/>
```

### Custom Styling

```tsx
<AppBar
  title="My App"
  variant={{ colorScheme: "primary" }}
  className="shadow-lg border-b"
  titleClassName="font-bold text-white"
  contentClassName="bg-gradient-to-r from-blue-500 to-purple-600"
/>
```

---

## Advanced Features

### Custom Layout Areas

```tsx
<AppBar
  title="Messages"
  left={<Logo size="sm" />}
  right={
    <div className="flex items-center gap-2">
      <NotificationBell />
      <UserAvatar />
    </div>
  }
/>
```

### Dynamic Content with Context

```tsx
interface MyContext {
  user: User;
  theme: 'light' | 'dark';
}

<AppBar<MyContext>
  title="Profile"
  context={{ user, theme }}
  left={({ computedAppBarVariant, context }) => (
    <div className="flex items-center gap-2">
      <Avatar src={context.user.avatar} />
      <span className={computedAppBarVariant === 'primary' ? 'text-white' : 'text-black'}>
        {context.user.name}
      </span>
    </div>
  )}
  right={({ context }) => (
    context.user.isAdmin ? <AdminPanel /> : <UserMenu />
  )}
/>
```

### Custom Back Action

```tsx
<AppBar
  title="Settings"
  // Custom back button with render function
  backAction={({ handleBackPress, computedAppBarVariant }) => (
    <Button
      variant={computedAppBarVariant === "primary" ? "ghost" : "outline"}
      onPress={handleBackPress}
      leftIcon="chevron-left"
    >
      Back to Dashboard
    </Button>
  )}
/>

// Or disable back action entirely
<AppBar title="Home" backAction={false} />
```

---

## Responsive Actions System

### Basic Actions

```tsx
const actions: IAppBarActionProps[] = [
  {
    id: 'save',
    label: 'Save Document',
    fontIconName: 'save',
    onPress: handleSave,
    visibilityPriority: 90, // High priority - stays visible longer
    accessibility: {
      label: 'Save the current document',
      hint: 'Saves your changes permanently'
    }
  },
  {
    id: 'share',
    label: 'Share',
    fontIconName: 'share',
    onPress: handleShare,
    visibilityPriority: 75,
    minViewportWidth: 768 // Only show on tablet+ screens
  },
  {
    id: 'export',
    label: 'Export PDF',
    fontIconName: 'download',
    onPress: handleExport,
    visibilityPriority: 50 // Normal priority
  },
  {
    id: 'archive',
    label: 'Archive',
    fontIconName: 'archive',
    onPress: handleArchive,
    visibilityPriority: 25, // Low priority - first to overflow
    group: 'file-management'
  }
];

<AppBar title="Document Editor" actions={actions} />
```

### Priority-Based Visibility

```tsx
// Define custom priority constants
const PRIORITY = {
  EMERGENCY: 100,
  CRITICAL: 90,
  HIGH: 75,
  NORMAL: 50,
  LOW: 25,
  OPTIONAL: 10
} as const;

const actions = [
  {
    id: 'emergency-stop',
    label: 'Emergency Stop',
    visibilityPriority: PRIORITY.EMERGENCY,
    alwaysVisible: true // Always visible regardless of space
  },
  {
    id: 'save',
    label: 'Save',
    visibilityPriority: PRIORITY.CRITICAL
  },
  {
    id: 'advanced-options',
    label: 'Advanced',
    visibilityPriority: user.isExpert ? PRIORITY.HIGH : PRIORITY.OPTIONAL
  }
];
```

### Custom Responsive Configuration

```tsx
const customResponsiveConfig = {
  breakpoints: [
    { width: 1200, maxActions: 6 }, // Desktop: 6 actions
    { width: 768, maxActions: 4 },  // Tablet: 4 actions  
    { width: 480, maxActions: 2 },  // Mobile landscape: 2 actions
    { width: 320, maxActions: 1 }   // Mobile portrait: 1 action
  ],
  defaultMaxActions: 1
};

<AppBar
  title="Dashboard"
  actions={actions}
  actionsProps={{
    responsiveConfig: customResponsiveConfig,
    viewportWidth: containerWidth, // Custom viewport calculation
    overflowMenuAccessibilityLabel: "More dashboard actions"
  }}
/>
```

### Constrained Contexts (Drawer, Modal)

```tsx
// For drawer or modal contexts with limited width
<AppBar
  title="Drawer Navigation"
  actions={actions}
  actionsProps={{
    viewportWidth: 350, // Drawer width
    responsiveConfig: {
      breakpoints: [
        { width: 400, maxActions: 3 },
        { width: 300, maxActions: 2 },
        { width: 200, maxActions: 1 }
      ],
      defaultMaxActions: 1
    }
  }}
/>
```

---

## Customization

### Overflow Menu Customization

```tsx
<AppBar
  title="Dashboard"
  actions={actions}
  actionsProps={{
    menuProps: {
      // Anchor button customization
      anchorClassName: "text-primary hover:bg-primary/10",
      anchorIconSize: 24,
      anchorClosedIconName: "more-vertical",  // Icon when menu is closed
      anchorOpenIconName: "x",               // Icon when menu is open
      anchorIconVariant: "ghost",
    
      // Menu behavior
      preferredPosition: "bottom-end",
      showBackdrop: true,
      closeOnItemSelect: true,
    
      // Menu styling
      className: "min-w-48 shadow-lg rounded-lg",
      itemClassName: "px-4 py-2 hover:bg-gray-100",
    
      // Custom anchor element
      anchor: ({ menu }) => (
        <CustomMenuButton onPress={() => menu?.open()} />
      )
    }
  }}
/>
```

### Action Styling

```tsx
<AppBar
  title="Styled Actions"
  actions={actions}
  actionsProps={{
    actionClassName: "mx-1 hover:bg-gray-100 rounded-lg transition-colors",
    actionMenuItemClassName: "px-4 py-2 text-left hover:bg-primary/10"
  }}
  actionsClassName="gap-2 px-4 border-l border-gray-200"
/>
```

### Custom Action Rendering

```tsx
<AppBar
  title="Custom Actions"
  actions={actions}
  actionsProps={{
    renderAction: (action, index) => (
      <CustomActionButton
        key={action.id}
        variant={action.visibilityPriority > 80 ? 'primary' : 'ghost'}
        tooltip={action.label}
        {...action}
      />
    ),
    renderExpandableAction: (action, index) => (
      <DropdownActionButton
        key={action.id}
        items={action.items}
        {...action}
      />
    )
  }}
/>
```

### Variants and Themes

```tsx
// Primary variant
<AppBar
  title="Primary Theme"
  variant={{ colorScheme: "primary" }}
  actions={actions}
/>

// Custom variant
<AppBar
  title="Custom Theme"
  variant={{ 
    colorScheme: "surface",
    size: "lg",
    elevation: 2
  }}
  className="bg-gradient-to-r from-indigo-500 to-purple-600"
/>
```

---

## Context & Performance

### Extended Context

```tsx
interface AppContext {
  user: User;
  permissions: Permission[];
  preferences: UserPreferences;
}

<AppBar<AppContext>
  title="Application"
  context={{ user, permissions, preferences }}
  actions={[
    {
      id: 'admin-panel',
      label: 'Admin Panel',
      render: ({ context }) => (
        context.permissions.includes('admin') ? (
          <AdminButton />
        ) : null
      )
    },
    {
      id: 'theme-toggle',
      label: 'Toggle Theme',
      render: ({ context }) => (
        <ThemeToggle 
          currentTheme={context.preferences.theme}
          onToggle={handleThemeToggle}
        />
      )
    }
  ]}
/>
```

### Performance Optimizations

```tsx
// For large action lists (50+ actions)
<AppBar
  title="Performance Optimized"
  actions={largeActionList}
  actionsProps={{
    enableVirtualization: true, // Enable virtual scrolling in overflow menu
    hydrationFallback: <Skeleton width={100} height={40} />, // SSR optimization
  }}
/>
```

### Viewport-Aware Context

```tsx
<AppBar
  title="Responsive App"
  actions={actions}
  actionsProps={{
    context: {
      appBarVariant: "primary",
      viewport: { width: windowWidth, height: windowHeight },
      isConstrained: isInDrawer,
      performance: {
        enableVirtualization: actionCount > 50,
        enableMemoization: true
      }
    }
  }}
/>
```

---

## Accessibility

### Screen Reader Support

```tsx
<AppBar
  title="Accessible App"
  actions={[
    {
      id: 'save',
      label: 'Save',
      accessibility: {
        label: 'Save the current document to your device',
        hint: 'Press to permanently save your changes',
        role: 'button'
      }
    }
  ]}
  actionsProps={{
    accessibilityLabel: "Document actions toolbar",
    overflowMenuAccessibilityLabel: "More document actions"
  }}
/>
```

### Keyboard Navigation

```tsx
<AppBar
  title="Keyboard Accessible"
  actions={actions.map(action => ({
    ...action,
    // Ensure keyboard accessibility
    onPress: (event) => {
      // Handle both click and keyboard events
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      action.onPress?.(event);
    }
  }))}
/>
```

---

## Migration Guide

### From Priority Enum to Numbers

```tsx
// ❌ Old approach (still works but deprecated)
import { IAppBarActionPriority } from '@resk/nativewind/components/AppBar';

const oldActions = [
  {
    id: 'save',
    priority: IAppBarActionPriority.HIGH // Enum value
  }
];

// ✅ New recommended approach
const newActions = [
  {
    id: 'save',
    visibilityPriority: 80 // Direct number for flexibility
  }
];

// ✅ Best practice: Define your own constants
const PRIORITY = {
  EMERGENCY: 100,
  CRITICAL: 90,
  HIGH: 75,
  NORMAL: 50,
  LOW: 25
} as const;

const bestPracticeActions = [
  {
    id: 'save',
    visibilityPriority: PRIORITY.HIGH
  }
];
```

### Responsive Configuration Migration

```tsx
// ✅ Updated responsive config accounting for menu button slot
const modernConfig = {
  breakpoints: [
    { width: 1024, maxActions: 5 }, // Shows 4 actions + 1 menu button if needed
    { width: 768, maxActions: 3 },  // Shows 2 actions + 1 menu button if needed
    { width: 480, maxActions: 1 }   // Shows 1 action (or just menu if multiple actions)
  ],
  defaultMaxActions: 1
};
```

---

## Troubleshooting

### Common Issues

#### Actions Not Showing

```tsx
// ❌ Problem: Actions have no priority and viewport is small
<AppBar actions={[{ id: 'save', label: 'Save' }]} />

// ✅ Solution: Set visibility priorities
<AppBar 
  actions={[{ 
    id: 'save', 
    label: 'Save', 
    visibilityPriority: 90 // Ensures visibility
  }]} 
/>
```

#### Single Action Showing Menu Unnecessarily

```tsx
// ✅ System automatically handles this - single actions show directly
<AppBar 
  actions={[{ id: 'save', label: 'Save' }]} // No menu button needed
/>
```

#### Responsive Behavior Not Working

```tsx
// ❌ Problem: No viewport width provided in constrained context
<AppBar actions={actions} />

// ✅ Solution: Provide viewport width for accurate calculations
<AppBar 
  actions={actions}
  actionsProps={{ viewportWidth: drawerWidth }}
/>
```

#### Menu Button Taking Up Space When Not Needed

```tsx
// ✅ System automatically accounts for this:
// - Single action: No menu button, action shows directly
// - Multiple actions fitting: No menu button needed
// - Overflow needed: Menu button takes one slot, remaining show directly
```

### Performance Issues

#### Large Action Lists

```tsx
// ✅ Enable virtualization for 50+ actions
<AppBar
  actions={largeActionList}
  actionsProps={{ enableVirtualization: true }}
/>
```

#### SSR Hydration Mismatches

```tsx
// ✅ Provide hydration fallback
<AppBar
  actions={actions}
  actionsProps={{
    hydrationFallback: <div className="h-10 w-24 bg-gray-200 animate-pulse" />
  }}
/>
```

### Styling Issues

#### Actions Not Aligned

```tsx
// ✅ Use proper container classes
<AppBar
  actionsClassName="flex items-center gap-2"
  actionsProps={{
    actionClassName: "flex-none", // Prevent action size changes
  }}
/>
```

---

## API Reference

### Main Component Props

```tsx
interface IAppBarProps<Context = unknown> {
  // Content
  title?: ReactNode;
  subtitle?: ReactNode;
  titleClassName?: string;
  titleVariant?: ITextVariant;
  subtitleClassName?: string;
  subtitleVariant?: ITextVariant;
  contentClassName?: string;

  // Navigation
  onBackActionPress?: (event: any) => any;
  backActionPosition?: "left" | "right";
  backActionClassName?: string;
  backActionProps?: Omit<IIconButtonProps, "onPress">;
  backAction?: JSX.Element | null | false | ((context: Context & BackActionContext) => ReactNode);

  // Layout
  left?: ReactNode | ((context: Context & LayoutContext) => ReactNode);
  right?: ReactNode | ((context: Context & LayoutContext) => ReactNode);

  // Actions
  actions?: IAppBarActionProps<Context>[];
  actionsProps?: IAppBarActionsProps<Context>;
  maxVisibleActions?: number;
  actionsClassName?: string;

  // Core
  context?: Context;
  variant?: IAppBarVariant;
  className?: string;
  testID?: string;
}
```

### Action Props

```tsx
interface IAppBarActionProps<Context = unknown> {
  // Identity
  id: string;
  label?: string;

  // Visibility & Priority
  visibilityPriority?: number; // 1-100, default: 50
  priority?: IAppBarActionPriority | number; // Deprecated, use visibilityPriority
  alwaysVisible?: boolean;
  minViewportWidth?: number;
  group?: string;

  // Interaction
  onPress?: (event: any) => void;
  render?: (context: RenderContext) => ReactNode;

  // Styling
  fontIconName?: string;
  className?: string;

  // Accessibility
  accessibility?: {
    label?: string;
    hint?: string;
    role?: string;
  };
}
```

### Responsive Configuration

```tsx
interface IAppBarResponsiveConfig {
  breakpoints: {
    width: number;    // Minimum viewport width
    maxActions: number; // Max actions (including menu button slot)
  }[];
  defaultMaxActions: number; // Fallback for unknown contexts
}
```

### Recommended Priority Values

```tsx
const RECOMMENDED_PRIORITIES = {
  EMERGENCY: 100,    // Emergency actions (always visible)
  CRITICAL: 90,      // Critical actions (save, submit)
  HIGH: 75,          // Important actions (share, edit, delete)
  NORMAL: 50,        // Standard actions (export, print, copy)
  LOW: 25,          // Secondary actions (archive, duplicate)
  OPTIONAL: 10       // Nice-to-have actions (debug, advanced)
} as const;
```

---

## Best Practices

### 1. **Action Organization**

- Use clear, descriptive action IDs
- Set appropriate visibility priorities
- Group related actions together
- Limit direct actions to 3-5 for optimal UX

### 2. **Responsive Design**

- Test on different screen sizes
- Provide custom responsive configs for constrained contexts
- Use `minViewportWidth` for actions requiring space
- Consider touch target sizes on mobile

### 3. **Accessibility**

- Provide descriptive accessibility labels
- Test with screen readers
- Ensure keyboard navigation works
- Use appropriate ARIA roles

### 4. **Performance**

- Enable virtualization for large action lists
- Use hydration fallbacks for SSR
- Memoize complex render functions
- Optimize responsive calculations

### 5. **Maintenance**

- Use TypeScript for type safety
- Document custom action behaviors
- Test responsive behavior thoroughly
- Keep priority values consistent across app

---

This user guide covers all aspects of the AppBar component from basic usage to advanced customization. The component is designed to be flexible, accessible, and performant across all screen sizes and contexts.
