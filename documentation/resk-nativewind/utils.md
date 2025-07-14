# 🎨 Theme System - @resk/nativewind

> **Comprehensive theming and design system with dark mode support**

## 📖 Overview

The @resk/nativewind theme system provides a robust foundation for consistent design across your application. Built on top of Tailwind CSS with custom extensions, it offers a complete design token system, automatic dark mode support, responsive breakpoints, and dynamic theme switching capabilities.

---

## 🎯 Core Features

### **🌈 Design Token System**
- Comprehensive color palette with semantic naming
- Consistent spacing scale based on 4px grid
- Typography scale with responsive sizing
- Border radius and elevation systems

### **🌙 Dark Mode Support**
- Automatic system preference detection
- Manual theme switching with persistence
- Smooth transitions between themes
- Component-level theme awareness

### **📱 Responsive Design**
- Mobile-first breakpoint system
- Device type detection (mobile, tablet, desktop)
- Adaptive layouts and components
- Screen size hooks and utilities

### **⚡ Performance Optimized**
- CSS custom properties for dynamic theming
- Minimal runtime overhead
- Tree-shakeable theme modules
- Efficient re-rendering on theme changes

---

## 🎨 Design Tokens

### **Color System**

```tsx
import { theme } from '@resk/nativewind/theme';

// Primary brand colors
const primaryColors = {
  light: "#4da6ff",      // Lighter shade
  DEFAULT: "#0080ff",    // Main brand color
  dark: "#0066cc",       // Darker shade
};

// Secondary accent colors
const secondaryColors = {
  light: "#ffb380",      // Lighter shade
  DEFAULT: "#ff9955",    // Main accent color
  dark: "#e67300",       // Darker shade
};

// Neutral grayscale palette
const neutralColors = {
  50: "#fafafa",         // Lightest gray
  100: "#f5f5f5",        // Very light gray
  200: "#e5e5e5",        // Light gray
  300: "#d4d4d4",        // Medium-light gray
  400: "#a3a3a3",        // Medium gray
  500: "#737373",        // Base gray
  600: "#525252",        // Medium-dark gray
  700: "#404040",        // Dark gray
  800: "#262626",        // Very dark gray
  900: "#171717",        // Darkest gray
};

// Usage in components
<div className="bg-primary text-white">Primary background</div>
<div className="bg-secondary-light text-secondary-dark">Secondary colors</div>
<div className="bg-neutral-100 text-neutral-900">Neutral palette</div>
```

### **Semantic Color System**

```tsx
// Semantic color definitions
const semanticColors = {
  // Status colors
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    900: "#14532d"
  },
  warning: {
    50: "#fffbeb", 
    500: "#f59e0b",
    900: "#78350f"
  },
  error: {
    50: "#fef2f2",
    500: "#ef4444", 
    900: "#7f1d1d"
  },
  info: {
    50: "#eff6ff",
    500: "#3b82f6",
    900: "#1e3a8a"
  },
  
  // Surface colors
  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
    tertiary: "#f1f5f9"
  },
  surface: {
    primary: "#ffffff",
    secondary: "#f8fafc", 
    elevated: "#ffffff"
  },
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    tertiary: "#94a3b8",
    inverse: "#ffffff"
  }
};

// Dark mode variants
const darkSemanticColors = {
  background: {
    primary: "#0f172a",
    secondary: "#1e293b",
    tertiary: "#334155"
  },
  surface: {
    primary: "#1e293b",
    secondary: "#334155",
    elevated: "#475569"
  },
  text: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
    tertiary: "#94a3b8",
    inverse: "#0f172a"
  }
};

// Usage with automatic dark mode
<div className="bg-background-primary dark:bg-background-primary text-text-primary dark:text-text-primary">
  Adaptive background and text
</div>
```

### **Spacing System**

```tsx
// Spacing scale based on 4px grid
const spacing = {
  xs: "4px",      // 0.25rem - Extra small
  sm: "8px",      // 0.5rem  - Small
  md: "16px",     // 1rem    - Medium (base)
  lg: "24px",     // 1.5rem  - Large
  xl: "32px",     // 2rem    - Extra large
  "2xl": "48px",  // 3rem    - 2x extra large
  "3xl": "64px",  // 4rem    - 3x extra large
};

// Usage examples
<div className="p-xs">Extra small padding (4px)</div>
<div className="p-sm">Small padding (8px)</div>
<div className="p-md">Medium padding (16px)</div>
<div className="p-lg">Large padding (24px)</div>
<div className="gap-xl">32px gap between items</div>
<div className="m-2xl">48px margin</div>

// Responsive spacing
<div className="p-sm md:p-md lg:p-lg">
  Responsive padding that grows with screen size
</div>

// Directional spacing
<div className="pt-lg pb-xl px-md">
  24px top, 32px bottom, 16px horizontal
</div>
```

