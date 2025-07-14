# 🎨 Variants System - @resk/nativewind

> **Type-safe styling system with Tailwind CSS integration**

## 📖 Overview

The @resk/nativewind variants system provides a powerful, type-safe approach to component styling. Built on top of `tailwind-variants`, it offers consistent design tokens, responsive breakpoints, and cross-platform compatibility while maintaining excellent developer experience.

---

## 🏗️ Core Features

### **🎯 Type Safety**
- Full TypeScript support with autocomplete
- Compile-time variant validation
- IntelliSense for all styling options

### **📱 Responsive Design**
- Mobile-first responsive breakpoints
- Conditional styling per platform
- Automatic platform detection

### **🎨 Design System**
- Consistent color palette
- Standardized spacing scale
- Typography hierarchy
- Shadow and elevation system

### **⚡ Performance**
- Zero runtime CSS-in-JS overhead
- Pre-compiled style classes
- Optimized bundle size

---

## 🎛️ Variant Factory

The `VariantsOptionsFactory` is the core engine that generates type-safe variants for all components.

### **Basic Usage**

```tsx
import { VariantsOptionsFactory } from '@resk/nativewind/variants';

// Create simple variants
const sizeVariants = VariantsOptionsFactory.create({
  small: 'w-8 h-8',
  medium: 'w-12 h-12', 
  large: 'w-16 h-16'
});

// Create composite size variants (width + height)
const squareVariants = VariantsOptionsFactory.createCompositeSize();
// Generates: { xs: 'w-4 h-4', sm: 'w-6 h-6', md: 'w-8 h-8', ... }

// Create padding variants
const paddingVariants = VariantsOptionsFactory.createPadding();
// Generates: { xs: 'p-1', sm: 'p-2', md: 'p-4', ... }
```

### **Advanced Variant Creation**

```tsx
// Custom variant with mutator function
const buttonSizeVariants = VariantsOptionsFactory.create(
  {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  },
  (value, variantName) => ({
    base: value,
    icon: variantName === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  })
);

// Platform-specific variants
const platformVariants = VariantsOptionsFactory.create({
  mobile: 'text-base p-4',
  tablet: 'text-lg p-6', 
  desktop: 'text-xl p-8'
});
```

---

## 🎨 Design System Tokens

### **Color Palette**

The framework includes a comprehensive color system with semantic naming and accessibility considerations.

```tsx
import { VariantsColors } from '@resk/nativewind/variants';

// Primary colors
VariantsColors.primary       // Primary brand colors
VariantsColors.secondary     // Secondary accent colors
VariantsColors.tertiary      // Tertiary support colors

// Semantic colors
VariantsColors.success       // Success states (green)
VariantsColors.warning       // Warning states (yellow/orange)
VariantsColors.error         // Error states (red)
VariantsColors.info          // Information states (blue)

// Neutral colors
VariantsColors.gray          // Gray scale palette
VariantsColors.background    // Background colors
VariantsColors.surface       // Surface colors
VariantsColors.text          // Text colors

// Interactive colors
VariantsColors.hoverBackground    // Hover state backgrounds
VariantsColors.activeBackground   // Active state backgrounds
VariantsColors.focusRing         // Focus ring colors
```

**Color Usage Examples:**

```tsx
// Using colors in components
<Surface className={`bg-${VariantsColors.background.primary}`}>
  <Text className={`text-${VariantsColors.text.primary}`}>
    Primary text on primary background
  </Text>
</Surface>

// Dynamic color selection
const getStatusColor = (status: 'success' | 'warning' | 'error') => {
  return VariantsColors[status].primary;
};

// Dark mode support
<div className={`
  bg-${VariantsColors.background.primary} 
  dark:bg-${VariantsColors.background.primaryInverted}
`}>
  Content adapts to theme
</div>
```

### **Spacing Scale**

Consistent spacing system based on a 4px grid with semantic naming.

```tsx
// Available spacing tokens
const spacing = {
  xs: '4px',    // 0.25rem - Extra small spacing
  sm: '8px',    // 0.5rem  - Small spacing  
  md: '16px',   // 1rem    - Medium spacing (base)
  lg: '24px',   // 1.5rem  - Large spacing
  xl: '32px',   // 2rem    - Extra large spacing
  '2xl': '48px', // 3rem   - 2x extra large
  '3xl': '64px', // 4rem   - 3x extra large
};

// Usage in variants
const cardVariants = VariantsOptionsFactory.create({
  compact: 'p-sm gap-xs',    // 8px padding, 4px gap
  normal: 'p-md gap-sm',     // 16px padding, 8px gap  
  spacious: 'p-lg gap-md'    // 24px padding, 16px gap
});
```

