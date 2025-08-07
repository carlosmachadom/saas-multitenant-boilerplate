import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { devopsTenantConfig } from '../../core/config/base-config';
import { DevOpsContext } from './devops-context';

/**
 * Tenant CLI DataSource for TypeORM CLI operations
 * Uses centralized DevOpsContext with Zod validation
 * Assumes dotenv-cli has loaded environment variables
 */

// Get validated configuration from centralized context
const config = DevOpsContext.getConfig();

// Create DataSource directly for TypeORM CLI
export default new DataSource({
  ...devopsTenantConfig,
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  schema: "tenant_template",
  synchronize: false,
  logging: config.logLevel === 'debug',
});


