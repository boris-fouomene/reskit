# 🚀 Platform Utilities - @resk/nativewind

> **Cross-platform utilities and platform-specific optimizations**

## 📖 Overview

The platform utilities module provides comprehensive tools for detecting platform characteristics, implementing platform-specific behavior, and optimizing performance across React Native, Next.js, and Expo environments.

---

## 🎯 Core Features

### **🔍 Platform Detection**
- Accurate platform identification (iOS, Android, Web)
- Device type detection (mobile, tablet, desktop)
- Environment detection (development, production)
- Framework detection (Next.js, Expo, React Native)

### **📱 Device Characteristics**
- Screen dimensions and safe areas
- Touch capability detection
- Orientation and viewport utilities
- Status bar and notch handling

### **⚡ Performance Optimization**
- Platform-specific code execution
- Conditional imports and tree-shaking
- Native driver detection for animations
- Memory and performance monitoring

---

## 🔍 Platform Detection

### **Basic Platform Checks**

```tsx
import Platform from '@resk/nativewind/platform';

// Basic platform detection
const isIOSDevice = Platform.isIos();        // true on iOS
const isAndroidDevice = Platform.isAndroid(); // true on Android  
const isWebPlatform = Platform.isWeb();       // true on web browsers
const isNativeApp = Platform.isNative();      // true on iOS/Android

// Environment detection
const isDevelopment = Platform.isDev();       // true in development
const isProduction = !Platform.isDev();      // true in production

// Framework detection
const isNextJS = Platform.isNextJs();         // true in Next.js
const isExpo = Platform.isExpo();            // true in Expo

// Example usage
if (Platform.isIos()) {
  console.log('iOS-specific logic');
} else if (Platform.isAndroid()) {
  console.log('Android-specific logic');
} else if (Platform.isWeb()) {
  console.log('Web-specific logic');
}
```

### **Platform-Specific Code Execution**

```tsx
// Conditional platform execution
Platform.ios(() => {
  // Only executes on iOS
  import('./ios-specific-module');
});

Platform.android(() => {
  // Only executes on Android
  import('./android-specific-module');
});

Platform.web(() => {
  // Only executes on web
  import('./web-specific-module');
});

Platform.native(() => {
  // Only executes on native platforms (iOS/Android)
  import('./native-specific-module');
});

// Platform selection utility
const platformStyles = Platform.select({
  ios: 'shadow-lg',
  android: 'elevation-4',
  web: 'shadow-md hover:shadow-lg',
  default: 'shadow-sm'
});

const platformConfig = Platform.select({
  ios: {
    animation: 'spring',
    duration: 300
  },
  android: {
    animation: 'timing',
    duration: 250
  },
  web: {
    animation: 'ease',
    duration: 200
  }
});
```

### **Advanced Platform Detection**

```tsx
// Device type detection
const isMobile = Platform.isMobile();         // true on phones
const isTablet = Platform.isTablet();         // true on tablets
const isDesktop = Platform.isDesktop();       // true on desktop

// Touch capability
const isTouchDevice = Platform.isTouchDevice(); // true if supports touch

// Animation capabilities
const canUseNativeDriver = Platform.canUseNativeDriver(); // true on native

// Example: Responsive behavior based on platform
const getOptimalLayoutConfig = () => {
  if (Platform.isDesktop()) {
    return { columns: 4, sidebar: true };
  } else if (Platform.isTablet()) {
    return { columns: 2, sidebar: false };
  } else {
    return { columns: 1, sidebar: false };
  }
};
```

---

## 📱 Device Characteristics

### **Screen and Viewport Utilities**

```tsx
import { Dimensions } from 'react-native';
import Platform from '@resk/nativewind/platform';

// Screen dimensions
const screenDimensions = Dimensions.get('screen');
const windowDimensions = Dimensions.get('window');

console.log('Screen:', screenDimensions); // Full screen including status bar
console.log('Window:', windowDimensions); // Available window space

// Responsive breakpoint detection
const isSmallScreen = windowDimensions.width < 640;
const isMediumScreen = windowDimensions.width >= 640 && windowDimensions.width < 1024;
const isLargeScreen = windowDimensions.width >= 1024;

// Orientation detection
const isLandscape = windowDimensions.width > windowDimensions.height;
const isPortrait = windowDimensions.height > windowDimensions.width;

// Example: Conditional rendering based on screen size
const ResponsiveLayout = ({ children }) => {
  const { width } = Dimensions.get('window');
  
  if (width < 640) {
    return <StackLayout>{children}</StackLayout>;
  } else if (width < 1024) {
    return <GridLayout columns={2}>{children}</GridLayout>;
  } else {
    return <GridLayout columns={3}>{children}</GridLayout>;
  }
};
```

