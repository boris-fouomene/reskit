// tsup.config.js
import { defineConfig } from 'tsup'
import glob from 'fast-glob';
import { replaceTscAliasPaths } from 'tsc-alias';

const isTest = false;
const entry = glob.sync(`./src/**/${!isTest ? '!(*.d|*.spec|*.test)' : "*"}.(ts|tsx|js|jsx)`);
const onSuccess = async => {
    console.log("Running tsc-alias after the build to resolve the path aliases");
    /* try {
        replaceTscAliasPaths({
            //configFile: isTest ? "tsconfig.test.json" : "tsconfig.json",
            outDir: isTest ? "./dist" : "./build",
        });
    } catch (err) {
        console.log(err, " generaaaaattting aliases");
    }; */
};
const commonOptions = {
    entry,
    outDir: 'build',
    sourcemap: false,
    //splitting: false, // Avoid splitting to keep module references simple
    format: ['esm'],
    target: 'es2016',
    bundle: false, // ❌ Disable bundling to keep file structure
    external: ["node_modules", "@resk/core", "react", "react-native"], // Prevent bundling external dependencies

}
export default defineConfig([
    // First step: ES6 JS files without comments
    {
        dts: false, // Don't generate declaration files in this step
        clean: true,
        ...commonOptions,
        outExtension: () => ({ js: '.js' }), // Force .js extension instead of .mjs
        esbuildOptions(options) {
            options.dropLabels = ['DEBUG']; // Removes debug statements 
            options.legalComments = 'none'; // Remove legal comments
            options.banner = {}; // Remove any banner comments
            options.footer = {}; // Remove any footer comments
            options.minify = true; // This will also strip comments
            options.keepNames = true; // Preserve names for better debugging
        },
        onSuccess
    },
    // Second step: Declaration files with comments
    {
        entry,
        ...commonOptions,
        dts: {
            only: true, // Only generate declarations
            respectExternal: true,
            compilerOptions: {
                removeComments: false // Keep comments in declaration files
            }
        },
        esbuildOptions(options) {
            options.removeComments = false; // Keep comments
        },
        onSuccess
    }
])