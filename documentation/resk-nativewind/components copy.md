# 🧩 Components - @resk/nativewind

> **Comprehensive UI component library with 50+ production-ready components**

## 📖 Overview

The @resk/nativewind component library provides 50+ carefully crafted UI components designed for modern React Native applications. Each component is built with performance, accessibility, and cross-platform compatibility in mind, offering a consistent design language while maintaining flexibility for customization.

---

## 🎯 Core Features

### **🎨 Consistent Design Language**
- Unified visual style across all components
- Semantic color system with automatic dark mode
- Consistent spacing and typography
- Material Design and iOS Human Interface Guidelines compliance

### **🔧 Type-Safe Props**
- Full TypeScript support with comprehensive type definitions
- IntelliSense autocomplete for all props and variants
- Compile-time validation of component usage
- Clear documentation through types

### **📱 Cross-Platform Optimized**
- Native performance on iOS and Android
- Web-optimized rendering with SSR support
- Consistent behavior across platforms
- Platform-specific styling when needed

### **♿ Accessibility First**
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode compatibility

---

## 🔄 Loading & Feedback Components

### **ActivityIndicator**

Customizable loading spinner with size and color variants.

```tsx
import { ActivityIndicator } from '@resk/nativewind';

// Basic usage
<ActivityIndicator size="large" />
<ActivityIndicator size="small" />

// Custom size and color
<ActivityIndicator 
  size={40}
  color="#007AFF"
  borderWidth={4}
/>

// With variants
<ActivityIndicator variant="primary" />
<ActivityIndicator variant="secondary" />

// Custom styling
<ActivityIndicator 
  size={60}
  className="text-blue-500"
  style={{ borderTopColor: '#007AFF' }}
/>
```

### **Alert**

Versatile alert component for notifications, warnings, and messages.

```tsx
import { Alert } from '@resk/nativewind';

// Basic alerts
<Alert
  type="success"
  title="Success!"
  message="Your changes have been saved."
  dismissible={true}
  onDismiss={() => setAlert(null)}
/>

<Alert
  type="error"
  title="Error"
  message="Something went wrong. Please try again."
/>

<Alert
  type="warning"
  title="Warning"
  message="This action cannot be undone."
/>

<Alert
  type="info"
  title="Information"
  message="New features are now available."
/>

// Custom content alert
<Alert type="error">
  <Text>Custom error content with detailed information.</Text>
</Alert>

// Alert with actions
<Alert
  type="warning"
  title="Confirm Delete"
  message="Are you sure you want to delete this item?"
  actions={[
    { 
      label: "Cancel", 
      variant: "outline",
      onPress: () => setShowAlert(false)
    },
    { 
      label: "Delete", 
      variant: "error",
      onPress: handleDelete
    }
  ]}
/>

// Closeable alert
<Alert
  type="success"
  message="Operation completed successfully"
  closeable={true}
  onClose={() => hideAlert()}
/>
```

### **ProgressBar**

Linear progress indicator with customization options.

```tsx
import { ProgressBar } from '@resk/nativewind';

// Basic progress bar
<ProgressBar 
  progress={0.7}             // 0 to 1
  variant="primary"
  showLabel={true}
  animated={true}
/>

// Indeterminate progress
<ProgressBar indeterminate={true} />

// Custom styling
<ProgressBar
  progress={uploadProgress}
  height={8}
  borderRadius={4}
  backgroundColor="gray-200"
  progressColor="blue-500"
/>

// With percentage label
<ProgressBar
  progress={downloadProgress}
  showPercentage={true}
  label="Downloading..."
/>
```

---

## 🧭 Navigation & Layout Components

### **AppBar**

Top navigation header with title, actions, and back button.

```tsx
import { AppBar } from '@resk/nativewind';

// Basic AppBar
<AppBar
  title="Page Title"
  onBackActionPress={() => navigation.goBack()}
/>

// With subtitle
<AppBar
  title="John Doe"
  subtitle="Online now"
  onBackActionPress={() => navigation.goBack()}
/>

// With actions
<AppBar
  title="Messages"
  actions={[
    { 
      icon: "search", 
      onPress: () => openSearch(),
      accessibilityLabel: "Search messages"
    },
    { 
      icon: "more-vertical", 
      onPress: () => showMenu(),
      accessibilityLabel: "More options"
    }
  ]}
  maxVisibleActions={2}
/>

// Custom left and right content
<AppBar
  left={<CustomBackButton />}
  title="Custom Header"
  right={<CustomActions />}
/>

// Different variants
<AppBar
  variant="primary"
  title="Primary AppBar"
/>

<AppBar
  variant="transparent"
  title="Transparent AppBar"
/>
```

