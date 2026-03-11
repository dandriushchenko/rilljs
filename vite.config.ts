import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

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
                        entry: resolve(__dirname, 'src/index.ts'),
                        name: 'RillJS',
                        fileName: (format) => `rilljs.${format}.js`,
                    },
                    rollupOptions: {
                        external: [
                            'react',
                            'react-dom',
                            'react/jsx-runtime',
                            'react/jsx-dev-runtime'
                        ],
                        output: {
                            globals: {
                                react: 'React',
                                'react-dom': 'ReactDOM',
                                'react/jsx-runtime': 'jsxRuntime',
                                'react/jsx-dev-runtime': 'jsxDevRuntime',
                            },
                        },
                    },
                }),
        },
    };
});
