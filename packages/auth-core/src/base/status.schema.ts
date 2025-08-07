import { z } from 'zod';

/**
 * Esquema para entidades que tienen un estado de activo/inactivo.
 */
export const StatusSchema = z.object({
  isActive: z.boolean(),
});
