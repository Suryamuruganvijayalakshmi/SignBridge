import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: resolve(import.meta.dirname, 'index.html')
            }
        }
    },
    esbuild: {
        target: 'esnext',
        supported: {
            'top-level-await': true
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext',
            supported: {
                'top-level-await': true
            }
        }
    }
});