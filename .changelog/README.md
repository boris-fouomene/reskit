# Lerna Changelog Configuration

This configuration enables automatic changelog generation for all packages in the ResKit monorepo.

## Setup

### GitHub Token
Create a GitHub personal access token with `repo` scope and set it as `GITHUB_AUTH`:

```bash
export GITHUB_AUTH=your_github_token
```

### Labels Configuration
The following GitHub labels should be configured in your repository:

- `tag: breaking change` - For breaking changes
- `tag: enhancement` - For new features
- `tag: bug fix` - For bug fixes  
- `tag: documentation` - For documentation changes
- `tag: internal` - For internal/maintenance changes

## Usage

### Generate Changelog
```bash
# Generate changelog for unreleased changes
npm run changelog

# Generate changelog from a specific tag
npm run changelog -- --from=v1.0.0

# Generate changelog for a specific range
npm run changelog -- --from=v1.0.0 --to=v2.0.0
```

### Automatic Changelog Generation
Changelogs are automatically generated during the release process when using:

```bash
npm run release
npm run version
```

The changelog will be created in `CHANGELOG.md` at the root and individual package changelogs will be updated.
