import { defineConfig, loadEnv } from 'vite';

export default defineConfig(async ({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  const tsconfigPaths = await import('vite-tsconfig-paths')
  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [tsconfigPaths.default()],
    globals: true, // Enables global `describe`, `test`, etc.
    environment: 'node', // Change to 'jsdom' if testing browser-like environments
    test: {
      //include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  }
});