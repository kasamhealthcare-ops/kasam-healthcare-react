import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'animation-vendor': ['framer-motion', 'react-intersection-observer'],
          'icons-vendor': ['lucide-react'],
          'utils-vendor': ['axios', 'js-cookie']
        }
      }
    },
    // Enable minification
    minify: 'terser',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      overlay: false // Disable error overlay for better performance
    }
  },
  preview: {
    port: 5173,
    host: true,
    strictPort: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'axios'
    ]
  }
})
