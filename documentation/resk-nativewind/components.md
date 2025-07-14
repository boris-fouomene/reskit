# 🧩 Components - @resk/nativewind

> **Universal UI component library with 50+ SSR-optimized, cross-platform components**

## 📖 Overview

The @resk/nativewind component library provides 50+ meticulously crafted UI components designed for universal React applications. Built from the ground up with **Server-Side Rendering (SSR)**, **cross-platform compatibility**, and **performance** as core principles, these components work seamlessly across **Next.js**, **React Native**, **Expo**, **Web**, and **Node.js** environments.

---

## � Universal Platform Support

### **🚀 Server-Side Rendering (SSR) Optimized**
- **Zero hydration mismatches** - Components render consistently on server and client
- **Automatic style extraction** - Critical CSS inlined for faster initial paint
- **Progressive enhancement** - Interactive features activate after hydration
- **SEO-friendly** - Full content accessibility for search engines
- **Next.js App Router compatible** - Works with React Server Components

### **� Cross-Platform Excellence**
- **React Native** - Native performance on iOS and Android
- **Expo** - Universal apps with managed workflow support
- **Next.js** - Full-stack web applications with SSR/SSG
- **Web** - Progressive Web Apps and SPAs
- **Node.js** - Server-side component rendering

### **🎨 Consistent Design System**
- **Universal styling** - NativeWind ensures identical appearance across platforms
- **Responsive design** - Adaptive layouts for mobile, tablet, and desktop
- **Dark mode support** - Automatic theme switching with system preferences
- **Platform-aware rendering** - Optimized interactions per platform

### **🔧 Developer Experience**
- **Full TypeScript support** - Comprehensive type definitions with IntelliSense
- **Hot reload friendly** - Fast development iteration across all platforms
- **Tree-shakeable** - Import only the components you need
- **Zero configuration** - Works out of the box with sensible defaults

### **♿ Accessibility & Performance**
- **WCAG 2.1 AA compliant** - Screen reader and keyboard navigation support
- **Optimized bundle sizes** - Lazy loading and code splitting
- **60fps animations** - Hardware-accelerated transitions
- **Memory efficient** - Minimal runtime overhead

---

## 🏗️ Foundation Components

### **AppRoot**

Universal application wrapper that provides theme, navigation, and platform context.

```tsx
import { AppRoot } from '@resk/nativewind';

// Next.js App Router (app/layout.tsx)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRoot
          platform="web"
          theme="system"
          ssrOptimized={true}
          navigationMode="web"
        >
          {children}
        </AppRoot>
      </body>
    </html>
  );
}

// React Native App (App.tsx)
export default function App() {
  return (
    <AppRoot
      platform="native"
      theme="system"
      statusBarStyle="auto"
      navigationMode="stack"
    >
      <Navigation />
    </AppRoot>
  );
}

// Expo Universal App
export default function App() {
  return (
    <AppRoot
      platform={Platform.OS === 'web' ? 'web' : 'native'}
      theme="system"
      ssrOptimized={Platform.OS === 'web'}
      responsiveBreakpoints={{
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280
      }}
    >
      <UniversalNavigation />
    </AppRoot>
  );
}

// Server Components (Next.js)
import { AppRoot } from '@resk/nativewind/server';

export default async function ServerLayout({ children }) {
  const theme = await getThemeFromCookies();
  
  return (
    <AppRoot
      platform="web"
      theme={theme}
      ssrOptimized={true}
      criticalCSS={true}
    >
      {children}
    </AppRoot>
  );
}
```

### **ThemeProvider**

Universal theme management with SSR support and automatic platform adaptation.

```tsx
import { ThemeProvider, useTheme } from '@resk/nativewind';

// Custom theme configuration
const customTheme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    }
  },
  fonts: {
    // Web fonts
    web: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    // Native fonts
    native: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      bold: 'Inter-Bold'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};

// Provider setup
<ThemeProvider
  theme={customTheme}
  defaultMode="system"
  ssrSafe={true}
  platformAdaptive={true}
>
  <App />
</ThemeProvider>

// Usage in components
function ThemedComponent() {
  const { theme, mode, setMode, platformColors } = useTheme();
  
  return (
    <View className={`bg-${theme.colors.primary[500]} p-${theme.spacing.md}`}>
      <Text>Current theme: {mode}</Text>
      <Button onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
    </View>
  );
}
```

### **Portal**

Universal portal system for rendering content outside component hierarchy.

```tsx
import { Portal, PortalHost } from '@resk/nativewind';

// Next.js Layout (supports SSR)
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <div id="app">{children}</div>
        <PortalHost name="modals" />
        <PortalHost name="toasts" />
      </body>
    </html>
  );
}

// React Native App
export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <PortalHost name="modals" />
      <PortalHost name="overlays" />
    </View>
  );
}

// Usage across platforms
<Portal destination="modals">
  <Modal visible={isVisible} onClose={() => setIsVisible(false)}>
    <Text>This modal works on all platforms!</Text>
  </Modal>
</Portal>

// SSR-safe portal
<Portal destination="toasts" ssrSafe={true}>
  <Toast message="Server-rendered toast!" />
</Portal>
```

---

## 🧭 Navigation & Layout

### **AppBar**

Universal top navigation with platform-adaptive styling and SSR support.

```tsx
import { AppBar } from '@resk/nativewind';

// Next.js Web AppBar
<AppBar
  title="Dashboard"
  subtitle="Welcome back"
  leftAction={{
    icon: "menu",
    onPress: () => setMenuOpen(true),
    ariaLabel: "Open navigation menu"
  }}
  rightActions={[
    { 
      icon: "search", 
      onPress: () => router.push('/search'),
      ariaLabel: "Search"
    },
    { 
      icon: "user", 
      onPress: () => router.push('/profile'),
      ariaLabel: "Profile"
    }
  ]}
  variant="elevated"
  platform="web"
  responsive={true}
/>

// React Native AppBar
<AppBar
  title="Messages"
  leftAction={{
    icon: "arrow-left",
    onPress: () => navigation.goBack()
  }}
  rightActions={[
    { 
      icon: "phone", 
      onPress: () => makeCall() 
    },
    { 
      icon: "video", 
      onPress: () => startVideo() 
    }
  ]}
  variant="transparent"
  platform="native"
  statusBarHeight={StatusBar.currentHeight}
/>

// Universal AppBar with SSR
<AppBar
  title="Universal App"
  platform={Platform.OS === 'web' ? 'web' : 'native'}
  ssrOptimized={true}
  hydrationSafe={true}
  responsive={{
    mobile: { variant: "compact" },
    desktop: { variant: "extended" }
  }}
/>
```

