import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config.mjs";
import { sveltekit } from "@sveltejs/kit/vite";

import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Define your SvelteKit config
const svelteConfig = {
  extensions: [".svelte"],
  preprocess: [vitePreprocess()],
  kit: {
    adapter: adapter(),
  },
};

// https://vitejs.dev/config
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'renderer'>} */
  const forgeEnv = env;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  /** @type {import('vite').UserConfig} */
  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [sveltekit(svelteConfig), pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  };
});
