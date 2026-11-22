import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Builds src/content-script.ts into a single embeddable file: dist/deploy.js
export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: false, // keep the regular app build output in dist
        minify: false,
        sourcemap: false,
        lib: {
            entry: fileURLToPath(new URL("./src/content-script.ts", import.meta.url)),
            formats: ["iife"],
            name: "CHSpyContentScript",
            fileName: () => "deploy.js",
        },
    },
});