### **Typography Scale**

```tsx
// Typography system
const typography = {
  fontSize: {
    xs: "12px",     // Extra small text
    sm: "14px",     // Small text
    base: "16px",   // Base text size
    lg: "18px",     // Large text
    xl: "20px",     // Extra large text
    "2xl": "24px",  // 2x extra large
    "3xl": "30px",  // 3x extra large
    "4xl": "36px",  // 4x extra large
    "5xl": "48px",  // 5x extra large
  },
  fontWeight: {
    thin: "100",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900"
  },
  lineHeight: {
    tight: "1.25",
    snug: "1.375", 
    normal: "1.5",
    relaxed: "1.625",
    loose: "2"
  }
};

// Usage examples
<Text className="text-xs font-light">Small light text</Text>
<Text className="text-base font-normal leading-normal">Regular body text</Text>
<Text className="text-2xl font-bold leading-tight">Large bold heading</Text>
<Text className="text-4xl font-black">Hero heading</Text>

// Responsive typography
<Text className="text-lg md:text-xl lg:text-2xl font-semibold">
  Responsive heading
</Text>
```

### **Border Radius System**

```tsx
// Border radius scale
const borderRadius = {
  none: "0",          // No rounding
  xs: "2px",          // Extra small
  sm: "4px",          // Small
  DEFAULT: "8px",     // Default/medium
  lg: "12px",         // Large
  xl: "16px",         // Extra large
  "2xl": "24px",      // 2x extra large
  full: "9999px",     // Fully rounded
};

// Usage examples
<div className="rounded-none">No border radius</div>
<div className="rounded-sm">Small rounded corners</div>
<div className="rounded">Default rounded corners (8px)</div>
<div className="rounded-lg">Large rounded corners</div>
<div className="rounded-full">Fully rounded (circle/pill)</div>

// Directional rounding
<div className="rounded-t-lg">Only top corners rounded</div>
<div className="rounded-r-xl">Only right corners rounded</div>
<div className="rounded-bl-lg">Only bottom-left corner rounded</div>
```

---

## 🌙 Dark Mode Implementation

### **Automatic Dark Mode Detection**

```tsx
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setTheme] = useState(deviceColorScheme || 'light');
  
  // Auto-detect system theme changes
  useEffect(() => {
    setTheme(deviceColorScheme || 'light');
  }, [deviceColorScheme]);
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {children}
    </div>
  );
};

// Component that adapts to theme
const ThemeAwareComponent = () => (
  <div className="
    bg-white dark:bg-gray-900 
    text-gray-900 dark:text-white
    border border-gray-200 dark:border-gray-700
    transition-colors duration-200
  ">
    <Text>This content adapts to light/dark mode</Text>
  </div>
);
```

### **Manual Theme Control**

```tsx
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Persist theme preference
    AsyncStorage.setItem('theme_preference', newTheme);
  };
  
  const setSpecificTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    AsyncStorage.setItem('theme_preference', newTheme);
  };
  
  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme_preference');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);
  
  return {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark'
  };
};

// Theme switcher component
const ThemeSwitcher = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant={theme === 'light' ? 'primary' : 'outline'}
        onPress={() => setTheme('light')}
        icon="sun"
      >
        Light
      </Button>
      
      <Button 
        variant={theme === 'dark' ? 'primary' : 'outline'}
        onPress={() => setTheme('dark')}
        icon="moon"
      >
        Dark
      </Button>
      
      <Button 
        variant={theme === 'system' ? 'primary' : 'outline'}
        onPress={() => setTheme('system')}
        icon="monitor"
      >
        System
      </Button>
    </div>
  );
};
```

### **Component-Level Theme Awareness**

```tsx
// Theme-aware component variants
const createThemeVariants = (lightClasses: string, darkClasses: string) => {
  return `${lightClasses} dark:${darkClasses}`;
};

const ThemeAwareCard = ({ children, variant = 'default' }) => {
  const variants = {
    default: createThemeVariants(
      'bg-white border-gray-200 text-gray-900',
      'bg-gray-800 border-gray-700 text-white'
    ),
    elevated: createThemeVariants(
      'bg-white shadow-lg border-gray-100 text-gray-900',
      'bg-gray-900 shadow-xl border-gray-600 text-white'
    ),
    subtle: createThemeVariants(
      'bg-gray-50 border-gray-100 text-gray-700',
      'bg-gray-700 border-gray-600 text-gray-300'
    )
  };
  
  return (
    <div className={`p-4 rounded-lg border transition-colors ${variants[variant]}`}>
      {children}
    </div>
  );
};

// Usage
<ThemeAwareCard variant="elevated">
  <Text>This card adapts to the current theme</Text>
</ThemeAwareCard>
```

