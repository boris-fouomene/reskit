// Save as diagnose.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 TypeScript Build Diagnostics');
console.log('================================');

// Check TypeScript version
console.log('\n⚙️ TypeScript Version:');
try {
    const tsVersion = execSync('npx tsc --version').toString().trim();
    console.log(`   ${tsVersion}`);
} catch (error) {
    console.log('   Failed to get TypeScript version');
}

// Count files
console.log('\n📂 Project Size:');
let tsFiles = 0;
let tsxFiles = 0;
let totalSize = 0;

function countFiles(dir) {
    try {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);

            try {
                const stat = fs.lstatSync(filePath);

                if (stat.isDirectory()) {
                    // Skip node_modules and build directories
                    if (file !== 'node_modules' && file !== 'build' && file !== 'dist' && file !== '.git') {
                        countFiles(filePath);
                    }
                } else if (file.endsWith('.ts')) {
                    tsFiles++;
                    totalSize += stat.size;
                } else if (file.endsWith('.tsx')) {
                    tsxFiles++;
                    totalSize += stat.size;
                }
            } catch (err) {
                // Skip file if we can't access it
            }
        });
    } catch (err) {
        // Skip directory if we can't access it
    }
}

countFiles('.');
console.log(`   .ts files: ${tsFiles}`);
console.log(`   .tsx files: ${tsxFiles}`);
console.log(`   Total files: ${tsFiles + tsxFiles}`);
console.log(`   Total size: ${Math.round(totalSize / 1024 / 1024 * 100) / 100} MB`);

// Check for large files
console.log('\n🔍 Checking for large files (>100KB):');
const largeFiles = [];

function findLargeFiles(dir) {
    try {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);

            try {
                const stat = fs.lstatSync(filePath);

                if (stat.isDirectory()) {
                    // Skip node_modules and build directories
                    if (file !== 'node_modules' && file !== 'build' && file !== 'dist' && file !== '.git') {
                        findLargeFiles(filePath);
                    }
                } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && stat.size > 100 * 1024) {
                    largeFiles.push({ path: filePath, size: Math.round(stat.size / 1024) + ' KB' });
                }
            } catch (err) {
                // Skip file if we can't access it
            }
        });
    } catch (err) {
        // Skip directory if we can't access it
    }
}

findLargeFiles('.');
if (largeFiles.length > 0) {
    largeFiles.forEach(file => {
        console.log(`   ${file.path} (${file.size})`);
    });
} else {
    console.log('   No large files found');
}

// Check memory
console.log('\n💾 System Memory:');
try {
    const totalMem = execSync('node -e "console.log(require(\'os\').totalmem())"').toString().trim();
    const freeMem = execSync('node -e "console.log(require(\'os\').freemem())"').toString().trim();

    console.log(`   Total: ${Math.round(totalMem / 1024 / 1024 / 1024 * 100) / 100} GB`);
    console.log(`   Free: ${Math.round(freeMem / 1024 / 1024 / 1024 * 100) / 100} GB`);
} catch (error) {
    console.log('   Failed to get memory information');
}

// Check CPU
console.log('\n🖥️ CPU Cores:');
try {
    const cpuCount = execSync('node -e "console.log(require(\'os\').cpus().length)"').toString().trim();
    console.log(`   ${cpuCount} cores available`);
} catch (error) {
    console.log('   Failed to get CPU information');
}

// Measure tsc performance
console.log('\n⏱️ Measuring TypeScript parsing time (no emit)...');
try {
    const startTime = Date.now();
    execSync('npx tsc --noEmit', { stdio: 'ignore' });
    const duration = (Date.now() - startTime) / 1000;
    console.log(`   Completed in ${duration.toFixed(2)} seconds`);
} catch (error) {
    console.log('   Failed (likely due to errors)');
}

console.log('\n✅ Diagnostics complete');
console.log('Run "node esbuild-solution.js" to build with esbuild');