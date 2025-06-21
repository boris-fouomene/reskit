const fs = require('fs');
const path = require('path');

function copyToExpoDemoPackage(demoPath) {
    const dir = path.resolve(__dirname, "..");
    const nativewindDemoPath = path.resolve(dir, "..", "..", "..", "resk-nativewind-demo", "node_modules", "@resk", "nativewind");
    const buildPath = path.resolve(dir, "build")
    if (typeof demoPath === 'string' && fs.existsSync(demoPath) && fs.existsSync(path.resolve(demoPath, "package.json"))) {

    } else if (fs.existsSync(path.resolve(nativewindDemoPath, "package.json"))) {
        demoPath = nativewindDemoPath;
    } else demoPath = undefined;
    if (demoPath && fs.existsSync(buildPath)) {
        fs.cpSync(buildPath, path.resolve(demoPath, "build"), { recursive: true });
        console.log("Copied build files to demo package ", path.resolve(demoPath, "build"));
    }
}
copyToExpoDemoPackage();