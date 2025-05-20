const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs');
const path = require('path');
const iconSetNames = {
    MaterialCommunityIcons: "",
    MaterialIcons: "material",
    AntDesign: "antd",
    FontAwesome6: "fa6",
    Ionicons: "ionic",

    Feather: "feather",
    Foundation: "foundation",
    Octicons: "octicons",
}
// Helper function to extract icon names from the glyphmaps
function extractIconNames(glyphMapPath) {
    try {
        const content = readFileSync(glyphMapPath, 'utf8');
        const glyphMap = JSON.parse(content);
        return Object.keys(glyphMap);
    } catch (error) {
        console.error(`Error reading glyphmap at ${glyphMapPath}:`, error);
        return [];
    }
}

// Find the node_modules path for react-native-vector-icons
function findIconsPath() {
    let root = path.resolve(process.cwd());
    for (let i = 0; i < 4; i++) {
        const nodePackagePath = path.resolve(root, "node_modules", 'react-native-vector-icons');
        const jsonPath = path.resolve(nodePackagePath, "package.json");
        const glyphMapPath = path.resolve(nodePackagePath, 'glyphmaps');
        console.log("checking ", glyphMapPath);
        if (existsSync(jsonPath) && existsSync(glyphMapPath)) {
            return glyphMapPath
        }
        root = path.resolve(root, "..");
    }
    return null;
}

// Dynamically generate the icon name arrays from the installed package
function generateIconSets(filter) {
    const glyphMapsPath = findIconsPath();
    if (!glyphMapsPath) {
        console.error("❌ Cannot find react-native-vector-icons package. Make sure it is installed.", process.cwd());
        return;
    }
    filter = typeof filter == "function" ? filter : () => true;
    try {
        const iconSets = {};
        const files = readdirSync(glyphMapsPath);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                let setName = file.replace('.json', '');
                if (setName.endsWith("Pro")) return;
                if (setName.endsWith("Free")) {
                    setName = setName.split("Free")[0].trim();
                }
                if (!(setName in iconSetNames)) return;
                console.log('Processing set:', setName);
                if (filter(setName) && !setName.toLowerCase().endsWith("_meta")) {
                    const icons = extractIconNames(path.join(glyphMapsPath, file));
                    if (!Array.isArray(icons) || !icons.length) return;
                    iconSets[`${setName}`] = icons;
                }
            }
        });

        return iconSets;
    } catch (error) {
        console.error('Error generating icon name arrays:', error);
        return {};
    }
}

module.exports = function generateIconTypes(iconSetsPrefixesOrNames, options) {
    const iconSetsGenerated = iconSetsPrefixesOrNames && typeof iconSetsPrefixesOrNames == "string" ? iconSetsPrefixesOrNames.split(",") : [];
    const outputPathOption = options && typeof options.out == "string" ? path.resolve(options.out) : undefined;
    const packageDir = require("./find-package-dir")('build', 'components', 'Icon');
    const outputPath = outputPathOption ? outputPathOption : packageDir ? path.resolve(packageDir, 'build', 'components', 'Icon', 'font.types.d.ts') : path.resolve(process.cwd(), "fonts.types.ts");
    const iconSets = generateIconSets();
    let generatedIcons = "";
    // Generate the const arrays with the actual icon names
    Object.entries(iconSets).forEach(([setName, iconNames]) => {
        const prefix = iconSetNames[setName];
        if (setName != "MaterialCommunityIcons" && !iconSetsGenerated.includes(setName) && !iconSetsGenerated.includes(setName.toLowerCase()) && (!prefix || !iconSetsGenerated.includes(prefix))) return;
        if (prefix !== undefined) {
            const prefixName = prefix ? `${prefix.replace(/-/g, '')}-` : '';
            generatedIcons += `${iconNames.map(name => `'${prefixName}${name}':''`).join(";")};`;
        }
    });
    const output = `
    import "@resk/nativewind";
    declare module "@resk/nativewind" {
        interface IFontIconNameRegistry {
            ${generatedIcons}
        }   
    }`;
    writeFileSync(outputPath, output, 'utf8');
    console.log("icon types generated at : ", outputPath);
}