import { defineConfig } from "vite";

export default defineConfig({
    root: "src",
    base: "./",
    server: { port: 8000 },
    build: { outDir: "../build", emptyOutDir: true },
});
