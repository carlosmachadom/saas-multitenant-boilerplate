# Guía de Desarrollo Local

Este documento proporciona una guía paso a paso para configurar y ejecutar el proyecto Auto-Vendi en un entorno de desarrollo local.

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu sistema:

-   **Node.js:** Se recomienda la versión 18 o superior. Puedes verificar tu versión con `node -v`.
-   **pnpm:** Es el gestor de paquetes utilizado en este monorepo. Si no lo tienes, instálalo con `npm install -g pnpm`.
-   **Docker y Docker Compose:** Son esenciales para orquestar los servicios contenerizados. [Instrucciones de instalación de Docker](https://docs.docker.com/get-docker/).

## 2. Configuración Inicial

Sigue estos pasos para preparar el proyecto después de clonarlo.

### a. Clona el Repositorio

Si aún no lo has hecho, clona el repositorio en tu máquina local:

```bash
git clone <URL-DEL-REPOSITORIO>
cd auto-vendi
```

### b. Instala las Dependencias

Usa `pnpm` para instalar todas las dependencias del monorepo. Este comando leerá el archivo `pnpm-workspace.yaml` y enlazará los paquetes locales correctamente.

```bash
pnpm install
```

### c. Configura las Variables de Entorno

Las variables de entorno, que contienen secretos y configuraciones específicas de la máquina, no se incluyen en Git. Debes crearlas a partir de las plantillas de ejemplo.

1.  **Copia la carpeta de ejemplos:**
    ```bash
    cp -r env.example/ env/
    ```

2.  **Rellena los valores:**
    Abre cada uno de los archivos `.env` que ahora se encuentran dentro de la nueva carpeta `env/` y rellena los valores de las variables (contraseñas de base de datos, API keys, etc.).

### d. Configura tus Hosts Locales (Paso Crucial)

El entorno de desarrollo utiliza Nginx para redirigir el tráfico a los servicios correctos usando nombres de dominio locales (ej: `admin.localhost`). Para que esto funcione, debes decirle a tu sistema operativo que estos dominios apuntan a tu propia máquina (`127.0.0.1`).

1.  **Abre el archivo `hosts` con permisos de administrador.** La ubicación varía según tu sistema operativo:
    -   **Linux/macOS:** `/etc/hosts`
    -   **Windows:** `C:\Windows\System32\drivers\etc\hosts`

2.  **Añade la siguiente línea al final del archivo:**
    ```
    127.0.0.1   admin.localhost app.localhost api.localhost
    ```

3.  **Guarda los cambios.** Puede que necesites introducir tu contraseña de administrador.

## 3. Ejecución del Proyecto

### a. Usando Docker Compose (Recomendado)

La forma más sencilla y recomendada de levantar todo el ecosistema es usando el script `docker:dev` definido en el `package.json` principal. Este comando utiliza Docker Compose para construir las imágenes y levantar todos los servicios de forma orquestada.

```bash
pnpm docker:dev
```

Una vez ejecutado, los servicios estarán disponibles en los puertos definidos en tu archivo `.env` principal (ej: `localhost:3000`, `localhost:3001`, etc.).

### b. Desarrollo Simultáneo (API y Paquetes)

Cuando necesites hacer cambios en un paquete (como `@workspace/database`) y ver los resultados inmediatamente en la API, el flujo de trabajo ideal es ejecutar ambos en modo "watch".

Turborepo simplifica esto enormemente. Para iniciar la API y todos sus paquetes dependientes en modo de desarrollo simultáneo, ejecuta el siguiente comando desde la **raíz del proyecto**:

```bash
pnpm dev
```

Este comando hará dos cosas en paralelo:
1.  Ejecutará `tsc --watch` en el paquete `database`, recompilándolo automáticamente cada vez que guardes un cambio.
2.  Ejecutará `nest start --watch` en la `api`, que se reiniciará automáticamente al detectar los cambios en el paquete `database` compilado.

Este es el método recomendado para el desarrollo diario de la lógica de negocio.

### c. Ejecutando Servicios Individualmente

Si solo necesitas trabajar en una parte específica del proyecto (por ejemplo, la API), puedes ejecutar ese servicio de forma aislada para un ciclo de desarrollo más rápido.

```bash
# Ejecutar solo la API en modo watch
pnpm dev:api

# Ejecutar solo la web de administración
pnpm dev:web-admin
```

**Nota:** Si ejecutas un servicio individualmente, asegúrate de que los servicios de los que depende (como la base de datos) estén corriendo.
