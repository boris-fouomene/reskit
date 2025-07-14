# 🖥️ Platform Detection - @resk/core/platform

> **Cross-platform environment detection and utilities**

## 📖 Overview

The Platform module provides comprehensive environment detection capabilities, allowing your application to adapt to different runtime environments including web browsers, React Native, Node.js, Electron, and more.

---

## 🎯 Environment Detection

### **Basic Platform Checks**

```typescript
import { Platform } from '@resk/core/platform';

// Environment detection
console.log('Is Web:', Platform.isWeb());           // Browser environment
console.log('Is Mobile:', Platform.isMobile());     // React Native
console.log('Is Node:', Platform.isNode());         // Node.js server
console.log('Is Electron:', Platform.isElectron()); // Electron app
console.log('Is Desktop:', Platform.isDesktop());   // Desktop environment

// Operating system detection
console.log('Is Windows:', Platform.isWindows());
console.log('Is macOS:', Platform.isMacOS());
console.log('Is Linux:', Platform.isLinux());
console.log('Is iOS:', Platform.isIOS());
console.log('Is Android:', Platform.isAndroid());

// Browser detection (web only)
console.log('Is Chrome:', Platform.isChrome());
console.log('Is Firefox:', Platform.isFirefox());
console.log('Is Safari:', Platform.isSafari());
console.log('Is Edge:', Platform.isEdge());
```

### **Environment Information**

```typescript
// Get detailed platform information
const platformInfo = Platform.getPlatformInfo();
console.log('Platform Info:', platformInfo);
/*
Output example:
{
  environment: 'web',
  os: 'windows',
  browser: 'chrome',
  version: '91.0.4472.124',
  isMobile: false,
  isTablet: false,
  userAgent: 'Mozilla/5.0...'
}
*/

// Get specific platform details
console.log('OS:', Platform.getOS());                // 'windows' | 'macos' | 'linux' | 'ios' | 'android'
console.log('Browser:', Platform.getBrowser());      // 'chrome' | 'firefox' | 'safari' | 'edge'
console.log('Environment:', Platform.getEnvironment()); // 'web' | 'mobile' | 'node' | 'electron'
```

---

## 🌐 Web Platform Features

### **Browser Capabilities**

```typescript
class BrowserCapabilities {
  static hasLocalStorage(): boolean {
    return Platform.isWeb() && typeof localStorage !== 'undefined';
  }
  
  static hasSessionStorage(): boolean {
    return Platform.isWeb() && typeof sessionStorage !== 'undefined';
  }
  
  static hasWebWorkers(): boolean {
    return Platform.isWeb() && typeof Worker !== 'undefined';
  }
  
  static hasServiceWorkers(): boolean {
    return Platform.isWeb() && 'serviceWorker' in navigator;
  }
  
  static hasNotifications(): boolean {
    return Platform.isWeb() && 'Notification' in window;
  }
  
  static hasGeolocation(): boolean {
    return Platform.isWeb() && 'geolocation' in navigator;
  }
  
  static hasCamera(): boolean {
    return Platform.isWeb() && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  }
  
  static hasFileAPI(): boolean {
    return Platform.isWeb() && window.File && window.FileReader && window.FileList && window.Blob;
  }
  
  static hasDragAndDrop(): boolean {
    return Platform.isWeb() && 'ondrop' in window;
  }
  
  static hasWebGL(): boolean {
    if (!Platform.isWeb()) return false;
    
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }
}

// Usage
if (BrowserCapabilities.hasLocalStorage()) {
  localStorage.setItem('key', 'value');
}

if (BrowserCapabilities.hasNotifications()) {
  Notification.requestPermission();
}
```

### **Responsive Design Helpers**

