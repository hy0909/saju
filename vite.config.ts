import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174 // 기존 프로젝트와 다른 포트 사용
  }
}) 