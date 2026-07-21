import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://<user>.github.io/en-jp-learn/
export default defineConfig({
  plugins: [react()],
  base: '/en-jp-learn/',
})
