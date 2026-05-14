import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set base to './' so the built app works under any path (GitHub Pages subdir,
  // Netlify root, Vercel root, etc.) without a custom domain config.
  base: './',
});
