import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      '5173-lennoxgonz-recipeforge-itafz2wr7ck.ws-us117.gitpod.io',
      '.gitpod.io'  // This will allow all Gitpod workspaces
    ]
  }
})
