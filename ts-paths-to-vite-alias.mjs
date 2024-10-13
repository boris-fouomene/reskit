import * as  fs from "fs";
import * as path from "path";

// Function to read tsconfig.json and convert paths to Vite aliases
export default function convertTsConfigPathsToViteAliases(tsConfigPath = path.resolve(__dirname, 'tsconfig.json')) {
    // Read the tsconfig.json file
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
  
    // Check if the paths are defined in the tsconfig.json
    const paths = tsConfig.compilerOptions.paths;
    if (!paths) {
      throw new Error('No paths defined in tsconfig.json');
    }
  
    // Convert TypeScript paths to Vite aliases
    const aliases = {};
    for (const [alias, pathsArray] of Object.entries(paths)) {
      if(Array.isArray(pathsArray) && typeof alias ==="string"){
        // Use the first path in the array to resolve the directory
        const resolvedPath = path.resolve(__dirname, pathsArray[0].replace('/*', ''));
        aliases[alias.replace('/*', '')] = resolvedPath;
      }
    }
    return aliases;
  }

  