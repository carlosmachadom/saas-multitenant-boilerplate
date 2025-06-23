# Paquete de Base de Datos (@workspace/database)

Este paquete es el **punto centralizado** para toda la interacción con la base de datos en el ecosistema Auto-Vendi. Su objetivo es abstraer la lógica de conexión, configuración y acceso a los datos, proporcionando una interfaz consistente para los demás servicios, principalmente la API.

---

## ❗ Requisito de Compilación

**¡Importante!** Este es un paquete de TypeScript y no puede ser consumido directamente en su formato `.ts`. Debe ser **compilado a JavaScript** antes de que cualquier otro paquete (como `@workspace/api`) pueda utilizarlo.

El proceso de compilación es manejado automáticamente por **Turborepo**. Cuando ejecutas un comando como `pnpm dev` o `pnpm build` desde la raíz del proyecto, Turborepo detecta que la API depende de este paquete y se asegura de compilar `@workspace/database` primero.

-   **Para desarrollo:** El script `dev` (`tsc --watch`) recompila automáticamente los archivos cuando detecta cambios.
-   **Para producción:** El script `build` (`tsc`) genera una única versión de los archivos en la carpeta `dist/`.

---

## 🛠️ Implementación Actual

Actualmente, el paquete está configurado para usar:

-   **ORM:** [TypeORM](https://typeorm.io/)
-   **Driver de Base de Datos:** [node-postgres (pg)](https://node-postgres.com/)

La configuración de la conexión se gestiona a través de variables de entorno, y aquí se definen todas las entidades de la base de datos.

## 🔮 Visión a Futuro

Aunque la implementación actual se basa en TypeORM, este paquete está diseñado con una visión modular. En el futuro, podría extenderse para incluir:

-   Otros ORMs (como Prisma).
-   Clientes de consulta directa (Query Builders como Kysely).
-   Conexiones a otras bases de datos si fuera necesario.

El objetivo es que los servicios que consumen este paquete no necesiten conocer los detalles de la implementación subyacente.

---

## 🚀 Cómo Usar el Paquete

Para utilizar la conexión a la base de datos desde otro servicio (por ejemplo, la API), simplemente importa las entidades o la fuente de datos exportada desde `@workspace/database`.

### Ejemplo de Uso en la API

```typescript
// En un servicio de la API:
// apps/api/src/users/users.service.ts

import { AppDataSource } from "@workspace/database";
import { User } from "@workspace/database/entities/User";

export class UsersService {
  private userRepository = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // ... otros métodos del servicio
}
```
