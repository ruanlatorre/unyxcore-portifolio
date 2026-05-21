import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Essencial para rotas aninhadas funcionarem (ex: /admin/cadastrar-venda)
  build: {
    sourcemap: false,
    outDir: 'dist', // Diretório padrão do Vite que o Vercel vai ler
  },
  server: {
    port: 5173,
  }
})
