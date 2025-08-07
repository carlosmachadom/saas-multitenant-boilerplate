# 03. Flujo de Trabajo con Git y Convenciones

Este documento describe el flujo de trabajo de Git y las convenciones de nomenclatura de ramas para el monorepo de Auto-Vendi. Seguir estas directrices es fundamental para mantener un historial de código limpio, legible y fácil de gestionar.

## Modelo de Ramas: GitFlow

Utilizamos una versión simplificada de [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/), que se basa en dos ramas principales con una vida infinita:

-   `main`: Esta rama contiene el código que está en producción. Es estable y está siempre lista para ser desplegada. Solo se fusiona desde ramas `release` o `hotfix`.
-   `develop`: Es la rama principal de desarrollo. Contiene los últimos cambios y funcionalidades entregadas. Todo el desarrollo nuevo parte de esta rama y se fusiona de nuevo en ella a través de Pull Requests.

## Convención para Nombres de Ramas

Para mantener la claridad en un monorepo, todas las ramas de funcionalidades, arreglos o tareas deben seguir una estructura específica. Esto nos permite identificar rápidamente el propósito y el alcance de cada rama.

### Estructura

```
tipo/alcance/descripcion-corta-en-kebab-case
```

#### 1. `tipo`

Describe la naturaleza del cambio. Debe ser uno de los siguientes:

-   **feat**: Para una nueva funcionalidad (feature).
-   **fix**: Para la corrección de un bug.
-   **chore**: Tareas de mantenimiento (actualizar dependencias, CI/CD, etc.).
-   **refactor**: Cambios en el código que mejoran la estructura pero no alteran la funcionalidad.
-   **docs**: Cambios exclusivos en la documentación.
-   **style**: Cambios de formato o estilo en el código (linting).
-   **test**: Añadir o corregir tests.

#### 2. `alcance` (Scope)

Indica la aplicación o paquete principal afectado por el cambio. Utiliza los nombres de los directorios en `apps/` y `packages/`:

-   `api`
-   `web-admin`
-   `web-tenant`
-   `database`
-   `ui`
-   `docs`
-   `repo` (para cambios en la raíz del proyecto, como `turbo.json` o `package.json`).

#### 3. `descripcion-corta-en-kebab-case`

Un resumen breve y descriptivo de la tarea, en minúsculas y con palabras separadas por guiones.

### Ejemplos

-   `feat/api/agregar-endpoint-de-usuarios`
-   `fix/web-admin/corregir-autenticacion-fallida`
-   `refactor/database/optimizar-pool-de-conexiones`
-   `chore/repo/actualizar-dependencias-pnpm`
-   `docs/repo/crear-guia-de-despliegue`

## Flujo de Trabajo Paso a Paso

1.  **Sincronizar `develop`:** Antes de empezar cualquier tarea, asegúrate de tener la última versión de la rama `develop`.

    ```bash
    git checkout develop
    git pull origin develop
    ```

2.  **Crear una nueva rama:** Crea tu rama a partir de `develop` usando la convención definida.

    ```bash
    # Ejemplo para una nueva funcionalidad en la API
    git checkout -b feat/api/crear-perfil-de-cliente
    ```

3.  **Desarrollar y Hacer Commits:** Trabaja en tu tarea. Es una buena práctica seguir una convención similar para los mensajes de tus commits (ver [Conventional Commits](https://www.conventionalcommits.org/)).

    ```bash
    git add .
    git commit -m "feat(api): agrega el endpoint para crear perfiles"
    ```

4.  **Subir la Rama:** Sube tu rama al repositorio remoto.

    ```bash
    git push -u origin feat/api/crear-perfil-de-cliente
    ```

5.  **Crear un Pull Request (PR):** Ve a GitHub (o la plataforma que uses) y abre un nuevo Pull Request desde tu rama hacia `develop`.

    -   Asegúrate de que el título y la descripción del PR sean claros.
    -   Espera a que las comprobaciones automáticas (CI) pasen.
    -   Asigna a uno o más compañeros para que revisen tu código.

6.  **Fusionar el PR:** Una vez que el PR sea aprobado y todas las comprobaciones sean exitosas, el encargado del repositorio (o tú mismo, si tienes permisos) fusionará la rama en `develop`.

## Ramas de Release y Hotfix

-   **Release (`release/v1.2.0`):** Cuando `develop` tiene suficientes funcionalidades para un nuevo lanzamiento, se crea una rama `release`. En esta rama se realizan los últimos ajustes. Una vez estabilizada, se fusiona a `main` (con un tag) y también de vuelta a `develop`.

-   **Hotfix (`hotfix/corregir-error-critico`):** Si se encuentra un bug crítico en producción (`main`), se crea una rama `hotfix` a partir de `main`. Una vez solucionado, se fusiona de vuelta tanto a `main` como a `develop` para asegurar que el arreglo no se pierda en el siguiente ciclo de desarrollo.
