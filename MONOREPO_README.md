# ResKit Monorepo - Complete Developer Guide

> **ResKit** is an innovative TypeScript framework that empowers developers to build applications with a fully decorator-based architecture for efficient resource management.

## 🏗️ Monorepo Architecture

This repository uses **Lerna 8.x** with **Independent Versioning** for managing multiple packages:

- `@resk/core` - Core framework with decorators and resource management
- `@resk/nativewind` - React Native components with NativeWind styling
- `@resk/nest` - NestJS integration and utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Git with conventional commits setup

### Installation

```bash
# Clone and install
git clone https://github.com/boris-fouomene/reskit.git
cd reskit
npm install

# One-time GitHub token setup for changelog generation
export GITHUB_AUTH=your_github_token_here
```

## 📝 Development Workflow

### 1. Making Changes

Use **Conventional Commits** for automatic changelog generation:

```bash
# Feature additions
git commit -m "feat(core): add new authentication decorator"
git commit -m "feat(nativewind): add dark mode support"

# Bug fixes  
git commit -m "fix(nest): resolve dependency injection issue"
git commit -m "fix(core): handle edge case in resource loading"

# Documentation
git commit -m "docs(core): update API reference"
git commit -m "docs: add migration guide"

# Breaking changes
git commit -m "feat(core)!: redesign resource API"
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

### 2. Building & Testing

```bash
# Build all packages (dependency-aware order)
npm run build

# Build specific packages
npm run build:core        # @resk/core only
npm run build:nativewind  # @resk/nativewind only  
npm run build:nest        # @resk/nest only

# Development with watch mode
npm run build:watch       # All packages in parallel

# Run tests
npm run test              # All packages with tests
npm run test:core         # @resk/core tests (433 tests)
npm run test:nest         # @resk/nest tests

# Linting
npm run lint              # All packages
npm run lint:nativewind   # @resk/nativewind only
npm run lint:nest         # @resk/nest only
```

### 3. Quality Checks

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

### Automatic via Lerna

```bash
# Generate changelogs (uses conventional commits)
npm run changelog

# Package-specific changelogs  
npm run changelog:core
npm run changelog:nativewind
npm run changelog:nest
```

### Manual via Changesets

```bash
# Add changeset (interactive)
npm run changeset

# Version packages with changesets
npm run changeset:version

# Publish with changesets
npm run changeset:publish
```

## 🏗️ Package Structure

```
reskit/
├── packages/
│   ├── resk-core/          # Core framework (@resk/core)
│   │   ├── src/            # TypeScript source
│   │   ├── build/          # Built output (tsup)
│   │   ├── test/           # Jest tests (433 tests)
│   │   └── package.json    # Dependencies & scripts
│   │
│   ├── resk-nativewind/    # React Native UI (@resk/nativewind)  
│   │   ├── src/            # Components & utilities
│   │   ├── build/          # Built output (custom build)
│   │   └── package.json    # React Native dependencies
│   │
│   └── resk-nest/          # NestJS integration (@resk/nest)
│       ├── src/            # NestJS modules & decorators
│       ├── build/          # Built output (tsc + alias)
│       ├── test/           # Jest tests
│       └── package.json    # NestJS dependencies
│
├── examples/               # Usage examples
├── docs/                   # Generated documentation
├── .changeset/             # Changesets configuration
├── lerna.json              # Lerna configuration
└── package.json            # Root workspace configuration
```

## 🔧 Build Systems

Each package uses optimized build tooling:

- **@resk/core**: `tsup` (fast ESM/CJS bundling)
- **@resk/nativewind**: Custom build with React Native support  
- **@resk/nest**: `tsc` + `tsc-alias` for NestJS modules

## 🌟 Key Features

- **🎯 Independent Versioning**: Each package versions independently
- **📝 Conventional Commits**: Automatic changelog generation
- **🔄 Dependency Management**: Smart build ordering and linking
- **⚡ Parallel Execution**: Fast builds and tests via Lerna
- **🚀 GitHub Integration**: Automated releases and changelogs
- **🧪 Comprehensive Testing**: Jest setup with 433+ tests
- **📦 Multiple Formats**: ESM, CJS, and React Native support

## 🛠️ Available Commands

### Development
```bash
npm run build             # Build all packages
npm run test              # Run all tests
npm run lint              # Lint all packages
npm run clean             # Clean build artifacts
npm run changed           # Show changed packages
```

### Individual Packages
```bash
npm run build:core        # Build @resk/core
npm run test:core         # Test @resk/core  
npm run clean:core        # Clean @resk/core
npm run diff:core         # Diff @resk/core
```

### Release Management
```bash
npm run version           # Interactive versioning
npm run release           # Full release process
npm run changelog         # Generate changelogs
```

### Alternative (Changesets)
```bash
npm run changeset         # Add changeset
npm run changeset:version # Version with changesets
npm run changeset:publish # Publish with changesets
```

## 🔄 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/release.yml`):

1. **Build** → All packages built in dependency order
2. **Test** → Jest tests executed (433+ tests)  
3. **Lint** → ESLint validation
4. **Release** → Automated versioning and publishing
5. **Changelog** → Generated from conventional commits

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
