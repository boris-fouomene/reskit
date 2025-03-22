import { createRollupOptions } from "./rollup.mjs";

export default [
    // Configuration for CommonJS (cjs)
    createRollupOptions('cjs'),
    // Configuration for ES Modules (mjs)
    createRollupOptions('mjs'),
];
