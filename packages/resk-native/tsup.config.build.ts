import createConfig from "../../tsup";

export default [
    createConfig("build", {
        external: ["@resk/core", "node_modules"],
        format: ["esm"],
        /* esbuildOptions(options) {
            options.outExtension = { '.js': '.js' }; // Ensure .js extension is used instead of .mjs
        }, */
    })
];