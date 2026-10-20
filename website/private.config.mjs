import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  resolve: { alias: { '@': path.resolve('src') } },
  build: { outDir: 'dist-private', sourcemap: false, rollupOptions: { input: 'website/private.html' } },
});
