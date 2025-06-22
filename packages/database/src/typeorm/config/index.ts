import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

// Solo carga dotenv en desarrollo local (no en Docker)
if (process.env.NODE_ENV !== 'production' && !process.env.DOCKER_ENV) {
  dotenv.config();
}

export * from './database-config';

/**
 * Interfaz para la configuración de la base de datos
 * Permite configurar todos los aspectos de la conexión a PostgreSQL
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
  synchronize: boolean;
  logging: boolean;
  entities?: string[];
  migrations?: string[];
  subscribers?: string[];
}

/**
 * Función para crear una configuración de base de datos
 * Combina los valores proporcionados con las variables de entorno
 * @param config Configuración personalizada (opcional)
 * @returns Configuración completa para TypeORM
 */
export function configureDatabase(config: DatabaseConfig): DataSourceOptions {
  return {
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    schema: config.schema,
    synchronize: config.synchronize,
    logging: config.logging,
    entities: config.entities || [],
    migrations: config.migrations || [],
    subscribers: config.subscribers || [],
  };
}
