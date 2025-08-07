import { DataSource } from 'typeorm';
import { 
  SequentialTransactionResult, 
  TransactionCallback, 
  TransactionResult 
} from '@core/interfaces';

/**
 * Ejecuta una transacción en la base de datos.
 * @param dataSource Instancia de DataSource.
 * @param callback Función que recibe un EntityManager y ejecuta operaciones.
 * @returns El resultado de la operación.
 */
export async function withTransaction<T>(
  dataSource: DataSource,
  callback: TransactionCallback<T>,
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const result = await callback(queryRunner.manager);
    await queryRunner.commitTransaction();

    return result;
  } catch (error) {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    throw error;
  } finally {
    if (queryRunner.isReleased === false) {
      await queryRunner.release();
    }
  }
}

/**
 * Ejecuta múltiples transacciones en secuencia.
 * Si una transacción falla, se detiene la ejecución de las siguientes.
 * @param dataSource Instancia de DataSource.
 * @param callbacks Array de funciones que reciben un EntityManager y ejecutan operaciones.
 * @returns Objeto con los resultados de cada transacción.
 */
export async function withSequentialTransactions<T>(
  dataSource: DataSource,
  callbacks: TransactionCallback<T>[],
): Promise<SequentialTransactionResult<T>> {
  const results: TransactionResult<T>[] = [];
  
  for (let i = 0; i < callbacks.length; i++) {
    const callback = callbacks[i];
    if (!callback) {
      results.push({ 
        success: false, 
        error: new Error(`Callback at index ${i} is undefined`), 
        index: i 
      });
      return {
        allSuccessful: false,
        results,
        failedAt: i
      };
    }
    
    try {
      const result = await withTransaction(dataSource, callback);
      results.push({ success: true, result, index: i });
    } catch (error) {
      results.push({ 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error)), 
        index: i 
      });
      return {
        allSuccessful: false,
        results,
        failedAt: i
      };
    }
  }
  
  return {
    allSuccessful: true,
    results
  };
}
