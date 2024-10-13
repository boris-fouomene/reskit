// replace-aliases.js
const fs = require('fs');
const path = require('path');

// Function to replace aliases in .d.ts files
function replaceAliasesInDeclarationFiles(directory, aliases,tsConfigPath) {
    const rootDir = process.cwd();
    directory = directory || path.resolve(rootDir,"build");
   if(!aliases){
      tsConfigPath = tsConfigPath || path.resolve(rootDir, 'tsconfig.json');
      // Read the tsconfig.json file
       const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
       // Check if the paths are defined in the tsconfig.json
       aliases = tsConfig.compilerOptions.paths;
   }
   if (!aliases) {
    throw new Error('No paths defined in tsconfig.json');
   }
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceAliasesInDeclarationFiles(filePath, aliases); // Recursively process directories
    } else if (file.endsWith('.d.ts')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      Object.entries(aliases).forEach(([alias, paths]) => {
        const regex = new RegExp(`"${alias.replace('/*', '')}"`, 'g');
        content = content.replace(regex, `"${paths[0].replace('/*', '')}"`); // Replace with the first resolved path
      });
      fs.writeFileSync(filePath, content);
    }
  });
}

replaceAliasesInDeclarationFiles();