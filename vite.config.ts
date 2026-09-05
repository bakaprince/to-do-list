import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
                        icons: ['lucide-react'],
                        motion: ['motion'],
                    },
                },
            },
        },
    };
});