---

## 📱 Responsive Design System

### **Breakpoint System**

```tsx
// Default breakpoints
const breakpoints = {
  sm: '640px',    // Small tablets and large phones
  md: '768px',    // Tablets
  lg: '1024px',   // Small laptops
  xl: '1280px',   // Large laptops and desktops
  '2xl': '1536px' // Extra large screens
};

// Device type breakpoints
const deviceBreakpoints = {
  mobileMaxWidth: 640,      // Below this = mobile
  tabletMaxWidth: 1024,     // Below this (but above mobile) = tablet
  // Above tablet = desktop
};

// Usage examples
<div className="
  w-full 
  sm:w-1/2 
  md:w-1/3 
  lg:w-1/4 
  xl:w-1/5
">
  Responsive width across breakpoints
</div>

<div className="
  text-sm 
  md:text-base 
  lg:text-lg 
  xl:text-xl
">
  Responsive typography
</div>

<div className="
  p-4 
  md:p-6 
  lg:p-8 
  xl:p-12
">
  Responsive padding
</div>
```

### **Device Detection Hook**

```tsx
import { useDimensions } from '@resk/nativewind/utils/dimensions';

const ResponsiveComponent = () => {
  const { 
    window, 
    screen, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isHydrated,
    isKeyboardVisible 
  } = useDimensions({
    widthThreshold: 10,        // Minimum change to trigger update
    heightThreshold: 10,       // Minimum change to trigger update  
    debounceTimeout: 100,      // Debounce dimension updates
    breakpoints: {             // Custom breakpoints
      mobileMaxWidth: 480,
      tabletMaxWidth: 1024
    }
  });
  
  // Don't render until hydrated on web
  if (!isHydrated) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <Text>Width: {window.width}px</Text>
      <Text>Height: {window.height}px</Text>
      <Text>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</Text>
      <Text>Keyboard: {isKeyboardVisible ? 'Visible' : 'Hidden'}</Text>
      
      {/* Conditional rendering based on device type */}
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
};

// Custom breakpoint usage
const CustomResponsiveComponent = () => {
  const { window } = useDimensions();
  
  const getLayoutConfig = () => {
    if (window.width < 480) {
      return { columns: 1, sidebar: false };
    } else if (window.width < 768) {
      return { columns: 2, sidebar: false };
    } else if (window.width < 1200) {
      return { columns: 3, sidebar: true };
    } else {
      return { columns: 4, sidebar: true };
    }
  };
  
  const layout = getLayoutConfig();
  
  return (
    <div className={`grid grid-cols-${layout.columns} gap-4`}>
      {layout.sidebar && <Sidebar />}
      <MainContent />
    </div>
  );
};
```

---

## 🎨 Advanced Theming

### **CSS Custom Properties Integration**

```tsx
// Define CSS custom properties for dynamic theming
const createCSSVariables = (theme: 'light' | 'dark') => {
  const variables = theme === 'light' ? {
    '--color-primary': '#0080ff',
    '--color-primary-foreground': '#ffffff',
    '--color-background': '#ffffff',
    '--color-foreground': '#0f172a',
    '--color-card': '#ffffff',
    '--color-card-foreground': '#0f172a',
    '--color-border': '#e2e8f0',
    '--color-input': '#e2e8f0',
    '--radius': '0.5rem',
  } : {
    '--color-primary': '#4da6ff',
    '--color-primary-foreground': '#0f172a',
    '--color-background': '#0f172a',
    '--color-foreground': '#f8fafc',
    '--color-card': '#1e293b',
    '--color-card-foreground': '#f8fafc',
    '--color-border': '#334155',
    '--color-input': '#334155',
    '--radius': '0.5rem',
  };
  
  // Apply variables to root
  Object.entries(variables).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
};

// Component that uses CSS variables
const DynamicThemedComponent = () => (
  <div style={{
    backgroundColor: 'var(--color-card)',
    color: 'var(--color-card-foreground)',
    borderColor: 'var(--color-border)',
    borderRadius: 'var(--radius)'
  }}>
    <Text>This component uses CSS variables for theming</Text>
  </div>
);
```

