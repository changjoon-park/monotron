import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config.mjs";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { purgeCss } from "vite-plugin-tailwind-purgecss";

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
    plugins: [
      svelte({
        preprocess: vitePreprocess(),
      }),
      // purgeCss(),
      pluginExposeRenderer(name),
    ],
    css: {
      postcss: "./postcss.config.cjs",
    },
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  };
});
