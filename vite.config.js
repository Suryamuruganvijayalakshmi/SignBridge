import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-404-fallback',
      closeBundle() {
        try {
          const distDir = path.resolve(__dirname, 'dist');
          const indexPath = path.join(distDir, 'index.html');
          const fallbackPath = path.join(distDir, '404.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, fallbackPath);
          }
        } catch (e) {
          // ignore error if dist is not yet created
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
  },
});
