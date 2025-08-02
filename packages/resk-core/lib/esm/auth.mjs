import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const auth = require('../../build/auth/index.js');

export default auth;

// Export all named exports for tree-shaking
for (const key in auth) {
  if (key !== 'default') {
    global[key] = auth[key];
  }
}
