import { DataSource } from 'typeorm';

/**
 * Verifica si un esquema existe en la base de datos
 * @param dataSource La fuente de datos de TypeORM
 * @param schemaName Nombre del esquema a verificar
 * @returns true si el esquema existe, false en caso contrario
 */
export const schemaExists = async (dataSource: DataSource, schemaName: string): Promise<boolean> => {
  try {
    const result = await dataSource.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.schemata WHERE schema_name = $1
      )`,
      [schemaName]
    );
    return result[0].exists;
  } catch (error) {
    console.error(`Error al verificar si existe el esquema ${schemaName}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo esquema en la base de datos
 * @param dataSource La fuente de datos de TypeORM
 * @param schemaName Nombre del esquema a crear
 */
export const createSchema = async (dataSource: DataSource, schemaName: string): Promise<void> => {
  try {
    await dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
  } catch (error) {
    console.error(`Error al crear el esquema ${schemaName}:`, error);
    throw error;
  }
};

/**
 * Elimina un esquema de la base de datos
 * @param dataSource La fuente de datos de TypeORM
 * @param schemaName Nombre del esquema a eliminar
 * @param cascade Si es true, elimina todos los objetos que dependen del esquema
 */
export const dropSchema = async (
  dataSource: DataSource, 
  schemaName: string, 
  cascade = false
): Promise<void> => {
  try {
    await dataSource.query(`DROP SCHEMA IF EXISTS "${schemaName}" ${cascade ? 'CASCADE' : 'RESTRICT'}`);
  } catch (error) {
    console.error(`Error al eliminar el esquema ${schemaName}:`, error);
    throw error;
  }
};
