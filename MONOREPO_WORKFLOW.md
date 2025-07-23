# ResKit Monorepo Workflow Guide - Complete Lerna Setup ✅

## 🚀 Daily Development Workflow

### 1. Initial Setup (One-time)

```bash
# Install dependencies (handled automatically)
npm install

# Set GitHub token for changelog generation
export GITHUB_AUTH=your_github_token
```

### 2. Making Changes to Packages

**Use Conventional Commits for automatic changelog generation:**

```bash
# Examples of proper commit messages
git commit -m "feat(core): add new authentication method"
git commit -m "fix(nativewind): resolve button styling issue"
git commit -m "docs(nest): update API documentation"
git commit -m "refactor(core): optimize resource loading"
git commit -m "test(nest): add integration tests"
```

**Commit Types:**
- `feat:` → 🚀 New features
- `fix:` → 🐛 Bug fixes
- `docs:` → 📝 Documentation
- `style:` → 💅 Code formatting
- `refactor:` → ♻️ Code refactoring
- `test:` → ✅ Tests
- `chore:` → 🔧 Maintenance

### 3. Building and Testing

```bash
# Build all packages (dependency-aware)
npm run build

# Build specific packages
npm run build:core        # @resk/core only
npm run build:nativewind  # @resk/nativewind only
npm run build:nest        # @resk/nest only

# Run tests (packages with tests)
npm run test              # All packages
npm run test:core         # @resk/core only  
npm run test:nest         # @resk/nest only

# Run linting (packages with linting)
npm run lint              # All packages
npm run lint:nativewind   # @resk/nativewind only
npm run lint:nest         # @resk/nest only

# Watch mode for development (parallel execution)
npm run build:watch
```

### 4. Cleaning Build Artifacts

```bash
# Clean all packages
npm run clean

# Clean specific packages  
npm run clean:core
npm run clean:nativewind
npm run clean:nest
```

## 📋 Lerna Release Workflow

### 5. Versioning with Lerna

```bash
# Interactive version selection (recommended)
npm run version

# Specific version bumps
npm run version:patch    # 1.0.0 → 1.0.1
npm run version:minor    # 1.0.0 → 1.1.0  
npm run version:major    # 1.0.0 → 2.0.0
```

### 6. Publishing with Lerna

```bash
# Full release process (build + test + version + publish)
npm run release

# Specific release types
npm run release:patch     # Patch release
npm run release:minor     # Minor release
npm run release:major     # Major release

# Pre-release versions
npm run release:canary    # 1.0.0-canary.1
npm run release:beta      # 1.0.0-beta.1

# Publish from git tags (CI/CD)
npm run publish
```

## 📝 Changelog Generation

### 7. Automatic Changelogs

```bash
# Generate changelog for unreleased changes
npm run changelog

# Generate changelog from specific version
npm run changelog -- --from=v1.0.0

# Generate changelog for version range
npm run changelog -- --from=v1.0.0 --to=v2.0.0
```

**GitHub Labels for Categorization:**
- `tag: breaking change` → 💥 Breaking Change
- `tag: enhancement` → 🚀 Enhancement  
- `tag: bug fix` → 🐛 Bug Fix
- `tag: documentation` → 📝 Documentation
- `tag: internal` → 🏠 Internal

## 🔧 Package-Specific Information

### @resk/core (v1.23.2)
```bash
# Build: tsup + TypeScript + alias resolution
# Tests: ✅ 433 tests passing
# Output: build/ directory
npm run build:core
npm run test:core
npm run clean:core
```

### @resk/nativewind (v1.0.1-canary.99)
```bash
# Build: Complex multi-step (variants + TypeScript + CSS)  
# Lint: ✅ ESLint + Prettier
# Output: build/ directory
npm run build:nativewind
npm run lint:nativewind
npm run clean:nativewind
```

### @resk/nest (v1.11.0)
```bash
# Build: TypeScript + tsc-alias
# Tests: ✅ Jest testing
# Lint: ✅ ESLint  
# Output: build/ directory
npm run build:nest
npm run test:nest
npm run lint:nest
npm run clean:nest
```