### **Nav**

Navigation component for menu items and actions.

```tsx
import { Nav } from '@resk/nativewind';

// Basic navigation
<Nav
  items={[
    {
      label: "Home",
      icon: "home",
      onPress: () => navigate('home'),
      active: currentRoute === 'home'
    },
    {
      label: "Profile",
      icon: "user",
      onPress: () => navigate('profile'),
      badge: { count: 3 }
    },
    {
      label: "Settings",
      icon: "settings",
      onPress: () => navigate('settings')
    }
  ]}
/>

// Horizontal navigation
<Nav
  orientation="horizontal"
  items={navigationItems}
  variant="pills"
/>

// With sections
<Nav>
  <Nav.Section title="Main">
    <Nav.Item label="Dashboard" icon="dashboard" />
    <Nav.Item label="Analytics" icon="chart" />
  </Nav.Section>
  
  <Nav.Section title="Settings">
    <Nav.Item label="Account" icon="user" />
    <Nav.Item label="Preferences" icon="settings" />
  </Nav.Section>
</Nav>
```

### **Stack**

Layout component for stacking elements with consistent spacing.

```tsx
import { Stack } from '@resk/nativewind';

// Vertical stack
<Stack spacing="md" direction="vertical">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Stack>

// Horizontal stack
<Stack spacing="sm" direction="horizontal" align="center">
  <Icon name="user" />
  <Text>John Doe</Text>
  <Badge count={5} />
</Stack>

// Responsive stack
<Stack 
  spacing={{ base: "sm", md: "lg" }}
  direction={{ base: "vertical", md: "horizontal" }}
>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
  <Button>Action 3</Button>
</Stack>

// With dividers
<Stack spacing="md" dividers={true}>
  <ListItem title="Item 1" />
  <ListItem title="Item 2" />
  <ListItem title="Item 3" />
</Stack>
```

---

## 🎭 Display & Media Components

### **Avatar**

User avatar with fallback options and status indicators.

```tsx
import { Avatar } from '@resk/nativewind';

// Basic avatar
<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="lg"
  fallback="JD"              // Initials fallback
/>

// Different sizes
<Avatar source={{ uri: 'avatar.jpg' }} size="xs" />
<Avatar source={{ uri: 'avatar.jpg' }} size="sm" />
<Avatar source={{ uri: 'avatar.jpg' }} size="md" />
<Avatar source={{ uri: 'avatar.jpg' }} size="lg" />
<Avatar source={{ uri: 'avatar.jpg' }} size="xl" />

// With status indicator
<Avatar
  source={{ uri: 'avatar.jpg' }}
  status="online"            // online, offline, away, busy
  size="md"
/>

// Avatar group
<Avatar.Group max={3} spacing="overlap">
  <Avatar source={{ uri: 'user1.jpg' }} />
  <Avatar source={{ uri: 'user2.jpg' }} />
  <Avatar source={{ uri: 'user3.jpg' }} />
  <Avatar source={{ uri: 'user4.jpg' }} />
</Avatar.Group>

// Custom fallback
<Avatar
  source={{ uri: 'broken-url.jpg' }}
  fallback={<Icon name="user" size={24} />}
  backgroundColor="gray-200"
/>
```

### **Badge**

Small status indicators and counters.

```tsx
import { Badge } from '@resk/nativewind';

// Count badge
<Badge count={5} />
<Badge count={99} max={99} />

// Dot badge
<Badge dot={true} />

// With content
<View className="relative">
  <Icon name="bell" size={24} />
  <Badge 
    count={notifications.length}
    variant="error"
    position="top-right"
  />
</View>

// Status badges
<Badge variant="success" text="Active" />
<Badge variant="warning" text="Pending" />
<Badge variant="error" text="Inactive" />
<Badge variant="info" text="New" />

// Custom colors
<Badge 
  count={42}
  backgroundColor="#FF6B35"
  textColor="white"
/>

// Large badges
<Badge
  text="Premium User"
  variant="primary"
  size="lg"
/>
```

