import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../services/health.service';
import { HealthCheckResult } from '@workspace/database';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('api')
  checkApiHealth(): { status: string; timestamp: string } {
    return this.healthService.checkApiHealth();
  }

  @Get('database')
  async checkDatabaseHealth(): Promise<{
    status: string;
    timestamp: string;
    services: {
      api: { status: string };
      database: HealthCheckResult;
    };
  }> {
    return this.healthService.checkDatabaseHealth();
  }
}
