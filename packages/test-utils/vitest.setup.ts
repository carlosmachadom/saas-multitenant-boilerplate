/**
 * Configuración global para los tests de Vitest
 */
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Limpieza automática después de cada test
afterEach(() => {
  cleanup();
});
