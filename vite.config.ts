import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [ nodePolyfills(), react({
    babel: {
      presets: ['jotai/babel/preset'],
    },
  }),],
  envPrefix: ['VITE_', 'TAURI_'],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
