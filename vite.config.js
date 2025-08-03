import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
    build: {
        emptyOutDir: true
    },
    plugins: [
        injectHTML(),
    ],
});
