# @workspace/test-utils

Este paquete proporciona utilidades básicas para testing en el proyecto auto-vendi, facilitando la escritura de tests consistentes en todo el monorepo.

## Propósito

El paquete `@workspace/test-utils` tiene como objetivo:

1. **Centralizar configuración de testing**: Proporcionar una configuración base para Vitest que pueda ser utilizada en todas las aplicaciones y paquetes del monorepo.

2. **Simplificar importaciones**: Re-exportar utilidades comunes de testing para que no sea necesario instalar y configurar múltiples paquetes en cada aplicación.

3. **Mantener consistencia**: Asegurar que todos los tests del proyecto sigan las mismas prácticas y patrones.

## Instalación

Para usar este paquete en una aplicación o paquete del monorepo:

```json
// En package.json de la aplicación o paquete
{
  "devDependencies": {
    "@workspace/test-utils": "workspace:*"
  }
}
```

## Uso

```typescript
// En tus archivos de test
import { render, screen, userEvent } from '@workspace/test-utils';

describe('Mi componente', () => {
  it('debería renderizar correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });

  it('debería responder a interacciones de usuario', async () => {
    render(<MiComponente />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Resultado esperado')).toBeInTheDocument();
  });
});
```

## Configuración de Vitest

Para usar la configuración base de Vitest en tu aplicación o paquete, crea un archivo `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: [
      // Aquí puedes añadir archivos de setup específicos para tu aplicación
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
  },
});
```

## Extensión

Este paquete está diseñado para ser mínimo y extensible. Puedes añadir más utilidades según las necesidades del proyecto, como:

- Mocks comunes
- Utilidades para renderizar componentes con providers
- Helpers para testing de APIs
- Configuración para MSW (Mock Service Worker)