### **Typography Scale**

Responsive typography system with consistent line heights and spacing.

```tsx
// Text size variants
const textSizes = {
  xs: 'text-xs leading-4',      // 12px font, 16px line height
  sm: 'text-sm leading-5',      // 14px font, 20px line height
  base: 'text-base leading-6',  // 16px font, 24px line height
  lg: 'text-lg leading-7',      // 18px font, 28px line height
  xl: 'text-xl leading-8',      // 20px font, 32px line height
  '2xl': 'text-2xl leading-9',  // 24px font, 36px line height
  '3xl': 'text-3xl leading-10', // 30px font, 40px line height
};

// Font weight variants
const fontWeights = {
  thin: 'font-thin',        // 100
  light: 'font-light',      // 300
  normal: 'font-normal',    // 400
  medium: 'font-medium',    // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',        // 700
  extrabold: 'font-extrabold' // 800
};

// Usage in components
<Text className="text-lg font-semibold">Heading Text</Text>
<Text className="text-base font-normal">Body Text</Text>
```

---

## 📱 Responsive Breakpoints

The framework uses a mobile-first responsive approach with consistent breakpoints.

### **Breakpoint System**

```tsx
const breakpoints = {
  sm: '640px',   // Small tablets and large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Large laptops and desktops
  '2xl': '1536px' // Extra large screens
};
```

### **Responsive Variants**

```tsx
// Basic responsive usage
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>

// Responsive text sizes
<Text className="text-base md:text-lg lg:text-xl">
  Responsive typography
</Text>

// Responsive spacing
<Stack spacing={{ base: 'sm', md: 'md', lg: 'lg' }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>

// Platform-specific responsive behavior
const ResponsiveButton = ({ children }) => (
  <Button 
    size={{ 
      base: 'sm',      // Mobile
      sm: 'md',        // Small tablets
      md: 'lg',        // Tablets and up
      lg: 'xl'         // Desktop
    }}
    className="w-full sm:w-auto"
  >
    {children}
  </Button>
);
```

---

## 🎯 Component Variant Examples

### **Button Variants**

```tsx
import { tv } from 'tailwind-variants';
import { VariantsOptionsFactory } from '@resk/nativewind/variants';

const buttonVariants = tv({
  slots: {
    base: 'inline-flex items-center justify-center font-medium transition-colors',
    content: 'flex items-center gap-2',
    icon: 'flex-shrink-0',
    label: 'truncate'
  },
  variants: {
    // Variant styles
    variant: {
      primary: {
        base: 'bg-primary text-primary-foreground hover:bg-primary/90'
      },
      secondary: {
        base: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      },
      outline: {
        base: 'border border-input bg-background hover:bg-accent'
      },
      ghost: {
        base: 'hover:bg-accent hover:text-accent-foreground'
      }
    },
    
    // Size variants using factory
    ...VariantsOptionsFactory.create({
      sm: { 
        base: 'h-9 px-3 text-sm',
        icon: 'w-4 h-4'
      },
      md: { 
        base: 'h-10 px-4 text-base',
        icon: 'w-5 h-5'
      },
      lg: { 
        base: 'h-11 px-8 text-lg',
        icon: 'w-6 h-6'
      }
    })
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});

// Usage
const MyButton = ({ variant, size, children, ...props }) => {
  const styles = buttonVariants({ variant, size });
  
  return (
    <Pressable className={styles.base()} {...props}>
      <View className={styles.content()}>
        {children}
      </View>
    </Pressable>
  );
};
```

### **Surface Variants**

```tsx
const surfaceVariants = tv({
  base: 'bg-background rounded-lg',
  variants: {
    // Elevation using factory
    ...VariantsOptionsFactory.create({
      flat: 'shadow-none',
      low: 'shadow-sm',
      medium: 'shadow-md', 
      high: 'shadow-lg',
      highest: 'shadow-xl'
    }, (value) => ({ base: value })),
    
    // Padding using factory
    ...VariantsOptionsFactory.createPadding(),
    
    // Custom border variants
    border: {
      none: 'border-0',
      thin: 'border border-border',
      thick: 'border-2 border-border'
    }
  },
  defaultVariants: {
    elevation: 'low',
    padding: 'md',
    border: 'none'
  }
});
```

