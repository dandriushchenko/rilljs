import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const isDemo = mode === 'demo';

  return {
    base: isDemo ? '/rilljs/' : '/',
    plugins: [react(), ...(!isDemo ? [dts({ tsconfigPath: './tsconfig.app.json', rollupTypes: true })] : [])],
    build: {
      outDir: isDemo ? 'dist-demo' : 'dist',
      ...(isDemo
        ? {}
        : {
            lib: {
              entry: resolve(import.meta.dirname, 'src/index.ts'),
              formats: ['es'],
              fileName: 'rilljs.es',
            },
            rollupOptions: {
              external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
              output: {
                assetFileNames: (assetInfo) => {
                  if (assetInfo.names.some((n) => n.endsWith('.css'))) {
                    return 'styles/theme.css';
                  }
                  return assetInfo.names[0] ?? 'assets/[name]-[hash][extname]';
                },
              },
            },
          }),
    },
  };
});
