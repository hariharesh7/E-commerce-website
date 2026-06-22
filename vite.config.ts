import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Keep HMR enabled by default, but allow it to be disabled when needed.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable filesystem watching when HMR is disabled.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
