import { DataSourceOptions } from 'typeorm';
import { ConnectionMetadata } from '@core/interfaces';
import { runtimeAdminConfig, runtimeTenantConfig } from '@core/config/base-config';

/**
 * Factory para crear configuraciones de DataSource optimizadas para Runtime/API
 * Recibe configuración externa (no carga env vars internamente)
 */
export class RuntimeConfigFactory {
  /**
   * Crear DataSource para Admin optimizado para producción
   */
  static createAdminDataSource(config: ConnectionMetadata): DataSourceOptions {
    return {
      ...runtimeAdminConfig,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      schema: config.schema || 'admin',
      synchronize: config.synchronize || false,
      logging: config.logging || false,
      // Configuraciones adicionales para producción
      maxQueryExecutionTime: 30000,
      extra: {
        max: 20, // connection pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    };
  }

  /**
   * Crear DataSource para Tenant optimizado para producción
   */
  static createTenantDataSource(config: ConnectionMetadata, schema: string): DataSourceOptions {
    return {
      ...runtimeTenantConfig,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      schema,
      synchronize: config.synchronize || false,
      logging: config.logging || false,
      // Configuraciones adicionales para producción
      maxQueryExecutionTime: 30000,
      extra: {
        max: 20, // connection pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    };
  }
}
