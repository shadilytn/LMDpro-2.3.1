import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
        'motion/react',
        'recharts',
        'canvas-confetti',
      ],
    },
    build: {
      outDir: 'dist',
      manifest: true,
      chunkSizeWarningLimit: 1500,
      cssMinify: true,
      rollupOptions: {
        output: {},
      },
    },
    server: {
      cors: {
        origin: (origin, callback) => {
          if (!origin) {
            callback(null, true);
            return;
          }
          try {
            const hostname = new URL(origin).hostname;
            const isAllowed =
              hostname === 'localhost' ||
              hostname === '127.0.0.1' ||
              hostname === 'lmdpro.app' ||
              hostname.endsWith('.lmdpro.app') ||
              hostname.endsWith('.googleusercontent.com') ||
              hostname.endsWith('.run.app') ||
              hostname.endsWith('.google.com') ||
              hostname.endsWith('.aistudio.google');
            if (isAllowed) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          } catch {
            callback(new Error('Invalid Origin'));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        credentials: true
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR === 'true' ? false : {
        clientPort: 443,
        host: 'localhost',
      },
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
