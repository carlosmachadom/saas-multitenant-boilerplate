import { DataSource, DataSourceOptions, EntityManager, QueryRunner } from 'typeorm';
import { RuntimeConfigFactory } from '@runtime/config/runtime-factory';
import {
  ConnectionMetadata,
  TenantDatabaseServiceInterface,
  HealthCheckResult,
  TransactionCallback,
  SequentialTransactionResult,
  TransactionResult
} from '@core/interfaces';

/**
 * Servicio para gestionar las conexiones de tenants a la base de datos
 * Optimizado para Runtime/API - Recibe configuración externa
 * Implementa el patrón Singleton por instancia de configuración
 */
export class TenantDatabaseService implements TenantDatabaseServiceInterface {
  private static instances = new Map<string, TenantDatabaseService>();
  private connections: Map<string, DataSource> = new Map();
  private readonly metadata: ConnectionMetadata;
  
  /**
   * Constructor privado para implementar el patrón Singleton
   * @param metadata Metadata de conexión recibida externamente
   */
  private constructor(metadata: ConnectionMetadata) {
    this.metadata = metadata;
  }
  
  /**
   * Obtener la instancia única del servicio de base de datos de tenants
   * @param metadata Metadata de conexión
   */
  public static getInstance(metadata: ConnectionMetadata): TenantDatabaseService {
    const key = `${metadata.host}:${metadata.port}/${metadata.database}`;
    
    if (!TenantDatabaseService.instances.has(key)) {
      TenantDatabaseService.instances.set(key, new TenantDatabaseService(metadata));
    }
    
    return TenantDatabaseService.instances.get(key)!;
  }
  
  /**
   * Obtener la fuente de datos para un tenant específico
   * @param tenantSchema Esquema del tenant
   * @returns La fuente de datos configurada para el tenant
   */
  public getDataSource(tenantSchema: string): DataSource {
    if (!this.connections.has(tenantSchema)) {
      const config = RuntimeConfigFactory.createTenantDataSource(this.metadata, tenantSchema);
      const dataSource = new DataSource({
        ...config,
        name: `tenant_${tenantSchema}`
      });
      this.connections.set(tenantSchema, dataSource);
    }
    return this.connections.get(tenantSchema)!;
  }

  /**
   * Obtener todas las conexiones de tenants activas
   * @returns Mapa con todas las conexiones activas
   */
  public getAllConnections(): Map<string, DataSource> {
    return new Map(this.connections);
  }
  
  /**
   * Inicializar la conexión para un tenant específico
   * @param tenantSchema Esquema del tenant
   * @returns La fuente de datos inicializada
   */
  public async initializeDataSource(tenantSchema: string): Promise<DataSource> {
    const dataSource = this.getDataSource(tenantSchema);
    
    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      return dataSource;
    } catch (error) {
      console.error(`Error al inicializar la conexión del tenant ${tenantSchema}:`, error);
      throw error;
    }
  }
  
  /**
   * Ejecutar migraciones para un tenant específico
   * @param tenantSchema Esquema del tenant
   */
  public async runMigrations(tenantSchema: string): Promise<void> {
    const dataSource = await this.initializeDataSource(tenantSchema);
    await dataSource.runMigrations();
  }
  
  /**
   * Revertir migraciones para un tenant específico
   * @param tenantSchema Esquema del tenant
   */
  public async revertLastMigration(tenantSchema: string): Promise<void> {
    const dataSource = await this.initializeDataSource(tenantSchema);
    await dataSource.undoLastMigration();
  }
  
  /**
   * Cerrar la conexión de un tenant específico
   * @param tenantSchema Esquema del tenant
   */
  public async closeConnection(tenantSchema: string): Promise<void> {
    const dataSource = this.connections.get(tenantSchema);
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
      this.connections.delete(tenantSchema);
    }
  }
  
  /**
   * Obtener todas las conexiones de tenants activas
   */
  public getAllDataSources(): Map<string, DataSource> {
    return new Map(this.connections);
  }
  
  /**
   * Cerrar todas las conexiones de tenants
   */
  public async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.connections.entries()).map(
      async ([schema, dataSource]) => {
        if (dataSource.isInitialized) {
          await dataSource.destroy();
        }
      }
    );
    
    await Promise.all(closePromises);
    this.connections.clear();
  }
}