```typescript
class ResponsiveHelpers {
  static getViewportSize(): { width: number, height: number } {
    if (!Platform.isWeb()) {
      return { width: 0, height: 0 };
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  
  static isMobileViewport(): boolean {
    const { width } = this.getViewportSize();
    return width < 768;
  }
  
  static isTabletViewport(): boolean {
    const { width } = this.getViewportSize();
    return width >= 768 && width < 1024;
  }
  
  static isDesktopViewport(): boolean {
    const { width } = this.getViewportSize();
    return width >= 1024;
  }
  
  static getDevicePixelRatio(): number {
    if (!Platform.isWeb()) return 1;
    return window.devicePixelRatio || 1;
  }
  
  static supportsTouch(): boolean {
    if (!Platform.isWeb()) return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  static getScreenOrientation(): 'portrait' | 'landscape' {
    if (!Platform.isWeb()) return 'portrait';
    
    const { width, height } = this.getViewportSize();
    return width > height ? 'landscape' : 'portrait';
  }
}

// Reactive viewport monitoring
class ViewportMonitor {
  private listeners: Array<(size: { width: number, height: number }) => void> = [];
  
  constructor() {
    if (Platform.isWeb()) {
      window.addEventListener('resize', this.handleResize.bind(this));
      window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    }
  }
  
  addListener(callback: (size: { width: number, height: number }) => void) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private handleResize() {
    const size = ResponsiveHelpers.getViewportSize();
    this.listeners.forEach(callback => callback(size));
  }
  
  private handleOrientationChange() {
    // Delay to allow orientation change to complete
    setTimeout(() => {
      this.handleResize();
    }, 100);
  }
}
```

---

## 📱 Mobile Platform Features

### **React Native Specific**

```typescript
class MobileCapabilities {
  static hasCamera(): boolean {
    if (!Platform.isMobile()) return false;
    
    // React Native specific checks
    try {
      const { Camera } = require('react-native-camera');
      return !!Camera;
    } catch {
      return false;
    }
  }
  
  static hasPushNotifications(): boolean {
    if (!Platform.isMobile()) return false;
    
    try {
      const PushNotification = require('react-native-push-notification');
      return !!PushNotification;
    } catch {
      return false;
    }
  }
  
  static hasAsyncStorage(): boolean {
    if (!Platform.isMobile()) return false;
    
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      return !!AsyncStorage;
    } catch {
      return false;
    }
  }
  
  static hasNetInfo(): boolean {
    if (!Platform.isMobile()) return false;
    
    try {
      const NetInfo = require('@react-native-netinfo/netinfo');
      return !!NetInfo;
    } catch {
      return false;
    }
  }
  
  static hasStatusBar(): boolean {
    if (!Platform.isMobile()) return false;
    
    try {
      const { StatusBar } = require('react-native');
      return !!StatusBar;
    } catch {
      return false;
    }
  }
}

// Device information for mobile
class MobileDeviceInfo {
  static async getDeviceInfo(): Promise<any> {
    if (!Platform.isMobile()) {
      return null;
    }
    
    try {
      const DeviceInfo = require('react-native-device-info');
      
      return {
        deviceId: await DeviceInfo.getDeviceId(),
        brand: await DeviceInfo.getBrand(),
        model: await DeviceInfo.getModel(),
        systemName: await DeviceInfo.getSystemName(),
        systemVersion: await DeviceInfo.getSystemVersion(),
        bundleId: await DeviceInfo.getBundleId(),
        buildNumber: await DeviceInfo.getBuildNumber(),
        version: await DeviceInfo.getVersion(),
        isTablet: await DeviceInfo.isTablet(),
        hasNotch: await DeviceInfo.hasNotch(),
        hasDynamicIsland: await DeviceInfo.hasDynamicIsland()
      };
    } catch (error) {
      console.warn('Failed to get device info:', error);
      return null;
    }
  }
  
  static async getNetworkInfo(): Promise<any> {
    if (!MobileCapabilities.hasNetInfo()) {
      return null;
    }
    
    try {
      const NetInfo = require('@react-native-netinfo/netinfo');
      return await NetInfo.fetch();
    } catch (error) {
      console.warn('Failed to get network info:', error);
      return null;
    }
  }
}
```

