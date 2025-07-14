# ✨ Animations - @resk/nativewind

> **High-performance animation system with cross-platform optimizations**

## 📖 Overview

The @resk/nativewind animation system provides a comprehensive set of animation utilities, keyframes, and components designed for smooth cross-platform animations. Built with performance in mind, it leverages native drivers where possible and provides graceful fallbacks for web environments.

---

## 🎯 Core Features

### **🚀 Performance Optimized**
- Hardware-accelerated animations on native platforms
- CSS-based animations on web with smooth fallbacks
- Automatic native driver detection and usage
- Minimal JavaScript runtime overhead

### **🎨 Rich Animation Library**
- Pre-built animation keyframes (fade, slide, scale, zoom, rotate)
- Customizable timing functions and durations
- Complex animation sequences and chaining
- Responsive and adaptive animations

### **🔧 Developer Experience**
- Type-safe animation props and configurations
- Intuitive component-based API
- Callback support for animation lifecycle events
- Hot-reload friendly development experience

---

## 🎬 Core Animation Components

### **AnimatedVisibility**

The primary component for controlling element visibility with smooth animations.

```tsx
import { AnimatedVisibility } from '@resk/nativewind/animations';

// Basic fade in/out
const [isVisible, setIsVisible] = useState(false);

<AnimatedVisibility
  visible={isVisible}
  onVisible={() => console.log('Animation completed - now visible')}
  onHidden={() => console.log('Animation completed - now hidden')}
>
  <Text>This content will fade in and out</Text>
</AnimatedVisibility>

// Custom animation duration and timing
<AnimatedVisibility
  visible={isVisible}
  animationDuration={500}
  animationTimingFunction="ease-in-out"
  className="bg-white rounded-lg p-4"
>
  <Text>Custom animated content</Text>
</AnimatedVisibility>

// With lifecycle callbacks
<AnimatedVisibility
  visible={showModal}
  onVisible={() => {
    // Focus first input when modal appears
    firstInputRef.current?.focus();
  }}
  onHidden={() => {
    // Clean up modal state
    setModalData(null);
  }}
>
  <Modal>
    <ModalContent />
  </Modal>
</AnimatedVisibility>
```

**Props:**
```tsx
interface IAnimatedVisibilityProps {
  visible?: boolean;                    // Controls visibility state
  onVisible?: () => void;              // Called when fully visible
  onHidden?: () => void;               // Called when fully hidden
  className?: string;                  // Custom CSS classes
  animationDuration?: number;          // Duration in milliseconds (default: 300)
  animationTimingFunction?: string;    // CSS timing function (default: "ease-in-out")
  enteringAnimationName?: string;      // Custom entering animation
  exitingAnimationName?: string;       // Custom exiting animation
  children: React.ReactNode;           // Content to animate
}
```

---

## 🎭 Built-in Animation Types

### **Fade Animations**

```tsx
// Fade in/out (default)
<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="fade-in"
  exitingAnimationName="fade-out"
>
  <Content />
</AnimatedVisibility>
```

### **Slide Animations**

```tsx
// Slide from different directions
<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="slide-in-left"
  exitingAnimationName="slide-out-left"
>
  <SidePanel />
</AnimatedVisibility>

<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="slide-in-right"
  exitingAnimationName="slide-out-right"
>
  <SidePanel />
</AnimatedVisibility>

<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="slide-in-top"
  exitingAnimationName="slide-out-top"
>
  <TopBar />
</AnimatedVisibility>

<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="slide-in-bottom"
  exitingAnimationName="slide-out-bottom"
>
  <BottomSheet />
</AnimatedVisibility>
```

### **Scale Animations**

```tsx
// Scale in/out
<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="scale-in"
  exitingAnimationName="scale-out"
>
  <FloatingButton />
</AnimatedVisibility>

// Zoom in/out (more dramatic scaling)
<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="zoom-in"
  exitingAnimationName="zoom-out"
>
  <ImagePreview />
</AnimatedVisibility>
```

