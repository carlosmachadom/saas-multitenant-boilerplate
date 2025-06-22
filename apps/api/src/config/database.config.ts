import { registerAs } from '@nestjs/config';
import { z } from 'zod';

/**
 * Esquema de validación para la configuración de la base de datos
 * Define tipos, valores por defecto y validaciones
 */
const databaseSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(5432),
  username: z.string().default('postgres'),
  password: z.string().default(''),
  database: z.string().default('postgres'),
  schema: z.string().default('admin'),
  synchronize: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  logging: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
});

/**
 * Tipo inferido del esquema de configuración
 * Se puede usar para tipar correctamente en toda la aplicación
 */
export type DatabaseConfig = z.infer<typeof databaseSchema>;

/**
 * Configuración de la base de datos con validación
 * Incluye todas las propiedades requeridas por ConnectionMetadata
 */
export default registerAs('database', () => {
  return databaseSchema.parse({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  });
});
