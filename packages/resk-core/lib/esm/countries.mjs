import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const countries = require('../../build/countries/index.js');

export default countries;

// Export all named exports for tree-shaking
for (const key in countries) {
  if (key !== 'default') {
    global[key] = countries[key];
  }
}
