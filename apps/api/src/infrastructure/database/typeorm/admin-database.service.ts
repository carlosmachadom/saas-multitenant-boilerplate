import { Inject, Injectable } from '@nestjs/common';
import { 
  AdminDatabaseService as PackageAdminDatabaseService, 
  HealthCheckResult,
  TransactionCallback,
  DataSource,
} from '@workspace/database';

/**
 * Servicio de base de datos de administración para NestJS
 * Encapsula las operaciones específicas para la conexión de administración
 */
@Injectable()
export class AdminDatabaseService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly adminDbService: PackageAdminDatabaseService
  ) {}

  /**
   * Obtener la fuente de datos
   */
  getDataSource(): DataSource {
    return this.adminDbService.getDataSource('admin');
  }

  /**
   * Inicializar la conexión
   */
  async initializeConnection(): Promise<DataSource> {
    return this.adminDbService.initializeDataSource('admin');
  }

  /**
   * Verificar la salud de la conexión
   */
  async checkHealth(): Promise<HealthCheckResult> {
    return this.adminDbService.checkHealth();
  }

  /**
   * Ejecutar una función dentro de una transacción
   * @param runInTransaction Función a ejecutar dentro de la transacción
   */
  async withTransaction<T>(runInTransaction: TransactionCallback<T>): Promise<T> {
    return this.adminDbService.withTransaction(runInTransaction, 'admin');
  }

  /**
   * Cerrar la conexión
   */
  async closeConnection(): Promise<boolean> {
    return this.adminDbService.closeConnection('admin');
  }
}
