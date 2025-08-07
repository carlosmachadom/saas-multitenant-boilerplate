import { z } from 'zod';

/**
 * Schema de validación Zod para configuración DevOps
 */
const DevOpsConfigSchema = z.object({
  host: z.string().min(1, 'DB_HOST is required and cannot be empty'),
  port: z.coerce.number().int().min(1).max(65535, 'DB_PORT must be a valid port number (1-65535)'),
  username: z.string().min(1, 'DB_USERNAME is required and cannot be empty'),
  password: z.string().min(1, 'DB_PASSWORD is required and cannot be empty'),
  database: z.string().min(1, 'DB_NAME is required and cannot be empty'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

/**
 * Tipo inferido del schema Zod
 */
export type DevOpsConfig = z.infer<typeof DevOpsConfigSchema>;

/**
 * Context centralizado para operaciones DevOps con validación Zod
 * Asume que dotenv-cli ya cargó las variables de entorno
 */
export class DevOpsContext {
  private static config: DevOpsConfig | null = null;
  private static readonly REQUIRED_ENV_VARS = [
    'DB_HOST',
    'DB_PORT', 
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME'
  ] as const;

  /**
   * Obtiene la configuración validada de DevOps
   * @returns Configuración validada con Zod
   */
  static getConfig(): DevOpsConfig {
    if (!this.config) {
      this.config = this.parseAndValidateFromEnv();
    }
    return this.config;
  }

  /**
   * Parsea y valida las variables de entorno usando Zod
   * @returns Configuración validada
   * @throws Error si las variables no están cargadas o son inválidas
   */
  private static parseAndValidateFromEnv(): DevOpsConfig {
    // Verificar que dotenv-cli cargó las variables
    this.ensureEnvVarsLoaded();

    // Crear objeto de configuración desde process.env
    const rawConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logLevel: process.env.LOG_LEVEL || 'info',
    };

    // Validar con Zod
    try {
      return DevOpsConfigSchema.parse(rawConfig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: z.ZodIssue) => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        throw new Error(
          `❌ Invalid DevOps configuration: ${errorMessages}\n` +
          `💡 Ensure all required environment variables are set and valid.`
        );
      }
      throw error;
    }
  }

  /**
   * Verifica que las variables de entorno requeridas estén cargadas
   * @throws Error si alguna variable requerida no está presente
   */
  private static ensureEnvVarsLoaded(): void {
    const missingVars = this.REQUIRED_ENV_VARS.filter(
      varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `❌ Missing required environment variables: ${missingVars.join(', ')}\n` +
        `💡 Ensure you are running this via a dotenv-cli script that loads the .env files.\n` +
        `📝 Example: dotenv -e ../../env/database/.env -- tsx script.ts`
      );
    }
  }

  /**
   * Valida la configuración actual (alias para getConfig)
   * @throws Error si la configuración es inválida
   */
  static validateConfig(): void {
    this.getConfig(); // Esto ejecutará la validación
  }

  /**
   * Resetea la configuración cacheada (útil para testing)
   */
  static resetConfig(): void {
    this.config = null;
  }

  /**
   * Obtiene información de debug sobre la configuración
   * @returns Objeto con información de debug (sin password)
   */
  static getDebugInfo(): Omit<DevOpsConfig, 'password'> & { password: string } {
    const config = this.getConfig();
    return {
      ...config,
      password: '***REDACTED***'
    };
  }
}
