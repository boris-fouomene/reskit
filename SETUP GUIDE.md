# ResKit - Complete Monorepo Framework

> **ResKit** is an innovative TypeScript framework that empowers developers to build applications with a fully decorator-based architecture for efficient resource management.

## 🏗️ Monorepo Structure

This repository uses **Lerna 8.x** with **Independent Versioning** for managing multiple packages:

- **`@resk/core`** - Core framework with decorators and resource management (433 tests ✅)
- **`@resk/nativewind`** - React Native components with NativeWind styling  
- **`@resk/nest`** - NestJS integration and utilities

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/boris-fouomene/reskit.git
cd reskit
npm install

# One-time GitHub token setup for changelog generation
export GITHUB_AUTH=your_github_token_here
```

## 📝 Development Workflow

### Making Changes with Conventional Commits

Use **Conventional Commits** for automatic changelog generation:

```bash
# Examples
git commit -m "feat(core): add new authentication decorator"
git commit -m "fix(nativewind): resolve button styling issue"  
git commit -m "docs(nest): update API documentation"
git commit -m "feat(core)!: redesign resource API" # Breaking change
```

**Commit Types:**
- `feat:` → 🚀 New features
- `fix:` → 🐛 Bug fixes  
- `docs:` → 📝 Documentation
- `style:` → 💅 Formatting
- `refactor:` → ♻️ Code restructuring
- `test:` → ✅ Test additions
- `chore:` → 🔧 Maintenance
- `!` suffix → 💥 Breaking changes

### Building & Testing

```bash
# Build all packages (dependency-aware)
npm run build

# Build specific packages
npm run build:core        # @resk/core only
npm run build:nativewind  # @resk/nativewind only
npm run build:nest        # @resk/nest only

# Run tests (433+ tests)
npm run test              # All packages
npm run test:core         # @resk/core only
npm run test:nest         # @resk/nest only

# Development with watch mode
npm run build:watch       # All packages in parallel

# Linting
npm run lint              # All packages
npm run lint:nativewind   # @resk/nativewind only
npm run lint:nest         # @resk/nest only
```

### Quality Checks

```bash
# See which packages have changes
npm run changed

# View diffs for packages  
npm run diff              # All packages
npm run diff:core         # @resk/core only
npm run diff:nativewind   # @resk/nativewind only
npm run diff:nest         # @resk/nest only

# Clean build artifacts
npm run clean             # All packages
npm run clean:core        # Specific package
```

## 🔄 Release Process

### Versioning (Independent)

Each package maintains its own semantic version:

```bash
# Interactive version bump (recommended)
npm run version

# Specific version types
npm run version:patch     # 1.0.0 → 1.0.1
npm run version:minor     # 1.0.0 → 1.1.0
npm run version:major     # 1.0.0 → 2.0.0
```

### Publishing

```bash
# Full release workflow (build → test → lint → version → publish)
npm run prerelease        # Quality checks
npm run release           # Complete release

# Direct publish options
npm run release:patch     # Patch release
npm run release:minor     # Minor release
npm run release:major     # Major release

# Pre-release versions
npm run release:canary    # Canary builds
npm run release:beta      # Beta releases
```

## 📊 Changelog Generation

Generate changelogs automatically from conventional commits:

```bash
# Generate changelogs
npm run changelog         # All packages

# Package-specific changelogs
npm run changelog:core
npm run changelog:nativewind  
npm run changelog:nest

# View unreleased changes
npm run changelog:unreleased
```

## 🔧 Package Details

### @resk/core
- **Build**: `tsup` (fast ESM/CJS bundling)
- **Tests**: 433 Jest tests ✅
- **Features**: Core decorators, resource management, validation

### @resk/nativewind  
- **Build**: Custom build with React Native support
- **Features**: UI components, styling utilities, dark mode

### @resk/nest
- **Build**: `tsc` + `tsc-alias` for NestJS modules
- **Tests**: Jest integration tests ✅
- **Features**: NestJS decorators, middleware, utilities

## 🌟 Key Features

- **🎯 Independent Versioning**: Each package versions independently
- **📝 Automatic Changelogs**: Generated from conventional commits
- **🔄 Smart Dependencies**: Dependency-aware build ordering
- **⚡ Parallel Builds**: Fast builds and tests via Lerna
- **🚀 GitHub Integration**: Automated releases and changelogs
- **🧪 Comprehensive Testing**: 433+ tests across packages
- **📦 Multiple Formats**: ESM, CJS, and React Native support

## 🛠️ Available Commands

### Development
- `npm run build` - Build all packages
- `npm run test` - Run all tests  
- `npm run lint` - Lint all packages
- `npm run clean` - Clean build artifacts
- `npm run changed` - Show changed packages

### Individual Packages  
- `npm run build:core` - Build @resk/core
- `npm run test:core` - Test @resk/core
- `npm run clean:core` - Clean @resk/core
- `npm run diff:core` - Diff @resk/core

### Release Management
- `npm run version` - Interactive versioning
- `npm run release` - Full release process
- `npm run changelog` - Generate changelogs

## 🔄 CI/CD Pipeline

GitHub Actions workflow automatically:

1. **Builds** all packages in dependency order
2. **Tests** with 433+ Jest tests
3. **Lints** with ESLint validation  
4. **Releases** with automated versioning
5. **Generates** changelogs from commits

## 🏗️ Monorepo Setup

This repository has been optimized with:

- ✅ **Lerna 8.x** for independent package versioning
- ✅ **Conventional Commits** for automatic changelog generation  
- ✅ **GitHub Actions** for CI/CD automation
- ✅ **npm Workspaces** for dependency management
- ✅ **Clean scripts** for build artifact management
- ❌ **No Turbo dependency** - uses native npm + Lerna
- ❌ **No Changesets** - uses Lerna's conventional commits approach

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feat/new-feature`
3. Make changes with conventional commits
4. Run tests: `npm run test`
5. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Monorepo powered by Lerna 8.x with Independent Versioning** 🚀
