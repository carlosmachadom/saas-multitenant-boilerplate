import 'reflect-metadata';

// Solo exportar runtime para consumo público de la API
export * from './runtime';

// Re-exportar tipos clave de TypeORM para los consumidores del paquete
export type { DataSource, DataSourceOptions, EntityManager } from 'typeorm';
