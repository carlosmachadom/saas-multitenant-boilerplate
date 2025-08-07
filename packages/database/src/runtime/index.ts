// Runtime exports - optimized for API consumption
export * from './services';
export * from './repositories';
export * from './utils';

// Re-exportar entidades, interfaces y tipos del core para el runtime
export * from '@core/entities';
export * from '@core/interfaces';
export * from '@core/types';

// Re-exportar utilidades específicas
export { schemaExists, createSchema, dropSchema } from '@core/utils/schema.util';
