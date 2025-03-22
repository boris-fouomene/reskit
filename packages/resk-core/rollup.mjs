import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { execSync } from 'child_process';

// Helper function to run `tsc-alias`
function runTscAlias() {
    try {
        console.log('Running tsc-alias to resolve paths...');
        execSync('tsc-alias -p tsconfig.mjs.json', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error running tsc-alias:', error);
        process.exit(1);
    }
}
// Helper function to extract package names from IDs
function getPackageName(id) {
    const match = id.match(/^(@[^/]+\/[^/]+|[^/]+)/);
    return match ? match[0] : null;
}
export const createRollupOptions = (format, ouputOptions, tsconfigPath, input, external) => {
    const formatName = format === 'cjs' ? 'cjs' : 'es';
    const formatExt = format === 'cjs' ? 'js' : 'mjs';
    return {
        input: input ?? 'src/index.ts',
        output: {
            dir: `build/${format}`,
            format: formatName,
            entryFileNames: `[name].${formatExt}`,
            sourcemap: false,     // Generate source maps
            preserveModules: true, // Keep directory structure and files
            preserveModulesRoot: 'src', // Root directory for preserving modules
            ...Object.assign({}, ouputOptions),
            paths: (id) => {
                const packageName = getPackageName(id);
                return packageName ? packageName : null; // Map to package name if possible
            },
        },
        external: external !== undefined ? external : (id) => {
            return id.includes('node_modules') || id.includes("tslib");
        }, // Automatically exclude all node_modules
        plugins: [
            // Compile TypeScript files
            typescript({
                tsconfig: tsconfigPath ?? `./tsconfig.${format}.json`,
                outputToFilesystem: false, // Explicitly set to true
                tslib: false,
            }),
            nodeResolve(),
            commonjs(),
            // Run tsc-alias after the build to resolve path aliases
            {
                name: 'tsc-alias',
                buildEnd: () => {
                    runTscAlias();
                },
            },
        ],
    }
}