### **Rotation Animations**

```tsx
// Rotate animations
<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="rotate"
  exitingAnimationName="rotate-reverse"
>
  <LoadingSpinner />
</AnimatedVisibility>

// Flip animations
<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="flip-horizontal"
  exitingAnimationName="flip-vertical"
>
  <Card />
</AnimatedVisibility>
```

---

## 🎨 Animation Keyframes Reference

The framework includes a comprehensive set of predefined keyframes:

```typescript
const AnimationsKeyFrames = {
  // Fade animations
  "fade-in": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 }
  },
  "fade-out": {
    "0%": { opacity: 1 },
    "100%": { opacity: 0 }
  },

  // Slide animations (from origin)
  "slide-in-left": {
    "0%": { transform: "translateX(-100%)", opacity: "0" },
    "100%": { transform: "translateX(0)", opacity: "1" }
  },
  "slide-in-right": {
    "0%": { transform: "translateX(100%)", opacity: "0" },
    "100%": { transform: "translateX(0)", opacity: "1" }
  },
  "slide-in-top": {
    "0%": { transform: "translateY(-100%)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" }
  },
  "slide-in-bottom": {
    "0%": { transform: "translateY(100%)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" }
  },

  // Slide animations (to destination)
  "slide-out-left": {
    "0%": { transform: "translateX(0)", opacity: "1" },
    "100%": { transform: "translateX(-100%)", opacity: "0" }
  },
  "slide-out-right": {
    "0%": { transform: "translateX(0)", opacity: "1" },
    "100%": { transform: "translateX(100%)", opacity: "0" }
  },
  "slide-out-top": {
    "0%": { transform: "translateY(0)", opacity: "1" },
    "100%": { transform: "translateY(-100%)", opacity: "0" }
  },
  "slide-out-bottom": {
    "0%": { transform: "translateY(0)", opacity: "1" },
    "100%": { transform: "translateY(100%)", opacity: "0" }
  },

  // Scale animations
  "scale-in": {
    "0%": { transform: "scale(0)", opacity: "0" },
    "100%": { transform: "scale(1)", opacity: "1" }
  },
  "scale-out": {
    "0%": { transform: "scale(1)", opacity: "1" },
    "100%": { transform: "scale(0)", opacity: "0" }
  },

  // Zoom animations (more dramatic)
  "zoom-in": {
    "0%": { transform: "scale(0.3)", opacity: "0" },
    "50%": { opacity: "1" },
    "100%": { transform: "scale(1)", opacity: "1" }
  },
  "zoom-out": {
    "0%": { transform: "scale(1)", opacity: "1" },
    "50%": { opacity: "1" },
    "100%": { transform: "scale(0.3)", opacity: "0" }
  },

  // Rotation animations
  "rotate": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" }
  },
  "rotate-reverse": {
    "0%": { transform: "rotate(360deg)" },
    "100%": { transform: "rotate(0deg)" }
  },

  // Flip animations
  "flip-horizontal": {
    "0%": { transform: "rotateY(0deg)" },
    "100%": { transform: "rotateY(180deg)" }
  },
  "flip-vertical": {
    "0%": { transform: "rotateX(0deg)" },
    "100%": { transform: "rotateX(180deg)" }
  }
};
```

---

## 🔧 Advanced Animation Patterns

### **Sequential Animations**

```tsx
const SequentialAnimationExample = () => {
  const [step, setStep] = useState(0);
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  return (
    <div className="space-y-4">
      {/* Step 1 */}
      <AnimatedVisibility
        visible={step >= 0}
        onVisible={() => step === 0 && setTimeout(nextStep, 1000)}
        enteringAnimationName="fade-in"
      >
        <Text>Step 1: Welcome!</Text>
      </AnimatedVisibility>

      {/* Step 2 */}
      <AnimatedVisibility
        visible={step >= 1}
        onVisible={() => step === 1 && setTimeout(nextStep, 1000)}
        enteringAnimationName="slide-in-left"
      >
        <Text>Step 2: Sliding in from left</Text>
      </AnimatedVisibility>

      {/* Step 3 */}
      <AnimatedVisibility
        visible={step >= 2}
        enteringAnimationName="scale-in"
      >
        <Text>Step 3: Scaling in</Text>
      </AnimatedVisibility>
    </div>
  );
};
```

