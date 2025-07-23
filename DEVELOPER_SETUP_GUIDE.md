# ResKit Framework - Developer Contribution Guide

> Complete setup guide for developers who want to contribute to the ResKit TypeScript framework ecosystem.

## 🏗️ Framework Architecture Overview

ResKit is a **TypeScript monorepo** with **3 core packages** managed by **Lerna 8.x**:

```
reskit/
├── packages/
│   ├── resk-core/           # Core framework with decorators & utilities
│   ├── resk-nativewind/     # React Native UI components 
│   └── resk-nest/           # NestJS integration & server utilities
├── examples/                # Usage examples & demos
├── documentation/           # Comprehensive docs
└── docs/                   # Generated API documentation
```

### Package Responsibilities

| Package | Purpose | Technologies | Tests |
|---------|---------|-------------|-------|
| **@resk/core** | Core framework, decorators, resource management, validation | TypeScript, tsup, Jest | ✅ 433 tests |
| **@resk/nativewind** | React Native UI components with NativeWind styling | React Native, NativeWind, Custom build | ❌ No tests |
| **@resk/nest** | NestJS integration, modules, decorators | NestJS, TypeScript, tsc+alias | ✅ Jest tests |

## 🚀 Quick Setup (5 minutes)

### Prerequisites

```bash
# Required versions
node --version    # >= 18.x
npm --version     # >= 9.x  
git --version     # >= 2.x
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/boris-fouomene/reskit.git
cd reskit

# 2. Install dependencies (automatically installs all packages)
npm install

# 3. Build all packages (dependency-aware order)
npm run build

# 4. Run tests to verify setup
npm run test

# 5. One-time GitHub token setup (for changelog generation)
export GITHUB_AUTH=your_github_token_here
```

## 🛠️ Development Environment Setup

### IDE Configuration

#### VS Code (Recommended)

Install these extensions:
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode", 
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "orta.vscode-jest"
  ]
}
```

#### TypeScript Configuration

Each package has its own `tsconfig.json` with path aliases:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./build",
    "paths": {
      "@utils/*": ["src/utils/*"],
      "@resources/*": ["src/resources/*"]
    }
  }
}
```

## 📦 Package-Specific Development

### @resk/core - Core Framework

**Technology Stack:**
- **Build**: `tsup` (fast ESM/CJS bundling) 
- **Tests**: Jest (433 tests)
- **Exports**: Multiple entry points with path aliases

**Key Commands:**
```bash
# Navigate to core package
cd packages/resk-core

# Development
npm run dev              # Watch mode build
npm run test             # Run 433 Jest tests
npm run test:watch       # Tests in watch mode

# Building  
npm run build            # Production build with tsup
npm run build-dts        # Generate TypeScript declarations
npm run clean            # Remove build artifacts

# Publishing
npm run check            # Dry run publish check
npm run publish:canary   # Publish canary version
```

**Project Structure:**
```
resk-core/
├── src/
│   ├── auth/            # Authentication utilities
│   ├── countries/       # Country data & utilities
│   ├── currency/        # Currency handling
│   ├── resources/       # Core resource management
│   ├── utils/           # Utility functions
│   ├── validator/       # Validation system
│   └── types/           # TypeScript type definitions
├── test/                # Jest test files
├── build/               # Built output (generated)
└── tsup.config.build.ts # Build configuration
```

**Testing:**
```bash
# All tests (433 tests)
npm run test

# Specific test files
npm run test -- --testNamePattern="validator"
npm run test -- src/utils/string.test.ts

# Coverage report
npm run test -- --coverage
```

### @resk/nativewind - React Native UI

**Technology Stack:**
- **Build**: Custom build system with React Native support
- **Styling**: NativeWind (Tailwind for React Native)
- **Components**: Pre-built UI components

**Key Commands:**
```bash
# Navigate to nativewind package
cd packages/resk-nativewind

# Development
npm run build            # Custom build process
npm run generate-variants # Generate color variants
npm run build:dts        # Generate TypeScript declarations
npm run generate-icon-types # Generate icon type definitions
npm run clean            # Remove build artifacts

# Linting
npm run lint             # ESLint validation
```

**Project Structure:**
```
resk-nativewind/
├── src/
│   ├── components/      # UI components (Button, Form, etc.)
│   ├── variants/        # Style variants & themes  
│   ├── utils/          # Utility functions
│   ├── i18n/           # Internationalization
│   └── types/          # TypeScript definitions
├── build/               # Built output (generated)
├── bin/                 # CLI utilities
└── variants.json        # Generated variants config
```

