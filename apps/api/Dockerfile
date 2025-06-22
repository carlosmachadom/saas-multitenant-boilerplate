# Dockerfile optimizado para NestJS en Turborepo

# Etapa base para pruning
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar herramientas globales
RUN npm install -g pnpm@10.4.1 turbo@2.1.3

# Copiar archivos necesarios para el prune
COPY . .
ARG APP=api

# Usar turbo prune para obtener solo los archivos necesarios
RUN turbo prune "$APP" --docker

# Etapa de instalación de dependencias
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar pnpm y NestJS CLI globalmente
RUN npm install -g pnpm@10.4.1 @nestjs/cli

# Copiar archivos package.json y pnpm-lock.yaml del prune
COPY --from=base /app/out/json/ .

# Instalar todas las dependencias (dev + prod)
# Importante: Necesitamos todas las dependencias para la compilación
RUN pnpm install --frozen-lockfile

# Etapa de construcción
FROM installer AS builder
WORKDIR /app

# Copiar todo el código fuente del prune
COPY --from=base /app/out/full/ .

# Construir la aplicación
ARG APP=api
RUN cd apps/$APP && pnpm turbo run --filter="${APP}..." build

# Etapa de producción
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y pnpm-lock.yaml
COPY --from=base /app/out/json/ .

# Instalar solo dependencias de producción
RUN npm install -g pnpm@10.4.1
RUN pnpm install --prod --frozen-lockfile

# Copiar el código compilado
ARG APP=api
COPY --from=builder /app/apps/$APP/dist ./apps/$APP/dist

# Verificar que las dependencias de NestJS estén instaladas
RUN echo "Verificando dependencias NestJS:" && ls -la node_modules/@nestjs || echo "NestJS modules no encontrados"

# Establecer directorio de trabajo para la aplicación
WORKDIR /app/apps/$APP

# Exponer puerto
ENV PORT=3002
EXPOSE 3002

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]
