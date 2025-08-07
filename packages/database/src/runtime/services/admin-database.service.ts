import { DataSource, DataSourceOptions, EntityManager, QueryRunner } from 'typeorm';
import { RuntimeConfigFactory } from '@runtime/config/runtime-factory';
import { 
  ConnectionMetadata, 
  AdminDatabaseServiceInterface,
  HealthCheckResult,
  TransactionCallback,
  SequentialTransactionResult,
  TransactionResult
} from '@core/interfaces';

/**
 * Servicio para gestionar la conexión de administración a la base de datos
 * Optimizado para Runtime/API - Recibe configuración externa
 * Implementa el patrón Singleton por instancia de configuración
 */
export class AdminDatabaseService implements AdminDatabaseServiceInterface {
  private static instances = new Map<string, AdminDatabaseService>();
  private dataSource: DataSource | null = null;
  private readonly config: DataSourceOptions;
  
  /**
   * Constructor privado para implementar el patrón Singleton
   * @param metadata Metadata de conexión recibida externamente
   */
  private constructor(metadata: ConnectionMetadata) {
    this.config = RuntimeConfigFactory.createAdminDataSource(metadata);
  }
  
  /**
   * Obtener la instancia única del servicio de base de datos de administración
   * @param metadata Metadata de conexión
   */
  public static getInstance(metadata: ConnectionMetadata): AdminDatabaseService {
    const key = `${metadata.host}:${metadata.port}/${metadata.database}`;
    
    if (!AdminDatabaseService.instances.has(key)) {
      AdminDatabaseService.instances.set(key, new AdminDatabaseService(metadata));
    }
    
    return AdminDatabaseService.instances.get(key)!;
  }
  
  /**
   * Obtener la fuente de datos de administración
   * @returns La fuente de datos configurada
   */
  public getDataSource(): DataSource {
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
   * @returns La fuente de datos inicializada
   */
  public async initializeDataSource(): Promise<DataSource> {
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
   * Ejecutar migraciones
   */
  public async runMigrations(): Promise<void> {
    const dataSource = await this.initializeDataSource();
    await dataSource.runMigrations();
  }
  
  /**
   * Revertir migraciones
   */
  public async revertLastMigration(): Promise<void> {
    const dataSource = await this.initializeDataSource();
    await dataSource.undoLastMigration();
  }
  
  /**
   * Cerrar la conexión de administración
   */
  public async closeConnection(): Promise<void> {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
      this.dataSource = null;
    }
  }
}