### **Theme Context Provider**

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const systemTheme = useColorScheme();
  
  useEffect(() => {
    if (theme === 'system') {
      setActualTheme(systemTheme || 'light');
    } else {
      setActualTheme(theme);
    }
  }, [theme, systemTheme]);
  
  useEffect(() => {
    // Apply theme to root element
    document.documentElement.classList.toggle('dark', actualTheme === 'dark');
    
    // Update CSS variables
    createCSSVariables(actualTheme);
  }, [actualTheme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Usage in components
const ThemedComponent = () => {
  const { actualTheme, setTheme } = useTheme();
  
  return (
    <div className={`theme-${actualTheme}`}>
      <Button onPress={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}>
        Switch to {actualTheme === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
    </div>
  );
};
```

### **Component Theme Variants**

```tsx
// Advanced theme variant system
const createComponentTheme = <T extends Record<string, any>>(
  lightTheme: T,
  darkTheme: T
): { light: T; dark: T } => ({
  light: lightTheme,
  dark: darkTheme
});

// Button component themes
const buttonThemes = createComponentTheme(
  {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  },
  {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-700 text-gray-100 hover:bg-gray-600',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800'
  }
);

// Use in component
const ThemedButton = ({ variant, children, ...props }) => {
  const { actualTheme } = useTheme();
  const themeClasses = buttonThemes[actualTheme][variant];
  
  return (
    <button className={`px-4 py-2 rounded-lg transition-colors ${themeClasses}`} {...props}>
      {children}
    </button>
  );
};
```

---

## 🔧 Theme Utilities

### **Color Manipulation Utilities**

```tsx
// Color utility functions
const colorUtils = {
  // Convert hex to rgba with opacity
  hexToRgba: (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  
  // Lighten color by percentage
  lighten: (color: string, percentage: number) => {
    // Implementation for lightening colors
    return color; // Simplified
  },
  
  // Darken color by percentage
  darken: (color: string, percentage: number) => {
    // Implementation for darkening colors
    return color; // Simplified
  },
  
  // Get contrast color (black or white) for given background
  getContrastColor: (backgroundColor: string) => {
    // Simple implementation - should calculate luminance
    return backgroundColor.includes('dark') ? '#ffffff' : '#000000';
  }
};

// Dynamic color generation
const DynamicColorComponent = ({ color }) => {
  const backgroundColor = color;
  const textColor = colorUtils.getContrastColor(backgroundColor);
  const hoverColor = colorUtils.lighten(backgroundColor, 10);
  
  return (
    <div 
      style={{ 
        backgroundColor,
        color: textColor 
      }}
      className="p-4 rounded-lg transition-colors hover:opacity-90"
    >
      <Text>Dynamic colored component</Text>
    </div>
  );
};
```

### **Theme Validation and Testing**

```tsx
// Theme validation utilities
const validateTheme = (theme: any) => {
  const requiredProperties = [
    'colors.primary',
    'colors.secondary', 
    'colors.neutral',
    'spacing',
    'borderRadius'
  ];
  
  const missingProperties = requiredProperties.filter(prop => {
    const keys = prop.split('.');
    let current = theme;
    
    for (const key of keys) {
      if (!current || !current[key]) {
        return true;
      }
      current = current[key];
    }
    return false;
  });
  
  if (missingProperties.length > 0) {
    console.warn('Missing theme properties:', missingProperties);
  }
  
  return missingProperties.length === 0;
};

// Theme testing component
const ThemeDebugger = () => {
  const { actualTheme } = useTheme();
  
  return (
    <div className="p-4 space-y-4">
      <Text className="text-lg font-bold">Theme Debugger</Text>
      <Text>Current theme: {actualTheme}</Text>
      
      {/* Color swatches */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-primary w-16 h-16 rounded flex items-center justify-center">
          <Text className="text-white text-xs">Primary</Text>
        </div>
        <div className="bg-secondary w-16 h-16 rounded flex items-center justify-center">
          <Text className="text-white text-xs">Secondary</Text>
        </div>
        <div className="bg-neutral-500 w-16 h-16 rounded flex items-center justify-center">
          <Text className="text-white text-xs">Neutral</Text>
        </div>
      </div>
      
      {/* Spacing examples */}
      <div className="space-y-2">
        <div className="bg-gray-200 p-xs">XS Padding</div>
        <div className="bg-gray-200 p-sm">SM Padding</div>
        <div className="bg-gray-200 p-md">MD Padding</div>
        <div className="bg-gray-200 p-lg">LG Padding</div>
      </div>
    </div>
  );
};
```

---

The theme system in @resk/nativewind provides a comprehensive foundation for building visually consistent applications with support for multiple themes, responsive design, and dynamic customization. It ensures your application looks great across all platforms while maintaining design system consistency.

Finally, let me create the utils documentation to complete the comprehensive documentation:

<function_calls>
<invoke name="create_file">
<parameter name="content"># 🔧 Utilities - @resk/nativewind

> **Essential utilities, hooks, and helper functions for enhanced development**

## 📖 Overview

The @resk/nativewind utilities module provides a comprehensive collection of hooks, helper functions, and utility components designed to enhance development productivity and application performance. These utilities handle common patterns like state management, DOM manipulation, animations, and cross-platform compatibility.

---

## 🎯 Core Features

### **📏 Dimension Management**
- Responsive breakpoint detection
- Screen size monitoring with debouncing
- Device type identification (mobile/tablet/desktop)
- Keyboard visibility tracking

### **🔄 State Management**
- Enhanced state hooks with callbacks
- Previous value tracking
- Force re-render utilities
- Hydration status management

### **🎭 Component Utilities**
- Provider pattern implementations
- Component composition helpers
- Ref management utilities
- Event handling optimizations

### **⚡ Performance Utilities**
- Debounced updates
- Memoization helpers
- Animation optimizations
- Memory leak prevention

---

## 📏 Dimension and Layout Utilities

### **useDimensions Hook**

Comprehensive hook for responsive design and layout management.

```tsx
import { useDimensions } from '@resk/nativewind/utils/dimensions';

const ResponsiveComponent = () => {
  const {
    window,              // Window dimensions
    screen,              // Screen dimensions
    isMobile,            // Is mobile device
    isTablet,            // Is tablet device
    isDesktop,           // Is desktop device
    isHydrated,          // SSR hydration status
    isKeyboardVisible,   // Keyboard visibility (mobile)
    orientation          // Screen orientation
  } = useDimensions({
    widthThreshold: 10,        // Minimum width change to trigger update
    heightThreshold: 10,       // Minimum height change to trigger update
    debounceTimeout: 100,      // Debounce delay for updates
    ignoreKeyboard: false,     // Include keyboard in calculations
    breakpoints: {             // Custom breakpoints
      mobileMaxWidth: 640,
      tabletMaxWidth: 1024
    }
  });

  // Prevent rendering until hydrated (important for SSR)
  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <Text>Width: {window.width}px</Text>
      <Text>Height: {window.height}px</Text>
      <Text>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</Text>
      <Text>Orientation: {orientation}</Text>
      
      {/* Responsive layout */}
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </View>
  );
};
```

### **Responsive Layout Patterns**

```tsx
// Conditional component rendering
const ConditionalLayout = () => {
  const { isMobile, isTablet, window } = useDimensions();
  
  const getColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (window.width > 1400) return 4;
    return 3;
  };
  
  const columns = getColumns();
  
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {items.map((item, index) => (
        <ItemCard key={index} item={item} />
      ))}
    </div>
  );
};

// Adaptive navigation
const AdaptiveNavigation = () => {
  const { isMobile, isKeyboardVisible } = useDimensions();
  
  if (isMobile) {
    return (
      <View className={`
        fixed bottom-0 left-0 right-0 
        ${isKeyboardVisible ? 'hidden' : 'block'}
        transition-all duration-300
      `}>
        <TabNavigation />
      </View>
    );
  }
  
  return (
    <View className="fixed top-0 left-0 right-0">
      <TopNavigation />
    </View>
  );
};

// Responsive typography
const ResponsiveText = ({ children, ...props }) => {
  const { isMobile, isTablet } = useDimensions();
  
  const getTextSize = () => {
    if (isMobile) return 'text-sm';
    if (isTablet) return 'text-base'; 
    return 'text-lg';
  };
  
  return (
    <Text className={`${getTextSize()} leading-relaxed`} {...props}>
      {children}
    </Text>
  );
};
```

---

## 🔄 Enhanced State Management

### **useStateCallback Hook**

State hook with completion callbacks for side effects.

```tsx
import useStateCallback from '@resk/nativewind/utils/stateCallback';

const ComponentWithCallbacks = () => {
  const [isLoading, setIsLoading] = useStateCallback(false);
  const [data, setData] = useStateCallback(null);
  
  const fetchData = async () => {
    setIsLoading(true, () => {
      console.log('Loading started');
    });
    
    try {
      const result = await api.fetchData();
      
      setData(result, (newData) => {
        console.log('Data updated:', newData);
        // Perform side effects after state update
        analytics.track('data_loaded', { itemCount: newData.length });
      });
    } finally {
      setIsLoading(false, () => {
        console.log('Loading completed');
      });
    }
  };
  
  return (
    <View>
      <Button onPress={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </Button>
      
      {data && (
        <View>
          <Text>Items: {data.length}</Text>
        </View>
      )}
    </View>
  );
};
```

### **usePrevious Hook**

Track previous values for comparison and animation triggers.

```tsx
import usePrevious from '@resk/nativewind/utils/usePrevious';

const AnimatedCounter = ({ count }) => {
  const previousCount = usePrevious(count);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (previousCount !== undefined && previousCount !== count) {
      setIsAnimating(true);
      
      // Reset animation after delay
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [count, previousCount]);
  
  const direction = previousCount && count > previousCount ? 'up' : 'down';
  
  return (
    <View className={`
      transition-all duration-300 
      ${isAnimating ? 'scale-110' : 'scale-100'}
      ${direction === 'up' ? 'text-green-500' : direction === 'down' ? 'text-red-500' : ''}
    `}>
      <Text className="text-2xl font-bold">{count}</Text>
      
      {isAnimating && (
        <Text className="text-sm">
          {direction === 'up' ? '↗' : '↘'} 
          {Math.abs(count - (previousCount || 0))}
        </Text>
      )}
    </View>
  );
};

// Value comparison for complex objects
const useObjectChanges = (obj) => {
  const previousObj = usePrevious(obj);
  
  const changes = useMemo(() => {
    if (!previousObj) return {};
    
    const changedKeys = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== previousObj[key]) {
        changedKeys[key] = {
          previous: previousObj[key],
          current: obj[key]
        };
      }
    });
    
    return changedKeys;
  }, [obj, previousObj]);
  
  return { previousObj, changes };
};
```

### **useForceRender Hook**

Force component re-renders for specific scenarios.

```tsx
import useForceRender from '@resk/nativewind/utils/useForceRender';

