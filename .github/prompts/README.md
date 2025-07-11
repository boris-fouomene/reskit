# GitHub Copilot Prompt Library

This directory contains reusable GitHub Copilot prompts for common development tasks.

## Available Prompts

| Prompt | Usage | Description |
|--------|-------|-------------|
| `comment.prompt.md` | `#comment` | Generate TypeDoc comments for TypeScript code |
| `refactor.prompt.md` | `#refactor` | Refactor code for better readability and performance |
| `review.prompt.md` | `#review` | Comprehensive code review and quality assessment |
| `test.prompt.md` | `#test` | Generate unit tests with Jest and React Testing Library |
| `optimize.prompt.md` | `#optimize` | Performance optimization suggestions and implementations |

## How to Use

### Method 1: Hashtag References
1. Select the code you want to work with
2. Open GitHub Copilot Chat
3. Type the hashtag (e.g., `#comment`)

### Method 2: Direct File Reference
```
@workspace /comment.prompt.md
```

### Method 3: Keyboard Shortcuts (configured)
- `Ctrl+Shift+C`: Comment selected code
- `Ctrl+Shift+R`: Refactor selected code  
- `Ctrl+Shift+T`: Generate tests for selected code

## Adding New Prompts

1. Create a new `.prompt.md` file in this directory
2. Follow the format: ` ```prompt [your prompt content] ``` `
3. Update this README with the new prompt information
