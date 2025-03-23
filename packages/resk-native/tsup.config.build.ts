import createConfig from "../../tsup";
import glob from "fast-glob";

export default [
    createConfig("build", {
        entry: glob.sync("./src/**/*.(ts|tsx|js|jsx|json)"),
        external: ["@resk/core", "node_modules"],
        format: ["esm"],
        esbuildOptions(options) {
            options.outExtension = { '.js': '.js' }; // Ensure .js extension is used instead of .mjs
        },
    })
];