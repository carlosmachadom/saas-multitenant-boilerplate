# Paquete de UI (@workspace/ui)

Este paquete contiene todos los componentes de UI compartidos del ecosistema Auto-Vendi. El objetivo es mantener una interfaz de usuario consistente, reutilizable y fácil de mantener en todas las aplicaciones (`web-admin`, `web-tenant`).

---

## 📂 Estructura de Componentes

La carpeta `src/components` está organizada en dos directorios con propósitos muy diferentes:

-   `shadcn-ui/`: Contiene los componentes **primitivos y sin estilo** directamente instalados desde **[Shadcn UI](https://ui.shadcn.com/)**. Estos son los bloques de construcción básicos (ej: `Button`, `Input`, `Card`). No debes modificar estos componentes directamente.

-   `custom-ui/`: Contiene los **componentes compuestos y reutilizables** que construyes para tu aplicación. Estos componentes combinan los primitivos de `shadcn-ui` para crear abstracciones con lógica de negocio o de presentación específica (ej: `UserForm`, `ProductCard`, `PageHeader`).

**Regla de oro:** Siempre que necesites un componente nuevo y específico para la aplicación, créalo en `custom-ui` componiendo los elementos de `shadcn-ui`.

---

## 🎨 Cómo Añadir Nuevos Componentes Primitivos

Si necesitas un bloque de construcción que no existe actualmente, puedes añadirlo desde Shadcn UI ejecutando el siguiente comando desde la **raíz del monorepo**:

```bash
# Sintaxis
pnpm dlx shadcn-ui@latest add <nombre-del-componente> --cwd packages/ui

# Ejemplo: Añadir un Avatar
pnpm dlx shadcn-ui@latest add avatar --cwd packages/ui
```

El nuevo componente se instalará automáticamente en `packages/ui/src/components/shadcn-ui`.

---

## 🚀 Cómo Usar los Componentes

Gracias al alias `@workspace/ui` configurado en `tsconfig.json`, puedes importar y usar cualquier componente fácilmente.

### Ejemplo de Uso

```tsx
// En un archivo de componente de web-admin, por ejemplo:
// apps/web-admin/src/app/page.tsx

// Importando un componente primitivo
import { Button } from "@workspace/ui/components/shadcn-ui/button";
// Importando un componente de negocio
import { PageHeader } from "@workspace/ui/components/custom-ui/PageHeader";

export default function Page() {
  return (
    <div>
      <PageHeader title="Panel de Administración" />
      <Button>Guardar Cambios</Button>
    </div>
  );
}
```