### **Icon**

Comprehensive icon system with multiple icon families.

```tsx
import { Icon } from '@resk/nativewind';

// Basic icon usage
<Icon name="heart" size={24} color="#FF6B35" />

// Font icons
<Icon.Font name="MaterialIcons:home" size={32} />
<Icon.Font name="Feather:user" size={24} color="blue" />

// Icon button
<Icon.Button
  name="plus"
  onPress={() => addItem()}
  size={24}
  variant="primary"
  accessibilityLabel="Add new item"
/>

// Country flag icons
<Icon.CountryFlag 
  country="US" 
  size={32}
  style="rounded"
/>

// Custom icon source
<Icon
  source={{ uri: 'https://example.com/custom-icon.png' }}
  size={24}
/>

// Icon with different variants
<Icon name="star" variant="filled" />
<Icon name="star" variant="outline" />
```

---

## 📱 Input & Form Components

### **TextInput**

Enhanced text input with validation and helper text.

```tsx
import { TextInput } from '@resk/nativewind';

// Basic text input
<TextInput
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>

// With validation
<TextInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  error={passwordError}
  helperText="Must be at least 8 characters"
  required={true}
/>

// With icons
<TextInput
  label="Search"
  leftIcon="search"
  rightIcon="filter"
  onRightIconPress={() => showFilters()}
  clearable={true}
/>

// Multiline
<TextInput
  label="Description"
  multiline={true}
  numberOfLines={4}
  maxLength={500}
  showCharacterCount={true}
/>

// Different variants
<TextInput variant="outlined" label="Outlined Input" />
<TextInput variant="filled" label="Filled Input" />
<TextInput variant="underlined" label="Underlined Input" />
```

### **Checkbox**

Multi-select checkbox control with group support.

```tsx
import { Checkbox } from '@resk/nativewind';

// Basic checkbox
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
  label="I agree to the terms"
/>

// Indeterminate state
<Checkbox
  checked={checkedItems.length === allItems.length}
  indeterminate={checkedItems.length > 0 && checkedItems.length < allItems.length}
  onCheckedChange={toggleAll}
  label="Select all"
/>

// Checkbox group
<Checkbox.Group
  value={selectedItems}
  onValueChange={setSelectedItems}
  label="Select your interests"
>
  <Checkbox value="sports" label="Sports" />
  <Checkbox value="music" label="Music" />
  <Checkbox value="technology" label="Technology" />
</Checkbox.Group>

// Custom styling
<Checkbox
  checked={isChecked}
  onCheckedChange={setIsChecked}
  label="Custom checkbox"
  size="lg"
  color="purple"
/>
```

### **Switch**

Toggle switch control for binary options.

```tsx
import { Switch } from '@resk/nativewind';

// Basic switch
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  size="md"
  variant="primary"
/>

// With label
<View className="flex-row items-center justify-between">
  <Text>Enable notifications</Text>
  <Switch
    value={notificationsEnabled}
    onValueChange={setNotificationsEnabled}
  />
</View>

// Different sizes
<Switch value={true} size="sm" />
<Switch value={true} size="md" />
<Switch value={true} size="lg" />

// Custom colors
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{ false: "#767577", true: "#81b0ff" }}
  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
/>
```

---

## 🔧 Interactive Components

### **Button**

Primary action button with multiple variants and states.

```tsx
import { Button } from '@resk/nativewind';

// Basic usage
<Button onPress={() => console.log('Pressed')}>
  Press me
</Button>

// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outlined Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// States
<Button loading={true}>Loading...</Button>
<Button disabled={true}>Disabled</Button>

// With icons
<Button icon="plus" iconPosition="left">Add Item</Button>
<Button icon="arrow-right" iconPosition="right">Continue</Button>
<Button icon="heart" iconOnly />

// Custom styling
<Button 
  className="bg-gradient-to-r from-purple-500 to-pink-500"
  textClassName="text-white font-bold"
>
  Gradient Button
</Button>
```