## 🏗️ Lerna Architecture Features

### ✅ Independent Versioning
- Each package maintains its own version number
- Versions bump independently based on changes
- `lerna.json` configured with `"version": "independent"`

### ✅ Dependency-Aware Building
Lerna automatically handles build order:
1. **@resk/core** (builds first - no dependencies)
2. **@resk/nativewind** (depends on @resk/core)  
3. **@resk/nest** (depends on @resk/core)

### ✅ Conventional Commits Integration
- Automatic version bumping based on commit messages
- Changelog generation from commit history
- GitHub release creation with release notes

### ✅ Smart Change Detection
Ignores these files for version bumping:
- Documentation files (`**/*.md`)
- Test files (`**/test/**`, `**/*.test.*`)
- Example files (`**/examples/**`)

## 🔄 CI/CD Pipeline with Lerna

### On Pull Request:
- ✅ Build verification (`lerna run build --stream`)
- ✅ Test suite (`lerna run test --stream`)
- ✅ Lint check (`lerna run lint --stream`)

### On Main Branch Push:
- 🚀 Dual release strategy: **Changesets OR Lerna**
- 📦 Automatic package publishing to npm
- 📝 Automatic changelog generation
- 🏷️ Git tags with GitHub releases
- 📋 Release notes from conventional commits

## 🌿 Conventional Commits Examples

```bash
# Features
feat(core): add OAuth2 authentication support
feat(nativewind): implement dark mode theming
feat(nest): add GraphQL schema validation

# Bug fixes  
fix(core): resolve memory leak in session management
fix(nativewind): fix button disabled state styling
fix(nest): handle database connection timeouts

# Documentation
docs(core): add authentication usage examples
docs(nativewind): update component API reference
docs(nest): improve deployment documentation

# Breaking changes
feat(core)!: migrate to new authentication API
fix(nativewind)!: remove deprecated component props
```

## 🛠️ Advanced Troubleshooting

### Lerna Issues
```bash
# Check which packages exist
lerna ls

# Check which packages have changes
lerna changed

# Check package dependency graph
lerna ls --graph

# Force reinstall all dependencies
npm run clean:install
```

### Version/Release Issues
```bash
# Preview what would be released
lerna changed

# Check current package versions
lerna ls --json

# Reset to clean state
git checkout -- .
git clean -fd
npm install
```

### Build Issues
```bash
# Clean everything and rebuild
npm run clean
npm install
npm run build
```

### Publishing Issues
```bash
# Check publish status
lerna ls --json

# Publish specific package
lerna publish --scope=@resk/core

# Skip git checks (use carefully)  
lerna publish --skip-git
```

## 📦 Environment Variables

### Required for Full Functionality:
```bash
# For changelog generation
export GITHUB_AUTH=your_github_token

# For npm publishing (CI/CD)
export NPM_TOKEN=your_npm_token

# For GitHub releases (CI/CD)
export GITHUB_TOKEN=your_github_token
```

### GitHub Secrets Setup:
1. Go to repository Settings > Secrets and variables > Actions
2. Add `NPM_TOKEN` (from npm access tokens)
3. `GITHUB_TOKEN` is automatically provided

## 🎯 What's Working Now

✅ **Lerna 8.x** - Latest version with modern features  
✅ **Independent Versioning** - Each package has its own version  
✅ **Conventional Commits** - Automatic changelog generation  
✅ **GitHub Releases** - Automatic release creation  
✅ **Build Pipeline** - Dependency-aware building  
✅ **Test Pipeline** - Targeted testing per package  
✅ **Clean Commands** - Remove build artifacts  
✅ **Watch Mode** - Development with automatic rebuilding  
✅ **Scoped Commands** - Target specific packages  
✅ **Dual Release Strategy** - Changesets OR Lerna workflow  

Your ResKit monorepo is now a **production-ready** Lerna-powered development environment! 🚀
