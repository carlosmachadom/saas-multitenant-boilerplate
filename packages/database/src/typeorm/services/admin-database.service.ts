import { DataSource, DataSourceOptions, EntityManager, QueryRunner } from 'typeorm';
import { createAdminConfig } from '../config/database-config';
import { 
  ConnectionMetadata, 
  DatabaseServiceInterface, 
  HealthCheckResult,
  TransactionCallback,
  SequentialTransactionResult,
  TransactionResult
} from '../interfaces';

/**
 * Interfaz específica para el servicio de base de datos de administración
 * Extiende la interfaz base y añade métodos específicos para admin
 */
export interface AdminDatabaseServiceInterface extends DatabaseServiceInterface {
  // Aquí se pueden añadir métodos específicos para la administración
}

/**
 * Servicio para gestionar la conexión de administración a la base de datos
 * Implementa el patrón Singleton
 */
export class AdminDatabaseService implements AdminDatabaseServiceInterface {
  private static instance: AdminDatabaseService;
  private dataSource: DataSource | null = null;
  private readonly config: DataSourceOptions;
  
  /**
   * Constructor privado para implementar el patrón Singleton
   * @param metadata Metadata de conexión
   */
  private constructor(metadata: ConnectionMetadata) {
    this.config = createAdminConfig(metadata);
  }
  
  /**
   * Obtener la instancia única del servicio de base de datos de administración
   * @param metadata Metadata de conexión
   */
  public static getInstance(metadata: ConnectionMetadata): AdminDatabaseService {
    if (!AdminDatabaseService.instance) {
      AdminDatabaseService.instance = new AdminDatabaseService(metadata);
    }
    return AdminDatabaseService.instance;
  }
  
  /**
   * Obtener la fuente de datos de administración
   * @param name Nombre de la conexión (ignorado en este servicio, siempre es 'admin')
   * @returns La fuente de datos configurada
   */
  public getDataSource(name: string = 'admin'): DataSource {
    if (!this.dataSource) {
      this.dataSource = new DataSource({
        ...this.config,
        name: 'admin'
      });
    }
    return this.dataSource;
  }
  
  /**
   * Inicializar la conexión de administración
   * @param name Nombre de la conexión (ignorado en este servicio, siempre es 'admin')
   * @returns La fuente de datos inicializada
   */
  public async initializeDataSource(name: string = 'admin'): Promise<DataSource> {
    const dataSource = this.getDataSource();
    
    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      return dataSource;
    } catch (error) {
      console.error('Error al inicializar la conexión de administración:', error);
      throw error;
    }
  }
  
  /**
   * Verificar el estado de salud de la conexión de administración
   * @returns Resultado del chequeo de salud
   */
  public async checkHealth(): Promise<HealthCheckResult> {
    try {
      const dataSource = await this.initializeDataSource();
      
      // Intentamos ejecutar una consulta simple para verificar la conexión
      await dataSource.query('SELECT 1');
      
      return {
        status: 'up',
        details: {
          database: 'PostgreSQL',
          connection: 'admin',
          isConnected: true
        }
      };
    } catch (error) {
      console.error('Error en el health check de la conexión de administración:', error);
      
      return {
        status: 'down',
        details: {
          database: 'PostgreSQL',
          connection: 'admin',
          isConnected: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }
  
  /**
   * Ejecutar operaciones dentro de una transacción
   * @param callback Función que recibe un EntityManager y ejecuta operaciones
   * @param name Nombre de la conexión (ignorado en este servicio, siempre es 'admin')
   * @returns El resultado de la operación
   */
  public async withTransaction<T>(
    callback: TransactionCallback<T>,
    name: string = 'admin'
  ): Promise<T> {
    const dataSource = await this.initializeDataSource();
    const queryRunner = dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      
      return result;
    } catch (error) {
      // Solo intentamos hacer rollback si la transacción se inició correctamente
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      
      throw error;
    } finally {
      // Liberamos el queryRunner solo si está conectado
      if (queryRunner.isReleased === false) {
        await queryRunner.release();
      }
    }
  }
  
  /**
   * Ejecutar múltiples transacciones en secuencia
   * Cada transacción es independiente, si una falla las demás continúan
   * @param callbacks Array de funciones que reciben un EntityManager y ejecutan operaciones
   * @param name Nombre de la conexión (ignorado en este servicio, siempre es 'admin')
   * @returns Objeto con los resultados de cada transacción
   */
  public async withSequentialTransactions<T>(
    callbacks: TransactionCallback<T>[],
    name: string = 'admin'
  ): Promise<SequentialTransactionResult<T>> {
    const dataSource = await this.initializeDataSource();
    const results: SequentialTransactionResult<T> = {
      success: true,
      results: []
    };
    
    for (let i = 0; i < callbacks.length; i++) {
      const queryRunner = dataSource.createQueryRunner();
      
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        const callback = callbacks[i];
        if (!callback) {
          throw new Error(`Callback at index ${i} is undefined`);
        }
        const result = await callback(queryRunner.manager);
        await queryRunner.commitTransaction();
        
        results.results.push({
          success: true,
          result
        });
      } catch (error) {
        // Solo intentamos hacer rollback si la transacción se inició correctamente
        if (queryRunner.isTransactionActive) {
          await queryRunner.rollbackTransaction();
        }
        
        results.results.push({
          success: false,
          error: error instanceof Error ? error : new Error(String(error))
        });
        
        // Marcamos el resultado general como fallido si alguna transacción falla
        results.success = false;
      } finally {
        // Liberamos el queryRunner solo si está conectado
        if (queryRunner.isReleased === false) {
          await queryRunner.release();
        }
      }
    }
    
    return results;
  }
  
  /**
   * Cerrar la conexión de administración
   * @param name Nombre de la conexión (ignorado en este servicio, siempre es 'admin')
   * @returns true si la conexión se cerró correctamente, false si no existía o ya estaba cerrada
   */
  public async closeConnection(name: string = 'admin'): Promise<boolean> {
    if (this.dataSource && this.dataSource.isInitialized) {
      try {
        await this.dataSource.destroy();
        this.dataSource = null;
        return true;
      } catch (error) {
        console.error('Error al cerrar la conexión de administración:', error);
        return false;
      }
    }
    return false;
  }
}