### **Staggered Animations**

```tsx
const StaggeredList = ({ items }) => {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    // Stagger item appearance
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, item.id]));
      }, index * 100); // 100ms delay between items
    });
  }, [items]);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <AnimatedVisibility
          key={item.id}
          visible={visibleItems.has(item.id)}
          enteringAnimationName="slide-in-right"
          animationDuration={300}
          animationTimingFunction="ease-out"
        >
          <ListItem data={item} />
        </AnimatedVisibility>
      ))}
    </div>
  );
};
```

### **Conditional Animation Directions**

```tsx
const ConditionalSlidePanel = ({ isOpen, direction = 'left' }) => {
  const getAnimations = () => {
    switch (direction) {
      case 'left':
        return { enter: 'slide-in-left', exit: 'slide-out-left' };
      case 'right':
        return { enter: 'slide-in-right', exit: 'slide-out-right' };
      case 'top':
        return { enter: 'slide-in-top', exit: 'slide-out-top' };
      case 'bottom':
        return { enter: 'slide-in-bottom', exit: 'slide-out-bottom' };
      default:
        return { enter: 'fade-in', exit: 'fade-out' };
    }
  };

  const animations = getAnimations();

  return (
    <AnimatedVisibility
      visible={isOpen}
      enteringAnimationName={animations.enter}
      exitingAnimationName={animations.exit}
      animationDuration={400}
    >
      <SidePanel direction={direction} />
    </AnimatedVisibility>
  );
};
```

### **Animation with Loading States**

```tsx
const LoadingWithAnimation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchData();
      setData(result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onPress={loadData}>Load Data</Button>
      
      {/* Loading animation */}
      <AnimatedVisibility
        visible={isLoading}
        enteringAnimationName="fade-in"
        exitingAnimationName="fade-out"
      >
        <div className="flex items-center space-x-2 p-4">
          <ActivityIndicator />
          <Text>Loading...</Text>
        </div>
      </AnimatedVisibility>

      {/* Data animation */}
      <AnimatedVisibility
        visible={!isLoading && data}
        enteringAnimationName="slide-in-bottom"
        animationDuration={500}
      >
        <DataDisplay data={data} />
      </AnimatedVisibility>
    </div>
  );
};
```

---

## 🎬 Animation Hooks

### **useAnimatedVisibility**

The core hook powering the AnimatedVisibility component, available for custom animation implementations.

```tsx
import { useAnimatedVisibility } from '@resk/nativewind/animations';

const CustomAnimatedComponent = ({ visible, children }) => {
  const {
    shouldRender,
    className,
    style,
    onAnimationEnd,
    isRendering,
    animationName
  } = useAnimatedVisibility({
    visible,
    enteringAnimationName: 'scale-in',
    exitingAnimationName: 'scale-out',
    animationDuration: 400,
    onVisible: () => console.log('Visible!'),
    onHidden: () => console.log('Hidden!')
  });

  if (!shouldRender) return null;

  return (
    <div 
      className={className}
      style={style}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};
```

**Hook Return Values:**
```tsx
{
  shouldRender: boolean;           // Whether component should be rendered
  className: string;               // Computed CSS classes for animation
  style: object;                   // Inline styles for animation
  onAnimationEnd: () => void;      // Animation end callback
  isRendering: boolean;            // Current rendering state
  animationName: string;           // Current animation name
  visible: boolean;                // Current visibility state
  enteringAnimation: string;       // Entering animation name
  exitingAnimation: string;        // Exiting animation name
}
```

---

## ⚡ Performance Optimizations

### **Native Driver Usage**