### **Nav**

Cross-platform navigation component with responsive design.

```tsx
import { Nav } from '@resk/nativewind';

// Desktop sidebar navigation (Next.js)
<Nav
  orientation="vertical"
  variant="sidebar"
  collapsible={true}
  platform="web"
  items={[
    {
      label: "Dashboard",
      icon: "dashboard",
      href: "/dashboard",
      active: pathname === '/dashboard'
    },
    {
      label: "Analytics",
      icon: "chart",
      href: "/analytics",
      badge: { count: 3, variant: "info" }
    },
    {
      label: "Settings",
      icon: "settings",
      href: "/settings",
      children: [
        { label: "Profile", href: "/settings/profile" },
        { label: "Billing", href: "/settings/billing" }
      ]
    }
  ]}
/>

// Mobile bottom navigation (React Native)
<Nav
  orientation="horizontal"
  variant="bottom-tabs"
  platform="native"
  items={[
    {
      label: "Home",
      icon: "home",
      onPress: () => navigation.navigate('Home'),
      active: currentRoute === 'Home'
    },
    {
      label: "Explore",
      icon: "compass",
      onPress: () => navigation.navigate('Explore'),
      badge: { dot: true }
    },
    {
      label: "Profile",
      icon: "user",
      onPress: () => navigation.navigate('Profile')
    }
  ]}
/>

// Universal responsive navigation
<Nav
  responsive={{
    mobile: {
      orientation: "horizontal",
      variant: "bottom-tabs",
      position: "fixed-bottom"
    },
    desktop: {
      orientation: "vertical",
      variant: "sidebar",
      position: "fixed-left"
    }
  }}
  ssrOptimized={true}
  items={navigationItems}
/>
```

### **Stack & Flex**

Universal layout components with responsive design and SSR optimization.

```tsx
import { Stack, Flex } from '@resk/nativewind';

// Responsive stack layout
<Stack
  direction={{ mobile: "vertical", tablet: "horizontal" }}
  spacing={{ mobile: "sm", tablet: "md", desktop: "lg" }}
  align="center"
  justify="space-between"
  wrap={true}
  ssrOptimized={true}
>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
  <Button>Action 3</Button>
</Stack>

// Flex container with platform-adaptive spacing
<Flex
  direction="row"
  align="center"
  justify="space-between"
  gap={{ mobile: 8, tablet: 16, desktop: 24 }}
  className="p-4"
>
  <Avatar size="md" />
  <Flex direction="column" flex={1} gap={4}>
    <Text variant="heading">John Doe</Text>
    <Text variant="caption">Online now</Text>
  </Flex>
  <Button variant="ghost" size="sm">Follow</Button>
</Flex>

// Grid layout (web-optimized)
<Stack
  variant="grid"
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="md"
  responsive={true}
>
  {items.map(item => (
    <Card key={item.id} {...item} />
  ))}
</Stack>
```

---

## 🎭 Display & Media

### **Avatar**

Universal avatar component with SSR-safe image loading and platform optimization.

```tsx
import { Avatar } from '@resk/nativewind';

// SSR-safe avatar with fallback
<Avatar
  src="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
  fallback="JD"
  size="lg"
  alt="John Doe's avatar"
  ssrOptimized={true}
  loadingStrategy="lazy"
  platform={Platform.OS}
/>

// Avatar with status (cross-platform)
<Avatar
  src={user.avatar}
  fallback={user.initials}
  status={{
    type: user.isOnline ? "online" : "offline",
    position: "bottom-right",
    size: "sm"
  }}
  size="xl"
  borderWidth={2}
  borderColor="white"
/>

// Avatar group with responsive sizing
<Avatar.Group
  max={3}
  spacing="overlap"
  size={{ mobile: "sm", tablet: "md" }}
  showMore={true}
  onMorePress={() => showAllUsers()}
>
  {users.map(user => (
    <Avatar
      key={user.id}
      src={user.avatar}
      fallback={user.initials}
      alt={`${user.name}'s avatar`}
    />
  ))}
</Avatar.Group>

// Platform-adaptive avatar
<Avatar
  src={profileImage}
  fallback={initials}
  size="lg"
  variant={Platform.OS === 'web' ? 'rounded' : 'circular'}
  interactive={Platform.OS === 'web'}
  onPress={Platform.OS !== 'web' ? openProfile : undefined}
  href={Platform.OS === 'web' ? '/profile' : undefined}
/>
```

### **Icon**

Universal icon system with SSR optimization and platform-specific rendering.

```tsx
import { Icon } from '@resk/nativewind';

// Web-optimized SVG icons
<Icon
  name="heart"
  size={24}
  color="red-500"
  platform="web"
  variant="outline"
  ssrOptimized={true}
/>

// Native vector icons
<Icon
  name="MaterialIcons:favorite"
  size={24}
  color="#FF6B35"
  platform="native"
/>

// Universal icon with platform detection
<Icon
  name="star"
  size={20}
  variant={Platform.OS === 'web' ? 'filled' : 'outline'}
  color="yellow-400"
  accessibilityLabel="Favorite item"
/>

// Icon button with platform-adaptive interaction
<Icon.Button
  name="plus"
  size={24}
  onPress={addItem}
  variant="primary"
  platform={Platform.OS}
  ripple={Platform.OS === 'android'}
  hapticFeedback={Platform.OS !== 'web'}
  accessibilityLabel="Add new item"
/>

// Country flag icons (universal)
<Icon.CountryFlag
  country={user.country}
  size={32}
  style="rounded"
  ssrOptimized={true}
  fallback={<Icon name="globe" />}
