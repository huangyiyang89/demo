import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/stream': {
        target: 'ws://localhost:8000', // 目标WebSocket服务器地址
        changeOrigin: true,
        ws: true, // 确保这是一个WebSocket代理
      },
    }
  },
})
