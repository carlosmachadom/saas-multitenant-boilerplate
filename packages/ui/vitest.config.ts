import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      // Tests co-localizados con el código
      'src/**/*.{test,spec}.{ts,tsx}',
      // Tests en carpeta __tests__
      '__tests__/**/*.{test,spec}.{ts,tsx}'
    ],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