const DynamicComponent = () => {
  const forceRender = useForceRender();
  
  // Force re-render when external data changes
  useEffect(() => {
    const unsubscribe = externalStore.subscribe(() => {
      forceRender(); // Re-render component when store changes
    });
    
    return unsubscribe;
  }, [forceRender]);
  
  return (
    <View>
      <Text>Current time: {new Date().toLocaleTimeString()}</Text>
      <Button onPress={forceRender}>
        Force Update
      </Button>
    </View>
  );
};

// Use with animations that need re-render triggers
const AnimationComponent = () => {
  const forceRender = useForceRender();
  const animationRef = useRef();
  
  const startAnimation = () => {
    animationRef.current = setInterval(() => {
      // Update some external state
      updateAnimationState();
      forceRender(); // Force re-render for animation
    }, 16); // 60fps
  };
  
  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
  };
  
  useEffect(() => {
    return stopAnimation; // Cleanup on unmount
  }, []);
  
  return (
    <View>
      <Button onPress={startAnimation}>Start Animation</Button>
      <Button onPress={stopAnimation}>Stop Animation</Button>
    </View>
  );
};
```

---

## 🔧 Component Composition Utilities

### **Provider Pattern Utilities**

```tsx
import { createProvider } from '@resk/nativewind/utils/provider';

