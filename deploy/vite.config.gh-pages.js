import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
    base: '/github-profile-header-generator/',
    build: {
        emptyOutDir: true
    },
    plugins: [
        injectHTML(),
    ],
});
