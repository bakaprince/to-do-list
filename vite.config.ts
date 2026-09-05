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
        server: {
            host: '0.0.0.0',
            allowedHosts: ['baka-list.onrender.com'],
        },
        preview: {
            host: '0.0.0.0',
            allowedHosts: ['baka-list.onrender.com'],
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
