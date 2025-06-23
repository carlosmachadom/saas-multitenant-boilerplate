# Auto-Vendi Monorepo

¡Bienvenido a Auto-Vendi! Este es un monorepo que contiene el ecosistema completo de la aplicación, gestionado con Turborepo y pnpm.

## ¿Qué es Auto-Vendi?

**Auto-Vendi** es una plataforma **SaaS B2B** para la **automatización de procesos comerciales en PYMEs latinoamericanas**, iniciando con un **copiloto de cotización inteligente vía WhatsApp**. La aplicación permite a los negocios gestionar productos, automatizar cotizaciones y coordinar flujos internos y externos con herramientas como **n8n**.

---

## Características Principales

-   **Arquitectura Monorepo:** Código centralizado y gestionado eficientemente con Turborepo.
-   **Separación por Contextos:** Interfaces dedicadas para administradores (`web-admin`) y empresas (`web-tenant`).
-   **Backend Desacoplado:** API modular construida con NestJS.
-   **Multitenancy Real:** Aislamiento de datos por empresa usando una estrategia de schema-per-tenant en PostgreSQL.
-   **Automatización Low-Code:** Orquestación de flujos de trabajo con n8n.
-   **Infraestructura como Código:** Entorno de desarrollo y producción consistentes y reproducibles con Docker.

---

## Tech Stack

| Componente      | Tecnología                                                |
| --------------- | --------------------------------------------------------- |
| **Web Admin**       | Next.js 14 (App Router), TailwindCSS, ShadCN UI           |
| **Web Tenant**      | Next.js 14 (App Router), TailwindCSS, ShadCN UI           |
| **Backend API**     | NestJS 10, TypeScript, TypeORM, PostgreSQL (multi-schema) |
| **Automatización**  | n8n (low-code orchestration), OpenAI API                  |
| **Infraestructura** | Docker + Docker Compose, Nginx, GitHub Actions            |
| **Observabilidad**  | Sentry, PostHog, Logging                                  |

---

## Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

-   `apps/`: Contiene las aplicaciones que son puntos de entrada (interfaces web, API).
-   `packages/`: Contiene el código compartido (componentes de UI, configuraciones, lógica de base de datos).

---

## Cómo Empezar

Sigue estos pasos para levantar el entorno de desarrollo local.

### Requisitos Previos

Asegúrate de tener instalados los siguientes programas:
-   [Node.js](https://nodejs.org/) (v18 o superior)
-   [pnpm](https://pnpm.io/installation)
-   [Docker](https://docs.docker.com/get-docker/) y Docker Compose

### Pasos de Instalación

1.  **Clona el repositorio** e instálalo:
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd auto-vendi
    pnpm install
    ```

2.  **Configura las variables de entorno**:
    ```bash
    cp -r env.example/ env/
    ```
    Luego, rellena los valores en los archivos dentro de la nueva carpeta `env/`.

3.  **Configura tus hosts locales (¡Paso crucial!)**:
    Para que Nginx pueda redirigir correctamente, necesitas que `admin.localhost`, `app.localhost` y `api.localhost` apunten a tu máquina. Para más detalles, consulta la **[Guía de Desarrollo Local](./docs/02-local-development.md)**.

### Ejecutar la Aplicación

Levanta todo el ecosistema con el script de pnpm, que utiliza Docker Compose por debajo:

```bash
pnpm docker:dev
```

Una vez que los contenedores estén corriendo, podrás acceder a los servicios en:

-   **Web Admin:** [http://admin.localhost](http://admin.localhost)
-   **Web Tenant:** [http://app.localhost](http://app.localhost)
-   **API:** [http://api.localhost](http://api.localhost)

---

## Documentación

Para una visión más profunda del proyecto, consulta la siguiente documentación:

-   **[Arquitectura y Guías](./docs/):** Documentación detallada sobre la arquitectura, decisiones técnicas y guías de desarrollo.
-   **[Cómo Contribuir](./CONTRIBUTING.md):** Guías para contribuir a este proyecto.
