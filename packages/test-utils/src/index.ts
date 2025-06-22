/**
 * @workspace/test-utils
 * 
 * Utilidades básicas para testing en el proyecto auto-vendi
 * 
 * Este paquete proporciona una base para escribir tests con Vitest
 * y React Testing Library de manera consistente en todo el monorepo.
 */

// Re-exportamos las utilidades de testing que usaremos en el proyecto
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
