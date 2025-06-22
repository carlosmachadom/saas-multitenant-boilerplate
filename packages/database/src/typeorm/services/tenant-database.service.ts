import { DataSource, DataSourceOptions, EntityManager, QueryRunner } from 'typeorm';
import { createTenantConfig } from '../config/database-config';
import { 
  ConnectionMetadata, 
  DatabaseServiceInterface, 
  HealthCheckResult,
  TransactionCallback,
  SequentialTransactionResult,
  TransactionResult
} from '../interfaces';

/**
 * Interfaz específica para el servicio de base de datos de tenants
 * Extiende la interfaz base y añade métodos específicos para tenants
 */
export interface TenantDatabaseServiceInterface extends DatabaseServiceInterface {
  /**
   * Crear una conexión para un tenant específico
   * @param tenantId Identificador del tenant
   */
  createTenantConnection(tenantId: string): Promise<DataSource>;
  
  /**
   * Verificar si existe una conexión para un tenant específico
   * @param tenantId Identificador del tenant
   */
  hasTenantConnection(tenantId: string): boolean;
  
  /**
   * Obtener todas las conexiones de tenants activas
   */
  getAllTenantConnections(): Map<string, DataSource>;

  /**
   * Cerrar todas las conexiones
   * Este método es especialmente útil para TenantDatabaseService que maneja múltiples conexiones
   * Para AdminDatabaseService, simplemente cierra la única conexión que maneja
   */
  closeAllConnections(): Promise<void>;
}

/**
 * Servicio para gestionar las conexiones de tenants a la base de datos
 * Implementa el patrón Singleton
 */
export class TenantDatabaseService implements TenantDatabaseServiceInterface {
  private static instance: TenantDatabaseService;
  private connections: Map<string, DataSource> = new Map();
  private readonly metadata: ConnectionMetadata;
  
  /**
   * Constructor privado para implementar el patrón Singleton
   * @param metadata Metadata de conexión
   */
  private constructor(metadata: ConnectionMetadata) {
    this.metadata = metadata;
  }
  
  /**
   * Obtener la instancia única del servicio de base de datos de tenants
   * @param metadata Metadata de conexión
   */
  public static getInstance(metadata: ConnectionMetadata): TenantDatabaseService {
    if (!TenantDatabaseService.instance) {
      TenantDatabaseService.instance = new TenantDatabaseService(metadata);
    }
    return TenantDatabaseService.instance;
  }
  
  /**
   * Obtener todas las conexiones de tenants activas
   */
  public getAllTenantConnections(): Map<string, DataSource> {
    return this.connections;
  }
  
  /**
   * Verificar si existe una conexión para un tenant específico
   * @param tenantId Identificador del tenant
   */
  public hasTenantConnection(tenantId: string): boolean {
    const connectionName = `tenant_${tenantId}`;
    return this.connections.has(connectionName);
  }
  
  /**
   * Crear una conexión para un tenant específico
   * @param tenantId Identificador del tenant
   */
  public async createTenantConnection(tenantId: string): Promise<DataSource> {
    const connectionName = `tenant_${tenantId}`;
    const tenantSchema = `tenant_${tenantId}`;
    
    // Si ya existe una conexión con ese nombre, devolverla
    if (this.connections.has(connectionName)) {
      return this.connections.get(connectionName)!;
    }
    
    // Crear la configuración para este tenant
    const config = createTenantConfig(this.metadata, tenantSchema);
    
    // Crear la nueva conexión
    const dataSource = new DataSource({
      ...config,
      name: connectionName,
    });
    
    // Guardar la conexión en el mapa
    this.connections.set(connectionName, dataSource);
    
    return dataSource;
  }
  
  /**
   * Obtener la fuente de datos para un tenant específico
   * @param name Nombre de la conexión (debe ser tenant_[id])
   * @returns La fuente de datos configurada
   */
  public getDataSource(name: string): DataSource {
    if (!name.startsWith('tenant_')) {
      throw new Error('El nombre de la conexión debe tener el formato tenant_[id]');
    }
    
    // Si ya existe una conexión con ese nombre, devolverla
    if (this.connections.has(name)) {
      return this.connections.get(name)!;
    }
    
    // Si no existe, extraer el ID del tenant y crear la conexión
    const tenantId = name.replace('tenant_', '');
    
    // Crear la configuración para este tenant
    const tenantSchema = name; // El schema es el mismo que el nombre de la conexión
    const config = createTenantConfig(this.metadata, tenantSchema);
    
    // Crear la nueva conexión
    const dataSource = new DataSource({
      ...config,
      name: name,
    });
    
    // Guardar la conexión en el mapa
    this.connections.set(name, dataSource);
    
    return dataSource;
  }
  
