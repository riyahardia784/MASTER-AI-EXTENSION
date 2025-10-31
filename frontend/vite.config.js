import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { crx } from '@crxjs/vite-plugin'
import manifest from '../manifest.json'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    outDir:'dist' ,
  },
 
  server: {
    cors: {
      origin: 'chrome-extension://glmamjljgaogipiokepbocldkenmgknk', // Use your actual extension ID
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true, // Set to true if your extension needs to send cookies/auth headers
    },
    // Ensure the port is correct if you're explicitly setting it
    port: 5173,

     hmr: {
      // You can try setting the HMR host and protocol
      // This is helpful in containerized or proxied environments
      host: 'localhost', // Or your specific local IP address
      protocol: 'ws', // 'ws' for http, 'wss' for https
    }
  },


})
