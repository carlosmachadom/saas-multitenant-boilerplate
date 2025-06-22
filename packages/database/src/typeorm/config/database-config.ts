import { DataSourceOptions } from 'typeorm';
import { ConnectionMetadata } from '../interfaces';

/**
 * Configuración base para la conexión de administración
 */
export const adminBaseConfig = {
  type: 'postgres' as const,
  entities: [
    // Ruta a las entidades de admin
    __dirname + '/../entities/admin/**/*.entity{.ts,.js}',
  ],
  migrations: [
    // Ruta a las migraciones de admin
    __dirname + '/../migrations/admin/**/*{.ts,.js}',
  ],
  subscribers: [
    // Ruta a los suscriptores de admin
    __dirname + '/../subscribers/admin/**/*{.ts,.js}',
  ],
};

/**
 * Configuración base para las conexiones de tenants
 */
export const tenantBaseConfig = {
  type: 'postgres' as const,
  entities: [
    // Ruta a las entidades de tenant
    __dirname + '/../entities/tenant/**/*.entity{.ts,.js}',
  ],
  migrations: [
    // Ruta a las migraciones de tenant
    __dirname + '/../migrations/tenant/**/*{.ts,.js}',
  ],
  subscribers: [
    // Ruta a los suscriptores de tenant
    __dirname + '/../subscribers/tenant/**/*{.ts,.js}',
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