---

## 🖥️ Desktop Platform Features

### **Electron Specific**

```typescript
class ElectronCapabilities {
  static hasIPC(): boolean {
    if (!Platform.isElectron()) return false;
    
    try {
      const { ipcRenderer } = require('electron');
      return !!ipcRenderer;
    } catch {
      return false;
    }
  }
  
  static hasShell(): boolean {
    if (!Platform.isElectron()) return false;
    
    try {
      const { shell } = require('electron');
      return !!shell;
    } catch {
      return false;
    }
  }
  
  static hasRemote(): boolean {
    if (!Platform.isElectron()) return false;
    
    try {
      const { remote } = require('electron');
      return !!remote;
    } catch {
      return false;
    }
  }
  
  static async getAppInfo(): Promise<any> {
    if (!this.hasRemote()) return null;
    
    try {
      const { remote } = require('electron');
      const app = remote.app;
      
      return {
        name: app.getName(),
        version: app.getVersion(),
        path: app.getAppPath(),
        userData: app.getPath('userData'),
        documents: app.getPath('documents'),
        downloads: app.getPath('downloads'),
        desktop: app.getPath('desktop')
      };
    } catch (error) {
      console.warn('Failed to get app info:', error);
      return null;
    }
  }
}

// Window management for Electron
class ElectronWindowManager {
  static openExternal(url: string): void {
    if (!ElectronCapabilities.hasShell()) {
      console.warn('Shell not available');
      return;
    }
    
    const { shell } = require('electron');
    shell.openExternal(url);
  }
  
  static showItemInFolder(path: string): void {
    if (!ElectronCapabilities.hasShell()) {
      console.warn('Shell not available');
      return;
    }
    
    const { shell } = require('electron');
    shell.showItemInFolder(path);
  }
  
  static minimize(): void {
    if (!ElectronCapabilities.hasRemote()) return;
    
    const { remote } = require('electron');
    const window = remote.getCurrentWindow();
    window.minimize();
  }
  
  static maximize(): void {
    if (!ElectronCapabilities.hasRemote()) return;
    
    const { remote } = require('electron');
    const window = remote.getCurrentWindow();
    
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
  
  static close(): void {
    if (!ElectronCapabilities.hasRemote()) return;
    
    const { remote } = require('electron');
    const window = remote.getCurrentWindow();
    window.close();
  }
}
```

---

## 🖥️ Node.js Server Features

### **Server Environment Detection**

```typescript
class ServerCapabilities {
  static hasFileSystem(): boolean {
    if (!Platform.isNode()) return false;
    
    try {
      require('fs');
      return true;
    } catch {
      return false;
    }
  }
  
  static hasPath(): boolean {
    if (!Platform.isNode()) return false;
    
    try {
      require('path');
      return true;
    } catch {
      return false;
    }
  }
  
  static hasHTTP(): boolean {
    if (!Platform.isNode()) return false;
    
    try {
      require('http');
      return true;
    } catch {
      return false;
    }
  }
  
  static hasProcess(): boolean {
    return typeof process !== 'undefined' && process.versions && process.versions.node;
  }
  
  static getNodeVersion(): string | null {
    if (!this.hasProcess()) return null;
    return process.version;
  }
  
  static getEnvironmentVariables(): Record<string, string | undefined> {
    if (!this.hasProcess()) return {};
    return process.env;
  }
  
  static getCurrentWorkingDirectory(): string | null {
    if (!this.hasProcess()) return null;
    return process.cwd();
  }
  
  static getPlatformArch(): string | null {
    if (!this.hasProcess()) return null;
    return process.arch;
  }
}

// File system utilities for Node.js
class FileSystemUtils {
  static async readFile(path: string): Promise<string | null> {
    if (!ServerCapabilities.hasFileSystem()) return null;
    
    try {
      const fs = require('fs').promises;
      return await fs.readFile(path, 'utf8');
    } catch (error) {
      console.error('Failed to read file:', error);
      return null;
    }
  }
  
  static async writeFile(path: string, content: string): Promise<boolean> {
    if (!ServerCapabilities.hasFileSystem()) return false;
    
    try {
      const fs = require('fs').promises;
      await fs.writeFile(path, content, 'utf8');
      return true;
    } catch (error) {
      console.error('Failed to write file:', error);
      return false;
    }
  }
  
  static async fileExists(path: string): Promise<boolean> {
    if (!ServerCapabilities.hasFileSystem()) return false;
    
    try {
      const fs = require('fs').promises;
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
  
  static async createDirectory(path: string): Promise<boolean> {
    if (!ServerCapabilities.hasFileSystem()) return false;
    
    try {
      const fs = require('fs').promises;
      await fs.mkdir(path, { recursive: true });
      return true;
    } catch (error) {
      console.error('Failed to create directory:', error);
      return false;
    }
  }
}
```

