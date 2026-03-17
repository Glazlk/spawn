import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [tsconfigPaths()],
  publicDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@spawn-dev/lib": path.resolve(__dirname, "../lib/src")
    }
  },
  build: {
    target: "node20",
    outDir: "dist",
    sourcemap: true,
    ssr: "src/spawn/main.ts",
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: "src/spawn/main.js",
        inlineDynamicImports: true
      }
    }
  },
  ssr: {
    target: "node"
  }
})
