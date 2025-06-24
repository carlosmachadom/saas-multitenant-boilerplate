# Guía de Contribución para Auto-Vendi

¡Gracias por tu interés en contribuir a Auto-Vendi! Agradecemos cualquier ayuda, desde la corrección de bugs hasta la implementación de nuevas funcionalidades. Para asegurar un proceso fluido y mantener la calidad del proyecto, por favor sigue las siguientes directrices.

## Código de Conducta

Aunque este es un proyecto personal, se espera que todos los contribuidores sigan un código de conducta que promueva un ambiente respetuoso y colaborativo. Sé amable y considerado con los demás.

## ¿Cómo Puedo Contribuir?

-   **Reportando Bugs:** Si encuentras un problema, por favor, crea un [Issue en GitHub](https://github.com/carlos-paezf/auto-vendi/issues) con una descripción detallada, los pasos para reproducirlo y la versión del software.
-   **Sugiriendo Mejoras:** ¿Tienes una idea para una nueva funcionalidad o una mejora? Abre un Issue para discutirlo.
-   **Escribiendo Código:** Si quieres trabajar en un bug o una funcionalidad, por favor, sigue el flujo de trabajo que se describe a continuación.

## Flujo de Trabajo de Desarrollo

Para mantener el orden en nuestro monorepo, hemos definido un flujo de trabajo y convenciones específicas. Antes de empezar, por favor, lee nuestra guía completa.

**➡️ [Guía Detallada de Flujo de Trabajo con Git](./docs/03-git-workflow.md)**

### Resumen Rápido

1.  **Sincroniza `develop`:** Asegúrate de tener la última versión de la rama `develop`.
2.  **Crea una Rama:** Usa nuestra convención de nomenclatura: `tipo/alcance/descripcion`.
    ```bash
    # Ejemplo: feat/api/agregar-endpoint-de-usuarios
    git checkout -b feat/api/agregar-endpoint-de-usuarios
    ```
3.  **Desarrolla:** Haz tus cambios. Asegúrate de que el código pase las comprobaciones de linting y los tests.
4.  **Crea un Pull Request:** Una vez que tu trabajo esté listo, abre un Pull Request hacia la rama `develop`. Utiliza la plantilla de PR que hemos definido para proporcionar toda la información necesaria.

## Estándares de Código

-   **Formato:** Usamos Prettier para formatear el código automáticamente. Asegúrate de tenerlo configurado en tu editor o ejecuta `pnpm format` antes de hacer commit.
-   **Linting:** Usamos ESLint para identificar problemas en el código. Ejecuta `pnpm lint` para revisar tus cambios.
-   **Tests:** Todos los cambios deben estar cubiertos por tests. Ejecuta `pnpm test` para asegurarte de que todo sigue funcionando correctamente.

¡Gracias de nuevo por tu contribución!
