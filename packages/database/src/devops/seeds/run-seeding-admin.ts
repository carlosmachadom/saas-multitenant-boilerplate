import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AdminSeederService } from '../services/admin-seeder-service';
import { createSchema, schemaExists as checkSchemaExists } from '@core/utils/schema.util';

/**
 * Script principal para ejecutar el proceso de seeding de administración.
 * Importa la fuente de datos del CLI para asegurar una configuración consistente.
 */
export async function main(dataSource: DataSource) {
  console.log('--- Iniciando seeding de la base de datos de administración ---');

  try {
    // Asegurarse de que la fuente de datos esté inicializada
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('Conexión a la base de datos de administración inicializada y lista.');

    // Verificar si el esquema admin existe
    const schemaExists = await checkSchemaExists(dataSource, 'admin');
    
    if (!schemaExists) {
      console.log('El esquema admin no existe. Creando...');
      await createSchema(dataSource, 'admin');
    }

    // Correr migraciones de administración
    await dataSource.runMigrations();
    console.log('--- Migraciones de administración ejecutadas exitosamente ---');

    // Crear el servicio de seeder con la fuente de datos ya configurada
    const seederService = new AdminSeederService(dataSource);
    await seederService.seed();

    console.log('--- Seeding de la base de datos de administración completado exitosamente ---');

  } catch (error) {
    console.error('Ocurrió un error durante el proceso de setup:', error);
    // Re-lanzar el error es crucial para que el script de shell (run-initialization.sh) falle
    throw error;

  }
}
