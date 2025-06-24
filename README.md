# SaaS Multi-Tenant Boilerplate

Este es un boilerplate de nivel de producción diseñado para acelerar el desarrollo de aplicaciones **SaaS B2B Multi-Tenant**. Proporciona una base sólida y escalable, permitiéndote enfocarte directamente en la lógica de negocio de tu MVP.

---

## Características Principales

-   **Arquitectura Monorepo:** Código centralizado y gestionado eficientemente con **Turborepo** y **pnpm workspaces**.
-   **Multi-Tenancy Real:** Aislamiento de datos por cliente usando una estrategia de **schema-per-tenant** en PostgreSQL, lista para escalar.
-   **Backend Robusto:** API modular construida con **NestJS**, siguiendo las mejores prácticas de diseño de software.
-   **Frontend Moderno:** Aplicaciones desacopladas para administradores (`web-admin`) y clientes (`web-tenant`) construidas con **Next.js 14 (App Router)**.
-   **Infraestructura como Código:** Entorno de desarrollo y producción consistentes y reproducibles con **Docker** y **Docker Compose**.
-   **Automatización y CI/CD:** Flujos de trabajo pre-configurados con **GitHub Actions** para integración y despliegue continuo.
-   **Bases para Observabilidad:** Preparado para integrar herramientas de monitoreo, logging y seguimiento de errores.

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
-   [Node.js](https://nodejs.org/) (v20 o superior)
-   [pnpm](https://pnpm.io/installation)
-   [Docker](https://docs.docker.com/get-docker/) y Docker Compose

### Pasos de Instalación

1.  **Clona el repositorio**:
    ```bash
    git clone <URL-DE-TU-REPOSITORIO-BOILERPLATE>
    cd saas-multitenant-boilerplate
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
-   **[Cómo Contribuir](./CONTRIBUTING.md):** Guías para contribuir y mejorar este boilerplate.
