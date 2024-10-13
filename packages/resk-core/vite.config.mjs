import { defineConfig } from 'vite';
import path, { resolve } from 'path';
import convertTsConfigPathsToViteAliases from '../../ts-paths-to-vite-alias.mjs';

//const aliases = convertTsConfigPathsToViteAliases(path.resolve(__dirname,"tsconfig.json"));
//console.log(aliases," are aliases");

export default defineConfig({  
  resolve: {
    alias: {
      '@models': resolve(__dirname, './src/models'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  build: {
    outDir: 'build',  // Output directory for your build
    sourcemap: true, // Enable source maps
  },
});