### **Menu**

Dropdown menu component for actions and navigation.

```tsx
import { Menu } from '@resk/nativewind';

// Basic menu
<Menu
  trigger={<Button>Open Menu</Button>}
  items={[
    { label: "Edit", icon: "edit", onPress: () => edit() },
    { label: "Delete", icon: "trash", onPress: () => delete() },
    { label: "Share", icon: "share", onPress: () => share() }
  ]}
/>

// Menu with sections
<Menu
  trigger={<IconButton icon="more-vertical" />}
  placement="bottom-end"
>
  <Menu.Section title="Actions">
    <Menu.Item label="Edit" icon="edit" onPress={handleEdit} />
    <Menu.Item label="Duplicate" icon="copy" onPress={handleDuplicate} />
  </Menu.Section>
  
  <Menu.Divider />
  
  <Menu.Section title="Danger Zone">
    <Menu.Item 
      label="Delete" 
      icon="trash" 
      variant="danger"
      onPress={handleDelete} 
    />
  </Menu.Section>
</Menu>

// Context menu
<Menu
  trigger="contextMenu"
  target={<Image source={{ uri: 'image.jpg' }} />}
>
  <Menu.Item label="Save Image" />
  <Menu.Item label="Copy Link" />
  <Menu.Item label="Report" />
</Menu>
```

### **Dropdown**

Dropdown selection component.

```tsx
import { Dropdown } from '@resk/nativewind';

// Basic dropdown
<Dropdown
  label="Select Country"
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  options={[
    { label: "United States", value: "US" },
    { label: "Canada", value: "CA" },
    { label: "United Kingdom", value: "UK" }
  ]}
/>

// Searchable dropdown
<Dropdown
  label="Select City"
  value={selectedCity}
  onValueChange={setSelectedCity}
  options={cityOptions}
  searchable={true}
  placeholder="Search cities..."
/>

// Multi-select dropdown
<Dropdown
  label="Select Tags"
  value={selectedTags}
  onValueChange={setSelectedTags}
  options={tagOptions}
  multiple={true}
  placeholder="Choose tags..."
/>
```

---

## 🏗️ Layout & Structure Components

### **Surface**

Elevated surface container with shadow and border radius.

```tsx
import { Surface } from '@resk/nativewind';

<Surface
  elevation={2}              // Shadow elevation (0-5)
  variant="elevated"         // Surface variant
  padding="lg"               // Internal padding
  borderRadius="lg"          // Border radius
>
  <CardContent />
</Surface>

// Different surface types
<Surface variant="outlined">Outlined Surface</Surface>
<Surface variant="filled">Filled Surface</Surface>
<Surface variant="elevated">Elevated Surface</Surface>

// Custom styling
<Surface
  elevation={3}
  className="bg-gradient-to-br from-blue-500 to-purple-600"
  style={{ borderRadius: 16 }}
>
  <Text className="text-white">Gradient Surface</Text>
</Surface>
```

### **Divider**

Visual separator for content sections.

```tsx
import { Divider } from '@resk/nativewind';

// Horizontal divider
<Divider />

// Vertical divider
<Divider 
  orientation="vertical"
  className="h-full"
/>

// With label
<Divider label="OR" />
<Divider label="Section Break" position="center" />

// Custom styling
<Divider 
  thickness={2}
  color="gray-300"
  className="my-4"
/>

// Inset dividers
<Divider inset="left" />
<Divider inset="right" />
<Divider inset="both" />
```

### **Slot**

Flexible content placeholder component.

```tsx
import { Slot } from '@resk/nativewind';

// Basic slot usage
<Slot name="header">
  <Text>Header Content</Text>
</Slot>

// Conditional slot rendering
<Slot 
  name="sidebar" 
  fallback={<DefaultSidebar />}
  condition={showSidebar}
>
  <CustomSidebar />
</Slot>

// Slot with render props
<Slot name="content">
  {({ isVisible, toggle }) => (
    <View>
      {isVisible && <Content />}
      <Button onPress={toggle}>Toggle</Button>
    </View>
  )}
</Slot>
```

---

## 🔄 Modal & Overlay Components

### **Modal**

Full-screen modal dialog with animation support.

