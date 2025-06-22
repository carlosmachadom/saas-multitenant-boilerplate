import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Configuración base para testing
  'packages/test-utils/vitest.config.ts',
  
  // Configuración para la biblioteca UI
  'packages/ui/vitest.config.ts',
  
  // Configuración para web-admin
  'apps/web-admin/vitest.config.ts',
  
  // Configuración para web-tenant
  'apps/web-tenant/vitest.config.ts',
]);
