import { createRollupOptions } from "./rollup.mjs";
import glob from 'fast-glob';
// Dynamically resolve all .test.ts files
const testFiles = glob.sync('src/**/*.test.ts');
export default createRollupOptions('cjs', {
    dir: `dist`,
}, "./tsconfig.test.json", testFiles, (id) => {
    return id.includes('node_modules') || id.includes('jest') || id.includes("tslib") || id.includes('@jest/');
})