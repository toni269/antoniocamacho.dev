import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Content is deployment-versioned: static output needs no server adapter or runtime binding.
export default defineConfig({
  output: 'static',
  vite: { preview: { strictPort: true }, plugins: [tailwindcss()] },
});