```tsx
import { Modal } from '@resk/nativewind';

// Basic modal
<Modal
  visible={isVisible}
  onRequestClose={() => setIsVisible(false)}
  animationType="slide"
  presentationStyle="pageSheet"
>
  <View className="flex-1 p-4">
    <AppBar
      title="Modal Title"
      leftAction={{
        icon: "close",
        onPress: () => setIsVisible(false)
      }}
    />
    <ModalContent />
  </View>
</Modal>

// Centered modal
<Modal
  visible={isVisible}
  transparent={true}
  animationType="fade"
>
  <View className="flex-1 justify-center items-center bg-black/50">
    <Surface className="p-6 m-4 max-w-sm">
      <Text className="text-lg font-semibold mb-4">Confirm Action</Text>
      <Text className="text-gray-600 mb-6">Are you sure?</Text>
      <Stack direction="horizontal" spacing="md">
        <Button variant="outline" onPress={onCancel}>Cancel</Button>
        <Button variant="primary" onPress={onConfirm}>Confirm</Button>
      </Stack>
    </Surface>
  </View>
</Modal>

// Full screen modal
<Modal
  visible={isVisible}
  animationType="slide"
  presentationStyle="fullScreen"
>
  <FullScreenContent />
</Modal>
```

### **BottomSheet**

Modal bottom sheet component with snap points.

```tsx
import { BottomSheet } from '@resk/nativewind';

// Basic bottom sheet
<BottomSheet
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  snapPoints={['25%', '50%', '90%']}
  enablePanDownToClose={true}
  backdrop={true}
>
  <View className="p-4">
    <Text className="text-lg font-semibold mb-4">Bottom Sheet Content</Text>
    <YourContent />
  </View>
</BottomSheet>

// With header
<BottomSheet
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  header={{
    title: "Share Options",
    showCloseButton: true,
    draggable: true
  }}
>
  <ShareOptions />
</BottomSheet>

// Scrollable bottom sheet
<BottomSheet
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  scrollable={true}
  maxHeight="90%"
>
  <ScrollView>
    <LongContent />
  </ScrollView>
</BottomSheet>
```

### **Dialog**

Alert dialog for confirmations and user input.

```tsx
import { Dialog } from '@resk/nativewind';

// Confirmation dialog
<Dialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  title="Confirm Delete"
  message="Are you sure you want to delete this item? This action cannot be undone."
  actions={[
    {
      label: "Cancel",
      onPress: () => setShowDialog(false)
    },
    {
      label: "Delete",
      variant: "error",
      onPress: handleDelete
    }
  ]}
/>

// Custom dialog content
<Dialog
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  title="Custom Dialog"
>
  <TextInput
    label="Enter your name"
    value={name}
    onChangeText={setName}
  />
  
  <Stack direction="horizontal" spacing="md" className="mt-4">
    <Button variant="outline" onPress={() => setShowDialog(false)}>
      Cancel
    </Button>
    <Button variant="primary" onPress={handleSave}>
      Save
    </Button>
  </Stack>
</Dialog>
```

---

## 🎯 Specialized Components

### **CountrySelector**

Country selection component with flags and search.

```tsx
import { CountrySelector } from '@resk/nativewind';

// Basic country selector
<CountrySelector
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  placeholder="Select a country"
/>

// With custom styling
<CountrySelector
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  showFlag={true}
  showCallingCode={true}
  searchable={true}
  placeholder="Choose your country"
/>

// Compact mode
<CountrySelector
  value={selectedCountry}
  onValueChange={setSelectedCountry}
  compact={true}
  showOnlyFlag={true}
/>
```

### **Backdrop**

Background overlay for modals and overlays.

```tsx
import { Backdrop } from '@resk/nativewind';

// Basic backdrop
<Backdrop
  visible={showBackdrop}
  onPress={() => setShowBackdrop(false)}
  opacity={0.5}
/>

// Custom backdrop
<Backdrop
  visible={showBackdrop}
  onPress={() => setShowBackdrop(false)}
  backgroundColor="rgba(0,0,0,0.7)"
  animationType="fade"
>
  <CustomOverlayContent />
</Backdrop>
```

### **Drawer**

Slide-out drawer navigation component.

