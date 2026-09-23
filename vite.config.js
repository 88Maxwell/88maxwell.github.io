import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const at = (path) => resolve(import.meta.dirname, path);

export default defineConfig({
    root: "src",
    base: "./",
    server: { port: 8000 },
    build: {
        outDir: "../build",
        emptyOutDir: true,
        rollupOptions: { input: { en: at("src/index.html"), uk: at("src/uk/index.html") } },
    },
    plugins: [
        {
            // Give every deploy its own service worker cache, so visitors never get a stale page
            name: "sw-cache-version",
            apply: "build",
            closeBundle() {
                const file = at("build/pwabuilder-sw.js");
                writeFileSync(file, readFileSync(file, "utf8").replace("__BUILD__", Date.now()));
            },
        },
    ],
});
