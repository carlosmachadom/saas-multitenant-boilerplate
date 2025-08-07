export interface InitConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  forceReset?: boolean;
  skipAdminSeeding?: boolean;
  skipTenantTemplateSeeding?: boolean;
  initTimeout?: number;
}

/**
 * Context para operaciones de inicialización de base de datos
 * Solo consume variables de entorno pasadas por Docker Compose
 */
export class InitContext {
  private static config: InitConfig | null = null;

  static getConfig(): InitConfig {
    if (!this.config) {
      this.config = this.parseFromProcessEnv();
    }
    return this.config;
  }

  private static parseFromProcessEnv(): InitConfig {
    // Docker Compose ya pasó todas las variables
    if (!process.env.DB_HOST || !process.env.DB_PORT) {
      throw new Error(
        'DB environment variables not provided by Docker Compose.'
      );
    }

    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      forceReset: process.env.FORCE_RESET === 'true',
      skipAdminSeeding: process.env.SKIP_ADMIN_SEEDING === 'true',
      skipTenantTemplateSeeding: process.env.SKIP_TENANT_TEMPLATE_SEEDING === 'true',
      initTimeout: Number(process.env.INIT_TIMEOUT || '300000'),
    };
  }

  static validateConfig(): void {
    const config = this.getConfig();
    
    if (!config.host || !config.port || !config.username || !config.password || !config.database) {
      throw new Error('Missing required database configuration for Init operations');
    }
  }
}
