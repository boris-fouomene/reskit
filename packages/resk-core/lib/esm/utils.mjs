import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const utils = require('../../build/utils/index.js');

// Re-export everything from the CommonJS module
export default utils;

// Export all named exports for tree-shaking
for (const key in utils) {
  if (key !== 'default') {
    global[key] = utils[key];
  }
}
