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
}

/**
 * Interfaz para resultados de múltiples transacciones secuenciales
 */
export interface SequentialTransactionResult<T> {
  success: boolean;
  results: TransactionResult<T>[];
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
 * Interfaz base para servicios de base de datos
 * Define el contrato común que deben implementar todos los servicios
 */
export interface DatabaseServiceInterface {
  /**
   * Obtener una conexión a la base de datos
   * @param name Nombre de la conexión
   */
  getDataSource(name: string): DataSource;
  
  /**
   * Inicializar una conexión a la base de datos
   * @param name Nombre de la conexión
   */
  initializeDataSource(name: string): Promise<DataSource>;
  
  /**
   * Verificar el estado de salud de la conexión
   * @param name Nombre de la conexión
   */
  checkHealth(name?: string): Promise<HealthCheckResult>;
  
  /**
   * Ejecutar operaciones dentro de una transacción
   * @param callback Función que recibe un EntityManager y ejecuta operaciones
   * @param name Nombre de la conexión
   */
  withTransaction<T>(callback: TransactionCallback<T>, name: string): Promise<T>;
  
  /**
   * Ejecutar múltiples transacciones en secuencia
   * @param callbacks Array de funciones que reciben un EntityManager y ejecutan operaciones
   * @param name Nombre de la conexión
   */
  withSequentialTransactions<T>(callbacks: TransactionCallback<T>[], name: string): Promise<SequentialTransactionResult<T>>;
  
  /**
   * Cerrar una conexión específica
   * @param name Nombre de la conexión a cerrar
   * @returns true si la conexión se cerró correctamente, false si no existía o ya estaba cerrada
   */
  closeConnection(name: string): Promise<boolean>;
}
