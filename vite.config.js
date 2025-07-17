import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';

export default defineConfig({
    build: {
        emptyOutDir: true
    },
    plugins: [
        injectHTML(),
    ],
});
