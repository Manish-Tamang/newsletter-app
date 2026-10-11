// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      postcss: {
        plugins: [],
      },
    },
    plugins: [tailwindcss()],
  },
});