---

## 🔧 Platform-Specific Storage

### **Universal Storage Adapter**

```typescript
interface IUniversalStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

class UniversalStorageAdapter implements IUniversalStorage {
  private storage: IUniversalStorage;
  
  constructor() {
    this.storage = this.createPlatformStorage();
  }
  
  private createPlatformStorage(): IUniversalStorage {
    if (Platform.isWeb()) {
      return new WebStorage();
    } else if (Platform.isMobile()) {
      return new MobileStorage();
    } else if (Platform.isNode()) {
      return new NodeStorage();
    } else if (Platform.isElectron()) {
      return new ElectronStorage();
    } else {
      return new MemoryStorage();
    }
  }
  
  async getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }
  
  async setItem(key: string, value: string): Promise<void> {
    return this.storage.setItem(key, value);
  }
  
  async removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key);
  }
  
  async clear(): Promise<void> {
    return this.storage.clear();
  }
  
  async getAllKeys(): Promise<string[]> {
    return this.storage.getAllKeys();
  }
}

// Platform-specific implementations
class WebStorage implements IUniversalStorage {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }
  
  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }
  
  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
  
  async clear(): Promise<void> {
    localStorage.clear();
  }
  
  async getAllKeys(): Promise<string[]> {
    return Object.keys(localStorage);
  }
}

class MobileStorage implements IUniversalStorage {
  private asyncStorage: any;
  
  constructor() {
    try {
      this.asyncStorage = require('@react-native-async-storage/async-storage');
    } catch {
      throw new Error('AsyncStorage not available');
    }
  }
  
  async getItem(key: string): Promise<string | null> {
    return this.asyncStorage.getItem(key);
  }
  
  async setItem(key: string, value: string): Promise<void> {
    return this.asyncStorage.setItem(key, value);
  }
  
  async removeItem(key: string): Promise<void> {
    return this.asyncStorage.removeItem(key);
  }
  
  async clear(): Promise<void> {
    return this.asyncStorage.clear();
  }
  
  async getAllKeys(): Promise<string[]> {
    return this.asyncStorage.getAllKeys();
  }
}

class NodeStorage implements IUniversalStorage {
  private fs: any;
  private path: any;
  private storageDir: string;
  
  constructor() {
    this.fs = require('fs').promises;
    this.path = require('path');
    this.storageDir = this.path.join(process.cwd(), '.storage');
    this.ensureStorageDir();
  }
  
  private async ensureStorageDir(): Promise<void> {
    try {
      await this.fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create storage directory:', error);
    }
  }
  
  private getFilePath(key: string): string {
    return this.path.join(this.storageDir, `${key}.txt`);
  }
  
  async getItem(key: string): Promise<string | null> {
    try {
      const filePath = this.getFilePath(key);
      return await this.fs.readFile(filePath, 'utf8');
    } catch {
      return null;
    }
  }
  
  async setItem(key: string, value: string): Promise<void> {
    const filePath = this.getFilePath(key);
    await this.fs.writeFile(filePath, value, 'utf8');
  }
  
  async removeItem(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      await this.fs.unlink(filePath);
    } catch {
      // File doesn't exist, ignore
    }
  }
  
  async clear(): Promise<void> {
    const files = await this.fs.readdir(this.storageDir);
    const deletePromises = files.map((file: string) => 
      this.fs.unlink(this.path.join(this.storageDir, file))
    );
    await Promise.all(deletePromises);
  }
  
  async getAllKeys(): Promise<string[]> {
    const files = await this.fs.readdir(this.storageDir);
    return files.map((file: string) => this.path.basename(file, '.txt'));
  }
}
```

