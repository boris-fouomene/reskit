const path = require("path");
const fs = require("fs");
/***
 * 
 */
module.exports = function findPackageDir(...pathSuffixesToCheck) {
    let root = path.resolve(process.cwd());
    pathSuffixToCheck = pathSuffixesToCheck.filter(suffix => suffix && typeof suffix == "string" ? true : false);
    for (let i = 0; i < 4; i++) {
        const variantsDir = path.resolve(root, "node_modules", '@resk/nativewind');
        if (fs.existsSync(path.resolve(variantsDir, "package.json")) && fs.existsSync(path.resolve(variantsDir, ...pathSuffixesToCheck))) {
            return variantsDir;
        }
        root = path.resolve(root, "..");
    }
    return null;
};