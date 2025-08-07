import { DataSource, EntityManager } from 'typeorm';

/**
 * Interfaz para el resultado del chequeo de salud
 */
export interface HealthCheckResult {
  status: 'up' | 'down';
  details?: {
    [key: string]: any;
  };
}

/**
 * Tipo para callbacks de transacciones
 */
export type TransactionCallback<T> = (entityManager: EntityManager) => Promise<T>;

/**
 * Interfaz para resultados de transacciones secuenciales
 */
export interface TransactionResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  index: number;
}

/**
 * Interfaz para resultados de múltiples transacciones secuenciales
 */
export interface SequentialTransactionResult<T> {
  allSuccessful: boolean;
  results: TransactionResult<T>[];
  failedAt?: number;
}

/**
 * Interfaz para la metadata de conexión a la base de datos
 */
export interface ConnectionMetadata {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
  synchronize: boolean;
  logging: boolean;
}

/**
 * Interfaz específica para el servicio de base de datos de administración
 */
export interface AdminDatabaseServiceInterface {
  /**
   * Obtener una conexión a la base de datos admin
   */
  getDataSource(): DataSource;
  
  /**
   * Inicializar una conexión a la base de datos admin
   */
  initializeDataSource(): Promise<DataSource>;
  
  /**
   * Cerrar la conexión admin
   */
  closeConnection(): Promise<void>;

  /**
   * Ejecutar migraciones en admin
   */
  runMigrations(): Promise<void>;
}

/**
 * Interfaz específica para el servicio de base de datos de tenants
 */
export interface TenantDatabaseServiceInterface {
  /**
   * Obtener una conexión a la base de datos de un tenant específico
   */
  getDataSource(tenantSchema: string): DataSource;
  
  /**
   * Inicializar una conexión a la base de datos de un tenant específico
   */
  initializeDataSource(tenantSchema: string): Promise<DataSource>;
  
  /**
   * Cerrar la conexión de un tenant específico
   */
  closeConnection(tenantSchema: string): Promise<void>;

  /**
   * Obtener todas las conexiones de tenants activas
   */
  getAllConnections(): Map<string, DataSource>;

  /**
   * Ejecutar migraciones en un tenant específico
   */
  runMigrations(tenantSchema: string): Promise<void>;
}