/>

// Font icons with web font loading
<Icon.Font
  family="Feather"
  name="user"
  size={24}
  webFontUrl="https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.css"
  ssrOptimized={true}
/>
```

### **Badge**

Universal badge component with SSR support and platform-adaptive positioning.

```tsx
import { Badge } from '@resk/nativewind';

// Notification badge (universal)
<View className="relative">
  <Icon name="bell" size={24} />
  <Badge
    count={notificationCount}
    max={99}
    variant="error"
    position="top-right"
    offset={{ x: -6, y: 6 }}
    ssrOptimized={true}
    showZero={false}
  />
</View>

// Status badge with responsive sizing
<Badge
  text={user.status}
  variant="success"
  size={{ mobile: "sm", tablet: "md" }}
  icon="check-circle"
  animated={true}
/>

// Platform-adaptive badge
<Badge
  count={cartItems.length}
  variant="primary"
  platform={Platform.OS}
  style={{
    // Web-specific styles
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }),
    // Native-specific styles
    ...(Platform.OS !== 'web' && {
      elevation: 3
    })
  }}
/>

// Dot badge for minimal indicators
<Badge
  dot={true}
  variant="warning"
  size="sm"
  animated={hasNewUpdates}
  accessibilityLabel="New updates available"
/>
```

---

## 📱 Input & Forms

### **TextInput**

Universal text input with SSR-safe validation and platform-adaptive keyboard handling.

```tsx
import { TextInput } from '@resk/nativewind';

// SSR-optimized form input
<TextInput
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  type="email"
  autoComplete="email"
  required={true}
  ssrOptimized={true}
  platform={Platform.OS}
  validation={{
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address"
  }}
/>

// Platform-adaptive text input
<TextInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  showPasswordToggle={true}
  platform={Platform.OS}
  autoComplete={Platform.OS === 'web' ? 'current-password' : 'password'}
  keyboardType={Platform.OS === 'web' ? undefined : 'default'}
  textContentType={Platform.OS === 'ios' ? 'password' : undefined}
/>

// Responsive multiline input
<TextInput
  label="Description"
  multiline={true}
  numberOfLines={{ mobile: 3, tablet: 5 }}
  maxLength={500}
  showCharacterCount={true}
  autoResize={Platform.OS === 'web'}
  placeholder="Tell us about yourself..."
/>

// Real-time validation
<TextInput
  label="Username"
  value={username}
  onChangeText={setUsername}
  validation={{
    async: true,
    validator: async (value) => {
      const isAvailable = await checkUsernameAvailability(value);
      return isAvailable ? null : "Username is not available";
    },
    debounce: 500
  }}
  leftIcon="user"
  rightIcon={isValidating ? "loader" : isValid ? "check" : "x"}
/>
```

### **Button**

Universal button component with SSR support and platform-adaptive interactions.

```tsx
import { Button } from '@resk/nativewind';

// Next.js Link integration
<Button
  href="/dashboard"
  variant="primary"
  size="lg"
  platform="web"
  prefetch={true}
  ssrOptimized={true}
>
  Go to Dashboard
</Button>

// React Native navigation
<Button
  onPress={() => navigation.navigate('Profile')}
  variant="secondary"
  size="md"
  platform="native"
  hapticFeedback="impactLight"
  ripple={Platform.OS === 'android'}
>
  View Profile
</Button>