// Define modal component interface
interface ModalProps {
  title: string;
  visible: boolean;
  onClose: () => void;
}

interface ModalRef {
  open: (options: { title: string; content: React.ReactNode }) => void;
  close: () => void;
}

// Create modal provider
const ModalProvider = createProvider<ModalProps, ModalRef>(
  ModalComponent,
  { visible: false }, // Default props
  (options) => ({ ...options, animated: true }), // Props mutator
  'GlobalModal' // Display name
);

// Use in app
const App = () => {
  return (
    <View>
      {/* Global modal instance */}
      <ModalProvider.Component title="Default Modal" />
      
      {/* Trigger modal from anywhere */}
      <Button onPress={() => {
        ModalProvider.open({
          title: 'Dynamic Modal',
          content: <Text>Dynamic content</Text>
        });
      }}>
        Open Modal
      </Button>
    </View>
  );
};

// Multiple provider instances
const MultiModalExample = () => {
  const confirmModalRef = useRef();
  const alertModalRef = useRef();
  
  return (
    <View>
      <ModalProvider.Component 
        ref={confirmModalRef}
        title="Confirmation"
      />
      
      <ModalProvider.Component 
        ref={alertModalRef}
        title="Alert"
      />
      
      <Button onPress={() => {
        ModalProvider.openInstance(confirmModalRef, {
          title: 'Confirm Action',
          content: <ConfirmDialog />
        });
      }}>
        Show Confirmation
      </Button>
    </View>
  );
};
```

### **Ref Management Utilities**

```tsx
import { mergeRefs, setRef } from '@resk/nativewind/utils';

