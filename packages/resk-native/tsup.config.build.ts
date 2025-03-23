import createConfig from "../../tsup";

const config = createConfig("build", {
    external: ["@resk/core", "node_modules"],
});
export default [
    config
];
console.log(config, " is dddddddddddddddddddddddddddddd")