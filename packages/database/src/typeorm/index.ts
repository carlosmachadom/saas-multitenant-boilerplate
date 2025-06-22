// Exportar tipos necesarios de TypeORM
import { DataSource, DataSourceOptions, EntityManager } from 'typeorm';
export type { DataSource, DataSourceOptions, EntityManager };

// Exportar servicios
export * from './services/admin-database.service';
export * from './services/tenant-database.service';

// Exportar interfaces
export * from './interfaces/database-service.interface';
export * from './interfaces/data-source.interface';

// Exportar desde índices
export * from './interfaces';
export * from './services';
export * from './config';

// Exportar utilidades de esquema para uso directo
export { schemaExists, createSchema, dropSchema } from './utils/schema.util';