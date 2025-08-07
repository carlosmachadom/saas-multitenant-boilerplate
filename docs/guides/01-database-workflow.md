# Guía de Desarrollo: Base de Datos

Este documento explica el flujo de trabajo para gestionar la base de datos en el entorno de desarrollo, incluyendo migraciones y seeding.

## Tabla de Contenidos
- [1. Visión General](#1-visión-general)
- [2. Comandos Disponibles](#2-comandos-disponibles)
- [3. Flujo de Trabajo de Desarrollo](#3-flujo-de-trabajo-de-desarrollo)
- [4. Flujo de Trabajo en Producción](#4-flujo-de-trabajo-en-producción)
- [5. Estructura de la Base de Datos](#5-estructura-de-la-base-de-datos)
- [6. Solución de Problemas](#6-solución-de-problemas)

## 1. Visión General

El sistema de base de datos utiliza una arquitectura multi-tenant con los siguientes componentes principales:

- **Esquema Admin**: Datos globales del sistema y configuración
- **Tenant Template**: Plantilla base para los esquemas de tenant
- **Tenants**: Esquemas individuales para cada cliente/tenant

## 2. Comandos Disponibles

### Migraciones

#### Generación de Migraciones
```bash
# Generar nueva migración (siempre usar tenant_template para desarrollo)
pnpm --filter @workspace/database db:migration:generate tenant <NombreDeLaMigracion>
```

> **Nota importante sobre generación de migraciones:**
> - Siempre genera migraciones usando el esquema `tenant_template` para desarrollo.
> - Las migraciones generadas se aplicarán automáticamente a todos los tenants, incluyendo el template.
> - Para evitar acumulación de migraciones en un solo archivo, asegúrate de ejecutar las migraciones existentes antes de generar una nueva.

#### Ejecución de Migraciones
```bash
# Ejecutar migraciones para todos los esquemas (desarrollo local)
pnpm --filter @workspace/database db:migration:run

# Ejecutar migraciones para un esquema específico
pnpm --filter @workspace/database db:migration:run admin
pnpm --filter @workspace/database db:migration:run tenant [tenant_id]
```

> **Nota sobre ejecución de migraciones:**
> - Puedes ejecutar migraciones tanto en el `tenant_template` como en tenants específicos según sea necesario.
> - Las migraciones se aplican individualmente por esquema, permitiendo control sobre qué cambios se aplican a cada tenant.

### Seeding
```bash
# Ejecutar todos los seeds (admin + tenant template)
pnpm --filter @workspace/database db:seed

# Ejecutar seeds de admin
pnpm --filter @workspace/database db:seed admin

# Ejecutar seeds para un tenant específico
pnpm --filter @workspace/database db:seed tenant [tenant_id]
```

## 3. Flujo de Trabajo de Desarrollo

### Configuración Inicial
1. Asegúrate de que los servicios de base de datos estén en ejecución:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
   ```

   La inicialización de la base de datos se maneja automáticamente a través del contenedor de inicialización.

### Desarrollo de Nuevas Características
1. **Antes de generar una nueva migración**, asegúrate de que todas las migraciones existentes estén aplicadas:
   ```bash
   pnpm --filter @workspace/database db:migration:run
   ```

2. Crea una nueva migración cuando modifiques tus entidades (siempre usando tenant_template):
   ```bash
   pnpm --filter @workspace/database db:migration:generate tenant AddNewFeature
   ```

3. Verifica que la migración se haya generado correctamente en `src/devops/migrations/tenant/`

4. Si necesitas datos de prueba, ejecuta los seeds:
   ```bash
   # Para el tenant_template
   pnpm --filter @workspace/database db:seed tenant
   
   # Para un tenant específico
   pnpm --filter @workspace/database db:seed tenant mi_tenant_especifico
   ```

> **Flujo recomendado para migraciones:**
> 1. Asegúrate de tener la base de datos limpia y actualizada
> 2. Ejecuta todas las migraciones existentes
> 3. Realiza cambios en tus entidades
> 4. Genera una nueva migración
> 5. Verifica que todo funcione correctamente

## 4. Estructura de la Base de Datos

```
database/
├── scripts/
│   ├── generate-migration.sh    # Script de generación de migraciones
│   ├── run-migrations.sh   # Script de migraciones
│   └── seed-database.sh    # Script de seeding
└── src/
    └── devops/
        ├── migrations/     # Migraciones
        │   ├── admin/      # Migraciones para el esquema admin
        │   └── tenant/     # Migraciones para los esquemas tenant
        └── seeds/          # Scripts de seeding
```

## 5. Solución de Problemas

### Error al conectar a la base de datos
- Verifica que el servicio de base de datos esté en ejecución
- Asegúrate de que las variables de entorno estén configuradas correctamente

### Error en migraciones
- Si una migración falla, revisa los logs para identificar el problema
- Las migraciones fallidas dejan la base de datos en un estado inconsistente
- Puedes corregir el problema manualmente o restaurar desde un backup

### Reiniciar el entorno de desarrollo
```bash
# Detener los contenedores
docker-compose down

# Eliminar volúmenes (¡cuidado, esto borrará todos los datos!)
docker volume prune

# Iniciar de nuevo
docker-compose up -d
```

La base de datos se inicializará automáticamente a través del contenedor de inicialización.
