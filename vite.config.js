import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default {
  base: '/CSE442/2024-Fall/cse-442y/', // Set the correct base URL for assets
  plugins: [react()],
};