### **iPhone X and Safe Area Handling**

```tsx
// iPhone X detection
const isIPhoneX = Platform.isIphoneX();

// Safe area utilities
const statusBarHeight = Platform.getStatusBarHeight();
const statusBarHeightSafe = Platform.getStatusBarHeight(true); // With safe area
const bottomSpace = Platform.getBottomSpace();

// iPhone X conditional styling
const iphoneXStyles = Platform.iphoneX(
  'pt-11 pb-8', // iPhone X styles (with notch)
  'pt-5 pb-0'   // Regular iPhone styles
);

// Example: Safe area aware component
const SafeAreaComponent = ({ children }) => {
  const statusHeight = Platform.getStatusBarHeight(true);
  const bottomHeight = Platform.getBottomSpace();
  
  return (
    <View 
      style={{
        paddingTop: statusHeight,
        paddingBottom: bottomHeight
      }}
      className="flex-1 bg-background"
    >
      {children}
    </View>
  );
};

// Platform-specific status bar handling
const StatusBarConfig = () => {
  if (Platform.isIos()) {
    return {
      barStyle: 'dark-content',
      backgroundColor: 'transparent',
      translucent: true
    };
  } else if (Platform.isAndroid()) {
    return {
      barStyle: 'light-content',
      backgroundColor: '#000000',
      translucent: false
    };
  }
  return null;
};
```

---

## ⚡ Performance Optimization

### **Conditional Loading and Tree Shaking**

```tsx
// Platform-specific component loading
const PlatformSpecificComponent = React.lazy(() => {
  if (Platform.isIos()) {
    return import('./components/IOSComponent');
  } else if (Platform.isAndroid()) {
    return import('./components/AndroidComponent');
  } else {
    return import('./components/WebComponent');
  }
});

// Conditional feature loading
const loadPlatformFeatures = async () => {
  const features = [];
  
  if (Platform.isNative()) {
    const { NativeFeature } = await import('./features/NativeFeature');
    features.push(NativeFeature);
  }
  
  if (Platform.isWeb()) {
    const { WebFeature } = await import('./features/WebFeature');
    features.push(WebFeature);
  }
  
  return features;
};

// Platform-specific API calls
const apiCall = Platform.select({
  ios: () => import('./api/ios-api'),
  android: () => import('./api/android-api'),
  web: () => import('./api/web-api')
});
```

### **Animation Performance**

```tsx
// Native driver optimization
const createOptimizedAnimation = (value: Animated.Value) => {
  const useNativeDriver = Platform.canUseNativeDriver();
  
  return Animated.timing(value, {
    toValue: 1,
    duration: 300,
    useNativeDriver, // Only use on native platforms
    easing: Platform.select({
      ios: Easing.bezier(0.4, 0, 0.2, 1),
      android: Easing.out(Easing.poly(4)),
      web: Easing.ease
    })
  });
};

// Platform-specific animation configurations
const animationConfig = {
  ...Platform.select({
    ios: {
      spring: {
        damping: 0.8,
        stiffness: 100,
        restSpeedThreshold: 0.001
      }
    },
    android: {
      timing: {
        duration: 250,
        easing: Easing.out(Easing.poly(4))
      }
    },
    web: {
      transition: {
        duration: '0.2s',
        easing: 'ease-out'
      }
    }
  })
};
```

### **Memory and Performance Monitoring**

```tsx
// Performance monitoring utilities
const performanceMonitor = {
  // Memory usage tracking (native only)
  getMemoryUsage: () => {
    if (Platform.isNative()) {
      return require('react-native').PerformanceObserver;
    }
    return null;
  },
  
  // Render performance tracking
  measureRenderTime: (componentName: string) => {
    if (Platform.isDev()) {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        console.log(`${componentName} render time: ${endTime - startTime}ms`);
      };
    }
    return () => {}; // No-op in production
  },
  
  // Bundle size tracking
  getBundleInfo: () => {
    if (Platform.isWeb() && Platform.isDev()) {
      return {
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
    }
    return null;
  }
};

// Example usage
const OptimizedComponent = ({ data }) => {
  const endMeasure = performanceMonitor.measureRenderTime('OptimizedComponent');
  
  useEffect(() => {
    endMeasure();
  });
  
  // Component logic...
  
  return <View>{/* Component content */}</View>;
};
```

---

## 🔧 Advanced Platform Features

### **Dynamic Platform Configuration**