// Universal async button
<Button
  onPress={async () => {
    setLoading(true);
    try {
      await saveData();
      toast.success('Data saved!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  }}
  loading={loading}
  disabled={!isFormValid}
  variant="primary"
  icon="save"
  iconPosition="left"
  platform={Platform.OS}
>
  Save Changes
</Button>

// Responsive button group
<Button.Group
  orientation={{ mobile: "vertical", tablet: "horizontal" }}
  spacing="sm"
  variant="outline"
>
  <Button flex={1}>Cancel</Button>
  <Button flex={1} variant="primary">Save</Button>
  <Button flex={1} variant="secondary">Save & Continue</Button>
</Button.Group>
```

### **Switch**

Universal toggle control with platform-native animations and SSR support.

```tsx
import { Switch } from '@resk/nativewind';

// Platform-adaptive switch
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  platform={Platform.OS}
  size="md"
  variant="primary"
  trackColor={{
    false: Platform.OS === 'web' ? '#e5e7eb' : '#767577',
    true: '#3b82f6'
  }}
  thumbColor={isEnabled ? '#ffffff' : '#f3f4f6'}
  ios_backgroundColor="#e5e7eb"
  accessibilityLabel="Enable notifications"
/>

// Form integration with validation
<FormField
  label="Email Notifications"
  description="Receive updates about your account"
>
  <Switch
    value={emailNotifications}
    onValueChange={(value) => {
      setEmailNotifications(value);
      updateSettings({ emailNotifications: value });
    }}
    disabled={!hasEmailPermission}
    platform={Platform.OS}
  />
</FormField>

// Settings list with switches
<SettingsList>
  <SettingsItem
    title="Push Notifications"
    description="Receive push notifications on your device"
    right={
      <Switch
        value={settings.pushNotifications}
        onValueChange={(value) => updateSetting('pushNotifications', value)}
        platform={Platform.OS}
      />
    }
  />
  <SettingsItem
    title="Location Services"
    description="Allow app to access your location"
    right={
      <Switch
        value={settings.locationServices}
        onValueChange={(value) => updateSetting('locationServices', value)}
        platform={Platform.OS}
      />
    }
  />
</SettingsList>
```

### **Checkbox**

Universal checkbox with form integration and SSR-safe state management.

```tsx
import { Checkbox } from '@resk/nativewind';

// Form checkbox with validation
<Checkbox
  checked={agreedToTerms}
  onCheckedChange={setAgreedToTerms}
  label="I agree to the Terms of Service and Privacy Policy"
  required={true}
  error={!agreedToTerms && submitted ? "You must agree to continue" : undefined}
  platform={Platform.OS}
  ssrOptimized={true}
/>

// Checkbox group with state management
<Checkbox.Group
  value={selectedInterests}
  onValueChange={setSelectedInterests}
  label="Select your interests"
  error={selectedInterests.length === 0 ? "Please select at least one interest" : undefined}
>
  <Checkbox value="technology" label="Technology" />
  <Checkbox value="sports" label="Sports" />
  <Checkbox value="music" label="Music" />
  <Checkbox value="travel" label="Travel" />
</Checkbox.Group>

// Indeterminate checkbox for select-all
<Checkbox
  checked={selectedItems.length === allItems.length}
  indeterminate={selectedItems.length > 0 && selectedItems.length < allItems.length}
  onCheckedChange={(checked) => {
    if (checked) {
      setSelectedItems(allItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  }}
  label={`Select all (${selectedItems.length}/${allItems.length})`}
  platform={Platform.OS}
/>
```

---

## 🔄 Feedback & Loading

### **ActivityIndicator**

Universal loading indicator with SSR support and platform-native animations.

```tsx
import { ActivityIndicator } from '@resk/nativewind';

// SSR-safe loading state
<ActivityIndicator
  size="large"
  color="primary"
  platform={Platform.OS}
  ssrOptimized={true}
  fallback={<Text>Loading...</Text>}
/>

// Skeleton loading for better UX
<ActivityIndicator
  loading={isLoading}
  skeleton={
    <View>
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} width="40%" className="mt-2" />
    </View>
  }
>
  <UserProfile user={userData} />
</ActivityIndicator>

// Platform-adaptive spinner
<ActivityIndicator
  size={Platform.OS === 'web' ? 32 : 'large'}
  animating={isLoading}
  hidesWhenStopped={true}
  style={{
    ...(Platform.OS === 'web' && {
      // CSS animations for web
      animation: 'spin 1s linear infinite'
    })
  }}
/>

// Loading overlay
<ActivityIndicator
  overlay={true}
  visible={isProcessing}
  message="Processing your request..."
  platform={Platform.OS}
  backdrop={{
    opacity: 0.7,
    color: 'rgba(0,0,0,0.5)'
  }}
/>
```

### **Alert**

Universal alert system with SSR support and platform-adaptive presentation.

```tsx
import { Alert } from '@resk/nativewind';

// Web toast notification
<Alert
  type="success"
  title="Success!"
  message="Your changes have been saved successfully."
  platform="web"
  variant="toast"
  position="top-right"
  duration={4000}
  dismissible={true}
  ssrOptimized={true}
/>

// Native alert dialog
<Alert
  type="warning"
  title="Confirm Delete"
  message="Are you sure you want to delete this item? This action cannot be undone."
  platform="native"
  variant="dialog"
  actions={[
    {
      label: "Cancel",
      style: "cancel",
      onPress: () => setShowAlert(false)
    },
    {
      label: "Delete",
      style: "destructive",
      onPress: handleDelete
    }
  ]}
/>

// Universal inline alert
<Alert
  type="info"
  message="Your account verification is pending. Check your email for instructions."
  platform={Platform.OS}
  variant="inline"
  icon="info-circle"
  closeable={true}
  onClose={() => setShowInfo(false)}
  className="mb-4"
/>

// Error boundary alert
<Alert
  type="error"
  title="Something went wrong"
  message="An unexpected error occurred. Please try again."
  platform={Platform.OS}
  actions={[
    {
      label: "Try Again",
      onPress: retry
    },
    {
      label: "Report Issue",
      onPress: reportError
    }
  ]}
  persistent={true}
/>
```

### **ProgressBar**

Universal progress indicator with SSR optimization and responsive design.

```tsx
import { ProgressBar } from '@resk/nativewind';

// File upload progress
<ProgressBar
  progress={uploadProgress}
  variant="primary"
  size="md"
  showLabel={true}
  label={`Uploading... ${Math.round(uploadProgress * 100)}%`}
  animated={true}
  platform={Platform.OS}
  className="w-full"
/>

// Multi-step form progress
<ProgressBar
  progress={currentStep / totalSteps}
  variant="success"
  showSteps={true}
  steps={formSteps}
  currentStep={currentStep}
  platform={Platform.OS}
  responsive={true}
/>

// Indeterminate loading
<ProgressBar
  indeterminate={true}
  variant="primary"
  size="sm"
  platform={Platform.OS}
  duration={2000}
  className="mb-4"
/>

// Circular progress (native)
<ProgressBar
  progress={downloadProgress}
  variant="circular"
  size={60}
  strokeWidth={4}
  showPercentage={true}
  platform="native"
  colors={['#3b82f6', '#8b5cf6']}
/>
```

---

## 🔧 Interactive & Controls

### **Menu**

Universal dropdown menu with SSR support and platform-adaptive positioning.

```tsx
import { Menu } from '@resk/nativewind';

// Web context menu
<Menu
  trigger={<Button variant="outline">Actions</Button>}
  platform="web"
  placement="bottom-start"
  ssrOptimized={true}
  portal={true}
  items={[
    { 
      label: "Edit", 
      icon: "edit", 
      onPress: () => edit(),
      shortcut: "Cmd+E"
    },
    { 
      label: "Duplicate", 
      icon: "copy", 
      onPress: () => duplicate(),
      shortcut: "Cmd+D"
    },
    { type: "divider" },
    { 
      label: "Delete", 
      icon: "trash", 
      onPress: () => delete(),
      variant: "danger"
    }
  ]}
/>

// Native action sheet
<Menu
  trigger={<Icon.Button name="more-vertical" />}
  platform="native"
  variant="action-sheet"
  title="Choose an action"
  items={[
    { label: "Share", icon: "share", onPress: handleShare },
    { label: "Edit", icon: "edit", onPress: handleEdit },
    { label: "Delete", icon: "trash", onPress: handleDelete, destructive: true }
  ]}
/>

// Nested menu structure
<Menu
  trigger={<Button>File</Button>}
  platform={Platform.OS}
>
  <Menu.Item label="New" icon="plus" shortcut="Cmd+N" />
  <Menu.Item label="Open" icon="folder-open" shortcut="Cmd+O" />
  <Menu.Submenu label="Recent Files" icon="clock">
    <Menu.Item label="project1.json" />
    <Menu.Item label="config.ts" />
    <Menu.Item label="README.md" />
  </Menu.Submenu>
  <Menu.Divider />
  <Menu.Item label="Save" icon="save" shortcut="Cmd+S" />
</Menu>

// Universal responsive menu
<Menu
  trigger={<Button>Options</Button>}
  responsive={{
    mobile: { variant: "bottom-sheet" },
    desktop: { variant: "dropdown", placement: "bottom-end" }
  }}
  items={menuItems}
/>
```

### **Dropdown**

Universal selection dropdown with search and multi-select capabilities.

```tsx
import { Dropdown } from '@resk/nativewind';

// Basic dropdown with SSR support
<Dropdown
  label="Select Country"
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  options={countries}
  placeholder="Choose a country"
  platform={Platform.OS}
  ssrOptimized={true}
  searchable={true}
/>

// Multi-select dropdown
<Dropdown
  label="Skills"
  value={selectedSkills}
  onValueChange={setSelectedSkills}
  options={skillOptions}
  multiple={true}
  maxSelected={5}
  placeholder="Select your skills"
  renderValue={(values) => `${values.length} skills selected`}
/>

// Async dropdown with API integration
<Dropdown
  label="Search Users"
  value={selectedUser}
  onValueChange={setSelectedUser}
  async={true}
  loadOptions={async (query) => {
    const response = await searchUsers(query);
    return response.data.map(user => ({
      label: user.name,
      value: user.id,
      avatar: user.avatar
    }));
  }}
  debounce={300}
  placeholder="Type to search users..."
/>

// Platform-adaptive dropdown
<Dropdown
  label="Priority"
  value={priority}
  onValueChange={setPriority}
  options={priorityOptions}
  platform={Platform.OS}
  variant={Platform.OS === 'web' ? 'dropdown' : 'picker'}
  responsive={{
    mobile: { variant: "bottom-sheet" },
    desktop: { variant: "dropdown" }
  }}
/>
```

---

## 🔲 Layout & Structure

### **Surface**

Universal elevated container with SSR-safe styling and platform-adaptive shadows.

```tsx
import { Surface } from '@resk/nativewind';

// Basic elevated surface
<Surface
  elevation={2}
  variant="elevated"
  padding="lg"
  borderRadius="lg"
  platform={Platform.OS}
  ssrOptimized={true}
>
  <Text>Content goes here</Text>
</Surface>

// Web-optimized card surface
<Surface
  elevation={3}
  variant="card"
  platform="web"
  className="transition-shadow hover:shadow-lg"
  style={{
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8px)'
  }}
>
  <CardContent />
</Surface>

// Native surface with material design
<Surface
  elevation={4}
  variant="material"
  platform="native"
  backgroundColor="rgba(255, 255, 255, 0.95)"
  borderRadius={12}
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }}
>
  <NativeContent />
</Surface>

// Responsive surface
<Surface
  elevation={{ mobile: 1, tablet: 2, desktop: 3 }}
  padding={{ mobile: "md", desktop: "xl" }}
  borderRadius={{ mobile: "md", desktop: "lg" }}
  variant="adaptive"
>
  <ResponsiveContent />
</Surface>
```

### **Divider**

Universal separator with SSR support and responsive design.

```tsx
import { Divider } from '@resk/nativewind';

// Basic divider
<Divider
  platform={Platform.OS}
  ssrOptimized={true}
/>

// Labeled divider
<Divider 
  label="OR" 
  position="center"
  platform={Platform.OS}
  labelStyle={{ 
    backgroundColor: Platform.OS === 'web' ? 'white' : 'transparent',
    paddingHorizontal: 16
  }}
/>

// Vertical divider for layouts
<Stack direction="horizontal" align="center">
  <Text>Left content</Text>
  <Divider 
    orientation="vertical" 
    height={40}
    platform={Platform.OS}
  />
  <Text>Right content</Text>
</Stack>

// Responsive divider
<Divider
  thickness={{ mobile: 1, desktop: 2 }}
  color={{ light: "gray-200", dark: "gray-700" }}
  margin={{ mobile: "sm", desktop: "md" }}
  platform={Platform.OS}
/>
```

### **KeyboardAvoidingView**

Universal keyboard handling with platform-specific optimizations.

```tsx
import { KeyboardAvoidingView } from '@resk/nativewind';

// Platform-adaptive keyboard avoidance
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
  platform={Platform.OS}
  enabled={Platform.OS !== 'web'}
>
  <ScrollView>
    <ChatMessages />
    <MessageInput />
  </ScrollView>
</KeyboardAvoidingView>

// Web-specific keyboard handling
<KeyboardAvoidingView
  platform="web"
  behavior="css-transform"
  enabled={true}
  style={{
    // CSS custom properties for web keyboard handling
    '--keyboard-height': 'env(keyboard-inset-height, 0px)'
  }}
>
  <WebChatInterface />
</KeyboardAvoidingView>

// Universal chat interface
<KeyboardAvoidingView
  behavior={Platform.select({
    ios: 'padding',
    android: 'height',
    web: 'position'
  })}
  keyboardVerticalOffset={Platform.select({
    ios: 88,
    android: 0,
    web: 0
  })}
  contentContainerStyle={{
    flex: 1,
    ...(Platform.OS === 'web' && {
      paddingBottom: 'var(--keyboard-height, 0px)'
    })
  }}
>
  <UniversalChatInterface />
</KeyboardAvoidingView>
```

---

## 🔄 Modal & Overlays

### **Modal**

Universal modal system with SSR support and platform-adaptive presentation.

```tsx
import { Modal } from '@resk/nativewind';

// Next.js SSR-safe modal
<Modal
  visible={isVisible}
  onRequestClose={() => setIsVisible(false)}
  platform="web"
  ssrOptimized={true}
  portal={true}
  animationType="fade"
  preventScroll={true}
>
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      <ModalContent />
    </div>
  </div>
</Modal>

// React Native modal
<Modal
  visible={isVisible}
  onRequestClose={() => setIsVisible(false)}
  platform="native"
  animationType="slide"
  presentationStyle="pageSheet"
  statusBarTranslucent={true}
>
  <SafeAreaView style={{ flex: 1 }}>
    <AppBar
      title="Modal Title"
      leftAction={{
        icon: "close",
        onPress: () => setIsVisible(false)
      }}
    />
    <NativeModalContent />
  </SafeAreaView>
</Modal>

// Universal responsive modal
<Modal
  visible={isVisible}
  onRequestClose={() => setIsVisible(false)}
  platform={Platform.OS}
  responsive={{
    mobile: {
      animationType: "slide",
      presentationStyle: "pageSheet"
    },
    desktop: {
      animationType: "fade",
      presentationStyle: "dialog"
    }
  }}
  backdrop={{
    opacity: 0.5,
    dismissOnPress: true
  }}
>
  <ResponsiveModalContent />
</Modal>
```

### **BottomSheet**

Universal bottom sheet with SSR support and cross-platform animations.

```tsx
import { BottomSheet } from '@resk/nativewind';

// Native bottom sheet
<BottomSheet
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  platform="native"
  snapPoints={['25%', '50%', '90%']}
  enablePanDownToClose={true}
  backgroundStyle={{
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }}
>
  <NativeBottomSheetContent />
</BottomSheet>

// Web bottom sheet (mobile-first)
<BottomSheet
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  platform="web"
  ssrOptimized={true}
  animationType="slide-up"
  maxHeight="90vh"
  className="sm:max-w-md sm:mx-auto sm:rounded-t-xl"
>
  <WebBottomSheetContent />
</BottomSheet>

// Universal responsive bottom sheet
<BottomSheet
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  platform={Platform.OS}
  responsive={{
    mobile: {
      snapPoints: ['30%', '60%', '90%'],
      variant: "modal"
    },
    desktop: {
      maxWidth: 480,
      position: "center",
      variant: "dialog"
    }
  }}
  header={{
    title: "Share Options",
    showCloseButton: true,
    draggable: Platform.OS !== 'web'
  }}
>
  <UniversalContent />
</BottomSheet>
```

### **Dialog**

Universal dialog system with platform-native presentation and SSR support.

```tsx
import { Dialog } from '@resk/nativewind';

// Web dialog with SSR
<Dialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  platform="web"
  ssrOptimized={true}
  title="Confirm Action"
  message="Are you sure you want to proceed with this action?"
  actions={[
    {
      label: "Cancel",
      variant: "outline",
      onPress: () => setShowDialog(false)
    },
    {
      label: "Confirm",
      variant: "primary",
      onPress: handleConfirm
    }
  ]}
  modal={true}
  backdrop={true}
/>

// Native alert dialog
<Dialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  platform="native"
  title="Delete Item"
  message="This action cannot be undone. Are you sure you want to delete this item?"
  actions={[
    {
      label: "Cancel",
      style: "cancel"
    },
    {
      label: "Delete",
      style: "destructive",
      onPress: handleDelete
    }
  ]}
/>

// Custom dialog content
<Dialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  platform={Platform.OS}
  title="Custom Dialog"
  variant="custom"
  maxWidth={400}
>
  <View className="p-4">
    <TextInput
      label="Enter your name"
      value={name}
      onChangeText={setName}
      className="mb-4"
    />
    
    <Stack direction="horizontal" spacing="md" justify="end">
      <Button variant="outline" onPress={() => setShowDialog(false)}>
        Cancel
      </Button>
      <Button variant="primary" onPress={handleSave}>
        Save
      </Button>
    </Stack>
  </View>
</Dialog>
```

---

## 🎯 Specialized Components

### **CountrySelector**

Universal country selection with SSR-safe flag loading and search capabilities.

```tsx
import { CountrySelector } from '@resk/nativewind';

// SSR-optimized country selector
<CountrySelector
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  placeholder="Select your country"
  platform={Platform.OS}
  ssrOptimized={true}
  showFlag={true}
  showCallingCode={true}
  searchable={true}
  flagsApiUrl="https://flagcdn.com"
  preloadFlags={['US', 'CA', 'GB', 'FR', 'DE']}
/>

// Compact mobile selector
<CountrySelector
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  variant="compact"
  platform="native"
  showOnlyFlag={true}
  flagSize={24}
  responsive={{
    mobile: { variant: "bottom-sheet" },
    desktop: { variant: "dropdown" }
  }}
/>

// Phone number country selector
<Stack direction="horizontal" spacing="sm">
  <CountrySelector
    value={phoneCountry}
    onValueChange={setPhoneCountry}
    variant="calling-code"
    showCallingCode={true}
    showFlag={true}
    compact={true}
    width={120}
  />
  <TextInput
    label="Phone Number"
    value={phoneNumber}
    onChangeText={setPhoneNumber}
    keyboardType="phone-pad"
    placeholder="Enter phone number"
    flex={1}
  />
</Stack>

// Universal responsive selector
<CountrySelector
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  platform={Platform.OS}
  responsive={{
    mobile: {
      variant: "modal",
      searchable: true,
      showFlags: true
    },
    tablet: {
      variant: "dropdown",
      columns: 2
    },
    desktop: {
      variant: "combobox",
      maxHeight: 300
    }
  }}
  regions={['Europe', 'North America', 'Asia']}
  popular={['US', 'CA', 'GB', 'AU', 'DE']}
/>
```

### **Backdrop**

Universal backdrop overlay with SSR support and platform-adaptive styling.

```tsx
import { Backdrop } from '@resk/nativewind';

// Basic backdrop
<Backdrop
  visible={showBackdrop}
  onPress={() => setShowBackdrop(false)}
  platform={Platform.OS}
  opacity={0.5}
  color="rgba(0,0,0,0.5)"
  ssrOptimized={true}
/>

// Animated backdrop
<Backdrop
  visible={showBackdrop}
  onPress={() => setShowBackdrop(false)}
  platform={Platform.OS}
  animationType="fade"
  duration={300}
  backgroundColor={Platform.select({
    web: 'rgba(0,0,0,0.6)',
    default: 'rgba(0,0,0,0.5)'
  })}
/>

// Blur backdrop (web)
<Backdrop
  visible={showBackdrop}
  onPress={() => setShowBackdrop(false)}
  platform="web"
  blur={8}
  className="backdrop-blur-sm"
  style={{
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255,255,255,0.1)'
  }}
/>

// Loading backdrop
<Backdrop
  visible={isLoading}
  platform={Platform.OS}
  interactive={false}
  opacity={0.8}
>
  <View className="flex items-center justify-center">
    <ActivityIndicator size="large" color="white" />
    <Text className="text-white mt-4">Loading...</Text>
  </View>
</Backdrop>
```

### **Drawer**

Universal slide-out navigation with SSR support and responsive behavior.

```tsx
import { Drawer } from '@resk/nativewind';

// Mobile drawer navigation
<Drawer
  visible={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  position="left"
  width="80%"
  platform="native"
  overlay={true}
  swipeToClose={true}
  swipeToOpen={false}
  gestureHandlerProps={{
    enabledOnPlatform: ['ios', 'android']
  }}
>
  <SafeAreaView style={{ flex: 1 }}>
    <DrawerHeader user={currentUser} />
    <Nav
      items={navigationItems}
      variant="drawer"
      onItemPress={(item) => {
        navigate(item.route);
        setIsDrawerOpen(false);
      }}
    />
  </SafeAreaView>
</Drawer>

// Desktop sidebar (persistent)
<Drawer
  visible={true}
  position="left"
  width={280}
  platform="web"
  persistent={true}
  collapsible={true}
  collapsed={isSidebarCollapsed}
  onToggleCollapse={setIsSidebarCollapsed}
  ssrOptimized={true}
>
  <div className="h-full bg-white border-r border-gray-200">
    <SidebarContent collapsed={isSidebarCollapsed} />
  </div>
</Drawer>

// Responsive drawer
<Drawer
  visible={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  platform={Platform.OS}
  responsive={{
    mobile: {
      position: "left",
      width: "85%",
      overlay: true,
      swipeToClose: true
    },
    tablet: {
      position: "left",
      width: 320,
      overlay: false,
      persistent: true
    },
    desktop: {
      position: "left",
      width: 280,
      persistent: true,
      collapsible: true
    }
  }}
>
  <ResponsiveDrawerContent />
</Drawer>
```

### **Expandable**

Universal collapsible content with SSR support and smooth animations.

```tsx
import { Expandable } from '@resk/nativewind';

// Basic expandable section
<Expandable
  title="Frequently Asked Questions"
  expanded={isExpanded}
  onToggle={setIsExpanded}
  platform={Platform.OS}
  animationType="height"
  duration={300}
  ssrOptimized={true}
>
  <Text className="p-4 text-gray-600">
    Here are the answers to commonly asked questions about our service.
  </Text>
</Expandable>

// Accordion group
<Expandable.Group
  type="accordion"
  allowMultiple={false}
  platform={Platform.OS}
>
  <Expandable
    title="What is your refund policy?"
    icon="help-circle"
  >
    <Text>We offer a 30-day money-back guarantee...</Text>
  </Expandable>
  
  <Expandable
    title="How do I contact support?"
    icon="help-circle"
  >
    <Text>You can reach our support team via email...</Text>
  </Expandable>
  
  <Expandable
    title="What payment methods do you accept?"
    icon="help-circle"
  >
    <Text>We accept all major credit cards...</Text>
  </Expandable>
</Expandable.Group>

// Custom expandable header
<Expandable
  header={({ expanded, onToggle, title }) => (
    <TouchableOpacity
      onPress={onToggle}
      className="flex-row items-center justify-between p-4 bg-gray-50"
    >
      <View className="flex-row items-center">
        <Icon name="folder" className="mr-3" />
        <Text className="font-medium">{title}</Text>
      </View>
      <Icon
        name={expanded ? "chevron-up" : "chevron-down"}
        className="text-gray-400"
      />
    </TouchableOpacity>
  )}
  title="Custom Header"
  platform={Platform.OS}
>
  <View className="p-4">
    <Text>Custom expandable content with rich formatting.</Text>
  </View>
</Expandable>

// Tree view expandable
<Expandable
  title="Project Files"
  variant="tree"
  level={0}
  platform={Platform.OS}
>
  <Expandable
    title="src"
    variant="tree"
    level={1}
  >
    <Expandable title="components" variant="tree" level={2}>
      <Text className="pl-8">Button.tsx</Text>
      <Text className="pl-8">Input.tsx</Text>
    </Expandable>
    <Text className="pl-6">index.ts</Text>
  </Expandable>
</Expandable>
```

---

## 🔧 Utility & Helper Components

### **Tooltip**

Universal contextual help with SSR support and platform-adaptive positioning.

```tsx
import { Tooltip } from '@resk/nativewind';

// Basic tooltip
<Tooltip
  content="This button saves your changes"
  placement="top"
  platform={Platform.OS}
  ssrOptimized={true}
  trigger="hover"
  delay={500}
>
  <Button icon="save">Save</Button>
</Tooltip>

// Rich content tooltip
<Tooltip
  content={
    <View className="p-2">
      <Text className="font-semibold text-white">Pro Tip</Text>
      <Text className="text-gray-200 mt-1">
        Use Cmd+S to save quickly
      </Text>
    </View>
  }
  placement="bottom"
  maxWidth={200}
  platform={Platform.OS}
  variant="rich"
>
  <Icon.Button name="help-circle" variant="ghost" />
</Tooltip>

// Mobile long-press tooltip
<Tooltip
  content="Long press for more options"
  platform="native"
  trigger="longPress"
  hapticFeedback="impactLight"
  placement="top"
>
  <Avatar source={{ uri: user.avatar }} size="lg" />
</Tooltip>

// Form field tooltip
<View className="flex-row items-center">
  <TextInput
    label="API Key"
    value={apiKey}
    onChangeText={setApiKey}
    secureTextEntry={true}
    className="flex-1"
  />
  <Tooltip
    content="Your API key is used to authenticate requests to our service"
    placement="left"
    maxWidth={250}
  >
    <Icon name="info" className="ml-2 text-gray-400" />
  </Tooltip>
</View>
```

### **HelperText**

Universal form helper text with validation states and SSR support.

```tsx
import { HelperText } from '@resk/nativewind';

// Basic helper text
<HelperText
  type="info"
  platform={Platform.OS}
  ssrOptimized={true}
>
  Password must be at least 8 characters long
</HelperText>

// Error state
<HelperText
  type="error"
  icon="alert-circle"
  visible={hasError}
  animateIn={true}
>
  {errorMessage}
</HelperText>

// Success state
<HelperText
  type="success"
  icon="check-circle"
  visible={isValid}
>
  Email address is available
</HelperText>

// Form field integration
<FormField>
  <TextInput
    label="Username"
    value={username}
    onChangeText={setUsername}
    error={usernameError}
  />
  <HelperText
    type={usernameError ? "error" : "info"}
    icon={usernameError ? "x-circle" : "info"}
    visible={true}
  >
    {usernameError || "Choose a unique username (3-20 characters)"}
  </HelperText>
</FormField>

// Multi-line helper text
<HelperText
  type="warning"
  icon="alert-triangle"
  multiline={true}
  maxLines={3}
>
  This action will permanently delete your account and all associated data. 
  This cannot be undone. Please make sure you have backed up any important information.
</HelperText>
```

### **KeyboardEventHandler**

Universal keyboard event handling with SSR safety and cross-platform support.

```tsx
import { KeyboardEventHandler } from '@resk/nativewind';

// Basic keyboard handling
<KeyboardEventHandler
  onKeyboardShow={(event) => {
    console.log('Keyboard height:', event.endCoordinates.height);
    adjustLayout(event.endCoordinates.height);
  }}
  onKeyboardHide={() => {
    console.log('Keyboard hidden');
    resetLayout();
  }}
  platform={Platform.OS}
  enabled={Platform.OS !== 'web'}
>
  <ChatInterface />
</KeyboardEventHandler>

// Web keyboard handling
<KeyboardEventHandler
  platform="web"
  onVirtualKeyboardShow={(height) => {
    document.documentElement.style.setProperty('--keyboard-height', `${height}px`);
  }}
  onVirtualKeyboardHide={() => {
    document.documentElement.style.setProperty('--keyboard-height', '0px');
  }}
  detectVirtualKeyboard={true}
>
  <WebChatInterface />
</KeyboardEventHandler>

// Render prop pattern
<KeyboardEventHandler
  platform={Platform.OS}
  ssrSafe={true}
>
  {({ keyboardShown, keyboardHeight, keyboardAnimating }) => (
    <View
      style={{
        flex: 1,
        paddingBottom: keyboardShown ? keyboardHeight : 0,
        opacity: keyboardAnimating ? 0.8 : 1
      }}
    >
      <MessageList />
      <MessageInput
        style={{
          transform: Platform.select({
            ios: [{ translateY: keyboardShown ? -keyboardHeight : 0 }],
            default: []
          })
        }}
      />
    </View>
  )}
</KeyboardEventHandler>

// Advanced keyboard handling with animation
<KeyboardEventHandler
  onKeyboardShow={(event) => {
    Animated.timing(bottomPadding, {
      toValue: event.endCoordinates.height,
      duration: event.duration,
      easing: event.easing,
      useNativeDriver: false
    }).start();
  }}
  onKeyboardHide={(event) => {
    Animated.timing(bottomPadding, {
      toValue: 0,
      duration: event.duration,
      easing: event.easing,
      useNativeDriver: false
    }).start();
  }}
  platform="native"
>
  <Animated.View style={{ paddingBottom: bottomPadding }}>
    <FormInterface />
  </Animated.View>
</KeyboardEventHandler>
```

### **Slot**

Universal content slot system with SSR support and conditional rendering.

```tsx
import { Slot } from '@resk/nativewind';

// Basic slot usage
<Slot
  name="header"
  platform={Platform.OS}
  ssrOptimized={true}
>
  <AppBar title="Dashboard" />
</Slot>

// Conditional slot with fallback
<Slot
  name="sidebar"
  fallback={<DefaultSidebar />}
  condition={showSidebar}
  platform={Platform.OS}
>
  <CustomSidebar />
</Slot>

// Render prop slot
<Slot name="content">
  {({ isVisible, toggle, platform }) => (
    <View>
      {isVisible && <MainContent />}
      <Button onPress={toggle}>
        {isVisible ? 'Hide' : 'Show'} Content
      </Button>
    </View>
  )}
</Slot>

// Portal slot
<Slot
  name="modals"
  portal={true}
  destination="modal-root"
  platform={Platform.OS}
>
  <Modal visible={isModalVisible}>
    <ModalContent />
  </Modal>
</Slot>

// Responsive slot
<Slot
  name="navigation"
  responsive={{
    mobile: { component: <MobileNav /> },
    tablet: { component: <TabletNav /> },
    desktop: { component: <DesktopNav /> }
  }}
  platform={Platform.OS}
/>
```

---

## 🌐 Universal Platform Benefits

### **Server-Side Rendering (SSR) Excellence**
- **Hydration-safe components** - Zero layout shifts during client hydration
- **Critical CSS extraction** - Automatic above-the-fold styling optimization
- **Progressive enhancement** - Features activate gracefully after JavaScript loads
- **SEO optimization** - Full content accessibility for search engines and social media

### **Cross-Platform Performance**
- **Native-optimized rendering** - Platform-specific optimizations for iOS and Android
- **Web-optimized bundles** - Tree-shaking and code splitting for minimal bundle sizes
- **Responsive by default** - Automatic adaptation to screen sizes and orientations
- **Hardware acceleration** - 60fps animations across all platforms

### **Developer Experience**
- **Universal API** - Same component interface across all platforms
- **TypeScript-first** - Comprehensive type safety with intelligent autocomplete
- **Hot reload friendly** - Fast development iteration with instant feedback
- **Zero configuration** - Works out of the box with sensible defaults

The @resk/nativewind component library provides the most comprehensive, SSR-optimized, cross-platform UI solution available, enabling developers to build universal applications with confidence and speed across **Next.js**, **React Native**, **Expo**, **Web**, and **Node.js** environments.