---

## 🔧 Advanced Features

### **Compound Variants**

Handle complex styling combinations with compound variants.

```tsx
const alertVariants = tv({
  base: 'rounded-lg border p-4',
  variants: {
    variant: {
      info: 'border-blue-200 bg-blue-50 text-blue-900',
      success: 'border-green-200 bg-green-50 text-green-900',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      error: 'border-red-200 bg-red-50 text-red-900'
    },
    size: {
      sm: 'text-sm p-3',
      md: 'text-base p-4',
      lg: 'text-lg p-5'
    }
  },
  compoundVariants: [
    // Large error alerts get extra emphasis
    {
      variant: 'error',
      size: 'lg',
      class: 'border-2 font-semibold'
    },
    // Small info alerts are more subtle
    {
      variant: 'info', 
      size: 'sm',
      class: 'bg-blue-25 border-blue-100'
    }
  ]
});
```

### **Dynamic Variant Generation**

Generate variants programmatically for consistent design patterns.

```tsx
// Generate color variants for all semantic colors
const generateColorVariants = (colors: string[]) => {
  return colors.reduce((acc, color) => {
    acc[color] = {
      base: `bg-${color}-500 text-white`,
      hover: `hover:bg-${color}-600`,
      active: `active:bg-${color}-700`
    };
    return acc;
  }, {} as Record<string, any>);
};

const badgeVariants = tv({
  base: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
  variants: {
    variant: {
      ...generateColorVariants(['blue', 'green', 'yellow', 'red', 'purple']),
      neutral: 'bg-gray-100 text-gray-800'
    }
  }
});
```

### **Platform-Specific Variants**

Create variants that adapt to different platforms automatically.

```tsx
import { Platform } from '@resk/nativewind/platform';

const platformSpecificVariants = tv({
  base: 'p-4 rounded-lg',
  variants: {
    platform: {
      // Different shadows for different platforms
      ios: 'shadow-lg', // iOS uses more pronounced shadows
      android: 'elevation-4', // Android uses elevation
      web: 'shadow-md hover:shadow-lg' // Web has hover states
    }
  }
});

// Auto-detect platform
const MyComponent = () => {
  const currentPlatform = Platform.isIOS() ? 'ios' : 
                         Platform.isAndroid() ? 'android' : 'web';
  
  const styles = platformSpecificVariants({ platform: currentPlatform });
  
  return <View className={styles} />;
};
```

---

## 🎨 Theme Integration

### **Dark Mode Support**

Built-in dark mode support with automatic theme switching.

```tsx
// Components automatically adapt to dark mode
const themeAwareVariants = tv({
  base: `
    bg-background text-foreground
    border border-border
    transition-colors
  `,
  variants: {
    variant: {
      primary: `
        bg-primary text-primary-foreground
        dark:bg-primary-dark dark:text-primary-foreground-dark
      `,
      secondary: `
        bg-secondary text-secondary-foreground  
        dark:bg-secondary-dark dark:text-secondary-foreground-dark
      `
    }
  }
});

// Manual theme control
import { useTheme } from '@resk/nativewind/theme';

const ThemedComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Surface className={`
      ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}
    `}>
      <Button onPress={toggleTheme}>
        Toggle Theme
      </Button>
    </Surface>
  );
};
```

### **Custom Themes**

Create and apply custom themes across your application.

```tsx
// Define custom theme
const customTheme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6', 
      900: '#1e3a8a'
    },
    gray: {
      50: '#f9fafb',
      500: '#6b7280',
      900: '#111827'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
};

// Apply theme to variants
const themedVariants = tv({
  base: 'rounded-lg',
  variants: {
    color: {
      primary: 'bg-primary-500 text-white',
      gray: 'bg-gray-500 text-white'
    },
    padding: {
      sm: 'p-2',  // Uses theme.spacing.sm
      md: 'p-4',  // Uses theme.spacing.md
      lg: 'p-6'   // Uses theme.spacing.lg
    }
  }
});
```

---

This variants system provides the foundation for the entire @resk/nativewind component library, ensuring consistent styling, type safety, and excellent developer experience across all platforms.

Next sections will cover platform utilities, animations, and other framework features. Would you like me to continue with the platform documentation?