```tsx
// Platform-specific configuration factory
const createPlatformConfig = <T>(configs: {
  ios?: T;
  android?: T;
  web?: T;
  default?: T;
}): T => {
  if (Platform.isIos() && configs.ios) {
    return configs.ios;
  } else if (Platform.isAndroid() && configs.android) {
    return configs.android;
  } else if (Platform.isWeb() && configs.web) {
    return configs.web;
  } else if (configs.default) {
    return configs.default;
  }
  
  throw new Error('No platform configuration found');
};

// Usage example
const networkConfig = createPlatformConfig({
  ios: {
    timeout: 30000,
    retryAttempts: 3,
    caching: true
  },
  android: {
    timeout: 25000,
    retryAttempts: 2,
    caching: true
  },
  web: {
    timeout: 10000,
    retryAttempts: 1,
    caching: false
  }
});
```

### **Platform-Aware Hooks**

```tsx
// Custom platform detection hooks
const usePlatform = () => {
  return {
    isIOS: Platform.isIos(),
    isAndroid: Platform.isAndroid(),
    isWeb: Platform.isWeb(),
    isNative: Platform.isNative(),
    isTouchDevice: Platform.isTouchDevice(),
    canUseNativeDriver: Platform.canUseNativeDriver()
  };
};

const useResponsiveLayout = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);
  
  return {
    ...dimensions,
    isSmall: dimensions.width < 640,
    isMedium: dimensions.width >= 640 && dimensions.width < 1024,
    isLarge: dimensions.width >= 1024,
    isLandscape: dimensions.width > dimensions.height,
    isPortrait: dimensions.height > dimensions.width
  };
};

const useSafeArea = () => {
  return {
    statusBarHeight: Platform.getStatusBarHeight(),
    statusBarHeightSafe: Platform.getStatusBarHeight(true),
    bottomSpace: Platform.getBottomSpace(),
    isIPhoneX: Platform.isIphoneX()
  };
};

// Example component using platform hooks
const PlatformAwareComponent = () => {
  const platform = usePlatform();
  const layout = useResponsiveLayout();
  const safeArea = useSafeArea();
  
  return (
    <View 
      style={{
        paddingTop: safeArea.statusBarHeightSafe,
        paddingBottom: safeArea.bottomSpace
      }}
      className={`
        flex-1 
        ${layout.isSmall ? 'p-4' : 'p-8'}
        ${platform.isIOS ? 'bg-gray-50' : 'bg-white'}
      `}
    >
      <Text>Platform: {platform.isIOS ? 'iOS' : platform.isAndroid ? 'Android' : 'Web'}</Text>
      <Text>Screen: {layout.isSmall ? 'Small' : layout.isMedium ? 'Medium' : 'Large'}</Text>
      <Text>Touch: {platform.isTouchDevice ? 'Yes' : 'No'}</Text>
    </View>
  );
};
```

### **Cross-Platform Component Patterns**

```tsx
// Platform-specific component wrapper
const PlatformWrapper = <T extends Record<string, any>>({
  ios,
  android,
  web,
  children,
  fallback
}: {
  ios?: React.ComponentType<T>;
  android?: React.ComponentType<T>;
  web?: React.ComponentType<T>;
  children?: React.ReactNode;
  fallback?: React.ComponentType<T>;
}) => {
  let Component = fallback;
  
  if (Platform.isIos() && ios) {
    Component = ios;
  } else if (Platform.isAndroid() && android) {
    Component = android;
  } else if (Platform.isWeb() && web) {
    Component = web;
  }
  
  if (Component) {
    return <Component {...(children as any)} />;
  }
  
  return children || null;
};

// Usage
<PlatformWrapper
  ios={IOSSpecificComponent}
  android={AndroidSpecificComponent}
  web={WebSpecificComponent}
  fallback={DefaultComponent}
/>

// Platform-specific styling helper
const platformStyles = (styles: {
  ios?: string;
  android?: string;
  web?: string;
  default?: string;
}) => {
  return Platform.select({
    ios: styles.ios || styles.default || '',
    android: styles.android || styles.default || '',
    web: styles.web || styles.default || '',
    default: styles.default || ''
  });
};

// Usage
<View className={platformStyles({
  ios: 'shadow-lg rounded-xl',
  android: 'elevation-4 rounded-lg',
  web: 'shadow-md hover:shadow-lg rounded-lg transition-shadow',
  default: 'shadow-sm rounded'
})}>
  Content
</View>
```

---

The platform utilities provide a comprehensive foundation for building truly cross-platform applications with @resk/nativewind, ensuring optimal performance and user experience across all supported platforms.

Next, I'll continue with the animations documentation. Would you like me to proceed?
