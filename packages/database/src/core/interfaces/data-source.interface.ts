/**
 * Interfaz que representa una fuente de datos abstracta
 * Esta interfaz oculta los detalles de implementación de TypeORM
 */
export interface DataSourceInterface {
  /**
   * Verifica si la conexión está inicializada
   */
  isInitialized(): boolean;

  /**
   * Ejecuta una función dentro de una transacción
   * @param runInTransaction Función a ejecutar dentro de la transacción
   */
  transaction<T>(runInTransaction: (entityManager: EntityManagerInterface) => Promise<T>): Promise<T>;
}

/**
 * Interfaz que representa un administrador de entidades abstracto
 * Esta interfaz oculta los detalles de implementación de TypeORM
 */
export interface EntityManagerInterface {
  /**
   * Guarda una entidad en la base de datos
   * @param entity Entidad a guardar
   */
  save<Entity>(entity: Entity): Promise<Entity>;

  /**
   * Encuentra entidades que coinciden con los criterios especificados
   * @param entityClass Clase de la entidad
   * @param criteria Criterios de búsqueda
   */
  find<Entity>(entityClass: any, criteria?: any): Promise<Entity[]>;

  /**
   * Encuentra una entidad por su ID
   * @param entityClass Clase de la entidad
   * @param id ID de la entidad
   */
  findOne<Entity>(entityClass: any, id: any): Promise<Entity | null>;
}
