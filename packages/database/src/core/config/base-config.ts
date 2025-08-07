import { DataSourceOptions } from 'typeorm';
import { ConnectionMetadata } from '@core/interfaces';

/**
 * Configuración base para la conexión de administración
 * Reutiliza la configuración existente
 */
export const adminBaseConfig = {
  type: 'postgres' as const,
  entities: [
    // Rutas actualizadas para la nueva estructura
    __dirname + '/../entities/admin/**/*.entity{.ts,.js}',
    __dirname + '/../entities/shared/**/*.entity{.ts,.js}',
  ],
  migrations: [
    // Rutas actualizadas para migraciones
    __dirname + '/../../devops/migrations/admin/**/*{.ts,.js}',
  ],
  subscribers: [
    // Rutas actualizadas para suscriptores
    __dirname + '/../../devops/subscribers/admin/**/*{.ts,.js}',
  ],
};

/**
 * Configuración base para las conexiones de tenants
 * Reutiliza la configuración existente
 */
export const tenantBaseConfig = {
  type: 'postgres' as const,
  entities: [
    // Rutas actualizadas para la nueva estructura
    __dirname + '/../entities/tenant/**/*.entity{.ts,.js}',
    __dirname + '/../entities/shared/**/*.entity{.ts,.js}',
  ],
  migrations: [
    // Rutas actualizadas para migraciones
    __dirname + '/../../devops/migrations/tenant/**/*{.ts,.js}',
  ],
  subscribers: [
    // Rutas actualizadas para suscriptores
    __dirname + '/../../devops/subscribers/tenant/**/*{.ts,.js}',
  ],
};

/**
 * Función para crear una configuración de base de datos para admin
 * @param metadata Metadata de conexión
 * @returns Configuración completa para TypeORM
 */
export function createAdminConfig(metadata: ConnectionMetadata): DataSourceOptions {
  return {
    ...adminBaseConfig,
    host: metadata.host,
    port: metadata.port,
    username: metadata.username,
    password: metadata.password,
    database: metadata.database,
    schema: metadata.schema || 'admin',
    synchronize: metadata.synchronize,
    logging: metadata.logging,
  };
}

/**
 * Función para crear una configuración de base de datos para tenant
 * @param metadata Metadata de conexión
 * @param tenantSchema Esquema del tenant
 * @returns Configuración completa para TypeORM
 */
export function createTenantConfig(metadata: ConnectionMetadata, tenantSchema: string): DataSourceOptions {
  return {
    ...tenantBaseConfig,
    host: metadata.host,
    port: metadata.port,
    username: metadata.username,
    password: metadata.password,
    database: metadata.database,
    schema: tenantSchema,
    synchronize: metadata.synchronize,
    logging: metadata.logging,
  };
}

// Configuraciones optimizadas para diferentes contextos
export const runtimeAdminConfig = {
  ...adminBaseConfig,
  synchronize: false,
  logging: false,
  // Optimizado para producción
};

export const runtimeTenantConfig = {
  ...tenantBaseConfig,
  synchronize: false,
  logging: false,
  // Optimizado para producción
};

export const devopsAdminConfig = {
  ...adminBaseConfig,
  synchronize: false,
  logging: true,
  // Optimizado para desarrollo
};

export const devopsTenantConfig = {
  ...tenantBaseConfig,
  synchronize: false,
  logging: true,
  // Optimizado para desarrollo
};
