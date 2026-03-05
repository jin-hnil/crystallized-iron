import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ============================================
    // ⚠️ CHỈ CHO PHÉP TRUY CẬP TỪ LOCALHOST
    // Admin Panel KHÔNG ĐƯỢC expose ra ngoài internet
    // ============================================
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    // Chặn mọi truy cập từ bên ngoài
    cors: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
  },
})
