// Save as esbuild-solution.js
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

// Make sure required packages are installed
try {
    require.resolve('esbuild');
    require.resolve('glob');
} catch (e) {
    console.log('📦 Installing required packages...');
    execSync('npm install --save-dev esbuild glob');
    console.log('✅ Packages installed');
}

// Configuration
const SRC_DIR = './src';
const BUILD_DIR = './build';

// Ensure build directory exists
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// Generate type definitions separately
console.log('📝 Generating type definitions...');
const startTypeTime = Date.now();

try {
    execSync('npx tsc --emitDeclarationOnly --declaration --declarationDir ./build', { stdio: 'inherit' });
    console.log(`✅ Type definitions generated in ${((Date.now() - startTypeTime) / 1000).toFixed(2)}s`);
} catch (error) {
    console.log('⚠️ Type generation failed, but continuing with build...');
}

// Find all source files
console.log('🔍 Finding source files...');
const entryPoints = glob.sync(`${SRC_DIR}/**/*.{ts,tsx}`, {
    ignore: [
        '**/node_modules/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/__tests__/**',
        '**/resk-core/**',
        '**/@resk/core/**'
    ]
});

console.log(`📂 Found ${entryPoints.length} files to compile`);

// Process files in batches to avoid memory issues
const BATCH_SIZE = 100;
const totalBatches = Math.ceil(entryPoints.length / BATCH_SIZE);

console.log(`🚀 Starting ultra-fast build with esbuild (${totalBatches} batches)...`);
const startBuildTime = Date.now();

async function processBatch(batchEntryPoints, batchNumber) {
    console.log(`⚙️ Processing batch ${batchNumber}/${totalBatches} (${batchEntryPoints.length} files)...`);

    try {
        const result = await esbuild.build({
            entryPoints: batchEntryPoints,
            outdir: BUILD_DIR,
            platform: 'neutral',
            format: 'cjs',
            target: 'es2018',
            jsx: 'transform',
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
            sourcemap: true,
            bundle: false,
            minify: false,
            logLevel: 'error',
            keepNames: true,
            allowOverwrite: true
        });

        return { success: true, warnings: result.warnings };
    } catch (error) {
        return { success: false, error };
    }
}

async function buildAllBatches() {
    const batches = [];

    for (let i = 0; i < entryPoints.length; i += BATCH_SIZE) {
        const batchEntryPoints = entryPoints.slice(i, i + BATCH_SIZE);
        batches.push(processBatch(batchEntryPoints, Math.floor(i / BATCH_SIZE) + 1));
    }

    const results = await Promise.all(batches);

    let hasErrors = false;
    results.forEach((result, index) => {
        if (!result.success) {
            console.error(`❌ Batch ${index + 1} failed:`, result.error);
            hasErrors = true;
        }
    });

    if (!hasErrors) {
        console.log(`✅ All batches completed successfully in ${((Date.now() - startBuildTime) / 1000).toFixed(2)}s`);
    } else {
        console.log('⚠️ Build completed with errors');
    }

    console.log(`🎉 Total build time: ${((Date.now() - startTypeTime) / 1000).toFixed(2)}s`);
}

buildAllBatches();