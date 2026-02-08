import { defineConfig } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { version } from "./package.json";

export default defineConfig({
  base: "/", // ✅ Vercel ke liye
  plugins: [
    svelte({
      preprocess: vitePreprocess()
    })
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: `[name]-v${version}.[ext]`,
        entryFileNames: `[name]-v${version}.js`,
      }
    }
  }
});