---

## 🎯 Real-World Usage Examples

### **Adaptive Component Rendering**

```typescript
class AdaptiveComponent {
  render() {
    if (Platform.isMobile()) {
      return this.renderMobile();
    } else if (Platform.isTablet()) {
      return this.renderTablet();
    } else {
      return this.renderDesktop();
    }
  }
  
  private renderMobile() {
    return {
      layout: 'single-column',
      navigation: 'bottom-tabs',
      fontSize: 'large'
    };
  }
  
  private renderTablet() {
    return {
      layout: 'two-column',
      navigation: 'sidebar',
      fontSize: 'medium'
    };
  }
  
  private renderDesktop() {
    return {
      layout: 'three-column',
      navigation: 'header',
      fontSize: 'small'
    };
  }
}
```

### **Feature Detection and Polyfills**

```typescript
class FeatureManager {
  static async initializeFeatures(): Promise<void> {
    // Load polyfills based on platform capabilities
    if (Platform.isWeb() && !BrowserCapabilities.hasLocalStorage()) {
      await this.loadLocalStoragePolyfill();
    }
    
    if (Platform.isWeb() && !BrowserCapabilities.hasWebWorkers()) {
      await this.loadWebWorkerPolyfill();
    }
    
    if (Platform.isMobile() && !MobileCapabilities.hasAsyncStorage()) {
      await this.loadAsyncStoragePolyfill();
    }
  }
  
  private static async loadLocalStoragePolyfill(): Promise<void> {
    const polyfill = await import('localstorage-polyfill');
    // Initialize polyfill
  }
  
  private static async loadWebWorkerPolyfill(): Promise<void> {
    const polyfill = await import('webworker-polyfill');
    // Initialize polyfill
  }
  
  private static async loadAsyncStoragePolyfill(): Promise<void> {
    const polyfill = await import('asyncstorage-polyfill');
    // Initialize polyfill
  }
}
```

---

## 🎯 Best Practices

### **1. Platform Detection**
```typescript
// ✅ Good: Use specific platform checks
if (Platform.isWeb()) {
  // Web-specific code
} else if (Platform.isMobile()) {
  // Mobile-specific code
}

// ❌ Avoid: User agent sniffing
if (navigator.userAgent.includes('Chrome')) {
  // Unreliable
}
```

### **2. Feature Detection**
```typescript
// ✅ Good: Check for specific capabilities
if (BrowserCapabilities.hasLocalStorage()) {
  localStorage.setItem('key', 'value');
} else {
  // Fallback implementation
}

// ❌ Avoid: Platform assumptions
if (Platform.isWeb()) {
  localStorage.setItem('key', 'value'); // May not be available
}
```

### **3. Graceful Degradation**
```typescript
// ✅ Good: Provide fallbacks
const storage = Platform.isWeb() 
  ? new WebStorage() 
  : new MemoryStorage();

// ✅ Good: Progressive enhancement
const hasAdvancedFeatures = Platform.isWeb() && 
  BrowserCapabilities.hasWebGL() && 
  BrowserCapabilities.hasWebWorkers();
```

---

The Platform module in @resk/core enables you to build truly universal applications that work seamlessly across all JavaScript environments while taking advantage of platform-specific features when available.
