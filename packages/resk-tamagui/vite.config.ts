import react from '@vitejs/plugin-react-swc'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import * as path from "path";
//import tsconfigPaths from 'vite-tsconfig-paths';

export default {
    //root: './App', // Root directory where index.html or entry file is located
    plugins: [
        react(),
        tamaguiPlugin({
            // points to your tamagui config file
            config: './tamagui.config.ts',
            // points to any linked packages or node_modules
            // that have tamagui components to optimize
            components: ['tamagui'],
            // turns on the optimizing compiler
            optimize: true,
        }),
        //tsconfigPaths()  // This plugin automatically reads your tsconfig.json for paths
    ].filter(Boolean),
    define: {
        'process.env': {},
    },
    optimizeDeps: {
        include: ['@tamagui/core'],
    },
    build: {
        outDir: '../dist', // Output folder for the build files
        rollupOptions: {
            input: path.resolve(__dirname, 'App.tsx'), // Path to your App.tsx entry point
        },
    },
    resolve: {
        alias: {
            '@resk-core': path.resolve(__dirname, '..', 'resk-core', "build", "src", "index"), // alias '@' to 'src'
            '@components': path.resolve(__dirname, 'src/components'), // alias '@components' to 'src/components'
            '@utils': path.resolve(__dirname, 'src/utils'), // alias '@utils' to 'src/utils'
        },
    },
}