```tsx
import { Drawer } from '@resk/nativewind';

// Basic drawer
<Drawer
  visible={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  position="left"
  width="80%"
>
  <DrawerContent />
</Drawer>

// Right drawer
<Drawer
  visible={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  position="right"
  overlay={true}
  swipeToClose={true}
>
  <DrawerContent />
</Drawer>
```

### **Expandable**

Collapsible content container.

```tsx
import { Expandable } from '@resk/nativewind';

// Basic expandable
<Expandable
  title="Click to expand"
  expanded={isExpanded}
  onToggle={setIsExpanded}
>
  <Text>This content can be expanded and collapsed.</Text>
</Expandable>

// With custom header
<Expandable
  header={({ expanded, onToggle }) => (
    <TouchableOpacity onPress={onToggle} className="flex-row items-center p-4">
      <Text className="flex-1">Custom Header</Text>
      <Icon name={expanded ? "chevron-up" : "chevron-down"} />
    </TouchableOpacity>
  )}
  expanded={isExpanded}
  onToggle={setIsExpanded}
>
  <ExpandableContent />
</Expandable>
```

---

## 🔧 Utility Components

### **Portal**

Render content outside of parent component tree.

```tsx
import { Portal } from '@resk/nativewind';

// Basic portal usage
<Portal>
  <OverlayContent />
</Portal>

// Named portal
<Portal name="modals">
  <ModalContent />
</Portal>

// Portal host
<Portal.Host name="modals" />
```

### **Tooltip**

Contextual help and information.

```tsx
import { Tooltip } from '@resk/nativewind';

// Basic tooltip
<Tooltip
  content="This is a helpful tooltip"
  placement="top"
  trigger="press"
>
  <IconButton icon="help" />
</Tooltip>

// Rich content tooltip
<Tooltip
  content={
    <View>
      <Text className="font-semibold">Pro Tip</Text>
      <Text>Long press for more options</Text>
    </View>
  }
  maxWidth={200}
  placement="bottom"
>
  <Button>Hover me</Button>
</Tooltip>
```

### **HelperText**

Supplementary text for forms and components.

```tsx
import { HelperText } from '@resk/nativewind';

// Basic helper text
<HelperText>
  This field is required
</HelperText>

// Error state
<HelperText type="error">
  Please enter a valid email address
</HelperText>

// Info state
<HelperText type="info" icon="info-circle">
  Your password must be at least 8 characters long
</HelperText>

// Success state
<HelperText type="success" icon="check-circle">
  Email address is available
</HelperText>
```

---

## 🎛️ Keyboard & Input Utilities

### **KeyboardAvoidingView**

Automatically adjust layout when keyboard appears.

```tsx
import { KeyboardAvoidingView } from '@resk/nativewind';

// Basic keyboard avoiding view
<KeyboardAvoidingView
  behavior="padding"
  keyboardVerticalOffset={0}
>
  <ScrollView>
    <TextInput label="Message" />
    <Button>Send</Button>
  </ScrollView>
</KeyboardAvoidingView>

// With custom behavior
<KeyboardAvoidingView
  behavior="height"
  enabled={Platform.OS === 'ios'}
>
  <ChatInterface />
</KeyboardAvoidingView>
```

### **KeyboardEventHandler**

Handle keyboard events and state.

```tsx
import { KeyboardEventHandler } from '@resk/nativewind';

// Basic keyboard event handling
<KeyboardEventHandler
  onKeyboardShow={(event) => {
    console.log('Keyboard shown:', event.endCoordinates.height);
  }}
  onKeyboardHide={() => {
    console.log('Keyboard hidden');
  }}
>
  <YourContent />
</KeyboardEventHandler>

// With keyboard state
<KeyboardEventHandler>
  {({ keyboardShown, keyboardHeight }) => (
    <View style={{ paddingBottom: keyboardShown ? keyboardHeight : 0 }}>
      <Content />
    </View>
  )}
</KeyboardEventHandler>
```

---

The @resk/nativewind component library provides a comprehensive foundation for building modern React Native applications with 50+ production-ready components. Each component is designed to work seamlessly together while remaining flexible enough for custom use cases, ensuring consistency, performance, and excellent developer experience across all platforms.