**Component Development:**
```typescript
// Example component structure
import { StyleSheet } from 'react-native';
import { styled } from 'nativewind';

export const Button = styled(TouchableOpacity, {
  // NativeWind styling
  className: 'px-4 py-2 bg-blue-500 rounded'
});
```

### @resk/nest - NestJS Integration

**Technology Stack:**
- **Build**: `tsc` + `tsc-alias` for module resolution
- **Framework**: NestJS decorators & modules
- **Tests**: Jest integration tests

**Key Commands:**
```bash
# Navigate to nest package  
cd packages/resk-nest

# Development
npm run build            # TypeScript compilation
npm run test             # Jest tests
npm run test:watch       # Tests in watch mode
npm run test:e2e         # End-to-end tests
npm run clean            # Remove build artifacts

# Code quality
npm run lint             # ESLint validation
npm run format           # Prettier formatting
```

**Project Structure:**
```
resk-nest/
├── src/
│   ├── modules/         # NestJS modules
│   ├── translations/    # i18n translations
│   ├── utils.ts         # Utility functions
│   └── index.ts         # Main exports
├── test/                # Jest test files
└── build/               # Built output (generated)
```

**Module Development:**
```typescript
// Example NestJS module
import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';

@Module({
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
```

## 🔄 Development Workflow

### 1. Making Changes

Use **Conventional Commits** for automatic changelog generation:

```bash
# Feature development
git commit -m "feat(core): add new authentication decorator"
git commit -m "feat(nativewind): add dark mode support"
git commit -m "feat(nest): add resource validation module"

# Bug fixes
git commit -m "fix(core): resolve validator edge case"
git commit -m "fix(nativewind): fix button styling issue"

# Documentation
git commit -m "docs(core): update API reference"
git commit -m "docs: add contribution guide"

# Breaking changes  
git commit -m "feat(core)!: redesign resource API"
```

### 2. Building & Testing

```bash
# Build all packages (respects dependencies)
npm run build

# Build specific packages
npm run build:core        # @resk/core only
npm run build:nativewind  # @resk/nativewind only  
npm run build:nest        # @resk/nest only

# Run tests across packages
npm run test              # All packages with tests
npm run test:core         # @resk/core (433 tests)
npm run test:nest         # @resk/nest tests

# Development with watch mode
npm run build:watch       # All packages in parallel
```

### 3. Quality Assurance

```bash
# Linting
npm run lint              # All packages
npm run lint:nativewind   # @resk/nativewind only
npm run lint:nest         # @resk/nest only

# Clean build artifacts
npm run clean             # All packages
npm run clean:core        # Specific package

# Check what changed
npm run changed           # Show packages with changes
npm run diff              # View all diffs
npm run diff:core         # View @resk/core diff only
```

### 4. Release Process

```bash
# Version packages (interactive)
npm run version

# Generate changelogs
npm run changelog         # All packages
npm run changelog:core    # @resk/core only

# Publish packages
npm run release           # Full release process
npm run release:canary    # Canary builds
```

## 🏗️ Build Systems Explained

### @resk/core Build (tsup)

```typescript
// tsup.config.build.ts
export default {
  entry: ['src/**/*.ts'],
  format: ['cjs'],
  outDir: './build',
  clean: true,
  dts: false,  // Handled separately
  bundle: false, // Preserves file structure
  onSuccess: () => {
    // Run tsc-alias for path resolution
    // Generate TypeScript declarations
  }
}
```

**Benefits:**
- ⚡ Fast builds with esbuild
- 📁 Preserves source file structure  
- 🔄 Automatic path alias resolution
- 📝 Separate declaration generation

### @resk/nativewind Build (Custom)

```bash
# Multi-step build process
npm run build-color-variants  # Generate color variants
npm run generate-variants     # Create variant files
tsc                          # TypeScript compilation  
npx tsc-alias               # Resolve path aliases
npm run build:dts           # Generate declarations
npm run generate-icon-types # Create icon types
npm run copy-css            # Copy CSS files
```

**Benefits:**
- 🎨 Dynamic variant generation
- 📱 React Native compatibility
- 🔧 Icon type generation
- 📋 CSS file handling

### @resk/nest Build (tsc + alias)

```bash
# Simple TypeScript compilation
tsc --project ./tsconfig.json    # Compile TypeScript
npx tsc-alias -p tsconfig.json   # Resolve path aliases
```

