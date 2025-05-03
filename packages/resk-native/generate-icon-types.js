// icon-autocomplete.ts
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve as pathResolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/***
 * all supported icons
 */
const iconSetNames = {
    "AntDesign": "antd",
    //"Entypo",
    //"EvilIcons",
    //"Feather",
    //"FontAwesome",
    "FontAwesome5": "fa5",
    "FontAwesome6": "fa6",
    //"Fontisto",
    "Foundation": "foundation",
    "Ionicons": "ionic",
    "MaterialCommunityIcons": "",
    "MaterialIcons": "material",
    "Octicons": "octicons",
    //"SimpleLineIcons",
    //"Zocial"   
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
    try {
        // This should resolve to the installed package path
        const iconPackagePath = pathResolve(__dirname, '../../node_modules/react-native-vector-icons/package.json');
        console.log('Icon package path:', iconPackagePath);
        return join(iconPackagePath, '..');
    } catch (error) {
        throw new Error('Cannot find react-native-vector-icons package. Make sure it is installed.');
    }
}

// Dynamically generate the icon name arrays from the installed package
function generateIconNameArrays(filter) {
    const iconsPath = findIconsPath();
    const glyphMapsPath = join(iconsPath, 'glyphmaps');
    filter = typeof filter == "function" ? filter : () => true;
    try {
        const iconSets = {};
        const files = readdirSync(glyphMapsPath);
        files.forEach(file => {
            if (file.endsWith('.json')) {
                let setName = file.replace('.json', '');
                if (setName.endsWith("Pro") || !(setName in iconSetNames)) return;
                if (setName.endsWith("Free")) {
                    setName = setName.split("Free")[0].trim();
                }
                console.log('Processing set:', setName);
                if (filter(setName) && !setName.toLowerCase().endsWith("_meta")) {
                    const icons = extractIconNames(join(glyphMapsPath, file));
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

// This function generates a type definition file with the actual icon names
export function generateTypeDefinitions() {
    const iconSets = generateIconNameArrays();

    let output = '// Auto-generated type definitions for react-native-vector-icons\n\n';

    // Generate the const arrays with the actual icon names
    Object.entries(iconSets).forEach(([setName, iconNames]) => {
        const prefix = iconSetNames[setName];
        if (prefix !== undefined) {
            const prefixName = prefix ? `${prefix.replace(/-/g, '')}-` : '';
            output += `export type IFontIcon${setName} = ${iconNames.map(name => `'${prefixName}${name}'`).join(' | ')};\n\n`;
        }
    });

    // Generate the IconSets interface
    output += 'export interface IFontIconSetsNames {\n';
    const allIconNames = Object.keys(iconSets);
    allIconNames.forEach(setName => {
        //output += `  ${iconSetName}: IconNames<typeof ${setName}[number]>;\n`;
        output += `  ${setName}: IFontIcon${setName};\n`;
    });
    output += '}\n\n';

    // Generate the IconSets interface
    output += 'export interface IFontIconSetsPrefixes {\n';
    Object.keys(iconSetNames).forEach(setName => {
        output += `  ${setName}: '${iconSetNames[setName]}';\n`;
    });
    output += '}\n\n';

    output += `
    /**
     * @typedef IFontIconName - The name of the font icon.
     * The name of the icon to display (including the prefix for icon set if necessary).
     * 
     * This property specifies which icon to render. It accepts a variety of icon
     * names from different icon sets, ensuring that only valid names are passed.
     * The name must correspond to one of the defined types for the various icon sets
     * (e.g., MaterialCommunityIcons, AntDesign, etc.).
     * 
     * @example
     * // Valid icon names
     * const name: IFontIconName = "home"; // From MaterialCommunityIcons
     * const nameAnt: IFontIconName = "antd-home"; // From AntDesign
     * const nameFa5: IFontIconName = "fa5-home"; // From FontAwesome5
     * const nameFa6: IFontIconName = "fa6-home"; // From FontAwesome6
     * const nameFeather: IFontIconName = "feather-home"; // From Feather
     * const nameFoundation: IFontIconName = "foundation-home"; // From Foundation
     * const nameIonicons: IFontIconName = "ionicons-home"; // From Ionicons
     * const nameOcticons: IFontIconName = "octicons-home"; // From Octicons
     * const nameMaterialIcons: IFontIconName = "material-home"; // From MaterialIcons
     */
    export type IFontIconName = ${allIconNames.map(name => `IFontIcon${name}`).join(' | ')}\n\n`;
    return output;
}
// Generate the types
const typeDefinitions = generateTypeDefinitions();

// Write to a file
const outputPath = join(__dirname, 'src', 'components', 'ICon', 'icon-types.ts');
writeFileSync(outputPath, typeDefinitions, 'utf8');