const RefMergingComponent = forwardRef((props, ref) => {
  const internalRef = useRef();
  const [measurements, setMeasurements] = useState({});
  
  // Merge external ref with internal ref
  const mergedRef = mergeRefs(ref, internalRef);
  
  const measureComponent = () => {
    if (internalRef.current) {
      internalRef.current.measure((x, y, width, height) => {
        setMeasurements({ x, y, width, height });
      });
    }
  };
  
  return (
    <View ref={mergedRef} {...props}>
      <Button onPress={measureComponent}>
        Measure Component
      </Button>
      
      {measurements.width && (
        <Text>Size: {measurements.width} x {measurements.height}</Text>
      )}
    </View>
  );
});

// Dynamic ref assignment
const DynamicRefComponent = ({ children, onRefChange }) => {
  const [activeRef, setActiveRef] = useState(null);
  
  const handleRefChange = (ref) => {
    setActiveRef(ref);
    setRef(onRefChange, ref); // Safely call ref callback
  };
  
  return (
    <View>
      {React.Children.map(children, (child, index) => 
        React.cloneElement(child, {
          ref: (ref) => handleRefChange(ref),
          key: index
        })
      )}
    </View>
  );
};
```

---

## ⚡ Performance and Animation Utilities

### **Keyboard Management**

```tsx
import { useKeyboard } from '@resk/nativewind/utils/keyboard';

const KeyboardAwareComponent = () => {
  const { 
    isKeyboardVisible, 
    keyboardHeight, 
    keyboardAnimationDuration 
  } = useKeyboard();
  
  return (
    <View className="flex-1">
      <ScrollView 
        contentContainerStyle={{
          paddingBottom: isKeyboardVisible ? keyboardHeight : 0
        }}
        className="flex-1"
      >
        <TextInput placeholder="Type here..." />
        <TextInput placeholder="Another input..." />
      </ScrollView>
      
      {/* Floating action button that moves with keyboard */}
      <View 
        style={{
          position: 'absolute',
          bottom: isKeyboardVisible ? keyboardHeight + 20 : 20,
          right: 20,
        }}
        className="transition-all"
      >
        <Button icon="plus" variant="primary" />
      </View>
    </View>
  );
};

// Chat input with keyboard handling
const ChatInput = () => {
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();
  const [message, setMessage] = useState('');
  
  return (
    <View 
      style={{
        position: 'absolute',
        bottom: isKeyboardVisible ? keyboardHeight : 0,
        left: 0,
        right: 0,
      }}
      className="bg-white border-t border-gray-200 p-4"
    >
      <View className="flex-row items-center space-x-2">
        <TextInput 
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2"
        />
        <Button 
          icon="send" 
          variant="primary" 
          disabled={!message.trim()}
          onPress={() => {
            // Send message
            setMessage('');
          }}
        />
      </View>
    </View>
  );
};
```

### **Animation Utilities**

```tsx
import { animations } from '@resk/nativewind/utils/animations';

const AnimatedListItem = ({ item, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Stagger item animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <AnimatedVisibility
      visible={isVisible}
      enteringAnimationName="slide-in-left"
      animationDuration={300 + (index * 50)} // Staggered duration
    >
      <View className="p-4 bg-white rounded-lg shadow-sm mb-2">
        <Text>{item.title}</Text>
      </View>
    </AnimatedVisibility>
  );
};

// Animation sequencing utility
const useAnimationSequence = (steps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playSequence = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => 
        setTimeout(resolve, steps[i].duration || 300)
      );
    }
    
    setIsPlaying(false);
  };
  
  const resetSequence = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  return {
    currentStep,
    isPlaying,
    playSequence,
    resetSequence
  };
};