**Benefits:**
- 🎯 NestJS module compatibility
- 📁 Clean CommonJS output
- 🔗 Proper path resolution

## 🧪 Testing Strategy

### @resk/core Testing (433 Tests)

```bash
# Run all tests
npm run test

# Test categories
npm run test -- --testPathPattern="validator"  # Validation tests
npm run test -- --testPathPattern="utils"      # Utility tests  
npm run test -- --testPathPattern="resources"  # Resource tests

# Coverage reporting
npm run test -- --coverage
```

**Test Structure:**
```
test/
├── utils/
│   ├── string.test.ts       # String utility tests
│   ├── object.test.ts       # Object utility tests  
│   └── validation.test.ts   # Validation tests
├── resources/
│   └── resource.test.ts     # Resource management tests
└── integration/
    └── full-flow.test.ts    # End-to-end tests
```

### @resk/nest Testing

```bash
# Unit tests
npm run test

# Integration tests  
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## 📚 Documentation

### API Documentation

```bash
# Generate TypeDoc documentation
npm run build-doc

# View generated docs
open docs/index.html
```

### Package Documentation

Each package has comprehensive documentation:

- **@resk/core**: `packages/resk-core/README.md`
- **@resk/nativewind**: `packages/resk-nativewind/README.md` 
- **@resk/nest**: `packages/resk-nest/README.md`

### Examples

```bash
# Explore usage examples
ls examples/
# context-aware-styling-demo.tsx
# enhanced-visibility-demo.tsx  
# resk-nativewind-next/
# resk-nest-examples/
```

## 🔧 Troubleshooting

### Common Issues

**Build Failures:**

```bash
# Clear all build artifacts
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Force rebuild
npm run clean && npm run build
```

**Test Failures:**

```bash
# Run tests with verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- packages/resk-core/test/utils/string.test.ts
```

**Path Resolution Issues:**

```bash
# Check TypeScript compilation
cd packages/resk-core
npx tsc --noEmit

# Verify path aliases
cat tsconfig.json | jq '.compilerOptions.paths'
```

### Development Tools

**Useful Scripts:**

```bash
# Check for outdated dependencies
npm run check-updates

# Lint and format code
npm run lint && npm run format

# View package dependency tree
npm ls --depth=0
```

## 🤝 Contributing Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier configuration
- **Linting**: ESLint with TypeScript rules
- **Commits**: Conventional commits required

### Pull Request Process

1. **Fork & Clone**: Fork the repository and clone locally
2. **Branch**: Create feature branch (`feat/amazing-feature`)
3. **Develop**: Make changes with proper testing
4. **Test**: Ensure all tests pass (`npm run test`)
5. **Build**: Verify builds work (`npm run build`)
6. **Commit**: Use conventional commits
7. **Push**: Push to your forked repository
8. **PR**: Create pull request with clear description

### Testing Requirements

- **@resk/core**: Maintain 80%+ test coverage
- **@resk/nest**: Add tests for new modules
- **@resk/nativewind**: Visual testing for components

### Documentation Requirements

- Update README files for API changes
- Add JSDoc comments for public APIs
- Include usage examples for new features
- Update TypeScript types and exports

## 📖 Learning Resources

### Framework Understanding

1. **Start with**: `documentation/USER_GUIDE.md`
2. **Core concepts**: `documentation/SESSION_1_1_RESOURCE_ARCHITECTURE.md`
3. **Field types**: `documentation/SESSION_1_2_FIELD_TYPES_REFERENCE.md`
4. **Examples**: Explore `examples/` directory

### Package Deep Dive

1. **@resk/core**: Study `packages/resk-core/src/resources/`
2. **@resk/nativewind**: Explore `packages/resk-nativewind/src/components/`
3. **@resk/nest**: Review `packages/resk-nest/src/modules/`

### External Documentation

- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **NestJS**: [NestJS Documentation](https://docs.nestjs.com/)
- **React Native**: [React Native Docs](https://reactnative.dev/docs/getting-started)
- **Lerna**: [Lerna Documentation](https://lerna.js.org/)

---

## 🎯 Next Steps

1. **Setup environment** following the quick setup guide
2. **Run the test suite** to verify everything works
3. **Explore examples** to understand framework usage
4. **Pick a package** to contribute to based on your interests
5. **Start small** with documentation or test improvements
6. **Join discussions** in GitHub issues and pull requests

**Welcome to the ResKit development community!** 🚀

---

*This guide covers the complete development setup for the ResKit TypeScript framework. For specific questions, please check the documentation or create an issue.*
