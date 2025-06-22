import { Injectable } from '@nestjs/common';
import { HealthCheckResult } from '@workspace/database';
import { AdminDatabaseService } from 'src/infrastructure/database/typeorm/admin-database.service';

/**
 * Servicio para verificar la salud de la aplicación y sus dependencias
 */
@Injectable()
export class HealthService {
  constructor(private readonly adminDbService: AdminDatabaseService) {}

  /**
   * Verifica la salud general de la aplicación
   */
  async checkDatabaseHealth(): Promise<{
    status: string;
    timestamp: string;
    services: {
      api: { status: string };
      database: HealthCheckResult;
    };
  }> {
    // Verificar la salud de la base de datos
    const dbHealth = await this.adminDbService.checkHealth();

    // Determinar el estado general basado en los componentes
    const overallStatus = dbHealth.status === 'up' ? 'healthy' : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        api: { status: 'up' }, // La API está en ejecución si este código se está ejecutando
        database: dbHealth,
      },
    };
  }

  /**
   * Verifica solo la salud de la API
   */
  checkApiHealth(): { status: string; timestamp: string } {
    return {
      status: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}
