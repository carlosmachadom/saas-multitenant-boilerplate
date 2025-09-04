import "reflect-metadata";
import { DataSource } from "typeorm";
import { TenantSeederService } from "../services/tenant-seeder.service";
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
    "--- Iniciando seeding de la base de datos de tenants ---"
  );

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  console.log(
    "Conexión a la base de datos de tenants inicializada y lista."
  );

  const schemaExists = await checkSchemaExists(dataSource, "tenants");

  if (!schemaExists) {
    console.log("El esquema tenants no existe. Creando...");
    await createSchema(dataSource, "tenants");
  }

  await dataSource.query(`SET search_path TO "tenants"`);

  await dataSource.runMigrations();
  console.log("--- Migraciones de tenants ejecutadas exitosamente ---");

  const seederService = new TenantSeederService(dataSource);
  await seederService.seed();
}
