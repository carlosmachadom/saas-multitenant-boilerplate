import "reflect-metadata";
import { DataSource } from "typeorm";
import { AdminSeederService } from "../services/admin-seeder.service";
import {
  createSchema,
  schemaExists as checkSchemaExists,
} from "@core/utils/schema.util";

/**
 * Script principal para ejecutar el proceso de seeding de administración.
 * Importa la fuente de datos del CLI para asegurar una configuración consistente.
 */
export async function main(dataSource: DataSource) {
  console.log(
    "--- Iniciando seeding de la base de datos de administración ---"
  );

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  console.log(
    "Conexión a la base de datos de administración inicializada y lista."
  );

  const schemaExists = await checkSchemaExists(dataSource, "admin");

  if (!schemaExists) {
    console.log("El esquema admin no existe. Creando...");
    await createSchema(dataSource, "admin");
  }

  await dataSource.query(`SET search_path TO "admin"`);

  await dataSource.runMigrations();
  console.log("--- Migraciones de administración ejecutadas exitosamente ---");

  const seederService = new AdminSeederService(dataSource);
  await seederService.seed();
}