// Usage
const SequencedAnimation = () => {
  const animationSteps = [
    { name: 'fade-in', duration: 300 },
    { name: 'scale-in', duration: 400 },
    { name: 'slide-in-bottom', duration: 500 }
  ];
  
  const { currentStep, isPlaying, playSequence, resetSequence } = 
    useAnimationSequence(animationSteps);
  
  return (
    <View>
      <Button onPress={playSequence} disabled={isPlaying}>
        Play Animation Sequence
      </Button>
      
      <Button onPress={resetSequence} disabled={isPlaying}>
        Reset
      </Button>
      
      {animationSteps.map((step, index) => (
        <AnimatedVisibility
          key={index}
          visible={currentStep >= index}
          enteringAnimationName={step.name}
          animationDuration={step.duration}
        >
          <View className="p-4 bg-blue-100 rounded-lg m-2">
            <Text>Step {index + 1}: {step.name}</Text>
          </View>
        </AnimatedVisibility>
      ))}
    </View>
  );
};
```

---

## 🛠️ Developer Utilities

### **Component Validation and Debugging**

```tsx
import { isValidElement } from '@resk/nativewind/utils';

const ComponentValidator = ({ children }) => {
  const validChildren = React.Children.toArray(children).filter(child => 
    isValidElement(child)
  );
  
  if (validChildren.length !== React.Children.count(children)) {
    console.warn('Some children are not valid React elements');
  }
  
  return (
    <View>
      {validChildren}
    </View>
  );
};

// Development-only component wrapper
const withDevelopmentWarnings = (Component) => {
  return (props) => {
    useEffect(() => {
      if (__DEV__) {
        // Validate required props
        const requiredProps = Component.requiredProps || [];
        const missingProps = requiredProps.filter(prop => 
          props[prop] === undefined
        );
        
        if (missingProps.length > 0) {
          console.warn(
            `Missing required props for ${Component.displayName}: `,
            missingProps
          );
        }
        
        // Performance monitoring
        const startTime = performance.now();
        
        return () => {
          const endTime = performance.now();
          if (endTime - startTime > 16) { // Slower than 60fps
            console.warn(
              `Slow render detected for ${Component.displayName}: ${endTime - startTime}ms`
            );
          }
        };
      }
    });
    
    return <Component {...props} />;
  };
};

// Usage
const MyComponent = withDevelopmentWarnings(({ title, onPress }) => (
  <Button onPress={onPress}>
    {title}
  </Button>
));

MyComponent.requiredProps = ['title', 'onPress'];
```

### **Text and Content Utilities**

```tsx
import { getTextContent } from '@resk/nativewind/utils';

const TextAnalyzer = ({ children }) => {
  const textContent = getTextContent(children);
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const charCount = textContent.length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed
  
  return (
    <View>
      <View className="bg-gray-100 p-2 rounded-t-lg">
        <Text className="text-sm text-gray-600">
          {wordCount} words • {charCount} characters • {readingTime} min read
        </Text>
      </View>
      
      <View className="p-4 border border-gray-200 rounded-b-lg">
        {children}
      </View>
    </View>
  );
};

// Search highlighting utility
const HighlightText = ({ text, searchTerm, highlightClassName = 'bg-yellow-200' }) => {
  if (!searchTerm) return <Text>{text}</Text>;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <Text>
      {parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <Text key={index} className={highlightClassName}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};
```

---

## 🔧 Platform-Specific Utilities

### **Hydration Status Management**

```tsx
import { useHydrationStatus } from '@resk/nativewind/utils';

const SSRSafeComponent = ({ children }) => {
  const isHydrated = useHydrationStatus();
  
  // Don't render dynamic content until hydrated
  if (!isHydrated) {
    return (
      <View className="animate-pulse bg-gray-200 h-20 rounded-lg" />
    );
  }
  
  return (
    <View>
      {children}
    </View>
  );
};

// Client-side only component
const ClientOnlyComponent = ({ children, fallback = null }) => {
  const isHydrated = useHydrationStatus();
  
  if (!isHydrated) {
    return fallback;
  }
  
  return children;
};

// Usage
<ClientOnlyComponent 
  fallback={<Text>Loading...</Text>}
>
  <MapComponent /> {/* Only renders on client */}
</ClientOnlyComponent>
```

### **Mount Status Tracking**

```tsx
import { useIsMounted } from '@resk/nativewind/utils';

const SafeAsyncComponent = () => {
  const isMounted = useIsMounted();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    
    try {
      const result = await api.fetchData();
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setData(result);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Fetch error:', error);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <View>
      {loading && <ActivityIndicator />}
      {data && <DataDisplay data={data} />}
    </View>
  );
};
```

---

The utilities module in @resk/nativewind provides essential tools for building robust, performant, and maintainable applications. These utilities handle common development patterns while ensuring cross-platform compatibility and optimal performance.

This completes the comprehensive documentation for @resk/nativewind framework! 🎉