  /**
   * Inicializar una conexión para un tenant específico
   * @param name Nombre de la conexión (debe ser tenant_[id])
   * @returns La fuente de datos inicializada
   */
  public async initializeDataSource(name: string): Promise<DataSource> {
    const dataSource = this.getDataSource(name);
    
    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      return dataSource;
    } catch (error) {
      console.error(`Error al inicializar la conexión ${name}:`, error);
      throw error;
    }
  }
  
  /**
   * Verificar el estado de salud de una conexión de tenant
   * @param name Nombre de la conexión (debe ser tenant_[id])
   * @returns Resultado del chequeo de salud
   */
  public async checkHealth(name?: string): Promise<HealthCheckResult> {
    try {
      // Si no se especifica un nombre, verificamos todas las conexiones
      if (!name) {
        const results: { [key: string]: boolean } = {};
        let allUp = true;
        
        for (const [connectionName, dataSource] of this.connections.entries()) {
          try {
            if (dataSource.isInitialized) {
              await dataSource.query('SELECT 1');
              results[connectionName] = true;
            } else {
              results[connectionName] = false;
              allUp = false;
            }
          } catch (error) {
            results[connectionName] = false;
            allUp = false;
          }
        }
        
        return {
          status: allUp ? 'up' : 'down',
          details: {
            database: 'PostgreSQL',
            connections: results
          }
        };
      }
      
      // Verificar una conexión específica
      const dataSource = await this.initializeDataSource(name);
      
      // Intentamos ejecutar una consulta simple para verificar la conexión
      await dataSource.query('SELECT 1');
      
      return {
        status: 'up',
        details: {
          database: 'PostgreSQL',
          connection: name,
          isConnected: true
        }
      };
    } catch (error) {
      console.error(`Error en el health check de la conexión ${name || 'de tenants'}:`, error);
      
      return {
        status: 'down',
        details: {
          database: 'PostgreSQL',
          connection: name || 'tenants',
          isConnected: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }
  
  /**
   * Ejecutar operaciones dentro de una transacción
   * @param callback Función que recibe un EntityManager y ejecuta operaciones
   * @param name Nombre de la conexión (debe ser tenant_[id])
   * @returns El resultado de la operación
   */
  public async withTransaction<T>(
    callback: TransactionCallback<T>,
    name: string
  ): Promise<T> {
    const dataSource = await this.initializeDataSource(name);
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
   * @param name Nombre de la conexión (debe ser tenant_[id])
   * @returns Objeto con los resultados de cada transacción
   */
  public async withSequentialTransactions<T>(
    callbacks: TransactionCallback<T>[],
    name: string
  ): Promise<SequentialTransactionResult<T>> {
    const dataSource = await this.initializeDataSource(name);
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
   * Cerrar una conexión específica de tenant
   * @param name Nombre de la conexión a cerrar (debe ser tenant_[id])
   * @returns true si la conexión se cerró correctamente, false si no existía o ya estaba cerrada
   */
  public async closeConnection(name: string): Promise<boolean> {
    if (!name.startsWith('tenant_')) {
      throw new Error('El nombre de la conexión debe tener el formato tenant_[id]');
    }
    
    const dataSource = this.connections.get(name);
    
    if (!dataSource || !dataSource.isInitialized) {
      return false;
    }
    
    try {
      await dataSource.destroy();
      console.log(`Conexión ${name} cerrada correctamente`);
      this.connections.delete(name);
      return true;
    } catch (error) {
      console.error(`Error al cerrar la conexión ${name}:`, error);
      return false;
    }
  }
  
  /**
   * Cerrar todas las conexiones de tenants
   */
  public async closeAllConnections(): Promise<void> {
    // Crear una copia de las claves para evitar problemas al modificar el mapa durante la iteración
    const connectionNames = Array.from(this.connections.keys());
    
    for (const name of connectionNames) {
      await this.closeConnection(name);
    }
  }
}