```tsx
import Platform from '@resk/nativewind/platform';

// Automatically optimized for native platforms
const OptimizedAnimation = ({ visible, children }) => {
  const canUseNativeDriver = Platform.canUseNativeDriver();
  
  return (
    <AnimatedVisibility
      visible={visible}
      enteringAnimationName="fade-in"
      exitingAnimationName="fade-out"
      // Animation automatically uses native driver when available
      animationDuration={canUseNativeDriver ? 200 : 300}
    >
      {children}
    </AnimatedVisibility>
  );
};
```

### **Conditional Animation Loading**

```tsx
// Only load heavy animations on capable devices
const ConditionalHeavyAnimation = ({ visible, children }) => {
  const isHighPerformanceDevice = Platform.isNative() && !Platform.isLowEndDevice();
  
  return (
    <AnimatedVisibility
      visible={visible}
      enteringAnimationName={
        isHighPerformanceDevice ? 'complex-3d-rotation' : 'fade-in'
      }
      exitingAnimationName={
        isHighPerformanceDevice ? 'complex-3d-scale' : 'fade-out'
      }
    >
      {children}
    </AnimatedVisibility>
  );
};
```

### **Animation Performance Monitoring**

```tsx
const PerformanceMonitoredAnimation = ({ visible, children }) => {
  const startTime = useRef<number>();
  
  return (
    <AnimatedVisibility
      visible={visible}
      onVisible={() => {
        if (startTime.current) {
          const duration = performance.now() - startTime.current;
          console.log(`Animation completed in ${duration}ms`);
        }
      }}
      enteringAnimationName="slide-in-left"
    >
      {children}
    </AnimatedVisibility>
  );
};
```

---

## 🎨 Custom Animation Creation

### **Creating Custom Keyframes**

```tsx
// Extend the animation system with custom keyframes
const customKeyframes = {
  "bounce-in": {
    "0%": { 
      transform: "scale(0.3)", 
      opacity: "0" 
    },
    "50%": { 
      transform: "scale(1.05)" 
    },
    "70%": { 
      transform: "scale(0.9)" 
    },
    "100%": { 
      transform: "scale(1)", 
      opacity: "1" 
    }
  },
  "wobble": {
    "0%": { transform: "translateX(0%)" },
    "15%": { transform: "translateX(-25%) rotate(-5deg)" },
    "30%": { transform: "translateX(20%) rotate(3deg)" },
    "45%": { transform: "translateX(-15%) rotate(-3deg)" },
    "60%": { transform: "translateX(10%) rotate(2deg)" },
    "75%": { transform: "translateX(-5%) rotate(-1deg)" },
    "100%": { transform: "translateX(0%)" }
  }
};

// Use custom animations
<AnimatedVisibility
  visible={isVisible}
  enteringAnimationName="bounce-in"
  exitingAnimationName="wobble"
>
  <Content />
</AnimatedVisibility>
```

### **Dynamic Animation Selection**

```tsx
const DynamicAnimationComponent = ({ visible, type, children }) => {
  const getAnimations = (type: string) => {
    const animationMap = {
      'gentle': { enter: 'fade-in', exit: 'fade-out' },
      'dynamic': { enter: 'scale-in', exit: 'scale-out' },
      'slide': { enter: 'slide-in-left', exit: 'slide-out-right' },
      'dramatic': { enter: 'zoom-in', exit: 'zoom-out' }
    };
    
    return animationMap[type] || animationMap['gentle'];
  };

  const animations = getAnimations(type);

  return (
    <AnimatedVisibility
      visible={visible}
      enteringAnimationName={animations.enter}
      exitingAnimationName={animations.exit}
      animationDuration={type === 'dramatic' ? 600 : 300}
    >
      {children}
    </AnimatedVisibility>
  );
};
```

---

The animation system in @resk/nativewind provides a robust foundation for creating engaging user interfaces with smooth, performant animations across all supported platforms. The combination of pre-built animations, custom animation support, and platform-specific optimizations ensures excellent user experience while maintaining developer productivity.

Next, I'll continue with the i18n documentation. Would you like me to proceed?
