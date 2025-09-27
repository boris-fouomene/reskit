import { execSync } from "child_process";
import glob from "fast-glob";
import { replaceTscAliasPaths } from "tsc-alias";
import { Options } from "tsup";

export default function createConfig(
  type?: "build" | "test" | "dts",
  options?: Options
): Options {
  options = Object.assign({}, options);
  const isTest = type === "test";
  return {
    entry: glob.sync(
      `./src/**/${!isTest ? "!(*.d|*.spec|*.test)" : "*"}.(ts|tsx|js|jsx)`
    ),
    format: ["cjs", "esm"], // isTest ? ["cjs"] : ["cjs", "esm"],
    outDir: "./build",
    splitting: false, // Avoid splitting to keep module references simple
    sourcemap: false,
    clean: true, // Clears dist before building
    dts: false,
    minify: true, // Optimizes performance
    target: "es2015",
    treeshake: true,
    bundle: false, // ❌ Disable bundling to keep file structure
    external: ["node_modules"], // Prevent bundling external dependencies
    cjsInterop: true, // Enable CJS interop for better compatibility
    legacyOutput: true, // Add explicit file extensions to resolved imports
    banner: {
      js: "Object.defineProperty(exports, '__esModule', { value: true });",
    },
    async onSuccess() {
      console.log(
        "Running tsc-alias after the build to resolve the path aliases"
      );
      replaceTscAliasPaths({
        //configFile: isTest ? "tsconfig.test.json" : "tsconfig.json",
        outDir: isTest ? "./dist" : "./build",
      });
      if (!isTest) {
        execSync("npm run build-dts", { stdio: "inherit" });
      }
      if (typeof options?.onSuccess == "function") {
        options.onSuccess();
      }
    },
    ...options,
  };
}
